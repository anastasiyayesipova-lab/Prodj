// @ts-nocheck
import {
  getPasses, getPassStats, createPass, deletePass, getPassById, updatePass,
  getUsers, getUserById, createUser, updateUser, deleteUser,
  getCurrentUserId, setCurrentUserId,
} from "./apiClient.js";

let passes = [];
let users = [];
let sortField = null;
let sortDirection = 1;
let editingId = null;
let editingUserId = null;
let editingPassUserId = null;

const reasonMap = {
  "Навчальне заняття": 1,
  "Олімпіада": 2,
  "Проєкт": 3,
  "Консультація": 4,
};
const reasonAliases = { "Проєктна робота": "Проєкт" };

const $ = (id) => document.getElementById(id);
const form = $("passForm");
const selectedUserNameEl = $("selectedUserName");
const reasonEl = $("reason");
const validDateEl = $("validDate");
const commentEl = $("comment");
const issuerEl = $("issuer");
const submitBtn = $("submitBtn");
const resetBtn = $("resetBtn");
const statusMessage = $("statusMessage");
const statsMessage = $("statsMessage");
const passesTable = $("passesTable");
const passesTbody = $("passesTbody");
const filterIssuerEl = $("filterIssuer");
const filterReasonEl = $("filterReason");
const currentUserEl = $("currentUser");
const currentUserInfoEl = $("currentUserInfo");
const usersTbody = $("usersTbody");
const userForm = $("userForm");
const newUserNameEl = $("newUserName");
const newUserRoleEl = $("newUserRole");
const userSubmitBtn = $("userSubmitBtn");
const userResetBtn = $("userResetBtn");

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatDate(dateString) {
  return dateString ? dateString.split("-").reverse().join(".") : "—";
}

function showStatus(text, isError = false) {
  statusMessage.hidden = false;
  statusMessage.textContent = text;
  statusMessage.style.color = isError ? "crimson" : "green";
}

function hideStatus() {
  statusMessage.hidden = true;
  statusMessage.textContent = "";
}

function currentUser() {
  return users.find((u) => String(u.id) === String(getCurrentUserId()));
}

function isAdmin() {
  return currentUser()?.role === "admin";
}

function uniqueEmail(name) {
  const base = name.toLowerCase().replace(/[^a-zа-яіїєґ0-9]+/gi, ".").replace(/^\.|\.$/g, "") || "user";
  return `${base}.${Date.now()}@test.com`;
}

async function ensureUserByName(name) {
  const existing = users.find((u) => u.displayName.toLowerCase() === name.toLowerCase());
  if (existing) return existing;

  if (!isAdmin() && name.toLowerCase() !== currentUser()?.displayName.toLowerCase()) {
    throw { status: 403, message: "Звичайний user може створювати заявки тільки для себе" };
  }

  const created = await createUser({ name, email: uniqueEmail(name), role: "user" });
  await loadUsers(false);
  return created;
}

function clearErrors() {
  ["errUserName", "errReason", "errValidDate", "errComment", "errIssuer"].forEach((id) => ($(id).textContent = ""));
  [reasonEl, validDateEl, commentEl, issuerEl].forEach((el) => el.classList.remove("is-invalid"));
}

function setInvalid(inputEl, errorId, msg) {
  if (inputEl) inputEl.classList.add("is-invalid");
  $(errorId).textContent = msg;
}

function formUser() {
  if (editingId && editingPassUserId) return users.find((u) => String(u.id) === String(editingPassUserId));
  return currentUser();
}

function readForm() {
  const selectedUser = formUser();
  return {
    userId: selectedUser?.id || "",
    userName: selectedUser?.displayName || "",
    reason: reasonAliases[reasonEl.value] || reasonEl.value,
    validDate: validDateEl.value,
    comment: commentEl.value.trim(),
    issuer: issuerEl.value.trim(),
  };
}

function validateForm(data) {
  clearErrors();
  hideStatus();
  let ok = true;
  if (!data.userName) { setInvalid(null, "errUserName", "Оберіть поточного користувача зверху."); ok = false; }
  if (!data.reason) { setInvalid(reasonEl, "errReason", "Оберіть причину."); ok = false; }
  if (!data.validDate) { setInvalid(validDateEl, "errValidDate", "ValidDate обовʼязкова."); ok = false; }
  else if (data.validDate < todayISO()) { setInvalid(validDateEl, "errValidDate", "Дата не може бути в минулому."); ok = false; }
  if (!data.issuer) { setInvalid(issuerEl, "errIssuer", "Issuer обовʼязковий."); ok = false; }
  if (data.comment.length > 250) { setInvalid(commentEl, "errComment", "Comment: максимум 250 символів."); ok = false; }
  submitBtn.disabled = !ok;
  return ok;
}

