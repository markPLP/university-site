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
          <a class="metabox__blog-home-link" href="<?php echo get_post_type_archive_link('program'); ?>">
            <i class="fa fa-home" aria-hidden="true"></i> All Programs</a>
          <span class="metabox__main"><?php the_title(); ?></span>
        </p>
      </div>
      <div class="generic-content"><?php the_field('main_body_content'); ?></div>
      

      <?php 
          // Display related Professor
          $relatedProfessor = new WP_Query(array(
            'post_type' => 'professor',
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
                  'key' => 'related_programs', 
                  'compare' => 'LIKE',
                  'value' => '"' . get_the_ID() . '"' // not true array - use open/close quotes "get_the_ID()"
                )
            )            
          ));
          
          if ($relatedProfessor->have_posts()) { // check if there professor post
            echo '<hr class="section-break">';
            echo '<h2 class="headline headline--medium">' . get_the_title() . ' Professor(s)</h2>';
            echo '<ul class="professor-cards">';
            while($relatedProfessor->have_posts()) {
              $relatedProfessor->the_post(); ?>
              <li class="professor-card__list-item">
                <a class="professor-card" href="<?php the_permalink(); ?>">
                  <img class="professor-card__image "src="<?php the_post_thumbnail_url('professorLandscape'); ?>" alt="<?php the_title(); ?>">
                  <span class="professor-card__name"><?php the_title(); ?></span>
                </a>
              </li>
            <?php } 
            echo '</ul>';
           
          }

          wp_reset_postdata(); // good practice to RESET the query, every time you use a custom query

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

             wp_reset_postdata(); // good practice to RESET the query, every time you use a custom query
            
            
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
  get_footer();
?>
