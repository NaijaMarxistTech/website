// js/signup.js - Membership form logic

// Make supabase available globally
let supabase;

// Initialize Supabase immediately (not inside DOMContentLoaded)
const SUPABASE_URL = 'https://pcpntpuujhrvbffgpixs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjcG50cHV1amhydmJmZmdwaXhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NjMwNDgsImV4cCI6MjA5NjQzOTA0OH0.gsMFI_dmN44NA5iHyyg1QgMXxJjBi1Ho8Inv3Tuqmsw';

// Check if supabase client already exists
if (typeof window.supabaseClient === 'undefined') {
  supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  window.supabaseClient = supabase;
} else {
  supabase = window.supabaseClient;
}

// Global function for "Other" skill dropdown (called from HTML onchange)
window.handleOtherSkillDropdown = function() {
  console.log("handleOtherSkillDropdown triggered");
  const skillSelect = document.getElementById('primarySkill');
  const otherField = document.getElementById('otherSkillField');
  const otherText = document.getElementById('otherSkillText');
  
  if (skillSelect && otherField) {
    if (skillSelect.value === 'Other') {
      otherField.style.display = 'block';
      if (otherText) otherText.required = true;
    } else {
      otherField.style.display = 'none';
      if (otherText) {
        otherText.required = false;
        otherText.value = '';
      }
    }
  }
};

// Nigerian states
const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa",
  "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger",
  "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara", "FCT Abuja"
];

// Handle location field
function updateLocationField() {
  const resident = document.getElementById('residentNigeria');
  const container = document.getElementById('locationField');
  if (!resident || !container) return;
  
  const residentValue = resident.value;
  if (residentValue === 'yes') {
    container.innerHTML = `
      <label>State of Residence <span class="required">*</span></label>
      <select id="location" required>
        <option value="">Select state...</option>
        ${nigerianStates.map(state => `<option value="${state}">${state}</option>`).join('')}
      </select>
    `;
  } else if (residentValue === 'no') {
    container.innerHTML = `
      <label>Country of Residence <span class="required">*</span></label>
      <input type="text" id="location" placeholder="e.g., Ghana, UK, USA" required>
    `;
  } else {
    container.innerHTML = '';
  }
}

// Collect social handles
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

// Add social media row
function addSocialRow() {
  const container = document.getElementById('socialHandlesContainer');
  if (!container) return;
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
  container.appendChild(newEntry);
}

// Form submission handler
async function handleFormSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  const statusDiv = document.getElementById('formStatus');
  
  // Collect primary skill
  let primarySkill = document.getElementById('primarySkill').value;
  const otherSkillText = document.getElementById('otherSkillText')?.value || '';

  if (primarySkill === 'Other' && otherSkillText) {
    primarySkill = otherSkillText;
  }
  
  const formData = {
    first_name: document.getElementById('firstName').value.trim(),
    last_name: document.getElementById('lastName').value.trim(),
    gender: document.getElementById('gender').value,
    email: document.getElementById('email').value.trim(),
    telegram_username: document.getElementById('telegram').value.trim(),
    resident_in_nigeria: document.getElementById('residentNigeria').value === 'yes',
    location: document.getElementById('location')?.value.trim() || '',
    profession: document.getElementById('profession').value.trim(),
    primary_skill: primarySkill,
    social_handles: collectSocialHandles(),
    q1_marxist_familiarity: document.getElementById('q1').value.trim(),
    q2_class_definition: document.getElementById('q2').value.trim(),
    q3_class_conflict_revolution: document.getElementById('q3').value.trim(),
    q4_primary_class_struggle: document.getElementById('q4').value.trim(),
    q5_capitalism_vs_socialism: document.getElementById('q5').value.trim(),
    q6_pan_africanism_vs_marxism: document.getElementById('q6').value.trim(),
    q7_nigerian_democracy: document.getElementById('q7').value.trim(),
    q8_revolution_definition: document.getElementById('q8').value.trim(),
    q9_socialist_revolutions_today: document.getElementById('q9').value.trim(),
    q10_why_join_contribution: document.getElementById('q10').value.trim()
  };

  // Basic validation
  for (let [key, value] of Object.entries(formData)) {
    if (key !== 'telegram_username' && key !== 'social_handles' && !value) {
      statusDiv.innerHTML = '<span>Please fill all required fields.</span>';
      statusDiv.className = 'form-status error';
      return;
    }
  }

  btn.disabled = true;
  btn.textContent = 'Submitting...';
  statusDiv.innerHTML = '';

  const { error } = await supabase
    .from('members')
    .insert([formData]);

  if (error) {
    console.error(error);
    statusDiv.innerHTML = `<span>Error: ${error.message}. Please try again or contact us directly.</span>`;
    statusDiv.className = 'form-status error';
    btn.disabled = false;
    btn.textContent = 'Submit Application';
  } else {
    statusDiv.innerHTML = '<span>✓ Application submitted! A comrade will contact you within 48 hours.</span>';
    statusDiv.className = 'form-status success';
    document.getElementById('membershipForm').reset();
    const otherField = document.getElementById('otherSkillField');
    if (otherField) otherField.style.display = 'none';
    btn.disabled = false;
    btn.textContent = 'Submit Application';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM ready, initializing form...");
  
  const residentSelect = document.getElementById('residentNigeria');
  if (residentSelect) {
    residentSelect.addEventListener('change', updateLocationField);
  }
  
  const addSocialBtn = document.getElementById('addSocialBtn');
  if (addSocialBtn) {
    addSocialBtn.addEventListener('click', addSocialRow);
  }
  
  const form = document.getElementById('membershipForm');
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }
  
  console.log("Form initialization complete");
});