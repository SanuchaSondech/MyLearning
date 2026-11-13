/**
 * company.js — หน้าข้อมูลบริษัท
 * - แสดงยอดเงินและรายได้สะสม
 * - ปุ่มถอนเงิน
 * - กราฟ 4 แบบ: รายได้ตามเวลา / เปรียบเทียบ member / สัดส่วน VTuber vs Project / วงกลม
 */

// เก็บ chart instances เพื่อ destroy ก่อน re-render
let chartInstances = {};

function renderCompanyPage() {
  const container = document.getElementById('page-company');
  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">
        <span class="title-icon">🏢</span>
        บริษัท
      </h1>
    </div>

    <!-- Company Hero Card -->
    <div class="company-hero" id="company-hero">
      <div class="company-hero-title">ข้อมูลบริษัท</div>
      <div class="company-hero-name" id="company-name">กำลังโหลด...</div>
      <div class="company-hero-stats">
        <div>
          <div class="company-hero-stat-label">💰 ยอดเงินคงเหลือ</div>
          <div class="company-hero-stat-value" id="company-balance">—</div>
        </div>
        <div>
          <div class="company-hero-stat-label">📈 รายได้สะสมทั้งหมด</div>
          <div class="company-hero-stat-value" id="company-total-revenue">—</div>
        </div>
      </div>
      <div style="margin-top:22px;">
        <button class="btn btn-primary" id="btn-company-withdraw" style="background:rgba(255,255,255,0.18); border:1.5px solid rgba(255,255,255,0.35); color:#fff;">
          💸 ถอนเงินออก
        </button>
      </div>
    </div>

    <!-- Charts Grid -->
    <div class="charts-grid">
      <!-- กราฟ 1: รายได้สะสมตามเวลา -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">📈 รายได้ VTuber ตามเวลา</span>
        </div>
        <div class="card-body">
          <div class="chart-container">
            <canvas id="chart-timeline"></canvas>
          </div>
        </div>
      </div>

      <!-- กราฟ 2: เปรียบเทียบรายได้แต่ละ Member -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">👥 รายได้แต่ละ Member</span>
        </div>
        <div class="card-body">
          <div class="chart-container">
            <canvas id="chart-member-compare"></canvas>
          </div>
        </div>
      </div>

      <!-- กราฟ 3: สัดส่วน VTuber vs Project -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">🎯 แหล่งรายได้ VTuber vs Project</span>
        </div>
        <div class="card-body">
          <div class="chart-container">
            <canvas id="chart-source"></canvas>
          </div>
        </div>
      </div>

      <!-- กราฟ 4: สัดส่วน Member vs ค่าย -->
      <div class="card">
        <div class="card-header">
          <span class="card-title">🏢 การแบ่งรายได้ Member vs ค่าย</span>
        </div>
        <div class="card-body">
          <div class="chart-container">
            <canvas id="chart-split"></canvas>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL: ถอนเงิน -->
    <div class="modal-overlay" id="modal-company-withdraw">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">💸 ถอนเงินออกจากค่าย</div>
          <div class="modal-subtitle">ยอดเงินคงเหลือ: <strong id="withdraw-company-balance-display">—</strong></div>
        </div>
        <div class="form-group">
          <label class="form-label">จำนวนที่ต้องการถอน <span class="required">*</span></label>
          <input type="number" class="form-control" id="company-withdraw-amount" placeholder="ระบุจำนวน" min="1" step="0.01" />
        </div>
        <div class="modal-actions">
          <button class="btn btn-outline" id="btn-cancel-company-withdraw">ยกเลิก</button>
          <button class="btn btn-danger" id="btn-confirm-company-withdraw">💸 ยืนยันถอน</button>
        </div>
      </div>
    </div>
  `;

  bindCompanyEvents();
}

// ==================== LOAD DATA ====================
let companyData = null;

async function loadCompanyData() {
  try {
    companyData = await fetchAPI(API.company.info());
    document.getElementById('company-name').textContent          = companyData.groupName;
    document.getElementById('company-balance').textContent       = formatCurrency(companyData.balance);
    document.getElementById('company-total-revenue').textContent = formatCurrency(companyData.totalRevenue);
  } catch (err) {
    document.getElementById('company-name').textContent = 'ไม่พบข้อมูลบริษัท';
    console.error(err);
  }
}

async function loadCharts() {
  try {
    // ดึงข้อมูลคู่ขนาน
    const [vtIncomes, projects, statements] = await Promise.all([
      fetchAPI(API.vtIncome.getAll()),
      fetchAPI(API.projects.getAll()),
      fetchAPI(API.statements.getAll()),
    ]);

    renderTimelineChart(vtIncomes);
    renderMemberCompareChart(vtIncomes);
    renderSourceChart(vtIncomes, projects);
    renderSplitChart(statements);
  } catch (err) {
    console.error('Chart load error:', err);
  }
}

// ==================== CHART 1: รายได้ VTuber ตามเวลา ====================
function renderTimelineChart(vtIncomes) {
  destroyChart('chart-timeline');

  // จัดกลุ่มตามเดือน-ปี
  const monthlyMap = {};
  vtIncomes.forEach(inc => {
    const d = new Date(inc.incomeDate);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    monthlyMap[key] = (monthlyMap[key] || 0) + (inc.vtuberIncome || 0);
  });

  const labels = Object.keys(monthlyMap).sort();
  const values = labels.map(k => monthlyMap[k]);

  const ctx = document.getElementById('chart-timeline').getContext('2d');
  chartInstances['chart-timeline'] = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels.map(formatMonthLabel),
      datasets: [{
        label: 'รายได้รวม (บาท)',
        data: values,
        borderColor: '#7C5CBF',
        backgroundColor: 'rgba(124,92,191,0.10)',
        borderWidth: 2.5,
        pointBackgroundColor: '#7C5CBF',
        pointRadius: 4,
        tension: 0.35,
        fill: true,
      }]
    },
    options: chartDefaults('฿'),
  });
}

// ==================== CHART 2: เปรียบเทียบ Member ====================
function renderMemberCompareChart(vtIncomes) {
  destroyChart('chart-member-compare');

  // จัดกลุ่มตาม member
  const memberMap = {};
  vtIncomes.forEach(inc => {
    const name = inc.member?.name || 'Unknown';
    memberMap[name] = (memberMap[name] || 0) + (inc.vtuberIncome || 0);
  });

  const labels = Object.keys(memberMap);
  const values = Object.values(memberMap);

  if (labels.length === 0) {
    showEmptyChart('chart-member-compare', 'ยังไม่มีข้อมูล');
    return;
  }

  const ctx = document.getElementById('chart-member-compare').getContext('2d');
  chartInstances['chart-member-compare'] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'รายได้ (บาท)',
        data: values,
        backgroundColor: [
          'rgba(124,92,191,0.75)',
          'rgba(30,42,74,0.65)',
          'rgba(61,171,122,0.75)',
          'rgba(232,160,48,0.75)',
          'rgba(74,144,217,0.75)',
          'rgba(224,92,106,0.75)',
        ],
        borderRadius: 6,
      }]
    },
    options: chartDefaults('฿'),
  });
}

// ==================== CHART 3: VTuber vs Project ====================
function renderSourceChart(vtIncomes, projects) {
  destroyChart('chart-source');

  const totalVt      = vtIncomes.reduce((s, i) => s + (i.vtuberIncome || 0), 0);
  const totalProject = projects.reduce((s, p) => s + (p.amountPaid || 0), 0);

  const ctx = document.getElementById('chart-source').getContext('2d');
  chartInstances['chart-source'] = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['รายได้ VTuber (โดเนท)', 'รายได้ Project'],
      datasets: [{
        data: [totalVt, totalProject],
        backgroundColor: ['rgba(124,92,191,0.80)', 'rgba(30,42,74,0.75)'],
        borderWidth: 0,
        hoverOffset: 6,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { font: { family: 'Sarabun', size: 12 }, padding: 14 } },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.label}: ฿${Number(ctx.parsed).toLocaleString('th-TH', {minimumFractionDigits:2})}`
          }
        }
      }
    }
  });
}

