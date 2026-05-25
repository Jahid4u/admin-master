<?php
/**
 * Jahid Portfolio Theme Functions
 */

defined('ABSPATH') || exit;

define('JAHID_VERSION', '1.0.0');
define('JAHID_DIR', get_template_directory());
define('JAHID_URI', get_template_directory_uri());

// ── Theme Setup ──────────────────────────────────────────────────────────────
add_action('after_setup_theme', function () {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', ['search-form', 'comment-form', 'comment-list', 'gallery', 'caption']);
    add_theme_support('custom-logo');
    add_theme_support('automatic-feed-links');
    add_theme_support('editor-styles');

    register_nav_menus([
        'primary' => __('Primary Navigation', 'jahid-portfolio'),
        'footer'  => __('Footer Navigation', 'jahid-portfolio'),
    ]);

    add_image_size('project-thumb', 800, 600, true);
    add_image_size('project-hero', 1600, 900, true);
    add_image_size('blog-card', 800, 600, true);
});

// ── Enqueue Assets ────────────────────────────────────────────────────────────
add_action('wp_enqueue_scripts', function () {
    wp_enqueue_style(
        'jahid-fonts',
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;600;800&family=Space+Grotesk:wght@400;600;700&family=JetBrains+Mono:wght@400;500&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap',
        [],
        null
    );
    wp_enqueue_style('jahid-main', JAHID_URI . '/assets/css/main.css', ['jahid-fonts'], JAHID_VERSION);
    wp_enqueue_script('jahid-main', JAHID_URI . '/assets/js/main.js', [], JAHID_VERSION, true);

    wp_localize_script('jahid-main', 'jahidData', [
        'ajaxUrl'  => admin_url('admin-ajax.php'),
        'nonce'    => wp_create_nonce('jahid_nonce'),
        'siteUrl'  => get_site_url(),
        'themeUrl' => JAHID_URI,
    ]);
});

// ── Admin Assets ─────────────────────────────────────────────────────────────
add_action('admin_enqueue_scripts', function ($hook) {
    if (strpos($hook, 'jahid') === false && $hook !== 'post.php' && $hook !== 'post-new.php') return;
    wp_enqueue_style('jahid-admin', JAHID_URI . '/assets/css/admin.css', [], JAHID_VERSION);
    wp_enqueue_script('jahid-admin', JAHID_URI . '/assets/js/admin.js', ['jquery', 'wp-color-picker'], JAHID_VERSION, true);
    wp_enqueue_style('wp-color-picker');
    wp_enqueue_media();
});

// ── Custom Post Type: Projects ────────────────────────────────────────────────
add_action('init', function () {
    register_post_type('project', [
        'labels' => [
            'name'               => __('Projects', 'jahid-portfolio'),
            'singular_name'      => __('Project', 'jahid-portfolio'),
            'add_new'            => __('Add New Project', 'jahid-portfolio'),
            'add_new_item'       => __('Add New Project', 'jahid-portfolio'),
            'edit_item'          => __('Edit Project', 'jahid-portfolio'),
            'all_items'          => __('All Projects', 'jahid-portfolio'),
            'view_item'          => __('View Project', 'jahid-portfolio'),
            'search_items'       => __('Search Projects', 'jahid-portfolio'),
            'not_found'          => __('No projects found', 'jahid-portfolio'),
            'not_found_in_trash' => __('No projects found in trash', 'jahid-portfolio'),
            'menu_name'          => __('Projects', 'jahid-portfolio'),
        ],
        'public'             => true,
        'has_archive'        => true,
        'rewrite'            => ['slug' => 'work'],
        'supports'           => ['title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'],
        'menu_icon'          => 'dashicons-portfolio',
        'show_in_rest'       => true,
        'menu_position'      => 5,
    ]);

    register_taxonomy('project_category', 'project', [
        'labels' => [
            'name'          => __('Project Categories', 'jahid-portfolio'),
            'singular_name' => __('Category', 'jahid-portfolio'),
            'add_new_item'  => __('Add New Category', 'jahid-portfolio'),
        ],
        'hierarchical' => true,
        'show_in_rest' => true,
        'rewrite'      => ['slug' => 'work-category'],
    ]);
});

// ── AJAX: Contact Form Submission ────────────────────────────────────────────
add_action('wp_ajax_nopriv_jahid_contact', 'jahid_handle_contact');
add_action('wp_ajax_jahid_contact',        'jahid_handle_contact');

function jahid_handle_contact() {
    check_ajax_referer('jahid_nonce', 'nonce');

    $name    = sanitize_text_field($_POST['name'] ?? '');
    $email   = sanitize_email($_POST['email'] ?? '');
    $subject = sanitize_text_field($_POST['subject'] ?? '');
    $message = sanitize_textarea_field($_POST['message'] ?? '');

    if (empty($name) || empty($email) || empty($message)) {
        wp_send_json_error(['message' => 'Please fill in all required fields.']);
    }
    if (!is_email($email)) {
        wp_send_json_error(['message' => 'Invalid email address.']);
    }

    global $wpdb;
    $table = $wpdb->prefix . 'jahid_contacts';
    $wpdb->insert($table, [
        'name'       => $name,
        'email'      => $email,
        'subject'    => $subject,
        'message'    => $message,
        'created_at' => current_time('mysql'),
        'is_read'    => 0,
    ]);

    $admin_email = get_option('admin_email');
    $smtp_to     = jahid_get_option('smtp_to_email', $admin_email);

    wp_mail(
        $smtp_to,
        'New contact: ' . $subject,
        "Name: $name\nEmail: $email\n\n$message",
        ['Content-Type: text/plain; charset=UTF-8', "Reply-To: $email"]
    );

    wp_send_json_success(['message' => 'Message sent successfully!']);
}

