<?php
/**
 * Admin Menu Pages — mirrors the React admin sidebar exactly
 * Groups: Workspace, Content, Pages, Global, System
 */
defined('ABSPATH') || exit;

add_action('admin_menu', function () {
    // Top-level: Portfolio Admin
    add_menu_page(
        'Portfolio Admin',
        'Portfolio',
        'manage_options',
        'jahid-dashboard',
        'jahid_page_dashboard',
        'dashicons-admin-home',
        2
    );

    // ── Workspace ─────────────────────────────────────────────────────────────
    add_submenu_page('jahid-dashboard', 'Dashboard',   'Dashboard',   'manage_options', 'jahid-dashboard',          'jahid_page_dashboard');
    add_submenu_page('jahid-dashboard', 'Inbox',       'Inbox',       'manage_options', 'jahid-inbox',              'jahid_page_inbox');
    add_submenu_page('jahid-dashboard', 'Newsletter',  'Newsletter',  'manage_options', 'jahid-newsletter',         'jahid_page_newsletter');
    add_submenu_page('jahid-dashboard', 'Media',       'Media',       'manage_options', 'upload.php',               null);

    // ── Content ───────────────────────────────────────────────────────────────
    add_submenu_page('jahid-dashboard', 'Projects',   'Projects',    'manage_options', 'edit.php?post_type=project', null);
    add_submenu_page('jahid-dashboard', 'Blog Posts', 'Blog Posts',  'manage_options', 'edit.php',                  null);

    // ── Pages section (Site Content) ─────────────────────────────────────────
    add_submenu_page('jahid-dashboard', 'Home Page',        'Home Page',        'manage_options', 'jahid-site-home',       'jahid_page_site_home');
    add_submenu_page('jahid-dashboard', 'About Page',       'About Page',       'manage_options', 'jahid-site-about',      'jahid_page_site_about');
    add_submenu_page('jahid-dashboard', 'Work Page',        'Work Page',        'manage_options', 'jahid-site-work',       'jahid_page_site_work');
    add_submenu_page('jahid-dashboard', 'Blog Page',        'Blog Page',        'manage_options', 'jahid-site-blog',       'jahid_page_site_blog');
    add_submenu_page('jahid-dashboard', 'Contact Info',     'Contact Info',     'manage_options', 'jahid-site-contact',    'jahid_page_site_contact');
    add_submenu_page('jahid-dashboard', 'Privacy Policy',   'Privacy Policy',   'manage_options', 'jahid-site-privacy',    'jahid_page_site_privacy');
    add_submenu_page('jahid-dashboard', 'Terms of Service', 'Terms of Service', 'manage_options', 'jahid-site-terms',      'jahid_page_site_terms');

    // ── Global ────────────────────────────────────────────────────────────────
    add_submenu_page('jahid-dashboard', 'Header / Nav',  'Header / Nav',  'manage_options', 'jahid-site-navigation', 'jahid_page_site_navigation');
    add_submenu_page('jahid-dashboard', 'Footer',        'Footer',        'manage_options', 'jahid-site-footer',     'jahid_page_site_footer');
    add_submenu_page('jahid-dashboard', 'Social Links',  'Social Links',  'manage_options', 'jahid-site-social',     'jahid_page_site_social');
    add_submenu_page('jahid-dashboard', 'SEO & Meta',    'SEO & Meta',    'manage_options', 'jahid-site-seo',        'jahid_page_site_seo');
    add_submenu_page('jahid-dashboard', 'Per-page SEO',  'Per-page SEO',  'manage_options', 'jahid-site-page-seo',   'jahid_page_site_page_seo');

    // ── System ────────────────────────────────────────────────────────────────
    add_submenu_page('jahid-dashboard', 'SMTP Settings', 'SMTP',      'manage_options', 'jahid-system-smtp', 'jahid_page_system_smtp');
    add_submenu_page('jahid-dashboard', 'Theme Settings','Settings',  'manage_options', 'jahid-settings',    'jahid_page_settings');
});

// ── Register Settings ─────────────────────────────────────────────────────────
add_action('admin_init', function () {
    $sections = [
        'jahid_navigation', 'jahid_hero', 'jahid_site_home',
        'jahid_site_about', 'jahid_site_work', 'jahid_site_blog',
        'jahid_site_contact', 'jahid_site_footer', 'jahid_site_social',
        'jahid_site_seo', 'jahid_site_page_seo', 'jahid_site_privacy',
        'jahid_site_terms', 'jahid_system_smtp', 'jahid_theme_options',
    ];
    foreach ($sections as $s) {
        register_setting('jahid_' . $s . '_group', $s, ['sanitize_callback' => 'jahid_sanitize_options']);
    }
});

function jahid_sanitize_options($input) {
    if (!is_array($input)) return [];
    $clean = [];
    foreach ($input as $key => $val) {
        if (is_array($val)) {
            $clean[$key] = array_map('jahid_sanitize_recursive', $val);
        } elseif (in_array($key, ['bio', 'description', 'message', 'content', 'privacy_content', 'terms_content'])) {
            $clean[$key] = wp_kses_post($val);
        } elseif (strpos($key, 'url') !== false || strpos($key, 'image') !== false || strpos($key, 'avatar') !== false) {
            $clean[$key] = esc_url_raw($val);
        } else {
            $clean[$key] = sanitize_text_field($val);
        }
    }
    return $clean;
}

