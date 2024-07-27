<?php 
  get_header();

  while(have_posts()) {
    the_post(); 
    pageBanner();
    ?> <!-- ?> breaking php to go html mode -->
    <div class="container container--narrow page-section">
      <div class="genetic-content">
        <div class="row group">
          <div class="one-third">
            <?php echo the_post_thumbnail('professorPortrait'); ?>  
          </div>  
          <div class="two-thirds">
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
