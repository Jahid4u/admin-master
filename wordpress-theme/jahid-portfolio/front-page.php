<?php
$home = get_option('jahid_site_home', []);
$theme = jahid_get_theme();
jahid_output_head_meta('home');
get_header();
?>

<main class="jahid-main">

<?php if (($home['hero_enabled'] ?? '1') !== '0'): ?>
<!-- ── HERO ───────────────────────────────────────────────────────────────── -->
<section class="jahid-hero" id="home">
    <div class="jahid-hero-grid-bg" aria-hidden="true"></div>
    <div class="jahid-hero-flare" aria-hidden="true"></div>

    <div class="jahid-hero-inner">
        <div class="jahid-hero-left">

            <div class="jahid-hero-eyebrow" data-reveal>
                <span class="jahid-pulse-dot"></span>
                <?= esc_html($home['eyebrow_text'] ?? 'Apifel DIGI • SYSTEM DESIGN STUDIO') ?>
            </div>

            <div class="jahid-hero-headline-wrap" data-reveal>
                <h1 class="jahid-hero-headline">
                    <?= esc_html($home['hero_headline'] ?? 'Aesthetic') ?><br>
                    <span class="jahid-hero-headline-bold"><?= esc_html($home['hero_headline_bold'] ?? 'Intelligence') ?></span><br>
                    <span class="jahid-hero-headline-mono"><?= esc_html($home['hero_sub'] ?? '[& flawless systems]') ?>_</span>
                </h1>

                <p class="jahid-hero-desc">
                    <?= wp_kses_post($home['hero_desc'] ?? 'We design and engineer high-end digital products that command attention. Combining modern minimalist design rules with clean, uncompromising architectures.') ?>
                </p>
            </div>

            <div class="jahid-hero-ctas" data-reveal>
                <a href="<?= esc_url($home['cta_primary_url'] ?? home_url('/work')) ?>" class="jahid-btn jahid-btn-primary">
                    <?= esc_html($home['cta_primary_label'] ?? 'Explore Work') ?>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="13" height="13"><path d="M7 17L17 7M7 7h10v10"/></svg>
                </a>
                <a href="<?= esc_url($home['cta_secondary_url'] ?? home_url('/about')) ?>" class="jahid-btn jahid-btn-ghost">
                    <?= esc_html($home['cta_secondary_label'] ?? 'Read Narrative') ?>
                </a>
            </div>

            <div class="jahid-hero-stats" data-reveal>
                <div class="jahid-hero-stat">
                    <span class="jahid-hero-stat-index">01 / SCOPE</span>
                    <span class="jahid-hero-stat-val">Fullstack</span>
                </div>
                <div class="jahid-hero-stat">
                    <span class="jahid-hero-stat-index">02 / STANDARDS</span>
                    <span class="jahid-hero-stat-val">W3C Clean</span>
                </div>
                <div class="jahid-hero-stat">
                    <span class="jahid-hero-stat-index">03 / FOCUS</span>
                    <span class="jahid-hero-stat-val">Aesthetics</span>
                </div>
            </div>
        </div>

        <div class="jahid-hero-right">
            <div class="jahid-hero-card jahid-hero-main-card" data-reveal>
                <div class="jahid-hero-card-visual">
                    <svg class="jahid-hero-schematic" viewBox="0 0 400 180">
                        <circle cx="200" cy="90" r="60" fill="none" stroke="#3b82f6" stroke-width="1" stroke-dasharray="4 4" opacity="0.4"/>
                        <rect x="100" y="45" width="200" height="90" fill="none" stroke="#334155" stroke-width="0.5" opacity="0.5"/>
                        <line x1="0" y1="0" x2="400" y2="180" stroke="#1e293b" stroke-width="0.5" opacity="0.3"/>
                        <line x1="400" y1="0" x2="0" y2="180" stroke="#1e293b" stroke-width="0.5" opacity="0.3"/>
                    </svg>
                    <div class="jahid-hero-card-center">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20" class="jahid-hero-palette-icon"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>
                        <span class="jahid-hero-card-label">AESTHETIC SCHEMATIC</span>
                        <span class="jahid-hero-card-badge">compliance: 100%</span>
                    </div>
                </div>
                <div class="jahid-hero-card-meta">
                    <span>01 / DESIGN EXHIBIT</span>
                    <span>ESTABLISHED <?= date('Y') ?></span>
                </div>
                <h3 class="jahid-hero-card-title">Golden Ratio Layout Rules</h3>
                <p class="jahid-hero-card-desc">Grid alignments structured on dynamic aspect coordinates. Seamless layout proportions tailored for pristine aesthetics.</p>
            </div>

            <div class="jahid-hero-metrics">
                <div class="jahid-hero-metric-card" data-reveal>
                    <div class="jahid-hero-metric-row">
                        <span class="jahid-hero-metric-label">LCP SPEED</span>
                        <span class="jahid-hero-metric-dot"></span>
                    </div>
                    <span class="jahid-hero-metric-val">0.12S</span>
                    <span class="jahid-hero-metric-sub">LATEST CRITERIA</span>
                </div>
                <div class="jahid-hero-metric-card" data-reveal>
                    <div class="jahid-hero-metric-row">
                        <span class="jahid-hero-metric-label">W3C SEO</span>
                        <span class="jahid-hero-metric-dot"></span>
                    </div>
                    <span class="jahid-hero-metric-val">100/100</span>
                    <span class="jahid-hero-metric-sub">PERFECT SCORE</span>
                </div>
            </div>

            <div class="jahid-hero-location-bar" data-reveal>
                <div class="jahid-hero-location-left">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="11" height="11"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    LOCATED: DHAKA, BD
                </div>
                <div class="jahid-hero-location-right">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="11" height="11"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    UTC +6:00
                </div>
            </div>
        </div>
    </div>

    <div class="jahid-hero-footer-bar">
        <div class="jahid-hero-footer-left">
            <span>Aesthetic Systematization</span>
            <span class="jahid-hero-footer-sep"></span>
            <span>Pristine Technical Engineering</span>
        </div>
        <span>&copy; <?= date('Y') ?> APiFEL DIGI. All rights reserved.</span>
    </div>
