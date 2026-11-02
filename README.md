/* ==========================================================
   Task 2: Student Results Management & Analysis Engine
   Console-Based Application (Refactored)
   ========================================================== */

/* ----------------------------------------------------------
   1) Student Class & Constructor
   ---------------------------------------------------------- */
class Student {
  constructor(id, name, grades, attendance) {
    // Validation
    if (!Array.isArray(grades) || grades.length !== 3) {
      throw new Error(`Student ${id}: grades must be an array of 3 subjects`);
    }

    this.id = id;
    this.name = name;
    // Clamp grades to 0-100 to keep data sane
    this.grades = grades.map((g) => Math.min(100, Math.max(0, g)));
    // Clamp attendance to 0-100
    this.attendance = Math.min(100, Math.max(0, attendance));
  }

  /* --------------------------------------------------------
     2) Academic Analysis Methods
     -------------------------------------------------------- */

  // (a) Calculate average using reduce
  getAverage() {
    if (!this.grades.length) return 0;
    const total = this.grades.reduce((sum, grade) => sum + grade, 0);
    return total / this.grades.length;
  }

  // (b) Get letter grade (instance method — uses this.getAverage)
  getGrade() {
    const avg = this.getAverage();
    if (avg >= 90) return "A";
    else if (avg >= 80) return "B";
    else if (avg >= 70) return "C";
    else if (avg >= 60) return "D";
    else if (avg >= 50) return "E";
    else return "F";
  }

  // (c) Pass check using && operator
  isPassing() {
    return this.getAverage() >= 50 && this.attendance >= 75;
  }

  // (d) Final result (Arabic)
  getFinalResult() {
    return this.isPassing() ? "ناجح" : "يحتاج مراجعة";
  }

  // (e) Reason for failure (helpful for reporting)
  getFailureReason() {
    if (this.isPassing()) return null;
    const failedGrades = this.getAverage() < 50;
    const failedAttendance = this.attendance < 75;

    if (failedGrades && failedAttendance) return "درجات وحضور";
    if (failedGrades) return "درجات";
    if (failedAttendance) return "حضور";
    return "غير محدد";
  }

  // (f) Immutable bonus application (returns NEW Student)
  withBonus(points = 5) {
    const newGrades = this.grades.map((g) =>
      Math.min(100, Math.max(0, g + points))
    );
    return new Student(this.id, this.name, newGrades, this.attendance);
  }
}

/* ----------------------------------------------------------
   3) University System - Objects Array
   ---------------------------------------------------------- */
const studentsList = [
  new Student(101, "أحمد محمد",   [85, 90, 78], 90),   // avg 84.33 - ناجح
  new Student(102, "سارة علي",    [45, 48, 42], 80),   // avg 45.00 - متعثرة
  new Student(103, "خالد يوسف",   [70, 65, 72], 60),   // avg 69.00 - حضور ضعيف
  new Student(104, "منى إبراهيم", [40, 47, 46], 85),   // avg 44.33 - متعثرة
];

/* ----------------------------------------------------------
   4) Mercy Committee (Array Methods)
   ---------------------------------------------------------- */

// (a) Filter struggling students (avg between 40 and 49.99)
const strugglingStudents = studentsList.filter((student) => {
  const avg = student.getAverage();
  return avg >= 40 && avg < 50;
});

// (b) Apply +5 bonus to each subject using map (creates new Students)
const mercyStudents = strugglingStudents.map((student) => student.withBonus(5));

// (c) Sum new averages using reduce
const totalMercyAverage = mercyStudents.reduce(
  (sum, student) => sum + student.getAverage(),
  0
);

// (d) Calculate mercy average with zero-division protection
const mercyAverage =
  mercyStudents.length > 0 ? totalMercyAverage / mercyStudents.length : 0;

// (e) Split mercy students into "saved" vs "still failing"
const savedStudents = mercyStudents.filter((s) => s.isPassing());
const stillFailingStudents = mercyStudents.filter((s) => !s.isPassing());

// (f) Attendance-only failures (not covered by mercy) — for reporting
const attendanceFailingStudents = studentsList.filter(
  (s) => s.getAverage() >= 50 && s.attendance < 75
);

/* ----------------------------------------------------------
   5) Console Logging (Outputs)
   ---------------------------------------------------------- */

console.log("============================================================");
console.log("📊 تقرير نتائج الطلاب - الجامعة");
console.log("============================================================");

// Full report for each student
studentsList.forEach((student) => {
  const avg = student.getAverage();
  const reason = student.getFailureReason();

  console.log(`\n👤 الاسم: ${student.name}`);
  console.log(`   🆔 رقم الجلوس: ${student.id}`);
  console.log(`   📚 الدرجات: [${student.grades.join(", ")}]`);
  console.log(`   📈 المتوسط: ${avg.toFixed(2)}`);
  console.log(`   🏅 التقدير: ${student.getGrade()}`);
  console.log(`   📋 النتيجة: ${student.getFinalResult()}`);
  console.log(`   🎯 الحضور: ${student.attendance}%`);
  if (reason) console.log(`   ⚠️  سبب التعثر: ${reason}`);
  console.log("-".repeat(60));
});

// Mercy students — saved
console.log("\n🤝 الطلاب الذين شملتهم الرأفة ونجحوا بعد التعديل:");
if (savedStudents.length > 0) {
  savedStudents.forEach((student) => {
    console.log(
      `   ✅ ${student.name} (ID: ${student.id}) - المتوسط بعد الرأفة: ${student
        .getAverage()
        .toFixed(2)}`
    );
  });
} else {
  console.log("   ⚠️ لا يوجد طلاب نجحوا بعد الرأفة");
}

// Mercy students — still failing
if (stillFailingStudents.length > 0) {
  console.log("\n❌ طلاب شملتهم الرأفة ولكنهم ما زالوا متعثرين:");
  stillFailingStudents.forEach((student) => {
    console.log(
      `   ⛔ ${student.name} (ID: ${student.id}) - المتوسط بعد الرأفة: ${student
        .getAverage()
        .toFixed(2)} (يحتاجون دعماً إضافياً)`
    );
  });
}

// Attendance-only failures (not in mercy scope)
if (attendanceFailingStudents.length > 0) {
  console.log("\n📅 طلاب رسبوا بسبب الحضور فقط (خارج نطاق الرأفة):");
  attendanceFailingStudents.forEach((student) => {
    console.log(
      `   ⚠️  ${student.name} (ID: ${student.id}) - الحضور: ${student.attendance}% - المتوسط: ${student
        .getAverage()
        .toFixed(2)}`
    );
  });
}

// Mercy average
console.log("\n📌 متوسط درجات الطلاب المتعثرين بعد التعديل:");
console.log(`   ➡️ ${mercyAverage.toFixed(2)}`);

console.log("\n============================================================");
console.log("✅ انتهى التقرير");
console.log("============================================================");
