<?php
while (have_posts()): the_post();
$m      = jahid_get_project_meta(get_the_ID());
$cover  = $m['cover'] ?: get_the_post_thumbnail_url(get_the_ID(), 'project-hero');
$gallery = $m['gallery'] ?: [];
if (is_array($gallery) && is_string($gallery[0] ?? null)) {} // already array

// SEO
if ($m['meta_title'] || $m['meta_description']) {
    add_action('wp_head', function() use ($m) {
        if ($m['meta_title'])       echo '<meta property="og:title" content="' . esc_attr($m['meta_title']) . '">';
        if ($m['meta_description']) echo '<meta name="description" content="' . esc_attr($m['meta_description']) . '">';
        if ($m['og_image'])         echo '<meta property="og:image" content="' . esc_url($m['og_image']) . '">';
    });
}
get_header();
?>

<main class="jahid-main">
<article class="jahid-project-single">
    <div class="jahid-project-single-inner">

        <!-- Back Link -->
        <a href="<?= get_post_type_archive_link('project') ?>" class="jahid-back-link">
            <span class="jahid-back-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </span>
            Back to Work
        </a>

        <!-- Hero Image -->
        <?php if ($cover): ?>
        <div class="jahid-project-hero-wrap">
            <div class="jahid-project-hero-glow" aria-hidden="true"></div>
            <div class="jahid-project-hero-img-wrap">
                <img src="<?= esc_url($cover) ?>" alt="<?= esc_attr(get_the_title()) ?>" class="jahid-project-hero-img" loading="eager">
            </div>
        </div>
        <?php endif; ?>

        <!-- Meta Bar -->
        <div class="jahid-project-meta-bar">
            <?php if ($m['category']): ?>
            <div class="jahid-project-meta-chip jahid-project-meta-cat"><?= esc_html($m['category']) ?></div>
            <?php endif; ?>
            <?php if ($m['year']):     echo '<div class="jahid-project-meta-chip">' . esc_html($m['year'])     . '</div>'; endif; ?>
            <?php if ($m['client']):   echo '<div class="jahid-project-meta-chip">' . esc_html($m['client'])   . '</div>'; endif; ?>
            <?php if ($m['timeline']): echo '<div class="jahid-project-meta-chip">' . esc_html($m['timeline']) . '</div>'; endif; ?>
            <?php if ($m['role']):     echo '<div class="jahid-project-meta-chip">' . esc_html($m['role'])     . '</div>'; endif; ?>
        </div>

        <div class="jahid-project-layout">
            <!-- Main Content -->
            <div class="jahid-project-content">
                <h1 class="jahid-project-single-title"><?= esc_html(get_the_title()) ?></h1>

                <?php if (has_excerpt() || $m['overview']): ?>
                <p class="jahid-project-excerpt"><?= esc_html(get_the_excerpt() ?: $m['overview']) ?></p>
                <?php endif; ?>

                <?php if ($m['overview']): ?>
                <div class="jahid-project-story">
                    <h2>Overview</h2>
                    <p><?= nl2br(esc_html($m['overview'])) ?></p>
                </div>
                <?php endif; ?>

                <?php if ($m['challenge']): ?>
                <div class="jahid-project-story">
                    <h2>The Challenge</h2>
                    <p><?= nl2br(esc_html($m['challenge'])) ?></p>
                </div>
                <?php endif; ?>

                <?php if ($m['solution']): ?>
                <div class="jahid-project-story">
                    <h2>The Solution</h2>
                    <p><?= nl2br(esc_html($m['solution'])) ?></p>
                </div>
                <?php endif; ?>

                <?php if (get_the_content()): ?>
                <div class="jahid-project-body prose">
                    <?php the_content(); ?>
                </div>
                <?php endif; ?>

                <!-- Results -->
                <?php if (!empty($m['results'])): ?>
                <div class="jahid-project-results">
                    <h2>Results</h2>
                    <div class="jahid-results-grid">
                        <?php foreach ($m['results'] as $r): ?>
                        <div class="jahid-result-card">
                            <span class="jahid-result-val"><?= esc_html($r['value'] ?? '') ?></span>
                            <span class="jahid-result-label"><?= esc_html($r['label'] ?? '') ?></span>
                        </div>
                        <?php endforeach; ?>
                    </div>
                </div>
                <?php endif; ?>

                <!-- Gallery -->
                <?php if (!empty($gallery)): ?>
                <div class="jahid-project-gallery">
                    <h2>Gallery</h2>
                    <div class="jahid-gallery-grid">
                        <?php foreach ($gallery as $img): ?>
                        <div class="jahid-gallery-item">
                            <img src="<?= esc_url($img) ?>" alt="Project gallery" loading="lazy" class="jahid-gallery-img">
                        </div>
                        <?php endforeach; ?>
                    </div>
                </div>
                <?php endif; ?>
            </div>

            <!-- Sidebar -->
            <aside class="jahid-project-sidebar">
                <?php if ($m['live_url'] || $m['repo_url']): ?>
                <div class="jahid-project-sidebar-card">
                    <h4>Project Links</h4>
                    <?php if ($m['live_url']): ?>
                    <a href="<?= esc_url($m['live_url']) ?>" class="jahid-sidebar-link" target="_blank" rel="noopener">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        View Live Site
                    </a>
                    <?php endif; ?>
                    <?php if ($m['repo_url']): ?>
                    <a href="<?= esc_url($m['repo_url']) ?>" class="jahid-sidebar-link" target="_blank" rel="noopener">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                        View on GitHub
                    </a>
                    <?php endif; ?>
                </div>
                <?php endif; ?>

                <?php if (!empty($m['tech'])): ?>
                <div class="jahid-project-sidebar-card">
                    <h4>Tech Stack</h4>
                    <div class="jahid-tech-tags">
                        <?php foreach ($m['tech'] as $t): ?>
                        <span class="jahid-tech-tag"><?= esc_html($t) ?></span>
                        <?php endforeach; ?>
                    </div>
                </div>
                <?php endif; ?>

                <?php if (!empty($m['tags'])): ?>
                <div class="jahid-project-sidebar-card">
                    <h4>Tags</h4>
                    <div class="jahid-tech-tags">
                        <?php foreach ($m['tags'] as $t): ?>
                        <span class="jahid-tech-tag"><?= esc_html($t) ?></span>
                        <?php endforeach; ?>
                    </div>
                </div>
                <?php endif; ?>
            </aside>
        </div>

        <!-- Next/Prev Projects -->
        <div class="jahid-project-nav">
            <?php
            $all_projects = jahid_get_projects();
            $ids = array_map(fn($p) => $p->ID, $all_projects);
            $idx = array_search(get_the_ID(), $ids);
            $prev = $idx > 0 ? $all_projects[$idx - 1] : null;
            $next = $idx < count($ids) - 1 ? $all_projects[$idx + 1] : null;
            ?>
            <?php if ($prev): ?>
            <a href="<?= get_permalink($prev->ID) ?>" class="jahid-proj-nav-link jahid-proj-nav-prev">
                <span class="jahid-proj-nav-label">Previous Project</span>
                <span class="jahid-proj-nav-title"><?= esc_html($prev->post_title) ?></span>
            </a>
            <?php else: ?><div></div><?php endif; ?>
            <?php if ($next): ?>
            <a href="<?= get_permalink($next->ID) ?>" class="jahid-proj-nav-link jahid-proj-nav-next">
                <span class="jahid-proj-nav-label">Next Project</span>
                <span class="jahid-proj-nav-title"><?= esc_html($next->post_title) ?></span>
            </a>
            <?php endif; ?>
        </div>

    </div>
</article>
</main>

<?php endwhile; get_footer(); ?>
