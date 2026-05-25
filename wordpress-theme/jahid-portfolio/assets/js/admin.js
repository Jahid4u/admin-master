/* ============================================================
   JAHID PORTFOLIO — Admin JavaScript
   Repeaters, media upload, inbox actions, form helpers
   ============================================================ */
jQuery(function ($) {
  'use strict';

  // ── Repeater System ─────────────────────────────────────────
  function getRepeaterData($container) {
    const items = [];
    $container.find('.jahid-repeater-item').each(function () {
      const item = {};
      $(this).find('[data-field]').each(function () {
        const field = $(this).data('field');
        const el    = $(this);
        if (el.is(':checkbox')) {
          item[field] = el.is(':checked');
        } else {
          item[field] = el.val();
        }
      });
      items.push(item);
    });
    return items;
  }

  function syncRepeater($container) {
    const $hidden = $container.find('.jahid-repeater-data');
    $hidden.val(JSON.stringify(getRepeaterData($container)));
  }

  function buildItemHtml(template) {
    const obj = JSON.parse(template);
    let rowHtml = '';
    for (const [key, val] of Object.entries(obj)) {
      if (typeof val === 'boolean') {
        rowHtml += `<label><input type="checkbox" ${val ? 'checked' : ''} data-field="${key}"> ${key.charAt(0).toUpperCase() + key.slice(1)}</label>`;
      } else {
        const ph = key.charAt(0).toUpperCase() + key.slice(1);
        rowHtml += `<input type="text" placeholder="${ph}" value="" data-field="${key}" class="regular-text">`;
      }
    }
    rowHtml += '<button type="button" class="button jahid-remove-item">Remove</button>';
    return `<div class="jahid-repeater-item"><div class="jahid-repeater-row">${rowHtml}</div></div>`;
  }

  // Add item
  $(document).on('click', '.jahid-add-item', function () {
    const $container = $(this).closest('.jahid-repeater');
    const template   = $(this).data('template');
    const $items     = $container.find('.jahid-repeater-items');
    $items.append(buildItemHtml(JSON.stringify(typeof template === 'string' ? JSON.parse(template) : template)));
    syncRepeater($container);
  });

  // Remove item
  $(document).on('click', '.jahid-remove-item', function () {
    const $container = $(this).closest('.jahid-repeater');
    $(this).closest('.jahid-repeater-item').remove();
    syncRepeater($container);
  });

  // Sync on any change
  $(document).on('input change', '.jahid-repeater [data-field]', function () {
    syncRepeater($(this).closest('.jahid-repeater'));
  });

  // ── Media Upload ─────────────────────────────────────────────
  $(document).on('click', '.jahid-upload-btn', function (e) {
    e.preventDefault();
    const target = $(this).data('target');
    const $btn   = $(this);

    const frame = wp.media({ title: 'Select Image', multiple: false });
    frame.on('select', function () {
      const attachment = frame.state().get('selection').first().toJSON();
      const url        = attachment.url;

      // Find the associated URL input
      const $field = $btn.closest('.jahid-image-field, .jahid-meta-field');
      const $input = target
        ? $(`input[name*="${target}"], input[name$="[${target}]"]`).first()
        : $field.find('.jahid-image-url, input[type="url"]').first();

      $input.val(url).trigger('change');

      // Show/update preview
      let $preview = $field.find('.jahid-image-preview');
      if (!$preview.length) {
        $preview = $('<img class="jahid-image-preview" style="max-width:200px;border-radius:8px;margin-bottom:8px;display:block;">');
        $btn.before($preview);
      }
      $preview.attr('src', url);
    });

    frame.open();
  });

  // ── Inbox Actions ─────────────────────────────────────────────
  $(document).on('click', '.jahid-mark-read', function () {
    const $btn = $(this);
    const id   = $btn.data('id');
    const nonce = $btn.data('nonce');

    $.post(ajaxurl, { action: 'jahid_mark_read', id, nonce }, function (res) {
      if (res.success) {
        const $row = $btn.closest('tr');
        $row.removeClass('jahid-unread');
        $row.find('.jahid-badge-blue').replaceWith('<span class="jahid-badge jahid-badge-muted">Read</span>');
        $btn.remove();
      }
    });
  });

  $(document).on('click', '.jahid-delete-msg', function () {
    if (!confirm('Delete this message?')) return;
    const $btn  = $(this);
    const id    = $btn.data('id');
    const nonce = $btn.data('nonce');

    $.post(ajaxurl, { action: 'jahid_delete_message', id, nonce }, function (res) {
      if (res.success) $btn.closest('tr').fadeOut(300, function () { $(this).remove(); });
    });
  });

  $(document).on('click', '.jahid-delete-sub', function () {
    if (!confirm('Delete this subscriber?')) return;
    const $btn  = $(this);
    const id    = $btn.data('id');
    const nonce = $btn.data('nonce');

    $.post(ajaxurl, { action: 'jahid_delete_subscriber', id, nonce }, function (res) {
      if (res.success) $btn.closest('tr').fadeOut(300, function () { $(this).remove(); });
    });
  });

  // ── Toggle full message ───────────────────────────────────────
  $(document).on('click', '.jahid-toggle-msg', function () {
    const $row  = $(this).closest('td');
    const $full = $row.find('.jahid-msg-full');
    const $prev = $row.find('.jahid-msg-preview');
    if ($full.is(':visible')) {
      $full.hide(); $prev.show(); $(this).text('Read more');
    } else {
      $full.show(); $prev.hide(); $(this).text('Read less');
    }
  });
});
