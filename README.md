# Student Attendance Management Website

A beginner-friendly real-world attendance project built with:

- HTML
- CSS
- JavaScript
- LocalStorage

No backend, MySQL, Java, Node.js, or installation is required.

## 1. Project structure

```text
student-attendance-management/
├── index.html
├── style.css
├── script.js
└── README.md
```

## 2. Run the project

### Easiest method

1. Download/extract the ZIP.
2. Open the `student-attendance-management` folder.
3. Double-click `index.html`.
4. The website opens in your browser.
5. Add students and start marking attendance.

### Recommended method in VS Code

1. Open VS Code.
2. Select **File > Open Folder**.
3. Select the `student-attendance-management` folder.
4. Open `index.html`.
5. Either:
   - right-click `index.html` and use a Live Server extension if installed, or
   - double-click the file in Windows Explorer.

The project works without Live Server.

## 3. How the project works

### Add student

The form collects:

- Student name
- Roll number
- Class

JavaScript creates a student object:

```javascript
{
  id: "unique-id",
  name: "Arun Kumar",
  roll: "101",
  className: "BCA 2nd Year",
  attendance: {}
}
```

The object is then saved into LocalStorage.

### Mark attendance

Click **Present** or **Absent**.

The program uses the current date as a key:

```text
2026-09-10
```

Example:

```javascript
attendance: {
  "2026-09-10": "present",
  "2026-09-11": "absent"
}
```

This means the same student can have attendance records for many days.

## 4. Attendance calculation

For an individual student:

```text
Attendance % = (Present Days / Marked Days) × 100
```

Example:

```text
Present = 8
Absent = 2
Marked Days = 10

Attendance = (8 / 10) × 100
           = 80%
```

For today's dashboard:

```text
Today's Attendance % =
(Today's Present Students / Today's Marked Students) × 100
```

Important: students who have not been marked today are not counted in today's percentage.

Example:

```text
Total students = 30
Present = 25
Absent = 3
Unmarked = 2

Today's percentage = 25 / (25 + 3) × 100
                   = 89%
```

## 5. How LocalStorage works

LocalStorage is browser storage that keeps data as key/value strings.

This project uses:

```javascript
const STORAGE_KEY = "studentAttendanceManagement_v1";
```

When saving:

```javascript
localStorage.setItem(
  STORAGE_KEY,
  JSON.stringify(students)
);
```

When reading:

```javascript
const saved = localStorage.getItem(STORAGE_KEY);
const students = JSON.parse(saved);
```

`JSON.stringify()` converts the JavaScript array/object into text.

`JSON.parse()` converts that text back into JavaScript data.

The data normally remains after closing and reopening the browser.

### Important limitation

LocalStorage is tied to the browser/device.

It is not a real school database and does not automatically sync between computers.

If browser site data is cleared, the attendance data can be lost.

For a production system, a backend/database would be better.

## 6. Test every feature

### Test 1 — Dashboard

Add three students.

Expected:

```text
Total Students = 3
Present = 0
Absent = 0
Attendance = 0%
```

### Test 2 — Add student

Enter:

```text
Name: Arun Kumar
Roll: 101
Class: BCA 2nd Year
```

Click **Add Student**.

The student should appear in the table.

### Test 3 — Present

Click **Present** for Arun.

Expected:

- Present becomes 1.
- Absent remains 0.
- Today's percentage becomes 100%.
- Arun's attendance becomes 100%.

### Test 4 — Absent

Add another student and click **Absent**.

Expected:

- Present = 1
- Absent = 1
- Today's percentage = 50%

### Test 5 — Individual attendance

For one student:

Day 1 = Present
Day 2 = Present
Day 3 = Absent
Day 4 = Present

Expected:

```text
Present = 3
Marked = 4
Attendance = 75%
```

You can simulate another day by temporarily changing the computer date, or simply inspect the data in browser developer tools.

### Test 6 — Edit

Click **Edit**.

Change the student's class or name.

Click **Update Student**.

The table should show the updated information while keeping attendance history.

### Test 7 — Delete

Click **Delete**.

Confirm the browser prompt.

The student and their attendance history are removed.

### Test 8 — Search

Type part of:

- a name
- roll number
- class

Only matching students should remain visible.

### Test 9 — LocalStorage persistence

1. Add students.
2. Mark attendance.
3. Close the browser tab.
4. Open `index.html` again.

The data should still be there.

## 7. View LocalStorage manually

In Chrome/Edge:

1. Open the website.
2. Press `F12`.
3. Open the **Application** tab.
4. Find **Local Storage**.
5. Select the website/file origin.
6. Look for:

```text
studentAttendanceManagement_v1
```

The stored value is JSON.

## 8. Common errors

### Error: Nothing appears after opening index.html

Check that:

```text
index.html
style.css
script.js
```

are all in the same folder.

### Error: Page has no design

Check that this exists in `index.html`:

```html
<link rel="stylesheet" href="style.css">
```

### Error: Buttons do not work

Check that this exists at the bottom of `index.html`:

```html
<script src="script.js"></script>
```

### Error: Data disappeared

Possible reasons:

- Browser site data was cleared.
- You opened the project using a different browser.
- You used private/incognito mode.
- LocalStorage was manually deleted.

### Error: Duplicate roll number

The project intentionally prevents two students from using the same roll number.

Use a different roll number or edit the existing student.

### Error: Attendance percentage looks different from expected

Remember:

- Individual percentage uses all marked days.
- Dashboard percentage uses today's marked students only.
- Unmarked students are excluded from today's percentage.

## 9. Future improvements

After learning this version, you can upgrade it with:

1. Login for teachers/admins
2. MySQL database
3. Java Spring Boot backend
4. Student profile pages
5. Monthly attendance reports
6. Date picker for marking previous dates
7. Export attendance to CSV/Excel
8. Printable attendance report
9. Low-attendance warning
10. Charts and analytics
11. Multiple classes
12. Teacher accounts
13. Cloud database
14. Mobile/PWA support

## 10. Beginner learning order

Study the project in this order:

1. HTML form
2. HTML table
3. CSS layout
4. JavaScript variables/functions
5. Arrays and objects
6. DOM manipulation
7. Event listeners
8. LocalStorage
9. JSON.stringify / JSON.parse
10. Attendance calculation

Do not try to memorize the whole project. Understand one function at a time.
