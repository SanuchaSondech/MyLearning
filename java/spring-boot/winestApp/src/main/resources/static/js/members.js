/**
 * members.js — หน้าจัดการสมาชิก
 * - แสดงรายชื่อสมาชิกทั้งหมด
 * - เพิ่มสมาชิกใหม่ (FAB + popup)
 * - เปลี่ยนสถานะ active/inactive (คลิกที่ badge)
 * - เบิกเงินออก (คลิกที่ยอดเงิน)
 */

// ==================== RENDER HTML ====================
function renderMembersPage() {
  const container = document.getElementById('page-members');
  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">
        <span class="title-icon">👥</span>
        สมาชิก
      </h1>
    </div>

    <!-- Stat Cards -->
    <div class="stats-grid" id="member-stats">
      <div class="stat-card">
        <div class="stat-icon purple">👤</div>
        <div class="stat-info">
          <div class="stat-label">สมาชิกทั้งหมด</div>
          <div class="stat-value" id="stat-total">—</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green">✅</div>
        <div class="stat-info">
          <div class="stat-label">กำลังทำงาน</div>
          <div class="stat-value" id="stat-active">—</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon gold">💰</div>
        <div class="stat-info">
          <div class="stat-label">ยอดเงินรวมทั้งหมด</div>
          <div class="stat-value" id="stat-balance">—</div>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>ชื่อ</th>
            <th>อายุ</th>
            <th>ตำแหน่ง</th>
            <th>สถานะ</th>
            <th>ยอดเงินคงเหลือ</th>
          </tr>
        </thead>
        <tbody id="members-tbody">
          <tr class="loading-row"><td colspan="6"><span class="spinner"></span> กำลังโหลด...</td></tr>
        </tbody>
      </table>
    </div>

    <!-- FAB เพิ่มสมาชิก -->
    <button class="btn btn-primary btn-fab" id="btn-add-member" title="เพิ่มสมาชิกใหม่">＋</button>

    <!-- ========== MODAL: เพิ่มสมาชิก ========== -->
    <div class="modal-overlay" id="modal-add-member">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">✨ เพิ่มสมาชิกใหม่</div>
          <div class="modal-subtitle">กรอกข้อมูลสมาชิกที่ต้องการเพิ่มเข้าสู่ระบบ</div>
        </div>

        <div class="form-group">
          <label class="form-label">ชื่อ <span class="required">*</span></label>
          <input type="text" class="form-control" id="new-member-name" placeholder="เช่น นาวา, ยูกิ" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">อายุ <span class="required">*</span></label>
            <input type="number" class="form-control" id="new-member-age" placeholder="เช่น 22" min="1" max="99" />
          </div>
          <div class="form-group">
            <label class="form-label">ตำแหน่ง <span class="required">*</span></label>
            <select class="form-control" id="new-member-role">
              <option value="">— เลือกตำแหน่ง —</option>
              <option value="VTuber">🎀 VTuber</option>
              <option value="Artist">🎨 Artist</option>
              <option value="Music Producer">🎵 Music Producer</option>
              <option value="Video Editor">🎬 Video Editor</option>
              <option value="Manager">📋 Manager</option>
              <option value="Staff">🔧 Staff</option>
            </select>
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn btn-outline" id="btn-cancel-add-member">ยกเลิก</button>
          <button class="btn btn-primary" id="btn-confirm-add-member">✓ เพิ่มสมาชิก</button>
        </div>
      </div>
    </div>

    <!-- ========== MODAL: เปลี่ยนสถานะ ========== -->
    <div class="modal-overlay" id="modal-toggle-status">
      <div class="modal">
        <div class="modal-header">
          <div class="confirm-icon warning">⚠️</div>
          <div class="modal-title" id="toggle-status-title">เปลี่ยนสถานะสมาชิก</div>
          <div class="modal-subtitle" id="toggle-status-subtitle">ต้องการเปลี่ยนสถานะของสมาชิกคนนี้ใช่ไหม?</div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-outline" id="btn-cancel-toggle">ไม่เปลี่ยน</button>
          <button class="btn btn-warning" id="btn-confirm-toggle">ยืนยันเปลี่ยน</button>
        </div>
      </div>
    </div>

    <!-- ========== MODAL: เบิกเงิน ========== -->
    <div class="modal-overlay" id="modal-withdraw">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">💸 เบิกเงิน</div>
          <div class="modal-subtitle" id="withdraw-member-name-display">—</div>
        </div>
        <div class="form-group">
          <label class="form-label">ยอดเงินปัจจุบัน</label>
          <div style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 700; color: var(--purple); margin-bottom: 16px;" id="withdraw-current-balance">—</div>
        </div>
        <div class="form-group">
          <label class="form-label">จำนวนที่ต้องการเบิก <span class="required">*</span></label>
          <input type="number" class="form-control" id="withdraw-amount" placeholder="ระบุจำนวนเงิน" min="1" step="0.01" />
          <div class="form-hint">ระบุจำนวนเงินที่ต้องการเบิกออก (ห้ามเกินยอดคงเหลือ)</div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-outline" id="btn-cancel-withdraw">ยกเลิก</button>
          <button class="btn btn-danger" id="btn-confirm-withdraw">💸 ยืนยันเบิกเงิน</button>
        </div>
      </div>
    </div>
  `;

  bindMemberEvents();
}

// ==================== LOAD DATA ====================
async function loadMembers() {
  const tbody = document.getElementById('members-tbody');
  try {
    // ดึงสมาชิกทุกคน (รวม inactive) โดยใช้ endpoint ทั้งหมด
    // หมายเหตุ: API /api/members คืนเฉพาะ active ถ้าต้องการทั้งหมดต้องแก้ backend
    // ตอนนี้ใช้ endpoint active อย่างเดียวก่อน
    const members = await fetchAPI(API.members.getAll());

    // คำนวณ stats
    const activeCount = members.filter(m => m.active).length;
    const totalBalance = members.reduce((sum, m) => sum + (m.balance || 0), 0);

    document.getElementById('stat-total').textContent = members.length + ' คน';
    document.getElementById('stat-active').textContent = activeCount + ' คน';
    document.getElementById('stat-balance').textContent = formatCurrency(totalBalance);

    if (members.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6">
            <div class="empty-state">
              <div class="empty-icon">👤</div>
              <p>ยังไม่มีสมาชิกในระบบ กดปุ่ม + เพื่อเพิ่มสมาชิกแรก</p>
            </div>
          </td>
        </tr>`;
      return;
    }

    // render แถวสมาชิก
    tbody.innerHTML = members.map((m, i) => `
      <tr>
        <td class="text-muted">${i + 1}</td>
        <td><span class="fw-600">${m.name}</span></td>
        <td>${m.age || '—'}</td>
        <td>${m.role || '—'}</td>
        <td>
          <!-- คลิกที่ badge เพื่อเปลี่ยนสถานะ -->
          <span
            class="badge ${m.active ? 'badge-active' : 'badge-inactive'} badge-clickable"
            data-member-id="${m.memberId}"
            data-member-name="${m.name}"
            data-current-status="${m.active}"
            onclick="openToggleStatusModal(this)"
          >
            ${m.active ? '✅ ทำงานอยู่' : '❌ ลาออกแล้ว'}
          </span>
        </td>
        <td>
          <!-- คลิกที่ยอดเงินเพื่อเบิก (เฉพาะ active เท่านั้น) -->
          ${m.active
            ? `<span
                class="fw-600 amount-positive"
                style="cursor:pointer; text-decoration:underline dotted;"
                data-member-id="${m.memberId}"
                data-member-name="${m.name}"
                data-balance="${m.balance || 0}"
                onclick="openWithdrawModal(this)"
                title="คลิกเพื่อเบิกเงิน"
              >${formatCurrency(m.balance)}</span>`
            : `<span class="text-muted">${formatCurrency(m.balance)}</span>`
          }
        </td>
      </tr>
    `).join('');

  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color: var(--danger); padding:30px;">${err.message}</td></tr>`;
  }
}

