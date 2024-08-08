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


// create raw JSON data
function universitySearchResults($data) {
  // $data args to recreate/add URL using the word 'term' 
  // university/v1/search?term=
  
  $mainQuery = new WP_Query(array(
    // make an array of all post_type
    'post_type' => array('post', 'page', 'professor', 'event', 'campus', 'program'),
    's' => sanitize_text_field($data['term']) // 's' is for search // the word 'term' could be anything
    // use sanitize_text_field for extra security measures for SQL injection
  ));

  //create empty array of all post_type
  $results = array(
    'generalInfo' => array(),
    'professors' => array(),
    'events' => array(),
    'campuses' => array(),
    'programs' => array()
  ); 

  //wordpress loop
  while($mainQuery->have_posts()) {
    $mainQuery->the_post();
    // for general Info
    if(get_post_type() == 'post' OR get_post_type() == 'page') {
      array_push($results['generalInfo'], array(
        'title' => get_the_title(),
        'permalink' => get_the_permalink()
      ));
    }
    // for professors
    if(get_post_type() == 'professor') {
      array_push($results['professors'], array(
        'title' => get_the_title(),
        'permalink' => get_the_permalink()
      ));
    }
    // for events
    if(get_post_type() == 'event') {
      array_push($results['events'], array(
        'title' => get_the_title(),
        'permalink' => get_the_permalink()
      ));
    }
    // for campuses
    if(get_post_type() == 'campus') {
      array_push($results['campuses'], array(
        'title' => get_the_title(),
        'permalink' => get_the_permalink()
      ));
    }
    // for programs
    if(get_post_type() == 'program') {
      array_push($results['programs'], array(
        'title' => get_the_title(),
        'permalink' => get_the_permalink()
      ));
    }
  }
  return $results;

}
