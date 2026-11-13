/**
 * vtIncome.js — หน้ารายได้ VTuber
 * - บันทึกรายได้โดเนท (60% member / 40% ค่าย)
 * - แสดงประวัติรายได้
 */

function renderVtIncomePage() {
  const container = document.getElementById('page-vtincome');
  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">
        <span class="title-icon">💰</span>
        รายได้ VTuber
      </h1>
      <button class="btn btn-primary" id="btn-record-income">＋ บันทึกรายได้</button>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon gold">💰</div>
        <div class="stat-info">
          <div class="stat-label">รายได้รวมทั้งหมด (ยอดดิบ)</div>
          <div class="stat-value" id="vt-stat-total">—</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green">🎀</div>
        <div class="stat-info">
          <div class="stat-label">ส่วน Member รวม (60%)</div>
          <div class="stat-value" id="vt-stat-member">—</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon purple">🏢</div>
        <div class="stat-info">
          <div class="stat-label">ส่วนค่ายรวม (40%)</div>
          <div class="stat-value" id="vt-stat-company">—</div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>วันที่</th>
            <th>สมาชิก</th>
            <th>รายได้ดิบ</th>
            <th>Member ได้รับ (60%)</th>
            <th>ค่ายได้รับ (40%)</th>
          </tr>
        </thead>
        <tbody id="vtincome-tbody">
          <tr class="loading-row"><td colspan="6"><span class="spinner"></span> กำลังโหลด...</td></tr>
        </tbody>
      </table>
    </div>

    <!-- MODAL: บันทึกรายได้ -->
    <div class="modal-overlay" id="modal-record-income">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">💰 บันทึกรายได้ VTuber</div>
          <div class="modal-subtitle">ระบบจะแบ่ง 60% ให้ Member และ 40% ให้ค่ายโดยอัตโนมัติ</div>
        </div>
        <div class="form-group">
          <label class="form-label">สมาชิก <span class="required">*</span></label>
          <select class="form-control" id="vt-select-member">
            <option value="">— เลือกสมาชิก —</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">ยอดรายได้ (บาท) <span class="required">*</span></label>
          <input type="number" class="form-control" id="vt-income-amount" placeholder="เช่น 5000" min="1" step="0.01" />
          <div class="form-hint">ระบุยอดรวมทั้งหมดที่ได้รับ ระบบจะคำนวณแบ่งให้อัตโนมัติ</div>
        </div>

        <!-- Preview การแบ่ง -->
        <div id="vt-split-preview" style="display:none; background:var(--off-white); border-radius:var(--radius-md); padding:14px 16px; margin-bottom:4px;">
          <div style="font-size:0.82rem; color:var(--navy-light); margin-bottom:8px;">ตัวอย่างการแบ่ง</div>
          <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <span>Member ได้รับ (60%)</span>
            <span class="fw-600 amount-positive" id="preview-member">—</span>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span>ค่ายได้รับ (40%)</span>
            <span class="fw-600" style="color:var(--purple);" id="preview-company">—</span>
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn btn-outline" id="btn-cancel-income">ยกเลิก</button>
          <button class="btn btn-primary" id="btn-confirm-income">✓ บันทึกรายได้</button>
        </div>
      </div>
    </div>
  `;

  bindVtIncomeEvents();
}

async function loadVtIncomes() {
  const tbody = document.getElementById('vtincome-tbody');
  try {
    const incomes = await fetchAPI(API.vtIncome.getAll());

    // คำนวณ stats
    const totalRaw     = incomes.reduce((s, i) => s + (i.vtuberIncome || 0), 0);
    const totalMember  = incomes.reduce((s, i) => s + (i.netIncome || 0), 0);
    const totalCompany = totalRaw - totalMember;

    document.getElementById('vt-stat-total').textContent   = formatCurrency(totalRaw);
    document.getElementById('vt-stat-member').textContent  = formatCurrency(totalMember);
    document.getElementById('vt-stat-company').textContent = formatCurrency(totalCompany);

    if (incomes.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><div class="empty-icon">💰</div><p>ยังไม่มีรายได้บันทึกไว้</p></div></td></tr>`;
      return;
    }

    // เรียงจากใหม่สุด (รองรับ date เป็น array [y,m,d] หรือ string)
    const sorted = [...incomes].sort((a, b) => toDate(b.incomeDate) - toDate(a.incomeDate));

    tbody.innerHTML = sorted.map((inc, i) => `
      <tr>
        <td class="text-muted">${i + 1}</td>
        <td>${formatDate(inc.incomeDate)}</td>
        <td><span class="fw-600">${inc.member?.name || '—'}</span></td>
        <td class="fw-600">${formatCurrency(inc.vtuberIncome)}</td>
        <td class="amount-positive">${formatCurrency(inc.netIncome)}</td>
        <td style="color:var(--purple); font-weight:600;">${formatCurrency(inc.vtuberIncome - inc.netIncome)}</td>
      </tr>
    `).join('');

  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:var(--danger); padding:30px;">${err.message}</td></tr>`;
  }
}