function jahid_sanitize_recursive($val) {
    if (is_array($val)) return array_map('jahid_sanitize_recursive', $val);
    return sanitize_text_field($val);
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE RENDERERS
// ─────────────────────────────────────────────────────────────────────────────

function jahid_admin_wrap($title, $content) {
    echo '<div class="wrap jahid-admin-wrap">';
    echo '<div class="jahid-admin-header"><h1>' . esc_html($title) . '</h1></div>';
    echo '<div class="jahid-admin-body">' . $content . '</div>';
    echo '</div>';
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function jahid_page_dashboard() {
    global $wpdb;
    $project_count = wp_count_posts('project')->publish ?? 0;
    $blog_count    = wp_count_posts('post')->publish ?? 0;
    $msg_count     = $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->prefix}jahid_contacts WHERE is_read = 0");
    $sub_count     = $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->prefix}jahid_newsletter WHERE is_active = 1");

    ob_start();
    ?>
    <div class="jahid-stats-grid">
        <div class="jahid-stat-card">
            <div class="jahid-stat-icon dashicons dashicons-portfolio"></div>
            <div class="jahid-stat-value"><?= intval($project_count) ?></div>
            <div class="jahid-stat-label">Projects</div>
            <a href="<?= admin_url('edit.php?post_type=project') ?>" class="jahid-stat-link">Manage Projects →</a>
        </div>
        <div class="jahid-stat-card">
            <div class="jahid-stat-icon dashicons dashicons-admin-post"></div>
            <div class="jahid-stat-value"><?= intval($blog_count) ?></div>
            <div class="jahid-stat-label">Blog Posts</div>
            <a href="<?= admin_url('edit.php') ?>" class="jahid-stat-link">Manage Posts →</a>
        </div>
        <div class="jahid-stat-card">
            <div class="jahid-stat-icon dashicons dashicons-email-alt"></div>
            <div class="jahid-stat-value"><?= intval($msg_count) ?></div>
            <div class="jahid-stat-label">Unread Messages</div>
            <a href="<?= admin_url('admin.php?page=jahid-inbox') ?>" class="jahid-stat-link">View Inbox →</a>
        </div>
        <div class="jahid-stat-card">
            <div class="jahid-stat-icon dashicons dashicons-groups"></div>
            <div class="jahid-stat-value"><?= intval($sub_count) ?></div>
            <div class="jahid-stat-label">Subscribers</div>
            <a href="<?= admin_url('admin.php?page=jahid-newsletter') ?>" class="jahid-stat-link">Manage List →</a>
        </div>
    </div>

    <div class="jahid-quick-links">
        <h2>Quick Access</h2>
        <div class="jahid-quick-grid">
            <?php
            $links = [
                ['Header / Nav',  'jahid-site-navigation'],
                ['Hero Section',  'jahid-site-home'],
                ['About Page',    'jahid-site-about'],
                ['Contact Info',  'jahid-site-contact'],
                ['Footer',        'jahid-site-footer'],
                ['SEO & Meta',    'jahid-site-seo'],
                ['Social Links',  'jahid-site-social'],
                ['SMTP Settings', 'jahid-system-smtp'],
            ];
            foreach ($links as [$label, $page]) {
                echo '<a href="' . admin_url('admin.php?page=' . $page) . '" class="jahid-quick-link">' . $label . '</a>';
            }
            ?>
        </div>
    </div>
    <?php
    jahid_admin_wrap('Dashboard', ob_get_clean());
}

// ── Inbox ─────────────────────────────────────────────────────────────────────
function jahid_page_inbox() {
    global $wpdb;
    $messages = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}jahid_contacts ORDER BY created_at DESC");

    ob_start();
    ?>
    <p class="jahid-desc">Contact form submissions from your website visitors.</p>
    <?php if (empty($messages)): ?>
        <div class="jahid-empty-state">No messages yet.</div>
    <?php else: ?>
        <table class="jahid-table widefat">
            <thead>
                <tr>
                    <th>Name</th><th>Email</th><th>Subject</th><th>Message</th><th>Date</th><th>Status</th><th>Actions</th>
                </tr>
            </thead>
            <tbody>
            <?php foreach ($messages as $msg): ?>
                <tr class="<?= $msg->is_read ? '' : 'jahid-unread' ?>" id="msg-<?= $msg->id ?>">
                    <td><strong><?= esc_html($msg->name) ?></strong></td>
                    <td><a href="mailto:<?= esc_attr($msg->email) ?>"><?= esc_html($msg->email) ?></a></td>
                    <td><?= esc_html($msg->subject) ?></td>
                    <td><span class="jahid-msg-preview"><?= esc_html(wp_trim_words($msg->message, 15)) ?></span>
                        <div class="jahid-msg-full" style="display:none"><?= nl2br(esc_html($msg->message)) ?></div>
                        <button class="button-link jahid-toggle-msg" data-id="<?= $msg->id ?>">Read more</button>
                    </td>
                    <td><?= esc_html(date('M j, Y', strtotime($msg->created_at))) ?></td>
                    <td><?= $msg->is_read ? '<span class="jahid-badge jahid-badge-muted">Read</span>' : '<span class="jahid-badge jahid-badge-blue">New</span>' ?></td>
                    <td>
                        <?php if (!$msg->is_read): ?>
                            <button class="button jahid-mark-read" data-id="<?= $msg->id ?>" data-nonce="<?= wp_create_nonce('jahid_nonce') ?>">Mark Read</button>
                        <?php endif; ?>
                        <button class="button jahid-delete-msg" data-id="<?= $msg->id ?>" data-nonce="<?= wp_create_nonce('jahid_nonce') ?>">Delete</button>
                    </td>
                </tr>
            <?php endforeach; ?>
            </tbody>
        </table>
    <?php endif; ?>
    <?php
    jahid_admin_wrap('Inbox', ob_get_clean());
}

// ── Newsletter ────────────────────────────────────────────────────────────────
function jahid_page_newsletter() {
    global $wpdb;
    $subs = $wpdb->get_results("SELECT * FROM {$wpdb->prefix}jahid_newsletter ORDER BY created_at DESC");

    ob_start();
    ?>
    <p class="jahid-desc">Newsletter subscribers from your website.</p>
    <?php if (empty($subs)): ?>
        <div class="jahid-empty-state">No subscribers yet.</div>
    <?php else: ?>
        <p class="jahid-desc"><?= count($subs) ?> subscriber(s) total</p>
        <table class="jahid-table widefat">
            <thead><tr><th>Email</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
            <?php foreach ($subs as $sub): ?>
                <tr id="sub-<?= $sub->id ?>">
                    <td><?= esc_html($sub->email) ?></td>
                    <td><?= $sub->is_active ? '<span class="jahid-badge jahid-badge-green">Active</span>' : '<span class="jahid-badge jahid-badge-muted">Inactive</span>' ?></td>
                    <td><?= esc_html(date('M j, Y', strtotime($sub->created_at))) ?></td>
                    <td><button class="button jahid-delete-sub" data-id="<?= $sub->id ?>" data-nonce="<?= wp_create_nonce('jahid_nonce') ?>">Delete</button></td>
                </tr>
            <?php endforeach; ?>
            </tbody>
        </table>
    <?php endif; ?>
    <?php
    jahid_admin_wrap('Newsletter Subscribers', ob_get_clean());
}

