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
  // $data args to recreate the URL parameter using the word 'term' 
  // university/v1/search?term=
  // NAMESPACE/v1/ROUTE?URLPARAMETER

  $mainQuery = new WP_Query(array(
    // search on all post type based on keyword(s)
    // make an array of all post_type
    'post_type' => array('post', 'page', 'professor', 'event', 'campus', 'program', 'note'),
    's' => sanitize_text_field($data['term']) // 's' is for search // the word 'term' could be anything
    // use sanitize_text_field for extra security measures for SQL injection
  ));

  //create empty array of all post_type
  // push this arrays in REST API for searching
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
        'permalink' => get_the_permalink(),
        'postType' => get_post_type(),
        'authorName' => get_the_author()
      ));
    }
    // for professors
    if(get_post_type() == 'professor') {
      array_push($results['professors'], array(
        'title' => get_the_title(),
        'permalink' => get_the_permalink(),
        'image' => get_the_post_thumbnail_url(0, 'professorLandscape')
      ));
    }
    // for events
    if(get_post_type() == 'event') {
      $eventDate = new DateTime(get_field('event_date'));
      $description = null;
      if (has_excerpt()) {
        $description = get_the_excerpt();
      } else {
        $description = wp_trim_words(get_the_content(), 18);
      }

      array_push($results['events'], array(
        'title' => get_the_title(),
        'permalink' => get_the_permalink(),
        'month' => $eventDate->format('M'),
        'day' => $eventDate->format('d'),
        'description' => $description
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

      $relatedCampus = get_field('related_campus');
      // only show if there is/are related campus/es
      if ($relatedCampus) {
        foreach($relatedCampus as $campus) {
          array_push($results['campuses'], array(
            'title' => get_the_title($campus), // the title here should point to campus hence get_the_title($campus)
            'permalink' => get_the_permalink($campus)
          ));
        }
      }

      array_push($results['programs'], array(
        'title' => get_the_title(),
        'permalink' => get_the_permalink(),
        'id' => get_the_ID()
      ));
    }
  }

  // only show related professors if programs is a valid search item(program ex. biology, math, science etc) 
  if ($results['programs']) {
    // loop thru all programs ex biolog, math, science etc
    $programsMetaQuery = array('relation' => 'OR');

    foreach($results['programs'] as $item) {
      array_push($programsMetaQuery, array(
        'key' => 'related_programs',
        'compare' => 'LIKE', // 'LIKE' number/string etc
        'value' => '"' . $item['id'] . '"' // 10 is the ID for program biology RELATED SEARCH
      ));
    }

    $programRelationQuery = new WP_Query(array(
      'post_type' => array('professor', 'event'),
      'meta_query' => $programsMetaQuery
    ));

    while($programRelationQuery->have_posts()) {
      $programRelationQuery->the_post();
      // relation query for professor
      if(get_post_type() == 'professor') {
        array_push($results['professors'], array(
          'title' => get_the_title(),
          'permalink' => get_the_permalink(),
          'image' => get_the_post_thumbnail_url(0, 'professorLandscape')
        ));
      }

      // relation query for  events
      if(get_post_type() == 'event') {
        $eventDate = new DateTime(get_field('event_date'));
        $description = null;
        if (has_excerpt()) {
          $description = get_the_excerpt();
        } else {
          $description = wp_trim_words(get_the_content(), 18);
        }

        array_push($results['events'], array(
          'title' => get_the_title(),
          'permalink' => get_the_permalink(),
          'month' => $eventDate->format('M'),
          'day' => $eventDate->format('d'),
          'description' => $description
        ));
      }
    }

    // array_unique will remove duplicates on search result 
    // SORT_REGULAR check in every array for duplicates 
    //array_values removes the numerical keys provided by array_unique function
    $results['professors'] = array_values(array_unique($results['professors'], SORT_REGULAR));
    $results['events'] = array_values(array_unique($results['events'], SORT_REGULAR));
  }

  return $results;

}