function getFilteredPasses() {
  const issuer = filterIssuerEl.value.trim().toLowerCase();
  const reason = reasonAliases[filterReasonEl.value] || filterReasonEl.value;
  const result = passes.filter((p) =>
    (p.issuer || "").toLowerCase().includes(issuer) && (!reason || p.reasonName === reason)
  );
  if (sortField) result.sort((a, b) => sortDirection * String(a[sortField] ?? "").localeCompare(String(b[sortField] ?? "")));
  return result;
}

function renderPasses() {
  const filtered = getFilteredPasses();
  passesTable.hidden = filtered.length === 0;
  passesTbody.textContent = "";

  filtered.forEach((p, index) => {
    const tr = document.createElement("tr");
    [index + 1, p.userName, p.reasonName, formatDate(p.validDate), p.comment || "—", p.issuer].forEach((value) => {
      const td = document.createElement("td");
      td.textContent = value ?? "—";
      tr.appendChild(td);
    });

    const actionsTd = document.createElement("td");
    actionsTd.className = "actions";
    actionsTd.innerHTML = `
      <button type="button" data-action="details" data-id="${p.id}">Деталі</button>
      <button type="button" data-action="edit" data-id="${p.id}">Редагувати</button>
      <button type="button" data-action="delete" data-id="${p.id}">Видалити</button>
    `;
    tr.appendChild(actionsTd);
    passesTbody.appendChild(tr);
  });
}

function renderUsers() {
  currentUserEl.textContent = "";
  users.forEach((u) => {
    const opt = document.createElement("option");
    opt.value = u.id;
    opt.textContent = `${u.displayName} (${u.role})`;
    currentUserEl.appendChild(opt);
  });
  currentUserEl.value = getCurrentUserId();
  currentUserInfoEl.textContent = currentUser() ? `role: ${currentUser().role}` : "";

  const selectedForForm = formUser();
  selectedUserNameEl.textContent = selectedForForm ? `${selectedForForm.displayName} (${selectedForForm.role})` : "—";

  usersTbody.textContent = "";
  users.forEach((u) => {
    const tr = document.createElement("tr");
    [u.displayName, u.role].forEach((value) => {
      const td = document.createElement("td");
      td.textContent = value;
      tr.appendChild(td);
    });
    const td = document.createElement("td");
    td.className = "actions";
    td.innerHTML = `<button data-user-action="edit" data-id="${u.id}">Редагувати</button><button data-user-action="delete" data-id="${u.id}">Видалити</button>`;
    tr.appendChild(td);
    usersTbody.appendChild(tr);
  });
}

function resetForm() {
  form.reset();
  clearErrors();
  hideStatus();
  validDateEl.min = todayISO();
  editingId = null;
  editingPassUserId = null;
  selectedUserNameEl.textContent = currentUser() ? `${currentUser().displayName} (${currentUser().role})` : "—";
  submitBtn.textContent = "Додати";
  $("formTitle").textContent = "Нова заявка";
  submitBtn.disabled = true;
}

function resetUserForm() {
  userForm.reset();
  editingUserId = null;
  userSubmitBtn.textContent = "Додати user";
  delete newUserNameEl.dataset.email;
}

async function loadUsers(reloadPasses = true) {
  const response = await getUsers();
  users = response.items || [];
  if (!users.some((u) => String(u.id) === String(getCurrentUserId())) && users[0]) setCurrentUserId(users[0].id);
  renderUsers();
  if (reloadPasses) await loadPasses();
}

async function loadPasses() {
  try {
    showStatus("Завантаження...");
    const response = await getPasses();
    passes = response.items || [];
    renderPasses();
    await loadStats();
    passes.length ? hideStatus() : showStatus("Немає даних");
  } catch (err) {
    passes = [];
    renderPasses();
    showStatus(`Помилка (${err.status}): ${err.message}`, true);
  }
}

