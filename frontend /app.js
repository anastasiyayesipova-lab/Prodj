import { getPasses, createPass, deletePass, getPassById, updatePass } from "./apiClient.js";
let passes = [];
let sortField = null;
let sortDirection = 1;
let editingId = null;


const form = document.getElementById("passForm");

const userNameEl = document.getElementById("userName");
const reasonEl = document.getElementById("reason");
const validDateEl = document.getElementById("validDate");
const commentEl = document.getElementById("comment");
const issuerEl = document.getElementById("issuer");

const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");

const errUserName = document.getElementById("errUserName");
const errReason = document.getElementById("errReason");
const errValidDate = document.getElementById("errValidDate");
const errComment = document.getElementById("errComment");
const errIssuer = document.getElementById("errIssuer");

const statusMessage = document.getElementById("statusMessage");

const passesTable = document.getElementById("passesTable");
const passesTbody = document.getElementById("passesTbody");
const filterUserNameEl = document.getElementById("filterUserName");
const filterReasonEl = document.getElementById("filterReason");

function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatDate(dateString) {
  return dateString.split("-").reverse().join(".");
}

function showStatus(text, isError = false) {
  statusMessage.hidden = false;
  statusMessage.textContent = text;
  statusMessage.style.color = isError ? "crimson" : "green";
}

async function loadPasses() {
  try {
    showStatus("Завантаження...");

    const response = await getPasses();
    passes = response.items || [];

    render();

    if (passes.length === 0) {
      showStatus("Немає даних");
    } else {
      hideStatus();
    }
  } catch (err) {
    passes = [];
    render();
    showStatus(`Помилка (${err.status}): ${err.message}`, true);
  }
}

function hideStatus() {
  statusMessage.hidden = true;
  statusMessage.textContent = "";
}

function setInvalid(inputEl, errorEl, msg) {
  inputEl.classList.add("is-invalid");
  errorEl.textContent = msg;
}

function clearInvalid(inputEl, errorEl) {
  inputEl.classList.remove("is-invalid");
  errorEl.textContent = "";
}

function clearErrors() {
  clearInvalid(userNameEl, errUserName);
  clearInvalid(reasonEl, errReason);
  clearInvalid(validDateEl, errValidDate);
  clearInvalid(commentEl, errComment);
  clearInvalid(issuerEl, errIssuer);
}

function readForm() {
  return {
    userName: userNameEl.value.trim(),
    reason: reasonEl.value,
    validDate: validDateEl.value,
    comment: commentEl.value.trim(),
    issuer: issuerEl.value.trim(),
  };
}

function validateForm(data) {
  clearErrors();
  hideStatus();
  

  let ok = true;

 if (!data.userName) {
  setInvalid(userNameEl, errUserName, "UserName обовʼязковий.");
  ok = false;
}

  if (!data.reason) {
    setInvalid(reasonEl, errReason, "Оберіть причину.");
    ok = false;
  }

  if (!data.validDate) {
    setInvalid(validDateEl, errValidDate, "ValidDate обовʼязкова.");
    ok = false;
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(data.validDate)) {
    setInvalid(validDateEl, errValidDate, "Невірний формат дати.");
    ok = false;
  } else if (data.validDate < todayISO()) {
    setInvalid(validDateEl, errValidDate, "Дата не може бути в минулому.");
    ok = false;
  }

  if (!data.issuer) {
    setInvalid(issuerEl, errIssuer, "Issuer обовʼязковий.");
    ok = false;
  }

  if (data.comment.length > 250) {
    setInvalid(commentEl, errComment, "Comment: максимум 250 символів.");
    ok = false;
  }

  submitBtn.disabled = !ok;
  return ok;
}


function getFilteredPasses() {
  const userNameFilter = filterUserNameEl.value.trim().toLowerCase();
  const reasonFilter = filterReasonEl.value;

   const result = passes.filter((p) => {
   const matchesUserName = (p.userName ?? "").toLowerCase().includes(userNameFilter);    
const matchesReason =
  !reasonFilter || p.reasonName === reasonFilter ||
  (reasonFilter === "Проєктна робота" && p.reasonName === "Проєкт");
    return matchesUserName && matchesReason;
  });


   
  if(sortField){
    result.sort((a, b) => {
      return sortDirection*String(a[sortField]).localeCompare(String(b[sortField]));
    });
  
  }
  return result;
}


