import React from 'react';

export default function ExamMarksTable({ students, examType, onMarksChange, marks = {} }) {
  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full text-sm">
        <thead>
          <tr className="text-gray-500 border-b">
            <th className="p-2 text-left">Roll No</th>
            <th className="p-2 text-left">Student Name</th>
            <th className="p-2 text-center">Marks</th>
            <th className="p-2 text-center">Grade</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => {
            const studentId = student._id;
            const currentMarks = marks[studentId] || { marks: '', grade: '' };
            const marksValue = currentMarks.marks || currentMarks.marksObtained || '';
            const gradeValue = currentMarks.grade || '';

            return (
              <tr key={studentId} className="border-b hover:bg-indigo-50">
                <td className="p-2">{student.roll_number || '-'}</td>
                <td className="p-2">{student.user_id?.name || student.name || 'Student'}</td>
                <td className="p-2 text-center">
                  {onMarksChange ? (
                    <input
                      type="number"
                      value={marksValue}
                      onChange={(e) => onMarksChange(studentId, 'marks', e.target.value)}
                      className="w-16 px-2 py-1 border border-gray-300 rounded text-center"
                      placeholder="0"
                      min="0"
                      max="100"
                    />
                  ) : (
                    <span>{marksValue}</span>
                  )}
                </td>
                <td className="p-2 text-center">
                  {onMarksChange ? (
                    <input
                      type="text"
                      value={gradeValue}
                      onChange={(e) => onMarksChange(studentId, 'grade', e.target.value)}
                      className="w-12 px-2 py-1 border border-gray-300 rounded text-center"
                      placeholder="A"
                      maxLength="2"
                    />
                  ) : (
                    <span className="font-semibold">{gradeValue}</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
