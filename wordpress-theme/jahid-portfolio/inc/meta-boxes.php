<?php
/**
 * Custom Meta Boxes for Projects CPT
 */
defined('ABSPATH') || exit;

add_action('add_meta_boxes', function () {
    add_meta_box('jahid_project_details', 'Project Details', 'jahid_project_details_cb', 'project', 'normal', 'high');
    add_meta_box('jahid_project_media',   'Project Media',   'jahid_project_media_cb',   'project', 'normal', 'default');
    add_meta_box('jahid_project_seo',     'Project SEO',     'jahid_project_seo_cb',     'project', 'side',   'default');
});

function jahid_meta_field($label, $name, $value, $type = 'text', $placeholder = '') {
    echo '<div class="jahid-meta-field">';
    echo '<label>' . esc_html($label) . '</label>';
    if ($type === 'textarea') {
        echo '<textarea name="' . esc_attr($name) . '" rows="4" class="widefat">' . esc_textarea($value) . '</textarea>';
    } elseif ($type === 'url') {
        echo '<input type="url" name="' . esc_attr($name) . '" value="' . esc_attr($value) . '" class="widefat" placeholder="' . esc_attr($placeholder) . '">';
    } else {
        echo '<input type="text" name="' . esc_attr($name) . '" value="' . esc_attr($value) . '" class="widefat" placeholder="' . esc_attr($placeholder) . '">';
    }
    echo '</div>';
}

function jahid_project_details_cb($post) {
    wp_nonce_field('jahid_project_save', 'jahid_project_nonce');
    $m = function ($key, $default = '') { return get_post_meta(get_the_ID(), '_project_' . $key, true) ?: $default; };
    $tags    = json_decode($m('tags', '[]'), true) ?: [];
    $tech    = json_decode($m('tech', '[]'), true) ?: [];
    $results = json_decode($m('results', '[]'), true) ?: [];
    ?>
    <div class="jahid-meta-grid">
        <?php
        jahid_meta_field('Category',   '_project_category',  $m('category'));
        jahid_meta_field('Year',        '_project_year',      $m('year'),      'text', '2024');
        jahid_meta_field('Client',      '_project_client',    $m('client'));
        jahid_meta_field('Timeline',    '_project_timeline',  $m('timeline'),  'text', '3 months');
        jahid_meta_field('Role',        '_project_role',      $m('role'));
        jahid_meta_field('Sort Order',  '_project_sort_order', $m('sort_order', '0'));
        jahid_meta_field('Live URL',    '_project_live_url',  $m('live_url'),  'url');
        jahid_meta_field('Repo URL',    '_project_repo_url',  $m('repo_url'),  'url');
        ?>
        <div class="jahid-meta-field jahid-meta-full">
            <label><input type="checkbox" name="_project_published" value="1" <?= checked($m('published', '1'), '1', false) ?>> Published (visible on site)</label>
        </div>
    </div>

    <div class="jahid-meta-field jahid-meta-full">
        <label>Overview</label>
        <textarea name="_project_overview" rows="4" class="widefat"><?= esc_textarea($m('overview')) ?></textarea>
    </div>
    <div class="jahid-meta-field jahid-meta-full">
        <label>Challenge</label>
        <textarea name="_project_challenge" rows="4" class="widefat"><?= esc_textarea($m('challenge')) ?></textarea>
    </div>
    <div class="jahid-meta-field jahid-meta-full">
        <label>Solution</label>
        <textarea name="_project_solution" rows="4" class="widefat"><?= esc_textarea($m('solution')) ?></textarea>
    </div>

    <div class="jahid-meta-field jahid-meta-full">
        <label>Tags (comma-separated)</label>
        <input type="text" name="_project_tags_raw" value="<?= esc_attr(implode(', ', $tags)) ?>" class="widefat" placeholder="Branding, Web Design, React">
        <input type="hidden" name="_project_tags" value="<?= esc_attr(json_encode($tags)) ?>">
    </div>
    <div class="jahid-meta-field jahid-meta-full">
        <label>Tech Stack (comma-separated)</label>
        <input type="text" name="_project_tech_raw" value="<?= esc_attr(implode(', ', $tech)) ?>" class="widefat" placeholder="React, Node.js, PostgreSQL">
        <input type="hidden" name="_project_tech" value="<?= esc_attr(json_encode($tech)) ?>">
    </div>

    <div class="jahid-meta-field jahid-meta-full">
        <label>Results / Metrics</label>
        <div class="jahid-repeater" id="results-repeater">
            <input type="hidden" name="_project_results" class="jahid-repeater-data" value="<?= esc_attr(json_encode($results)) ?>">
            <div class="jahid-repeater-items">
                <?php foreach ($results as $r): ?>
                <div class="jahid-repeater-item">
                    <div class="jahid-repeater-row">
                        <input type="text" placeholder="Label" value="<?= esc_attr($r['label'] ?? '') ?>" data-field="label" style="width:160px">
                        <input type="text" placeholder="Value (e.g. +40%)" value="<?= esc_attr($r['value'] ?? '') ?>" data-field="value" style="width:120px">
                        <button type="button" class="button jahid-remove-item">×</button>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
            <button type="button" class="button jahid-add-item" data-template='{"label":"","value":""}'>+ Add Result</button>
        </div>
    </div>
    <?php
}

