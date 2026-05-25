<?php
$footer = jahid_get_footer_opts();
$socials = jahid_get_socials();
?>

<footer class="jahid-footer">
    <div class="jahid-footer-inner">

        <div class="jahid-footer-top">
            <div class="jahid-footer-brand">
                <h2 class="jahid-footer-name"><?= esc_html($footer['brand_name']) ?></h2>
                <p class="jahid-footer-tagline"><?= esc_html($footer['tagline']) ?></p>
                <?php if (!empty($socials)): ?>
                <div class="jahid-footer-socials">
                    <?php foreach ($socials as $s): ?>
                    <a href="<?= esc_url($s['url']) ?>" class="jahid-footer-social" target="_blank" rel="noopener noreferrer" aria-label="<?= esc_attr($s['label']) ?>">
                        <?= jahid_social_icon($s['label']) ?>
                    </a>
                    <?php endforeach; ?>
                </div>
                <?php endif; ?>
            </div>

            <div class="jahid-footer-links-group">
                <h4 class="jahid-footer-group-title">Navigation</h4>
                <ul class="jahid-footer-links">
                    <li><a href="<?= home_url('/') ?>">Home</a></li>
                    <li><a href="<?= home_url('/work') ?>">Work</a></li>
                    <li><a href="<?= home_url('/blog') ?>">Blog</a></li>
                    <li><a href="<?= home_url('/about') ?>">About</a></li>
                    <li><a href="<?= home_url('/contact') ?>">Contact</a></li>
                </ul>
            </div>

            <div class="jahid-footer-links-group">
                <h4 class="jahid-footer-group-title">Legal</h4>
                <ul class="jahid-footer-links">
                    <li><a href="<?= home_url('/privacy-policy') ?>">Privacy Policy</a></li>
                    <li><a href="<?= home_url('/terms-of-service') ?>">Terms of Service</a></li>
                </ul>
            </div>

            <?php if (!empty($footer['newsletter_enabled'])): ?>
            <div class="jahid-footer-newsletter">
                <h4 class="jahid-footer-group-title"><?= esc_html($footer['newsletter_headline']) ?></h4>
                <p class="jahid-footer-newsletter-desc"><?= esc_html($footer['newsletter_desc']) ?></p>
                <form class="jahid-newsletter-form" id="footer-newsletter-form">
                    <div class="jahid-newsletter-row">
                        <input type="email" placeholder="your@email.com" required class="jahid-newsletter-input" id="footer-newsletter-email">
                        <button type="submit" class="jahid-newsletter-btn">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                        </button>
                    </div>
                    <div class="jahid-newsletter-msg" id="footer-newsletter-msg"></div>
                </form>
            </div>
            <?php endif; ?>
        </div>

        <div class="jahid-footer-bottom">
            <p class="jahid-footer-copy"><?= esc_html($footer['copyright']) ?></p>
            <p class="jahid-footer-made">Designed & built with care</p>
        </div>
    </div>
</footer>

</div><!-- #page-wrapper -->

<?php wp_footer(); ?>
</body>
</html>
