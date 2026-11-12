/* =========================================
   DataMind AI — app.js
   Main application logic
   ========================================= */

// ---- State ----
const state = {
  data: [],
  headers: [],
  fileName: '',
  queryHistory: [],
  builderChart: null,
  primaryChart: null,
  secondaryChart: null,
  resultCharts: [],
  builderChartType: 'bar',
  primaryChartType: 'bar',
  currentPage: 'dashboard',
};

// ---- Sample Datasets ----
const SAMPLE_DATA = {
  sales: {
    name: 'Sales Data',
    headers: ['Month', 'Product', 'Region', 'Revenue', 'Units', 'Profit', 'Growth%'],
    rows: [
      ['Jan', 'Widget A', 'North', 48200, 320, 14200, 5.2],
      ['Jan', 'Widget B', 'South', 31500, 210, 9800, 3.1],
      ['Jan', 'Widget C', 'East', 22400, 148, 6700, 7.8],
      ['Feb', 'Widget A', 'North', 52100, 347, 15600, 8.1],
      ['Feb', 'Widget B', 'South', 28900, 193, 8700, -8.3],
      ['Feb', 'Widget C', 'East', 24800, 165, 7400, 10.7],
      ['Mar', 'Widget A', 'North', 61300, 408, 18400, 17.7],
      ['Mar', 'Widget B', 'South', 33200, 221, 9900, 14.9],
      ['Mar', 'Widget C', 'East', 27900, 186, 8400, 12.5],
      ['Apr', 'Widget A', 'North', 58400, 389, 17500, -4.7],
      ['Apr', 'Widget B', 'South', 35700, 238, 10700, 7.5],
      ['Apr', 'Widget C', 'East', 29100, 194, 8700, 4.3],
      ['May', 'Widget A', 'North', 63200, 421, 18900, 8.2],
      ['May', 'Widget B', 'South', 37800, 252, 11300, 5.9],
      ['May', 'Widget C', 'East', 31400, 209, 9400, 7.9],
      ['Jun', 'Widget A', 'North', 71500, 476, 21400, 13.1],
      ['Jun', 'Widget B', 'South', 39200, 261, 11800, 3.7],
      ['Jun', 'Widget C', 'East', 34700, 231, 10400, 10.5],
    ]
  },
  manufacturing: {
    name: 'Manufacturing Lines',
    headers: ['Line', 'Shift', 'Month', 'Target_Units', 'Actual_Units', 'Efficiency%', 'Downtime_hrs', 'Defect_Rate%'],
    rows: [
      ['Line 1', 'Morning', 'Oct', 1200, 1150, 95.8, 2.1, 1.2],
      ['Line 2', 'Morning', 'Oct', 1200, 1020, 85.0, 5.4, 2.8],
      ['Line 3', 'Morning', 'Oct', 1200, 1180, 98.3, 0.8, 0.5],
      ['Line 4', 'Morning', 'Oct', 1200, 940, 78.3, 8.2, 4.1],
      ['Line 5', 'Morning', 'Oct', 1200, 1090, 90.8, 3.6, 1.9],
      ['Line 1', 'Evening', 'Oct', 1100, 1050, 95.5, 2.3, 1.1],
      ['Line 2', 'Evening', 'Oct', 1100, 870, 79.1, 7.8, 3.9],
      ['Line 3', 'Evening', 'Oct', 1100, 1080, 98.2, 0.9, 0.6],
      ['Line 4', 'Evening', 'Oct', 1100, 820, 74.5, 10.1, 5.2],
      ['Line 5', 'Evening', 'Oct', 1100, 980, 89.1, 4.2, 2.1],
      ['Line 1', 'Morning', 'Nov', 1200, 1170, 97.5, 1.4, 0.9],
      ['Line 2', 'Morning', 'Nov', 1200, 1050, 87.5, 4.8, 2.4],
      ['Line 3', 'Morning', 'Nov', 1200, 1190, 99.2, 0.5, 0.3],
      ['Line 4', 'Morning', 'Nov', 1200, 970, 80.8, 7.1, 3.6],
      ['Line 5', 'Morning', 'Nov', 1200, 1110, 92.5, 3.0, 1.5],
    ]
  },
  hr: {
    name: 'HR Analytics',
    headers: ['Department', 'Team', 'Headcount', 'Avg_Salary', 'Attrition%', 'Satisfaction', 'Tenure_yrs', 'Performance'],
    rows: [
      ['Engineering', 'Frontend', 24, 92000, 8.3, 4.2, 3.1, 87],
      ['Engineering', 'Backend', 31, 98000, 6.5, 4.5, 4.2, 91],
      ['Engineering', 'DevOps', 12, 105000, 5.0, 4.6, 5.1, 93],
      ['Engineering', 'QA', 15, 78000, 12.0, 3.8, 2.4, 82],
      ['Product', 'Design', 9, 88000, 9.0, 4.3, 2.8, 85],
      ['Product', 'PM', 7, 110000, 7.1, 4.4, 4.5, 88],
      ['Sales', 'Inside Sales', 28, 65000, 18.5, 3.5, 1.9, 76],
      ['Sales', 'Enterprise', 14, 85000, 10.7, 3.9, 3.6, 81],
      ['Marketing', 'Growth', 11, 75000, 11.1, 4.0, 2.7, 83],
      ['Marketing', 'Content', 8, 68000, 13.5, 3.7, 2.1, 79],
      ['Finance', 'FP&A', 6, 95000, 4.0, 4.7, 6.2, 92],
      ['HR', 'People Ops', 5, 72000, 6.0, 4.5, 3.9, 86],
    ]
  }
};

