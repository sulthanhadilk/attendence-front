import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiRequest, API_ENDPOINTS } from '../utils/api';
const AIReportGenerator = ({ userRole }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [students, setStudents] = useState([]);
  const [reportType, setReportType] = useState('student');
  const [adminInsights, setAdminInsights] = useState(null);
  useEffect(() => {
    if (userRole === 'admin' || userRole === 'teacher') {
      fetchStudents();
    }
    if (userRole === 'admin') {
      fetchAdminInsights();
    }
  }, [userRole]);
  const fetchStudents = async () => {
    try {
      const response = await apiRequest(API_ENDPOINTS.STUDENTS);
      setStudents(response);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };
  const fetchAdminInsights = async () => {
    try {
      const response = await apiRequest(`${API_ENDPOINTS.AI_BASE}/admin-insights`);
      setAdminInsights(response);
    } catch (error) {
      console.error('Error fetching admin insights:', error);
    }
  };
  const generateReport = async () => {
    if (reportType === 'student' && !selectedStudent) {
      alert('Please select a student');
      return;
    }
    setLoading(true);
    try {
      const endpoint = reportType === 'student' 
        ? `${API_ENDPOINTS.AI_BASE}/generate-report/${selectedStudent}`
        : `${API_ENDPOINTS.AI_BASE}/admin-insights`;
      const response = await apiRequest(endpoint);
      if (reportType === 'student') {
        setReports(prev => [
          {
            id: Date.now(),
            type: 'student',
            studentName: students.find(s => s._id === selectedStudent)?.name,
            data: response,
            timestamp: new Date()
          },
          ...prev
        ]);
      }
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error generating report. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const downloadReport = (report) => {
    const reportContent = generateReportContent(report);
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.type}_report_${report.studentName || 'admin'}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  const generateReportContent = (report) => {
    let content = `AI-POWERED ACADEMIC REPORT
=====================================
Report Type: ${report.type === 'student' ? 'Student Performance' : 'Administrative Insights'}
Generated: ${report.timestamp.toLocaleString()}
`;
    if (report.type === 'student') {
      content += `
Student: ${report.studentName}
AI SUMMARY
----------
${report.data.aiSummary}
PERFORMANCE METRICS
------------------
Overall Grade: ${report.data.overallGrade}
Attendance Rate: ${Math.round(report.data.attendanceRate * 100)}%
Risk Level: ${report.data.riskLevel}
SUBJECT BREAKDOWN
----------------
`;
      report.data.subjectPerformance.forEach(subject => {
        content += `${subject.name}: ${subject.grade} (${subject.average}% avg, ${Math.round(subject.attendance * 100)}% attendance)\n`;
      });
      content += `
RECOMMENDATIONS
--------------
`;
      report.data.recommendations.forEach((rec, index) => {
        content += `${index + 1}. ${rec}\n`;
      });
    }
    return content;
  };
  return (
    <div className="ai-report-generator">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="generator-header"
      >
        <h2>
          <i className="fas fa-file-alt mr-2"></i>
          AI Report Generator
        </h2>
        <p>Generate comprehensive AI-powered academic reports</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="report-controls"
      >
        <div className="control-group">
          <label>Report Type:</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="form-select"
          >
            <option value="student">Student Performance Report</option>
            {userRole === 'admin' && <option value="admin">Administrative Insights</option>}
          </select>
        </div>
        {reportType === 'student' && (
          <div className="control-group">
            <label>Select Student:</label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="form-select"
            >
              <option value="">Choose a student...</option>
              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.name} - {student.rollNumber}
                </option>
              ))}
            </select>
          </div>
        )}
        <button
          onClick={generateReport}
          disabled={loading || (reportType === 'student' && !selectedStudent)}
          className="generate-btn"
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i>
              Generating...
            </>
          ) : (
            <>
              <i className="fas fa-magic mr-2"></i>
              Generate AI Report
            </>
          )}
        </button>
      </motion.div>
      {/* Admin Insights Dashboard */}
      {userRole === 'admin' && adminInsights && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="admin-insights-section"
        >
          <h3>
            <i className="fas fa-chart-pie mr-2"></i>
            Administrative Insights
          </h3>
          <div className="insights-grid">
            <div className="insight-card">
              <div className="insight-header">
                <i className="fas fa-users"></i>
                <h4>Student Overview</h4>
              </div>
              <div className="insight-content">
                <div className="stat-item">
                  <span className="stat-label">Total Students:</span>
                  <span className="stat-value">{adminInsights.totalStudents}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">At Risk Students:</span>
                  <span className="stat-value text-danger">{adminInsights.atRiskStudents}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Average Attendance:</span>
                  <span className="stat-value">{Math.round(adminInsights.averageAttendance * 100)}%</span>
                </div>
              </div>
            </div>
            <div className="insight-card">
              <div className="insight-header">
                <i className="fas fa-exclamation-triangle"></i>
                <h4>Risk Analysis</h4>
              </div>
              <div className="insight-content">
                <div className="risk-breakdown">
                  <div className="risk-item high-risk">
                    <span>High Risk:</span>
                    <span>{adminInsights.riskBreakdown.high}</span>
                  </div>
                  <div className="risk-item medium-risk">
                    <span>Medium Risk:</span>
                    <span>{adminInsights.riskBreakdown.medium}</span>
                  </div>
                  <div className="risk-item low-risk">
                    <span>Low Risk:</span>
                    <span>{adminInsights.riskBreakdown.low}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="insight-card full-width">
              <div className="insight-header">
                <i className="fas fa-lightbulb"></i>
                <h4>AI Recommendations</h4>
              </div>
              <div className="insight-content">
                <ul className="recommendations-list">
                  {adminInsights.recommendations.map((recommendation, index) => (
                    <li key={index} className="recommendation-item">
                      <i className="fas fa-arrow-right mr-2"></i>
                      {recommendation}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      {/* Generated Reports */}
      {reports.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="generated-reports"
        >
          <h3>
            <i className="fas fa-history mr-2"></i>
            Generated Reports
          </h3>
          <div className="reports-list">
            {reports.map((report) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="report-item"
              >
                <div className="report-header">
                  <div className="report-info">
                    <h4>{report.studentName} - Performance Report</h4>
                    <p>Generated: {report.timestamp.toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => downloadReport(report)}
                    className="download-btn"
                  >
                    <i className="fas fa-download mr-2"></i>
                    Download
                  </button>
                </div>
                <div className="report-preview">
                  <div className="ai-summary">
                    <h5>AI Summary:</h5>
                    <p>{report.data.aiSummary}</p>
                  </div>
                  <div className="key-metrics">
                    <div className="metric">
                      <span>Overall Grade:</span>
                      <span className={`grade-badge grade-${report.data.overallGrade.toLowerCase()}`}>
                        {report.data.overallGrade}
                      </span>
                    </div>
                    <div className="metric">
                      <span>Attendance:</span>
                      <span>{Math.round(report.data.attendanceRate * 100)}%</span>
                    </div>
                    <div className="metric">
                      <span>Risk Level:</span>
                      <span className={`risk-badge risk-${report.data.riskLevel.toLowerCase()}`}>
                        {report.data.riskLevel}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};
export default AIReportGenerator;
