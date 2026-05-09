<?php
/**
 * Main template – used as a safe fallback.
 *
 * @package Aperture3D
 */

get_header(); ?>

<section class="a3d-container" style="padding: 8rem 0 4rem;">
    <?php if ( have_posts() ) : ?>
        <h1><?php single_post_title(); ?></h1>
        <?php while ( have_posts() ) : the_post(); ?>
            <article <?php post_class( 'a3d-post' ); ?>>
                <h2><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
                <?php if ( has_post_thumbnail() ) the_post_thumbnail( 'large' ); ?>
                <div><?php the_excerpt(); ?></div>
            </article>
        <?php endwhile; ?>
    <?php else : ?>
        <h1><?php esc_html_e( 'Nothing here yet.', 'aperture3d' ); ?></h1>
        <p><?php esc_html_e( 'Add some Photos from the WordPress admin to populate the 3D gallery.', 'aperture3d' ); ?></p>
    <?php endif; ?>
</section>

<?php get_footer();
