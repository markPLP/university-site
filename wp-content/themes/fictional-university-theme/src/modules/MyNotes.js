import axios from 'axios';

class MyNotes {
  constructor() {
    // wrap in if statement - run events in #my-notes DOM only
    if (document.querySelector('#my-notes')) {
      this.myNoteWrapper = document.querySelector('#my-notes');
      this.deleteBtns = document.querySelectorAll('.delete-note');
      this.editBtns = document.querySelectorAll('.edit-note');
      this.updateBtns = document.querySelectorAll('.update-note');
      this.createBtn = document.querySelector('.submit-note');
      this.newNoteTitleField = document.querySelector('.new-note-title');
      this.newNoteBodyField = document.querySelector('.new-note-body');
      this.noteLimitMessage = document.querySelector('.note-limit-message');
      this.noteEmptyMessage = document.querySelector('.note-empty-message');
      this.events();
    }
  }

  // EVENTS will go here
  events() {
    // Event delegation to manage actions
    this.myNoteWrapper.addEventListener('click', (e) => {
      const element = e.target;
      if (
        element.classList.contains('edit-note') ||
        e.target.classList.contains('fa-trash-o')
      )
        this.editNote(e); // use this.editNote to refer to the class method
      if (
        element.classList.contains('delete-note') ||
        e.target.classList.contains('fa-pencil') ||
        e.target.classList.contains('fa-times')
      )
        this.deleteNote(e);
      if (
        element.classList.contains('update-note') ||
        e.target.classList.contains('fa-arrow-right')
      )
        this.updateNote(e);
    });

    this.createBtn.addEventListener('click', this.createNote.bind(this));
  }

  // METHODS will go here
  editNote(e) {
    const thisNote = e.target.parentElement;
    thisNote.dataset.id;
    //  console.log(thisNote.dataset.id);
    this.noteEmptyMessage.classList.remove('active');
    this.noteLimitMessage.classList.remove('active');

    if (thisNote.getAttribute('data-editable') === 'true') {
      this.makeNoteReadonly(thisNote); // use param 'thisNote' to use the global selector
    } else {
      this.makeNoteEditable(thisNote); // use param 'thisNote' to use the global selector
    }
  }

  makeNoteEditable(thisNote) {
    // const thisNote = e.currentTarget.parentElement;
    thisNote.classList.add('link-list--active');
    const cancelLink = thisNote.querySelector('.edit-note');

    if (cancelLink) {
      cancelLink.innerHTML = `<i class="fa fa-times" aria-hidden="true"></i> Cancel`;
    }
    // set fields to be editable
    ['note-title-field', 'note-body-field'].forEach((className) => {
      const field = thisNote.querySelector(`.${className}`);
      field.removeAttribute('readonly');
      field.setAttribute('read', '');
    });
    thisNote.setAttribute('data-editable', 'true');
  }

  makeNoteReadonly(thisNote) {
    // const thisNote = e.currentTarget.parentElement;
    thisNote.classList.remove('link-list--active');
    const cancelLink = thisNote.querySelector('.edit-note');

    if (cancelLink) {
      cancelLink.innerHTML = `<i class="fa fa-pencil" aria-hidden="true"></i> Edit`;
    }
    // set to read-only
    ['note-title-field', 'note-body-field'].forEach((className) => {
      const field = thisNote.querySelector(`.${className}`);
      field.removeAttribute('readonly');
      field.setAttribute('readonly', 'readonly');
    });
    thisNote.setAttribute('data-editable', 'false');
  }

