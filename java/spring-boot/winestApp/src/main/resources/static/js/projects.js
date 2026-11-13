/**
 * projects.js — หน้าจัดการโปรเจกต์
 * - แสดงรายการโปรเจกต์ทั้งหมด พร้อมสถานะงานและสถานะการชำระ
 * - เพิ่มโปรเจกต์ใหม่
 * - เพิ่ม/ลบผู้เข้าร่วม
 * - ชำระเงิน (เต็มจำนวน / บางส่วน)
 * - ยืนยันงานเสร็จ
 * - ลบโปรเจกต์
 */

// ==================== RENDER HTML ====================
function renderProjectsPage() {
  const container = document.getElementById('page-projects');
  container.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">
        <span class="title-icon">📋</span>
        โปรเจกต์
      </h1>
    </div>

    <!-- Stat Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon purple">📋</div>
        <div class="stat-info">
          <div class="stat-label">โปรเจกต์ทั้งหมด</div>
          <div class="stat-value" id="proj-stat-total">—</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon gold">🔨</div>
        <div class="stat-info">
          <div class="stat-label">งานยังไม่เสร็จ</div>
          <div class="stat-value" id="proj-stat-wip">—</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon red">💳</div>
        <div class="stat-info">
          <div class="stat-label">ยังค้างชำระ</div>
          <div class="stat-value" id="proj-stat-unpaid">—</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green">💵</div>
        <div class="stat-info">
          <div class="stat-label">มูลค่ารวมทั้งหมด</div>
          <div class="stat-value" id="proj-stat-value">—</div>
        </div>
      </div>
    </div>

    <!-- Card Board Grid -->
    <div id="projects-grid" style="
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 18px;
    ">
      <div style="text-align:center; padding:40px; color:var(--navy-light); grid-column:1/-1;">
        <span class="spinner"></span> กำลังโหลด...
      </div>
    </div>

    <!-- FAB เพิ่มโปรเจกต์ -->
    <button class="btn btn-primary btn-fab" id="btn-add-project" title="เพิ่มโปรเจกต์ใหม่">＋</button>

    <!-- ========== MODAL: เพิ่มโปรเจกต์ ========== -->
    <div class="modal-overlay" id="modal-add-project">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">📋 เพิ่มโปรเจกต์ใหม่</div>
          <div class="modal-subtitle">กรอกรายละเอียดโปรเจกต์</div>
        </div>
        <div class="form-group">
          <label class="form-label">ชื่อโปรเจกต์ <span class="required">*</span></label>
          <input type="text" class="form-control" id="new-proj-name" placeholder="เช่น งาน Concert Live 2025" />
        </div>
        <div class="form-group">
          <label class="form-label">มูลค่าโปรเจกต์ (บาท) <span class="required">*</span></label>
          <input type="number" class="form-control" id="new-proj-price" placeholder="เช่น 50000" min="1" step="0.01" />
          <div class="form-hint">ยอดรวมทั้งหมดที่ได้รับจากงานนี้ (แบ่ง Member 90% / ค่าย 10%)</div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-outline" id="btn-cancel-add-project">ยกเลิก</button>
          <button class="btn btn-primary" id="btn-confirm-add-project">✓ สร้างโปรเจกต์</button>
        </div>
      </div>
    </div>

    <!-- ========== MODAL: จัดการผู้เข้าร่วม ========== -->
    <div class="modal-overlay" id="modal-participants">
      <div class="modal" style="max-width: 520px;">
        <div class="modal-header">
          <div class="modal-title">👥 ผู้เข้าร่วมโปรเจกต์</div>
          <div class="modal-subtitle" id="modal-participants-subtitle">—</div>
        </div>

        <!-- รายชื่อผู้เข้าร่วมปัจจุบัน -->
        <div class="form-label" style="margin-bottom:8px;">ผู้เข้าร่วมปัจจุบัน</div>
        <div id="current-participants-list" style="min-height:36px; margin-bottom:16px;">
          <span class="text-muted">ยังไม่มีผู้เข้าร่วม</span>
        </div>

        <div class="divider"></div>

        <!-- เพิ่มผู้เข้าร่วม -->
        <div class="form-label" style="margin-bottom:8px;">เพิ่มสมาชิกเข้าโปรเจกต์</div>
        <div style="display:flex; gap:8px;">
          <select class="form-control" id="select-member-to-add">
            <option value="">— เลือกสมาชิก —</option>
          </select>
          <button class="btn btn-primary btn-sm" id="btn-add-participant" style="flex-shrink:0;">เพิ่ม</button>
        </div>

        <div class="modal-actions">
          <button class="btn btn-outline" id="btn-close-participants">ปิด</button>
        </div>
      </div>
    </div>

    <!-- ========== MODAL: ชำระเงิน ========== -->
    <div class="modal-overlay" id="modal-pay">
      <div class="modal">
        <div class="modal-header">
          <div class="modal-title">💳 ชำระเงินโปรเจกต์</div>
          <div class="modal-subtitle" id="modal-pay-subtitle">—</div>
        </div>

        <div style="background:var(--purple-light); border-radius:var(--radius-md); padding:14px 16px; margin-bottom:18px;">
          <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
            <span class="text-muted">มูลค่ารวม</span>
            <span class="fw-600" id="pay-total-price">—</span>
          </div>
          <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
            <span class="text-muted">ชำระแล้ว</span>
            <span class="fw-600 amount-positive" id="pay-amount-paid">—</span>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span class="text-muted">คงเหลือ</span>
            <span class="fw-600 amount-negative" id="pay-remaining">—</span>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">วิธีชำระ</label>
          <select class="form-control" id="pay-method">
            <option value="full">ชำระเต็มจำนวนที่เหลือ</option>
            <option value="partial">ชำระบางส่วน</option>
          </select>
        </div>
        <div class="form-group" id="partial-amount-group" style="display:none;">
          <label class="form-label">จำนวนที่ต้องการชำระ <span class="required">*</span></label>
          <input type="number" class="form-control" id="partial-pay-amount" placeholder="ระบุจำนวน" min="1" step="0.01" />
        </div>

        <div class="form-hint" style="margin-bottom:0;">
          แบ่ง Member 90% / ค่าย 10% โดยอัตโนมัติ
        </div>

        <div class="modal-actions">
          <button class="btn btn-outline" id="btn-cancel-pay">ยกเลิก</button>
          <button class="btn btn-success" id="btn-confirm-pay">✓ ยืนยันชำระ</button>
        </div>
      </div>
    </div>

    <!-- ========== MODAL: ยืนยันงานเสร็จ ========== -->
    <div class="modal-overlay" id="modal-work-status">
      <div class="modal">
        <div class="modal-header">
          <div class="confirm-icon warning" style="width:52px;height:52px;margin-bottom:14px;">✅</div>
          <div class="modal-title" id="work-status-title">ยืนยันสถานะงาน</div>
          <div class="modal-subtitle" id="work-status-subtitle">ต้องการอัปเดตสถานะงานของโปรเจกต์นี้ไหม?</div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-outline" id="btn-cancel-work-status">ยกเลิก</button>
          <button class="btn btn-success" id="btn-confirm-work-status">✓ ยืนยัน</button>
        </div>
      </div>
    </div>

    <!-- ========== MODAL: ลบโปรเจกต์ ========== -->
    <div class="modal-overlay" id="modal-delete-project">
      <div class="modal">
        <div class="modal-header">
          <div class="confirm-icon danger" style="margin-bottom:14px;">🗑️</div>
          <div class="modal-title">ลบโปรเจกต์</div>
          <div class="modal-subtitle" id="delete-project-subtitle">ต้องการลบโปรเจกต์นี้ใช่ไหม? การกระทำนี้ไม่สามารถยกเลิกได้</div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-outline" id="btn-cancel-delete-project">ยกเลิก</button>
          <button class="btn btn-danger" id="btn-confirm-delete-project">🗑️ ลบโปรเจกต์</button>
        </div>
      </div>
    </div>
  `;

  bindProjectEvents();
}

// ==================== LOAD DATA ====================
async function loadProjects() {
  const grid = document.getElementById('projects-grid');
  try {
    const projects = await fetchAPI(API.projects.getAll());

    // คำนวณ stats
    const wipCount    = projects.filter(p => !p.completed).length;
    const unpaidCount = projects.filter(p => !p.paidFinished).length;
    const totalValue  = projects.reduce((s, p) => s + (p.totalPrice || 0), 0);

    document.getElementById('proj-stat-total').textContent  = projects.length + ' โปรเจกต์';
    document.getElementById('proj-stat-wip').textContent    = wipCount + ' โปรเจกต์';
    document.getElementById('proj-stat-unpaid').textContent = unpaidCount + ' โปรเจกต์';
    document.getElementById('proj-stat-value').textContent  = formatCurrency(totalValue);

    if (projects.length === 0) {
      grid.innerHTML = `
        <div style="grid-column:1/-1;">
          <div class="empty-state">
            <div class="empty-icon">📋</div>
            <p>ยังไม่มีโปรเจกต์ กดปุ่ม + เพื่อสร้างโปรเจกต์แรก</p>
          </div>
        </div>`;
      return;
    }

    // render เป็น card แต่ละโปรเจกต์
    grid.innerHTML = projects.map(p => {
      const remaining = (p.totalPrice || 0) - (p.amountPaid || 0);
      const progress  = p.totalPrice > 0
        ? Math.min(100, Math.round((p.amountPaid / p.totalPrice) * 100))
        : 0;

      // สีขอบด้านซ้ายของ card ตามสถานะงาน
      const borderColor = p.completed ? 'var(--success)' : p.paidFinished ? 'var(--info)' : 'var(--purple)';

      return `
        <div class="card" style="border-left: 4px solid ${borderColor}; transition: box-shadow 0.2s;"
          onmouseenter="this.style.boxShadow='var(--shadow-md)'"
          onmouseleave="this.style.boxShadow='var(--shadow-sm)'">

          <!-- Card Header -->
          <div style="padding: 18px 18px 12px;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px; margin-bottom:10px;">
              <div>
                <div style="font-family:var(--font-heading); font-size:1rem; font-weight:700; color:var(--navy); margin-bottom:3px;">
                  ${p.projectName}
                </div>
                <div class="text-muted" style="font-size:0.78rem;">📅 ${formatDate(p.startDate)}</div>
              </div>
              <div style="display:flex; flex-direction:column; gap:4px; align-items:flex-end; flex-shrink:0;">
                <!-- สถานะงาน: กดได้ -->
                <span
                  class="badge ${p.completed ? 'badge-done' : 'badge-wip'} badge-clickable"
                  onclick="openWorkStatusModal(${p.projectId}, '${p.projectName}', ${p.completed})"
                  title="คลิกเพื่อเปลี่ยนสถานะงาน"
                >${p.completed ? '✅ เสร็จแล้ว' : '🔨 กำลังทำ'}</span>
                <!-- สถานะชำระ -->
                <span class="badge ${p.paidFinished ? 'badge-paid' : 'badge-unpaid'}">
                  ${p.paidFinished ? '💳 ชำระครบ' : '⏳ ค้างชำระ'}
                </span>
              </div>
            </div>

            <!-- ราคา -->
            <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
              <div>
                <div class="text-muted" style="font-size:0.75rem; margin-bottom:1px;">มูลค่ารวม</div>
                <div style="font-family:var(--font-heading); font-weight:700; font-size:1.1rem; color:var(--navy);">
                  ${formatCurrency(p.totalPrice)}
                </div>
              </div>
              <div style="text-align:right;">
                <div class="text-muted" style="font-size:0.75rem; margin-bottom:1px;">ชำระแล้ว</div>
                <div style="font-family:var(--font-heading); font-weight:700; font-size:1.1rem; color:var(--success);">
                  ${formatCurrency(p.amountPaid)}
                </div>
              </div>
            </div>

            <!-- Progress bar -->
            <div style="background:rgba(30,42,74,0.08); border-radius:100px; height:6px; margin-bottom:4px; overflow:hidden;">
              <div style="
                height:100%; width:${progress}%;
                background: ${p.paidFinished ? 'var(--success)' : 'var(--purple)'};
                border-radius:100px;
                transition: width 0.5s ease;
              "></div>
            </div>
            <div class="text-muted" style="font-size:0.75rem; text-align:right;">
              ${p.paidFinished ? 'ชำระครบแล้ว' : `คงเหลือ ${formatCurrency(remaining)} (${100 - progress}%)`}
            </div>
          </div>

          <div class="divider" style="margin:0;"></div>

          <!-- Card Footer: ผู้เข้าร่วม + ปุ่มจัดการ -->
          <div style="padding: 12px 18px; display:flex; justify-content:space-between; align-items:center; gap:8px; flex-wrap:wrap;">
            <button class="btn btn-outline btn-sm" onclick="openParticipantsModal(${p.projectId}, '${p.projectName}')">
              👥 ผู้เข้าร่วม
            </button>
            <div style="display:flex; gap:6px;">
              ${!p.paidFinished
                ? `<button class="btn btn-success btn-sm"
                    onclick="openPayModal(${p.projectId}, '${p.projectName}', ${p.totalPrice}, ${p.amountPaid})">
                    💳 ชำระเงิน
                  </button>`
                : ''}
              ${!p.paidFinished
                ? `<button class="btn btn-danger btn-sm"
                    onclick="openDeleteProjectModal(${p.projectId}, '${p.projectName}')">
                    🗑️
                  </button>`
                : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');

  } catch (err) {
    grid.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; color:var(--danger); padding:30px;">
        ${err.message}
      </div>`;
  }
}

// ==================== MODAL: เพิ่มโปรเจกต์ ====================
function openAddProjectModal() {
  document.getElementById('new-proj-name').value = '';
  document.getElementById('new-proj-price').value = '';
  document.getElementById('modal-add-project').classList.add('open');
  document.getElementById('new-proj-name').focus();
}

function closeAddProjectModal() {
  document.getElementById('modal-add-project').classList.remove('open');
}

async function confirmAddProject() {
  const name  = document.getElementById('new-proj-name').value.trim();
  const price = parseFloat(document.getElementById('new-proj-price').value);

  if (!name) { showToast('กรุณาระบุชื่อโปรเจกต์', 'error'); return; }
  if (!price || price <= 0) { showToast('กรุณาระบุมูลค่าที่ถูกต้อง', 'error'); return; }

  const btn = document.getElementById('btn-confirm-add-project');
  btn.disabled = true; btn.textContent = 'กำลังสร้าง...';

  try {
    await fetchAPI(`${API.projects.create()}?name=${encodeURIComponent(name)}&totalPrice=${price}`, { method: 'POST' });
    closeAddProjectModal();
    showToast(`✅ สร้างโปรเจกต์ "${name}" เรียบร้อย`, 'success');
    await loadProjects();
  } catch (err) {
    showToast('เกิดข้อผิดพลาด: ' + err.message, 'error');
  } finally {
    btn.disabled = false; btn.textContent = '✓ สร้างโปรเจกต์';
  }
}

// ==================== MODAL: ผู้เข้าร่วม ====================
let currentParticipantProjectId = null;

async function openParticipantsModal(projectId, projectName) {
  currentParticipantProjectId = projectId;
  document.getElementById('modal-participants-subtitle').textContent = `โปรเจกต์: ${projectName}`;
  document.getElementById('modal-participants').classList.add('open');
  await loadParticipants(projectId);
  await loadMembersForSelect();
}

async function loadParticipants(projectId) {
  const container = document.getElementById('current-participants-list');
  try {
    const list = await fetchAPI(API.participants.byProject(projectId));
    if (!list || list.length === 0) {
      container.innerHTML = '<span class="text-muted">ยังไม่มีผู้เข้าร่วม</span>';
      return;
    }
    container.innerHTML = `<div class="participant-tags">${
      list.map(p => `
        <span class="participant-tag">
          ${p.member?.name || 'Unknown'}
          <span class="remove-tag" onclick="removeParticipant(${p.participantId})" title="ลบออก">✕</span>
        </span>
      `).join('')
    }</div>`;
  } catch (err) {
    container.innerHTML = `<span style="color:var(--danger);">${err.message}</span>`;
  }
}

async function loadMembersForSelect() {
  const select = document.getElementById('select-member-to-add');
  try {
    const members = await fetchAPI(API.members.getAll());
    select.innerHTML = '<option value="">— เลือกสมาชิก —</option>' +
      members.filter(m => m.active).map(m =>
        `<option value="${m.memberId}">${m.name} (${m.role})</option>`
      ).join('');
  } catch (_) {}
}

async function addParticipant() {
  const memberId = parseInt(document.getElementById('select-member-to-add').value);
  if (!memberId) { showToast('กรุณาเลือกสมาชิก', 'error'); return; }

  try {
    await fetchAPI(
      `${API.participants.add()}?projectId=${currentParticipantProjectId}&memberId=${memberId}`,
      { method: 'POST' }
    );
    showToast('✅ เพิ่มสมาชิกเข้าโปรเจกต์เรียบร้อย', 'success');
    await loadParticipants(currentParticipantProjectId);
  } catch (err) {
    showToast('เกิดข้อผิดพลาด: ' + err.message, 'error');
  }
}

async function removeParticipant(participantId) {
  try {
    await fetchAPI(API.participants.remove(participantId), { method: 'DELETE' });
    showToast('ลบสมาชิกออกจากโปรเจกต์แล้ว', 'success');
    await loadParticipants(currentParticipantProjectId);
    await loadProjects();
  } catch (err) {
    showToast('เกิดข้อผิดพลาด: ' + err.message, 'error');
  }
}

// ==================== MODAL: ชำระเงิน ====================
let pendingPayProjectId = null;

function openPayModal(projectId, projectName, totalPrice, amountPaid) {
  pendingPayProjectId = projectId;
  const remaining = totalPrice - amountPaid;

  document.getElementById('modal-pay-subtitle').textContent = `โปรเจกต์: ${projectName}`;
  document.getElementById('pay-total-price').textContent    = formatCurrency(totalPrice);
  document.getElementById('pay-amount-paid').textContent    = formatCurrency(amountPaid);
  document.getElementById('pay-remaining').textContent      = formatCurrency(remaining);
  document.getElementById('pay-method').value = 'full';
  document.getElementById('partial-amount-group').style.display = 'none';
  document.getElementById('partial-pay-amount').value = '';

  document.getElementById('modal-pay').classList.add('open');
}

async function confirmPay() {
  const method = document.getElementById('pay-method').value;
  const btn = document.getElementById('btn-confirm-pay');
  btn.disabled = true; btn.textContent = 'กำลังดำเนินการ...';

  try {
    if (method === 'full') {
      await fetchAPI(API.projects.pay(pendingPayProjectId), { method: 'POST' });
    } else {
      const amount = parseFloat(document.getElementById('partial-pay-amount').value);
      if (!amount || amount <= 0) { showToast('กรุณาระบุจำนวนเงิน', 'error'); return; }
      await fetchAPI(`${API.projects.partialPay(pendingPayProjectId)}?amount=${amount}`, { method: 'POST' });
    }
    document.getElementById('modal-pay').classList.remove('open');
    showToast('✅ ชำระเงินเรียบร้อยแล้ว', 'success');
    await loadProjects();
  } catch (err) {
    showToast('เกิดข้อผิดพลาด: ' + err.message, 'error');
  } finally {
    btn.disabled = false; btn.textContent = '✓ ยืนยันชำระ';
  }
}

// ==================== MODAL: สถานะงาน ====================
let pendingWorkStatusProjectId = null;
let pendingWorkStatusNewVal    = null;

function openWorkStatusModal(projectId, projectName, currentCompleted) {
  pendingWorkStatusProjectId = projectId;
  pendingWorkStatusNewVal    = !currentCompleted;
  const newText = pendingWorkStatusNewVal ? '"เสร็จแล้ว"' : '"กำลังทำ"';

  document.getElementById('work-status-title').textContent    = `อัปเดตสถานะ: ${projectName}`;
  document.getElementById('work-status-subtitle').textContent = `ต้องการเปลี่ยนสถานะงานเป็น ${newText} ใช่ไหม?`;
  document.getElementById('modal-work-status').classList.add('open');
}

async function confirmWorkStatus() {
  const btn = document.getElementById('btn-confirm-work-status');
  btn.disabled = true;
  try {
    await fetchAPI(
      `${API.projects.workStatus(pendingWorkStatusProjectId)}?isFinished=${pendingWorkStatusNewVal}`,
      { method: 'PATCH' }
    );
    document.getElementById('modal-work-status').classList.remove('open');
    showToast('✅ อัปเดตสถานะงานเรียบร้อย', 'success');
    await loadProjects();
  } catch (err) {
    showToast('เกิดข้อผิดพลาด: ' + err.message, 'error');
  } finally {
    btn.disabled = false;
  }
}

// ==================== MODAL: ลบโปรเจกต์ ====================
let pendingDeleteProjectId = null;

function openDeleteProjectModal(projectId, projectName) {
  pendingDeleteProjectId = projectId;
  document.getElementById('delete-project-subtitle').textContent =
    `ต้องการลบโปรเจกต์ "${projectName}" ใช่ไหม? การกระทำนี้ไม่สามารถยกเลิกได้`;
  document.getElementById('modal-delete-project').classList.add('open');
}

async function confirmDeleteProject() {
  const btn = document.getElementById('btn-confirm-delete-project');
  btn.disabled = true;
  try {
    await fetchAPI(API.projects.delete(pendingDeleteProjectId), { method: 'DELETE' });
    document.getElementById('modal-delete-project').classList.remove('open');
    showToast('🗑️ ลบโปรเจกต์เรียบร้อยแล้ว', 'success');
    await loadProjects();
  } catch (err) {
    showToast('เกิดข้อผิดพลาด: ' + err.message, 'error');
  } finally {
    btn.disabled = false;
  }
}

// ==================== BIND EVENTS ====================
function bindProjectEvents() {
  // FAB
  document.getElementById('btn-add-project').addEventListener('click', openAddProjectModal);

  // Modal เพิ่มโปรเจกต์
  document.getElementById('btn-cancel-add-project').addEventListener('click', closeAddProjectModal);
  document.getElementById('btn-confirm-add-project').addEventListener('click', confirmAddProject);

  // Modal ผู้เข้าร่วม
  document.getElementById('btn-add-participant').addEventListener('click', addParticipant);
  document.getElementById('btn-close-participants').addEventListener('click', () => {
    document.getElementById('modal-participants').classList.remove('open');
    loadProjects();
  });

  // Modal ชำระเงิน
  document.getElementById('pay-method').addEventListener('change', function() {
    document.getElementById('partial-amount-group').style.display =
      this.value === 'partial' ? 'block' : 'none';
  });
  document.getElementById('btn-cancel-pay').addEventListener('click', () => {
    document.getElementById('modal-pay').classList.remove('open');
  });
  document.getElementById('btn-confirm-pay').addEventListener('click', confirmPay);

  // Modal สถานะงาน
  document.getElementById('btn-cancel-work-status').addEventListener('click', () => {
    document.getElementById('modal-work-status').classList.remove('open');
  });
  document.getElementById('btn-confirm-work-status').addEventListener('click', confirmWorkStatus);

  // Modal ลบโปรเจกต์
  document.getElementById('btn-cancel-delete-project').addEventListener('click', () => {
    document.getElementById('modal-delete-project').classList.remove('open');
  });
  document.getElementById('btn-confirm-delete-project').addEventListener('click', confirmDeleteProject);

  // ปิด modal เมื่อคลิก overlay
  ['modal-add-project','modal-participants','modal-pay','modal-work-status','modal-delete-project'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', function(e) {
      if (e.target === this) this.classList.remove('open');
    });
  });
}

// ==================== INIT ====================
function initProjects() {
  renderProjectsPage();
  loadProjects();
}
