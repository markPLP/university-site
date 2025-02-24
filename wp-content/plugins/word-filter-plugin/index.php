<?php

/*
  Plugin Name: Our Word Filter Plugin
  Description: Replaces a list of words.
  Version 1.0
  Author: Brad
  Author URI: https://www.udemy.com/user/bradschiff/
*/

if( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly - Safety measure

class WordFilterPlugin {
  function __construct() {
    // Add the admin menu - dashboard
    add_action('admin_menu', array($this, 'ourMenu'));

    // wordpress generated form - options.php
    // Add the settings - replacement text 
    // add_action('admin_init', 'ourSettings');
    add_action('admin_init', array($this, 'ourSettings'));
// if statement
// check if the option 'plugin_words_to_filter' is set
// if it is set then add the filter to the content
    if (get_option('plugin_words_to_filter')) add_filter('the_content', array($this, 'filterLogic'));
  }

  function ourSettings() {
// register a section
// 1st argument - replacement-text-section - unique identifier
// 2nd argument - null - no title
// 3rd argument - null - no callback function
// 4th argument SLUG - word-filter-options - the page that this section will be displayed on
    add_settings_section('replacement-text-section', null, null, 'word-filter-options');
// register a setting
// 1st argument - replacementFields - unique identifier
// 2nd argument - replacementText - the name of the option in the database
    register_setting('replacementFields', 'replacementText');
// add a field to the section
// 1st argument - replacementFields - unique identifier - ID attribute of the actual element/field
// 2nd argument - Filtered Text - is the text that the user will actually see on the form as the label for the field.
// 3rd argument - replacementFieldHTML - the function that will output the HTML for this field
// 4th argument SLUG - word-filter-options - the page that this field will be displayed on
// 5th argument - replacement-text-section - the section that this field will be displayed in
    add_settings_field('replacement-text', 'Filtered Text', array($this, 'replacementFieldHTML'), 'word-filter-options', 'replacement-text-section');
  }

  function replacementFieldHTML() { ?>
<?php 
  // replacementText - the name of the option in the database
// get_option('replacementText', '***') - get the value from the database if it is already set, otherwise use the default value of '***'
// and escape it
// esc_attr - escape the attribute because we are in the value attribute of an input field
?>
<input type="text" name="replacementText" value="<?php echo esc_attr(get_option('replacementText', '***')) ?>">
<p class="description">Leave blank to simply remove the filtered words.</p>
<?php }

  function filterLogic($content) {
// explode - split the string by a comma - this is an array of words separated by a comma
// 1st argument - ',' - the delimiter - separator
// 2nd argument - get_option('plugin_words_to_filter') - get the value from the database
// explode(',', get_option('plugin_words_to_filter')) - get the value from the database and split it by a comma
    $badWords = explode(',', get_option('plugin_words_to_filter'));
// array_map - apply a function to each element in an array - loop through each element in the array and apply the trim function to each element
// 1st argument - trim - function to apply
// 2nd argument - $badWords - the array to apply the function to 
    $badWordsTrimmed = array_map('trim', $badWords);
// str_ireplace - replace all occurrences of the search string with the replacement string
// 1st argument - $badWordsTrimmed - the array of words to search for
// 2nd argument - esc_html(get_option('replacementText', '****')) - get the value from the database and escape it
// 3rd argument - $content - the content to search in - content is the argument that is passed to the filterLogic function
// return the filtered content

    return str_ireplace($badWordsTrimmed, esc_html(get_option('replacementText', '****')), $content);
  }

  function ourMenu() {
    // add_menu_page
    // 7 arguments
    // 1. Page title
    // 2. Menu title - show in sidebar dashboard
    // 3. Capability - who can see this menu
    // 4. Menu slug - unique identifier - ourwordfilter
    // 5. Callback function - what to display on the page
    // 6. Icon URL - can use base64 image
    // 7. Position - where to show in the dashboard - 100 is the last item
    // $mainPageHook = add_menu_page('Words To Filter', 'Word Filter', 'manage_options', 'ourwordfilter', array($this, 'wordFilterPage'), plugin_dir_url(__FILE__) . 'file.svg', 100); 100 here is the position of the menu, in this case, it will be the last item in the dashboard
    $mainPageHook = add_menu_page('Words To Filter', 'Word Filter', 'manage_options', 'ourwordfilter', array($this, 'wordFilterPage'), 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xMCAyMEMxNS41MjI5IDIwIDIwIDE1LjUyMjkgMjAgMTBDMjAgNC40NzcxNCAxNS41MjI5IDAgMTAgMEM0LjQ3NzE0IDAgMCA0LjQ3NzE0IDAgMTBDMCAxNS41MjI5IDQuNDc3MTQgMjAgMTAgMjBaTTExLjk5IDcuNDQ2NjZMMTAuMDc4MSAxLjU2MjVMOC4xNjYyNiA3LjQ0NjY2SDEuOTc5MjhMNi45ODQ2NSAxMS4wODMzTDUuMDcyNzUgMTYuOTY3NEwxMC4wNzgxIDEzLjMzMDhMMTUuMDgzNSAxNi45Njc0TDEzLjE3MTYgMTEuMDgzM0wxOC4xNzcgNy40NDY2NkgxMS45OVoiIGZpbGw9IiNGRkRGOEQiLz4KPC9zdmc+', 100);
    // add_submenu_page this is for sub menu
    // 6 arguments
    // 1. Parent slug - ourwordfilter
    // 2. Page title
    // 3. Menu title - show in sidebar dashboard
    // 4. Capability - who can see this menu  
    // 5. Menu slug - unique identifier - word-filter-options
    // 6. Callback function - what to display on the page
    add_submenu_page('ourwordfilter', 'Words To Filter', 'Words List', 'manage_options', 'ourwordfilter', array($this, 'wordFilterPage')); // same slug and callback function as parent
    add_submenu_page('ourwordfilter', 'Word Filter Options', 'Options', 'manage_options', 'word-filter-options', array($this, 'optionsSubPage'));

    // load custom CSS on the main admin page - Word To Filter
    // 1st argument - load-{$mainPageHook} - take the add_menu_page as a return value and hook it to the load-{$mainPageHook}
    // this means that the mainPageAssets function will be called when the main page is loaded
    add_action("load-{$mainPageHook}", array($this, 'mainPageAssets'));
  }
  // Add the custom CSS to the main page - word filter plugin
  function mainPageAssets() {
    wp_enqueue_style('filterAdminCss', plugin_dir_url(__FILE__) . 'styles.css');
  }
  // handle form submission
  function handleForm() {
// wp_verify_nonce - check if the nonce is valid
// 1st argument - $_POST['ourNonce'] - the nonce value that was submitted with the form - hidden input field
// 2nd argument - 'saveFilterWords' - the unique identifier that we used when we created the nonce
// saveFilterWords - unique identifier - is the first argument in the wp_nonce_field function
// AND
// current_user_can('manage_options') - check if the current user has the manage_options capability - ADMIN previlages
// if both are true then update the option in the database
// else show an error message below
    if (wp_verify_nonce($_POST['ourNonce'], 'saveFilterWords') AND current_user_can('manage_options')) {
      // 1st argument - the first argument is the name of the option in the database that we want to store this value as 'plugin_words_to_filter'
      // 2nd argument - The second argument is the value that we want to store in the database. We're using sanitize_text_field to sanitize the input
      // 2nd argument value is the 'plugin_words_to_filter' from the textarea
      update_option('plugin_words_to_filter', sanitize_text_field($_POST['plugin_words_to_filter'])); ?>
<div class="updated">
  <p>Your filtered words were saved.</p>
</div>
<?php } else { ?>
<div class="error">
  <p>Sorry, you do not have permission to perform that action.</p>
</div>
<?php } 
  }

// function to output the HTML for the main page
  function wordFilterPage() { ?>
<div class="wrap">
  <h1>Word Filter</h1>
  <?php 
  // $_POST[] is an array that holds the values of the form elements that are sent with the POST method
  // post method in Javascript
  ?>
  <?php if (isset($_POST['justsubmitted']) == "true") $this->handleForm() ?>
  <form method="POST">
    <!-- hidden input field to check if the form was just submitted -->
    <input type="hidden" name="justsubmitted" value="true">
    <?php 
// SRF ATTACK prevention - we want to use something called a nonce in order to protect from cross-site request forgery.
// wp_nonce_field('saveFilterWords', 'ourNonce') - this function will output a hidden input field with a unique nonce value
// we will check this nonce value when the form is submitted to make sure that the form was submitted from our site and not from another site
// 1st argument - saveFilterWords - unique identifier
      
    ?>
    <?php wp_nonce_field('saveFilterWords', 'ourNonce') ?>
    <label for="plugin_words_to_filter">
      <p>Enter a <strong>comma-separated</strong> list of words to filter from your site's content.</p>
    </label>
    <div class="word-filter__flex-container">
      <textarea name="plugin_words_to_filter" id="plugin_words_to_filter" placeholder="bad, mean, awful, horrible">
<?php 
          // add basic security to the textarea
          // esc_textarea - escape the text area 
          // get_option('plugin_words_to_filter') - get the value from the database
          // escape when pulling data from the database
        ?><?php echo esc_textarea(get_option('plugin_words_to_filter')) ?>
      </textarea>
    </div>
    <input type="submit" name="submit" id="submit" class="button button-primary" value="Save Changes">
  </form>
</div>
<?php }
  // sub page for the options
  // IMPORTANT
  //  if I'm going to create a WordPress generated form where it sort of outputs the fields for me, we want to be sure that the action is pointing towards options dot PHP.
 // options.php - the file that handles the form submission

  function optionsSubPage() { ?>
<div class="wrap">
  <h1>Word Filter Options</h1>
  <form action="options.php" method="POST">
    <?php
          // settings_errors - display any errors that may have occurred during the form submission
          settings_errors();
          // output the settings fields
          // replacementFields is the 1st agrument in the register_setting function
          settings_fields('replacementFields');
          // output the settings sections
          // word-filter-options is a SLUg - the page that this section will be displayed on 
          do_settings_sections('word-filter-options');
          submit_button();
        ?>
  </form>
</div>
<?php }

}

$wordFilterPlugin = new WordFilterPlugin();