// ── Settings form helper ──────────────────────────────────────────────────────
function jahid_settings_form($page_slug, $option_key, $fields_callback) {
    $options = get_option($option_key, []);
    ob_start();
    ?>
    <form method="post" action="options.php" class="jahid-settings-form">
        <?php settings_fields('jahid_' . $option_key . '_group'); ?>
        <div class="jahid-fields-grid">
            <?php $fields_callback($options); ?>
        </div>
        <div class="jahid-form-footer">
            <?php submit_button('Save Changes', 'primary', 'submit', false); ?>
        </div>
    </form>
    <?php
    jahid_admin_wrap(ucwords(str_replace(['jahid_', '_'], ['', ' '], $option_key)), ob_get_clean());
}

function jahid_field_text($name, $label, $value, $option_key, $placeholder = '') {
    echo '<div class="jahid-field">';
    echo '<label>' . esc_html($label) . '</label>';
    echo '<input type="text" name="' . esc_attr($option_key) . '[' . esc_attr($name) . ']" value="' . esc_attr($value) . '" placeholder="' . esc_attr($placeholder) . '" class="regular-text">';
    echo '</div>';
}

function jahid_field_url($name, $label, $value, $option_key, $placeholder = 'https://') {
    echo '<div class="jahid-field">';
    echo '<label>' . esc_html($label) . '</label>';
    echo '<input type="url" name="' . esc_attr($option_key) . '[' . esc_attr($name) . ']" value="' . esc_attr($value) . '" placeholder="' . esc_attr($placeholder) . '" class="regular-text">';
    echo '</div>';
}

function jahid_field_textarea($name, $label, $value, $option_key, $rows = 4) {
    echo '<div class="jahid-field jahid-field-full">';
    echo '<label>' . esc_html($label) . '</label>';
    echo '<textarea name="' . esc_attr($option_key) . '[' . esc_attr($name) . ']" rows="' . intval($rows) . '" class="large-text">' . esc_textarea($value) . '</textarea>';
    echo '</div>';
}

function jahid_field_toggle($name, $label, $value, $option_key) {
    $checked = !empty($value) ? 'checked' : '';
    echo '<div class="jahid-field jahid-field-toggle">';
    echo '<label class="jahid-toggle-label">';
    echo '<input type="hidden" name="' . esc_attr($option_key) . '[' . esc_attr($name) . ']" value="0">';
    echo '<input type="checkbox" name="' . esc_attr($option_key) . '[' . esc_attr($name) . ']" value="1" ' . $checked . ' class="jahid-toggle-input">';
    echo '<span class="jahid-toggle-slider"></span>';
    echo '<span class="jahid-toggle-text">' . esc_html($label) . '</span>';
    echo '</label>';
    echo '</div>';
}

function jahid_field_image($name, $label, $value, $option_key) {
    echo '<div class="jahid-field">';
    echo '<label>' . esc_html($label) . '</label>';
    echo '<div class="jahid-image-field">';
    if ($value) echo '<img src="' . esc_url($value) . '" class="jahid-image-preview" style="max-width:200px;border-radius:8px;margin-bottom:8px;">';
    echo '<input type="url" name="' . esc_attr($option_key) . '[' . esc_attr($name) . ']" value="' . esc_attr($value) . '" class="regular-text jahid-image-url">';
    echo '<button type="button" class="button jahid-upload-btn" data-target="' . esc_attr($name) . '">Upload Image</button>';
    echo '</div>';
    echo '</div>';
}

// ── Site Home ─────────────────────────────────────────────────────────────────
function jahid_page_site_home() {
    $opts = get_option('jahid_site_home', []);
    ob_start();
    ?>
    <form method="post" action="options.php" class="jahid-settings-form">
        <?php settings_fields('jahid_jahid_site_home_group'); ?>
        <div class="jahid-section">
            <h3>Hero Section</h3>
            <div class="jahid-fields-grid">
                <?php
                jahid_field_toggle('hero_enabled', 'Show Hero', $opts['hero_enabled'] ?? 1, 'jahid_site_home');
                jahid_field_toggle('work_enabled',    'Show Work Section',    $opts['work_enabled'] ?? 1,    'jahid_site_home');
                jahid_field_toggle('blog_enabled',    'Show Blog Section',    $opts['blog_enabled'] ?? 1,    'jahid_site_home');
                jahid_field_toggle('contact_enabled', 'Show Contact Section', $opts['contact_enabled'] ?? 1, 'jahid_site_home');
                jahid_field_text('eyebrow_text', 'Eyebrow Text', $opts['eyebrow_text'] ?? 'Apifel DIGI • SYSTEM DESIGN STUDIO', 'jahid_site_home');
                jahid_field_text('hero_headline', 'Hero Headline', $opts['hero_headline'] ?? 'Aesthetic Intelligence', 'jahid_site_home');
                jahid_field_text('hero_sub', 'Hero Sub-headline', $opts['hero_sub'] ?? '[& flawless systems]', 'jahid_site_home');
                jahid_field_textarea('hero_desc', 'Hero Description', $opts['hero_desc'] ?? '', 'jahid_site_home', 3);
                jahid_field_text('cta_primary_label', 'Primary CTA Label', $opts['cta_primary_label'] ?? 'Explore Work', 'jahid_site_home');
                jahid_field_url('cta_primary_url',   'Primary CTA URL',   $opts['cta_primary_url'] ?? '/work', 'jahid_site_home');
                jahid_field_text('cta_secondary_label', 'Secondary CTA Label', $opts['cta_secondary_label'] ?? 'Read Narrative', 'jahid_site_home');
                jahid_field_url('cta_secondary_url',   'Secondary CTA URL',   $opts['cta_secondary_url'] ?? '/about', 'jahid_site_home');
                ?>
            </div>
        </div>
        <div class="jahid-form-footer"><?php submit_button('Save Changes', 'primary', 'submit', false); ?></div>
    </form>
    <?php
    jahid_admin_wrap('Home Page', ob_get_clean());
}