// ---- Chart colors ----
const CHART_COLORS = [
  '#3b82f6', '#06b6d4', '#a855f7', '#10b981',
  '#f59e0b', '#ef4444', '#ec4899', '#8b5cf6',
  '#14b8a6', '#f97316', '#6366f1', '#84cc16'
];

// ---- Utility Functions ----
function isNumeric(val) {
  if (val === null || val === undefined || val === '') return false;
  return !isNaN(parseFloat(val)) && isFinite(val);
}
function getNumericCols() {
  return state.headers.filter(h =>
    state.data.some(row => isNumeric(row[h]))
  );
}
function getCategoricalCols() {
  return state.headers.filter(h =>
    !state.data.every(row => isNumeric(row[h]))
  );
}
function avg(arr) { return arr.reduce((a, b) => a + b, 0) / arr.length; }
function sum(arr) { return arr.reduce((a, b) => a + b, 0); }
function formatNum(n) {
  if (n === null || n === undefined || isNaN(n)) return 'N/A';
  if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M';
  if (Math.abs(n) >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return parseFloat(n.toFixed(2)).toString();
}

// ---- Toast ----
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const icons = {
    success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️'
  };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || '•'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'toastOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ---- Loading ----
function setLoading(show) {
  document.getElementById('loadingOverlay').classList.toggle('hidden', !show);
}

// ---- Navigation ----
function navigateTo(page) {
  state.currentPage = page;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById(`page-${page}`).classList.add('active');
  document.getElementById(`nav-${page}`)?.classList.add('active');

  const titles = {
    dashboard: ['Dashboard', state.fileName || 'Upload data to get started'],
    query: ['AI Query', 'Ask natural language questions about your data'],
    data: ['Data View', state.fileName || 'No data loaded'],
    charts: ['Chart Builder', 'Build custom visualizations']
  };
  document.getElementById('pageTitle').textContent = titles[page][0];
  document.getElementById('pageSubtitle').textContent = titles[page][1];
}

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', e => {
    e.preventDefault();
    navigateTo(item.dataset.page);
  });
});

// ---- Sidebar toggle ----
document.getElementById('sidebarToggle').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('collapsed');
});

// ---- File Upload ----
function handleFile(file) {
  if (!file) return;
  const ext = file.name.split('.').pop().toLowerCase();
  setLoading(true);

  if (ext === 'csv') {
    Papa.parse(file, {
      header: true, skipEmptyLines: true, dynamicTyping: true,
      complete: result => {
        setLoading(false);
        loadData(result.data, result.meta.fields, file.name);
      },
      error: () => { setLoading(false); showToast('Failed to parse CSV', 'error'); }
    });
  } else if (['xlsx', 'xls'].includes(ext)) {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(ws, { defval: '' });
        setLoading(false);
        const headers = json.length > 0 ? Object.keys(json[0]) : [];
        loadData(json, headers, file.name);
      } catch {
        setLoading(false);
        showToast('Failed to parse Excel file', 'error');
      }
    };
    reader.readAsArrayBuffer(file);
  } else {
    setLoading(false);
    showToast('Unsupported file type. Use CSV or Excel.', 'error');
  }
}

['fileInput', 'fileInputMini'].forEach(id => {
  document.getElementById(id)?.addEventListener('change', e => {
    if (e.target.files[0]) handleFile(e.target.files[0]);
  });
});

