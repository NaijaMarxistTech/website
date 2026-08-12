// js/admin.js – Mailing List Admin Page

document.addEventListener('DOMContentLoaded', function() {
  const passwordForm = document.getElementById('passwordForm');
  const passwordInput = document.getElementById('adminPassword');
  const passwordError = document.getElementById('passwordError');
  const passwordPrompt = document.getElementById('passwordPrompt');
  const adminContent = document.getElementById('adminContent');
  const attemptsSpan = document.getElementById('attemptsRemaining');
  const logoutBtn = document.getElementById('logoutBtn');

  let attempts = 5;

  // ── Use Supabase Edge Function to check password ──
  // The password is stored in Supabase secrets (not in code)
  const checkPassword = async (inputPassword) => {
    try {
      const response = await fetch(
        'https://pcpntpuujhrvbffgpixs.supabase.co/functions/v1/verify-admin-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password: inputPassword })
        }
      );

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return data.valid === true;
    } catch (error) {
      console.error('Password verification failed:', error);
      return false;
    }
  };

  // ── Password form submission ──
  passwordForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    passwordError.style.display = 'none';

    const inputPassword = passwordInput.value.trim();

    if (!inputPassword) {
      passwordError.textContent = 'Please enter a password.';
      passwordError.style.display = 'block';
      return;
    }

    // Check attempts
    if (attempts <= 0) {
      passwordError.textContent = 'Too many failed attempts. Refresh the page to try again.';
      passwordError.style.display = 'block';
      passwordInput.disabled = true;
      return;
    }

    // Verify password via Supabase Edge Function
    const isValid = await checkPassword(inputPassword);

    if (isValid) {
      // Correct password – show admin content
      passwordPrompt.style.display = 'none';
      adminContent.style.display = 'block';
      loadMailingList();
    } else {
      attempts--;
      attemptsSpan.textContent = attempts;
      passwordError.textContent = 'Incorrect password. Try again.';
      passwordError.style.display = 'block';
      passwordInput.value = '';
      passwordInput.focus();

      if (attempts <= 0) {
        passwordError.textContent = 'No more attempts. Refresh to try again.';
        passwordInput.disabled = true;
      }
    }
  });

  // ── Logout ──
  logoutBtn.addEventListener('click', function() {
    adminContent.style.display = 'none';
    passwordPrompt.style.display = 'flex';
    passwordInput.value = '';
    passwordInput.disabled = false;
    attempts = 5;
    attemptsSpan.textContent = attempts;
    passwordError.style.display = 'none';
    passwordInput.focus();
  });

  // ── Load mailing list data ──
  async function loadMailingList() {
    const tbody = document.getElementById('mailingTableBody');
    const searchInput = document.getElementById('searchInput');
    const subscriberCount = document.getElementById('subscriberCount');

    try {
      const supabase = window.supabaseClient;
      if (!supabase) {
        throw new Error('Supabase client not available');
      }

      // Fetch all subscribers
      const { data, error } = await supabase
        .from('mailing_list')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Store data globally for search and export
      window.subscribers = data || [];

      // Update count
      subscriberCount.textContent = window.subscribers.length;

      // Render table
      renderTable(window.subscribers);

      // ── Search functionality ──
      searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        const filtered = window.subscribers.filter(row =>
          (row.first_name || '').toLowerCase().includes(query) ||
          (row.last_name || '').toLowerCase().includes(query) ||
          (row.email || '').toLowerCase().includes(query) ||
          (row.phone || '').toLowerCase().includes(query) ||
          (row.source || '').toLowerCase().includes(query)
        );
        renderTable(filtered);
      });

    } catch (error) {
      console.error('Error loading mailing list:', error);
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:2rem; color:var(--red);">Failed to load data. Please refresh.</td></tr>';
    }
  }

  // ── Render table ──
  function renderTable(subscribers) {
    const tbody = document.getElementById('mailingTableBody');

    if (!subscribers || subscribers.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:2rem; color:#888;">No subscribers found.</td></tr>';
      return;
    }

    let html = '';
    subscribers.forEach(row => {
      const status = row.subscribed !== false;
      const statusHtml = status
        ? '<span class="status-active">Active</span>'
        : '<span class="status-inactive">Unsubscribed</span>';

      html += `
        <tr>
          <td>${row.id}</td>
          <td>${row.first_name || ''}</td>
          <td>${row.last_name || ''}</td>
          <td>${row.email || ''}</td>
          <td>${row.phone || ''}</td>
          <td>${row.source || 'website'}</td>
          <td>${statusHtml}</td>
          <td>${row.subscribed_at ? new Date(row.subscribed_at).toLocaleDateString('en-GB') : ''}</td>
        </tr>
      `;
    });

    tbody.innerHTML = html;
  }

  // ── CSV Export ──
  document.getElementById('exportCsvBtn').addEventListener('click', function() {
    const data = window.subscribers || [];

    if (data.length === 0) {
      alert('No data to export.');
      return;
    }

    // Headers
    const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Source', 'Status', 'Subscribed At'];

    // Rows
    const rows = data.map(row => [
      row.id || '',
      row.first_name || '',
      row.last_name || '',
      row.email || '',
      row.phone || '',
      row.source || 'website',
      row.subscribed !== false ? 'Active' : 'Unsubscribed',
      row.subscribed_at ? new Date(row.subscribed_at).toLocaleString('en-GB') : ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `mailing-list-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  });
});