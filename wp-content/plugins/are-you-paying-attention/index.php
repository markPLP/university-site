<?php

/*
  Plugin Name: Are You Paying Attention Quiz
  Description: Give your readers a multiple choice question.
  Version 1.0
  Author: Mark
  Author URI: https://mplp-portfolio.netlify.app/
*/

// prevents from triggering our code by visiting the URL for this PHP file with this boilerplate code out of the
if( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly - Safety measure

class AreYouPayingAttention {
  function __construct() {
// add_action('enqueue_block_editor_assets', array($this, 'adminAssets'));
    //change enqueue_block_editor_assets to init - Dynamic block
    add_action('init', array($this, 'adminAssets'));
   
    // add_action('wp_enqueue_scripts', array($this, 'adminAssets')); // Load in frontend
  }

  function adminAssets() {
    // wp_enqueue_script('ournewblocktype', plugins_url('test.js', __FILE__), array('wp-blocks'), null, true);
    // wp-blocks is a dependency that is needed for our script to work
    // wp-block dependency needs to be loaded 1st before wordpress loads the JS file
    // change wp_enqueue_script to wp_register_script - Dynamic block
    wp_register_script('ournewblocktype', plugin_dir_url(__FILE__) . 'build/index.js', array('wp-blocks', 'wp-element'), null, true); // true loads in footer
    // 1st argument ourplugin/are-you-paying-attention is the name of our block in index.js
    // 2nd argument array of options
    register_block_type('ourplugin/are-you-paying-attention', array(
      'editor_script' => 'ournewblocktype',
      'render_callback' => array($this, 'theHTML')
    ));
  }

  function theHTML($attributes) {
    ob_start(); ?>
<h6>xxToday the sky is GG <?php echo esc_html($attributes['skyColor'])?> and the grass isxx
  <?php echo esc_html($attributes['grassColor']) ?>!!!</h6>
<?php return ob_get_clean();
      }
}

$areYouPayingAttention = new AreYouPayingAttention();

// class AreYouPayingAttention {
/////////
//   function __construct() {
//     add_action('enqueue_block_editor_assets', array($this, 'adminAssets'));
//     add_action('wp_enqueue_scripts', array($this, 'adminAssets')); // Load in frontend
//   }

//   function adminAssets() {
//     wp_enqueue_script(
//       'ournewblocktype',
//       plugins_url('test.js', __FILE__), 
//       array('wp-blocks'), 
//       null, 
//       true
//     );
//   }
// }