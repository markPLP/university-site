<?php 

/*
  Plugin Name: Our Test Plugin
  Description: A truly amazing plugin.
  Version: 1.0
  Author: Mark
  Author URI: markLPL.com
  Text Domain: wcpdomain
  Domain Path: /languages
*/

class WordCountAndTimePlugin {
  function __construct() {
    // Create admin menu
    add_action('admin_menu', array($this, 'adminPage')); // array($this, 'adminPage') - call the adminPage function - $this refers to the current class
    add_action('admin_init', array($this, 'settings'));
    add_filter('the_content', array($this, 'ifWrap'));
    add_action('init', array($this, 'languages'));
  }

  // load_plugin_textdomain() - load the text domain for translation
  // 'wcpdomain' - text domain
  // false - there is no special location for the translation files - DEPRECATED
  // dirname(plugin_basename(__FILE__)) . '/languages' - the path to the languages folder
  function languages() {
    load_plugin_textdomain('wcpdomain', false, dirname(plugin_basename(__FILE__)) . '/languages');
  }

  function ifWrap($content) {
    // only if its the main query AND single post page
    // if the user has checked any of the boxes in the settings page, 
    //then we will display the word count, character count, and read time.
    if (is_main_query() AND is_single() AND
    (
      get_option('wcp_wordcount', '1') OR // 1 means checked - fallback to 1 if the value is not set
      get_option('wcp_charactercount', '1') OR // 1 means checked - fallback to 1 if the value is not set
      get_option('wcp_readtime', '1') // 1 means checked - fallback to 1 if the value is not set
    )) {
      return $this->createHTML($content); // pass to createHTML function and do the work there
    }
    return $content; // if the user has not checked any of the boxes in the settings page, then we will not display the word count, character count, and read time.
  }

  function createHTML($content) {
    // esc_html() - escape the HTML to prevent XSS attacks
    // 'wcp_headline', 'Post Statistics' - if the value is not set, then fallback to 'Post Statistics'
    $html = '<h3>' . esc_html(get_option('wcp_headline', 'Post Statistics')) . '</h3><p>';

    // get word count once because both wordcount and read time will need it.
    // display word count, if Word Count is checked and Read Time is checked
    if (get_option('wcp_wordcount', '1') OR get_option('wcp_readtime', '1')) {
      // strip_tags() - remove all HTML tags from the content
      // str_word_count() - count the number of words in the content
      $wordCount = str_word_count(strip_tags($content));
    }

    if (get_option('wcp_wordcount', '1')) {
      $html .= esc_html__('This post has', 'wcpdomain') . ' ' . $wordCount . ' ' . __('words', 'wcpdomain') . '.<br>';
    }

    if (get_option('wcp_charactercount', '1')) {
      // strlen() - count the length of characters in the content
      $html .= 'This post has ' . strlen(strip_tags($content)) . ' characters.<br>';
    }

    if (get_option('wcp_readtime', '1')) {
      // ruond() - round the number to the nearest whole number
      // 225 words per minute is the average reading speed
      $html .= 'This post will take about ' . round($wordCount/225) . ' minute(s) to read.<br>';
    }

    $html .= '</p>'; // close the paragraph tag

    //if true then display at the beginning of the post
    //$html . $content - display at the beginning of the post
    if (get_option('wcp_location', '0') == '0') {
      return $html . $content;
    }
    
    // if false then display at the end of the post
    // $content . $html - display at the end of the post
    return $content . $html;
  }
  
