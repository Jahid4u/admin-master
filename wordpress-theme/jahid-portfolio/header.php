<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<div id="page-wrapper">

<?php
$nav   = jahid_get_nav_opts();
$links = json_decode($nav['links'] ?? '[]', true) ?: [
    ['label' => 'Home',    'url' => home_url('/'),         'visible' => true],
    ['label' => 'Work',    'url' => home_url('/work'),     'visible' => true],
    ['label' => 'Blog',    'url' => home_url('/blog'),     'visible' => true],
    ['label' => 'About',   'url' => home_url('/about'),    'visible' => true],
    ['label' => 'Contact', 'url' => home_url('/contact'),  'visible' => true],
];
$links = array_filter($links, fn($l) => !empty($l['visible']));
$current_url = (is_ssl() ? 'https' : 'http') . '://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
?>

<nav class="jahid-nav" id="jahid-nav" aria-label="Main navigation">

    <?php if (!empty($nav['brand_enabled'])): ?>
    <div class="jahid-nav-brand">
        <span class="jahid-nav-brand-name"><?= esc_html($nav['brand_name'] ?? 'Jahid Hasan') ?></span>
        <span class="jahid-nav-brand-loc"><?= esc_html($nav['brand_location'] ?? 'Dhaka, Bangladesh') ?></span>
    </div>
    <?php endif; ?>

    <?php if (!empty($nav['time_enabled'])): ?>
    <div class="jahid-nav-time">
        <span class="jahid-clock" data-tz="<?= esc_attr($nav['time_timezone'] ?? 'Asia/Dhaka') ?>">--:--:--</span>
        <span class="jahid-nav-time-label"><?= esc_html($nav['time_label'] ?? 'LOCAL TIME (GMT+6)') ?></span>
    </div>
    <?php endif; ?>

    <div class="jahid-nav-pill" id="jahid-nav-pill">
        <div class="jahid-nav-scroll-bar"><div class="jahid-nav-scroll-progress" id="scroll-progress"></div></div>
        <div class="jahid-nav-sweep"></div>

        <?php if (!empty($nav['avatar_enabled'])): ?>
        <div class="jahid-nav-avatar-wrap">
            <img src="<?= esc_url($nav['avatar_url'] ?: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200') ?>" alt="Avatar" class="jahid-nav-avatar">
        </div>
        <div class="jahid-nav-divider"></div>
        <?php endif; ?>

        <div class="jahid-nav-links">
            <?php foreach ($links as $i => $link):
                $is_home = ($link['url'] === home_url('/') || $link['url'] === '/');
                $path    = wp_make_link_relative($link['url']);
                $cur     = wp_make_link_relative($current_url);
                $active  = $is_home ? ($cur === '/') : str_starts_with($cur, $path);
            ?>
            <a href="<?= esc_url($link['url']) ?>" class="jahid-nav-link <?= $active ? 'is-active' : '' ?>" aria-label="<?= esc_attr($link['label']) ?>">
                <span class="jahid-nav-link-icon"><?= jahid_nav_icon($link['label']) ?></span>
                <span class="jahid-nav-link-text"><?= esc_html($link['label']) ?></span>
                <?php if ($active): ?><div class="jahid-nav-active-pill"></div><?php endif; ?>
            </a>
            <?php if ($i < count($links) - 1): ?><div class="jahid-nav-sep"></div><?php endif; ?>
            <?php endforeach; ?>
        </div>

        <div class="jahid-nav-divider"></div>

        <?php if (!empty($nav['theme_toggle_enabled'])): ?>
        <button class="jahid-theme-toggle" id="theme-toggle" aria-label="Toggle theme">
            <span class="jahid-theme-icon jahid-icon-sun">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
            </span>
            <span class="jahid-theme-icon jahid-icon-moon">
                <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            </span>
        </button>
        <?php endif; ?>

        <?php if (!empty($nav['cta_enabled'])): ?>
        <div class="jahid-nav-divider hidden-sm"></div>
        <div class="jahid-nav-cta-wrap hidden-sm">
            <a href="<?= esc_url($nav['cta_url'] ?? home_url('/contact')) ?>" class="jahid-nav-cta">
                <?= esc_html($nav['cta_label'] ?? 'Connect') ?>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="10" height="10"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
        </div>
        <?php endif; ?>
    </div>
</nav>

<div id="mouse-glow" class="jahid-mouse-glow" aria-hidden="true"></div>

<?php
function jahid_nav_icon($label) {
    $l = strtolower($label);
    if ($l === 'home')    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="12" height="12"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>';
    if (str_contains($l, 'work') || str_contains($l, 'portfolio')) return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="12" height="12"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>';
    if (str_contains($l, 'blog') || str_contains($l, 'journal')) return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="12" height="12"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>';
    if (str_contains($l, 'about')) return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="12" height="12"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
    if (str_contains($l, 'contact')) return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="12" height="12"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22 6 12 13 2 6"/></svg>';
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="12" height="12"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>';
}
?>