// Drag and drop
const uploadZone = document.getElementById('uploadZone');
uploadZone.addEventListener('dragover', e => {
  e.preventDefault(); uploadZone.querySelector('.upload-zone-inner').classList.add('drag-over');
});
['dragleave', 'dragend'].forEach(ev => {
  uploadZone.addEventListener(ev, () => uploadZone.querySelector('.upload-zone-inner').classList.remove('drag-over'));
});
uploadZone.addEventListener('drop', e => {
  e.preventDefault();
  uploadZone.querySelector('.upload-zone-inner').classList.remove('drag-over');
  if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
});

// ---- Sample Data ----
document.querySelectorAll('.sample-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const sample = SAMPLE_DATA[btn.dataset.sample];
    if (!sample) return;
    const rows = sample.rows.map(r => {
      const obj = {};
      sample.headers.forEach((h, i) => obj[h] = r[i]);
      return obj;
    });
    loadData(rows, sample.headers, sample.name + '.csv');
    showToast(`Loaded sample: ${sample.name}`, 'success');
  });
});

// ---- Load Data ----
function loadData(rows, headers, name) {
  state.data = rows;
  state.headers = headers;
  state.fileName = name;

  // Update status
  const dot = document.querySelector('.status-dot');
  const statusText = document.querySelector('.sidebar-status span');
  dot.classList.add('active');
  statusText.textContent = `${rows.length} rows loaded`;
  document.getElementById('dataStatus').title = name;

  document.getElementById('uploadZone').classList.add('hidden');
  document.getElementById('dashboardContent').classList.remove('hidden');

  renderKPIs();
  renderDashboardCharts();
  generateAIInsight();
  renderTable();
  populateChartBuilder();
  navigateTo('dashboard');

  showToast(`Loaded "${name}" — ${rows.length} rows`, 'success');
}

// ---- KPIs ----
function renderKPIs() {
  const numCols = getNumericCols().slice(0, 4);
  const kpiRow = document.getElementById('kpiRow');
  const gradients = ['var(--grad-primary)', 'var(--grad-purple)', 'var(--grad-green)',
                     'linear-gradient(135deg, #f59e0b, #ef4444)'];
  kpiRow.innerHTML = '';

  numCols.forEach((col, i) => {
    const vals = state.data.map(r => parseFloat(r[col])).filter(v => !isNaN(v));
    if (!vals.length) return;
    const total = sum(vals);
    const avg_ = avg(vals);
    const isAvgBetter = total > 999;
    const displayVal = isAvgBetter ? total : avg_;
    const displayLabel = isAvgBetter ? `Total ${col}` : `Avg ${col}`;
    const change = ((Math.random() - 0.3) * 20).toFixed(1); // simulated change

    const card = document.createElement('div');
    card.className = 'kpi-card';
    card.style.setProperty('--grad', gradients[i % gradients.length]);
    card.innerHTML = `
      <div class="kpi-label">${displayLabel}</div>
      <div class="kpi-value" style="background:${gradients[i % gradients.length]};-webkit-background-clip:text;-webkit-text-fill-color:transparent">
        ${formatNum(displayVal)}
      </div>
      <div class="kpi-change ${change >= 0 ? 'up' : 'down'}">
        ${change >= 0 ? '▲' : '▼'} ${Math.abs(change)}% vs last period
      </div>
    `;
    kpiRow.appendChild(card);
  });

  // Row count card
  const countCard = document.createElement('div');
  countCard.className = 'kpi-card';
  countCard.style.setProperty('--grad', 'linear-gradient(135deg, #64748b, #94a3b8)');
  countCard.innerHTML = `
    <div class="kpi-label">Total Records</div>
    <div class="kpi-value" style="color:var(--text-primary)">${state.data.length.toLocaleString()}</div>
    <div class="kpi-change" style="color:var(--text-muted)">${state.headers.length} columns</div>
  `;
  kpiRow.appendChild(countCard);
}

// ---- Dashboard Charts ----
let primaryChartObj = null;
let secondaryChartObj = null;