function render() {
  const filteredPasses = getFilteredPasses();
  if (passes.length === 0) {
    passesTable.hidden = true;
    passesTbody.innerHTML = "";
    return;
  }

  passesTable.hidden = false;

  passesTbody.innerHTML = filteredPasses
  .map((p, index) => {
    return `
      <tr>
        <td>${index + 1}</td>
        <td>${p.userName ?? "—"}</td>
        <td>${p.reasonName ?? "—"}</td>
        <td>${formatDate(p.validDate)}</td>
        <td>${p.comment ?? "—"}</td>
        <td>${p.issuer ?? "—"}</td>
        <td>
  <button type="button" data-action="details" data-id="${p.id}">Деталі</button>
  <button type="button" data-action="delete" data-id="${p.id}">Видалити</button>
  <button type="button" data-action="edit" data-id="${p.id}">Редагувати</button>
</td>
      </tr>
    `;
  })
  .join("");
}

function resetForm() {
  form.reset();
  clearErrors();
  hideStatus();
  submitBtn.disabled = true;
  validDateEl.min = todayISO();
  editingId = null;
  submitBtn.textContent = "Додати";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = readForm();

  if (!validateForm(data)) {
    showStatus("Виправте помилки у формі.", true);
    return;
  }

  const reasonMap = {
  "Навчальне заняття": 1,
  "Олімпіада": 2,
  "Проєктна робота": 3,
  "Консультація": 4,
};



  const dto = {
  userId: 1,
  reasonId: reasonMap[data.reason],
  statusId: 1,
  validDate: data.validDate,
  comment: data.comment,
  issuer: data.issuer,
};

  try {
    submitBtn.disabled = true;

    if (editingId) {
  await updatePass(editingId, dto);
  editingId = null;
  submitBtn.textContent = "Додати";
} else {
  await createPass(dto);
}
    resetForm();
    await loadPasses();

    showStatus("Запис додано");
  } catch (err) {
    showStatus(`Помилка (${err.status}): ${err.message}`, true);
  } finally {
    submitBtn.disabled = false;
  }
});

resetBtn.addEventListener("click", resetForm);

[userNameEl, reasonEl, validDateEl, commentEl, issuerEl].forEach((el) => {
  el.addEventListener("input", () => validateForm(readForm()));
  el.addEventListener("change", () => validateForm(readForm()));
});

document.querySelector('.table thead').addEventListener("click", (event) => {
  const th = event.target.closest("th[data-sort]");
  if(!th) return;

  const field = th.dataset.sort;
  if(sortField === field){
    sortDirection *= -1;
  } else{
    sortField = field;
    sortDirection = 1;
  }
  
  render();
});

passesTbody.addEventListener("click", async (event) => {
  const btn = event.target.closest("button[data-action]");
  if (!btn) return;

  if (btn.dataset.action === "edit") {
  try {
    const pass = await getPassById(btn.dataset.id);

    editingId = pass.id;

    userNameEl.value = pass.userName || "";
    reasonEl.value = pass.reasonName || "";
    validDateEl.value = pass.validDate;
    commentEl.value = pass.comment || "";
    issuerEl.value = pass.issuer || "";

    submitBtn.textContent = "Оновити";
  } catch (err) {
    showStatus(`Помилка (${err.status}): ${err.message}`, true);
  }
  return;
}

  if (btn.dataset.action === "details") {
  try {
    showStatus("Завантаження...");

    const pass = await getPassById(btn.dataset.id);

    showStatus(
      ` ${pass.userName} |  ${pass.reasonName} |  ${formatDate(pass.validDate)} |  ${pass.issuer}`
    );
  } catch (err) {
    showStatus(`Помилка (${err.status}): ${err.message}`, true);
  }
  return;
}

  if (btn.dataset.action === "delete") {
    if (!confirm("Видалити запис?")) return;

    try {
      await deletePass(btn.dataset.id);
      await loadPasses();
      showStatus("Запис видалено");
    } catch (err) {
      showStatus(`Помилка (${err.status}): ${err.message}`, true);
    }
  }
});

validDateEl.min = todayISO();
submitBtn.disabled = true;
loadPasses();
validateForm(readForm());

filterUserNameEl.addEventListener("input", render);
filterReasonEl.addEventListener("change", render);