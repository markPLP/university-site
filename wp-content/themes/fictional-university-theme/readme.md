log the content

```php
  <?php echo '<pre>'; print_r($existQuery); echo '</pre>'; wp_die(); ?>
```

All in one WP migration by servMask
import file
to to permalinks - save changes build permalinks
go to theme folder and run npm install and run

<!> ASSIGNMENT

1. review search logic
2. nonce

<!-- Custom post types # EVENT POST TYPE Located at mu-plugins - IMPORTANT!
New custom post types will use the old classic Editor screen instead of the modern Block Editor screen unless we include a property named show_in_rest and set its value to true while registering our post type. Later in the course we'll learn all about what the REST API is, but for now, just know that we must include our new custom post type in it if we want our post type to leverage the modern block editor screen. To review, here's what your university-post-types.php file should look like with this new property included: -->

```php
<?php

function university_post_types() {
  register_post_type('event', array(
    'public' => true,
    'show_in_rest' => true,
    'labels' => array(
      'name' => 'Events',
      'add_new_item' => 'Add New Event',
      'edit_item' => 'Edit Event',
      'all_items' => 'All Events',
      'singular_name' => 'Event'
    ),
    'menu_icon' => 'dashicons-calendar'
  ));
}

add_action('init', 'university_post_types');
```

#######################

# PAGE NOT FOUND issues

// archive page for the custom post type
// ie EVENT POST TYPE page not found
// add in register_post_type('event', array(....
'has_archive' => true,

#######################

# CUSTOM FIELD

the_field('event_date'); // display the custom field value
$eventDate = new DateTime(get_field('event_date')); // get the ACF date for event_date
echo $eventDate->format('M');

#######################

# EDIT DEFAULT QUERIES

