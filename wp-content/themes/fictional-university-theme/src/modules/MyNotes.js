class MyNotes {
  constructor() {
    this.myNoteWrapper = document.querySelector('#my-notes');
    this.deleteBtns = document.querySelectorAll('.delete-note');
    this.editBtns = document.querySelectorAll('.edit-note');
    this.updateBtns = document.querySelectorAll('.update-note');
    this.createBtn = document.querySelector('.submit-note');
    this.newNoteTitleField = document.querySelector('.new-note-title');
    this.newNoteBodyField = document.querySelector('.new-note-body');
    this.events();
  }

  // EVENTS will go here
  events() {

    this.myNoteWrapper.addEventListener('click', (e) => {
      const element = e.target;
      // edit note
      if(element.classList.contains('edit-note')) {
        this.editNote(e); // use this.editNote to refer to the class method
      }
      // delete note
      if(element.classList.contains('delete-note')) {
        this.deleteNote(e); 
      }
      // update note
      if(element.classList.contains('update-note')) {
        this.updateNote(e); 
      }
    });

    this.createBtn.addEventListener('click', this.createNote.bind(this));
  }

  // METHODS will go here
  editNote(e) {
    const thisNote = e.target.parentElement;
    thisNote.dataset.id
    console.log(thisNote);
    
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

  // async/await - deletenote function
  async deleteNote(e) {  
    const thisNote = e.target.parentElement;
    const thisNoteID = thisNote.dataset.id;
    const url = universityData.root_url + '/wp-json/wp/v2/note/' + thisNoteID;
  
    try { 
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': universityData.nonce, // nonce is required here for authentication 
        },
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      // Add class and await the delay before removing the element
      thisNote.classList.add('link-list__list--slide-up');
      await new Promise(resolve => setTimeout(resolve, 400));
      thisNote.remove();       
  
      console.log('Item deleted successfully', await response.json());
    } catch(error) {
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
      'title' : thisNote.querySelector('.note-title-field').value,
      'content' : thisNote.querySelector('.note-body-field').value
    }

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

    } catch(error) {
      console.error('update request failed', error);
    } 
  }  

  // async/await - createNote function
  async createNote(e) {  
    const url = universityData.root_url + '/wp-json/wp/v2/note/';

    const ourUpdatedPost = {
      'title' : this.newNoteTitleField.value,
      'content' : this.newNoteBodyField.value,
      'status' : 'publish' // by default this is draft
    }

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

      const responseData = await response.json(); // Parse the JSON response

      console.log('Item created successfully', responseData);
      
      const noteContent = responseData.content.rendered.replace(/<\/?p>/g, '');
      const newListNote = document.createElement('li');
      newListNote.dataset.id = responseData.id;
      newListNote.innerHTML = `
          <input readonly="" class="note-title-field" value="${responseData.title.rendered}">
          <span class="edit-note"><i class="fa fa-pencil" aria-hidden="true"></i> Edit</span>
          <span class="delete-note"><i class="fa fa-trash-o" aria-hidden="true"></i> Delete</span>
          <textarea readonly class="note-body-field">${noteContent}</textarea>
          <span class="update-note btn btn--blue btn--small"><i class="fa fa-arrow-right" aria-hidden="true"></i> Save</span>
      `;
      this.myNoteWrapper.prepend(newListNote);
      // clear after prepend
      this.newNoteTitleField.value = '';
      this.newNoteBodyField.value = '';
    } catch(error) {
      console.error('Create request failed', error);
    } 
  }  
}

export default MyNotes;