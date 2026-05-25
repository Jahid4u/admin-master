<?php
jahid_output_head_meta('work');
$w = get_option('jahid_site_work', []);
get_header();
?>

<main class="jahid-main">
<section class="jahid-work-archive" id="work">
<div class="jahid-section-inner">

    <div class="jahid-section-header" data-reveal>
        <?php if (($w['badge_enabled'] ?? '1') !== '0'): ?>
        <div class="jahid-section-badge">
            <span class="jahid-pulse-dot"></span>
            <?= esc_html($w['badge_text'] ?? 'Selected Works') ?>
        </div>
        <?php endif; ?>
        <?php if (($w['headline_enabled'] ?? '1') !== '0'): ?>
        <h1 class="jahid-section-headline">
            <?= esc_html($w['headline_pre'] ?? 'Projects that blend') ?>
            <em class="jahid-accent"><?= esc_html($w['headline_italic1'] ?? 'form') ?></em>
            <?= esc_html($w['headline_mid'] ?? 'and') ?>
            <em class="jahid-accent"><?= esc_html($w['headline_italic2'] ?? 'function') ?></em><?= esc_html($w['headline_suffix'] ?? '.') ?>
        </h1>
        <?php endif; ?>
        <?php if (($w['description_enabled'] ?? '1') !== '0' && !empty($w['description'])): ?>
        <p class="jahid-section-desc"><?= esc_html($w['description']) ?></p>
        <?php endif; ?>
    </div>

    <div class="jahid-projects-grid">
        <?php $projects = jahid_get_projects(); ?>
        <?php if (!empty($projects)): ?>
            <?php foreach ($projects as $proj):
                $m     = jahid_get_project_meta($proj->ID);
                $cover = $m['cover'] ?: get_the_post_thumbnail_url($proj->ID, 'project-thumb');
            ?>
            <div class="jahid-project-card reveal-up" data-reveal>
                <a href="<?= get_permalink($proj->ID) ?>" class="jahid-project-card-link">
                    <div class="jahid-project-img-wrap">
                        <?php if ($cover): ?>
                        <img src="<?= esc_url($cover) ?>" alt="<?= esc_attr($proj->post_title) ?>" class="jahid-project-img" loading="lazy">
                        <?php else: ?>
                        <div class="jahid-project-img-placeholder"></div>
                        <?php endif; ?>
                        <div class="jahid-project-overlay"></div>
                        <div class="jahid-project-view-btn">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="22" height="22"><path d="M7 17L17 7M7 7h10v10"/></svg>
                        </div>
                    </div>
                    <div class="jahid-project-info">
                        <?php if ($m['category']): ?>
                        <span class="jahid-project-cat"><?= esc_html($m['category']) ?></span>
                        <?php endif; ?>
                        <h2 class="jahid-project-title"><?= esc_html($proj->post_title) ?></h2>
                        <p class="jahid-project-desc"><?= esc_html(wp_trim_words($proj->post_excerpt ?: $m['overview'], 20)) ?></p>
                    </div>
                </a>
            </div>
            <?php endforeach; ?>
        <?php else: ?>
            <div class="jahid-empty-state">No projects published yet.</div>
        <?php endif; ?>
    </div>

</div>
</section>
</main>

<?php get_footer(); ?>
