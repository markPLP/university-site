<?php get_header(); ?>

<div class="page-banner">
      <div class="page-banner__bg-image" style="background-image: url(<?php echo get_theme_file_uri('/images/library-hero.jpg'); ?>)"></div>
      <div class="page-banner__content container t-center c-white">
        <h1 class="headline headline--large">Welcome!</h1>
        <h2 class="headline headline--medium">We think you&rsquo;ll like it here.</h2>
        <h3 class="headline headline--small">Why don&rsquo;t you check out the <strong>major</strong> you&rsquo;re interested in?</h3>
        <a href="#" class="btn btn--large btn--blue">Find Your Major</a>
      </div>
    </div>

    <div class="full-width-split group">
      <div class="full-width-split__one">
        <div class="full-width-split__inner">
          <h2 class="headline headline--small-plus t-center">Upcoming Events!</h2>
          <!-- display only upcoming events -->
          <?php 
            $today = date('Ymd');
            $homepageEvents = new WP_Query(array( // new instance of the wp_query class variable/object $homepageEvents
              'post_type' => 'event',
              'posts_per_page' => 2, // -1 display all events
               // 'order' => 'post_date', // order by post date - DEFAULT
               // 'orderby' => 'rand', // order randomly
              'order' => 'DECS', // default is DESC
              // meta_key and meta_value_num should be set up first before using meta_query
              // these two are required to use meta_query
              'meta_key' => 'event_date', // is a custom field - if setting up meta value make sure to add meta_key first 
              'orderby' => 'meta_value_num', // we used meta_value_num because event_date is a checking on date/number
              'meta_query' => array(
                  array( // read as - if key is >= to $today
                    'key' => 'event_date',
                    'compare' => '>=',
                    'value' => $today,
                    'type' => 'numeric' // type numeric is used for date - string is for text
                  )
                  // could add more array for more conditions
                  // array(),
                  // array()  
              )            
            ));

            if($homepageEvents->have_posts()) {
               while($homepageEvents->have_posts()) { // keep repeating the loop until there are no more posts to show
              $homepageEvents->the_post();
              // 2nd argument is the template part file name - dynamic template part
             // get_template_part('template-parts/content', get_post_type()); 
              get_template_part('template-parts/content', 'event'); // get the content-event.php
            } 
            } else {
                 echo '<p class="t-center">No upcoming events yet...</p>';
            }
           
          ?>
          <p class="t-center no-margin"><a href="<?php echo get_post_type_archive_link('event'); ?>" class="btn btn--blue">View All Events</a></p>
        </div>
      </div>
      <div class="full-width-split__two">
        <div class="full-width-split__inner">
          <h2 class="headline headline--small-plus t-center">From Our Blogs</h2>
          <?php 
              // start with a variable fo class WP_Query
              $homePagePosts = new WP_Query(array(
                'post_type' => 'post',
                'posts_per_page' => 2
              ));
              
              // point the new object $homePagePosts
              while ($homePagePosts->have_posts()) {
                $homePagePosts->the_post(); ?>
                <div class="event-summary">
                  <a class="event-summary__date event-summary__date--beige t-center" href="<?php echo the_permalink(); ?>">
                    <span class="event-summary__month"><?php the_time('M'); ?></span>
                    <span class="event-summary__day"><?php the_time('d'); ?></span>
                  </a>
                  <div class="event-summary__content">
                    <h5 class="event-summary__title headline headline--tiny"><a href="<?php echo the_permalink(); ?>"><?php the_title(); ?></a></h5>
                    <p>
                       <!-- if there is an excerpt show it, if not trim the content to 18 words -->
                      <?php if (has_excerpt()) {
                      echo get_the_excerpt(); // get_the_excerpt removes html tags vs the_excerpt
                    } else {
                      // trims words to 18
                      echo wp_trim_words(get_the_content(), 18);
                    }; ?><a href="<?php echo the_permalink(); ?>" class="nu gray"> Read more</a></p>
                  </div>
                </div>
              <?php } wp_reset_postdata(); // good practice to RESET the query
          ?>
          <p class="t-center no-margin"><a href="<?php echo site_url('/blog'); ?>" class="btn btn--yellow">View All Blog Posts</a></p>
        </div>
      </div>
    </div>

    <div class="hero-slider">
      <div data-glide-el="track" class="glide__track">
        <div class="glide__slides">
          <div class="hero-slider__slide" style="background-image: url(<?php echo get_theme_file_uri('/images/bus.jpg'); ?>)">
            <div class="hero-slider__interior container">
              <div class="hero-slider__overlay">
                <h2 class="headline headline--medium t-center">Free Transportation</h2>
                <p class="t-center">All students have free unlimited bus fare.</p>
                <p class="t-center no-margin"><a href="#" class="btn btn--blue">Learn more</a></p>
              </div>
            </div>
          </div>
          <div class="hero-slider__slide" style="background-image: url(<?php echo get_theme_file_uri('images/apples.jpg'); ?>)">
            <div class="hero-slider__interior container">
              <div class="hero-slider__overlay">
                <h2 class="headline headline--medium t-center">An Apple a Day</h2>
                <p class="t-center">Our dentistry program recommends eating apples.</p>
                <p class="t-center no-margin"><a href="#" class="btn btn--blue">Learn more</a></p>
              </div>
            </div>
          </div>
          <div class="hero-slider__slide" style="background-image: url(<?php echo get_theme_file_uri('/images/bread.jpg')?>)">
            <div class="hero-slider__interior container">
              <div class="hero-slider__overlay">
                <h2 class="headline headline--medium t-center">Free Food</h2>
                <p class="t-center">Fictional University offers lunch plans for those in need.</p>
                <p class="t-center no-margin"><a href="#" class="btn btn--blue">Learn more</a></p>
              </div>
            </div>
          </div>
        </div>
        <div class="slider__bullets glide__bullets" data-glide-el="controls[nav]"></div>
      </div>
    </div>

<?php get_footer(); ?>