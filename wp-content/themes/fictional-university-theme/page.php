<?php

  get_header();

  while(have_posts()) {
    the_post();
    pageBanner();
     ?>
    
    

    <div class="container container--narrow page-section">
    <!-- wp_get_post_parent_id(get_the_ID()) GET THE ID OF THE PARENT IF TRUE -->
    <?php
    // ID of the parent page
      $theParent = wp_get_post_parent_id(get_the_ID());
    // if parent is true display breadcrumbs metabox
      if ($theParent) { ?>
        <div class="metabox metabox--position-up metabox--with-home-link">
      <p><a class="metabox__blog-home-link" href="<?php echo get_permalink($theParent); ?>"><i class="fa fa-home" aria-hidden="true"></i> Back to <?php echo get_the_title($theParent); ?></a> <span class="metabox__main"><?php the_title(); ?></span></p>
    </div>
      <?php }
    ?>

    
    
    <?php 
    $testArray = get_pages(array( // this will check if page is a parent if not it will return 0/false
      'child_of' => get_the_ID()
    ));

    if ($theParent or $testArray) { ?> <!-- display only when page has child/ren or a parent -->
    <div class="page-links">           <!-- Also this will not display if page has no child -->
      <h2 class="page-links__title"><a href="<?php echo get_permalink($theParent); ?>"><?php echo get_the_title($theParent); ?></a></h2>
      <ul class="min-list">
        <?php
        // display the children of the parent page,
        // if the page is a child, use get_the_ID to display all child siblings
          if ($theParent) { // $theParent - check if there are children
            $findChildrenOf = $theParent;
          } else {
            $findChildrenOf = get_the_ID(); // if child has no parent, get the parent ID
          } 

          wp_list_pages(array(
            'title_li' => NULL, // removes the pages title of the list
            'child_of' => $findChildrenOf, // display the children of the ID 
            'sort_column' => 'menu_order' // sort menu items by order attribute of the page setting
          ));
        ?>
      </ul>
    </div>
    <?php } ?>
    

    <div class="generic-content">
      <?php the_content(); ?>
    </div>

  </div>
    
  <?php }

  get_footer();

?>