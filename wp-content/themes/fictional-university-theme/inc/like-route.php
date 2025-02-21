<?php 

add_action('rest_api_init', 'universityLikeRoutes');

function universityLikeRoutes() {
    // 3 arguments 
  // #1 namespace - unique NAME ie 'university' - V1 is the version of the API
  // #2 route example post,pages,events,professor etc - 'search' is the route
  // #3 array
  register_rest_route('university/v1', 'manageLike', array(
    'methods' => 'POST',
    'callback' => 'createLike', // callback function
    // 'permission_callback' => '__return_true' // Allow public access (for testing)
  ));

  register_rest_route('university/v1', 'manageLike', array(
    //'methods' => 'DELETE',
    'methods' => WP_REST_Server::DELETABLE,
    'callback' => 'deleteLike',
    'permission_callback' => '__return_true', // Temporary for debugging (Restrict later)

  ));
}

function createLike($data) {
//if (current_user_can('edit_posts')) 
// is_user_logged_in() in the context of the REST API is_user_logged_in will return false without NONCE
// apply nonce in the javascript file to make sure the user is logged in
  if(is_user_logged_in()) { 
    $professor = sanitize_text_field($data['professorId']); // get the professorId from the data
                  
    //like does not already exist of this professor by this user
    // check if the liked_professor_id is already liked by the current user
    $existQuery = new WP_Query(array(
      'author' => get_current_user_id(), // get the userID of the current user who liked the post
      'post_type' => 'like',
      'meta_query' => array(
        array(
          'key' => 'liked_professor_id',
          'compare' => 'LIKE',
          'value' => $professor
        )
      ),
    ));
    // $existQuery->found_posts == 0 
    // So if the current user has not already liked the requested professor, then go ahead and create that like post else. Otherwise return this error message.
    // AND get_post_type($professor) == 'professor' - check if the post is a professor post type and get the post id
    if($existQuery->found_posts == 0 AND get_post_type($professor) == 'professor') {

      // create new like post
      // return the post id of the created like
        return wp_insert_post(array(
          'post_type' => 'like',
          'post_status' => 'publish',
          'post_title' => get_the_title($professor), // get the title of the professor post
          'meta_input' => array(
            'liked_professor_id' => $professor  // custom field - value
          )
        ));

    } else {
      die("Invalid professor ID.");
    }
    
  } else {
    die("Only logged in users can create a like.");
  }
}

function deleteLike($data) {
  // $data['like'] - get the like id from the data 
  $likeId = sanitize_text_field($data['like']); // sanitize the like id
  
  // only if the current user is the author of the like post and the post type is 'like'
  if (get_current_user_id() == get_post_field('post_author', $likeId) AND get_post_type($likeId) == 'like') {
    // second argument boolean is if you want to send it to the trash first,
    // or if you just want to skip the trash and completely delete it.
    // 'true' here is to skip the trash and completely delete it.
    wp_delete_post($likeId, true);

    return 'Congrats, like deleted.';
  } else {
    die("You do not have permission to delete that.");
  }
}