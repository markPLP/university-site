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
                    'value' => get_the_ID() // 38 - get the current post id (professor id
                  )
                ),
              ));

              // make heart color-fill if there is existing liked post
              $existStatus = 'no';
              
              // check if the user is logged in
              // if not logged in, the heart icon will be empty
              if(is_user_logged_in()) {
                // check if the liked_professor_id is already liked by the current user
                $existQuery = new WP_Query(array(
                  'author' => get_current_user_id(), // get the userID of the current user who liked the post
                  'post_type' => 'like',
                  'meta_query' => array(
                    array(
                      'key' => 'liked_professor_id',
                      'compare' => 'LIKE',
                      'value' => get_the_ID()
                    )
                  ),
                ));

                // if the post is already liked by the current user 
                // if it's greater than zero, this will evaluate to true.
                // if true existStatus will be 'yes'
                if($existQuery->found_posts) {
                  $existStatus = 'yes';
                }
                }

            ?>
            <?php 
              // data-exists="<?php echo $existStatus; - custom attribute
              // this will be used in the javascript to check if the post is already liked or not
              // if yes, the heart icon will be filled with color
              // data-like="<?php echo $existQuery->posts[0]->ID; 
              // custom attribute This will be the ID of the like post we want to delete if the user clicks the heart icon again.
              // isset($existQuery->posts[0]->ID): The isset function checks if the ID property of the first element in the posts array of the $existQuery object is set and not null. This ensures that the code only proceeds if the ID property exists.
            ?>
            <span class="like-box" data-like="<?php if (isset($existQuery->posts[0]->ID)) echo $existQuery->posts[0]->ID; ?>" data-professor="<?php the_ID(); ?>" data-exists="<?php echo $existStatus; ?>">
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