async function openRecordIncomeModal() {
  document.getElementById('vt-income-amount').value = '';
  document.getElementById('vt-split-preview').style.display = 'none';
  document.getElementById('modal-record-income').classList.add('open');

  // โหลดรายชื่อ member
  const select = document.getElementById('vt-select-member');
  try {
    const members = await fetchAPI(API.members.getAll());
    select.innerHTML = '<option value="">— เลือกสมาชิก —</option>' +
      members.filter(m => m.active).map(m =>
        `<option value="${m.memberId}">${m.name}</option>`
      ).join('');
  } catch (_) {}
}

async function confirmRecordIncome() {
  const memberId = parseInt(document.getElementById('vt-select-member').value);
  const amount   = parseFloat(document.getElementById('vt-income-amount').value);

  if (!memberId) { showToast('กรุณาเลือกสมาชิก', 'error'); return; }
  if (!amount || amount <= 0) { showToast('กรุณาระบุจำนวนเงิน', 'error'); return; }

  const btn = document.getElementById('btn-confirm-income');
  btn.disabled = true; btn.textContent = 'กำลังบันทึก...';

  try {
    await fetchAPI(`${API.vtIncome.record()}?memberId=${memberId}&amount=${amount}`, { method: 'POST' });
    document.getElementById('modal-record-income').classList.remove('open');
    showToast('✅ บันทึกรายได้เรียบร้อยแล้ว', 'success');
    await loadVtIncomes();
  } catch (err) {
    showToast('เกิดข้อผิดพลาด: ' + err.message, 'error');
  } finally {
    btn.disabled = false; btn.textContent = '✓ บันทึกรายได้';
  }
}

function bindVtIncomeEvents() {
  document.getElementById('btn-record-income').addEventListener('click', openRecordIncomeModal);
  document.getElementById('btn-cancel-income').addEventListener('click', () =>
    document.getElementById('modal-record-income').classList.remove('open')
  );
  document.getElementById('btn-confirm-income').addEventListener('click', confirmRecordIncome);

  // Preview การแบ่ง realtime
  document.getElementById('vt-income-amount').addEventListener('input', function() {
    const v = parseFloat(this.value);
    const preview = document.getElementById('vt-split-preview');
    if (v > 0) {
      preview.style.display = 'block';
      document.getElementById('preview-member').textContent  = formatCurrency(v * 0.6);
      document.getElementById('preview-company').textContent = formatCurrency(v * 0.4);
    } else {
      preview.style.display = 'none';
    }
  });

  document.getElementById('modal-record-income').addEventListener('click', function(e) {
    if (e.target === this) this.classList.remove('open');
  });
}

function initVtIncome() {
  renderVtIncomePage();
  loadVtIncomes();
}
