// js/signup.js - Complete modular version with all functionality

console.log("=== signup.js loaded ===");

document.addEventListener('DOMContentLoaded', function() {
  console.log("DOMContentLoaded fired");

  // ============================================================
  // 1. Supabase configuration
  // ============================================================
  const SUPABASE_URL = 'https://pcpntpuujhrvbffgpixs.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjcG50cHV1amhydmJmZmdwaXhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NjMwNDgsImV4cCI6MjA5NjQzOTA0OH0.gsMFI_dmN44NA5iHyyg1QgMXxJjBi1Ho8Inv3Tuqmsw';
  
  if (typeof window.supabase === 'undefined') {
    console.error("Supabase library not loaded!");
    return;
  }
  
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  console.log("Supabase client created");

  // ============================================================
  // 2. Data
  // ============================================================
  const nigerianStates = [
    "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
    "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa",
    "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger",
    "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara", "FCT Abuja"
  ];

  const skillsList = [
    "Web designing", "Graphic designing", "Writing/Content creation",
    "Data analysis", "Video editing", "Social media management",
    "Fundraising", "Event organizing", "Legal aid/Paralegal",
    "Translation", "Research", "Community organizing", "Other"
  ];

  // ============================================================
  // 3. DOM Elements
  // ============================================================
  const form = document.getElementById('membershipForm');
  const formContainer = document.querySelector('.signup-form-container');
  const residentSelect = document.getElementById('residentNigeria');
  const locationField = document.getElementById('locationField');
  const skillsCheckboxGrid = document.getElementById('skillsCheckboxGrid');
  const otherSkillField = document.getElementById('otherSkillField');
  const otherSkillText = document.getElementById('otherSkillText');
  const addSocialBtn = document.getElementById('addSocialBtn');
  const socialHandlesContainer = document.getElementById('socialHandlesContainer');
  const statusDiv = document.getElementById('formStatus');
  const successMessageDiv = document.getElementById('successMessage');

  // ============================================================
  // 4. Populate skills checkboxes
  // ============================================================
  function populateSkillsCheckboxes() {
    if (!skillsCheckboxGrid) return;
    
    skillsCheckboxGrid.innerHTML = '';
    skillsList.forEach(skill => {
      const skillId = `skill_${skill.replace(/\s/g, '_').replace(/\(/g, '').replace(/\)/g, '').replace(/\//g, '_')}`;
      const div = document.createElement('div');
      div.className = 'skill-checkbox-item';
      div.innerHTML = `
        <input type="checkbox" id="${skillId}" value="${skill}">
        <label for="${skillId}">${skill}</label>
      `;
      skillsCheckboxGrid.appendChild(div);
    });
    console.log("Skills checkboxes populated");
  }

  // ============================================================
  // 5. Handle "Other" skill checkbox
  // ============================================================
  function handleOtherSkillCheckbox() {
    const otherCheckbox = document.querySelector('#skill_Other');
    const isOtherSelected = otherCheckbox ? otherCheckbox.checked : false;
    
    if (isOtherSelected) {
      if (otherSkillField) otherSkillField.style.display = 'block';
      if (otherSkillText) otherSkillText.required = true;
    } else {
      if (otherSkillField) otherSkillField.style.display = 'none';
      if (otherSkillText) {
        otherSkillText.required = false;
        otherSkillText.value = '';
      }
    }
  }

  // ============================================================
  // 6. Handle location field (Nigerian states vs country)
  // ============================================================
  function updateLocationField() {
    if (!locationField || !residentSelect) return;
    
    if (residentSelect.value === 'yes') {
      let options = '<option value="">Select state...</option>';
      nigerianStates.forEach(state => {
        options += `<option value="${state}">${state}</option>`;
      });
      locationField.innerHTML = `
        <label>State of Residence <span class="required">*</span></label>
        <select id="location" required>${options}</select>
      `;
    } else if (residentSelect.value === 'no') {
      locationField.innerHTML = `
        <label>Country of Residence <span class="required">*</span></label>
        <input type="text" id="location" placeholder="e.g., Ghana, UK, USA" required>
      `;
    } else {
      locationField.innerHTML = '';
    }
  }

  // ============================================================
  // 7. Handle social media rows
  // ============================================================
  function addSocialRow() {
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
  }

  function collectSocialHandles() {
    const handles = {};
    document.querySelectorAll('.social-entry').forEach(entry => {
      const platform = entry.querySelector('.social-platform').value;
      const handle = entry.querySelector('.social-handle').value.trim();
      if (handle) handles[platform] = handle;
    });
    return handles;
  }

  // ============================================================
  // 8. UI Helper functions
  // ============================================================
  function hideForm() {
    if (formContainer) formContainer.style.display = 'none';
  }

  function showSuccessMessage() {
    if (successMessageDiv) successMessageDiv.style.display = 'block';
    if (statusDiv) statusDiv.className = 'form-status success';
  }

  function showError(message) {
    if (statusDiv) {
      statusDiv.innerHTML = `<span>${message}</span>`;
      statusDiv.className = 'form-status error';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showLoading(message) {
    if (statusDiv) {
      statusDiv.innerHTML = `<span>${message}</span>`;
      statusDiv.className = '';
    }
  }

  // ============================================================
  // 9. Form submission handler
  // ============================================================
  async function handleFormSubmit(e) {
    e.preventDefault();
    console.log("Form submitted - validating...");
    
    // Clear previous status
    if (statusDiv) {
      statusDiv.innerHTML = '';
      statusDiv.className = '';
    }
    
    // Get location value
    const locationElement = document.getElementById('location');
    const locationValue = locationElement ? locationElement.value.trim() : '';
    
    // Collect selected skills
    const selectedCheckboxes = document.querySelectorAll('.skill-checkbox-item input[type="checkbox"]:checked');
    let selectedSkills = Array.from(selectedCheckboxes).map(cb => cb.value);
    
    const otherSkillTextValue = otherSkillText ? otherSkillText.value.trim() : '';
    
    // Handle "Other" skill
    const otherCheckbox = document.querySelector('#skill_Other');
    if (otherCheckbox && otherCheckbox.checked && !otherSkillTextValue) {
      showError('Please specify your "Other" skill.');
      return;
    }
    
    if (selectedSkills.includes('Other') && otherSkillTextValue) {
      const otherIndex = selectedSkills.indexOf('Other');
      selectedSkills[otherIndex] = otherSkillTextValue;
    }
    
    // Get question answers directly
    const q1 = document.getElementById('q1')?.value.trim() || '';
    const q2 = document.getElementById('q2')?.value.trim() || '';
    const q3 = document.getElementById('q3')?.value.trim() || '';
    const q4 = document.getElementById('q4')?.value.trim() || '';
    const q5 = document.getElementById('q5')?.value.trim() || '';
    const q6 = document.getElementById('q6')?.value.trim() || '';
    const q7 = document.getElementById('q7')?.value.trim() || '';
    const q8 = document.getElementById('q8')?.value.trim() || '';
    const q9 = document.getElementById('q9')?.value.trim() || '';
    const q10 = document.getElementById('q10')?.value.trim() || '';
    
    // Build form data
    const formData = {
      first_name: document.getElementById('firstName')?.value.trim() || '',
      last_name: document.getElementById('lastName')?.value.trim() || '',
      gender: document.getElementById('gender')?.value || '',
      email: document.getElementById('email')?.value.trim() || '',
      telegram_username: document.getElementById('telegram')?.value.trim() || '',
      resident_in_nigeria: residentSelect?.value === 'yes',
      location: locationValue,
      profession: document.getElementById('profession')?.value.trim() || '',
      primary_skill: selectedSkills,
      social_handles: collectSocialHandles(),
      q1_marxist_familiarity: q1,
      q2_class_definition: q2,
      q3_class_conflict_revolution: q3,
      q4_primary_class_struggle: q4,
      q5_capitalism_vs_socialism: q5,
      q6_pan_africanism_vs_marxism: q6,
      q7_nigerian_democracy: q7,
      q8_revolution_definition: q8,
      q9_socialist_revolutions_today: q9,
      q10_why_join_contribution: q10
    };

    // Validation - collect missing fields
    const missingFields = [];
    
    // Basic info validation
    if (!formData.first_name) missingFields.push("First Name");
    if (!formData.last_name) missingFields.push("Last Name");
    if (!formData.gender) missingFields.push("Gender");
    if (!formData.email) missingFields.push("Email");
    if (!residentSelect?.value) missingFields.push("Resident in Nigeria selection");
    if (!locationValue) missingFields.push("Location (State/Country)");
    if (!formData.profession) missingFields.push("Profession");
    if (selectedSkills.length === 0) missingFields.push("Skills");
    
    // Question validation - check q1 through q10 directly (minimum 10 characters for testing)
    if (q1.length < 10) missingFields.push("Question 1 (please write at least 10 characters)");
    if (q2.length < 10) missingFields.push("Question 2 (please write at least 10 characters)");
    if (q3.length < 10) missingFields.push("Question 3 (please write at least 10 characters)");
    if (q4.length < 10) missingFields.push("Question 4 (please write at least 10 characters)");
    if (q5.length < 10) missingFields.push("Question 5 (please write at least 10 characters)");
    if (q6.length < 10) missingFields.push("Question 6 (please write at least 10 characters)");
    if (q7.length < 10) missingFields.push("Question 7 (please write at least 10 characters)");
    if (q8.length < 10) missingFields.push("Question 8 (please write at least 10 characters)");
    if (q9.length < 10) missingFields.push("Question 9 (please write at least 10 characters)");
    if (q10.length < 10) missingFields.push("Question 10 (please write at least 10 characters)");
    
    if (missingFields.length > 0) {
      showError(`Please fill all required fields. Missing: ${missingFields.join(', ')}`);
      return;
    }

    // Disable submit button and show loading
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';
    }
    
    showLoading('Submitting your application to the central committee...');

    // Submit to Supabase
    const { error } = await supabase
      .from('members')
      .insert([formData]);

    if (error) {
      console.error("Supabase error:", error);
      showError(`Error: ${error.message}. Please try again or contact us directly.`);
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Application';
      }
    } else {
      console.log("Submission successful!");
      hideForm();
      showSuccessMessage();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // ============================================================
  // 10. Initialize all event listeners
  // ============================================================
  
  // Populate skills
  populateSkillsCheckboxes();
  
  // Skills checkbox listener
  if (skillsCheckboxGrid) {
    skillsCheckboxGrid.addEventListener('change', function(e) {
      if (e.target && e.target.type === 'checkbox') {
        handleOtherSkillCheckbox();
      }
    });
  }
  
  // Resident select listener
  if (residentSelect) {
    residentSelect.addEventListener('change', updateLocationField);
  }
  
  // Add social media button
  if (addSocialBtn) {
    addSocialBtn.addEventListener('click', addSocialRow);
  }
  
  // Form submit listener
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
    console.log("Form listener added");
  }
  
  console.log("=== signup.js initialization complete ===");
});