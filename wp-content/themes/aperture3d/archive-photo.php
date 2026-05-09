<?php
/**
 * Archive template for the "photo" CPT – 3D tilt gallery grid.
 *
 * @package Aperture3D
 */

get_header(); ?>

<section class="a3d-gallery a3d-container" style="padding-top: 7rem;">
    <h2>
        <?php
        if ( is_tax( 'photo_category' ) ) {
            single_term_title();
        } else {
            esc_html_e( 'Gallery', 'aperture3d' );
        }
        ?>
    </h2>

    <?php if ( have_posts() ) : ?>
        <div class="a3d-grid">
            <?php while ( have_posts() ) : the_post(); ?>
                <?php if ( has_post_thumbnail() ) : ?>
                    <a class="a3d-card" href="<?php the_permalink(); ?>">
                        <?php the_post_thumbnail( 'aperture3d-card', array(
                            'loading' => 'lazy',
                            'alt'     => esc_attr( get_the_title() ),
                        ) ); ?>
                        <?php if ( get_the_title() ) : ?>
                            <span class="a3d-caption"><?php the_title(); ?></span>
                        <?php endif; ?>
                    </a>
                <?php endif; ?>
            <?php endwhile; ?>
        </div>

        <div style="text-align:center; margin-top:3rem;">
            <?php
            the_posts_pagination( array(
                'prev_text' => __( '&larr; Newer', 'aperture3d' ),
                'next_text' => __( 'Older &rarr;', 'aperture3d' ),
            ) );
            ?>
        </div>
    <?php else : ?>
        <p style="text-align:center; color:#9a9aa0;">
            <?php esc_html_e( 'No photos in this collection yet.', 'aperture3d' ); ?>
        </p>
    <?php endif; ?>
</section>

<?php get_footer();
