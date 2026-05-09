<?php
/**
 * Front page – 3D rotating photo carousel + tilt gallery.
 *
 * @package Aperture3D
 */

get_header();

$site_tag = get_bloginfo( 'description', 'display' );
?>

<section class="a3d-hero" id="a3d-hero">
    <div class="a3d-loading" id="a3d-loading">
        <?php esc_html_e( 'Loading gallery', 'aperture3d' ); ?>
    </div>
    <canvas id="a3d-canvas" aria-label="<?php esc_attr_e( '3D rotating photo carousel', 'aperture3d' ); ?>"></canvas>

    <div class="a3d-hero-overlay">
        <h1><?php bloginfo( 'name' ); ?></h1>
        <?php if ( $site_tag ) : ?>
            <p><?php echo esc_html( $site_tag ); ?></p>
        <?php endif; ?>
        <span class="a3d-hint"><?php esc_html_e( 'Drag to rotate  ·  Scroll to zoom', 'aperture3d' ); ?></span>
    </div>
</section>

<?php
// Below the hero: a 3D hover gallery grid of the same photos.
$photos = aperture3d_get_photo_payload();
if ( ! empty( $photos ) ) : ?>
    <section class="a3d-gallery a3d-container">
        <h2><?php esc_html_e( 'All Photos', 'aperture3d' ); ?></h2>
        <div class="a3d-grid" id="a3d-tilt-grid">
            <?php foreach ( $photos as $photo ) : ?>
                <a class="a3d-card" href="<?php echo esc_url( $photo['url'] ); ?>">
                    <img src="<?php echo esc_url( $photo['image'] ); ?>"
                         alt="<?php echo esc_attr( $photo['title'] ); ?>"
                         loading="lazy">
                    <?php if ( ! empty( $photo['title'] ) ) : ?>
                        <span class="a3d-caption"><?php echo esc_html( $photo['title'] ); ?></span>
                    <?php endif; ?>
                </a>
            <?php endforeach; ?>
        </div>
    </section>
<?php else : ?>
    <section class="a3d-container" style="padding: 6rem 0; text-align: center;">
        <h2><?php esc_html_e( 'Your gallery is empty', 'aperture3d' ); ?></h2>
        <p style="color:#9a9aa0;">
            <?php
            printf(
                /* translators: %s: link to the new photo admin screen. */
                esc_html__( 'Go to %s to add your first photo. Or simply upload images to the Media Library and they will appear here automatically.', 'aperture3d' ),
                '<a href="' . esc_url( admin_url( 'post-new.php?post_type=photo' ) ) . '">Photos → Add New</a>'
            );
            ?>
        </p>
    </section>
<?php endif; ?>

<?php get_footer();
