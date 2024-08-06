import $ from "jquery"

class Search {
  // 1. describe and create/initiate our object
  constructor() {
    //this.searchHTML;
    this.resultsDiv = $("#search-overlay__results");
    this.openButton = $(".js-search-trigger");
    this.closeButton = $(".search-overlay__close");
    this.searchOverlay = $(".search-overlay");
    this.searchField = $("#search-term");
    this.events();
    this.isOverlayOpen = false;
    this.isSpinnerVisible = false;
    this.typingTimer;
    this.previousValue;
    
  }

  // 2. events
  events() {
    this.openButton.on("click", this.openOverlay.bind(this));
    this.closeButton.on("click", this.closeOverlay.bind(this));
    $(document).on("keydown", this.keyPressDispathcher.bind(this));
    this.searchField.on("keyup", this.typingLogic.bind(this));
  }

  // 3. methods (function, action...)
  typingLogic() {
    if (this.searchField.val() != this.previousValue) {
      clearInterval(this.typingTimer);
      if (this.searchField.val()) {
        if(!this.isSpinnerVisible) {
          this.resultsDiv.html('<div class="spinner-loader"></div>');
          this.isSpinnerVisible = true;
        }
        this.typingTimer = setTimeout(this.getResults.bind(this), 750) // .bind(this) here access the properties/methods from getResults func
      } else {
        this.resultsDiv.html('');
        this.isSpinnerVisible = false;
      }
    }
    this.previousValue = this.searchField.val();
  }

  getResults() {
    // use arrow function instead of anonymous function to bind this on the main object
    $.getJSON(universityData.root_url + '/wp-json/wp/v2/posts?search=' + this.searchField.val(), posts => { 
        this.resultsDiv.html(`<h2 class="search-overlay__section-title">General information</h2>
          ${posts.length ? '<ul class="link-list  min-list">' : '<p>No general information available</p>' }
            ${posts.map(item => `<li><a href="${item.link}">${item.title.rendered}</a></li>`).join('')}
          ${posts.length ? '</ul>' : '' }
        `);
    });
    
    this.isSpinnerVisible = false; // load spinner icon after another search 
  }

  openOverlay() {
    this.searchOverlay.addClass("search-overlay--active");
    $("body").addClass('body-no-scroll');
    setTimeout(() => this.searchField.focus(), 301);
    this.isOverlayOpen = true;
  }

  closeOverlay() {
    this.searchOverlay.removeClass("search-overlay--active");
    $("body").removeClass('body-no-scroll');
  }

  keyPressDispathcher(e) {
    //  !$("input, textarea").is(":focus") does not open search bar 
    //when pressing "s" key
    if(e.keyCode === 83 && !this.isOverlayOpen && !$("input, textarea").is(":focus")) { 
      this.openOverlay();
    } else if (e.keyCode === 27 && !this.isOverlayOpen) {
      this.closeOverlay();
    } else {
      return;
    }
  }

  // searchHTML() {
  //   $("body").append(`
  //       <div class="search-overlay">
  //         <div class="search-overlay__top">
  //           <div class="container">
  //             <i class="fa fa-search search-overlay__icon" aria-hidden="true"></i>
  //             <input type="text" class="search-term" placeholder="what are you looking for?" id="search-term">
  //             <i class="fa fa-window-close search-overlay__close" aria-hidden="true"></i>
  //           </div>
  //           <div class="container">
  //             <div id="search-overlay__results">
  //             </div>
  //           </div>
  //         </div>
  //       </div>`
  //   );
  // }
}

export default Search