function renderDashboardCharts() {
  const numCols = getNumericCols();
  const catCols = getCategoricalCols();

  if (!numCols.length) return;

  const labelCol = catCols[0] || state.headers[0];
  const valueCol = numCols[0];

  // Aggregate by label
  const agg = {};
  state.data.forEach(row => {
    const label = String(row[labelCol] || 'Unknown');
    const val = parseFloat(row[valueCol]) || 0;
    agg[label] = (agg[label] || 0) + val;
  });

  const topEntries = Object.entries(agg).sort((a, b) => b[1] - a[1]).slice(0, 12);
  const labels = topEntries.map(e => e[0]);
  const values = topEntries.map(e => e[1]);

  document.getElementById('primaryChartTitle').textContent = `${valueCol} by ${labelCol}`;

  if (primaryChartObj) primaryChartObj.destroy();
  const ctx = document.getElementById('primaryChart').getContext('2d');
  primaryChartObj = new Chart(ctx, buildChartConfig(state.primaryChartType, labels, values, `${valueCol}`, CHART_COLORS));

  // Secondary chart — distribution of second numeric col
  const valueCol2 = numCols[1] || numCols[0];
  const agg2 = {};
  state.data.forEach(row => {
    const label = String(row[labelCol] || 'Unknown');
    const val = parseFloat(row[valueCol2]) || 0;
    agg2[label] = (agg2[label] || 0) + val;
  });
  const entries2 = Object.entries(agg2).slice(0, 8);
  const labels2 = entries2.map(e => e[0]);
  const values2 = entries2.map(e => e[1]);
  document.getElementById('secondaryChartTitle').textContent = `${valueCol2} Distribution`;

  if (secondaryChartObj) secondaryChartObj.destroy();
  const ctx2 = document.getElementById('secondaryChart').getContext('2d');
  secondaryChartObj = new Chart(ctx2, buildChartConfig('doughnut', labels2, values2, valueCol2, CHART_COLORS));
}

// Chart type tabs
document.querySelectorAll('.chart-type-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.chart-type-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    state.primaryChartType = tab.dataset.type;
    if (state.data.length) renderDashboardCharts();
  });
});

// ---- AI Insight ----
const INSIGHTS = {
  generic: [
    () => {
      const numCols = getNumericCols();
      if (!numCols.length) return 'Upload numeric data to generate insights.';
      const col = numCols[0];
      const vals = state.data.map(r => parseFloat(r[col])).filter(v => !isNaN(v));
      const maxVal = Math.max(...vals);
      const minVal = Math.min(...vals);
      const spread = ((maxVal - minVal) / avg(vals) * 100).toFixed(1);
      return `<strong>${col}</strong> ranges from <strong>${formatNum(minVal)}</strong> to <strong>${formatNum(maxVal)}</strong>, a ${spread}% spread. Consider investigating the top performers to replicate their success.`;
    },
    () => {
      const numCols = getNumericCols();
      if (numCols.length < 2) return 'Add more numeric columns for correlation insights.';
      const col1 = numCols[0], col2 = numCols[1];
      const vals1 = state.data.map(r => parseFloat(r[col1])).filter(v => !isNaN(v));
      const vals2 = state.data.map(r => parseFloat(r[col2])).filter(v => !isNaN(v));
      const corr = computeCorr(vals1, vals2).toFixed(2);
      const strength = Math.abs(corr) > 0.7 ? 'strong' : Math.abs(corr) > 0.4 ? 'moderate' : 'weak';
      const dir = corr > 0 ? 'positive' : 'negative';
      return `There is a <strong>${strength} ${dir} correlation (r=${corr})</strong> between <strong>${col1}</strong> and <strong>${col2}</strong>.`;
    },
    () => {
      const numCols = getNumericCols();
      if (!numCols.length) return 'No numeric data found.';
      const col = numCols[Math.floor(Math.random() * numCols.length)];
      const vals = state.data.map(r => parseFloat(r[col])).filter(v => !isNaN(v));
      const mean = avg(vals);
      const std = Math.sqrt(vals.reduce((s, v) => s + (v - mean) ** 2, 0) / vals.length);
      const outliers = vals.filter(v => Math.abs(v - mean) > 2 * std).length;
      return `Detected <strong>${outliers} potential outlier${outliers !== 1 ? 's' : ''}</strong> in <strong>${col}</strong> (values beyond 2σ from mean of ${formatNum(mean)}).`;
    }
  ]
};

function computeCorr(a, b) {
  const n = Math.min(a.length, b.length);
  if (n === 0) return 0;
  const meanA = avg(a.slice(0, n)), meanB = avg(b.slice(0, n));
  let num = 0, dA = 0, dB = 0;
  for (let i = 0; i < n; i++) {
    num += (a[i] - meanA) * (b[i] - meanB);
    dA += (a[i] - meanA) ** 2;
    dB += (b[i] - meanB) ** 2;
  }
  return dA && dB ? num / Math.sqrt(dA * dB) : 0;
}

