<?php

add_action('rest_api_init', 'universityRegisterSearch');

function universityRegisterSearch() {
  // register_rest_route to create custom REST API endpoint
  // 3 arguments 
  // #1 namespace - unique NAME ie 'university' - V1 is the version of the API
  // #2 route example post,pages,events,professor etc - 'search' is the route
  // #3 array
  register_rest_route('university/v1', 'search', array(
    // method same with CRUD
    //'method' => 'GET',
    // WP_REST_SERVER::READABLE use this instead of 'GET' for security reasons
    'method' => WP_REST_SERVER::READABLE, //  same with 'GET' - safer option 
    'callback' => 'universitySearchResults' // callback function
  ));
}

// CREATE A ROUTE - REST API endpoint
// create raw JSON data - wordpress will convert php data to JSON data
function universitySearchResults($data) {
  // $data args to recreate the URL parameter using the word 'term' 
  // university/v1/search?term=
  // NAMESPACE/v1/ROUTE?URLPARAMETER

  $mainQuery = new WP_Query(array(
    // search on all post type based on keyword(s)
    // make an array of all post_type
    'post_type' => array('post', 'page', 'professor', 'event', 'campus', 'program', 'note'),
    // s is for search
    // the word 'term' could be anything
    's' => sanitize_text_field($data['term']) // 's' is for search // the word 'term' could be anything
    // use sanitize_text_field for extra security measures for SQL injection
    // example wp-json/university/v1/search?term=meow
  ));

  //create empty array of all post_type
  // separate search results for each post type
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
      // push the array to the empty array results
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
      // logic to get the related campuses that are related to the program
      // get_field('related_campus') is a custom field
      $relatedCampus = get_field('related_campus');
      // loop thru all related campus
      // if statement if related_camus is not empty
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
        'id' => get_the_ID() // add this for relationship query
      ));
    }
  }

  // THIS SEARCH LOGIC IS TO INCLUDE PROGRAMS BASED ON THIER RELATIONSHIP TO PROFESSORS, EVENTS AND CAMPUSES
  // only show related professors if programs is a valid search item(program ex. biology, math, science etc) 
  if ($results['programs']) {

    // WORKING BACKWARDS - HARD CODED
      // $programRelationQuery = new WP_Query(array(
      //   'post_type' => array('professor'),
      //   'meta_query' => array(
      //     array(
      //       // key custom field related_programs
      //       'key' => 'related_programs',
      //       // compare LIKE number/string etc 
      //       'compare' => 'LIKE',
      //       // value is the ID of the program
      //       //'value' => '"10"' // 10 is the ID for program biology RELATED SEARCH - WORKING BACKWARDS - HARD CODED
      //       'value' => '"' . $results['programs'][0]['id'] . '"'
      //     ),
      //      array(
      //       'key' => 'related_programs',
      //       'compare' => 'LIKE',
      //       'value' => '"' . $results['programs'][1]['id'] . '"'
      //     ),
      //     array(
      //       'key' => 'related_programs',
      //       'compare' => 'LIKE',
      //       'value' => '"' . $results['programs'][2]['id'] . '"'
      //     ),
      //   )
      // ));
      // while($programRelationQuery->have_post()) {
      //   $programRelationQuery->the_post();
      //   if(get_post_type() == 'professor') {
      //     array_push($results['professors'], array(
      //       'title' => get_the_title(),
      //       'permalink' => get_the_permalink(),
      //       'image' => get_the_post_thumbnail_url(0, 'professorLandscape')
      //     ));
      //   }
      // }


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
      // search a custom field via meta_query
      'meta_query' => $programsMetaQuery
    ));

    // wordpress loop
    while($programRelationQuery->have_posts()) {
      $programRelationQuery->the_post();
      // relation query for professor
      if(get_post_type() == 'professor') {
        array_push($results['professors'], array(
          'title' => get_the_title(),
          'permalink' => get_the_permalink(),
          'image' => get_the_post_thumbnail_url(0, 'professorLandscape') // 0 is the current post, 'professorLandscape' is the image size
        ));
      }

      // relation query for  events
      if(get_post_type() == 'event') {
        // get the date of the event in custom field 'event_date'
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
    //array_values removes the numerical keys(key-value pair) provided by array_unique function
    $results['professors'] = array_values(array_unique($results['professors'], SORT_REGULAR));
    $results['events'] = array_values(array_unique($results['events'], SORT_REGULAR));
  }

  return $results;

}