// ── About Page ────────────────────────────────────────────────────────────────
function jahid_page_site_about() {
    $opts = get_option('jahid_site_about', []);
    $experiences = json_decode($opts['experiences'] ?? '[]', true) ?: [];
    $studies      = json_decode($opts['studies'] ?? '[]', true) ?: [];
    $languages    = json_decode($opts['languages'] ?? '[]', true) ?: [];
    $tech_items   = json_decode($opts['tech_items'] ?? '[]', true) ?: [];

    ob_start();
    ?>
    <form method="post" action="options.php" class="jahid-settings-form">
        <?php settings_fields('jahid_jahid_site_about_group'); ?>

        <div class="jahid-section">
            <h3>Hero Card</h3>
            <div class="jahid-fields-grid">
                <?php
                jahid_field_toggle('hero_enabled',   'Show Hero Card',     $opts['hero_enabled'] ?? 1,   'jahid_site_about');
                jahid_field_toggle('badge_enabled',  'Show Badge',         $opts['badge_enabled'] ?? 1,  'jahid_site_about');
                jahid_field_text('badge_text',        'Badge Text',         $opts['badge_text'] ?? 'Available for work', 'jahid_site_about');
                jahid_field_text('headline_pre',      'Headline (before italic)', $opts['headline_pre'] ?? 'Crafting digital experiences with', 'jahid_site_about');
                jahid_field_text('headline_italic',   'Headline (italic word)',   $opts['headline_italic'] ?? 'purpose', 'jahid_site_about');
                jahid_field_textarea('bio',           'Bio',                $opts['bio'] ?? '',           'jahid_site_about', 4);
                jahid_field_toggle('cta_enabled',    'Show CTA Button',    $opts['cta_enabled'] ?? 1,   'jahid_site_about');
                jahid_field_text('cta_label',         'CTA Label',          $opts['cta_label'] ?? 'Hire Me Now', 'jahid_site_about');
                jahid_field_url('cta_url',            'CTA URL',            $opts['cta_url'] ?? '/contact', 'jahid_site_about');
                ?>
            </div>
        </div>

        <div class="jahid-section">
            <h3>Profile Card</h3>
            <div class="jahid-fields-grid">
                <?php
                jahid_field_toggle('profile_enabled', 'Show Profile Image', $opts['profile_enabled'] ?? 1, 'jahid_site_about');
                jahid_field_image('profile_image',    'Profile Image URL',  $opts['profile_image'] ?? '',  'jahid_site_about');
                jahid_field_text('profile_name',      'Name',               $opts['profile_name'] ?? 'Jahid Hasan', 'jahid_site_about');
                jahid_field_text('profile_role',      'Role/Title',         $opts['profile_role'] ?? 'Graphic Designer & Dev', 'jahid_site_about');
                ?>
            </div>
        </div>

        <div class="jahid-section">
            <h3>Location & CV</h3>
            <div class="jahid-fields-grid">
                <?php
                jahid_field_toggle('location_enabled', 'Show Location', $opts['location_enabled'] ?? 1, 'jahid_site_about');
                jahid_field_text('location_line1', 'Location Line 1', $opts['location_line1'] ?? 'Based in Dhaka,', 'jahid_site_about');
                jahid_field_text('location_line2', 'Location Line 2', $opts['location_line2'] ?? 'Bangladesh', 'jahid_site_about');
                jahid_field_toggle('cv_enabled', 'Show CV Download', $opts['cv_enabled'] ?? 1, 'jahid_site_about');
                jahid_field_text('cv_label', 'CV Button Label', $opts['cv_label'] ?? 'Download CV', 'jahid_site_about');
                jahid_field_url('cv_url', 'CV File URL', $opts['cv_url'] ?? '#', 'jahid_site_about');
                ?>
            </div>
        </div>

        <div class="jahid-section">
            <h3>Work Experience</h3>
            <div class="jahid-fields-grid">
                <?php jahid_field_toggle('experience_enabled', 'Show Experience', $opts['experience_enabled'] ?? 1, 'jahid_site_about'); ?>
                <?php jahid_field_text('experience_title', 'Section Title', $opts['experience_title'] ?? 'Work Experience', 'jahid_site_about'); ?>
            </div>
            <div class="jahid-repeater" id="experiences-repeater" data-name="jahid_site_about[experiences_json]">
                <input type="hidden" name="jahid_site_about[experiences]" class="jahid-repeater-data" value="<?= esc_attr(json_encode($experiences)) ?>">
                <div class="jahid-repeater-items">
                    <?php foreach ($experiences as $i => $exp): ?>
                    <div class="jahid-repeater-item" data-index="<?= $i ?>">
                        <div class="jahid-repeater-row">
                            <input type="text" placeholder="Company" value="<?= esc_attr($exp['company'] ?? '') ?>" class="regular-text" data-field="company">
                            <input type="text" placeholder="Role" value="<?= esc_attr($exp['role'] ?? '') ?>" class="regular-text" data-field="role">
                            <input type="text" placeholder="Period (e.g. 2023 – Present)" value="<?= esc_attr($exp['period'] ?? '') ?>" class="regular-text" data-field="period">
                            <button type="button" class="button jahid-remove-item">Remove</button>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
                <button type="button" class="button jahid-add-item" data-template='{"company":"","role":"","period":""}'>+ Add Experience</button>
            </div>
        </div>

        <div class="jahid-section">
            <h3>Education / Studies</h3>
            <div class="jahid-fields-grid">
                <?php jahid_field_toggle('studies_enabled', 'Show Studies', $opts['studies_enabled'] ?? 1, 'jahid_site_about'); ?>
                <?php jahid_field_text('studies_title', 'Section Title', $opts['studies_title'] ?? 'Studies', 'jahid_site_about'); ?>
            </div>
            <div class="jahid-repeater" id="studies-repeater">
                <input type="hidden" name="jahid_site_about[studies]" class="jahid-repeater-data" value="<?= esc_attr(json_encode($studies)) ?>">
                <div class="jahid-repeater-items">
                    <?php foreach ($studies as $i => $s): ?>
                    <div class="jahid-repeater-item" data-index="<?= $i ?>">
                        <div class="jahid-repeater-row">
                            <input type="text" placeholder="Degree/Title" value="<?= esc_attr($s['title'] ?? '') ?>" class="regular-text" data-field="title">
                            <input type="text" placeholder="School / Detail" value="<?= esc_attr($s['detail'] ?? '') ?>" class="regular-text" data-field="detail">
                            <button type="button" class="button jahid-remove-item">Remove</button>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
                <button type="button" class="button jahid-add-item" data-template='{"title":"","detail":""}'>+ Add Study</button>
            </div>
        </div>

        <div class="jahid-section">
            <h3>Languages</h3>
            <div class="jahid-fields-grid">
                <?php jahid_field_toggle('languages_enabled', 'Show Languages', $opts['languages_enabled'] ?? 1, 'jahid_site_about'); ?>
                <?php jahid_field_text('languages_title', 'Section Title', $opts['languages_title'] ?? 'Languages', 'jahid_site_about'); ?>
            </div>
            <div class="jahid-repeater" id="languages-repeater">
                <input type="hidden" name="jahid_site_about[languages]" class="jahid-repeater-data" value="<?= esc_attr(json_encode($languages)) ?>">
                <div class="jahid-repeater-items">
                    <?php foreach ($languages as $i => $l): ?>
                    <div class="jahid-repeater-item" data-index="<?= $i ?>">
                        <div class="jahid-repeater-row">
                            <input type="text" placeholder="Language" value="<?= esc_attr($l['name'] ?? '') ?>" class="regular-text" data-field="name">
                            <button type="button" class="button jahid-remove-item">Remove</button>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
                <button type="button" class="button jahid-add-item" data-template='{"name":""}'>+ Add Language</button>
            </div>
        </div>

        <div class="jahid-section">
            <h3>Tech Stack</h3>
            <div class="jahid-fields-grid">
                <?php jahid_field_toggle('tech_enabled', 'Show Tech Stack', $opts['tech_enabled'] ?? 1, 'jahid_site_about'); ?>
                <?php jahid_field_text('tech_title', 'Section Title', $opts['tech_title'] ?? 'Technical Arsenal', 'jahid_site_about'); ?>
                <?php jahid_field_text('tech_description', 'Description', $opts['tech_description'] ?? 'The tools and technologies I use to bring ideas to life.', 'jahid_site_about'); ?>
            </div>
            <div class="jahid-repeater" id="tech-repeater">
                <input type="hidden" name="jahid_site_about[tech_items]" class="jahid-repeater-data" value="<?= esc_attr(json_encode($tech_items)) ?>">
                <div class="jahid-repeater-items">
                    <?php foreach ($tech_items as $i => $t): ?>
                    <div class="jahid-repeater-item" data-index="<?= $i ?>">
                        <div class="jahid-repeater-row">
                            <input type="text" placeholder="Icon/Emoji" value="<?= esc_attr($t['icon'] ?? '') ?>" style="width:80px" data-field="icon">
                            <input type="text" placeholder="Technology name" value="<?= esc_attr($t['name'] ?? '') ?>" class="regular-text" data-field="name">
                            <button type="button" class="button jahid-remove-item">Remove</button>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
                <button type="button" class="button jahid-add-item" data-template='{"icon":"","name":""}'>+ Add Technology</button>
            </div>
        </div>

        <div class="jahid-form-footer"><?php submit_button('Save Changes', 'primary', 'submit', false); ?></div>
    </form>
    <?php
    jahid_admin_wrap('About Page', ob_get_clean());
}

