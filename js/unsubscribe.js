// js/unsubscribe.js
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('unsubscribeForm');
  const statusDiv = document.getElementById('unsubscribeStatus');
  const successDiv = document.getElementById('unsubscribeSuccess');
  const emailDisplay = document.getElementById('unsubscribeEmail');
  const submitBtn = document.getElementById('unsubscribeBtn');

  if (!form) {
    console.warn('Unsubscribe form not found');
    return;
  }

  // ── Helper: Show status message ──
  function showStatus(message, type) {
    statusDiv.innerHTML = message;
    statusDiv.className = 'form-status ' + type;
    statusDiv.style.display = 'block';
  }

  // ── Helper: Clear status ──
  function clearStatus() {
    statusDiv.innerHTML = '';
    statusDiv.className = '';
    statusDiv.style.display = 'none';
  }

  // ── Helper: Validate email ──
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ── Check if email is in URL (from email link) ──
  const urlParams = new URLSearchParams(window.location.search);
  const emailFromUrl = urlParams.get('email');

  if (emailFromUrl && isValidEmail(emailFromUrl)) {
    document.getElementById('unsubscribeEmail').value = emailFromUrl;
    document.getElementById('unsubscribeEmail').disabled = true;
  }

  // ── Form submission ──
  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    clearStatus();

    // ── 1. Get email ──
    const email = document.getElementById('unsubscribeEmail').value.trim();

    // ── 2. Validate ──
    if (!email) {
      showStatus('Please enter your email address.', 'error');
      return;
    }

    if (!isValidEmail(email)) {
      showStatus('Please enter a valid email address.', 'error');
      return;
    }

    // ── 3. Disable button ──
    submitBtn.disabled = true;
    submitBtn.textContent = 'Unsubscribing...';

    try {
      // ── 4. Check Supabase client ──
      const supabase = window.supabaseClient;
      if (!supabase) {
        throw new Error('Supabase client not available');
      }

      // ── 5. Check if email exists ──
      const { data: existing, error: checkError } = await supabase
        .from('mailing_list')
        .select('subscribed')
        .eq('email', email)
        .single();

      if (checkError) {
        showStatus('Email not found in our mailing list.', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Unsubscribe';
        return;
      }

      if (existing && existing.subscribed === false) {
        showStatus('This email is already unsubscribed.', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Unsubscribe';
        return;
      }

      // ── 6. Update subscription status ──
      const { error: updateError } = await supabase
        .from('mailing_list')
        .update({
          subscribed: false,
          unsubscribed_at: new Date().toISOString()
        })
        .eq('email', email);

      if (updateError) {
        throw new Error(updateError.message);
      }

      // ── 7. Success ──
      form.style.display = 'none';
      successDiv.style.display = 'block';
      emailDisplay.textContent = email;
      window.scrollTo({ top: 0, behavior: 'smooth' });

      console.log('✅ Unsubscribed:', email);

    } catch (error) {
      console.error('Unsubscribe error:', error);
      showStatus('Something went wrong. Please try again or contact us.', 'error');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Unsubscribe';
    }
  });
});