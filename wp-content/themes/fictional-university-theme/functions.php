<?php

//require get_template_directory() . '/inc/search-route.php';
require get_theme_file_path('/inc/search-route.php');

// add custom field REST API
function university_custom_rest() {
  register_rest_field('post', 'authorName', array(
    'get_callback' => function() { return get_the_author(); }
  ));
}

add_action('rest_api_init', 'university_custom_rest');

// custom banner
function pageBanner($args = NULL) {
  
  if (!isset($args['title'])) {
    $args['title'] = get_the_title();
  }

  if (!isset($args['subtitle'])) {
    $args['subtitle'] = get_field('page_banner_subtitle');
  }

  if (!isset($args['photo'])) {
    if (get_field('page_banner_background_image') AND !is_archive() AND !is_home() ) {
      $args['photo'] = get_field('page_banner_background_image')['sizes']['pageBanner'];
    } else {
      $args['photo'] = get_theme_file_uri('/images/ocean.jpg');
    }
  }

  ?>
  <div class="page-banner">
    <div class="page-banner__bg-image" style="background-image: url(<?php echo $args['photo']; ?>);"></div>
    <div class="page-banner__content container container--narrow">
      <h1 class="page-banner__title"><?php echo $args['title'] ?></h1>
      <div class="page-banner__intro">
        <p><?php echo $args['subtitle']; ?></p>
      </div>
    </div>  
  </div>
<?php }

function university_files() {
  // DEFAULT TO STYLES.CSS wp_enqueue_style('university_main_styles', get_stylesheet_uri()); // get_stylesheet_uri default to style.css
  wp_enqueue_script('googleMap', '//maps.googleapis.com/maps/api/js?key=AIzaSyAD-XvB00rmnvZYsQgLBsqxynDsJ8hkfxg&callback=Function.prototype', NULL, '1.0', true);
  wp_enqueue_script('main-university-js', get_theme_file_uri('/build/index.js'), array('jquery'), '1.0', true);
  wp_enqueue_style('custom-google-fonts', '//fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i|Roboto:100,300,400,400i,700,700i');
  wp_enqueue_style('font-awesome', '//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
  wp_enqueue_style('university_main_styles', get_theme_file_uri('/build/style-index.css'));
  wp_enqueue_style('university_extra_styles', get_theme_file_uri('/build/index.css'));

  // make localized strings or dynamic data available to scripts on the front end.
  // has 3 arguments 
  // #1 name JS file you want to make flexible
  // #2 makeup a variable name
  // #3 array of data we want to be avaible on Javascript 
  wp_localize_script('main-university-js', 'universityData', array(
    'root_url' => get_site_url()
  ));
}

add_action('wp_enqueue_scripts', 'university_files');

function university_features() {
  // register_nav_menu('headerMenuLocation', 'Header Menu Location');
  // register_nav_menu('footerLocation1', 'Footer Location One');
  // register_nav_menu('footerLocation2', 'Footer Location Two');
  add_theme_support('title-tag'); // title tag for the browser
  add_theme_support('post-thumbnails'); // add support for post thumbnails (featured images) 
  add_image_size('professorLandscape', 400, 260, true); // the 'true' param is a boolean that specifies whether the image should be cropped to exactly match the dimensions
  add_image_size('professorPortrait', 480, 650, true);
  add_image_size('pageBanner', 1500, 350, true);
}

add_action('after_setup_theme', 'university_features');

function university_adjust_queries($query) {
  // campus archive
  if (!is_admin() AND is_post_type_archive('campus') AND $query->is_main_query()) {
    $query->set('posts_per_page', -1);
  }
  // program archive
  if (!is_admin() AND is_post_type_archive('program') AND $query->is_main_query()) {
    $query->set('orderby', 'title');
    $query->set('order', 'ASC');
    $query->set('posts_per_page', -1);
  }
  // event archive
  if (!is_admin() AND is_post_type_archive('event') AND $query->is_main_query()) {
    $today = date('Ymd');
    $query->set('meta_key', 'event_date');
    $query->set('orderby', 'meta_value_num');
    $query->set('order', 'ASC');
    $query->set('meta_query', array(
              array(
                'key' => 'event_date',
                'compare' => '>=',
                'value' => $today,
                'type' => 'numeric'
              )
            ));
  }
}

add_action('pre_get_posts', 'university_adjust_queries');

function universityMapKey($api) {
  $api['key'] = 'AIzaSyAD-XvB00rmnvZYsQgLBsqxynDsJ8hkfxg';
  return $api;
}

add_filter('acf/fields/google_map/api', __NAMESPACE__ . 'universityMapKey');



// Redirect subscriber account to homepage
add_action('admin_init', 'redirectSubsToFrontend');

function redirectSubsToFrontend() {
  $ourCurrentUser = wp_get_current_user();
  // if user has only 1 user role and the user role is 'subscriber' redirect to homepage
  if(count($ourCurrentUser->roles) == 1 AND $ourCurrentUser->roles[0] == 'subscriber')  {
    wp_redirect(site_url('/'));
    exit; // don't show admin dashboard
  }
}

add_action('wp_loaded', 'noSubsAdminBar');

function noSubsAdminBar() {
  $ourCurrentUser = wp_get_current_user();

  if(count($ourCurrentUser->roles) == 1 AND $ourCurrentUser->roles[0] == 'subscriber')  {
    show_admin_bar(false);
  }
}