</section>
<?php endif; ?>


<?php if (($home['work_enabled'] ?? '1') !== '0'):
    $w     = get_option('jahid_site_work', []);
    $projs = jahid_get_projects(4);
    if (!empty($projs)):
?>
<!-- ── WORK ──────────────────────────────────────────────────────────────── -->
<section class="jahid-work-section" id="work">
    <div class="jahid-section-inner">
        <div class="jahid-section-header" data-reveal>
            <?php if (!empty($w['badge_enabled'])): ?>
            <div class="jahid-section-badge">
                <span class="jahid-pulse-dot"></span>
                <?= esc_html($w['badge_text'] ?? 'Selected Works') ?>
            </div>
            <?php endif; ?>
            <?php if (!empty($w['headline_enabled'])): ?>
            <h2 class="jahid-section-headline">
                <?= esc_html($w['headline_pre'] ?? 'Projects that blend') ?>
                <em class="jahid-accent"><?= esc_html($w['headline_italic1'] ?? 'form') ?></em>
                <?= esc_html($w['headline_mid'] ?? 'and') ?>
                <em class="jahid-accent"><?= esc_html($w['headline_italic2'] ?? 'function') ?></em><?= esc_html($w['headline_suffix'] ?? '.') ?>
            </h2>
            <?php endif; ?>
            <?php if (!empty($w['description_enabled']) && !empty($w['description'])): ?>
            <p class="jahid-section-desc"><?= esc_html($w['description']) ?></p>
            <?php endif; ?>
        </div>

        <div class="jahid-projects-grid">
            <?php foreach ($projs as $proj):
                $m = jahid_get_project_meta($proj->ID);
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
                        <h3 class="jahid-project-title"><?= esc_html($proj->post_title) ?></h3>
                        <p class="jahid-project-desc"><?= esc_html(wp_trim_words($proj->post_excerpt ?: $m['overview'], 20)) ?></p>
                    </div>
                </a>
            </div>
            <?php endforeach; ?>
        </div>

        <div class="jahid-section-cta" data-reveal>
            <a href="<?= get_post_type_archive_link('project') ?>" class="jahid-btn jahid-btn-outline">
                View All Projects
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
        </div>
    </div>
</section>
<?php endif; endif; ?>


<?php if (($home['blog_enabled'] ?? '1') !== '0'):
    $b     = get_option('jahid_site_blog', []);
    $posts = get_posts(['post_type' => 'post', 'posts_per_page' => 3, 'post_status' => 'publish']);
    if (!empty($posts)):
?>
<!-- ── BLOG ──────────────────────────────────────────────────────────────── -->
<section class="jahid-blog-section" id="blog">
    <div class="jahid-section-inner">
        <div class="jahid-section-header" data-reveal>
            <?php if (!empty($b['badge_enabled'])): ?>
            <div class="jahid-section-badge">
                <span class="jahid-pulse-dot"></span>
                <?= esc_html($b['badge_text'] ?? 'Latest Writing') ?>
            </div>
            <?php endif; ?>
            <?php if (!empty($b['headline_enabled'])): ?>
            <h2 class="jahid-section-headline">
                <?= esc_html($b['headline_pre'] ?? 'Words that') ?>
                <em class="jahid-accent"><?= esc_html($b['headline_accent'] ?? 'inspire') ?></em>.
            </h2>
            <?php endif; ?>
        </div>

        <div class="jahid-blog-grid">
            <?php foreach ($posts as $post): setup_postdata($post);
                $cat   = get_the_category($post->ID);
                $thumb = get_the_post_thumbnail_url($post->ID, 'blog-card');
            ?>
            <article class="jahid-blog-card reveal-up" data-reveal>
                <a href="<?= get_permalink($post->ID) ?>" class="jahid-blog-card-link">
                    <div class="jahid-blog-img-wrap">
                        <?php if ($thumb): ?>
                        <img src="<?= esc_url($thumb) ?>" alt="<?= esc_attr($post->post_title) ?>" class="jahid-blog-img" loading="lazy">
                        <?php else: ?>
                        <div class="jahid-blog-img-placeholder"></div>
                        <?php endif; ?>
                    </div>
                    <div class="jahid-blog-info">
                        <?php if ($cat): ?>
                        <span class="jahid-blog-cat"><?= esc_html($cat[0]->name) ?></span>
                        <?php endif; ?>
                        <h3 class="jahid-blog-title"><?= esc_html($post->post_title) ?></h3>
                        <p class="jahid-blog-desc"><?= esc_html(wp_trim_words($post->post_excerpt ?: $post->post_content, 18)) ?></p>
                        <div class="jahid-blog-meta">
                            <span><?= get_the_date('M j, Y', $post->ID) ?></span>
                            <span>&middot;</span>
                            <span><?= jahid_read_time($post->post_content) ?></span>
                        </div>
                    </div>
                </a>
            </article>
            <?php endforeach; wp_reset_postdata(); ?>
        </div>

        <div class="jahid-section-cta" data-reveal>
            <a href="<?= home_url('/blog') ?>" class="jahid-btn jahid-btn-outline">
                Read All Articles
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
        </div>
    </div>