function generateAIInsight() {
  const fns = INSIGHTS.generic;
  const fn = fns[Math.floor(Math.random() * fns.length)];
  document.getElementById('aiInsightText').innerHTML = fn();
}
document.getElementById('refreshInsightBtn')?.addEventListener('click', generateAIInsight);

// ---- Data Table ----
function renderTable(filter = '') {
  const container = document.getElementById('tableContainer');
  if (!state.data.length) {
    container.innerHTML = '<div class="empty-state">Upload a file to view data</div>';
    return;
  }

  const lf = filter.toLowerCase();
  const filtered = filter
    ? state.data.filter(row => Object.values(row).some(v => String(v).toLowerCase().includes(lf)))
    : state.data;

  document.getElementById('dataInfo').textContent = `${filtered.length} of ${state.data.length} rows · ${state.headers.length} columns`;

  const numCols = new Set(getNumericCols());
  const rows = filtered.slice(0, 500); // cap at 500 for performance

  container.innerHTML = `
    <table class="data-table">
      <thead><tr>${state.headers.map(h => `<th title="${h}">${h}</th>`).join('')}</tr></thead>
      <tbody>
        ${rows.map(row =>
          `<tr>${state.headers.map(h =>
            `<td class="${numCols.has(h) ? 'numeric' : ''}" title="${row[h] ?? ''}">${row[h] ?? ''}</td>`
          ).join('')}</tr>`
        ).join('')}
      </tbody>
    </table>
  `;
}

document.getElementById('tableSearch').addEventListener('input', e => renderTable(e.target.value));

// ---- Export CSV ----
document.getElementById('exportCsvBtn').addEventListener('click', () => {
  if (!state.data.length) { showToast('No data to export', 'error'); return; }
  const csv = Papa.unparse({ fields: state.headers, data: state.data.map(r => state.headers.map(h => r[h])) });
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = state.fileName || 'export.csv';
  a.click(); URL.revokeObjectURL(url);
  showToast('Exported to CSV', 'success');
});

// ---- Chart Builder ----
function populateChartBuilder() {
  const selects = ['xAxisSelect', 'yAxisSelect'];
  selects.forEach(id => {
    const sel = document.getElementById(id);
    sel.innerHTML = state.headers.map(h => `<option value="${h}">${h}</option>`).join('');
  });
  const numCols = getNumericCols();
  const catCols = getCategoricalCols();
  if (catCols.length) document.getElementById('xAxisSelect').value = catCols[0];
  if (numCols.length) document.getElementById('yAxisSelect').value = numCols[0];
}

document.querySelectorAll('#builderChartTypeSelector .chart-type-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('#builderChartTypeSelector .chart-type-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    state.builderChartType = pill.dataset.type;
  });
});

document.getElementById('buildChartBtn').addEventListener('click', () => {
  if (!state.data.length) { showToast('Load data first', 'error'); return; }
  const xCol = document.getElementById('xAxisSelect').value;
  const yCol = document.getElementById('yAxisSelect').value;
  const limitRaw = document.getElementById('rowLimitSelect').value;
  const limit = limitRaw === 'all' ? state.data.length : parseInt(limitRaw);

  const agg = {};
  state.data.slice(0, limit).forEach(row => {
    const label = String(row[xCol] ?? 'N/A');
    const val = parseFloat(row[yCol]) || 0;
    agg[label] = (agg[label] || 0) + val;
  });

  const entries = Object.entries(agg).sort((a, b) => b[1] - a[1]).slice(0, 50);
  const labels = entries.map(e => e[0]);
  const values = entries.map(e => e[1]);

  document.getElementById('builderChartTitle').textContent = `${yCol} by ${xCol}`;

  if (state.builderChart) state.builderChart.destroy();
  const ctx = document.getElementById('builderChart').getContext('2d');
  state.builderChart = new Chart(ctx, buildChartConfig(state.builderChartType, labels, values, yCol, CHART_COLORS));
  showToast('Chart generated!', 'success');
});

