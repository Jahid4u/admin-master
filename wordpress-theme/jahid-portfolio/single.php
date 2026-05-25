<?php
while (have_posts()): the_post();
$cat   = get_the_category(get_the_ID());
$thumb = get_the_post_thumbnail_url(get_the_ID(), 'project-hero');
get_header();
?>

<main class="jahid-main">
<article class="jahid-blog-single">
    <div class="jahid-blog-single-inner">

        <!-- Back Link -->
        <a href="<?= home_url('/blog') ?>" class="jahid-back-link">
            <span class="jahid-back-btn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            </span>
            Back to Journal
        </a>

        <div class="jahid-blog-single-layout">
            <div class="jahid-blog-single-content">
                <!-- Post Header -->
                <header class="jahid-post-header">
                    <div class="jahid-post-meta-top">
                        <?php if ($cat): ?>
                        <span class="jahid-blog-cat"><?= esc_html($cat[0]->name) ?></span>
                        <?php endif; ?>
                        <span class="jahid-post-date">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                            <?= get_the_date('M j, Y') ?>
                        </span>
                        <span class="jahid-post-readtime">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            <?= jahid_read_time(get_the_content()) ?>
                        </span>
                    </div>

                    <h1 class="jahid-post-title"><?= esc_html(get_the_title()) ?></h1>
                    <div class="jahid-post-title-rule"></div>
                    <?php if (get_the_excerpt()): ?>
                    <p class="jahid-post-lead"><?= esc_html(get_the_excerpt()) ?></p>
                    <?php endif; ?>
                </header>

                <!-- Cover Image -->
                <?php if ($thumb): ?>
                <div class="jahid-post-cover-wrap">
                    <div class="jahid-post-cover-glow" aria-hidden="true"></div>
                    <div class="jahid-post-cover-img-wrap">
                        <img src="<?= esc_url($thumb) ?>" alt="<?= esc_attr(get_the_title()) ?>" class="jahid-post-cover-img" loading="eager">
                    </div>
                </div>
                <?php endif; ?>

                <!-- Content -->
                <div class="jahid-post-body prose">
                    <?php the_content(); ?>
                </div>

                <!-- Tags -->
                <?php $tags = get_the_tags(); if ($tags): ?>
                <div class="jahid-post-tags">
                    <?php foreach ($tags as $t): ?>
                    <a href="<?= get_tag_link($t->term_id) ?>" class="jahid-tech-tag"><?= esc_html($t->name) ?></a>
                    <?php endforeach; ?>
                </div>
                <?php endif; ?>
            </div>

            <!-- Sidebar -->
            <aside class="jahid-blog-sidebar">
                <?php $socials = jahid_get_socials(); ?>
                <div class="jahid-blog-author-card">
                    <div class="jahid-blog-author-avatar-wrap">
                        <?php $nav = jahid_get_nav_opts(); ?>
                        <img src="<?= esc_url($nav['avatar_url'] ?: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200') ?>" alt="Author" class="jahid-blog-author-avatar">
                    </div>
                    <h4 class="jahid-blog-author-name"><?= esc_html($nav['brand_name'] ?? 'Jahid Hasan') ?></h4>
                    <p class="jahid-blog-author-role">Design Engineer</p>
                    <p class="jahid-blog-author-bio">Founder, designer, and developer. Sharing insights on crafting modern digital experiences.</p>
                    <?php if (!empty($socials)): ?>
                    <a href="<?= esc_url(array_values($socials)[0]['url'] ?? '#') ?>" class="jahid-btn jahid-btn-primary jahid-btn-sm" target="_blank" rel="noopener">Follow</a>
                    <?php endif; ?>
                </div>

                <div class="jahid-blog-share-card">
                    <span class="jahid-blog-share-label">Share this article</span>
                    <div class="jahid-blog-share-btns">
                        <a href="https://twitter.com/intent/tweet?url=<?= urlencode(get_permalink()) ?>&text=<?= urlencode(get_the_title()) ?>"
                           class="jahid-share-btn" target="_blank" rel="noopener" aria-label="Share on Twitter">
                            <?= jahid_social_icon('twitter') ?>
                        </a>
                        <a href="https://www.linkedin.com/sharing/share-offsite/?url=<?= urlencode(get_permalink()) ?>"
                           class="jahid-share-btn" target="_blank" rel="noopener" aria-label="Share on LinkedIn">
                            <?= jahid_social_icon('linkedin') ?>
                        </a>
                        <button class="jahid-share-btn" id="copy-link-btn" data-url="<?= esc_attr(get_permalink()) ?>" aria-label="Copy link">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        </button>
                    </div>
                </div>
            </aside>
        </div>

        <!-- Related Posts -->
        <?php
        $cats    = get_the_category(get_the_ID());
        $cat_ids = $cats ? array_map(fn($c) => $c->term_id, $cats) : [];
        $related = get_posts([
            'post_type'      => 'post',
            'posts_per_page' => 3,
            'post__not_in'   => [get_the_ID()],
            'category__in'   => $cat_ids,
            'post_status'    => 'publish',
        ]);
        if (!empty($related)):
        ?>
        <div class="jahid-related-posts">
            <div class="jahid-related-header">
                <span class="jahid-dot-blue"></span>
                <h3>Keep Reading</h3>
            </div>
            <div class="jahid-blog-grid">
                <?php foreach ($related as $rp):
                    $rcat  = get_the_category($rp->ID);
                    $rthumb = get_the_post_thumbnail_url($rp->ID, 'blog-card');
                ?>
                <article class="jahid-blog-card">
                    <a href="<?= get_permalink($rp->ID) ?>" class="jahid-blog-card-link">
                        <div class="jahid-blog-img-wrap">
                            <?php if ($rthumb): ?>
                            <img src="<?= esc_url($rthumb) ?>" alt="<?= esc_attr($rp->post_title) ?>" class="jahid-blog-img" loading="lazy">
                            <?php else: ?><div class="jahid-blog-img-placeholder"></div><?php endif; ?>
                        </div>
                        <div class="jahid-blog-info">
                            <?php if ($rcat): ?><span class="jahid-blog-cat"><?= esc_html($rcat[0]->name) ?></span><?php endif; ?>
                            <h4 class="jahid-blog-title"><?= esc_html($rp->post_title) ?></h4>
                            <p class="jahid-blog-desc"><?= esc_html(wp_trim_words($rp->post_excerpt ?: $rp->post_content, 18)) ?></p>
                        </div>
                    </a>
                </article>
                <?php endforeach; ?>
            </div>
        </div>
        <?php endif; ?>

    </div>
</article>
</main>

<?php endwhile; get_footer(); ?>
