<?php
/**
 * Template helper functions
 */
defined('ABSPATH') || exit;

function jahid_get_theme() {
    if (isset($_COOKIE['jahid_theme'])) return $_COOKIE['jahid_theme'] === 'light' ? 'light' : 'dark';
    return jahid_get_option('default_theme', 'dark');
}

function jahid_get_nav_opts() {
    return get_option('jahid_navigation', []) + [
        'brand_name'          => 'Jahid Hasan',
        'brand_location'      => 'Dhaka, Bangladesh',
        'brand_enabled'       => '1',
        'avatar_enabled'      => '1',
        'avatar_url'          => '',
        'theme_toggle_enabled'=> '1',
        'cta_enabled'         => '1',
        'cta_label'           => 'Connect',
        'cta_url'             => '/contact',
        'time_enabled'        => '1',
        'time_label'          => 'LOCAL TIME (GMT+6)',
        'time_timezone'       => 'Asia/Dhaka',
        'links'               => '[]',
    ];
}

function jahid_get_socials() {
    $opts    = get_option('jahid_site_social', []);
    $socials = json_decode($opts['socials'] ?? '[]', true) ?: [];
    return array_filter($socials, fn($s) => !empty($s['enabled']));
}

function jahid_get_footer_opts() {
    return get_option('jahid_site_footer', []) + [
        'brand_name'          => 'Jahid Hasan',
        'tagline'             => 'Crafting digital experiences with purpose.',
        'copyright'           => '© ' . date('Y') . ' Jahid Hasan. All rights reserved.',
        'newsletter_enabled'  => '1',
        'newsletter_headline' => 'Stay in the loop',
        'newsletter_desc'     => 'Get my latest articles and projects delivered to your inbox.',
    ];
}

function jahid_get_projects($limit = -1) {
    return get_posts([
        'post_type'      => 'project',
        'posts_per_page' => $limit,
        'meta_key'       => '_project_sort_order',
        'orderby'        => 'meta_value_num',
        'order'          => 'ASC',
        'meta_query'     => [[
            'key'     => '_project_published',
            'value'   => '1',
            'compare' => '=',
        ]],
    ]);
}

function jahid_get_project_meta($post_id) {
    $fields = ['category','year','client','timeline','role','sort_order','cover','live_url','repo_url',
                'overview','challenge','solution','tags','tech','results','meta_title','meta_description',
                'og_image','published'];
    $meta = [];
    foreach ($fields as $f) {
        $meta[$f] = get_post_meta($post_id, '_project_' . $f, true);
    }
    $meta['tags']    = json_decode($meta['tags'] ?: '[]', true) ?: [];
    $meta['tech']    = json_decode($meta['tech'] ?: '[]', true) ?: [];
    $meta['results'] = json_decode($meta['results'] ?: '[]', true) ?: [];
    return $meta;
}

function jahid_social_icon($label) {
    $l = strtolower($label);
    if (str_contains($l, 'twitter') || str_contains($l, ' x ')) return '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.261 5.632 5.903-5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>';
    if (str_contains($l, 'linkedin')) return '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>';
    if (str_contains($l, 'github'))   return '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>';
    if (str_contains($l, 'instagram')) return '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>';
    if (str_contains($l, 'dribbble')) return '<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.017-8.063 6.479 1.725 1.345 3.896 2.166 6.253 2.166 1.43 0 2.808-.315 4.066-.895zm-11.62-2.971c.273-.56 3.517-6.635 8.873-8.297.144-.048.29-.09.436-.130-.28-.630-.579-1.21-.898-1.77C7.778 10.15 2.886 10.011 2.44 10c-.003.065-.006.13-.006.196 0 2.4.87 4.6 2.31 6.278zm-.96-8.497c.457.013 4.687.083 8.236-1.13C10.27 7.16 8.917 5.12 7.474 3.27c-2.68 1.27-4.687 3.682-5.27 6.644zm7.26-7.14C8.81 5.12 10.19 7.19 11.664 8.97c2.966-1.113 4.22-2.8 4.372-3.003-1.39-1.235-3.203-1.984-5.196-1.984-.407 0-.808.038-1.2.104zm8.098 1.898c-.19.224-1.6 2.042-4.696 3.32.195.402.384.81.56 1.217.061.146.12.293.18.44 3.38-.424 6.75.257 7.085.324-.03-2.065-.747-3.965-1.928-5.43l-.201.129z"/></svg>';
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>';
}

function jahid_read_time($content) {
    $words = str_word_count(strip_tags($content));
    $mins  = max(1, round($words / 200));
    return $mins . ' min read';
}

function jahid_output_head_meta($page = 'home') {
    $seo      = get_option('jahid_site_seo', []);
    $page_seo = get_option('jahid_site_page_seo', []);
    $title    = $page_seo[$page . '_title'] ?: $seo['site_title'] ?: get_bloginfo('name');
    $desc     = $page_seo[$page . '_description'] ?: $seo['meta_description'] ?: '';
    $og_img   = $page_seo[$page . '_og_image'] ?: $seo['og_image'] ?: '';

    if ($desc)   echo '<meta name="description" content="' . esc_attr($desc) . '">' . "\n";
    if ($title)  echo '<meta property="og:title" content="' . esc_attr($title) . '">' . "\n";
    if ($desc)   echo '<meta property="og:description" content="' . esc_attr($desc) . '">' . "\n";
    if ($og_img) echo '<meta property="og:image" content="' . esc_url($og_img) . '">' . "\n";
    echo '<meta property="og:type" content="website">' . "\n";
    if (!empty($seo['twitter_handle'])) {
        echo '<meta name="twitter:card" content="summary_large_image">' . "\n";
        echo '<meta name="twitter:site" content="@' . esc_attr(ltrim($seo['twitter_handle'], '@')) . '">' . "\n";
    }
}
