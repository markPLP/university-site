class MyNotes {
  constructor() {
    this.deleteBtns = document.querySelectorAll('.delete-note');
    this.editBtns = document.querySelectorAll('.edit-note');
    this.events();
  }

  events() {
    this.deleteBtns.forEach(btn => {
      btn.addEventListener('click', (e) => this.deleteNote(e));
    });

    // this.editBtns.forEach(btn => {
    //   btn.addEventListener('click', (e) => this.editNote(e));
    // });
  }

  // methods will go here
  // editNote(e) {
  //   const thisNote = e.currentTarget.parentElement
  //   const thisNoteID = thisNote.dataset.id;
  //   const x = thisNoteID.child.classList.contains('note-title-field');
    
  //   console.log(x);
  // }

  async deleteNote(e) {
    const thisNote = e.currentTarget.parentElement
    const thisNoteID = thisNote.dataset.id;
       
    try { 
        const response = await this.deleteData(universityData.root_url + '/wp-json/wp/v2/note/' + thisNoteID);
        thisNote.classList.add('link-list__list--slide-up');
        setTimeout(function() {
          thisNote.remove();
        }, 400);        

        console.log('Item delete successfully', response);
      } catch(error) {
        console.error('Delete request failed', error);
      } 
  }

  // Define the deleteData method
  async deleteData(url) {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': universityData.nonce, // Adding the nonce header
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json(); // Adjust based on the API's response format
  }
}

export default MyNotes;