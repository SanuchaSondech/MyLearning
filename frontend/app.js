const el = (id) => document.getElementById(id);

const state = {
  apiBase: localStorage.getItem("winest_api_base") || "http://localhost:8080",
};

const toastEl = el("toast");
el("apiBase").value = state.apiBase;

function showToast(message, isError = false) {
  toastEl.textContent = message;
  toastEl.className = `toast show ${isError ? "error" : ""}`;
  setTimeout(() => {
    toastEl.className = "toast";
  }, 2500);
}

function parseNumber(value, fieldName, min = null) {
  const n = Number(value);
  if (!Number.isFinite(n)) throw new Error(`ค่า ${fieldName} ไม่ถูกต้อง`);
  if (min !== null && n < min) throw new Error(`${fieldName} ต้องมากกว่าหรือเท่ากับ ${min}`);
  return n;
}

function parseInteger(value, fieldName, min = 1) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < min) {
    throw new Error(`${fieldName} ต้องเป็นเลขจำนวนเต็มและ >= ${min}`);
  }
  return n;
}

async function request(path, { method = "GET", body, query } = {}) {
  const url = new URL(`${state.apiBase}${path}`);
  if (query) {
    Object.entries(query).forEach(([k, v]) => url.searchParams.append(k, v));
  }

  const options = { method, headers: {} };
  if (body !== undefined) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  const res = await fetch(url, options);
  const text = await res.text();
  const data = text ? safeJson(text) : null;

  if (!res.ok) {
    const msg = typeof data === "string" ? data : data?.message || text || `API Error ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

function safeJson(text) {
  try { return JSON.parse(text); } catch { return text; }
}

function print(id, data) {
  el(id).textContent = typeof data === "string" ? data : JSON.stringify(data, null, 2);
}

function submit(formId, fn) {
  el(formId).addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      await fn();
    } catch (err) {
      showToast(err.message, true);
    }
  });
}

el("saveApiBaseBtn").addEventListener("click", () => {
  try {
    const url = new URL(el("apiBase").value.trim());
    state.apiBase = `${url.protocol}//${url.host}`;
    localStorage.setItem("winest_api_base", state.apiBase);
    showToast("บันทึก API Base แล้ว");
  } catch {
    showToast("API Base URL ไม่ถูกต้อง", true);
  }
});

submit("companySetupForm", async () => {
  const name = el("companyName").value.trim();
  if (name.length < 2) throw new Error("ชื่อค่ายต้องมีอย่างน้อย 2 ตัวอักษร");
  const res = await request("/api/company/setup", { method: "POST", query: { name } });
  print("companyInfoOutput", res);
  showToast("สร้างค่ายสำเร็จ");
});

el("loadCompanyInfoBtn").addEventListener("click", async () => {
  try {
    const res = await request("/api/company/info");
    print("companyInfoOutput", res);
    showToast("โหลดข้อมูลค่ายแล้ว");
  } catch (err) {
    showToast(err.message, true);
  }
});

submit("withdrawForm", async () => {
  const amount = parseNumber(el("withdrawAmount").value, "จำนวนเงินที่เบิก", 0.01);
  const res = await request("/api/company/withdraw", { method: "POST", query: { amount } });
  print("companyInfoOutput", res || "เบิกเงินสำเร็จ");
  showToast("เบิกเงินสำเร็จ");
});

submit("memberForm", async () => {
  const name = el("memberName").value.trim();
  const age = parseInteger(el("memberAge").value, "อายุ");
  const role = el("memberRole").value.trim();
  if (name.length < 2 || role.length < 2) throw new Error("ชื่อและบทบาทต้องมีอย่างน้อย 2 ตัวอักษร");

  const res = await request("/api/members", { method: "POST", body: { name, age, role } });
  print("membersOutput", res);
  showToast("เพิ่มสมาชิกแล้ว");
});

el("loadMembersBtn").addEventListener("click", async () => {
  try {
    const res = await request("/api/members");
    print("membersOutput", res);
    showToast("โหลดสมาชิกแล้ว");
  } catch (err) {
    showToast(err.message, true);
  }
});

submit("updateMemberNameForm", async () => {
  const id = parseInteger(el("updateMemberId").value, "Member ID");
  const newName = el("updateMemberNewName").value.trim();
  if (newName.length < 2) throw new Error("ชื่อใหม่ต้องมีอย่างน้อย 2 ตัวอักษร");
  const res = await request(`/api/members/${id}/name`, { method: "PATCH", query: { newName } });
  print("membersOutput", res);
  showToast("แก้ไขชื่อสำเร็จ");
});

submit("memberBalanceForm", async () => {
  const id = parseInteger(el("balanceMemberId").value, "Member ID");
  const amount = parseNumber(el("balanceAmount").value, "จำนวนเงิน", 0.01);
  const res = await request(`/api/members/${id}/add-balance`, { method: "POST", query: { amount } });
  print("membersOutput", res || "เพิ่มยอดเงินสำเร็จ");
  showToast("เพิ่มยอดเงินสำเร็จ");
});

submit("deleteMemberForm", async () => {
  const id = parseInteger(el("deleteMemberId").value, "Member ID");
  const res = await request(`/api/members/${id}`, { method: "DELETE" });
  print("membersOutput", res || "ตั้งค่าสถานะลาออกแล้ว");
  showToast("อัปเดตสถานะสมาชิกแล้ว");
});