// ---- Build Chart Config ----
function buildChartConfig(type, labels, values, label, colors) {
  const isPie = ['pie', 'doughnut'].includes(type);
  const baseConfig = {
    type,
    data: {
      labels,
      datasets: [{
        label,
        data: values,
        backgroundColor: isPie
          ? colors.slice(0, values.length).map(c => c + 'cc')
          : colors[0] + 'cc',
        borderColor: isPie
          ? colors.slice(0, values.length)
          : colors[0],
        borderWidth: isPie ? 2 : 2,
        borderRadius: type === 'bar' ? 6 : 0,
        fill: type === 'line',
        tension: 0.4,
        pointBackgroundColor: colors[0],
        pointRadius: type === 'line' ? 4 : 0,
        pointHoverRadius: 6,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 600, easing: 'easeInOutQuart' },
      plugins: {
        legend: {
          display: isPie,
          position: 'bottom',
          labels: { color: '#94a3b8', padding: 16, font: { size: 11 } }
        },
        tooltip: {
          backgroundColor: '#111827',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          titleColor: '#f0f4ff',
          bodyColor: '#94a3b8',
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: ctx => ` ${formatNum(ctx.raw)}`
          }
        }
      },
      scales: isPie ? {} : {
        x: {
          ticks: { color: '#4b5563', font: { size: 11 }, maxRotation: 45 },
          grid: { color: 'rgba(255,255,255,0.03)' }
        },
        y: {
          ticks: { color: '#4b5563', font: { size: 11 }, callback: v => formatNum(v) },
          grid: { color: 'rgba(255,255,255,0.05)' },
          beginAtZero: true
        }
      }
    }
  };

  if (type === 'scatter') {
    baseConfig.data.datasets[0].data = values.map((v, i) => ({ x: i, y: v }));
    baseConfig.data.datasets[0].backgroundColor = colors[0] + '99';
  }
  return baseConfig;
}

