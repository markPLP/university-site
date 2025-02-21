import axios from 'axios';
import Toastify from 'toastify-js';

function showToast(message, type = 'success') {
  Toastify({
    text: message,
    duration: 3000,
    close: true,
    gravity: 'bottom',
    position: 'right',
    backgroundColor: type === 'error' ? 'red' : 'green',
  }).showToast();
}

class Like {
  constructor() {
    this.likeBox = document.querySelector('.like-box');

    if (this.likeBox) {
      this.likeCount =
        parseInt(this.likeBox.querySelector('.like-count')?.innerHTML) || 0;
      this.exists = this.likeBox.getAttribute('data-exists') === 'yes';
      this.profId = this.likeBox.getAttribute('data-professor') || null;
      this.likedId = this.likeBox.getAttribute('data-like') || 0;

      if (!this.profId)
        console.warn('data-professor attribute is missing on .like-box');
    } else {
      console.warn('like-box element not found in the DOM.');
    }

    // bind THIS to all function
    this.createLike = this.createLikeFunc.bind(this);
    this.deleteLike = this.deleteLikeFunc.bind(this);

    // add event listeners
    if (this.likeBox) {
      this.likeBox.addEventListener('click', () => {
        const likeCountElement = this.likeBox.querySelector('.like-count');

        if (this.exists) {
          this.deleteLike(this.likedId);
          this.likeBox.setAttribute('data-exists', 'no');
          this.exists = false; // Update state
          this.likedId = this.likeBox.setAttribute('data-like', '');
          this.likeCount = Math.max(0, this.likeCount - 1); // Prevent negative values
        } else {
          if (!universityData.nonce) {
            alert('Only login users can like a professor.');
            return;
          }
          this.createLike(this.profId);
          this.likeCount++;
          this.likeBox.setAttribute('data-exists', 'yes');
          this.exists = true; // Update state
        }

        if (likeCountElement) {
          likeCountElement.innerHTML = this.likeCount;
        }
      });
    }
  }

  async createLikeFunc(profId) {
    try {
      const response = await axios.post(
        universityData.root_url + '/wp-json/university/v1/manageLike',
        // professorId should match in function createLike($data) from like-route.php file
        // $professor = sanitize_text_field($data['professorId']);
        { professorId: profId },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': universityData.nonce, // nonce is required here for authentication
          },
        }
      );
      // Update the data-like attribute and the likedId property
      this.likeBox.setAttribute('data-like', response.data);
      this.likedId = response.data;
      showToast('Thanks for liking this professor!');
    } catch (error) {
      console.error('Error creating like:', error);
    }
  }

  async deleteLikeFunc(likedId) {
    showToast('You unliked this professor!', 'error');
    if (!likedId) {
      console.error('Error: likedId is missing.');
      return;
    }

    try {
      const response = await axios.delete(
        universityData.root_url + '/wp-json/university/v1/manageLike',
        {
          data: { like: likedId }, // Correctly passing the data
          headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': universityData.nonce,
          },
        }
      );

      this.likeBox.setAttribute('data-like', '');
      this.likedId = 0; // or an empty string ''
    } catch (error) {
      console.error('Error deleting like:', error);
    }
  }
}

export default Like;
