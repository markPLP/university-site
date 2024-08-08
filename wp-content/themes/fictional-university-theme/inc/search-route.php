<?php

add_action('rest_api_init', 'universityRegisterSearch');

function universityRegisterSearch() {
  // 3 arguments 
  // #1 namespace - unique NAME
  // #2 route example post,pages,events,professor etc 
  // #3 array
  register_rest_route('university/v1', 'search', array(
    // method same with CRUD
    'method' => WP_REST_SERVER::READABLE, //  same with 'GET' - safer option 
    'callback' => 'universitySearchResults'
  ));
}

function universitySearchResults() {
  return 'congrats, Mark is cooloi!';
}