// ── Work Page ─────────────────────────────────────────────────────────────────
function jahid_page_site_work() {
    $opts = get_option('jahid_site_work', []);
    ob_start();
    ?>
    <form method="post" action="options.php" class="jahid-settings-form">
        <?php settings_fields('jahid_jahid_site_work_group'); ?>
        <div class="jahid-fields-grid">
            <?php
            jahid_field_toggle('badge_enabled',       'Show Badge',          $opts['badge_enabled'] ?? 1,       'jahid_site_work');
            jahid_field_text('badge_text',             'Badge Text',          $opts['badge_text'] ?? 'Selected Works', 'jahid_site_work');
            jahid_field_toggle('headline_enabled',    'Show Headline',       $opts['headline_enabled'] ?? 1,    'jahid_site_work');
            jahid_field_text('headline_pre',           'Headline (pre)',      $opts['headline_pre'] ?? 'Projects that blend', 'jahid_site_work');
            jahid_field_text('headline_italic1',       'Headline (italic 1)', $opts['headline_italic1'] ?? 'form', 'jahid_site_work');
            jahid_field_text('headline_mid',           'Headline (mid)',      $opts['headline_mid'] ?? 'and', 'jahid_site_work');
            jahid_field_text('headline_italic2',       'Headline (italic 2)', $opts['headline_italic2'] ?? 'function', 'jahid_site_work');
            jahid_field_toggle('description_enabled', 'Show Description',    $opts['description_enabled'] ?? 1, 'jahid_site_work');
            jahid_field_textarea('description',        'Description',         $opts['description'] ?? '', 'jahid_site_work', 3);
            ?>
        </div>
        <div class="jahid-form-footer"><?php submit_button('Save Changes', 'primary', 'submit', false); ?></div>
    </form>
    <?php
    jahid_admin_wrap('Work Page', ob_get_clean());
}

// ── Blog Page ─────────────────────────────────────────────────────────────────
function jahid_page_site_blog() {
    $opts = get_option('jahid_site_blog', []);
    ob_start();
    ?>
    <form method="post" action="options.php" class="jahid-settings-form">
        <?php settings_fields('jahid_jahid_site_blog_group'); ?>
        <div class="jahid-fields-grid">
            <?php
            jahid_field_toggle('badge_enabled',       'Show Badge',       $opts['badge_enabled'] ?? 1,       'jahid_site_blog');
            jahid_field_text('badge_text',             'Badge Text',       $opts['badge_text'] ?? 'Latest Writing', 'jahid_site_blog');
            jahid_field_toggle('headline_enabled',    'Show Headline',    $opts['headline_enabled'] ?? 1,    'jahid_site_blog');
            jahid_field_text('headline_pre',           'Headline (pre)',   $opts['headline_pre'] ?? 'Words that', 'jahid_site_blog');
            jahid_field_text('headline_accent',        'Headline (accent)', $opts['headline_accent'] ?? 'inspire', 'jahid_site_blog');
            jahid_field_toggle('description_enabled', 'Show Description', $opts['description_enabled'] ?? 1, 'jahid_site_blog');
            jahid_field_textarea('description',        'Description',      $opts['description'] ?? '', 'jahid_site_blog', 3);
            ?>
        </div>
        <div class="jahid-form-footer"><?php submit_button('Save Changes', 'primary', 'submit', false); ?></div>
    </form>
    <?php
    jahid_admin_wrap('Blog Page', ob_get_clean());
}

