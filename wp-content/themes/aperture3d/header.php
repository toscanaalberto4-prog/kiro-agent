<?php
/**
 * Theme header.
 *
 * @package Aperture3D
 */
?><!doctype html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="profile" href="https://gmpg.org/xfn/11">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="site-header" role="banner">
    <div class="site-branding">
        <?php if ( has_custom_logo() ) : the_custom_logo(); else : ?>
            <p class="site-title">
                <a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home">
                    <?php bloginfo( 'name' ); ?>
                </a>
            </p>
        <?php endif; ?>
    </div>

    <nav class="main-navigation" role="navigation" aria-label="<?php esc_attr_e( 'Primary Menu', 'aperture3d' ); ?>">
        <?php
        if ( has_nav_menu( 'primary' ) ) {
            wp_nav_menu( array(
                'theme_location' => 'primary',
                'container'      => false,
                'depth'          => 1,
            ) );
        } else {
            echo '<ul>';
            echo '<li><a href="' . esc_url( home_url( '/' ) ) . '">' . esc_html__( 'Home', 'aperture3d' ) . '</a></li>';
            echo '<li><a href="' . esc_url( get_post_type_archive_link( 'photo' ) ?: home_url( '/photos' ) ) . '">' . esc_html__( 'Gallery', 'aperture3d' ) . '</a></li>';
            echo '</ul>';
        }
        ?>
    </nav>
</header>

<main id="site-main" class="site-main">