function jahid_project_media_cb($post) {
    $cover   = get_post_meta($post->ID, '_project_cover', true);
    $gallery = json_decode(get_post_meta($post->ID, '_project_gallery', true) ?: '[]', true) ?: [];
    ?>
    <div class="jahid-meta-field">
        <label>Cover Image URL</label>
        <div class="jahid-image-field">
            <?php if ($cover): ?>
            <img src="<?= esc_url($cover) ?>" class="jahid-image-preview" style="max-width:300px;border-radius:8px;margin-bottom:8px;display:block;">
            <?php endif; ?>
            <input type="url" name="_project_cover" value="<?= esc_attr($cover) ?>" class="widefat jahid-image-url">
            <button type="button" class="button jahid-upload-btn" data-target="_project_cover">Upload Cover</button>
        </div>
    </div>

    <div class="jahid-meta-field jahid-meta-full">
        <label>Gallery Images (URLs, one per line)</label>
        <textarea name="_project_gallery_raw" rows="5" class="widefat" placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"><?= esc_textarea(implode("\n", $gallery)) ?></textarea>
        <input type="hidden" name="_project_gallery" value="<?= esc_attr(json_encode($gallery)) ?>">
        <p class="description">Enter one image URL per line.</p>
    </div>
    <?php
}

function jahid_project_seo_cb($post) {
    $m = function ($key, $default = '') { return get_post_meta(get_the_ID(), '_project_' . $key, true) ?: $default; };
    jahid_meta_field('Meta Title',       '_project_meta_title',       $m('meta_title'));
    jahid_meta_field('Meta Description', '_project_meta_description', $m('meta_description'), 'textarea');
    jahid_meta_field('OG Image URL',     '_project_og_image',         $m('og_image'), 'url');
}

// ── Save meta boxes ───────────────────────────────────────────────────────────
add_action('save_post_project', function ($post_id) {
    if (!isset($_POST['jahid_project_nonce']) || !wp_verify_nonce($_POST['jahid_project_nonce'], 'jahid_project_save')) return;
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) return;
    if (!current_user_can('edit_post', $post_id)) return;

    $text_fields = ['category', 'year', 'client', 'timeline', 'role', 'sort_order', 'cover', 'meta_title'];
    foreach ($text_fields as $field) {
        if (isset($_POST["_project_$field"])) {
            update_post_meta($post_id, "_project_$field", sanitize_text_field($_POST["_project_$field"]));
        }
    }

    $url_fields = ['live_url', 'repo_url', 'og_image'];
    foreach ($url_fields as $field) {
        if (isset($_POST["_project_$field"])) {
            update_post_meta($post_id, "_project_$field", esc_url_raw($_POST["_project_$field"]));
        }
    }

    $long_fields = ['overview', 'challenge', 'solution', 'meta_description'];
    foreach ($long_fields as $field) {
        if (isset($_POST["_project_$field"])) {
            update_post_meta($post_id, "_project_$field", sanitize_textarea_field($_POST["_project_$field"]));
        }
    }

    // Published
    $published = isset($_POST['_project_published']) ? '1' : '0';
    update_post_meta($post_id, '_project_published', $published);

    // Tags & Tech from raw comma-separated
    if (isset($_POST['_project_tags_raw'])) {
        $tags = array_map('trim', explode(',', sanitize_text_field($_POST['_project_tags_raw'])));
        $tags = array_filter($tags);
        update_post_meta($post_id, '_project_tags', json_encode(array_values($tags)));
    }
    if (isset($_POST['_project_tech_raw'])) {
        $tech = array_map('trim', explode(',', sanitize_text_field($_POST['_project_tech_raw'])));
        $tech = array_filter($tech);
        update_post_meta($post_id, '_project_tech', json_encode(array_values($tech)));
    }

    // Gallery from textarea
    if (isset($_POST['_project_gallery_raw'])) {
        $lines   = explode("\n", $_POST['_project_gallery_raw']);
        $gallery = array_filter(array_map('esc_url_raw', array_map('trim', $lines)));
        update_post_meta($post_id, '_project_gallery', json_encode(array_values($gallery)));
    }

    // Results JSON (passed directly)
    if (isset($_POST['_project_results'])) {
        $results = json_decode(wp_unslash($_POST['_project_results']), true);
        if (is_array($results)) {
            update_post_meta($post_id, '_project_results', json_encode($results));
        }
    }
});