// ── AJAX: Newsletter Subscription ────────────────────────────────────────────
add_action('wp_ajax_nopriv_jahid_subscribe', 'jahid_handle_subscribe');
add_action('wp_ajax_jahid_subscribe',        'jahid_handle_subscribe');

function jahid_handle_subscribe() {
    check_ajax_referer('jahid_nonce', 'nonce');

    $email = sanitize_email($_POST['email'] ?? '');
    if (!is_email($email)) {
        wp_send_json_error(['message' => 'Invalid email address.']);
    }

    global $wpdb;
    $table = $wpdb->prefix . 'jahid_newsletter';
    $exists = $wpdb->get_var($wpdb->prepare("SELECT id FROM $table WHERE email = %s", $email));
    if ($exists) {
        wp_send_json_success(['message' => 'Already subscribed!']);
    }

    $wpdb->insert($table, [
        'email'      => $email,
        'created_at' => current_time('mysql'),
        'is_active'  => 1,
    ]);

    wp_send_json_success(['message' => 'Subscribed successfully!']);
}

// ── AJAX: Mark message as read ────────────────────────────────────────────────
add_action('wp_ajax_jahid_mark_read', function () {
    check_ajax_referer('jahid_nonce', 'nonce');
    if (!current_user_can('manage_options')) wp_send_json_error();
    global $wpdb;
    $id = intval($_POST['id'] ?? 0);
    $wpdb->update($wpdb->prefix . 'jahid_contacts', ['is_read' => 1], ['id' => $id]);
    wp_send_json_success();
});

add_action('wp_ajax_jahid_delete_message', function () {
    check_ajax_referer('jahid_nonce', 'nonce');
    if (!current_user_can('manage_options')) wp_send_json_error();
    global $wpdb;
    $id = intval($_POST['id'] ?? 0);
    $wpdb->delete($wpdb->prefix . 'jahid_contacts', ['id' => $id]);
    wp_send_json_success();
});

add_action('wp_ajax_jahid_delete_subscriber', function () {
    check_ajax_referer('jahid_nonce', 'nonce');
    if (!current_user_can('manage_options')) wp_send_json_error();
    global $wpdb;
    $id = intval($_POST['id'] ?? 0);
    $wpdb->delete($wpdb->prefix . 'jahid_newsletter', ['id' => $id]);
    wp_send_json_success();
});

// ── Database Installation ────────────────────────────────────────────────────
register_activation_hook(__FILE__, 'jahid_install_tables');

function jahid_install_tables() {
    global $wpdb;
    $charset = $wpdb->get_charset_collate();

    require_once ABSPATH . 'wp-admin/includes/upgrade.php';

    dbDelta("CREATE TABLE IF NOT EXISTS {$wpdb->prefix}jahid_contacts (
        id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
        name varchar(200) NOT NULL,
        email varchar(320) NOT NULL,
        subject varchar(300) DEFAULT '',
        message text NOT NULL,
        is_read tinyint(1) DEFAULT 0,
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
    ) $charset;");

    dbDelta("CREATE TABLE IF NOT EXISTS {$wpdb->prefix}jahid_newsletter (
        id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
        email varchar(320) NOT NULL UNIQUE,
        is_active tinyint(1) DEFAULT 1,
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
    ) $charset;");
}

// Also run on init in case tables don't exist yet
add_action('init', function () {
    if (!get_option('jahid_tables_created')) {
        jahid_install_tables();
        update_option('jahid_tables_created', '1');
    }
});

// ── Helper: Get Theme Option ──────────────────────────────────────────────────
function jahid_get_option($key, $default = '') {
    $options = get_option('jahid_theme_options', []);
    return $options[$key] ?? $default;
}

function jahid_get_section($section, $default = []) {
    $options = get_option('jahid_' . $section, $default);
    return is_array($options) ? $options : $default;
}

// ── Load includes ─────────────────────────────────────────────────────────────
require_once JAHID_DIR . '/inc/admin-menus.php';
require_once JAHID_DIR . '/inc/meta-boxes.php';
require_once JAHID_DIR . '/inc/template-functions.php';

// ── Custom excerpt length ─────────────────────────────────────────────────────
add_filter('excerpt_length', fn() => 25);
add_filter('excerpt_more', fn() => '...');

// ── Body classes ─────────────────────────────────────────────────────────────
add_filter('body_class', function ($classes) {
    $theme_mode = isset($_COOKIE['jahid_theme']) ? $_COOKIE['jahid_theme'] : jahid_get_option('default_theme', 'dark');
    $classes[] = 'theme-' . $theme_mode;
    if ($theme_mode === 'dark') $classes[] = 'dark';
    return $classes;
});

// ── Breadcrumb ────────────────────────────────────────────────────────────────
function jahid_breadcrumb() {
    if (is_home() || is_front_page()) return;
    echo '<nav class="breadcrumb" aria-label="Breadcrumb"><ol>';
    echo '<li><a href="' . home_url() . '">Home</a></li>';
    if (is_singular('project')) {
        echo '<li><a href="' . get_post_type_archive_link('project') . '">Work</a></li>';
        echo '<li>' . get_the_title() . '</li>';
    } elseif (is_singular('post')) {
        echo '<li><a href="' . get_permalink(get_option('page_for_posts')) . '">Blog</a></li>';
        echo '<li>' . get_the_title() . '</li>';
    } elseif (is_archive()) {
        echo '<li>' . get_the_archive_title() . '</li>';
    } elseif (is_page()) {
        echo '<li>' . get_the_title() . '</li>';
    }
    echo '</ol></nav>';
}
