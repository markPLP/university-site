class MyNotes {
  constructor() {
    this.deleteBtns = document.querySelectorAll('.delete-note');
    this.editBtns = document.querySelectorAll('.edit-note');
    this.events();
  }

  // EVENTS will go here
  events() {
    this.deleteBtns.forEach(btn => {
      btn.addEventListener('click', (e) => this.deleteNote(e));
    });

    this.editBtns.forEach(btn => {
      btn.addEventListener('click', (e) => this.editNote(e));
    });
  }

  // METHODS will go here
  editNote(e) {
    const thisNote = e.currentTarget.parentElement;
    console.log(thisNote.dataset.id);

    if(thisNote.getAttribute('data-editable') === 'true') {
      this.makeNoteReadonly(thisNote); // use param 'thisNote' to use the global selector
    } else {
      this.makeNoteEditable(thisNote); // use param 'thisNote' to use the global selector
    }    
  }

  makeNoteEditable(thisNote) {
   // const thisNote = e.currentTarget.parentElement;
    thisNote.classList.add('link-list--active');
    const cancelLink = thisNote.querySelector('.edit-note');
    
    if(cancelLink) {
      cancelLink.innerHTML = `<i class="fa fa-times" aria-hidden="true"></i> Cancel`;
    }
    // set fields to be editable
    ['note-title-field', 'note-body-field'].forEach(className => {
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
    
    if(cancelLink) {
      cancelLink.innerHTML = `<i class="fa fa-pencil" aria-hidden="true"></i> Edit`;
    }
    // set to read-only
    ['note-title-field', 'note-body-field'].forEach(className => {
        const field = thisNote.querySelector(`.${className}`);
        field.removeAttribute('readonly');
        field.setAttribute('readonly', 'readonly');
    });
    thisNote.setAttribute('data-editable', 'false')
  }

  // PROMISE - deletenote function
  async deleteNote(e) {  
    const thisNote = e.currentTarget.parentElement;
    const thisNoteID = thisNote.dataset.id;
    const url = universityData.root_url + '/wp-json/wp/v2/note/' + thisNoteID;
  
    try { 
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': universityData.nonce,
        },
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      thisNote.classList.add('link-list__list--slide-up');
      setTimeout(() => {
        thisNote.remove();
      }, 400);        
  
      console.log('Item deleted successfully', await response.json());
    } catch(error) {
      console.error('Delete request failed', error);
    } 
  }
  
  // async deleteNote(e) {  
  //   const thisNote = e.currentTarget.parentElement
  //   const thisNoteID = thisNote.dataset.id;
       
  //   try { 
  //       const response = await this.deleteData(universityData.root_url + '/wp-json/wp/v2/note/' + thisNoteID);
  //       thisNote.classList.add('link-list__list--slide-up');
  //       setTimeout(function() {
  //         thisNote.remove();
  //       }, 400);        

  //       console.log('Item delete successfully', response);
  //     } catch(error) {
  //       console.error('Delete request failed', error);
  //     } 
  // }

  // // PROMISE -  Define the deleteData method
  // async deleteData(url) {
  //   const response = await fetch(url, {
  //     method: 'DELETE',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'X-WP-Nonce': universityData.nonce, // Adding the nonce header
  //     },
  //   });

  //   if (!response.ok) {
  //     throw new Error('Network response was not ok');
  //   }
    
  //   return await response.json(); // Adjust based on the API's response format
  // }

  
}

export default MyNotes;