// ── Contact Info ──────────────────────────────────────────────────────────────
function jahid_page_site_contact() {
    $opts    = get_option('jahid_site_contact', []);
    $socials = json_decode($opts['socials'] ?? '[]', true) ?: [];
    ob_start();
    ?>
    <form method="post" action="options.php" class="jahid-settings-form">
        <?php settings_fields('jahid_jahid_site_contact_group'); ?>
        <div class="jahid-section">
            <h3>Page Header</h3>
            <div class="jahid-fields-grid">
                <?php
                jahid_field_text('eyebrow_text',       'Eyebrow Text',         $opts['eyebrow_text'] ?? 'Contact', 'jahid_site_contact');
                jahid_field_text('headline_text',      'Headline',             $opts['headline_text'] ?? 'Get In Touch', 'jahid_site_contact');
                jahid_field_text('side_headline_pre',  'Side Headline (pre)',  $opts['side_headline_pre'] ?? "Let's start a", 'jahid_site_contact');
                jahid_field_text('side_headline_italic','Side Headline (italic)', $opts['side_headline_italic'] ?? 'conversation', 'jahid_site_contact');
                ?>
            </div>
        </div>
        <div class="jahid-section">
            <h3>Contact Details</h3>
            <div class="jahid-fields-grid">
                <?php
                jahid_field_toggle('email_enabled', 'Show Email', $opts['email_enabled'] ?? 1, 'jahid_site_contact');
                jahid_field_text('email_label',     'Email Label', $opts['email_label'] ?? 'Email', 'jahid_site_contact');
                jahid_field_text('email_value',     'Email Address', $opts['email_value'] ?? '', 'jahid_site_contact');
                jahid_field_toggle('phone_enabled', 'Show Phone', $opts['phone_enabled'] ?? 0, 'jahid_site_contact');
                jahid_field_text('phone_label',     'Phone Label', $opts['phone_label'] ?? 'Phone', 'jahid_site_contact');
                jahid_field_text('phone_value',     'Phone Number', $opts['phone_value'] ?? '', 'jahid_site_contact');
                jahid_field_toggle('location_enabled', 'Show Location', $opts['location_enabled'] ?? 1, 'jahid_site_contact');
                jahid_field_text('location_label', 'Location Label', $opts['location_label'] ?? 'Location', 'jahid_site_contact');
                jahid_field_text('location_value', 'Location Value', $opts['location_value'] ?? 'Dhaka, Bangladesh', 'jahid_site_contact');
                jahid_field_toggle('form_enabled',    'Show Contact Form', $opts['form_enabled'] ?? 1, 'jahid_site_contact');
                ?>
            </div>
        </div>
        <div class="jahid-section">
            <h3>Social Links (on Contact page)</h3>
            <div class="jahid-repeater" id="contact-socials-repeater">
                <input type="hidden" name="jahid_site_contact[socials]" class="jahid-repeater-data" value="<?= esc_attr(json_encode($socials)) ?>">
                <div class="jahid-repeater-items">
                    <?php foreach ($socials as $i => $s): ?>
                    <div class="jahid-repeater-item">
                        <div class="jahid-repeater-row">
                            <input type="text" placeholder="Label (e.g. Twitter)" value="<?= esc_attr($s['label'] ?? '') ?>" class="regular-text" data-field="label">
                            <input type="url" placeholder="URL" value="<?= esc_attr($s['url'] ?? '') ?>" class="regular-text" data-field="url">
                            <button type="button" class="button jahid-remove-item">Remove</button>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
                <button type="button" class="button jahid-add-item" data-template='{"label":"","url":""}'>+ Add Social</button>
            </div>
        </div>
        <div class="jahid-form-footer"><?php submit_button('Save Changes', 'primary', 'submit', false); ?></div>
    </form>
    <?php
    jahid_admin_wrap('Contact Info', ob_get_clean());
}

// ── Privacy & Terms ───────────────────────────────────────────────────────────
function jahid_page_site_privacy() {
    $opts = get_option('jahid_site_privacy', []);
    ob_start();
    ?>
    <form method="post" action="options.php" class="jahid-settings-form">
        <?php settings_fields('jahid_jahid_site_privacy_group'); ?>
        <div class="jahid-fields-grid">
            <?php
            jahid_field_text('title',    'Page Title',   $opts['title'] ?? 'Privacy Policy', 'jahid_site_privacy');
            jahid_field_textarea('content', 'Content (HTML allowed)', $opts['content'] ?? '', 'jahid_site_privacy', 20);
            ?>
        </div>
        <div class="jahid-form-footer"><?php submit_button('Save Changes', 'primary', 'submit', false); ?></div>
    </form>
    <?php
    jahid_admin_wrap('Privacy Policy', ob_get_clean());
}

function jahid_page_site_terms() {
    $opts = get_option('jahid_site_terms', []);
    ob_start();
    ?>
    <form method="post" action="options.php" class="jahid-settings-form">
        <?php settings_fields('jahid_jahid_site_terms_group'); ?>
        <div class="jahid-fields-grid">
            <?php
            jahid_field_text('title',    'Page Title',   $opts['title'] ?? 'Terms of Service', 'jahid_site_terms');
            jahid_field_textarea('content', 'Content (HTML allowed)', $opts['content'] ?? '', 'jahid_site_terms', 20);
            ?>
        </div>
        <div class="jahid-form-footer"><?php submit_button('Save Changes', 'primary', 'submit', false); ?></div>
    </form>
    <?php
    jahid_admin_wrap('Terms of Service', ob_get_clean());
}

