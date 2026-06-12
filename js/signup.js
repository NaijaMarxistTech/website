// js/signup.js - Complete with checkbox skills, mobile-friendly

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
  // 3. Skills list
  // ============================================================
  const skillsList = [
    "Web designing", "Graphic designing", "Writing/Content creation",
    "Data analysis", "Video editing", "Social media management",
    "Fundraising", "Event organizing", "Legal aid/Paralegal",
    "Translation", "Research", "Community organizing", "Other"
  ];

  // ============================================================
  // 4. Get all DOM elements
  // ============================================================
  const residentSelect = document.getElementById('residentNigeria');
  const locationField = document.getElementById('locationField');
  const skillsCheckboxGrid = document.getElementById('skillsCheckboxGrid');
  const otherSkillField = document.getElementById('otherSkillField');
  const otherSkillText = document.getElementById('otherSkillText');
  const addSocialBtn = document.getElementById('addSocialBtn');
  const socialHandlesContainer = document.getElementById('socialHandlesContainer');
  const membershipForm = document.getElementById('membershipForm');
  const submitBtn = document.getElementById('submitBtn');
  const formStatus = document.getElementById('formStatus');

  console.log("Elements found:", {
    residentSelect: !!residentSelect,
    skillsCheckboxGrid: !!skillsCheckboxGrid,
    otherSkillField: !!otherSkillField,
    addSocialBtn: !!addSocialBtn,
    membershipForm: !!membershipForm
  });

  // ============================================================
  // 5. Populate skills checkboxes
  // ============================================================
  function populateSkillsCheckboxes() {
    if (!skillsCheckboxGrid) return;
    
    skillsCheckboxGrid.innerHTML = '';
    skillsList.forEach(skill => {
      // Create a valid ID for each checkbox
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
  populateSkillsCheckboxes();

  // ============================================================
  // 6. Handle "Other" skill checkbox
  // ============================================================
  function handleOtherSkillCheckbox() {
    const otherCheckbox = document.querySelector('#skill_Other');
    const isOtherSelected = otherCheckbox ? otherCheckbox.checked : false;
    
    if (isOtherSelected) {
      if (otherSkillField) otherSkillField.style.display = 'block';
      if (otherSkillText) otherSkillText.required = true;
      console.log("Other field shown");
    } else {
      if (otherSkillField) otherSkillField.style.display = 'none';
      if (otherSkillText) {
        otherSkillText.required = false;
        otherSkillText.value = '';
      }
      console.log("Other field hidden");
    }
  }

  // Add event listener to the skills grid for checkbox changes
  if (skillsCheckboxGrid) {
    skillsCheckboxGrid.addEventListener('change', function(e) {
      if (e.target && e.target.type === 'checkbox') {
        handleOtherSkillCheckbox();
      }
    });
    console.log("Added change listener to skillsCheckboxGrid");
  }

  // ============================================================
  // 7. Handle "Resident in Nigeria" dropdown
  // ============================================================
  function updateLocationField() {
    console.log("updateLocationField called, value:", residentSelect ? residentSelect.value : 'null');
    
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
  // 8. Handle social media rows
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

  // Collect social handles from all rows
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
  // 9. Form submission handler
  // ============================================================
  async function handleFormSubmit(e) {
    e.preventDefault();
    console.log("Form submitted");
    
    // Get location value (works for both select and input)
    const locationElement = document.getElementById('location');
    const locationValue = locationElement ? locationElement.value.trim() : '';
    
    // Collect selected skills from checkboxes
    const selectedCheckboxes = document.querySelectorAll('.skill-checkbox-item input[type="checkbox"]:checked');
    let selectedSkills = Array.from(selectedCheckboxes).map(cb => cb.value);
    
    const otherSkillTextValue = otherSkillText ? otherSkillText.value.trim() : '';
    
    // Check if "Other" is selected and has text
    if (selectedSkills.includes('Other') && otherSkillTextValue) {
      // Replace "Other" with the custom text
      const otherIndex = selectedSkills.indexOf('Other');
      selectedSkills[otherIndex] = otherSkillTextValue;
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
      primary_skill: selectedSkills,
      social_handles: collectSocialHandles(),
      q1_marxist_familiarity: document.getElementById('q1')?.value.trim() || '',
      q2_class_definition: document.getElementById('q2')?.value.trim() || '',
      q3_class_conflict_revolution: document.getElementById('q3')?.value.trim() || '',
      q4_primary_class_struggle: document.getElementById('q4')?.value.trim() || '',
      q5_capitalism_vs_socialism: document.getElementById('q5')?.value.trim() || '',
      q6_pan_africanism_vs_marxism: document.getElementById('q6')?.value.trim() || '',
      q7_nigerian_democracy: document.getElementById('q7')?.value.trim() || '',
      q8_revolution_definition: document.getElementById('q8')?.value.trim() || '',
      q9_socialist_revolutions_today: document.getElementById('q9')?.value.trim() || '',
      q10_why_join_contribution: document.getElementById('q10')?.value.trim() || ''
    };

    // Validation: Check if at least one skill is selected
    if (selectedSkills.length === 0) {
      if (formStatus) {
        formStatus.innerHTML = '<span>Please select at least one skill.</span>';
        formStatus.className = 'form-status error';
      }
      return;
    }
    
    // Validation: Check if "Other" was selected but no text provided
    const otherCheckbox = document.querySelector('#skill_Other');
    if (otherCheckbox && otherCheckbox.checked && !otherSkillTextValue) {
      if (formStatus) {
        formStatus.innerHTML = '<span>Please specify your "Other" skill.</span>';
        formStatus.className = 'form-status error';
      }
      return;
    }

    // Validation: Check all other required fields
    let isValid = true;
    for (let [key, value] of Object.entries(formData)) {
      if (key !== 'telegram_username' && key !== 'social_handles' && key !== 'primary_skill' && !value) {
        isValid = false;
        console.log(`Missing field: ${key}`);
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

    // Disable submit button and show loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';
    }
    if (formStatus) formStatus.innerHTML = '';

    // Submit to Supabase
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
      // Success!
      if (formStatus) {
        formStatus.innerHTML = '<span>✓ Application submitted! A comrade will contact you within 48 hours.</span>';
        formStatus.className = 'form-status success';
      }
      if (membershipForm) membershipForm.reset();
      if (otherSkillField) otherSkillField.style.display = 'none';
      
      // Uncheck all checkboxes after reset
      document.querySelectorAll('.skill-checkbox-item input[type="checkbox"]').forEach(cb => cb.checked = false);
      
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Application';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Add submit event listener to form
  if (membershipForm) {
    membershipForm.addEventListener('submit', handleFormSubmit);
    console.log("Added submit listener to membershipForm");
  }

  console.log("=== signup.js initialization complete ===");
});