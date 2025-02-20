<?php
  if(!is_user_logged_in()) {
    wp_redirect(esc_url(site_url('/')));
    exit; // don't load WP/service resources 
  }

  get_header();

  while(have_posts()) {
    the_post();
    pageBanner(); ?>

    <div class="container container--narrow page-section">
      <form class="create-note">
        <h2 class="headline headline--medium">Create New Note</h2>
        <input class="new-note-title" type="text" placeholder="Title" required>
        <textarea class="new-note-body" placeholder="Your note here..." required></textarea>
        <button type='submit' class="submit-note">Create Note</button>
        <span class="note-limit-message">Note Limit Reached: delete existing note to add a new note</span>
        <span class="note-empty-message">Please fill the empty field.</span>
      </form>
       <ul class="min-list link-list" id="my-notes">
          <?php 
            $userNotes = new WP_Query(array(
              'post_type' => 'note',
              'posts_per_page' => -1, // all notes
              'author' => get_current_user_id() // get the current user id // USER SPECIFIC NOTES
            ));

            while($userNotes->have_posts()) {
              $userNotes->the_post(); 
              
              // str_replace replace prefix 'Private: ' to empty ''
              ?>
              <li data-id="<?php echo the_id(); ?>">
                <input readonly class="note-title-field" value="<?php echo str_replace('Private: ', '', esc_attr(get_the_title())); ?>"> 
                <span class="edit-note"><i class="fa fa-pencil" aria-hidden="true"></i> Edit</span>
                <span class="delete-note"><i class="fa fa-trash-o" aria-hidden="true"></i> Delete</span>
                <textarea readonly class="note-body-field"><?php echo esc_attr(wp_strip_all_tags(get_the_content())); ?></textarea>
                <span class="update-note btn btn--blue btn--small"><i class="fa fa-arrow-right" aria-hidden="true"></i> Save</span>
              </li>
              <?php 
              

              // str_replace()
              // str_replace(a, b),
              // a - the string to search for
              // b - the string to replace a with
              // This function is used to replace all occurrences of a specified string with another string in a given string. It is particularly useful for modifying text or data in PHP, such as removing unwanted characters or formatting data in a specific way.

              
              // wp_strip_all_tags()
               
              // function in WordPress is used to remove all HTML and PHP tags from a given string. This function is particularly useful for sanitizing user input or content that will be displayed on the front end of a website, ensuring that no potentially harmful or unwanted tags are included. -->

              
              // esc_attr()
              
              // function in WordPress is used to sanitize and escape attribute values before they are output in HTML. This function ensures that any special characters in the attribute value are properly encoded, preventing potential security vulnerabilities such as cross-site scripting (XSS) attacks.

              // When you use esc_attr, it converts characters like <, >, ", ', and & into their corresponding HTML entities. This makes the attribute value safe to include within HTML tags, as it prevents the browser from interpreting any potentially harmful code.?>

          <?php  }
          ?>
       </ul>
    </div>
     
  <?php }
  get_footer();
?>