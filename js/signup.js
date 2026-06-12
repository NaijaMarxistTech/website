// js/signup.js - Complete rewrite

console.log("=== signup.js loaded ===");

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOMContentLoaded fired");

  // ============================================================
  // 1. Supabase initialization
  // ============================================================
  const SUPABASE_URL = 'https://pcpntpuujhrvbffgpixs.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjcG50cHV1amhydmJmZmdwaXhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NjMwNDgsImV4cCI6MjA5NjQzOTA0OH0.gsMFI_dmN44NA5iHyyg1QgMXxJjBi1Ho8Inv3Tuqmsw';
  
  // Check if supabase is available
  if (typeof window.supabase === 'undefined') {
    console.error("Supabase library not loaded!");
    return;
  }
  
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  console.log("Supabase client created");

  // ============================================================
  // 2. Nigerian states
  // ============================================================
  const nigerianStates = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
    "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa",
    "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger",
    "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara", "FCT Abuja"
  ];

  // ============================================================
  // 3. Get all DOM elements
  // ============================================================
  const residentSelect = document.getElementById('residentNigeria');
  const locationField = document.getElementById('locationField');
  const primarySkillSelect = document.getElementById('primarySkill');
  const otherSkillField = document.getElementById('otherSkillField');
  const otherSkillText = document.getElementById('otherSkillText');
  const addSocialBtn = document.getElementById('addSocialBtn');
  const socialHandlesContainer = document.getElementById('socialHandlesContainer');
  const membershipForm = document.getElementById('membershipForm');
  const submitBtn = document.getElementById('submitBtn');
  const formStatus = document.getElementById('formStatus');

  // Debug: log which elements we found
  console.log("Elements found:", {
    residentSelect: !!residentSelect,
    locationField: !!locationField,
    primarySkillSelect: !!primarySkillSelect,
    otherSkillField: !!otherSkillField,
    addSocialBtn: !!addSocialBtn,
    membershipForm: !!membershipForm
  });

  // ============================================================
  // 4. Handle "Resident in Nigeria" dropdown
  // ============================================================
  function updateLocationField() {
    console.log("updateLocationField called, value:", residentSelect.value);
    
    if (!locationField) return;
    
    if (residentSelect.value === 'yes') {
      // Show Nigerian states dropdown
      let options = '<option value="">Select state...</option>';
      nigerianStates.forEach(state => {
        options += `<option value="${state}">${state}</option>`;
      });
      locationField.innerHTML = `
        <label>State of Residence <span class="required">*</span></label>
        <select id="location" required>
          ${options}
        </select>
      `;
      console.log("States dropdown added");
    } 
    else if (residentSelect.value === 'no') {
      // Show text input for country
      locationField.innerHTML = `
        <label>Country of Residence <span class="required">*</span></label>
        <input type="text" id="location" placeholder="e.g., Ghana, UK, USA" required>
      `;
      console.log("Country text field added");
    } 
    else {
      locationField.innerHTML = '';
    }
  }

  // Add event listener to resident dropdown
  if (residentSelect) {
    residentSelect.addEventListener('change', updateLocationField);
    console.log("Added change listener to residentSelect");
  }

  // ============================================================
  // 5. Handle "Other" skill dropdown
  // ============================================================
  function handleOtherSkillDropdown() {
    console.log("handleOtherSkillDropdown called, value:", primarySkillSelect.value);
    
    if (!primarySkillSelect || !otherSkillField) return;
    
    if (primarySkillSelect.value === 'Other') {
      otherSkillField.style.display = 'block';
      if (otherSkillText) otherSkillText.required = true;
      console.log("Other field shown");
    } else {
      otherSkillField.style.display = 'none';
      if (otherSkillText) {
        otherSkillText.required = false;
        otherSkillText.value = '';
      }
      console.log("Other field hidden");
    }
  }

  // Add event listener to skill dropdown
  if (primarySkillSelect) {
    primarySkillSelect.addEventListener('change', handleOtherSkillDropdown);
    console.log("Added change listener to primarySkillSelect");
  }

  // ============================================================
  // 6. Handle "Add another platform" button
  // ============================================================
  function addSocialRow() {
    console.log("addSocialRow called");
    
    if (!socialHandlesContainer) return;
    
    const newEntry = document.createElement('div');
    newEntry.className = 'social-entry';
    newEntry.innerHTML = `
      <select class="social-platform">
        <option value="twitter">Twitter/X</option>
        <option value="instagram">Instagram</option>
        <option value="facebook">Facebook</option>
        <option value="whatsapp">WhatsApp</option>
        <option value="telegram">Telegram</option>
        <option value="linkedin">LinkedIn</option>
        <option value="other">Other</option>
      </select>
      <input type="text" class="social-handle" placeholder="@username or link">
      <button type="button" class="btn-add" style="background:#C62828;" onclick="this.parentElement.remove()">Remove</button>
    `;
    socialHandlesContainer.appendChild(newEntry);
    console.log("New social row added");
  }

  if (addSocialBtn) {
    addSocialBtn.addEventListener('click', addSocialRow);
    console.log("Added click listener to addSocialBtn");
  }

  // ============================================================
  // 7. Collect social handles
  // ============================================================
  function collectSocialHandles() {
    const handles = {};
    document.querySelectorAll('.social-entry').forEach(entry => {
      const platform = entry.querySelector('.social-platform').value;
      const handle = entry.querySelector('.social-handle').value.trim();
      if (handle) {
        handles[platform] = handle;
      }
    });
    return handles;
  }

  // ============================================================
  // 8. Form submission
  // ============================================================
  async function handleFormSubmit(e) {
    e.preventDefault();
    console.log("Form submitted");
    
    // Get location value (works for both select and input)
    const locationElement = document.getElementById('location');
    const locationValue = locationElement ? locationElement.value.trim() : '';
    
    // Collect primary skill
    let primarySkill = primarySkillSelect ? primarySkillSelect.value : '';
    const otherSkillTextValue = otherSkillText ? otherSkillText.value.trim() : '';
    
    if (primarySkill === 'Other' && otherSkillTextValue) {
      primarySkill = otherSkillTextValue;
    }
    
    const formData = {
      first_name: document.getElementById('firstName')?.value.trim() || '',
      last_name: document.getElementById('lastName')?.value.trim() || '',
      gender: document.getElementById('gender')?.value || '',
      email: document.getElementById('email')?.value.trim() || '',
      telegram_username: document.getElementById('telegram')?.value.trim() || '',
      resident_in_nigeria: residentSelect?.value === 'yes',
      location: locationValue,
      profession: document.getElementById('profession')?.value.trim() || '',
      primary_skill: primarySkill,
      social_handles: collectSocialHandles(),
      q1: document.getElementById('q1')?.value.trim() || '',
      q2: document.getElementById('q2')?.value.trim() || '',
      q3: document.getElementById('q3')?.value.trim() || '',
      q4: document.getElementById('q4')?.value.trim() || '',
      q5: document.getElementById('q5')?.value.trim() || '',
      q6: document.getElementById('q6')?.value.trim() || '',
      q7: document.getElementById('q7')?.value.trim() || '',
      q8: document.getElementById('q8')?.value.trim() || '',
      q9: document.getElementById('q9')?.value.trim() || '',
      q10: document.getElementById('q10')?.value.trim() || ''
    };

    // Basic validation
    let isValid = true;
    for (let [key, value] of Object.entries(formData)) {
      if (key !== 'telegram_username' && key !== 'social_handles' && !value) {
        isValid = false;
        break;
      }
    }
    
    if (!isValid) {
      if (formStatus) {
        formStatus.innerHTML = '<span>Please fill all required fields.</span>';
        formStatus.className = 'form-status error';
      }
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';
    }
    if (formStatus) formStatus.innerHTML = '';

    const { error } = await supabase
      .from('members')
      .insert([formData]);

    if (error) {
      console.error("Supabase error:", error);
      if (formStatus) {
        formStatus.innerHTML = `<span>Error: ${error.message}. Please try again.</span>`;
        formStatus.className = 'form-status error';
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Application';
      }
    } else {
      if (formStatus) {
        formStatus.innerHTML = '<span>✓ Application submitted! A comrade will contact you within 48 hours.</span>';
        formStatus.className = 'form-status success';
      }
      if (membershipForm) membershipForm.reset();
      if (otherSkillField) otherSkillField.style.display = 'none';
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Application';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  if (membershipForm) {
    membershipForm.addEventListener('submit', handleFormSubmit);
    console.log("Added submit listener to membershipForm");
  }

  console.log("=== signup.js initialization complete ===");
});