</section>
<?php endif; endif; ?>


<?php if (($home['contact_enabled'] ?? '1') !== '0'):
    $c = get_option('jahid_site_contact', []);
?>
<!-- ── CONTACT ───────────────────────────────────────────────────────────── -->
<section class="jahid-contact-section" id="contact">
    <div class="jahid-contact-inner">
        <div class="jahid-contact-left" data-reveal>
            <div class="jahid-contact-eyebrow"><?= esc_html($c['eyebrow_text'] ?? 'Contact') ?></div>
            <h2 class="jahid-contact-headline"><?= esc_html($c['headline_text'] ?? 'Get In Touch') ?></h2>
            <h3 class="jahid-contact-sub">
                <?= esc_html($c['side_headline_pre'] ?? "Let's start a") ?>
                <em class="jahid-accent"><?= esc_html($c['side_headline_italic'] ?? 'conversation') ?></em>.
            </h3>

            <div class="jahid-contact-info-list">
                <?php if (!empty($c['email_enabled']) && !empty($c['email_value'])): ?>
                <div class="jahid-contact-info-item">
                    <div class="jahid-contact-info-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                    </div>
                    <div>
                        <div class="jahid-contact-info-label"><?= esc_html($c['email_label'] ?? 'Email') ?></div>
                        <a href="mailto:<?= esc_attr($c['email_value']) ?>" class="jahid-contact-info-val"><?= esc_html($c['email_value']) ?></a>
                    </div>
                </div>
                <?php endif; ?>
                <?php if (!empty($c['phone_enabled']) && !empty($c['phone_value'])): ?>
                <div class="jahid-contact-info-item">
                    <div class="jahid-contact-info-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    </div>
                    <div>
                        <div class="jahid-contact-info-label"><?= esc_html($c['phone_label'] ?? 'Phone') ?></div>
                        <a href="tel:<?= esc_attr($c['phone_value']) ?>" class="jahid-contact-info-val"><?= esc_html($c['phone_value']) ?></a>
                    </div>
                </div>
                <?php endif; ?>
                <?php if (!empty($c['location_enabled']) && !empty($c['location_value'])): ?>
                <div class="jahid-contact-info-item">
                    <div class="jahid-contact-info-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    </div>
                    <div>
                        <div class="jahid-contact-info-label"><?= esc_html($c['location_label'] ?? 'Location') ?></div>
                        <span class="jahid-contact-info-val"><?= esc_html($c['location_value']) ?></span>
                    </div>
                </div>
                <?php endif; ?>
            </div>
        </div>

        <?php if (!empty($c['form_enabled'])): ?>
        <div class="jahid-contact-right" data-reveal>
            <form class="jahid-contact-form" id="contact-form">
                <div class="jahid-form-row">
                    <div class="jahid-form-field">
                        <label for="cf-name">Name</label>
                        <input type="text" id="cf-name" name="name" placeholder="Your name" required>
                    </div>
                    <div class="jahid-form-field">
                        <label for="cf-email">Email</label>
                        <input type="email" id="cf-email" name="email" placeholder="your@email.com" required>
                    </div>
                </div>
                <div class="jahid-form-field">
                    <label for="cf-subject">Subject</label>
                    <input type="text" id="cf-subject" name="subject" placeholder="What's this about?">
                </div>
                <div class="jahid-form-field">
                    <label for="cf-message">Message</label>
                    <textarea id="cf-message" name="message" rows="5" placeholder="Tell me about your project..." required></textarea>
                </div>
                <button type="submit" class="jahid-btn jahid-btn-primary jahid-form-submit">
                    <span class="jahid-submit-text">Send Message</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                </button>
                <div class="jahid-form-msg" id="contact-form-msg"></div>
            </form>
        </div>
        <?php endif; ?>
    </div>
</section>
<?php endif; ?>

</main>

<?php get_footer(); ?>
