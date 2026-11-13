/**
 * statements.js — หน้าประวัติการเงิน
 * - แสดง statement ทั้งหมด พร้อม filter
 * - กรองตามประเภท (member / ค่าย / ทั้งหมด)
 * - กรองตาม member รายคน
 * - กรองตามช่วงวันที่
 * - แสดงยอดรวมเงินเข้า/ออก
 */

// แปลง LocalDate จาก Spring Boot (อาจเป็น array [y,m,d] หรือ string) → Date object
// ประกาศซ้ำที่นี่เพื่อป้องกัน "toDate is not a function" กรณี api.js โหลดไม่ทัน
if (typeof toDate === 'undefined') {
  window.toDate = function(dateVal) {
    if (!dateVal) return new Date(0);
    if (Array.isArray(dateVal)) return new Date(dateVal[0], dateVal[1] - 1, dateVal[2]);
    return new Date(dateVal);
  };
}



function renderStatementsPage() {
  const container = document.getElementById('page-statements');
  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">
        <span class="title-icon">📊</span>
        ประวัติการเงิน
      </h1>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon green">⬆️</div>
        <div class="stat-info">
          <div class="stat-label">เงินเข้ารวม</div>
          <div class="stat-value" id="stmt-stat-in">—</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon red">⬇️</div>
        <div class="stat-info">
          <div class="stat-label">เงินออกรวม</div>
          <div class="stat-value" id="stmt-stat-out">—</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon purple">🔢</div>
        <div class="stat-info">
          <div class="stat-label">จำนวนรายการ</div>
          <div class="stat-value" id="stmt-stat-count">—</div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-bar">
      <div class="form-group" style="flex:1.5; min-width:160px;">
        <label class="form-label">ประเภท</label>
        <select class="form-control" id="filter-stmt-type">
          <option value="all">ทั้งหมด</option>
          <option value="member">ของสมาชิก</option>
          <option value="company">ของค่าย</option>
        </select>
      </div>
      <div class="form-group" style="flex:2; min-width:160px;">
        <label class="form-label">สมาชิก</label>
        <select class="form-control" id="filter-stmt-member">
          <option value="">— ทั้งหมด —</option>
        </select>
      </div>
      <div class="form-group" style="flex:1.5; min-width:130px;">
        <label class="form-label">ตั้งแต่วันที่</label>
        <input type="date" class="form-control" id="filter-stmt-from" />
      </div>
      <div class="form-group" style="flex:1.5; min-width:130px;">
        <label class="form-label">ถึงวันที่</label>
        <input type="date" class="form-control" id="filter-stmt-to" />
      </div>
      <button class="btn btn-primary" id="btn-apply-stmt-filter" style="margin-top:24px;">🔍 กรอง</button>
      <button class="btn btn-outline" id="btn-reset-stmt-filter" style="margin-top:24px;">↺ รีเซ็ต</button>
    </div>

    <!-- Table -->
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>วันที่</th>
            <th>ประเภท</th>
            <th>หมายเหตุ</th>
            <th class="text-right">จำนวนเงิน</th>
          </tr>
        </thead>
        <tbody id="statements-tbody">
          <tr class="loading-row"><td colspan="5"><span class="spinner"></span> กำลังโหลด...</td></tr>
        </tbody>
      </table>
    </div>
  `;

  bindStatementsEvents();
}

// เก็บ statements ทั้งหมดไว้ใน memory สำหรับ filter ฝั่ง client
let allStatements = [];

async function loadStatements() {
  const tbody = document.getElementById('statements-tbody');
  try {
    allStatements = await fetchAPI(API.statements.getAll());

    // โหลด member list สำหรับ filter dropdown
    await loadMembersForStmtFilter();

    applyStatementsFilter();
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:var(--danger); padding:30px;">${err.message}</td></tr>`;
  }
}

async function loadMembersForStmtFilter() {
  const select = document.getElementById('filter-stmt-member');
  try {
    const members = await fetchAPI(API.members.getAll());
    select.innerHTML = '<option value="">— ทั้งหมด —</option>' +
      members.map(m => `<option value="${m.memberId}">${m.name}</option>`).join('');
  } catch (_) {}
}

