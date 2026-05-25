<?php
/**
 * Template Name: About Page
 */
jahid_output_head_meta('about');
$a      = get_option('jahid_site_about', []);
$theme  = jahid_get_theme();
$socials    = array_filter(json_decode($a['socials'] ?? '[]', true) ?: [], fn($s) => empty($s['enabled']) || $s['enabled']);
$experiences= array_filter(json_decode($a['experiences'] ?? '[]', true) ?: [], fn($e) => empty($e['enabled']) || $e['enabled']);
$studies    = array_filter(json_decode($a['studies'] ?? '[]', true) ?: [], fn($s) => empty($s['enabled']) || $s['enabled']);
$languages  = array_filter(json_decode($a['languages'] ?? '[]', true) ?: [], fn($l) => empty($l['enabled']) || $l['enabled']);
$tech_items = array_filter(json_decode($a['tech_items'] ?? '[]', true) ?: [], fn($t) => empty($t['enabled']) || $t['enabled']);
get_header();
?>

<main class="jahid-main">
<section class="jahid-about-section" id="about">
<div class="jahid-about-inner">

    <!-- ── TOP BENTO GRID ───────────────────────────────────────────────── -->
    <div class="jahid-bento-grid">

        <?php if (($a['hero_enabled'] ?? '1') !== '0'): ?>
        <!-- Main Intro Card -->
        <div class="jahid-bento-card jahid-bento-intro reveal-up" data-reveal>
            <?php if (($a['badge_enabled'] ?? '1') !== '0'): ?>
            <div class="jahid-about-badge">
                <span class="jahid-pulse-dot"></span>
                <?= esc_html($a['badge_text'] ?? 'Available for work') ?>
            </div>
            <?php endif; ?>

            <h2 class="jahid-about-headline">
                <?= esc_html($a['headline_pre'] ?? 'Crafting digital experiences with') ?>
                <em class="jahid-accent"><?= esc_html($a['headline_italic'] ?? 'purpose') ?></em><?= esc_html($a['headline_suffix'] ?? '.') ?>
            </h2>

            <p class="jahid-about-bio">
                <?= wp_kses_post($a['bio'] ?? "I'm Jahid Hasan, founder of Apifel DIGI. I design brands and build websites — combining strong visual thinking with solid development skills to help creators stand out.") ?>
            </p>

            <div class="jahid-about-ctas">
                <?php if (($a['cta_enabled'] ?? '1') !== '0'): ?>
                <a href="<?= esc_url($a['cta_url'] ?? home_url('/contact')) ?>" class="jahid-btn jahid-btn-primary">
                    <?= esc_html($a['cta_label'] ?? 'Hire Me Now') ?>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
                <?php endif; ?>
                <?php if (($a['socials_enabled'] ?? '1') !== '0' && !empty($socials)): ?>
                <div class="jahid-about-socials">
                    <?php foreach ($socials as $s): ?>
                    <a href="<?= esc_url($s['url'] ?? '#') ?>" class="jahid-about-social-btn" target="_blank" rel="noopener" aria-label="<?= esc_attr($s['label'] ?? '') ?>">
                        <?= jahid_social_icon($s['label'] ?? '') ?>
                    </a>
                    <?php endforeach; ?>
                </div>
                <?php endif; ?>
            </div>
        </div>
        <?php endif; ?>

        <?php if (($a['profile_enabled'] ?? '1') !== '0'): ?>
        <!-- Profile Image Card -->
        <div class="jahid-bento-card jahid-bento-profile reveal-up" data-reveal>
            <img src="<?= esc_url($a['profile_image'] ?? 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=800') ?>"
                 alt="<?= esc_attr($a['profile_name'] ?? 'Profile') ?>" class="jahid-profile-img">
            <div class="jahid-profile-overlay">
                <h3 class="jahid-profile-name"><?= esc_html($a['profile_name'] ?? 'Jahid Hasan') ?></h3>
                <p class="jahid-profile-role"><?= esc_html($a['profile_role'] ?? 'Graphic Designer & Dev') ?></p>
            </div>
        </div>
        <?php endif; ?>

        <!-- Location & CV Stack -->
        <div class="jahid-bento-stack">
            <?php if (($a['location_enabled'] ?? '1') !== '0'): ?>
            <div class="jahid-bento-card jahid-bento-location reveal-up" data-reveal>
                <div class="jahid-bento-icon-wrap">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                </div>
                <p class="jahid-bento-location-text">
                    <?= esc_html($a['location_line1'] ?? 'Based in Dhaka,') ?><br>
                    <?= esc_html($a['location_line2'] ?? 'Bangladesh') ?>
                </p>
            </div>
            <?php endif; ?>
            <?php if (($a['cv_enabled'] ?? '1') !== '0'): ?>
            <a href="<?= esc_url($a['cv_url'] ?? '#') ?>" class="jahid-bento-card jahid-bento-cv reveal-up" data-reveal>
                <svg class="jahid-bento-cv-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="40" height="40"><path d="M7 17L17 7M7 7h10v10"/></svg>
                <p><?= esc_html($a['cv_label'] ?? 'Download CV') ?></p>
            </a>
            <?php endif; ?>
        </div>
    </div>

    <!-- ── SECOND ROW ───────────────────────────────────────────────────── -->
    <div class="jahid-about-second-row">

        <?php if (($a['experience_enabled'] ?? '1') !== '0'): ?>
        <div class="jahid-bento-card jahid-bento-experience reveal-up" data-reveal>
            <h3 class="jahid-bento-heading">
                <span class="jahid-dot-blue"></span>
                <?= esc_html($a['experience_title'] ?? 'Work Experience') ?>
            </h3>
            <div class="jahid-timeline">
                <div class="jahid-timeline-line"></div>
                <?php foreach ($experiences as $exp): ?>
                <div class="jahid-timeline-item">
                    <div class="jahid-timeline-dot"></div>
                    <div class="jahid-timeline-content">
                        <h4 class="jahid-timeline-company"><?= esc_html($exp['company'] ?? '') ?></h4>
                        <div class="jahid-timeline-role"><?= esc_html($exp['role'] ?? '') ?></div>
                    </div>
                    <div class="jahid-timeline-period"><?= esc_html($exp['period'] ?? '') ?></div>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
        <?php endif; ?>

        <div class="jahid-about-sidebar">
            <?php if (($a['studies_enabled'] ?? '1') !== '0' && !empty($studies)): ?>
            <div class="jahid-bento-card reveal-up" data-reveal>
                <h3 class="jahid-bento-heading"><?= esc_html($a['studies_title'] ?? 'Studies') ?></h3>
                <div class="jahid-studies-list">
                    <?php foreach ($studies as $i => $s): ?>
                    <?php if ($i > 0): ?><hr class="jahid-divider"><?php endif; ?>
                    <div class="jahid-study-item">
                        <h4><?= esc_html($s['title'] ?? '') ?></h4>
                        <p><?= esc_html($s['detail'] ?? '') ?></p>
                    </div>
                    <?php endforeach; ?>
                </div>
            </div>
            <?php endif; ?>

            <?php if (($a['languages_enabled'] ?? '1') !== '0' && !empty($languages)): ?>
            <div class="jahid-bento-card reveal-up" data-reveal>
                <h3 class="jahid-lang-heading"><?= esc_html($a['languages_title'] ?? 'Languages') ?></h3>
                <div class="jahid-lang-pills">
                    <?php foreach ($languages as $l): ?>
                    <span class="jahid-lang-pill"><?= esc_html($l['name'] ?? '') ?></span>
                    <?php endforeach; ?>
                </div>
            </div>
            <?php endif; ?>
        </div>
    </div>

    <!-- ── TECH STACK ───────────────────────────────────────────────────── -->
    <?php if (($a['tech_enabled'] ?? '1') !== '0' && !empty($tech_items)): ?>
    <div class="jahid-bento-card jahid-bento-tech reveal-up" data-reveal>
        <div class="jahid-bento-tech-header">
            <h3 class="jahid-bento-heading">
                <span class="jahid-dot-blue"></span>
                <?= esc_html($a['tech_title'] ?? 'Technical Arsenal') ?>
            </h3>
            <p class="jahid-bento-tech-desc"><?= esc_html($a['tech_description'] ?? 'The tools and technologies I use to bring ideas to life.') ?></p>
        </div>
        <div class="jahid-tech-grid">
            <?php foreach ($tech_items as $t): ?>
            <div class="jahid-tech-item">
                <span class="jahid-tech-icon"><?= esc_html($t['icon'] ?? '') ?></span>
                <span class="jahid-tech-name"><?= esc_html($t['name'] ?? '') ?></span>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
    <?php endif; ?>

</div>
</section>
</main>

<?php get_footer(); ?>