submit("projectForm", async () => {
  const name = el("projectName").value.trim();
  const totalPrice = parseNumber(el("projectTotalPrice").value, "ราคารวม", 0.01);
  if (name.length < 2) throw new Error("ชื่อโปรเจกต์ต้องมีอย่างน้อย 2 ตัวอักษร");

  const res = await request("/api/projects", { method: "POST", query: { name, totalPrice } });
  print("projectsOutput", res);
  showToast("สร้างโปรเจกต์แล้ว");
});

el("loadProjectsBtn").addEventListener("click", () => loadProjects("/api/projects"));
el("loadUnfinishedBtn").addEventListener("click", () => loadProjects("/api/projects/unfinished"));
el("loadUnpaidBtn").addEventListener("click", () => loadProjects("/api/projects/unpaid"));

async function loadProjects(path) {
  try {
    const res = await request(path);
    print("projectsOutput", res);
    showToast("โหลดข้อมูลโปรเจกต์แล้ว");
  } catch (err) {
    showToast(err.message, true);
  }
}

submit("workStatusForm", async () => {
  const id = parseInteger(el("workProjectId").value, "Project ID");
  const isFinished = el("workFinished").value;
  if (!["true", "false"].includes(isFinished)) throw new Error("กรุณาเลือกสถานะงาน");
  const res = await request(`/api/projects/${id}/work-status`, { method: "PATCH", query: { isFinished } });
  print("projectsOutput", res || "อัปเดตสถานะงานแล้ว");
  showToast("อัปเดตสถานะงานแล้ว");
});

submit("payProjectForm", async () => {
  const id = parseInteger(el("payProjectId").value, "Project ID");
  const res = await request(`/api/projects/${id}/pay`, { method: "POST" });
  print("projectsOutput", res || "ชำระเงินแล้ว");
  showToast("จ่ายเงินโปรเจกต์แล้ว");
});

submit("deleteProjectForm", async () => {
  const id = parseInteger(el("deleteProjectId").value, "Project ID");
  const res = await request(`/api/projects/${id}`, { method: "DELETE" });
  print("projectsOutput", res || "ลบโปรเจกต์แล้ว");
  showToast("ลบโปรเจกต์แล้ว");
});

submit("addParticipantForm", async () => {
  const projectId = parseInteger(el("participantProjectId").value, "Project ID");
  const memberId = parseInteger(el("participantMemberId").value, "Member ID");
  const res = await request("/api/participants/add", { method: "POST", query: { projectId, memberId } });
  print("participantsOutput", res || "เพิ่มผู้เข้าร่วมแล้ว");
  showToast("เพิ่มผู้เข้าร่วมแล้ว");
});

submit("removeParticipantForm", async () => {
  const id = parseInteger(el("removeParticipantId").value, "Participant ID");
  const res = await request(`/api/participants/${id}`, { method: "DELETE" });
  print("participantsOutput", res || "ลบผู้เข้าร่วมแล้ว");
  showToast("ลบผู้เข้าร่วมแล้ว");
});

submit("listParticipantsForm", async () => {
  const projectId = parseInteger(el("listParticipantProjectId").value, "Project ID");
  const res = await request(`/api/participants/project/${projectId}`);
  print("participantsOutput", res);
  showToast("โหลดผู้เข้าร่วมแล้ว");
});

submit("recordVtForm", async () => {
  const memberId = parseInteger(el("vtMemberId").value, "Member ID");
  const amount = parseNumber(el("vtAmount").value, "ยอดโดเนท", 0.01);
  const res = await request("/api/vt-income/record", { method: "POST", query: { memberId, amount } });
  print("vtOutput", res);
  showToast("บันทึกรายได้ VT แล้ว");
});

el("loadAllVtBtn").addEventListener("click", async () => {
  try {
    const res = await request("/api/vt-income");
    print("vtOutput", res);
    showToast("โหลดรายได้ VT แล้ว");
  } catch (err) {
    showToast(err.message, true);
  }
});

submit("loadMemberVtForm", async () => {
  const memberId = parseInteger(el("loadVtMemberId").value, "Member ID");
  const res = await request(`/api/vt-income/member/${memberId}`);
  print("vtOutput", res);
  showToast("โหลดรายได้ VT ตามสมาชิกแล้ว");
});

el("loadAllStatementsBtn").addEventListener("click", async () => {
  try {
    const res = await request("/api/statements");
    print("statementOutput", res);
    showToast("โหลด Statement ทั้งหมดแล้ว");
  } catch (err) {
    showToast(err.message, true);
  }
});

el("loadCompanyStatementsBtn").addEventListener("click", async () => {
  try {
    const res = await request("/api/statements/company");
    print("statementOutput", res);
    showToast("โหลด Statement ฝั่งค่ายแล้ว");
  } catch (err) {
    showToast(err.message, true);
  }
});

submit("loadMemberStatementsForm", async () => {
  const memberId = parseInteger(el("statementMemberId").value, "Member ID");
  const res = await request(`/api/statements/member/${memberId}`);
  print("statementOutput", res);
  showToast("โหลด Statement ตามสมาชิกแล้ว");
});
