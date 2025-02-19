<?php
  
  get_header();

  while(have_posts()) {
    the_post();
    pageBanner();
     ?>

    <div class="container container--narrow page-section">
          <div class="metabox metabox--position-up metabox--with-home-link">
        <p>
          <!-- get_post_type_archive_link  get the link of the custom post type ie The EVENT post archive-->
          <a class="metabox__blog-home-link" href="<?php echo get_post_type_archive_link('event'); ?>">
            <i class="fa fa-home" aria-hidden="true"></i> Events Home</a> 
            <span class="metabox__main"><?php the_title(); ?></span></p>
      </div>

      <div class="generic-content"><?php the_content(); ?></div>

      <?php
        // display relationship field related programs custom field - advanced custom fields
        // get_field('related_programs') returns an array of post objects that are related to the current post
        $relatedPrograms = get_field('related_programs');
        // print_r($relatedPrograms); // like console.log in javascript
        
        // check if there are related programs to display 
        // if there are related programs display them
        // if not do nothing
        if ($relatedPrograms) {
          echo '<hr class="section-break">';
          echo '<h2 class="headline headline--medium">Related Program(s)</h2>';
          echo '<ul class="link-list min-list">';
          // loop through the related programs and display them
          foreach($relatedPrograms as $program) { ?>
            <li><a href="<?php echo get_the_permalink($program); ?>"><?php echo get_the_title($program); ?></a></li>
          <?php }
          echo '</ul>';
        }

      ?>

    </div>
    

    
  <?php }

  get_footer();

?>