// ── Navigation ────────────────────────────────────────────────────────────────
function jahid_page_site_navigation() {
    $opts  = get_option('jahid_navigation', []);
    $links = json_decode($opts['links'] ?? '[]', true) ?: [
        ['label' => 'Home',    'url' => '/',        'visible' => true],
        ['label' => 'Work',    'url' => '/work',    'visible' => true],
        ['label' => 'Blog',    'url' => '/blog',    'visible' => true],
        ['label' => 'About',   'url' => '/about',   'visible' => true],
        ['label' => 'Contact', 'url' => '/contact', 'visible' => true],
    ];
    ob_start();
    ?>
    <form method="post" action="options.php" class="jahid-settings-form">
        <?php settings_fields('jahid_jahid_navigation_group'); ?>
        <div class="jahid-section">
            <h3>Brand</h3>
            <div class="jahid-fields-grid">
                <?php
                jahid_field_toggle('brand_enabled',   'Show Brand Name',  $opts['brand_enabled'] ?? 1,  'jahid_navigation');
                jahid_field_text('brand_name',         'Brand Name',       $opts['brand_name'] ?? 'Jahid Hasan', 'jahid_navigation');
                jahid_field_text('brand_location',     'Brand Location',   $opts['brand_location'] ?? 'Dhaka, Bangladesh', 'jahid_navigation');
                jahid_field_toggle('avatar_enabled',  'Show Avatar',      $opts['avatar_enabled'] ?? 1, 'jahid_navigation');
                jahid_field_image('avatar_url',        'Avatar Image URL', $opts['avatar_url'] ?? '',    'jahid_navigation');
                ?>
            </div>
        </div>
        <div class="jahid-section">
            <h3>Nav Links</h3>
            <div class="jahid-repeater" id="nav-links-repeater">
                <input type="hidden" name="jahid_navigation[links]" class="jahid-repeater-data" value="<?= esc_attr(json_encode($links)) ?>">
                <div class="jahid-repeater-items">
                    <?php foreach ($links as $i => $l): ?>
                    <div class="jahid-repeater-item">
                        <div class="jahid-repeater-row">
                            <input type="text" placeholder="Label" value="<?= esc_attr($l['label'] ?? '') ?>" class="regular-text" data-field="label">
                            <input type="text" placeholder="URL e.g. /work" value="<?= esc_attr($l['url'] ?? '') ?>" class="regular-text" data-field="url">
                            <label><input type="checkbox" <?= !empty($l['visible']) ? 'checked' : '' ?> data-field="visible"> Visible</label>
                            <button type="button" class="button jahid-remove-item">Remove</button>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>
                <button type="button" class="button jahid-add-item" data-template='{"label":"","url":"","visible":true}'>+ Add Link</button>
            </div>
        </div>
        <div class="jahid-section">
            <h3>Options</h3>
            <div class="jahid-fields-grid">
                <?php
                jahid_field_toggle('theme_toggle_enabled', 'Show Theme Toggle', $opts['theme_toggle_enabled'] ?? 1, 'jahid_navigation');
                jahid_field_toggle('cta_enabled',          'Show CTA Button',   $opts['cta_enabled'] ?? 1,          'jahid_navigation');
                jahid_field_text('cta_label',               'CTA Label',         $opts['cta_label'] ?? 'Connect',   'jahid_navigation');
                jahid_field_url('cta_url',                  'CTA URL',           $opts['cta_url'] ?? '/contact',    'jahid_navigation');
                jahid_field_toggle('time_enabled',          'Show Local Time',   $opts['time_enabled'] ?? 1,         'jahid_navigation');
                jahid_field_text('time_label',              'Time Label',        $opts['time_label'] ?? 'LOCAL TIME (GMT+6)', 'jahid_navigation');
                jahid_field_text('time_timezone',           'Timezone',          $opts['time_timezone'] ?? 'Asia/Dhaka', 'jahid_navigation');
                ?>
            </div>
        </div>
        <div class="jahid-form-footer"><?php submit_button('Save Changes', 'primary', 'submit', false); ?></div>
    </form>
    <?php
    jahid_admin_wrap('Header / Navigation', ob_get_clean());
}

// ── Footer ────────────────────────────────────────────────────────────────────
function jahid_page_site_footer() {
    $opts = get_option('jahid_site_footer', []);
    ob_start();
    ?>
    <form method="post" action="options.php" class="jahid-settings-form">
        <?php settings_fields('jahid_jahid_site_footer_group'); ?>
        <div class="jahid-fields-grid">
            <?php
            jahid_field_text('brand_name',   'Brand Name',    $opts['brand_name'] ?? 'Jahid Hasan', 'jahid_site_footer');
            jahid_field_textarea('tagline',  'Footer Tagline', $opts['tagline'] ?? 'Crafting digital experiences with purpose.', 'jahid_site_footer', 2);
            jahid_field_text('copyright',    'Copyright Text', $opts['copyright'] ?? '© 2026 Jahid Hasan. All rights reserved.', 'jahid_site_footer');
            jahid_field_toggle('newsletter_enabled', 'Show Newsletter Form', $opts['newsletter_enabled'] ?? 1, 'jahid_site_footer');
            jahid_field_text('newsletter_headline', 'Newsletter Headline', $opts['newsletter_headline'] ?? 'Stay in the loop', 'jahid_site_footer');
            jahid_field_text('newsletter_desc',     'Newsletter Description', $opts['newsletter_desc'] ?? 'Get my latest articles and projects delivered to your inbox.', 'jahid_site_footer');
            ?>
        </div>
        <div class="jahid-form-footer"><?php submit_button('Save Changes', 'primary', 'submit', false); ?></div>
    </form>
    <?php
    jahid_admin_wrap('Footer', ob_get_clean());
}

// ── Social Links ──────────────────────────────────────────────────────────────
function jahid_page_site_social() {
    $opts    = get_option('jahid_site_social', []);
    $socials = json_decode($opts['socials'] ?? '[]', true) ?: [
        ['label' => 'Twitter',   'url' => '#', 'enabled' => true],
        ['label' => 'LinkedIn',  'url' => '#', 'enabled' => true],
        ['label' => 'GitHub',    'url' => '#', 'enabled' => true],
        ['label' => 'Instagram', 'url' => '#', 'enabled' => true],
    ];
    ob_start();
    ?>
    <form method="post" action="options.php" class="jahid-settings-form">
        <?php settings_fields('jahid_jahid_site_social_group'); ?>
        <p class="jahid-desc">These social links appear globally in the footer and other sections.</p>
        <div class="jahid-repeater" id="socials-repeater">
            <input type="hidden" name="jahid_site_social[socials]" class="jahid-repeater-data" value="<?= esc_attr(json_encode($socials)) ?>">
            <div class="jahid-repeater-items">
                <?php foreach ($socials as $i => $s): ?>
                <div class="jahid-repeater-item">
                    <div class="jahid-repeater-row">
                        <input type="text" placeholder="Label (e.g. Twitter)" value="<?= esc_attr($s['label'] ?? '') ?>" class="regular-text" data-field="label">
                        <input type="url" placeholder="Profile URL" value="<?= esc_attr($s['url'] ?? '') ?>" class="regular-text" data-field="url">
                        <label><input type="checkbox" <?= !empty($s['enabled']) ? 'checked' : '' ?> data-field="enabled"> Enabled</label>
                        <button type="button" class="button jahid-remove-item">Remove</button>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
            <button type="button" class="button jahid-add-item" data-template='{"label":"","url":"","enabled":true}'>+ Add Social</button>
        </div>
        <div class="jahid-form-footer"><?php submit_button('Save Changes', 'primary', 'submit', false); ?></div>
    </form>
    <?php
    jahid_admin_wrap('Social Links', ob_get_clean());
}

