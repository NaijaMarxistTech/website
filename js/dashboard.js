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

      // Load analytics when switching to analytics tab
      if (this.dataset.tab === 'analytics') {
        setTimeout(loadGitHubAnalytics, 500);
      }
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

    if (!supabase) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:2rem; color:var(--red);">Supabase client not available.</td></tr>';
      return;
    }

    try {
      // ── Fetch members ──
      const { data, error } = await supabase
        .from('members')
        .select('id, first_name, last_name, email, location, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching members:', error);
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:2rem; color:var(--red);">Error loading members.</td></tr>';
        return;
      }

      // ── Fetch classifications with reasoning ──
      const { data: classifications, error: cError } = await supabase
        .from('members_classified')
        .select('id, level, score, classification_reasoning');

      if (cError) {
        console.error('Error fetching classifications:', cError);
      }

      const classMap = {};
      if (classifications) {
        classifications.forEach(c => {
          classMap[c.id] = {
            level: c.level || 'unclassified',
            score: c.score || 0,
            reasoning: c.classification_reasoning || 'No reasoning available'
          };
        });
      }

      window.members = data.map(m => ({
        ...m,
        level: classMap[m.id]?.level || 'unclassified',
        score: classMap[m.id]?.score || 0,
        reasoning: classMap[m.id]?.reasoning || 'Awaiting classification...'
      }));

      memberCount.textContent = window.members.length;
      renderMemberTable(window.members);

      // ── Search ──
      searchInput.addEventListener('input', function() {
        filterMembers();
      });

      // ── Filter ──
      filterSelect.addEventListener('change', function() {
        filterMembers();
      });

    } catch (error) {
      console.error('Error loading members:', error);
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:2rem; color:var(--red);">Failed to load members.</td></tr>';
    }
  }

  // ── Filter members ──
  function filterMembers() {
    const query = document.getElementById('memberSearch').value.toLowerCase();
    const filter = document.getElementById('memberFilter').value;

    let filtered = window.members || [];

    if (filter !== 'all') {
      filtered = filtered.filter(m => m.level === filter);
    }

    if (query) {
      filtered = filtered.filter(m =>
        (m.first_name || '').toLowerCase().includes(query) ||
        (m.last_name || '').toLowerCase().includes(query) ||
        (m.email || '').toLowerCase().includes(query) ||
        (m.location || '').toLowerCase().includes(query) ||
        (m.reasoning || '').toLowerCase().includes(query)
      );
    }

    renderMemberTable(filtered);
  }

  // ── Render member table ──
  function renderMemberTable(members) {
    const tbody = document.getElementById('memberTableBody');

    if (!members || members.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; padding:2rem; color:#888;">No members found.</td></tr>';
      return;
    }

    let html = '';
    members.forEach(m => {
      const levelClass = m.level || 'unclassified';
      const levelLabel = levelClass.charAt(0).toUpperCase() + levelClass.slice(1);
      const reasoningShort = m.reasoning && m.reasoning.length > 80
        ? m.reasoning.substring(0, 80) + '...'
        : m.reasoning || 'Awaiting classification...';

      html += `
        <tr data-id="${m.id}">
          <td>${m.id || ''}</td>
          <td>${[m.first_name, m.last_name].filter(Boolean).join(' ') || ''}</td>
          <td>${m.email || ''}</td>
          <td>${m.location || ''}</td>
          <td><span class="level-badge ${levelClass}">${levelLabel}</span></td>
          <td>${m.score || 0}</td>
          <td title="${m.reasoning || ''}" style="max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
            ${reasoningShort}
          </td>
          <td>${m.created_at ? new Date(m.created_at).toLocaleDateString('en-GB') : ''}</td>
        </tr>
      `;
    });

    tbody.innerHTML = html;

    // ── Attach click event to rows (modal) ──
    tbody.querySelectorAll('tr[data-id]').forEach(row => {
      row.addEventListener('click', function() {
        const id = this.dataset.id;
        if (id) openModal(id);
      });
    });
  }

  // ── CSV Export ──
  document.getElementById('exportMembersBtn').addEventListener('click', function() {
    const data = window.members || [];

    if (data.length === 0) {
      alert('No data to export.');
      return;
    }

    const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Location', 'Level', 'Score', 'Reasoning', 'Joined'];

    const rows = data.map(m => [
      m.id || '',
      m.first_name || '',
      m.last_name || '',
      m.email || '',
      m.location || '',
      m.level || 'unclassified',
      m.score || 0,
      m.reasoning || '',
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
  let viewsChartInstance = null;

  document.getElementById('refreshAnalytics').addEventListener('click', function(e) {
    e.preventDefault();
    loadGitHubAnalytics();
  });

  async function loadGitHubAnalytics() {
    const viewsEl = document.getElementById('githubViews');
    const uniquesEl = document.getElementById('githubUniques');
    const clonesEl = document.getElementById('githubClones');
    const cloneUniquesEl = document.getElementById('githubCloneUniques');

    viewsEl.textContent = 'Loading...';
    uniquesEl.textContent = 'Loading...';
    clonesEl.textContent = 'Loading...';
    cloneUniquesEl.textContent = 'Loading...';

    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/github-analytics`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch GitHub analytics: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        viewsEl.textContent = '❌';
        uniquesEl.textContent = '❌';
        clonesEl.textContent = '❌';
        cloneUniquesEl.textContent = '❌';
        console.error('GitHub analytics error:', data.error);
        return;
      }

      viewsEl.textContent = data.views?.count || '0';
      uniquesEl.textContent = data.views?.uniques || '0';
      clonesEl.textContent = data.clones?.count || '0';
      cloneUniquesEl.textContent = data.clones?.uniques || '0';

      // ── Render chart ──
      renderViewsChart(data.views);

    } catch (error) {
      console.error('GitHub analytics error:', error);
      viewsEl.textContent = '❌';
      uniquesEl.textContent = '❌';
      clonesEl.textContent = '❌';
      cloneUniquesEl.textContent = '❌';
    }
  }

  // ── Render GitHub views chart ──
  function renderViewsChart(viewsData) {
    const container = document.getElementById('viewsChartContainer');
    const canvas = document.getElementById('viewsChart');

    if (!canvas) return;

    // Destroy existing chart if it exists
    if (viewsChartInstance) {
      viewsChartInstance.destroy();
      viewsChartInstance = null;
    }

    if (!viewsData || !viewsData.views || viewsData.views.length === 0) {
      canvas.style.display = 'none';
      container.innerHTML = '<p style="color:#888; font-size:0.9rem;">No views data available for the last 14 days.</p>';
      return;
    }

    canvas.style.display = 'block';
    container.innerHTML = '';
    container.appendChild(canvas);

    const labels = viewsData.views.map(v => new Date(v.timestamp).toLocaleDateString('en-GB'));
    const counts = viewsData.views.map(v => v.count);

    viewsChartInstance = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Views',
          data: counts,
          backgroundColor: 'rgba(198, 40, 40, 0.6)',
          borderColor: 'rgba(198, 40, 40, 1)',
          borderWidth: 2,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          },
          x: {
            ticks: {
              maxTicksLimit: 14,
              font: {
                size: 9
              }
            }
          }
        }
      }
    });
  }

  // ──────────────────────────────────────────────────────────────
  // ── Applicant Detail Modal ──
  // ──────────────────────────────────────────────────────────────

  // ── Fetch full applicant data for modal ──
  async function loadApplicantDetails(id) {
    try {
      // Fetch member details
      const { data: member, error: mError } = await supabase
        .from('members')
        .select('*')
        .eq('id', id)
        .single();

      if (mError) throw mError;

      // Fetch classification
      const { data: classification, error: cError } = await supabase
        .from('members_classified')
        .select('*')
        .eq('id', id)
        .single();

      if (cError && cError.code !== 'PGRST116') throw cError; // PGRST116 = not found

      return { member, classification };
    } catch (error) {
      console.error('Error fetching applicant details:', error);
      return null;
    }
  }

  // ── Render applicant modal ──
  function renderModal(data) {
    const { member, classification } = data;

    // Set header
    const name = [member.first_name, member.last_name].filter(Boolean).join(' ') || 'Unknown';
    document.getElementById('modalName').textContent = name;

    // Set meta
    document.getElementById('modalEmail').textContent = `📧 ${member.email || 'No email'}`;
    document.getElementById('modalLocation').textContent = `📍 ${member.location || 'No location'}`;

    const level = classification?.level || 'unclassified';
    const levelLabel = level.charAt(0).toUpperCase() + level.slice(1);
    document.getElementById('modalLevel').textContent = `🎯 ${levelLabel}`;

    const score = classification?.score || 0;
    document.getElementById('modalScore').textContent = `📊 Score: ${score}`;

    // Reasoning
    const reasoningEl = document.getElementById('modalReasoning');
    if (classification?.classification_reasoning) {
      reasoningEl.textContent = classification.classification_reasoning;
    } else {
      reasoningEl.textContent = 'No reasoning available.';
    }

    // Answers
    const answersContainer = document.getElementById('modalAnswers');
    const questionKeys = [
      'q1_marxist_familiarity',
      'q2_class_definition',
      'q3_class_conflict_revolution',
      'q4_primary_class_struggle',
      'q5_capitalism_vs_socialism',
      'q6_pan_africanism_vs_marxism',
      'q7_nigerian_democracy',
      'q8_revolution_definition',
      'q9_socialist_revolutions_today',
      'q10_why_join_contribution'
    ];

    const questionLabels = [
      '1. Marxist familiarity',
      '2. Class definition',
      '3. Class conflict + Nigeria',
      '4. Class vs tribalism/religion',
      '5. Capitalism vs Socialism',
      '6. Pan-Africanism vs Marxism',
      '7. Nigerian democracy',
      '8. Revolution definition',
      '9. Socialist revolution today',
      '10. Why join?'
    ];

    let html = '';
    questionKeys.forEach((key, i) => {
      const answer = member[key] || 'No answer provided.';
      html += `
        <div class="modal-answer-item">
          <div class="q">${questionLabels[i]}</div>
          <div class="a">${answer}</div>
        </div>
      `;
    });

    answersContainer.innerHTML = html;
  }

  // ── Open modal ──
  async function openModal(applicantId) {
    const modal = document.getElementById('applicantModal');
    const loadingText = document.getElementById('modalName');
    loadingText.textContent = 'Loading...';

    modal.style.display = 'flex';

    const data = await loadApplicantDetails(applicantId);
    if (data) {
      renderModal(data);
    } else {
      document.getElementById('modalName').textContent = 'Error loading applicant';
      document.getElementById('modalReasoning').textContent = 'Could not load details.';
    }
  }

  // ── Close modal ──
  function closeModal() {
    document.getElementById('applicantModal').style.display = 'none';
  }

  // ── Modal close events ──
  document.getElementById('modalClose').addEventListener('click', closeModal);
  document.getElementById('modalCloseBtn').addEventListener('click', closeModal);
  document.getElementById('applicantModal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
  });

  // ── Modal export button (single applicant) ──
  document.getElementById('modalExportBtn').addEventListener('click', function() {
    // Get the current member data from the modal
    const nameEl = document.getElementById('modalName');
    const emailEl = document.getElementById('modalEmail');
    const locationEl = document.getElementById('modalLocation');
    const levelEl = document.getElementById('modalLevel');
    const scoreEl = document.getElementById('modalScore');
    const reasoningEl = document.getElementById('modalReasoning');

    // Collect answers
    const answerItems = document.querySelectorAll('#modalAnswers .modal-answer-item');
    let answersText = '';
    answerItems.forEach(item => {
      const q = item.querySelector('.q')?.textContent || '';
      const a = item.querySelector('.a')?.textContent || '';
      answersText += `${q}\n${a}\n\n`;
    });

    const csvContent = [
      'Field,Value',
      `Name,${nameEl.textContent}`,
      `Email,${emailEl.textContent.replace('📧 ', '')}`,
      `Location,${locationEl.textContent.replace('📍 ', '')}`,
      `Level,${levelEl.textContent.replace('🎯 ', '')}`,
      `Score,${scoreEl.textContent.replace('📊 Score: ', '')}`,
      `Reasoning,${reasoningEl.textContent}`,
      '',
      'Answers:',
      answersText.trim()
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `applicant-${nameEl.textContent}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  });

  console.log("=== dashboard.js initialization complete ===");
});