async function loadStats() {
  try {
    const response = await getPassStats();
    const total = (response.data || []).reduce((sum, item) => sum + Number(item.count), 0);
    statsMessage.textContent = `Всього видимих заявок: ${total}`;
  } catch {
    statsMessage.textContent = "";
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = readForm();
  if (!validateForm(data)) return showStatus("Виправте помилки у формі.", true);

  try {
    submitBtn.disabled = true;
    const dto = {
      userId: Number(data.userId),
      reasonId: reasonMap[data.reason],
      statusId: 1,
      validDate: data.validDate,
      comment: data.comment,
      issuer: data.issuer,
    };
    const wasEditing = Boolean(editingId);
    if (editingId) await updatePass(editingId, dto);
    else await createPass(dto);
    resetForm();
    await loadUsers();
    showStatus(wasEditing ? "Запис оновлено" : "Запис додано");
  } catch (err) {
    showStatus(`Помилка (${err.status}): ${err.message}`, true);
  } finally {
    submitBtn.disabled = false;
  }
});

resetBtn.addEventListener("click", resetForm);
[reasonEl, validDateEl, commentEl, issuerEl].forEach((el) => {
  el.addEventListener("input", () => validateForm(readForm()));
  el.addEventListener("change", () => validateForm(readForm()));
});

currentUserEl.addEventListener("change", async () => {
  setCurrentUserId(currentUserEl.value);
  renderUsers();
  resetForm();
  await loadPasses();
});

filterIssuerEl.addEventListener("input", renderPasses);
filterReasonEl.addEventListener("change", renderPasses);

passesTable.querySelector("thead").addEventListener("click", (event) => {
  const th = event.target.closest("th[data-sort]");
  if (!th) return;
  sortDirection = sortField === th.dataset.sort ? sortDirection * -1 : 1;
  sortField = th.dataset.sort;
  renderPasses();
});

passesTbody.addEventListener("click", async (event) => {
  const btn = event.target.closest("button[data-action]");
  if (!btn) return;
  try {
    if (btn.dataset.action === "details") {
      const pass = await getPassById(btn.dataset.id);
      showStatus(`${pass.userName} | ${pass.reasonName} | ${formatDate(pass.validDate)} | ${pass.comment || "—"} | ${pass.issuer}`);
    }
    if (btn.dataset.action === "edit") {
      const pass = await getPassById(btn.dataset.id);
      editingId = pass.id;
      const passUser = users.find((u) => u.displayName === pass.userName);
      editingPassUserId = passUser?.id || getCurrentUserId();
      selectedUserNameEl.textContent = passUser ? `${passUser.displayName} (${passUser.role})` : pass.userName;
      reasonEl.value = pass.reasonName || "";
      validDateEl.value = pass.validDate;
      commentEl.value = pass.comment || "";
      issuerEl.value = pass.issuer || "";
      submitBtn.textContent = "Оновити";
      $("formTitle").textContent = "Редагування заявки";
      validateForm(readForm());
    }
    if (btn.dataset.action === "delete") {
      if (!confirm("Видалити запис?")) return;
      await deletePass(btn.dataset.id);
      await loadPasses();
      showStatus("Запис видалено");
    }
  } catch (err) {
    showStatus(`Помилка (${err.status}): ${err.message}`, true);
  }
});

userForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = newUserNameEl.value.trim();
  const email = editingUserId ? (newUserNameEl.dataset.email || uniqueEmail(name)) : uniqueEmail(name);
  const dto = { name, email, role: newUserRoleEl.value };
  if (!dto.name || !dto.role) return showStatus("Заповніть дані user.", true);
  try {
    if (editingUserId) await updateUser(editingUserId, dto);
    else await createUser(dto);
    resetUserForm();
    await loadUsers();
    showStatus(editingUserId ? "User оновлено" : "User додано");
  } catch (err) {
    showStatus(`Помилка (${err.status}): ${err.message}`, true);
  }
});

userResetBtn.addEventListener("click", resetUserForm);

usersTbody.addEventListener("click", async (event) => {
  const btn = event.target.closest("button[data-user-action]");
  if (!btn) return;
  try {
    if (btn.dataset.userAction === "edit") {
      const user = await getUserById(btn.dataset.id);
      editingUserId = user.id;
      newUserNameEl.value = user.displayName;
      newUserNameEl.dataset.email = user.email || uniqueEmail(user.displayName);
      newUserRoleEl.value = user.role;
      userSubmitBtn.textContent = "Оновити user";
    }
    if (btn.dataset.userAction === "delete") {
      if (!confirm("Видалити user?")) return;
      await deleteUser(btn.dataset.id);
      if (String(getCurrentUserId()) === String(btn.dataset.id)) setCurrentUserId("1");
      await loadUsers();
      showStatus("User видалено");
    }
  } catch (err) {
    showStatus(`Помилка (${err.status}): ${err.message}`, true);
  }
});

validDateEl.min = todayISO();
loadUsers();
validateForm(readForm());