// ---- AI Query Engine ----
function processQuery(queryText) {
  if (!state.data.length) {
    return { answer: 'Please upload a data file first to query your data.', chartData: null };
  }

  const q = queryText.toLowerCase().trim();
  const numCols = getNumericCols();
  const catCols = getCategoricalCols();

  // ---- Intent Detection ----
  const intents = {
    isBarChart: /bar chart|bar graph|bar plot/.test(q),
    isLineChart: /line chart|line graph|trend|over time|by month|by week|by day/.test(q),
    isPieChart: /pie chart|pie graph|doughnut|donut|breakdown|proportion|share/.test(q),
    isScatterChart: /scatter|correlation|vs|versus/.test(q),
    isAverage: /average|avg|mean/.test(q),
    isTotal: /total|sum|aggregate/.test(q),
    isMax: /max|highest|top|best|most/.test(q),
    isMin: /min|lowest|bottom|worst|least/.test(q),
    isCount: /count|how many|number of/.test(q),
    isDistribution: /distribution|spread|range/.test(q),
    isCompare: /compare|comparison|vs|versus|against/.test(q),
    isTop: /top (\d+)/.exec(q),
    isBottom: /bottom (\d+)|lowest (\d+)|worst (\d+)/.exec(q),
  };

  // Find columns mentioned in query
  function findMentionedCol(source) {
    return source.find(col => q.includes(col.toLowerCase()));
  }
  const mentionedNumCol = findMentionedCol(numCols);
  const mentionedCatCol = findMentionedCol(catCols);

  const numCol = mentionedNumCol || numCols[0];
  const catCol = mentionedCatCol || catCols[0] || state.headers[0];
  const vals = state.data.map(r => parseFloat(r[numCol])).filter(v => !isNaN(v));

  // ---- Top/Bottom N ----
  if (intents.isTop || intents.isBottom) {
    const isTop = !!intents.isTop;
    const match = isTop ? intents.isTop : intents.isBottom;
    const n = parseInt(match[1] || match[2] || match[3]) || 3;

    // Aggregate by catCol
    const agg = {};
    state.data.forEach(row => {
      const label = String(row[catCol] ?? 'Unknown');
      const val = parseFloat(row[numCol]) || 0;
      agg[label] = (agg[label] || 0) + val;
    });
    const sorted = Object.entries(agg).sort((a, b) => isTop ? b[1] - a[1] : a[1] - b[1]).slice(0, n);
    const rankedLabels = sorted.map(e => e[0]);
    const rankedValues = sorted.map(e => e[1]);

    const direction = isTop ? 'highest' : 'lowest';
    const listItems = sorted.map((e, i) => `<strong>${i+1}. ${e[0]}</strong>: ${formatNum(e[1])}`).join(' &nbsp;|&nbsp; ');
    const answer = `The ${n} ${direction} values for <strong>${numCol}</strong> by <strong>${catCol}</strong>: ${listItems}.`;

    return {
      answer,
      chartData: { type: 'bar', labels: rankedLabels, values: rankedValues, label: numCol }
    };
  }

  // ---- Average ----
  if (intents.isAverage) {
    if (numCols.length) {
      const colsToAvg = mentionedNumCol ? [mentionedNumCol] : numCols.slice(0, 3);
      const lines = colsToAvg.map(c => {
        const vs = state.data.map(r => parseFloat(r[c])).filter(v => !isNaN(v));
        return `<strong>${c}</strong>: ${formatNum(avg(vs))}`;
      });
      return {
        answer: `Average values — ${lines.join(' &nbsp;|&nbsp; ')}.`,
        chartData: { type: 'bar', labels: colsToAvg, values: colsToAvg.map(c => {
          const vs = state.data.map(r => parseFloat(r[c])).filter(v => !isNaN(v));
          return avg(vs);
        }), label: 'Average' }
      };
    }
  }

  // ---- Total / Sum ----
  if (intents.isTotal) {
    const agg = {};
    state.data.forEach(row => {
      const label = String(row[catCol] ?? 'Unknown');
      const val = parseFloat(row[numCol]) || 0;
      agg[label] = (agg[label] || 0) + val;
    });
    const entries = Object.entries(agg).sort((a, b) => b[1] - a[1]);
    const totalAll = sum(vals);
    return {
      answer: `Total <strong>${numCol}</strong> across all records: <strong>${formatNum(totalAll)}</strong>. Grouped by ${catCol}, the top contributor is <strong>${entries[0]?.[0]}</strong> with ${formatNum(entries[0]?.[1])}.`,
      chartData: { type: 'bar', labels: entries.slice(0, 10).map(e => e[0]), values: entries.slice(0, 10).map(e => e[1]), label: `Total ${numCol}` }
    };
  }

  // ---- Max ----
  if (intents.isMax && !intents.isTop) {
    const maxVal = Math.max(...vals);
    const maxRow = state.data.find(r => parseFloat(r[numCol]) === maxVal);
    const agg = {}; state.data.forEach(row => { const l = String(row[catCol]??''); const v = parseFloat(row[numCol])||0; agg[l]=(agg[l]||0)+v; });
    const ents = Object.entries(agg).sort((a,b)=>b[1]-a[1]).slice(0,8);
    return {
      answer: `The highest <strong>${numCol}</strong> is <strong>${formatNum(maxVal)}</strong>${maxRow ? ` (${catCol}: ${maxRow[catCol]})` : ''}.`,
      chartData: { type: 'bar', labels: ents.map(e=>e[0]), values: ents.map(e=>e[1]), label: numCol }
    };
  }

  // ---- Min ----
  if (intents.isMin && !intents.isBottom) {
    const minVal = Math.min(...vals);
    const minRow = state.data.find(r => parseFloat(r[numCol]) === minVal);
    const agg = {}; state.data.forEach(row => { const l = String(row[catCol]??''); const v = parseFloat(row[numCol])||0; agg[l]=(agg[l]||0)+v; });
    const ents = Object.entries(agg).sort((a,b)=>a[1]-b[1]).slice(0,8);
    return {
      answer: `The lowest <strong>${numCol}</strong> is <strong>${formatNum(minVal)}</strong>${minRow ? ` (${catCol}: ${minRow[catCol]})` : ''}.`,
      chartData: { type: 'bar', labels: ents.map(e=>e[0]), values: ents.map(e=>e[1]), label: numCol }
    };
  }

  // ---- Count ----
  if (intents.isCount) {
    const agg = {};
    state.data.forEach(row => {
      const label = String(row[catCol] ?? 'Unknown');
      agg[label] = (agg[label] || 0) + 1;
    });
    const entries = Object.entries(agg).sort((a, b) => b[1] - a[1]);
    return {
      answer: `There are <strong>${state.data.length}</strong> total records. By <strong>${catCol}</strong>: ${entries.slice(0,5).map(e=>`<strong>${e[0]}</strong> (${e[1]})`).join(', ')}.`,
      chartData: { type: 'pie', labels: entries.slice(0,8).map(e=>e[0]), values: entries.slice(0,8).map(e=>e[1]), label: 'Count' }
    };
  }

  // ---- Pie Chart ----
  if (intents.isPieChart) {
    const agg = {};
    state.data.forEach(row => {
      const label = String(row[catCol] ?? 'Unknown');
      const val = parseFloat(row[numCol]) || 0;
      agg[label] = (agg[label] || 0) + val;
    });
    const entries = Object.entries(agg).sort((a, b) => b[1] - a[1]).slice(0, 8);
    return {
      answer: `Here's a pie chart showing the distribution of <strong>${numCol}</strong> by <strong>${catCol}</strong>.`,
      chartData: { type: 'pie', labels: entries.map(e=>e[0]), values: entries.map(e=>e[1]), label: numCol }
    };
  }

  // ---- Line Chart ----
  if (intents.isLineChart) {
    const agg = {};
    state.data.forEach(row => {
      const label = String(row[catCol] ?? 'Unknown');
      const val = parseFloat(row[numCol]) || 0;
      agg[label] = (agg[label] || 0) + val;
    });
    const entries = Object.entries(agg);
    return {
      answer: `Here's a line chart showing <strong>${numCol}</strong> trend across <strong>${catCol}</strong>.`,
      chartData: { type: 'line', labels: entries.map(e=>e[0]), values: entries.map(e=>e[1]), label: numCol }
    };
  }

  // ---- Bar Chart / Default ----
  const agg = {};
  state.data.forEach(row => {
    const label = String(row[catCol] ?? 'Unknown');
    const val = parseFloat(row[numCol]) || 0;
    agg[label] = (agg[label] || 0) + val;
  });
  const entries = Object.entries(agg).sort((a, b) => b[1] - a[1]).slice(0, 10);
  return {
    answer: `Here's a breakdown of <strong>${numCol}</strong> by <strong>${catCol}</strong>. The leading value is <strong>${entries[0]?.[0]}</strong> at ${formatNum(entries[0]?.[1])}.`,
    chartData: { type: intents.isBarChart ? 'bar' : 'bar', labels: entries.map(e=>e[0]), values: entries.map(e=>e[1]), label: numCol }
  };
}

