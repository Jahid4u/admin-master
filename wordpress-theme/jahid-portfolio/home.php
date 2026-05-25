<?php
/**
 * Blog archive page (when static front page is set)
 */
jahid_output_head_meta('blog');
$b = get_option('jahid_site_blog', []);
get_header();
?>

<main class="jahid-main">
<section class="jahid-blog-archive" id="blog">
<div class="jahid-section-inner">

    <div class="jahid-section-header" data-reveal>
        <?php if (($b['badge_enabled'] ?? '1') !== '0'): ?>
        <div class="jahid-section-badge">
            <span class="jahid-pulse-dot"></span>
            <?= esc_html($b['badge_text'] ?? 'Latest Writing') ?>
        </div>
        <?php endif; ?>
        <?php if (($b['headline_enabled'] ?? '1') !== '0'): ?>
        <h1 class="jahid-section-headline">
            <?= esc_html($b['headline_pre'] ?? 'Words that') ?>
            <em class="jahid-accent"><?= esc_html($b['headline_accent'] ?? 'inspire') ?></em>.
        </h1>
        <?php endif; ?>
        <?php if (($b['description_enabled'] ?? '1') !== '0' && !empty($b['description'])): ?>
        <p class="jahid-section-desc"><?= esc_html($b['description']) ?></p>
        <?php endif; ?>
    </div>

    <div class="jahid-blog-grid">
        <?php if (have_posts()): while (have_posts()): the_post();
            $cat   = get_the_category(get_the_ID());
            $thumb = get_the_post_thumbnail_url(get_the_ID(), 'blog-card');
        ?>
        <article class="jahid-blog-card reveal-up" data-reveal>
            <a href="<?= get_permalink() ?>" class="jahid-blog-card-link">
                <div class="jahid-blog-img-wrap">
                    <?php if ($thumb): ?>
                    <img src="<?= esc_url($thumb) ?>" alt="<?= esc_attr(get_the_title()) ?>" class="jahid-blog-img" loading="lazy">
                    <?php else: ?>
                    <div class="jahid-blog-img-placeholder"></div>
                    <?php endif; ?>
                </div>
                <div class="jahid-blog-info">
                    <?php if ($cat): ?>
                    <span class="jahid-blog-cat"><?= esc_html($cat[0]->name) ?></span>
                    <?php endif; ?>
                    <h2 class="jahid-blog-title"><?= esc_html(get_the_title()) ?></h2>
                    <p class="jahid-blog-desc"><?= esc_html(get_the_excerpt()) ?></p>
                    <div class="jahid-blog-meta">
                        <span><?= get_the_date('M j, Y') ?></span>
                        <span>&middot;</span>
                        <span><?= jahid_read_time(get_the_content()) ?></span>
                    </div>
                </div>
            </a>
        </article>
        <?php endwhile; else: ?>
        <div class="jahid-empty-state">No posts yet.</div>
        <?php endif; ?>
    </div>

    <div class="jahid-pagination" data-reveal>
        <?php the_posts_pagination(['prev_text' => '← Older', 'next_text' => 'Newer →']); ?>
    </div>

</div>
</section>
</main>

<?php get_footer(); ?>
