<?php
/**
 * Template Name: Terms of Service
 */
$opts = get_option('jahid_site_terms', []);
get_header();
?>
<main class="jahid-main">
<div class="jahid-prose-page">
    <div class="jahid-prose-inner">
        <h1><?= esc_html($opts['title'] ?? 'Terms of Service') ?></h1>
        <div class="prose"><?= wp_kses_post($opts['content'] ?? '<p>Terms of service content goes here.</p>') ?></div>
    </div>
</div>
</main>
<?php get_footer(); ?>
