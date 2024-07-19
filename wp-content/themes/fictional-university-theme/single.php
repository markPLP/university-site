<?php 
  get_header();

  while(have_posts()) {
     the_post(); ?> <!-- ?> breaking php to go html mode -->
    <h2><?php the_title(); ?></h2>
    <?php the_content(); ?>
    <hr>
  <?php }
  get_footer();
?>