  function settings() {
    
    // 4 arguments
    // #1 'wcp_first_section' - The first argument is the name of the section that we want to create. FOUND ON add_settings_field
    // #2 'Display Settings - subtitle or NULL' - The second argument is the title of the section that we want to display on the form or NULL
    // #3 content area to the top of a section OR NULL
    // #4 page slug 'word-count-settings-page' - The fourth argument is the page slug for this settings page that we're working with. FOUND ON add_settings_field
    // add_settings_section is to create a new section on the settings page 'wcp_first_section' - the name of the section
    add_settings_section('wcp_first_section', null, null, 'word-count-settings-page');
    
    
    // 5 arguments
    // #1 option_name in wp_option - 'wcp_location' - The first argument is the name of the option or setting that we want to tie this to.
    // #2 'Display Location' - The second argument is the title of the field that we want to display on the form.
    // #3 array($this, 'locationHTML') - The third argument is the callback function that will generate the HTML for the input field.
    // #4 'word-count-settings-page' - So the fourth argument is the page slug for this settings page that we're working with.
    // #5 'wcp_first_section' - The fifth argument is the section that we want to add this field to.
    // the job of this function is to begin to build out the HTML input field for our form.
    add_settings_field('wcp_location', 'Display Location', array($this, 'locationHTML'), 'word-count-settings-page', 'wcp_first_section'); 
    
    // use this register setting function once for each of the options.
    // 3 agruments  
    // #1 option group - unique name for the group of options
    // #2 option name - unique name for the option location
    // #3 sanitize callback - function that will sanitize the input
    register_setting('wordcountplugin', 'wcp_location', array('sanitize_callback' => array($this, 'sanitizeLocation'), 'default' => '0')); // 0 means the beginning of the post // 1 means the end of the post

    // for headline text field
    add_settings_field('wcp_headline', 'Headline Text', array($this, 'headlineHTML'), 'word-count-settings-page', 'wcp_first_section');
    register_setting('wordcountplugin', 'wcp_headline', array('sanitize_callback' => 'sanitize_text_field', 'default' => 'Post Statistics'));

    add_settings_field('wcp_wordcount', 'Word Count', array($this, 'checkboxHTML'), 'word-count-settings-page', 'wcp_first_section', array('theName' => 'wcp_wordcount'));
    register_setting('wordcountplugin', 'wcp_wordcount', array('sanitize_callback' => 'sanitize_text_field', 'default' => '1'));

    add_settings_field('wcp_charactercount', 'Character Count', array($this, 'checkboxHTML'), 'word-count-settings-page', 'wcp_first_section', array('theName' => 'wcp_charactercount'));
    register_setting('wordcountplugin', 'wcp_charactercount', array('sanitize_callback' => 'sanitize_text_field', 'default' => '1'));

    add_settings_field('wcp_readtime', 'Read Time', array($this, 'checkboxHTML'), 'word-count-settings-page', 'wcp_first_section', array('theName' => 'wcp_readtime'));
    register_setting('wordcountplugin', 'wcp_readtime', array('sanitize_callback' => 'sanitize_text_field', 'default' => '1'));
  }

  function sanitizeLocation($input) {
// drop down menu display location
// input should be either 0 or 1 and nothing else
    if ($input != '0' AND $input != '1') {
      // error message will be displayed on the admin dashboard > Settings > Word Count
      add_settings_error('wcp_location', 'wcp_location_error', 'Display location must be either beginning or end.');
      return get_option('wcp_location');
    }
    return $input;
  }

/* function wordcountHTML() { ?>
<input type="checkbox" name="wcp_wordcount" value="1" <?php checked(get_option('wcp_wordcount'), '1') ?>>
<?php } */

  // reusable checkbox function
  // $args is an array that can be passed to the function to customize the checkbox
  // array('theName' => 'wcp_readtime') - theName is the key and 'wcp_readtime' is the value
  // $args is the #6 arugment in add_settings_field - CUSTOM just for checkbox
  function checkboxHTML($args) { ?>
<input type="checkbox" name="<?php echo $args['theName'] ?>" value="1"
  <?php checked(get_option($args['theName']), '1') ?>>
<?php }
  
  function headlineHTML() { ?>
<input type="text" name="wcp_headline" value="<?php echo esc_attr(get_option('wcp_headline')) ?>">

<?php }
  
  // this will show on the admin dashboard > Settings > Word Count on 2nd column
  // the get_option('wcp_location') function call retrieves the value of the WordPress option named wcp_location from the database.
  function locationHTML() { ?>
<select name="wcp_location">
  <option value="0" <?php selected(get_option('wcp_location'), '0') ?>>Beginning of post</option>
  <option value="1" <?php selected(get_option('wcp_location'), '1') ?>>End of post</option>
</select>
<?php }
    
    
  // Setup admin page settings
  // this will show on the admin dashboard > Settings > Word Count
  function adminPage() {
    // has 5 arguments
    // #1 page title
    // #2 menu title
    // #3 capability  - user role that can see this menu 'manage_options' - admin
    // #4 menu slug     
    // #5 callback function
    add_options_page('Word Count Settings', __('Word Count', 'wcpdomain'), 'manage_options', 'word-count-settings-page', array($this, 'ourHTML')); // array($this, 'ourHTML') - call the ourHTML function - $this refers to the current class
  }
    
    // this will show on the admin dashboard > Settings > Word Count
    function ourHTML() { ?>
<div class="wrap">
  <h1>Word Count Settings</h1>
  <form action="options.php" method="POST">
    <?php
      settings_fields('wordcountplugin'); // group name 'wordcountplugin' from register_setting
      // slug found on add_settings_section or add_settings_field
      do_settings_sections('word-count-settings-page');
      submit_button();
      ?>
  </form>
</div>
<?php }
}

$wordCountAndTimePlugin = new WordCountAndTimePlugin();