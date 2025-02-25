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
    wp_register_style('quizeditcss', plugin_dir_url(__FILE__) . 'build/index.css'); // 
    // wp_enqueue_script('ournewblocktype', plugins_url('test.js', __FILE__), array('wp-blocks'), null, true);
    // wp-blocks is a dependency that is needed for our script to work
    // wp-block dependency needs to be loaded 1st before wordpress loads the JS file
    // change wp_enqueue_script to wp_register_script - Dynamic block
    wp_register_script('ournewblocktype', plugin_dir_url(__FILE__) . 'build/index.js', array('wp-blocks', 'wp-element', 'wp-editor'), null, true); // true loads in footer

    // 1st argument ourplugin/are-you-paying-attention is the name of our block in index.js
    // 2nd argument array of options
    register_block_type('ourplugin/are-you-paying-attention', array(
      'editor_script' => 'ournewblocktype',
      'editor_style' => 'quizeditcss',
      'render_callback' => array($this, 'theHTML')
    ));

  }

// output the HTML in the front end
  function theHTML($attributes) {
    // add the js file and scss file to the front end
    // if not in admin area then load the frontend js and css
    if (!is_admin()) {
      wp_enqueue_script('attentionFrontend', plugin_dir_url(__FILE__) . 'build/frontend.js', array('wp-element'), '1.0', true);
      wp_enqueue_style('attentionFrontendStyles', plugin_dir_url(__FILE__) . 'build/frontend.css');
    }    

    ob_start(); ?>

<?php 
 //  echo wp_json_encode($attributes)
// output the data coming fron the database to the front end
// wrap in pre tag
// display none
// use the data in the frontend.js file
?>
<div class="paying-attention-update-me">
  <pre style="display: none;"><?php echo wp_json_encode($attributes) ?></pre>
</div>
<?php return ob_get_clean();
      }
}

$areYouPayingAttention = new AreYouPayingAttention();