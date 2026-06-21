// js/contact.js - Contact form handling

console.log("=== contact.js loaded ===");

document.addEventListener('DOMContentLoaded', function() {
  console.log("Contact form DOM ready");

  // ============================================================
  // 1. Supabase configuration
  // ============================================================
  const supabase = window.supabaseClient;
  
  if (!supabase) {
    console.error("Supabase client not initialized!");
    return;
  }
  
  console.log("Supabase client ready for contact form");

  // ============================================================
  // 2. DOM Elements
  // ============================================================
  const contactForm = document.getElementById('contactForm');
  const contactFormContainer = document.querySelector('.contact-form-container');
  const contactStatusDiv = document.getElementById('contactFormStatus');
  const contactSuccessDiv = document.getElementById('contactSuccessMessage');
  const contactSubmitBtn = document.getElementById('contactSubmitBtn');

  console.log("Contact form elements found:", {
    contactForm: !!contactForm,
    contactFormContainer: !!contactFormContainer,
    contactStatusDiv: !!contactStatusDiv,
    contactSuccessDiv: !!contactSuccessDiv,
    contactSubmitBtn: !!contactSubmitBtn
  });

  // ============================================================
  // 3. UI Helper functions
  // ============================================================
  function hideContactForm() {
    if (contactFormContainer) contactFormContainer.style.display = 'none';
  }

  function showContactSuccessMessage() {
    if (contactSuccessDiv) contactSuccessDiv.style.display = 'block';
    if (contactStatusDiv) contactStatusDiv.className = 'form-status success';
  }

  function showContactError(message) {
    if (contactStatusDiv) {
      contactStatusDiv.innerHTML = `<span>${message}</span>`;
      contactStatusDiv.className = 'form-status error';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showContactLoading(message) {
    if (contactStatusDiv) {
      contactStatusDiv.innerHTML = `<span>${message}</span>`;
      contactStatusDiv.className = '';
    }
  }

  // ============================================================
  // 4. Form submission handler
  // ============================================================
  async function handleContactSubmit(e) {
    e.preventDefault();
    console.log("Contact form submitted - validating...");
    
    // Clear previous status
    if (contactStatusDiv) {
      contactStatusDiv.innerHTML = '';
      contactStatusDiv.className = '';
    }
    
    // Collect form data
    const fullName = document.getElementById('contactName')?.value.trim() || '';
    const email = document.getElementById('contactEmail')?.value.trim() || '';
    const subject = document.getElementById('contactSubject')?.value || '';
    const message = document.getElementById('contactMessage')?.value.trim() || '';
    
    // Validation
    const missingFields = [];
    if (!fullName) missingFields.push("Full Name");
    if (!email) missingFields.push("Email Address");
    if (!subject) missingFields.push("Subject");
    if (!message) missingFields.push("Message");
    
    if (missingFields.length > 0) {
      showContactError(`Please fill all required fields. Missing: ${missingFields.join(', ')}`);
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showContactError("Please enter a valid email address.");
      return;
    }
    
    // Build form data
    const formData = {
      full_name: fullName,
      email: email,
      subject: subject,
      message: message
    };
    
    // Disable submit button and show loading
    if (contactSubmitBtn) {
      contactSubmitBtn.disabled = true;
      contactSubmitBtn.textContent = 'Sending...';
    }
    
    showContactLoading('Sending your message...');
    
    // Submit to Supabase
    const { error } = await supabase
      .from('test_contact_messages')
      .insert([formData]);
    
    if (error) {
      console.error("Supabase error:", error);
      showContactError(`Error: ${error.message}. Please try again or email us directly.`);
      if (contactSubmitBtn) {
        contactSubmitBtn.disabled = false;
        contactSubmitBtn.textContent = 'Send Message';
      }
    } else {
      console.log("Contact message submitted successfully!");
      hideContactForm();
      showContactSuccessMessage();
      // window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  
  // ============================================================
  // 5. Event listeners
  // ============================================================
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactSubmit);
    console.log("Contact form listener added");
  } else {
    console.error("Contact form not found!");
  }
});