function university_adjust_queries($query) {
// campus archive

```php
if (!is_admin() AND is_post_type_archive('campus') AND $query->is_main_query()) {
$query->set('posts_per_page', -1);
}
```

// program archive

```php
if (!is_admin() AND is_post_type_archive('program') AND $query->is_main_query()) {
$query->set('orderby', 'title');
$query->set('order', 'ASC');
$query->set('posts_per_page', -1);
}
```

// event archive
// not in the admin AND in archive 'event' AND is the main query(not a custom query)
// this code will only run on the event archive page or URL

```php
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
```

// pre_get_posts is a hook that allows you to modify the current query before it is run.

```php
add_action('pre_get_posts', 'university_adjust_queries');
```

#######################

# PAST EVENTS - new page template(add new page)

// 1. add new page in the admin called 'Past Events'
// 2. IMPORTANT! create a new file in the theme folder called page-past-events.php

#######################

# WORKING WITH PAGINATION

```php
<div class="container container--narrow page-section">
  <?php
    // custom query for past events
      $today = date('Ymd');
      $pastEvents = new WP_Query(array(
        'post_type' => 'event',
        'paged' => get_query_var('paged', 1), //! this gets page number if not falls back to 1; // custom query pagination paged
        // hide posts_per_page after testing the custom pagination
        // 'posts_per_page' => 1, // -1 display all events
        'order' => 'DECS',
        'meta_key' => 'event_date', // if setting up meta value make sure to add meta_key first
        'orderby' => 'meta_value_num', // we used meta_value_num because event_date is a checking on date/number
                                       // if string use meta_value
        // this query will only show events that are less than today or past events
        'meta_query' => array(
            array( // read as - if key is >= to $today
              'key' => 'event_date',
              'compare' => '<',
              'value' => $today,
              'type' => 'numeric' // this object is numeric
            )
        )
      ));
  ?>

  <?php
    // pastEvents is a custom query
  while($pastEvents->have_posts()) {
      $pastEvents->the_post();
      get_template_part('/template-parts/content-event');

    } wp_reset_postdata(); // good practice to RESET the query

echo paginate_links(array( // add custom query parameter for pagination
// by default on this page returns only the past event page
'total' => $pastEvents->max_num_pages // max_num_pages is a property of the WP_Query object or .length in javascript
));
?>

</div>
<?php get_footer(); ?>
```

#######################

# RELATIONSHIP CUSTOM FIELD - ACF - events and programs

ie BIOLOGY - unaware of the relatioship with events

// 1. in single-program.php

```php
<?php
  // ACF event - event_date query
            $today = date('Ymd');
            $homepageEvents = new WP_Query(array(
              'post_type' => 'event',
              'posts_per_page' => 2, // -1 display all events
              'order' => 'DECS',
              'meta_key' => 'event_date', // if setting up meta value make sure to add meta_key first
              'orderby' => 'meta_value_num', // we used meta_value_num because event_date is a checking on date/number
              'meta_query' => array(
                  array( // read as - if key is >= to $today
                    'key' => 'event_date',
                    'compare' => '>=',
                    'value' => $today,
                    'type' => 'numeric'
                  // THIS FILTER HERE WILL FILTER THE EVENTS RELATED TO THE PROGRAM
                  ), array( // read as if the related_programs LIKE-contains this current post<get_the_ID>
                    'key' => 'related_programs',
                    'compare' => 'LIKE',
                    'value' => '"' . get_the_ID() . '"' // not true array - use open/close quotes "get_the_ID()"
                  )
              )
            ));

            if ($homepageEvents->have_posts()) { // check if there post homepageEvents
              echo '<hr class="section-break">';
              echo '<h2 class="headline headline--medium">Upcoming ' . get_the_title() . ' Events</h2>';

              while($homepageEvents->have_posts()) {
                $homepageEvents->the_post();
                get_template_part('/template-parts/content-event');

              }
            }

            wp_reset_postdata(); // good practice to RESET the query, every time you use a custom query IMPORTANT!

            // NO NEED TO DO A CUSTOM QUERY HERE BECAUSE WE ARE UNDER PROGRAM POST

            $relatedCampuses = get_field('related_campus');
            if($relatedCampuses) {
              echo '<hr class="section-break">';
              echo '<h2 class="headline headline--medium">' . get_the_title() . ' is avaible at these Campuses</h2>';
              echo '<ul class="min-list link-list">';
              foreach ($relatedCampuses as $campus) { ?>

                 <li><a href="<?php echo get_the_permalink($campus); ?>"><?php echo get_the_title($campus) ?></a></li>
              <?php }
              echo '</ul>';
            }
          ?>
    </div>

  <?php }
```

#######################

# Professor POST TYPE (and managing image uploads)

// by default featured image is not enabled for custom post types
// 1. go to functions.php add - add_theme_support('post-thumbnails');
// 2. go to mu-plugins/university-post-types.php add - 'supports' => array('thumbnail'),
echo <?php echo the_post_thumbnail('professorPortrait'); ?> // professorPortrait is a custom image size found in functions.php add_image_size('professorPortrait', 400, 400, true);

// 3. use regenerate thumbnails plugin to regenerate the thumbnails to resize the images to the new size
// 4. alternatively crop image using a plugin called manual image crop by Tomasz Sita - crop the image to the desired size

#######################

# Page Banner dynamic background image

// 1. create a new custom field called 'Page Banner';
// - create 2 fields for 'Page Banner Subtitle' and 'Page Banner Background Image'
// - field type is 'Image' and 'Text'
// 2. Show this field group if
// - Post Type is equal to Post OR Post Type is not equal to Post
// - THIS IS IMPORTANT! because we want to show the field group in all post types

#######################

# get_template_part() - dynamic template part

    // 2nd argument is the template part file name - dynamic template part

// get_template_part('template-parts/content', get_post_type());
get_template_part('template-parts/content', 'event'); // get the content-event.php

#######################

# create function vs get_template_part()

// making a function is better than using get_template_part() because it is more flexible and can be used in other parts of the theme
// but get_template_part() is good for reusing the same template part in different parts of the theme

#######################

# LOAD WP content with JS

wordpress package @wordpress/scripts
n

/wp-json/wp/v2/posts - get posts
/wp-json/wp/v2/posts/7(id)
/wp-json/wp/v2/posts?per_page=1
/wp-json/wp/v2/posts?search=about

/wp-json/wp/v2/pages - get pages
/wp-json/wp/v2/pages - get pages

#######################

# SEARCH - Custom field REST API - and for custom posts

Create custom logic
Respond with less JSON Data(loads faster) IMPORTANT
creating multiple endpoints for search results - inlcuded custom post types

1. function.php
2. code below

```php
// add custom field REST API
function university_custom_rest() {
  // add authorName
  // has 3 arguments
  // #1 'post' - post type you want to customize
  // #2 'authorName' - the second argument is, whatever you want to name the new field.
  // #3  third argument is an array that describes how we want to manage this field.
  register_rest_field('post', 'authorName', array(
    'get_callback' => function() { return get_the_author(); }
  ));

  // add get_current_user_id
  register_rest_field('post', 'userNoteCount', array(
    'get_callback' => function() { return count_user_posts(get_current_user_id()); }
  ));
}

add_action('rest_api_init', 'university_custom_rest');
```

3. go to mu-plugins find a custom post ie for Professor Post Type

- add the following code 'show_in_rest' => true,

```php
  // Professor Post Type
register_post_type('professor', array(
  'show_in_rest' => true, // Add this so we can query custom post professor
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
```

#######################

# SEARCH - CREATING key/value pair REST API

1. create a new sub folder 'inc'

- inside create search-route.php
- inside create search-route.php

2. go to function.php and set it to require
   - require get_theme_file_path('/inc/search-route.php');

#######################

# SEARCH - updating front-end js to use the new API URL

1. go to Search.js and find getResults() and use the custom API

#######################

# SEARCH - searching by relationshiop

// check for duplicate SORT like JAVASCRIPT

```php
  array_unique(a,b)
  array_unique($results['professors'], SORT_REGULAR)
```

array_values removes the numerical keys provide by array_unique LIKE JAVASCRIPT new Map array

```js
  const professor = [
    "0": {
      'xxx': 'yyy'
    }
  ]
```

remove the 0 in '0': {'xxx': 'yyy'}

```php
array_values(array_unique($results['events'], SORT_REGULAR));
```

#######################

# Main body Content - program CF

The purpose of this custom field is to avoid search instance on the program and events post

1. replace editor with a custom field WYSWYG to avoid conflict search - DONT DO THIS ON BLOG POST

   - ADD custom field called main_body_content
     // location rules = Post Type is equal to program
     // fields = WYSWYG
     // position = High(after title) - after the POST TITLE

2. on single-program.php replace the_content with the custom field the_field('main_body_content');

```php
<div class="generic-content"><?php the_field('main_body_content'); ?></div>
```

3. go to mu-plugins and remove the support editor for Program Post Type

#######################

# Traditional wordpress searching

1. create a page called Search in dashboard admin
2. create a file called page-search.php
3.

#######################

# USER GENERATED CONTENT - MEMBERS PLUGIN

Default Wordpress user roles
Setup User Roles per post-type

u:funny_bloody

<!-- p:kfOw$3AaRCU7Vz&#V*5UBZMN -->

1. create a new role - add plugin called Members by memberpress

- custom post needs to be enable to show in the Members dashboard ie the Event Post Type
- go to mu-plugins and add 'capability_type' => 'event', and 'map_meta_cap' => true,

```php
// Event Post Type
register_post_type('event', array(
  'capability_type' => 'event',
  'map_meta_cap' => true, // require the capabilities
));
```

2. Add administrator access to Event or any user that needs it
3. Mindblown - add multiple userroles in a single user

#######################

# OPEN REGISTRATION - subscriber role

// Permission
// Security
//CRUD user-specific content

1. settings > membership > anyone can register
2. New User Default role = Subscriber
3. save changes
4. header.php edit signup button <a href="<?php echo wp_registration_url(); ?>" class="btn btn--small  btn--dark-orange float-left">Sign Up</a>
5. go to header.php
   - add conditional if is_user_logged_in() display logout button
   - logout button add avatar <a href="<?php echo wp_logout_url(); ?>" class="btn btn--small  btn--dark-orange float-left btn--with-photo">
     <span class="site-header__avatar"><?php echo get_avatar(get_current_user_id(), 60); ?></span>  
      <span class="btn__text">Logout</span>
     </a>
6. remove admin dashboard for subscriber role

```php
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
```

7. Hide admin bar

```php
// hide adminbar for subscriber
add_action('wp_loaded', 'noSubsAdminBar');

function noSubsAdminBar() {
  $ourCurrentUser = wp_get_current_user();

  if(count($ourCurrentUser->roles) == 1 AND $ourCurrentUser->roles[0] == 'subscriber')  {
    show_admin_bar(false);
  }
}
```

#######################

# LOGIN change logo and design

1. go to function.php

- add filter to change the link

```php
add_filter('login_headerurl', 'ourHeaderUrl');

function ourHeaderUrl() {
 return esc_url(site_url('/')); // change logo URL
}
```

2. load CSS in login screen

- function.php

```php
add_filter('login_enqueue_scripts', 'ourLoginCSS');

function ourLoginCSS() {
  wp_enqueue_style('custom-google-fonts', '//fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i|Roboto:100,300,400,400i,700,700i');
  wp_enqueue_style('font-awesome', '//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
  wp_enqueue_style('university_main_styles', get_theme_file_uri('/build/style-index.css'));
  wp_enqueue_style('university_extra_styles', get_theme_file_uri('/build/index.css'));
}
```

3. Change logo to site name

```php
add_filter('login_headertitle', 'ourLoginTitle');

function ourLoginTitle() {
  return get_bloginfo('name'); // official site name
}
```

#######################

# My Notes (CRUD EXERCISE)

1. create a page called my-notes in dashboard admin
2. create a file called page-my-notes.php

- in header navbar add <a href="<?php echo esc_url(site_url('/my-notes')); ?>" class="btn btn--small btn--orange float-left push-right">My Notes</a>
- esc_url() adds extra security level - Outputting a URL in an href or src attribute
- ❌ Inside wp_safe_redirect() – Use esc_url_raw() instead

3. on page-my-notes.php
   if not logged in redirect to homepage

```php
if(!is_user_logged_in()) {
 wp_redirect(esc_url(site_url('/')));
 exit; // don't load WP/service resources
}
```

4. Create a custom field called note in mu-plugins

```php
 register_post_type('note', array( ))
```

5. connect to rest API - edit and delete action

- create MyNotes.js
- add NONCE to be able to delete a note or have access
- function.php add 'nonce' => wp_create_nonce('wp_rest') to wp_localize_script() function

```php
 // make localized strings or dynamic data available to scripts on the front end.
  // has 3 arguments
  // #1 name JS file you want to make flexible
  // #2 makeup a variable name
  // #3 array of data we want to be avaible on Javascript
  wp_localize_script('main-university-js', 'universityData', array(
    'nonce' => wp_create_nonce('wp_rest') // NONCE - number used once - security feature generated by wordpress to prevent unauthorized access
  ));
```

6. Note permissions and security - GENERAL SECURITY
   - go to mu-plugin and to to Note post type and add 'capability_type' => 'note' and 'map_meta_cap' => true,
   ```php
    // Note Post Type
    register_post_type('note', array(
      'capability_type' => 'note', // custom post type inherit permission to blog post type by default
      'map_meta_cap' => true, // for custom post type - show on Members plugin - permission role
    )
   ```
   - give admininstrator role full access
   - give subscriber 'publish note' 'edit notes' 'delete notes'
   - SECURITY - private content - in MyNotes.js make status as private
   ```js
   const ourUpdatedPost = {
     title: this.newNoteTitleField.value,
     content: this.newNoteBodyField.value,
     status: 'private', // by default this is draft
   };
   ```
   - SERVER SIDE POLICY - most secure !IMPORTANT
   - in function.php create add_filter('wp_insert_post_data', 'makeNotePrivate', 10, 2) = filter function clean
   ```php
   add_filter('wp_insert_post_data', 'makeNotePrivate', 10, 2)
   function makeNotePrivate($data, $postarr) {}
   ```

- REMOVE the 'Private' prefix text in page-my-notes.php
  ```php
  <input readonly class="note-title-field" value="<?php echo str_replace('Private: ', '', esc_attr(get_the_title())); ?>">
  ```
- GENERAL SECURITY
  - by default admin accounts can post unfiltered post
  - esc_attr() - // if it use it an attribute like 'value' // use in user generated content
  ```php
  <input readonly class="note-title-field" value="<?php echo str_replace('Private: ', '', esc_attr(get_the_title())); ?>">
  ```
  - OR esc_html OR esc_textarea
  ```php
    <p><?php echo esc_html(the_content());?></p>
  ```
  - INFORCE STRICT POLICY on the server - strips all html tags - go to function.php and add this in makeNotePrivate() - use sanitize_textarea_field() or sanitize_text_field()
    ```php
    $data['post_content'] = sanitize_textarea_field($data['post_content']);
    $data['post_title'] = sanitize_text_field($data['post_title']);
    ```

###############################

# MyNote - Limit posts per User

1. go to function.php

- add if statement in makeNotePrivate()

```php
    if(count_user_posts(get_current_user_id(), 'note') > 4 && !$postarr['ID']) { // !$postarr['ID'] true if ID do not exist/incoming
    die('You have reached your note limit'); // stop running, no post no data is being processd
    // die is like early return in javascript
  }
```

2. Add a note limit warning in JS.

- first add the warning message in page-my-notes.php
  ```php
  <span class="note-limit-message">Note Limit Reached: delete existing note to add a new note</span>
  ```
- go to MyNotes.js
  ```js
  const showMessage = document.querySelector('.note-limit-message');
  // Check if the response text is the note limit message
  if (responseText === 'You have reached your note limit') {
    showMessage.classList.add('active');
    throw new Error(responseText); // Stop further processing
  }
  ```

# Like count - custom rest API EXERCISE

Each user can only like a professor once. And we will also want to make sure that the ID that they say they are liking is actually a professor post and not a campus post or a blog post. And manually add the permission

1. add custom field call liked_professor_id

- create a post type 'like' - go to mu-plugins
- 'show_in_rest' => false // create a custom REST API ENDPOINT
- remove capability_type' => 'note' and map_meta_cap' -- handle permission manually
- 1 to 1 relationship between the ID number of the current user and the ID number of the liked professor.

2. Create custom field of professor ID.

- field type number
- required NO
- location Post Type is equal to like

3. In single-professor.php add the like logic
   IMPORTANT notes

   - likeCount->found_posts is a function that gets the total number of post that the query found - does not include pagination

4. Create custom API

- create the endpoint(custom API) a separate file inside inc folder named like-route.php
- in function.php require it
  ```php
  require get_theme_file_path('/inc/like-route.php');
  ```
- write the code in Like.js

5. Create and Delete Posts with PHP

- go to like-route.php and Like.js then start coding
- to insert a post progmatically use wp_insert_post
  ```php
  wp_insert_post(array(
      'post_type' => 'like',
      'post_status' => 'publish',
      'post_title' => '2nd PHP Test',
      'meta_input' => array(
        'liked_professor_id' => $professor  // custom field - value
      )
    ));
  ```

6. Implement Permession & Logic / Restriction

- first delete all the Likes post(trash posts)
- go to like-route.php code condition check

############

# First plugin!

1.  create folder in plugin dir - ourFirst-first-unique-plugin

# Plugin - Admin setting page

1. setup admin setting page for our plugin

```php
  // Setup admin page settings
  // this will show on the admin dashboard > Settings > Word Count
  function adminPage() {
  // has 5 arguments
  // #1 page title
  // #2 menu title
  // #3 capability  - user role that can see this menu 'manage_options' - admin
  // #4 menu slug
  // #5 callback function

    add_options_page('Word Count Settings', 'Word Count', 'manage_options', 'word-count-settings-page', 'callBackFunction'); // use array($this, 'ourHTML') is for Class based approach
  }
```

2. go to our-first-unique-plugin for reference

######################

# Form setting and setting API

1. Save the prefrences on the database
2. Local app - goto database open adminer
3. go to table wp_options > Selec data

#####################

# Class WordCountAndTimePlugin - function settings() steps in backward (static)

// add this function in reverse register_settings at last

1. register_setting()
2. add_settings_field()
3. add_settings_section

#######################

# counting the words, Characters, and Read time

1.                       add_filter('the_content', array($this, 'ifWrap'));

# Translations/ Localization(for PHP)

1. Start at top by adding in the commented code - Text Domain: wcpdomain AND Domain Path: /languages

```php
/*
  Plugin Name: Our Test Plugin
  Description: A truly amazing plugin.
  Version: 1.0
  Author: Mark
  Author URI: markLPL.com
  Text Domain: wcpdomain
  Domain Path: /languages
*/
```

2. change FROM add_options_page('Word Count Settings', 'Word Count')
   TO

```php
  add_options_page('Word Count Settings', __('Word Count', 'wcpdomain'))
```

3. install Loco Translate plugin
   - create template

# 2nd plugin - Sub-menu & Custom Icon - Word filter plugin

1. create plugin folder - word-filter-plugin
2. custom admin menu icon / css

- custom svg
- in browser console type the following to convert svg to base64
  - btoa(`INSERT HERE THE <SVG></SVG>`) and hit enter

3. Load custom css in this particular admin page

# 2nd plugin - Manually Handing Admin Form Submit

- Key points
  - <?php if (isset($_POST['justsubmitted']) == "true") $this->handleForm() ?>
  - <?php wp_nonce_field('saveFilterWords', 'ourNonce') ?>
  - if (wp_verify_nonce($\_POST['ourNonce'], 'saveFilterWords') AND current_user_can('manage_options')) {
  - update_option('plugin_words_to_filter', sanitize_text_field($\_POST['plugin_words_to_filter'])); ?>

# 2nd plugin - Finish

1. go to \_\_construct()


    - add_filter('the_content', array($this, 'filterLogic'));
    - if (get_option('plugin_words_to_filter')) add_filter('the_content', array($this, 'filterLogic'));

Key Points

- function filterLogic($content) {
- $badWords = explode(',', get_option('plugin_words_to_filter'));
- $badWordsTrimmed = array_map('trim', $badWords);
- return str_ireplace($badWordsTrimmed, esc_html(get_option('replacementText', '\*\*\*\*')), $content);
- function optionsSubPage() { ?>

```php

```

```php

```

```php

```

```php

```

```php

```

```php

```

```php

```

```php

```

```php

```

```php

```

```php

```

```php

```

```php

```

```php

```

```php

```

```php

```

```php

```

```php

```

```php

```

```php

```

```php

```