// ==================== MODAL: เพิ่มสมาชิก ====================
function openAddMemberModal() {
  // ล้างฟอร์ม
  document.getElementById('new-member-name').value = '';
  document.getElementById('new-member-age').value = '';
  document.getElementById('new-member-role').value = '';
  document.getElementById('modal-add-member').classList.add('open');
  document.getElementById('new-member-name').focus();
}

function closeAddMemberModal() {
  document.getElementById('modal-add-member').classList.remove('open');
}

async function confirmAddMember() {
  const name = document.getElementById('new-member-name').value.trim();
  const age  = parseInt(document.getElementById('new-member-age').value);
  const role = document.getElementById('new-member-role').value.trim();

  // Validate
  if (!name) { showToast('กรุณาระบุชื่อสมาชิก', 'error'); return; }
  if (!age || age < 1) { showToast('กรุณาระบุอายุที่ถูกต้อง', 'error'); return; }
  if (!role) { showToast('กรุณาระบุตำแหน่ง', 'error'); return; }

  const btn = document.getElementById('btn-confirm-add-member');
  btn.disabled = true;
  btn.textContent = 'กำลังบันทึก...';

  try {
    await fetchAPI(API.members.create(), {
      method: 'POST',
      body: JSON.stringify({ name, age, role }),
    });
    closeAddMemberModal();
    showToast(`✅ เพิ่มสมาชิก "${name}" เรียบร้อยแล้ว`, 'success');
    await loadMembers(); // โหลดใหม่
  } catch (err) {
    showToast('เกิดข้อผิดพลาด: ' + err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = '✓ เพิ่มสมาชิก';
  }
}

// ==================== MODAL: เปลี่ยนสถานะ ====================
let pendingToggleMemberId   = null;
let pendingToggleCurrentStatus = null;

function openToggleStatusModal(badgeEl) {
  pendingToggleMemberId      = parseInt(badgeEl.dataset.memberId);
  pendingToggleCurrentStatus = badgeEl.dataset.currentStatus === 'true';
  const name = badgeEl.dataset.memberName;

  const newStatusText = pendingToggleCurrentStatus ? 'ลาออก (ไม่ active)' : 'กลับมาทำงาน (active)';
  document.getElementById('toggle-status-title').textContent = `เปลี่ยนสถานะ: ${name}`;
  document.getElementById('toggle-status-subtitle').textContent =
    `ต้องการเปลี่ยนสถานะของ "${name}" เป็น "${newStatusText}" ใช่ไหม?`;

  document.getElementById('modal-toggle-status').classList.add('open');
}

function closeToggleStatusModal() {
  document.getElementById('modal-toggle-status').classList.remove('open');
  pendingToggleMemberId = null;
}

async function confirmToggleStatus() {
  if (!pendingToggleMemberId) return;

  const btn = document.getElementById('btn-confirm-toggle');
  btn.disabled = true;

  try {
    if (pendingToggleCurrentStatus) {
      // ปัจจุบัน active → ลาออก → เรียก DELETE (soft delete)
      await fetchAPI(API.members.delete(pendingToggleMemberId), { method: 'DELETE' });
      showToast('เปลี่ยนสถานะเป็น "ลาออก" เรียบร้อย', 'success');
    } else {
      // ปัจจุบัน inactive → กลับมา → ยังไม่มี endpoint ตรงๆ
      // (ต้องเพิ่ม endpoint ใน backend ถ้าต้องการ re-activate)
      showToast('ฟีเจอร์คืนสถานะยังไม่รองรับใน Backend ปัจจุบัน', 'error');
    }
    closeToggleStatusModal();
    await loadMembers();
  } catch (err) {
    showToast('เกิดข้อผิดพลาด: ' + err.message, 'error');
  } finally {
    btn.disabled = false;
  }
}

// ==================== MODAL: เบิกเงิน ====================
let pendingWithdrawMemberId = null;

function openWithdrawModal(el) {
  pendingWithdrawMemberId = parseInt(el.dataset.memberId);
  const balance = parseFloat(el.dataset.balance || 0);

  document.getElementById('withdraw-member-name-display').textContent =
    `สมาชิก: ${el.dataset.memberName}`;
  document.getElementById('withdraw-current-balance').textContent = formatCurrency(balance);
  document.getElementById('withdraw-amount').value = '';
  document.getElementById('withdraw-amount').max = balance;

  document.getElementById('modal-withdraw').classList.add('open');
  document.getElementById('withdraw-amount').focus();
}

function closeWithdrawModal() {
  document.getElementById('modal-withdraw').classList.remove('open');
  pendingWithdrawMemberId = null;
}

async function confirmWithdraw() {
  const amount = parseFloat(document.getElementById('withdraw-amount').value);
  if (!amount || amount <= 0) { showToast('กรุณาระบุจำนวนเงินที่ถูกต้อง', 'error'); return; }

  const btn = document.getElementById('btn-confirm-withdraw');
  btn.disabled = true;
  btn.textContent = 'กำลังดำเนินการ...';

  try {
    await fetchAPI(API.members.withdraw(pendingWithdrawMemberId) + `?amount=${amount}`, {
      method: 'POST',
    });
    closeWithdrawModal();
    showToast(`💸 เบิกเงิน ${formatCurrency(amount)} เรียบร้อยแล้ว`, 'success');
    await loadMembers();
  } catch (err) {
    showToast('เกิดข้อผิดพลาด: ' + err.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = '💸 ยืนยันเบิกเงิน';
  }
}

// ==================== BIND EVENTS ====================
function bindMemberEvents() {
  // FAB เปิด modal เพิ่มสมาชิก
  document.getElementById('btn-add-member').addEventListener('click', openAddMemberModal);

  // Modal เพิ่มสมาชิก
  document.getElementById('btn-cancel-add-member').addEventListener('click', closeAddMemberModal);
  document.getElementById('btn-confirm-add-member').addEventListener('click', confirmAddMember);

  // Modal เปลี่ยนสถานะ
  document.getElementById('btn-cancel-toggle').addEventListener('click', closeToggleStatusModal);
  document.getElementById('btn-confirm-toggle').addEventListener('click', confirmToggleStatus);

  // Modal เบิกเงิน
  document.getElementById('btn-cancel-withdraw').addEventListener('click', closeWithdrawModal);
  document.getElementById('btn-confirm-withdraw').addEventListener('click', confirmWithdraw);

  // ปิด modal เมื่อคลิก overlay
  ['modal-add-member', 'modal-toggle-status', 'modal-withdraw'].forEach(id => {
    document.getElementById(id).addEventListener('click', function(e) {
      if (e.target === this) this.classList.remove('open');
    });
  });

  // กด Enter ใน form เพิ่มสมาชิก
  ['new-member-name', 'new-member-age', 'new-member-role'].forEach(id => {
    document.getElementById(id)?.addEventListener('keydown', e => {
      if (e.key === 'Enter') confirmAddMember();
    });
  });
}

// ==================== INIT (เรียกจาก router) ====================
function initMembers() {
  renderMembersPage();
  loadMembers();
}