// ── SEO & Meta ────────────────────────────────────────────────────────────────
function jahid_page_site_seo() {
    $opts = get_option('jahid_site_seo', []);
    ob_start();
    ?>
    <form method="post" action="options.php" class="jahid-settings-form">
        <?php settings_fields('jahid_jahid_site_seo_group'); ?>
        <div class="jahid-fields-grid">
            <?php
            jahid_field_text('site_title',       'Site Title',          $opts['site_title'] ?? get_bloginfo('name'), 'jahid_site_seo');
            jahid_field_textarea('meta_description', 'Default Meta Description', $opts['meta_description'] ?? '', 'jahid_site_seo', 3);
            jahid_field_text('og_title',         'Default OG Title',    $opts['og_title'] ?? '', 'jahid_site_seo');
            jahid_field_textarea('og_description','Default OG Description', $opts['og_description'] ?? '', 'jahid_site_seo', 3);
            jahid_field_image('og_image',         'Default OG Image',    $opts['og_image'] ?? '', 'jahid_site_seo');
            jahid_field_text('twitter_handle',   'Twitter Handle',      $opts['twitter_handle'] ?? '', 'jahid_site_seo');
            ?>
        </div>
        <div class="jahid-form-footer"><?php submit_button('Save Changes', 'primary', 'submit', false); ?></div>
    </form>
    <?php
    jahid_admin_wrap('SEO & Meta', ob_get_clean());
}

// ── Per-page SEO ──────────────────────────────────────────────────────────────
function jahid_page_site_page_seo() {
    $opts  = get_option('jahid_site_page_seo', []);
    $pages = ['home', 'about', 'work', 'blog', 'contact'];
    ob_start();
    ?>
    <form method="post" action="options.php" class="jahid-settings-form">
        <?php settings_fields('jahid_jahid_site_page_seo_group'); ?>
        <?php foreach ($pages as $page): ?>
        <div class="jahid-section">
            <h3><?= ucfirst($page) ?> Page</h3>
            <div class="jahid-fields-grid">
                <?php
                jahid_field_text("${page}_title",       ucfirst($page) . ' Meta Title',       $opts["${page}_title"] ?? '',       'jahid_site_page_seo');
                jahid_field_textarea("${page}_description", ucfirst($page) . ' Meta Description', $opts["${page}_description"] ?? '', 'jahid_site_page_seo', 2);
                jahid_field_image("${page}_og_image",   ucfirst($page) . ' OG Image',         $opts["${page}_og_image"] ?? '',    'jahid_site_page_seo');
                ?>
            </div>
        </div>
        <?php endforeach; ?>
        <div class="jahid-form-footer"><?php submit_button('Save Changes', 'primary', 'submit', false); ?></div>
    </form>
    <?php
    jahid_admin_wrap('Per-page SEO', ob_get_clean());
}

// ── SMTP Settings ─────────────────────────────────────────────────────────────
function jahid_page_system_smtp() {
    $opts = get_option('jahid_system_smtp', []);
    ob_start();
    ?>
    <form method="post" action="options.php" class="jahid-settings-form">
        <?php settings_fields('jahid_jahid_system_smtp_group'); ?>
        <p class="jahid-desc">Configure SMTP to send emails from your portfolio. Uses PHPMailer via WordPress's wp_mail.</p>
        <div class="jahid-fields-grid">
            <?php
            jahid_field_toggle('smtp_enabled', 'Enable SMTP', $opts['smtp_enabled'] ?? 0, 'jahid_system_smtp');
            jahid_field_text('smtp_host',      'SMTP Host',   $opts['smtp_host'] ?? '', 'jahid_system_smtp', 'smtp.gmail.com');
            jahid_field_text('smtp_port',      'SMTP Port',   $opts['smtp_port'] ?? '587', 'jahid_system_smtp', '587');
            jahid_field_text('smtp_user',      'SMTP Username', $opts['smtp_user'] ?? '', 'jahid_system_smtp');
            jahid_field_text('smtp_pass',      'SMTP Password', $opts['smtp_pass'] ?? '', 'jahid_system_smtp');
            jahid_field_text('smtp_from_name', 'From Name',   $opts['smtp_from_name'] ?? get_bloginfo('name'), 'jahid_system_smtp');
            jahid_field_text('smtp_from_email','From Email',  $opts['smtp_from_email'] ?? get_option('admin_email'), 'jahid_system_smtp');
            jahid_field_text('smtp_to_email',  'Send Notifications To', $opts['smtp_to_email'] ?? get_option('admin_email'), 'jahid_system_smtp');
            ?>
        </div>
        <div class="jahid-form-footer"><?php submit_button('Save Changes', 'primary', 'submit', false); ?></div>
    </form>
    <?php
    jahid_admin_wrap('SMTP Settings', ob_get_clean());
}

// Hook SMTP config into wp_mail
add_action('phpmailer_init', function ($phpmailer) {
    $opts = get_option('jahid_system_smtp', []);
    if (empty($opts['smtp_enabled'])) return;

    $phpmailer->isSMTP();
    $phpmailer->Host       = $opts['smtp_host'] ?? '';
    $phpmailer->SMTPAuth   = true;
    $phpmailer->Port       = intval($opts['smtp_port'] ?? 587);
    $phpmailer->Username   = $opts['smtp_user'] ?? '';
    $phpmailer->Password   = $opts['smtp_pass'] ?? '';
    $phpmailer->SMTPSecure = $phpmailer->Port == 465 ? 'ssl' : 'tls';
    $phpmailer->From       = $opts['smtp_from_email'] ?? get_option('admin_email');
    $phpmailer->FromName   = $opts['smtp_from_name'] ?? get_bloginfo('name');
});

// ── Theme Settings ────────────────────────────────────────────────────────────
function jahid_page_settings() {
    $opts = get_option('jahid_theme_options', []);
    ob_start();
    ?>
    <form method="post" action="options.php" class="jahid-settings-form">
        <?php settings_fields('jahid_jahid_theme_options_group'); ?>
        <div class="jahid-fields-grid">
            <div class="jahid-field">
                <label>Default Theme Mode</label>
                <select name="jahid_theme_options[default_theme]" class="regular-text">
                    <option value="dark"  <?= selected($opts['default_theme'] ?? 'dark', 'dark',  false) ?>>Dark</option>
                    <option value="light" <?= selected($opts['default_theme'] ?? 'dark', 'light', false) ?>>Light</option>
                </select>
            </div>
            <?php
            jahid_field_toggle('show_code_rain', 'Show Code Rain on Hero', $opts['show_code_rain'] ?? 0, 'jahid_theme_options');
            jahid_field_toggle('show_mouse_glow', 'Show Mouse Glow Effect', $opts['show_mouse_glow'] ?? 1, 'jahid_theme_options');
            ?>
        </div>
        <div class="jahid-form-footer"><?php submit_button('Save Changes', 'primary', 'submit', false); ?></div>
    </form>
    <?php
    jahid_admin_wrap('Theme Settings', ob_get_clean());
}
