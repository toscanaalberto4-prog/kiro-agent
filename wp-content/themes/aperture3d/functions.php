<?php
/**
 * Aperture3D theme functions.
 *
 * @package Aperture3D
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

define( 'APERTURE3D_VERSION', '1.1.0' );

/**
 * Theme setup.
 */
function aperture3d_setup() {
    load_theme_textdomain( 'aperture3d', get_template_directory() . '/languages' );

    add_theme_support( 'title-tag' );
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'automatic-feed-links' );
    add_theme_support( 'html5', array( 'search-form', 'gallery', 'caption', 'style', 'script' ) );
    add_theme_support( 'custom-logo' );
    add_theme_support( 'responsive-embeds' );
    add_theme_support( 'align-wide' );

    // Custom image size for the 3D carousel (power-of-two friendly for Three.js textures).
    add_image_size( 'aperture3d-carousel', 1024, 1024, false );
    add_image_size( 'aperture3d-card',     800,  1000, true  );

    register_nav_menus( array(
        'primary' => __( 'Primary Menu', 'aperture3d' ),
    ) );
}
add_action( 'after_setup_theme', 'aperture3d_setup' );

/**
 * Register the "Photo" custom post type.
 */
function aperture3d_register_photo_cpt() {
    $labels = array(
        'name'               => __( 'Photos',      'aperture3d' ),
        'singular_name'      => __( 'Photo',       'aperture3d' ),
        'add_new'            => __( 'Add New',     'aperture3d' ),
        'add_new_item'       => __( 'Add New Photo',     'aperture3d' ),
        'edit_item'          => __( 'Edit Photo',        'aperture3d' ),
        'new_item'           => __( 'New Photo',         'aperture3d' ),
        'view_item'          => __( 'View Photo',        'aperture3d' ),
        'search_items'       => __( 'Search Photos',     'aperture3d' ),
        'not_found'          => __( 'No photos found',   'aperture3d' ),
        'not_found_in_trash' => __( 'No photos in Trash','aperture3d' ),
        'menu_name'          => __( 'Photos',      'aperture3d' ),
    );

    register_post_type( 'photo', array(
        'labels'             => $labels,
        'public'             => true,
        'publicly_queryable' => true,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'show_in_rest'       => true,
        'menu_position'      => 5,
        'menu_icon'          => 'dashicons-camera-alt',
        'has_archive'        => true,
        'rewrite'            => array( 'slug' => 'photos' ),
        'supports'           => array( 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields' ),
    ) );

    register_taxonomy( 'photo_category', 'photo', array(
        'labels' => array(
            'name'          => __( 'Photo Categories', 'aperture3d' ),
            'singular_name' => __( 'Photo Category',   'aperture3d' ),
        ),
        'hierarchical'      => true,
        'public'            => true,
        'show_ui'           => true,
        'show_in_rest'      => true,
        'show_admin_column' => true,
        'rewrite'           => array( 'slug' => 'photo-category' ),
    ) );
}
add_action( 'init', 'aperture3d_register_photo_cpt' );

/**
 * Enqueue theme scripts & styles.
 */
function aperture3d_enqueue_assets() {
    // Main stylesheet.
    wp_enqueue_style(
        'aperture3d-style',
        get_stylesheet_uri(),
        array(),
        APERTURE3D_VERSION
    );

    // Three.js (CDN ESM build via classic script wrapper).
    wp_enqueue_script(
        'threejs',
        'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js',
        array(),
        '0.160.0',
        true
    );

    // Theme gallery script (depends on three).
    wp_enqueue_script(
        'aperture3d-gallery',
        get_template_directory_uri() . '/assets/js/three-gallery.js',
        array( 'threejs' ),
        APERTURE3D_VERSION,
        true
    );

    // Expose photo data to JS.
    wp_localize_script( 'aperture3d-gallery', 'Aperture3DData', array(
        'photos' => aperture3d_get_photo_payload(),
    ) );
}
add_action( 'wp_enqueue_scripts', 'aperture3d_enqueue_assets' );

/**
 * Build a JSON-safe list of every published photo (from the `photo` CPT
 * AND, as a fallback, from the standard Media Library so the site is
 * useful the instant the theme is activated).
 *
 * @return array<int, array<string, string>>
 */
function aperture3d_get_photo_payload() {
    $payload = array();

    // 1. Photos from the CPT.
    $cpt_query = new WP_Query( array(
        'post_type'      => 'photo',
        'post_status'    => 'publish',
        'posts_per_page' => 60,
        'no_found_rows'  => true,
    ) );

    if ( $cpt_query->have_posts() ) {
        foreach ( $cpt_query->posts as $post ) {
            $thumb_id = get_post_thumbnail_id( $post );
            if ( ! $thumb_id ) {
                continue;
            }
            $payload[] = array(
                'id'    => (int) $post->ID,
                'title' => get_the_title( $post ),
                'url'   => get_permalink( $post ),
                'image' => wp_get_attachment_image_url( $thumb_id, 'aperture3d-carousel' ),
            );
        }
    }
    wp_reset_postdata();

    // 2. Fallback: use the Media Library if no CPT posts exist yet.
    if ( empty( $payload ) ) {
        $attachments = get_posts( array(
            'post_type'      => 'attachment',
            'post_mime_type' => 'image',
            'post_status'    => 'inherit',
            'posts_per_page' => 30,
            'orderby'        => 'date',
            'order'          => 'DESC',
        ) );

        foreach ( $attachments as $att ) {
            $url = wp_get_attachment_image_url( $att->ID, 'large' );
            if ( ! $url ) {
                continue;
            }
            $payload[] = array(
                'id'    => (int) $att->ID,
                'title' => get_the_title( $att ),
                'url'   => wp_get_attachment_url( $att->ID ),
                'image' => $url,
            );
        }
    }

    return $payload;
}

/**
 * Small helper used in templates to output a placeholder when there are
 * no photos yet.
 */
function aperture3d_has_photos() {
    return ! empty( aperture3d_get_photo_payload() );
}
