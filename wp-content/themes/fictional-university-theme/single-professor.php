<?php 
  get_header();

  while(have_posts()) {
    the_post(); 
    pageBanner();
    ?> <!-- ?> breaking php to go html mode -->
    <div class="container container--narrow page-section">
      <div class="generic-content">
        <div class="row group">
          <div class="one-third">
            <?php echo the_post_thumbnail('professorPortrait'); ?>  
          </div>  
          <div class="two-thirds">
            <?php 
              $likeCount = new WP_Query(array(
                'post_type' => 'like',
                'meta_query' => array(
                  array(
                    'key' => 'liked_professor_id', // custom field key
                    'compare' => 'LIKE', // exact match
                    'value' => get_the_ID()
                  )
                ),
              ));

              // make heart color-fill if there is existing liked post
              $existStatus = 'no';

              $existQuery = new WP_Query(array(
                'author' => get_current_user_id(),
                'post_type' => 'like',
                'meta_query' => array(
                  array(
                    'key' => 'liked_professor_id',
                    'compare' => 'LIKE',
                    'value' => get_the_ID()
                  )
                ),
              ));

              if($existQuery->found_posts) {
                $existStatus = 'yes';
              }

            ?>
            <span class="like-box" data-exists="<?php echo $existStatus; ?>">
              <i class="fa fa-heart-o" aria-hidden="true"></i>
              <i class="fa fa-heart" aria-hidden="true"></i>
              <span class="like-count"><?php
                // found_posts - get the total post of the matching query / no pagination
                echo $likeCount->found_posts; ?> 
               </span>
            </span>
           <?php the_content(); ?></div>
          </div>
      </div>
    <?php 

      $relatedPrograms = get_field('related_programs'); // get_field give access to advanced custom field related_programs 
      echo '<hr class="section-break">';
      if($relatedPrograms) {
        
        echo '<h2 class="headline headline--medium">Subject(s) Taught</h2>';
        echo '<ul class="link-list min-list">';
        foreach($relatedPrograms as $program) { ?>
          <li><a href="<?php echo get_the_permalink($program); ?>"><?php echo get_the_title($program); ?></a></li>
        <?php }
        echo "</ul>";
      } 
      
    ?>
    </div>
  <?php }
  get_footer();
?>
