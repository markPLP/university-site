<?php  get_header(); 

pageBanner(array(
  'title' => 'Past Events',
  'subtitle' => 'Recap of past events'
));
?>

<div class="container container--narrow page-section">
  <?php 
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
        'meta_query' => array(
            array( // read as - if key is >= to $today
              'key' => 'event_date',
              'compare' => '<',
              'value' => $today,
              'type' => 'numeric'
            )
        )    
      ));
  ?>
  <?php while($pastEvents->have_posts()) {
      $pastEvents->the_post(); 
      get_template_part('/template-parts/content-event');

    } wp_reset_postdata(); // good practice to RESET the query
  echo paginate_links(array( // add custom query parameter for pagination
                             // by default on this page returns only the past event page
    'total' => $pastEvents->max_num_pages
  ));
  ?> 
</div>
<?php get_footer(); ?>