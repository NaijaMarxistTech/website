// js/subscribe.js
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('subscribeForm');
  const statusDiv = document.getElementById('formStatus');
  const successDiv = document.getElementById('successMessage');
  const successEmail = document.getElementById('successEmail');
  const submitBtn = document.getElementById('subscribeBtn');
  const consentCheckbox = document.getElementById('consent');

  if (!form) {
    console.warn('Subscribe form not found');
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

  // ── Helper: Check honeypot ──
  function isHoneypotFilled() {
    const honeypot = document.getElementById('website');
    return honeypot && honeypot.value.length > 0;
  }

  // ── Form submission ──
  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    clearStatus();

    // ── 1. Honeypot check (spam protection) ──
    if (isHoneypotFilled()) {
      console.log('Honeypot triggered – potential bot');
      showStatus('Thank you for your interest.', 'success');
      form.style.display = 'none';
      return;
    }

    // ── 2. Consent check ──
    if (!consentCheckbox || !consentCheckbox.checked) {
      showStatus('Please agree to receive emails before subscribing.', 'error');
      consentCheckbox.focus();
      return;
    }

    // ── 3. Get values ──
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();

    // ── 4. Validate required fields ──
    if (!firstName || !lastName || !email) {
      showStatus('Please fill in all required fields.', 'error');
      document.getElementById('firstName').focus();
      return;
    }

    // ── 5. Validate email format ──
    if (!isValidEmail(email)) {
      showStatus('Please enter a valid email address.', 'error');
      document.getElementById('email').focus();
      return;
    }

    // ── 6. Disable button to prevent double submission ──
    submitBtn.disabled = true;
    submitBtn.textContent = 'Subscribing...';

    try {
      // ── 7. Check Supabase client ──
      const supabase = window.supabaseClient;
      if (!supabase) {
        throw new Error('Supabase client not available');
      }

      // ── 8. Insert into mailing_list ──
      const { data, error } = await supabase
        .from('mailing_list')
        .insert([{
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone: phone || null,
          source: 'website',
          subscribed: true,
          subscribed_at: new Date().toISOString()
        }])
        .select();

      // ── 9. Handle errors ──
      if (error) {
        console.error('Supabase error:', error);

        // Handle duplicate email
        if (error.code === '23505') {
          // Check if the email exists but is unsubscribed
          const { data: existing, error: checkError } = await supabase
            .from('mailing_list')
            .select('subscribed')
            .eq('email', email)
            .single();

          if (checkError) {
            showStatus('This email is already subscribed.', 'error');
          } else if (existing && existing.subscribed === false) {
            // Re-subscribe
            const { error: updateError } = await supabase
              .from('mailing_list')
              .update({
                subscribed: true,
                subscribed_at: new Date().toISOString(),
                unsubscribed_at: null
              })
              .eq('email', email);

            if (updateError) {
              showStatus('Something went wrong. Please try again.', 'error');
            } else {
              // Success – re-subscribed
              form.style.display = 'none';
              successDiv.style.display = 'block';
              successEmail.textContent = email;
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          } else {
            showStatus('This email is already subscribed.', 'error');
          }
          submitBtn.disabled = false;
          submitBtn.textContent = 'Subscribe';
          return;
        }

        showStatus('Something went wrong. Please try again.', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Subscribe';
        return;
      }

      // ── 10. Success ──
      form.style.display = 'none';
      successDiv.style.display = 'block';
      successEmail.textContent = email;
      window.scrollTo({ top: 0, behavior: 'smooth' });

      console.log('✅ New subscriber:', firstName, lastName, email);

    } catch (error) {
      console.error('Subscription error:', error);
      showStatus('Network error. Please check your connection and try again.', 'error');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Subscribe';
    }
  });
});