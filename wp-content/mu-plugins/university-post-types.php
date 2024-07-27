<?php 

// function university_post_types() {
//   register_post_type('event', array(
//     'public' => true,
//     'menu_icon' => 'dashicons-calendar',
//     'labels' => array(
//       'name' => 'Events',
//       'add_new_item' => 'Add New Event',
//       'edit_item' => 'Edit Event',
//       'all_items' => 'All Events',
//       'singular_name' => 'Event'
//     )
//   ));
// }

// function university_post_types() {
//   register_post_type('event', array(
//       'public' => true,
//       'menu_icon' => 'dashicons-calendar',
//       'labels' => array(
//           'name' => __('Events', 'university-site'),
//           'singular_name' => __('Event', 'university-site'),
//           'menu_name' => __('Events', 'university-site'),
//           'name_admin_bar' => __('Event', 'university-site'),
//           'add_new' => __('Add New Event', 'university-site'),
//           'add_new_item' => __('Add New Event', 'university-site'),
//           'new_item' => __('New Event', 'university-site'),
//           'edit_item' => __('Edit Event', 'university-site'),
//           'view_item' => __('View Event', 'university-site'),
//           'all_items' => __('All Events', 'university-site'),
//           'search_items' => __('Search Events', 'university-site'),
//           'parent_item_colon' => __('Parent Events:', 'university-site'),
//           'not_found' => __('No events found.', 'university-site'),
//           'not_found_in_trash' => __('No events found in Trash.', 'university-site'),
//           'featured_image' => __('Event Cover Image', 'university-site'),
//           'set_featured_image' => __('Set cover image', 'university-site'),
//           'remove_featured_image' => __('Remove cover image', 'university-site'),
//           'use_featured_image' => __('Use as cover image', 'university-site'),
//           'archives' => __('Event archives', 'university-site'),
//           'insert_into_item' => __('Insert into event', 'university-site'),
//           'uploaded_to_this_item' => __('Uploaded to this event', 'university-site'),
//           'filter_items_list' => __('Filter events list', 'university-site'),
//           'items_list_navigation' => __('Events list navigation', 'university-site'),
//           'items_list' => __('Events list', 'university-site'),
//       ),
//       'supports' => array('title', 'editor', 'thumbnail', 'excerpt'),
//       'has_archive' => true,
//       'rewrite' => array('slug' => 'events'), // rewrite the slug to be plural
//       'show_in_rest' => true, // Enable Gutenberg editor support
//   ));

function university_post_types() {
  // Campus Post Type
  register_post_type('campus', array(
    'show_in_rest' => true,
    'supports' => array('title', 'editor', 'excerpt'),
    'rewrite' => array('slug' => 'campuses'),
    'has_archive' => true,
    'public' => true,
    'labels' => array(
      'name' => 'Campuses',
      'add_new_item' => 'Add New Campus',
      'edit_item' => 'Edit Campus',
      'all_items' => 'All Campus',
      'singular_name' => 'Campus'
    ),
    'menu_icon' => 'dashicons-location-alt'
  ));

  // Event Post Type
  register_post_type('event', array(
    'show_in_rest' => true,
    'supports' => array('title', 'editor', 'excerpt'),
    'rewrite' => array('slug' => 'events'),
    'has_archive' => true,
    'public' => true,
    'labels' => array(
      'name' => 'Events',
      'add_new_item' => 'Add New Event',
      'edit_item' => 'Edit Event',
      'all_items' => 'All Events',
      'singular_name' => 'Event'
    ),
    'menu_icon' => 'dashicons-calendar'
  ));

  // Program Post Type
  register_post_type('program', array(
    'show_in_rest' => true,
    'supports' => array('title', 'editor'),
    'rewrite' => array('slug' => 'programs'),
    'has_archive' => true,
    'public' => true,
    'labels' => array(
      'name' => 'Programs',
      'add_new_item' => 'Add New Program',
      'edit_item' => 'Edit Program',
      'all_items' => 'All Programs',
      'singular_name' => 'Program'
    ),
    'menu_icon' => 'dashicons-awards'
  ));

  // Professor Post Type
  register_post_type('professor', array(
    'show_in_rest' => true,
    'supports' => array('title', 'editor', 'thumbnail'),
    'public' => true,
    'labels' => array(
      'name' => 'Professors',
      'add_new_item' => 'Add New Professor',
      'edit_item' => 'Edit Professor',
      'all_items' => 'All Professors',
      'singular_name' => 'Professor'
    ),
    'menu_icon' => 'dashicons-welcome-learn-more'
  ));
}

add_action('init', 'university_post_types');

