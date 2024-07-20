<?php 

function university_files() {
 // DEFAULT TO STYLES.CSS wp_enqueue_style('university_main_styles', get_stylesheet_uri()); // get_stylesheet_uri default to style.css
 
  wp_enqueue_script('main-university-js', get_theme_file_uri('/build/index.js'), array('jquery'), '1.01', true); // 1st arg if have dependency put NULL if no dependency
                                                                                                                // 2nd arg the version of ur code, 
                                                                                                                // 3rd arg 'true' put JS down the bottom
  wp_enqueue_style('custom-google-font', '//fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i|Roboto:100,300,400,400i,700,700i'); 
  wp_enqueue_style('font-awesome', '//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'); 
  wp_enqueue_style('university_main_styles', get_theme_file_uri('/build/style-index.css')); 
  wp_enqueue_style('university_extra_styles', get_theme_file_uri('/build/index.css')); 
}

add_action('wp_enqueue_scripts', 'university_files');

function university_features() {
  register_nav_menu('headerMenuLocation', 'Header Menu Location');
  register_nav_menu('footerLocation1', 'Footer Location One');
  register_nav_menu('footerLocation2', 'Footer Location Two');
  add_theme_support('title-tag'); // title tag for the browser
}

add_action('after_setup_theme', 'university_features');
