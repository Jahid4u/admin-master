<?php
/**
 * Template Name: Privacy Policy
 */
$opts = get_option('jahid_site_privacy', []);
get_header();
?>
<main class="jahid-main">
<div class="jahid-prose-page">
    <div class="jahid-prose-inner">
        <h1><?= esc_html($opts['title'] ?? 'Privacy Policy') ?></h1>
        <div class="prose"><?= wp_kses_post($opts['content'] ?? '<p>Privacy policy content goes here.</p>') ?></div>
    </div>
</div>
</main>
<?php get_footer(); ?>
