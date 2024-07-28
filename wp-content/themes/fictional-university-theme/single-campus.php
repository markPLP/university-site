<?php 
  get_header();

  while(have_posts()) {
     the_post(); 
     pageBanner();
     ?> <!-- ?> breaking php to go html mode -->

    <div class="container container--narrow page-section">
      <div class="metabox metabox--position-up metabox--with-home-link">
        <p>
          <!-- get_post_type_archive_link  get the link of the custom post type-->
          <a class="metabox__blog-home-link" href="<?php echo get_post_type_archive_link('campus'); ?>">
            <i class="fa fa-home" aria-hidden="true"></i> All Campuses</a>
          <span class="metabox__main"><?php the_title(); ?></span>
        </p>
      </div>
      <div class="genetic-content"><?php the_content(); ?></div>
      <?php 
        $mapLocation = get_field('map_location');
      ?>
      <div class="acf-map">
        <div class="marker" data-lat="<?php echo $mapLocation['lat']; ?>" data-lng="<?php echo $mapLocation['lng']; ?>">
          <h3><?php the_title(); ?></h3>
          <?php echo $mapLocation['address']?>
        </div>
      </div>
      <?php 
          // Display related Professor
          $relatedPrograms = new WP_Query(array(
            'post_type' => 'program',
            'posts_per_page' => -1, // -1 display all events
            'order' => 'DECS',
            'orderby' => 'title',
            'meta_query' => array(
                // WE DONT NEED THIS FIRST FILTER ON PROFESSOR
                // array( // read as - if key is >= to $today
                //   'key' => 'event_date',
                //   'compare' => '>=',
                //   'value' => $today,
                //   'type' => 'numeric'
                //), 
                array( // read as if the related_programs LIKE-contains this current post<get_the_ID>
                  'key' => 'related_campus', 
                  'compare' => 'LIKE',
                  'value' => '"' . get_the_ID() . '"' // not true array - use open/close quotes "get_the_ID()"
                )
            )            
          ));
          
          if ($relatedPrograms->have_posts()) { // check if there professor post
            echo '<hr class="section-break">';
            echo '<h2 class="headline headline--medium">Programs avaiable at this campus</h2>';
            echo '<ul class="min-list link-list">';
            while($relatedPrograms->have_posts()) {
              $relatedPrograms->the_post(); ?>
              <li>
                <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
              </li>
            <?php } 
            echo '</ul>';
            wp_reset_postdata(); // good practice to RESET the query
          }
      ?>
    </div>
  <?php }
  get_footer();
?>
