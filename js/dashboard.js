// js/dashboard.js – Recruitment Dashboard

console.log("=== dashboard.js loaded ===");

document.addEventListener('DOMContentLoaded', function() {
  console.log("DOMContentLoaded fired");

  // ── Supabase configuration ──
  const supabase = window.supabaseClient || null;

  if (!supabase) {
    console.warn("Supabase client not initialized — dashboard will not work.");
  } else {
    console.log("Supabase client ready for dashboard");
  }

  // ── Elements ──
  const passwordForm = document.getElementById('passwordForm');
  const passwordInput = document.getElementById('dashboardPassword');
  const passwordError = document.getElementById('passwordError');
  const passwordPrompt = document.getElementById('passwordPrompt');
  const dashboardContent = document.getElementById('dashboardContent');
  const attemptsSpan = document.getElementById('attemptsRemaining');
  const logoutBtn = document.getElementById('logoutBtn');

  let attempts = 5;

  // ── Edge Function URL ──
  const SUPABASE_URL = window.SUPABASE_URL || 'https://pcpntpuujhrvbffgpixs.supabase.co';
  const edgeFunctionUrl = `${SUPABASE_URL}/functions/v1/verify-admin-password`;

  // ── Password verification ──
  const checkPassword = async (inputPassword) => {
    try {
      const response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: inputPassword })
      });

      if (!response.ok) return false;
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

    if (attempts <= 0) {
      passwordError.textContent = 'Too many failed attempts. Refresh the page to try again.';
      passwordError.style.display = 'block';
      passwordInput.disabled = true;
      return;
    }

    const isValid = await checkPassword(inputPassword);

    if (isValid) {
      passwordPrompt.style.display = 'none';
      dashboardContent.style.display = 'block';
      loadDashboard();
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
    dashboardContent.style.display = 'none';
    passwordPrompt.style.display = 'flex';
    passwordInput.value = '';
    passwordInput.disabled = false;
    attempts = 5;
    attemptsSpan.textContent = attempts;
    passwordError.style.display = 'none';
    passwordInput.focus();
  });

  // ── Tab switching ──
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      this.classList.add('active');
      document.getElementById(`tab-${this.dataset.tab}`).classList.add('active');
    });
  });

  // ── Load dashboard data ──
  async function loadDashboard() {
    if (!supabase) {
      showError('Supabase client not available.');
      return;
    }

    try {
      await loadMetrics();
      await loadMembers();
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  }

  // ── Load metrics ──
  async function loadMetrics() {
    try {
      // Total members
      const { count: total, error: e1 } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true });
      if (e1) throw e1;

      // New members (7 days)
      const { count: new7, error: e2 } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());
      if (e2) throw e2;

      // New members (30 days)
      const { count: new30, error: e3 } = await supabase
        .from('members')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());
      if (e3) throw e3;

      // Classification breakdown
      const { data: classifications, error: e4 } = await supabase
        .from('members_classified')
        .select('level');
      if (e4) throw e4;

      const breakdown = { beginner: 0, intermediate: 0, advanced: 0 };
      let unclassified = 0;

      classifications.forEach(row => {
        if (row.level && breakdown.hasOwnProperty(row.level)) {
          breakdown[row.level]++;
        } else {
          unclassified++;
        }
      });

      // Update UI
      document.getElementById('totalMembers').textContent = total || 0;
      document.getElementById('newMembers7').textContent = new7 || 0;
      document.getElementById('newMembers30').textContent = new30 || 0;
      document.getElementById('unclassifiedCount').textContent = unclassified;

      document.getElementById('beginnerCount').textContent = breakdown.beginner;
      document.getElementById('intermediateCount').textContent = breakdown.intermediate;
      document.getElementById('advancedCount').textContent = breakdown.advanced;
      document.getElementById('unclassifiedCount2').textContent = unclassified;

    } catch (error) {
      console.error('Error loading metrics:', error);
    }
  }

  // ── Load members ──
  async function loadMembers() {
    const tbody = document.getElementById('memberTableBody');
    const searchInput = document.getElementById('memberSearch');
    const filterSelect = document.getElementById('memberFilter');
    const memberCount = document.getElementById('memberCount');

    try {
      const { data, error } = await supabase
        .from('members')
        .select('id, first_name, last_name, email, location, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get classifications separately
      const { data: classifications, error: cError } = await supabase
        .from('members_classified')
        .select('id, level, score');

      if (cError) throw cError;

      const classMap = {};
      classifications.forEach(c => {
        classMap[c.id] = { level: c.level || 'unclassified', score: c.score || 0 };
      });

      window.members = data.map(m => ({
        ...m,
        level: classMap[m.id]?.level || 'unclassified',
        score: classMap[m.id]?.score || 0
      }));

      memberCount.textContent = window.members.length;
      renderMemberTable(window.members);

      // Search
      searchInput.addEventListener('input', function() {
        filterMembers();
      });

      // Filter
      filterSelect.addEventListener('change', function() {
        filterMembers();
      });

    } catch (error) {
      console.error('Error loading members:', error);
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:2rem; color:var(--red);">Failed to load members.</td></tr>';
    }
  }

  // ── Filter members ──
  function filterMembers() {
    const query = document.getElementById('memberSearch').value.toLowerCase();
    const filter = document.getElementById('memberFilter').value;

    let filtered = window.members;

    if (filter !== 'all') {
      filtered = filtered.filter(m => m.level === filter);
    }

    if (query) {
      filtered = filtered.filter(m =>
        (m.first_name || '').toLowerCase().includes(query) ||
        (m.last_name || '').toLowerCase().includes(query) ||
        (m.email || '').toLowerCase().includes(query) ||
        (m.location || '').toLowerCase().includes(query)
      );
    }

    renderMemberTable(filtered);
  }

  // ── Render member table ──
  function renderMemberTable(members) {
    const tbody = document.getElementById('memberTableBody');

    if (!members || members.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:2rem; color:#888;">No members found.</td></tr>';
      return;
    }

    let html = '';
    members.forEach(m => {
      const levelClass = m.level || 'unclassified';
      const levelLabel = levelClass.charAt(0).toUpperCase() + levelClass.slice(1);
      html += `
        <tr>
          <td>${m.id || ''}</td>
          <td>${[m.first_name, m.last_name].filter(Boolean).join(' ') || ''}</td>
          <td>${m.email || ''}</td>
          <td>${m.location || ''}</td>
          <td><span class="level-badge ${levelClass}">${levelLabel}</span></td>
          <td>${m.score || 0}</td>
          <td>${m.created_at ? new Date(m.created_at).toLocaleDateString('en-GB') : ''}</td>
        </tr>
      `;
    });

    tbody.innerHTML = html;
  }

  // ── CSV Export ──
  document.getElementById('exportMembersBtn').addEventListener('click', function() {
    const data = window.members || [];

    if (data.length === 0) {
      alert('No data to export.');
      return;
    }

    const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Location', 'Level', 'Score', 'Joined'];

    const rows = data.map(m => [
      m.id || '',
      m.first_name || '',
      m.last_name || '',
      m.email || '',
      m.location || '',
      m.level || 'unclassified',
      m.score || 0,
      m.created_at ? new Date(m.created_at).toLocaleString('en-GB') : ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `members-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  });

  // ── GitHub Analytics ──
  document.getElementById('refreshAnalytics').addEventListener('click', function(e) {
    e.preventDefault();
    loadGitHubAnalytics();
  });

  async function loadGitHubAnalytics() {
    // This requires a GitHub Personal Access Token
    // The token should be stored in Supabase Edge Function secrets
    // For now, we'll show a message

    document.getElementById('githubViews').textContent = '🔐';
    document.getElementById('githubUniques').textContent = '🔐';
    document.getElementById('githubClones').textContent = '🔐';
    document.getElementById('githubCloneUniques').textContent = '🔐';

    try {
      // Call Supabase Edge Function to fetch GitHub traffic
      const response = await fetch(`${SUPABASE_URL}/functions/v1/github-analytics`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch GitHub analytics');
      }

      const data = await response.json();

      document.getElementById('githubViews').textContent = data.views?.count || '0';
      document.getElementById('githubUniques').textContent = data.views?.uniques || '0';
      document.getElementById('githubClones').textContent = data.clones?.count || '0';
      document.getElementById('githubCloneUniques').textContent = data.clones?.uniques || '0';

    } catch (error) {
      console.error('GitHub analytics error:', error);
      document.getElementById('githubViews').textContent = '❌';
      document.getElementById('githubUniques').textContent = '❌';
      document.getElementById('githubClones').textContent = '❌';
      document.getElementById('githubCloneUniques').textContent = '❌';
    }
  }

  // ── Load GitHub analytics on tab switch ──
  document.querySelector('[data-tab="analytics"]').addEventListener('click', function() {
    setTimeout(loadGitHubAnalytics, 500);
  });

  console.log("=== dashboard.js initialization complete ===");
});