  // async/await - deletenote function
  async deleteNote(e) {
    this.noteEmptyMessage.classList.remove('active');
    this.noteLimitMessage.classList.remove('active');
    const thisNote = e.target.parentElement;
    const thisNoteID = thisNote.dataset.id;
    const url = universityData.root_url + '/wp-json/wp/v2/note/' + thisNoteID;

    try {
      const response = await axios.delete(url, {
        // method: 'DELETE', // only use this if you're not using axios
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': universityData.nonce, // nonce is required here for authentication
        },
      });

      // ONLY USE THIS IF NOT USING AXIOS
      // if (!response.ok) {
      //   throw new Error('Network response was not ok');
      // }

      if (response.status !== 200) {
        throw new Error('Network response was not ok');
      }

      // Add class and await the delay before removing the element
      thisNote.classList.add('link-list__list--slide-up');
      document.querySelector('.note-limit-message').classList.remove('active');
      await new Promise((resolve) => setTimeout(resolve, 400));
      thisNote.remove();

      // console.log('Item deleted successfully', await response.json());
      console.log('Item deleted successfully');
    } catch (error) {
      console.error('Delete request failed', error);
    }
  }

  // async/await - updateNote function
  async updateNote(e) {
    const thisNote = e.target.parentElement;
    const thisNoteID = thisNote.dataset.id;
    const url = universityData.root_url + '/wp-json/wp/v2/note/' + thisNoteID;

    // get the updated title and content
    let ourUpdatedPost = {
      title: thisNote.querySelector('.note-title-field').value,
      content: thisNote.querySelector('.note-body-field').value,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(ourUpdatedPost), // Pass the update data in the body and stringify it
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': universityData.nonce, // nonce is required here for authentication
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      this.makeNoteReadonly(thisNote);
      console.log('Item updated successfully', await response.json());
    } catch (error) {
      console.error('update request failed', error);
    }
  }

  // async/await - createNote function

  async createNote(e) {
    e.preventDefault();
    const url = universityData.root_url + '/wp-json/wp/v2/note/';
    //   this.noteEmptyMessage.classList.remove('active');
    this.noteEmptyMessage.classList.remove('active');
    const showMessage = document.querySelector('.note-empty-message');

    if (!this.newNoteTitleField.value || !this.newNoteBodyField.value) {
      showMessage.classList.add('active');
      // alert('Please fill in the title field');
      return;
    }

    const ourUpdatedPost = {
      title: this.newNoteTitleField.value,
      content: this.newNoteBodyField.value,
      status: 'private', // by default this is draft
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(ourUpdatedPost), // Pass the update data in the body and stringify it
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': universityData.nonce, // nonce is required here for authentication
        },
      });

      const contentType = response.headers.get('Content-Type');

      // log this as text for unknown error/data format
      const responseText = await response.text(); // Get the response as text
      const showMessage = document.querySelector('.note-limit-message');
      // Check if the response text is the note limit message
      if (responseText === 'You have reached your note limit') {
        showMessage.classList.add('active');
        throw new Error(responseText); // Stop further processing
      }

      // Proceed to parse if it's JSON
      if (contentType && contentType.includes('application/json')) {
        const responseData = JSON.parse(responseText); // Parse JSON

        showMessage.classList.remove('active');
        const noteContent = responseData.content.rendered.replace(
          /<\/?p>/g,
          ''
        );
        const newListNote = document.createElement('li');
        newListNote.dataset.id = responseData.id;
        let titleReplace = responseData.title.rendered;
        if (titleReplace.startsWith('Private: ')) {
          titleReplace = titleReplace.replace('Private: ', '');
        }

        newListNote.innerHTML = `
                <input readonly="" class="note-title-field" value="${titleReplace}">
                <span class="edit-note"><i class="fa fa-pencil" aria-hidden="true"></i> Edit</span>
                <span class="delete-note"><i class="fa fa-trash-o" aria-hidden="true"></i> Delete</span>
                <textarea readonly class="note-body-field">${noteContent}</textarea>
                <span class="update-note btn btn--blue btn--small"><i class="fa fa-arrow-right" aria-hidden="true"></i> Save</span>
            `;
        this.myNoteWrapper.prepend(newListNote);

        // Clear the input fields after prepending
        this.newNoteTitleField.value = '';
        this.newNoteBodyField.value = '';
      } else {
        // If not JSON, treat it as a plain text error
        console.error('Unexpected non-JSON response:', responseText);
        throw new Error(responseText);
      }
    } catch (error) {
      console.error('Create request failed', error.message || error);
    }
  }
}

export default MyNotes;
