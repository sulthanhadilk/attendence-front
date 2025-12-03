import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MonthlyAttendance = ({ profile, onClose }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = localStorage.getItem('token');
  const headers = { Authorization: 'Bearer ' + token };

  useEffect(() => {
    loadMonthlyAttendance();
  }, [selectedMonth]);

  const loadMonthlyAttendance = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Create mock data for now - replace with actual API call
      const mockData = generateMockAttendance(selectedMonth);
      setAttendanceData(mockData);

      // Uncomment when backend endpoint is ready
      // const res = await axios.get(`${API}/api/student/attendance/monthly/${selectedMonth}`, { headers });
      // setAttendanceData(res.data);
    } catch (err) {
      setError('Failed to load attendance data');
      console.error('Error loading monthly attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateMockAttendance = (month) => {
    const year = parseInt(month.split('-')[0]);
    const monthNum = parseInt(month.split('-')[1]) - 1;
    const daysInMonth = new Date(year, monthNum + 1, 0).getDate();
    
    const attendanceRecords = [];
    const subjects = profile.subjects || [
      { name: 'Mathematics', code: 'MATH101' },
      { name: 'Computer Science', code: 'CS101' },
      { name: 'Physics', code: 'PHY101' },
      { name: 'English', code: 'ENG101' }
    ];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, monthNum, day);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      // Skip weekends
      if (dayName === 'Sat' || dayName === 'Sun') continue;
      
      const dayAttendance = {
        date: date.toISOString().split('T')[0],
        dayName,
        subjects: subjects.map(subject => ({
          ...subject,
          status: Math.random() > 0.15 ? 'present' : 'absent', // 85% attendance rate
          teacher: `Prof. ${subject.code.substring(0, 3)}`,
          period: Math.floor(Math.random() * 6) + 1
        })),
        overall: Math.random() > 0.1 ? 'present' : 'absent'
      };
      
      attendanceRecords.push(dayAttendance);
    }

    return {
      month,
      records: attendanceRecords,
      summary: {
        totalDays: attendanceRecords.length,
        presentDays: attendanceRecords.filter(r => r.overall === 'present').length,
        absentDays: attendanceRecords.filter(r => r.overall === 'absent').length,
        percentage: Math.round((attendanceRecords.filter(r => r.overall === 'present').length / attendanceRecords.length) * 100)
      }
    };
  };

  const getStatusIcon = (status) => {
    return status === 'present' ? 'fa-check-circle text-success' : 'fa-times-circle text-danger';
  };

  const getStatusColor = (status) => {
    return status === 'present' ? 'success' : 'danger';
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getCurrentMonthName = () => {
    const [year, month] = selectedMonth.split('-');
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content large-modal">
        <div className="modal-header">
          <h3>
            <i className="fas fa-calendar-alt"></i> Monthly Attendance - {getCurrentMonthName()}
          </h3>
          <div className="modal-actions">
            <button className="btn-danger" onClick={onClose}>
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        <div className="modal-body">
          {/* Month Selector */}
          <div className="month-selector mb-4">
            <div className="form-group">
              <label className="form-label">
                <i className="fas fa-calendar"></i> Select Month
              </label>
              <input
                type="month"
                className="form-input"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                max={new Date().toISOString().slice(0, 7)}
              />
            </div>
          </div>

          {loading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading attendance data...</p>
            </div>
          )}

          {error && (
            <div className="alert alert-danger">
              <i className="fas fa-exclamation-triangle"></i> {error}
            </div>
          )}

          {attendanceData && !loading && (
            <>
              {/* Monthly Summary */}
              <div className="attendance-summary mb-4">
                <h4><i className="fas fa-chart-pie"></i> Monthly Summary</h4>
                <div className="summary-grid">
                  <div className="summary-card success">
                    <div className="summary-icon">
                      <i className="fas fa-check-circle"></i>
                    </div>
                    <div className="summary-info">
                      <div className="summary-value">{attendanceData.summary.presentDays}</div>
                      <div className="summary-label">Present Days</div>
                    </div>
                  </div>
                  <div className="summary-card danger">
                    <div className="summary-icon">
                      <i className="fas fa-times-circle"></i>
                    </div>
                    <div className="summary-info">
                      <div className="summary-value">{attendanceData.summary.absentDays}</div>
                      <div className="summary-label">Absent Days</div>
                    </div>
                  </div>
                  <div className="summary-card primary">
                    <div className="summary-icon">
                      <i className="fas fa-percentage"></i>
                    </div>
                    <div className="summary-info">
                      <div className="summary-value">{attendanceData.summary.percentage}%</div>
                      <div className="summary-label">Attendance Rate</div>
                    </div>
                  </div>
                  <div className="summary-card info">
                    <div className="summary-icon">
                      <i className="fas fa-calendar-day"></i>
                    </div>
                    <div className="summary-info">
                      <div className="summary-value">{attendanceData.summary.totalDays}</div>
                      <div className="summary-label">Total School Days</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Daily Attendance Records */}
              <div className="daily-attendance">
                <h4><i className="fas fa-list"></i> Daily Attendance Records</h4>
                <div className="attendance-records">
                  {attendanceData.records.map((record, index) => (
                    <div key={index} className="attendance-day">
                      <div className="day-header">
                        <div className="day-info">
                          <span className="day-date">{new Date(record.date).getDate()}</span>
                          <span className="day-name">{record.dayName}</span>
                        </div>
                        <div className={`day-status ${getStatusColor(record.overall)}`}>
                          <i className={`fas ${getStatusIcon(record.overall)}`}></i>
                          <span>{record.overall}</span>
                        </div>
                      </div>
                      
                      <div className="subjects-attendance">
                        {record.subjects.map((subject, subIndex) => (
                          <div key={subIndex} className="subject-record">
                            <div className="subject-info">
                              <span className="subject-name">{subject.name}</span>
                              <span className="subject-teacher">{subject.teacher}</span>
                            </div>
                            <div className={`subject-status ${getStatusColor(subject.status)}`}>
                              <i className={`fas ${getStatusIcon(subject.status)}`}></i>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .large-modal {
          max-width: 800px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .month-selector {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
        }

        .attendance-summary {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }

        .summary-card {
          background: white;
          border-radius: 8px;
          padding: 15px;
          display: flex;
          align-items: center;
          gap: 15px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .summary-card.success {
          border-left: 4px solid #10b981;
        }

        .summary-card.danger {
          border-left: 4px solid #ef4444;
        }

        .summary-card.primary {
          border-left: 4px solid #3b82f6;
        }

        .summary-card.info {
          border-left: 4px solid #8b5cf6;
        }

        .summary-icon {
          font-size: 1.5rem;
          opacity: 0.8;
        }

        .summary-value {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 2px;
        }

        .summary-label {
          font-size: 0.9rem;
          opacity: 0.7;
        }

        .daily-attendance {
          margin-top: 30px;
        }

        .attendance-records {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-top: 15px;
        }

        .attendance-day {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
        }

        .day-header {
          background: #f9fafb;
          padding: 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e5e7eb;
        }

        .day-info {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .day-date {
          background: #3b82f6;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .day-name {
          font-weight: 600;
          color: #374151;
        }

        .day-status {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .day-status.success {
          background: #d1fae5;
          color: #065f46;
        }

        .day-status.danger {
          background: #fee2e2;
          color: #991b1b;
        }

        .subjects-attendance {
          padding: 15px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .subject-record {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #f3f4f6;
        }

        .subject-record:last-child {
          border-bottom: none;
        }

        .subject-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .subject-name {
          font-weight: 600;
          color: #374151;
        }

        .subject-teacher {
          font-size: 0.85rem;
          color: #6b7280;
        }

        .subject-status {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
        }

        .text-success {
          color: #10b981;
        }

        .text-danger {
          color: #ef4444;
        }

        .loading-container {
          text-align: center;
          padding: 40px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f4f6;
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default MonthlyAttendance;