function applyStatementsFilter() {
  const type     = document.getElementById('filter-stmt-type').value;
  const memberId = document.getElementById('filter-stmt-member').value;
  const fromDate  = document.getElementById('filter-stmt-from').value;
  const toDateStr = document.getElementById('filter-stmt-to').value;

  let filtered = [...allStatements];

  // กรองตามประเภท — ใช้ remark แทน เพราะ Backend ไม่ส่ง member object มา
  const isCompanyRemark = s => s.remark && s.remark.includes('ค่าย');
  if (type === 'member') {
    filtered = filtered.filter(s => !isCompanyRemark(s));
  } else if (type === 'company') {
    filtered = filtered.filter(s => isCompanyRemark(s));
  }

  // กรองตาม member — ดึงชื่อจาก remark เพราะไม่มี member object
  if (memberId) {
    // หา member name จาก dropdown ที่เลือก
    const selectedOption = document.getElementById('filter-stmt-member').selectedOptions[0];
    const selectedName = selectedOption ? selectedOption.text : '';
    filtered = filtered.filter(s => {
      if (!s.remark || isCompanyRemark(s)) return false;
      const parts = s.remark.split(': ');
      const nameInRemark = parts.length > 1 ? parts[parts.length - 1] : '';
      return nameInRemark === selectedName;
    });
  }

  // กรองตามวันที่
  if (fromDate)  filtered = filtered.filter(s => s.statementDate >= fromDate);
  if (toDateStr) filtered = filtered.filter(s => s.statementDate <= toDateStr);

  // เรียงจากใหม่สุด (ใช้ toDate เพื่อรองรับ array date จาก Spring Boot)
  filtered.sort((a, b) => toDate(b.statementDate) - toDate(a.statementDate));

  // คำนวณ stats ของ filtered
  const totalIn  = filtered.filter(s => s.amount > 0).reduce((sum, s) => sum + s.amount, 0);
  const totalOut = filtered.filter(s => s.amount < 0).reduce((sum, s) => sum + Math.abs(s.amount), 0);

  document.getElementById('stmt-stat-in').textContent    = formatCurrency(totalIn);
  document.getElementById('stmt-stat-out').textContent   = formatCurrency(totalOut);
  document.getElementById('stmt-stat-count').textContent = filtered.length + ' รายการ';

  renderStatementsTable(filtered);
}

function renderStatementsTable(statements) {
  const tbody = document.getElementById('statements-tbody');

  if (statements.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><div class="empty-icon">📊</div><p>ไม่พบรายการที่ตรงกับเงื่อนไข</p></div></td></tr>`;
    return;
  }

  // statements ถูก sort จากใหม่→เก่าแล้ว ลำดับเลขควรเริ่มจาก 1 ตามลำดับที่แสดง
  tbody.innerHTML = statements.map((s, i) => {
    const isPositive = s.amount >= 0;

    // Backend ไม่ส่ง member object กลับมา (เพราะ @JsonBackReference)
    // แยกประเภทจาก remark แทน:
    // - มีคำว่า "ค่าย" → 🏢 ค่าย
    // - ไม่มี → 👤 สมาชิก โดยดึงชื่อจากท้าย remark หลัง ": "
    const isCompany = s.remark && s.remark.includes('ค่าย');
    let memberLabel;
    if (isCompany) {
      memberLabel = `<span class="badge" style="background:rgba(30,42,74,0.1); color:var(--navy);">🏢 ค่าย</span>`;
    } else {
      const parts = s.remark ? s.remark.split(': ') : [];
      const memberName = parts.length > 1 ? parts[parts.length - 1] : 'สมาชิก';
      memberLabel = `<span class="badge badge-purple">👤 ${memberName}</span>`;
    }

    return `
      <tr>
        <td class="text-muted">${i + 1}</td>
        <td>${formatDate(s.statementDate)}</td>
        <td>${memberLabel}</td>
        <td>${s.remark || '—'}</td>
        <td class="text-right ${isPositive ? 'amount-positive' : 'amount-negative'}">
          ${isPositive ? '+' : ''}${formatCurrency(s.amount)}
        </td>
      </tr>
    `;
  }).join('');
}

function bindStatementsEvents() {
  document.getElementById('btn-apply-stmt-filter').addEventListener('click', applyStatementsFilter);

  document.getElementById('btn-reset-stmt-filter').addEventListener('click', () => {
    document.getElementById('filter-stmt-type').value   = 'all';
    document.getElementById('filter-stmt-member').value = '';
    document.getElementById('filter-stmt-from').value   = '';
    document.getElementById('filter-stmt-to').value     = '';
    applyStatementsFilter();
  });

  // กรองทันทีเมื่อเปลี่ยน type
  document.getElementById('filter-stmt-type').addEventListener('change', () => {
    // ถ้าเลือก company ให้ clear member filter
    if (document.getElementById('filter-stmt-type').value === 'company') {
      document.getElementById('filter-stmt-member').value = '';
    }
    applyStatementsFilter();
  });
}

function initStatements() {
  renderStatementsPage();
  loadStatements();
}