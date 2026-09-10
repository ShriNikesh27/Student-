const STORAGE_KEY = "studentAttendanceManagement_v1";

let students = loadStudents();
let searchTerm = "";

const studentForm = document.getElementById("studentForm");
const editStudentId = document.getElementById("editStudentId");
const studentName = document.getElementById("studentName");
const rollNumber = document.getElementById("rollNumber");
const studentClass = document.getElementById("studentClass");
const saveStudentBtn = document.getElementById("saveStudentBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const searchInput = document.getElementById("searchInput");
const tableBody = document.getElementById("studentTableBody");
const emptyState = document.getElementById("emptyState");
const toast = document.getElementById("toast");

document.getElementById("todayDate").textContent = formatDate(new Date());

studentForm.addEventListener("submit", handleStudentSubmit);
cancelEditBtn.addEventListener("click", cancelEdit);
searchInput.addEventListener("input", (event) => {
  searchTerm = event.target.value.trim().toLowerCase();
  render();
});

tableBody.addEventListener("click", handleTableClick);

render();

function loadStudents() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Could not load LocalStorage data:", error);
    return [];
  }
}

function saveStudents() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

function todayKey() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function handleStudentSubmit(event) {
  event.preventDefault();

  const name = studentName.value.trim();
  const roll = rollNumber.value.trim();
  const className = studentClass.value.trim();

  if (!name || !roll || !className) {
    showToast("Please fill in all fields.");
    return;
  }

  const editingId = editStudentId.value;

  if (editingId) {
    const student = students.find(s => s.id === editingId);
    if (student) {
      student.name = name;
      student.roll = roll;
      student.className = className;
      showToast("Student updated successfully.");
    }
  } else {
    const duplicateRoll = students.some(
      s => s.roll.toLowerCase() === roll.toLowerCase()
    );

    if (duplicateRoll) {
      showToast("That roll number already exists.");
      return;
    }

    students.push({
      id: createId(),
      name,
      roll,
      className,
      attendance: {}
    });

    showToast("Student added successfully.");
  }

  saveStudents();
  resetForm();
  render();
}

function handleTableClick(event) {
  const button = event.target.closest("button");
  if (!button) return;

  const id = button.dataset.id;
  const action = button.dataset.action;
  const student = students.find(s => s.id === id);

  if (!student) return;

  if (action === "present" || action === "absent") {
    student.attendance[todayKey()] = action;
    saveStudents();
    render();
    showToast(`${student.name} marked ${action}.`);
  }

  if (action === "edit") {
    startEdit(student);
  }

  if (action === "delete") {
    const confirmed = confirm(`Delete ${student.name}? This will remove the student's attendance history.`);
    if (confirmed) {
      students = students.filter(s => s.id !== id);
      saveStudents();
      render();
      showToast("Student deleted.");
    }
  }
}

function startEdit(student) {
  editStudentId.value = student.id;
  studentName.value = student.name;
  rollNumber.value = student.roll;
  studentClass.value = student.className;
  saveStudentBtn.textContent = "Update Student";
  cancelEditBtn.classList.remove("hidden");
  studentName.focus();
  window.scrollTo({ top: 250, behavior: "smooth" });
}

function cancelEdit() {
  resetForm();
}

function resetForm() {
  studentForm.reset();
  editStudentId.value = "";
  saveStudentBtn.textContent = "Add Student";
  cancelEditBtn.classList.add("hidden");
}

function render() {
  const filtered = students.filter(student => {
    const text = `${student.name} ${student.roll} ${student.className}`.toLowerCase();
    return text.includes(searchTerm);
  });

  tableBody.innerHTML = "";

  filtered.forEach((student, index) => {
    const status = student.attendance[todayKey()] || "unmarked";
    const percentage = calculateAttendance(student);

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${index + 1}</td>
      <td><span class="student-name">${escapeHtml(student.name)}</span></td>
      <td>${escapeHtml(student.roll)}</td>
      <td>${escapeHtml(student.className)}</td>
      <td>
        <div class="status-actions">
          <button class="attendance-btn present ${status === "present" ? "active" : ""}"
                  data-id="${student.id}" data-action="present">Present</button>
          <button class="attendance-btn absent ${status === "absent" ? "active" : ""}"
                  data-id="${student.id}" data-action="absent">Absent</button>
        </div>
      </td>
      <td>
        <span class="badge ${status}">${percentage}%</span>
      </td>
      <td>
        <div class="row-actions">
          <button class="icon-btn" data-id="${student.id}" data-action="edit">Edit</button>
          <button class="icon-btn delete" data-id="${student.id}" data-action="delete">Delete</button>
        </div>
      </td>
    `;

    tableBody.appendChild(row);
  });

  emptyState.style.display = filtered.length === 0 ? "block" : "none";
  updateSummary();
}

function calculateAttendance(student) {
  const records = Object.values(student.attendance || {});
  const totalMarkedDays = records.length;

  if (totalMarkedDays === 0) return 0;

  const presentDays = records.filter(status => status === "present").length;
  return Math.round((presentDays / totalMarkedDays) * 100);
}

function updateSummary() {
  const today = todayKey();
  const total = students.length;
  const present = students.filter(s => s.attendance[today] === "present").length;
  const absent = students.filter(s => s.attendance[today] === "absent").length;

  // Percentage is based on students whose attendance has been marked today.
  const marked = present + absent;
  const percentage = marked === 0 ? 0 : Math.round((present / marked) * 100);

  document.getElementById("totalStudents").textContent = total;
  document.getElementById("presentStudents").textContent = present;
  document.getElementById("absentStudents").textContent = absent;
  document.getElementById("attendancePercentage").textContent = `${percentage}%`;
}

function createId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function formatDate(date) {
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
