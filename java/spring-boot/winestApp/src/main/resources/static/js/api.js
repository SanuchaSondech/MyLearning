/**
 * api.js
 * ศูนย์กลางการเชื่อมต่อกับ Backend API
 * แก้ไข BASE_URL ตรงนี้ที่เดียวถ้า port หรือ host เปลี่ยน
 */

const API = {
  BASE_URL: 'http://localhost:8080/api',

  // ==================== MEMBERS ====================
  members: {
    getAll:       () => `${API.BASE_URL}/members`,
    getById:      (id) => `${API.BASE_URL}/members/${id}`,
    create:       () => `${API.BASE_URL}/members`,
    updateName:   (id) => `${API.BASE_URL}/members/${id}/name`,
    delete:       (id) => `${API.BASE_URL}/members/${id}`,
    deposit:      (id) => `${API.BASE_URL}/members/${id}/deposit`,
    withdraw:     (id) => `${API.BASE_URL}/members/${id}/withdraw`,
  },

  // ==================== PROJECTS ====================
  projects: {
    getAll:       () => `${API.BASE_URL}/projects`,
    getById:      (id) => `${API.BASE_URL}/projects/${id}`,
    create:       () => `${API.BASE_URL}/projects`,
    delete:       (id) => `${API.BASE_URL}/projects/${id}`,
    pay:          (id) => `${API.BASE_URL}/projects/${id}/pay`,
    partialPay:   (id) => `${API.BASE_URL}/projects/${id}/partial-pay`,
    workStatus:   (id) => `${API.BASE_URL}/projects/${id}/work-status`,
    unfinished:   () => `${API.BASE_URL}/projects/unfinished`,
    unpaid:       () => `${API.BASE_URL}/projects/unpaid`,
  },

  // ==================== PARTICIPANTS ====================
  participants: {
    add:          () => `${API.BASE_URL}/participants/add`,
    remove:       (id) => `${API.BASE_URL}/participants/${id}`,
    byProject:    (projectId) => `${API.BASE_URL}/participants/project/${projectId}`,
  },

  // ==================== STATEMENTS ====================
  statements: {
    getAll:       () => `${API.BASE_URL}/statements`,
    byMember:     (memberId) => `${API.BASE_URL}/statements/member/${memberId}`,
    company:      () => `${API.BASE_URL}/statements/company`,
  },

  // ==================== VT INCOME ====================
  vtIncome: {
    getAll:       () => `${API.BASE_URL}/vt-income`,
    record:       () => `${API.BASE_URL}/vt-income/record`,
    byMember:     (memberId) => `${API.BASE_URL}/vt-income/member/${memberId}`,
  },

  // ==================== COMPANY ====================
  company: {
    info:         () => `${API.BASE_URL}/company/info`,
    setup:        () => `${API.BASE_URL}/company/setup`,
    withdraw:     () => `${API.BASE_URL}/company/withdraw`,
  },
};

/**
 * Helper function สำหรับเรียก API
 * จัดการ error handling กลาง และแปลง response เป็น JSON
 */
async function fetchAPI(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });

    // ถ้า response ไม่ ok ให้โยน error พร้อม message จาก backend
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP error! status: ${response.status}`);
    }

    // บาง endpoint คืนค่า text ธรรมดา ไม่ใช่ JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    return await response.text();
  } catch (error) {
    // Re-throw เพื่อให้ caller จัดการ
    throw error;
  }
}

/**
 * แสดง Toast Notification
 * type: 'success' | 'error' | 'info'
 */
function showToast(message, type = 'info') {
  // ลบ toast เก่าออกก่อน
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  // แสดงขึ้นมา
  setTimeout(() => toast.classList.add('show'), 10);

  // ซ่อนหลัง 3 วินาที
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/**
 * Format ตัวเลขเป็นสกุลเงินไทย
 */
function formatCurrency(amount) {
  if (amount === null || amount === undefined) return '฿0.00';
  return '฿' + Number(amount).toLocaleString('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * แปลงวันที่จาก Spring Boot LocalDate ที่อาจมาเป็น array [y,m,d] หรือ string "YYYY-MM-DD"
 * ให้เป็น Date object เสมอ
 */
function toDate(dateVal) {
  if (!dateVal) return new Date(0);
  if (Array.isArray(dateVal)) {
    // Spring Boot LocalDate serialize เป็น [year, month, day]
    return new Date(dateVal[0], dateVal[1] - 1, dateVal[2]);
  }
  return new Date(dateVal);
}

/**
 * Format วันที่เป็นแบบไทย
 */
function formatDate(dateStr) {
  if (!dateStr) return '-';
  const date = toDate(dateStr);
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
