<?php
/**
 * Theme footer.
 *
 * @package Aperture3D
 */
?>
</main><!-- #site-main -->

<footer class="site-footer" role="contentinfo">
    <p>
        &copy; <?php echo esc_html( date_i18n( 'Y' ) ); ?>
        <?php bloginfo( 'name' ); ?> &middot;
        <?php esc_html_e( 'Made with Aperture3D', 'aperture3d' ); ?>
    </p>
</footer>

<?php wp_footer(); ?>
</body>
</html>
