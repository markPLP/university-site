import $ from "jquery"

class Search {
  // 1. describe and create/initiate our object
  constructor() {
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
        this.typingTimer = setTimeout(this.getResults.bind(this), 751) // .bind(this) here access the properties/methods from getResults func
      } else {
        this.resultsDiv.html('');
        this.isSpinnerVisible = false;
      }
    }
    this.previousValue = this.searchField.val();
  }

  getResults() {
    $.getJSON('http://university-site.local/wp-json/wp/v2/posts?search=', function() {

    });
   // this.resultsDiv.html("helo sxear");
    this.isSpinnerVisible = false;
  }

  openOverlay() {
    this.searchOverlay.addClass("search-overlay--active");
    $("body").addClass('body-no-scroll');
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
}

export default Search
