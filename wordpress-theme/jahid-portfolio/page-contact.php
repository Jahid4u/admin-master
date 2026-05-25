<?php
/**
 * Template Name: Contact Page
 */
jahid_output_head_meta('contact');
$c = get_option('jahid_site_contact', []);
get_header();
?>

<main class="jahid-main">
<section class="jahid-contact-page">
    <div class="jahid-contact-page-inner">

        <div class="jahid-contact-page-header" data-reveal>
            <?php if (!empty($c['eyebrow_text'])): ?>
            <div class="jahid-contact-eyebrow"><?= esc_html($c['eyebrow_text']) ?></div>
            <?php endif; ?>
            <h1 class="jahid-contact-headline"><?= esc_html($c['headline_text'] ?? 'Get In Touch') ?></h1>
        </div>

        <div class="jahid-contact-body">
            <div class="jahid-contact-left" data-reveal>
                <h2 class="jahid-contact-sub">
                    <?= esc_html($c['side_headline_pre'] ?? "Let's start a") ?>
                    <em class="jahid-accent"><?= esc_html($c['side_headline_italic'] ?? 'conversation') ?></em>.
                </h2>

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
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
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

                <?php
                $socials = json_decode($c['socials'] ?? '[]', true) ?: jahid_get_socials();
                if (!empty($socials)): ?>
                <div class="jahid-contact-socials">
                    <?php foreach ($socials as $s): ?>
                    <a href="<?= esc_url($s['url'] ?? '#') ?>" class="jahid-about-social-btn" target="_blank" rel="noopener" aria-label="<?= esc_attr($s['label'] ?? '') ?>">
                        <?= jahid_social_icon($s['label'] ?? '') ?>
                    </a>
                    <?php endforeach; ?>
                </div>
                <?php endif; ?>
            </div>

            <?php if (($c['form_enabled'] ?? '1') !== '0'): ?>
            <div class="jahid-contact-right" data-reveal>
                <div class="jahid-contact-form-card">
                    <form class="jahid-contact-form" id="contact-form">
                        <div class="jahid-form-row">
                            <div class="jahid-form-field">
                                <label for="cf-name">Name <span class="jahid-required">*</span></label>
                                <input type="text" id="cf-name" name="name" placeholder="Your full name" required>
                            </div>
                            <div class="jahid-form-field">
                                <label for="cf-email">Email <span class="jahid-required">*</span></label>
                                <input type="email" id="cf-email" name="email" placeholder="your@email.com" required>
                            </div>
                        </div>
                        <div class="jahid-form-field">
                            <label for="cf-subject">Subject</label>
                            <input type="text" id="cf-subject" name="subject" placeholder="What's this about?">
                        </div>
                        <div class="jahid-form-field">
                            <label for="cf-message">Message <span class="jahid-required">*</span></label>
                            <textarea id="cf-message" name="message" rows="6" placeholder="Tell me about your project or inquiry..." required></textarea>
                        </div>
                        <button type="submit" class="jahid-btn jahid-btn-primary jahid-form-submit">
                            <span class="jahid-submit-text">Send Message</span>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                        </button>
                        <div class="jahid-form-msg" id="contact-form-msg"></div>
                    </form>
                </div>
            </div>
            <?php endif; ?>
        </div>

    </div>
</section>
</main>

<?php get_footer(); ?>