// ---- Render Query Result ----
function renderQueryResult(query, result) {
  const container = document.getElementById('queryResults');
  const card = document.createElement('div');
  card.className = 'result-card';

  const chartId = `resultChart_${Date.now()}`;
  card.innerHTML = `
    <div class="result-query-bar">
      <span class="result-query-label">Query</span>
      <span class="result-query-text">${query}</span>
    </div>
    <div class="result-body">
      <div class="result-answer">🤖 ${result.answer}</div>
      ${result.chartData ? `<div class="result-chart-wrap"><canvas id="${chartId}"></canvas></div>` : ''}
    </div>
  `;

  container.insertBefore(card, container.firstChild);

  if (result.chartData) {
    const { type, labels, values, label } = result.chartData;
    setTimeout(() => {
      const ctx = document.getElementById(chartId);
      if (ctx) new Chart(ctx.getContext('2d'), buildChartConfig(type, labels, values, label, CHART_COLORS));
    }, 50);
  }
}

// ---- Query Submission ----
function submitQuery(queryText) {
  const q = queryText.trim();
  if (!q) return;

  // Add to history
  state.queryHistory.unshift(q);
  const histList = document.getElementById('queryHistoryList');
  const emptyHistory = histList.querySelector('.empty-history');
  if (emptyHistory) emptyHistory.remove();

  const histItem = document.createElement('div');
  histItem.className = 'history-item';
  histItem.textContent = q;
  histItem.title = q;
  histItem.addEventListener('click', () => {
    document.getElementById('queryInput').value = q;
    submitQuery(q);
  });
  histList.insertBefore(histItem, histList.firstChild);

  // Process & render result
  const result = processQuery(q);
  renderQueryResult(q, result);

  // Clear input
  document.getElementById('queryInput').value = '';
  document.getElementById('topbarInput').value = '';
}

document.getElementById('querySubmitBtn').addEventListener('click', () => {
  submitQuery(document.getElementById('queryInput').value);
});
document.getElementById('queryInput').addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    submitQuery(document.getElementById('queryInput').value);
  }
});

document.querySelectorAll('.suggestion-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    const q = chip.dataset.query;
    document.getElementById('queryInput').value = q;
    navigateTo('query');
    submitQuery(q);
  });
});

// Topbar query
document.getElementById('topbarAskBtn').addEventListener('click', () => {
  const q = document.getElementById('topbarInput').value.trim();
  if (!q) return;
  navigateTo('query');
  submitQuery(q);
});
document.getElementById('topbarInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const q = e.target.value.trim();
    if (!q) return;
    navigateTo('query');
    submitQuery(q);
  }
});

// ---- Init ----
navigateTo('dashboard');