// ==================== CHART 4: Member vs ค่าย ====================
function renderSplitChart(statements) {
  destroyChart('chart-split');

  // หาเงินที่เข้า member รวม vs เข้าค่าย
  const memberIn  = statements.filter(s => s.member && s.amount > 0).reduce((a, s) => a + s.amount, 0);
  const companyIn = statements.filter(s => !s.member && s.amount > 0).reduce((a, s) => a + s.amount, 0);

  const ctx = document.getElementById('chart-split').getContext('2d');
  chartInstances['chart-split'] = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Member ได้รับรวม', 'ค่ายได้รับรวม'],
      datasets: [{
        data: [memberIn, companyIn],
        backgroundColor: ['rgba(61,171,122,0.80)', 'rgba(232,160,48,0.80)'],
        borderWidth: 0,
        hoverOffset: 6,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { font: { family: 'Sarabun', size: 12 }, padding: 14 } },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.label}: ฿${Number(ctx.parsed).toLocaleString('th-TH', {minimumFractionDigits:2})}`
          }
        }
      }
    }
  });
}

// ==================== HELPERS ====================
function destroyChart(id) {
  if (chartInstances[id]) {
    chartInstances[id].destroy();
    delete chartInstances[id];
  }
}

function showEmptyChart(id, message) {
  const canvas = document.getElementById(id);
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = '14px Sarabun';
  ctx.fillStyle = '#6B7A9E';
  ctx.textAlign = 'center';
  ctx.fillText(message, canvas.width / 2, canvas.height / 2);
}

function formatMonthLabel(key) {
  const [year, month] = key.split('-');
  const monthNames = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
  return `${monthNames[parseInt(month)-1]} ${parseInt(year)+543}`;
}

function chartDefaults(prefix = '') {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: ctx => ` ${prefix}${Number(ctx.parsed.y ?? ctx.parsed).toLocaleString('th-TH', {minimumFractionDigits:2})}`
        }
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { family: 'Sarabun', size: 11 }, color: '#6B7A9E' }
      },
      y: {
        grid: { color: 'rgba(30,42,74,0.06)' },
        ticks: {
          font: { family: 'Sarabun', size: 11 },
          color: '#6B7A9E',
          callback: v => '฿' + Number(v).toLocaleString('th-TH'),
        }
      }
    }
  };
}

// ==================== MODAL: ถอนเงิน ====================
function openCompanyWithdrawModal() {
  const balance = companyData?.balance || 0;
  document.getElementById('withdraw-company-balance-display').textContent = formatCurrency(balance);
  document.getElementById('company-withdraw-amount').value = '';
  document.getElementById('modal-company-withdraw').classList.add('open');
  document.getElementById('company-withdraw-amount').focus();
}

async function confirmCompanyWithdraw() {
  const amount = parseFloat(document.getElementById('company-withdraw-amount').value);
  if (!amount || amount <= 0) { showToast('กรุณาระบุจำนวนเงิน', 'error'); return; }

  const btn = document.getElementById('btn-confirm-company-withdraw');
  btn.disabled = true; btn.textContent = 'กำลังดำเนินการ...';

  try {
    await fetchAPI(`${API.company.withdraw()}?amount=${amount}`, { method: 'POST' });
    document.getElementById('modal-company-withdraw').classList.remove('open');
    showToast(`💸 ถอนเงิน ${formatCurrency(amount)} เรียบร้อยแล้ว`, 'success');
    await loadCompanyData(); // โหลดยอดใหม่
  } catch (err) {
    showToast('เกิดข้อผิดพลาด: ' + err.message, 'error');
  } finally {
    btn.disabled = false; btn.textContent = '💸 ยืนยันถอน';
  }
}

function bindCompanyEvents() {
  document.getElementById('btn-company-withdraw').addEventListener('click', openCompanyWithdrawModal);
  document.getElementById('btn-cancel-company-withdraw').addEventListener('click', () =>
    document.getElementById('modal-company-withdraw').classList.remove('open')
  );
  document.getElementById('btn-confirm-company-withdraw').addEventListener('click', confirmCompanyWithdraw);
  document.getElementById('modal-company-withdraw').addEventListener('click', function(e) {
    if (e.target === this) this.classList.remove('open');
  });
}

// ==================== INIT ====================
async function initCompany() {
  renderCompanyPage();
  await loadCompanyData();
  await loadCharts();
}
