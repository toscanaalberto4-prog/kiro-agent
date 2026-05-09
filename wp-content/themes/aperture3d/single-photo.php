<?php
/**
 * Single photo view – floating 3D frame with metadata.
 *
 * @package Aperture3D
 */

get_header(); ?>

<?php while ( have_posts() ) : the_post(); ?>
    <article <?php post_class( 'a3d-single' ); ?>>
        <div class="a3d-single-frame">
            <?php if ( has_post_thumbnail() ) : ?>
                <?php the_post_thumbnail( 'full', array(
                    'alt' => esc_attr( get_the_title() ),
                ) ); ?>
            <?php endif; ?>
        </div>

        <div class="a3d-single-meta">
            <h1><?php the_title(); ?></h1>

            <?php
            $terms = get_the_term_list( get_the_ID(), 'photo_category', '', ', ', '' );
            if ( $terms && ! is_wp_error( $terms ) ) : ?>
                <p style="color:#9a9aa0; letter-spacing:.2em; text-transform:uppercase; font-size:.75rem;">
                    <?php echo wp_kses_post( $terms ); ?>
                </p>
            <?php endif; ?>

            <?php if ( get_the_content() ) : ?>
                <div class="a3d-single-content" style="margin-top:1.5rem; color:#cfcfd4;">
                    <?php the_content(); ?>
                </div>
            <?php endif; ?>

            <p style="margin-top:3rem;">
                <a href="<?php echo esc_url( get_post_type_archive_link( 'photo' ) ); ?>">
                    &larr; <?php esc_html_e( 'Back to gallery', 'aperture3d' ); ?>
                </a>
            </p>
        </div>
    </article>
<?php endwhile; ?>

<?php get_footer();
