// 1. هيكلة بيانات الطالب (Class & Constructor)
class Student {
  constructor(id, name, grades, attendance) {
    this.id = id;
    this.name = name;
    this.grades = grades;       // مصفوفة درجات 3 مواد
    this.attendance = attendance; // نسبة الحضور
  }

  // دالة حساب المتوسط ( باستخدام reduce )
  calculateAverage() {
    const sum = this.grades.reduce((total, grade) => total + grade, 0);
    return sum / this.grades.length;
  }

  // دالة التقدير بناءً على المتوسط
  getLetterGrade(avg) {
    if (avg >= 90) return 'A';
    else if (avg >= 80) return 'B';
    else if (avg >= 70) return 'C';
    else if (avg >= 60) return 'D';
    else if (avg >= 50) return 'E';
    else return 'F';
  }

  // دالة النتيجة النهائية (شرطين: المتوسط 50 فأكثر && الحضور 75 فأكثر)
  getFinalResult(avg) {
    if (avg >= 50 && this.attendance >= 75) {
      return 'ناجح';
    } else {
      return 'يحتاج مراجعة';
    }
  }
}

// 3. نظام تشغيل الجامعة (Objects Array)
const studentsList = [
  new Student(1, 'أحمد محمد', [85, 90, 88], 85),
  new Student(2, 'محمود علي', [42, 45, 44], 80), // طالب متعثر (متوسطه بين 40 و 49)
  new Student(3, 'فاطمة أحمد', [70, 75, 65], 90),
  new Student(4, 'سارة خالد', [46, 41, 43], 78)  // طالب متعثر (متوسطه بين 40 و 49)
];

// 5. المخرجات (Console Logging) - تقرير كل طالب في المصفوفة الرئيسية
console.log('=== تقارير الطلاب في النظام الأساسي ===');
studentsList.forEach(student => {
  const avg = student.calculateAverage();
  const grade = student.getLetterGrade(avg);
  const result = student.getFinalResult(avg);
  
  console.log(`الاسم: ${student.name} | المتوسط: ${avg.toFixed(2)} | التقدير: ${grade} | النتيجة: ${result}`);
});


// 4. لجنة الرأفة (Array Methods)

// أ. الاستخراج: استخدام filter لاستخراج الطلاب الذين تتراوح متوسطاتهم بين 40 و 49
const strugglingStudents = studentsList.filter(student => {
  const avg = student.calculateAverage();
  return avg >= 40 && avg < 50;
});

// ب. المعالجة: استخدام map لإضافة 5 درجات رأفة لمتوسطاتهم
const mercyStudents = strugglingStudents.map(student => {
  const oldAvg = student.calculateAverage();
  return {
    id: student.id,
    name: student.name,
    originalAverage: oldAvg,
    newAverage: oldAvg + 5,
    attendance: student.attendance
  };
});

// ج. التحليل: استخدام reduce لجمع المتوسطات الجديدة بعد التعديل
const totalNewAverages = mercyStudents.reduce((sum, student) => sum + student.newAverage, 0);

// د. متوسط الرأفة (مع درع حماية لمنع القسمة على صفر في حال خلو المصفوفة)
const mercyGroupAverage = mercyStudents.length > 0 ? totalNewAverages / mercyStudents.length : 0;


// طباعة نتائج لجنة الرأفة
console.log('\n=== قائمة الطلاب المتعثرين بعد إضافة درجات الرأفة ===');
console.table(mercyStudents);

console.log(`\nمتوسط درجات الطلاب المتعثرين بعد التعديل: ${mercyGroupAverage.toFixed(2)}`);