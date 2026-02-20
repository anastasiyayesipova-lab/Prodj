const passes = [];
let nextId = 1;

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

function todayISO() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
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

function addItem(data) {
  const item = { id: nextId++, ...data };
  passes.push(item);
}

function render() {
  if (passes.length === 0) {
    passesTable.hidden = true;
    passesTbody.innerHTML = "";
    return;
  }

  passesTable.hidden = false;

  passesTbody.innerHTML = passes
    .map((p, index) => {
      return `
        <tr>
          <td>${index + 1}</td>
          <td>${p.userName}</td>
          <td>${p.reason}</td>
          <td>${p.validDate}</td>
          <td>${p.comment}</td>
          <td>${p.issuer}</td>
          <td>
            <button type="button" data-action="delete" data-id="${p.id}">Видалити</button>
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
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = readForm();

  if (!validateForm(data)) {
    showStatus("Виправте помилки у формі.", true);
    return;
  }

  addItem(data);
  render();
  showStatus("Запис додано");
  resetForm(); 
});

resetBtn.addEventListener("click", resetForm);

[userNameEl, reasonEl, validDateEl, commentEl, issuerEl].forEach((el) => {
  el.addEventListener("input", () => validateForm(readForm()));
  el.addEventListener("change", () => validateForm(readForm()));
});

passesTbody.addEventListener("click", (event) => {
  const btn = event.target.closest("button[data-action]");
  if (!btn) return;

  if (btn.dataset.action === "delete") {
    const id = Number(btn.dataset.id);
    const index = passes.findIndex((p) => p.id === id);

    if (index !== -1) {
      passes.splice(index, 1);
      render();
      showStatus("Запис видалено");
    }
  }
});

validDateEl.min = todayISO();
submitBtn.disabled = true;
render();
validateForm(readForm());
