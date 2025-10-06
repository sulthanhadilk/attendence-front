import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiRequest, API_ENDPOINTS } from '../utils/api';

const AIPredictionDashboard = ({ studentId, userRole }) => {
  const [predictions, setPredictions] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(studentId || '');
  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (userRole === 'admin' || userRole === 'teacher') {
      fetchStudents();
    }
    if (selectedStudent) {
      fetchPredictions();
      fetchAnalysis();
    }
  }, [selectedStudent, userRole]);

  const fetchStudents = async () => {
    try {
      const response = await apiRequest(API_ENDPOINTS.STUDENTS);
      setStudents(response);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchPredictions = async () => {
    setLoading(true);
    try {
      const [predictionResponse, analysisResponse] = await Promise.all([
        apiRequest(`${API_ENDPOINTS.AI_BASE}/predict/${selectedStudent}`),
        apiRequest(`${API_ENDPOINTS.AI_BASE}/analyze/${selectedStudent}`)
      ]);
      
      setPredictions(predictionResponse);
      setAnalysis(analysisResponse);
    } catch (error) {
      console.error('Error fetching AI data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalysis = async () => {
    try {
      const response = await apiRequest(`${API_ENDPOINTS.AI_BASE}/analyze/${selectedStudent}`);
      setAnalysis(response);
    } catch (error) {
      console.error('Error fetching analysis:', error);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'High': return '#dc3545';
      case 'Medium': return '#ffc107';
      case 'Low': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getRiskIcon = (riskLevel) => {
    switch (riskLevel) {
      case 'High': return 'fas fa-exclamation-triangle';
      case 'Medium': return 'fas fa-exclamation-circle';
      case 'Low': return 'fas fa-check-circle';
      default: return 'fas fa-question-circle';
    }
  };

  if (loading) {
    return (
      <div className="ai-dashboard-loading">
        <div className="loading-spinner">
          <i className="fas fa-robot fa-spin"></i>
        </div>
        <p>AI is analyzing student data...</p>
      </div>
    );
  }

  return (
    <div className="ai-prediction-dashboard">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="dashboard-header"
      >
        <h2>
          <i className="fas fa-brain mr-2"></i>
          AI Smart Prediction Dashboard
        </h2>
        <p>Intelligent behavior analysis and risk assessment</p>
      </motion.div>

      {(userRole === 'admin' || userRole === 'teacher') && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="student-selector"
        >
          <label htmlFor="studentSelect">Select Student:</label>
          <select
            id="studentSelect"
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
        </motion.div>
      )}

      {predictions && analysis && (
        <div className="prediction-grid">
          {/* Risk Assessment Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="prediction-card risk-card"
          >
            <div className="card-header">
              <h3>
                <i className={getRiskIcon(predictions.riskLevel)}></i>
                Risk Assessment
              </h3>
            </div>
            <div className="card-body">
              <div className="risk-level" style={{ color: getRiskColor(predictions.riskLevel) }}>
                <span className="risk-label">{predictions.riskLevel} Risk</span>
                <span className="risk-score">{Math.round(predictions.riskScore * 100)}%</span>
              </div>
              <div className="risk-factors">
                <h4>Key Factors:</h4>
                <ul>
                  {predictions.factors.map((factor, index) => (
                    <li key={index}>{factor}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Attendance Prediction */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="prediction-card attendance-card"
          >
            <div className="card-header">
              <h3>
                <i className="fas fa-calendar-check"></i>
                Attendance Prediction
              </h3>
            </div>
            <div className="card-body">
              <div className="prediction-metric">
                <span className="metric-label">Likelihood of Absence</span>
                <div className="metric-value">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${predictions.absenceProbability * 100}%`,
                        backgroundColor: getRiskColor(predictions.riskLevel)
                      }}
                    ></div>
                  </div>
                  <span className="percentage">{Math.round(predictions.absenceProbability * 100)}%</span>
                </div>
              </div>
              <div className="next-week-prediction">
                <h4>Next Week Forecast:</h4>
                <p>{predictions.recommendation}</p>
              </div>
            </div>
          </motion.div>

          {/* Academic Performance */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="prediction-card performance-card"
          >
            <div className="card-header">
              <h3>
                <i className="fas fa-chart-line"></i>
                Academic Analysis
              </h3>
            </div>
            <div className="card-body">
              <div className="performance-metrics">
                <div className="metric-item">
                  <span className="metric-label">Overall Grade</span>
                  <span className={`metric-value grade-${analysis.overallGrade.toLowerCase()}`}>
                    {analysis.overallGrade}
                  </span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Attendance Rate</span>
                  <span className="metric-value">
                    {Math.round(analysis.attendanceRate * 100)}%
                  </span>
                </div>
                <div className="metric-item">
                  <span className="metric-label">Improvement Trend</span>
                  <span className={`metric-value trend-${analysis.trend}`}>
                    <i className={`fas fa-arrow-${analysis.trend === 'improving' ? 'up text-success' : analysis.trend === 'declining' ? 'down text-danger' : 'right text-warning'}`}></i>
                    {analysis.trend}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* AI Recommendations */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="prediction-card recommendations-card full-width"
          >
            <div className="card-header">
              <h3>
                <i className="fas fa-lightbulb"></i>
                AI Recommendations
              </h3>
            </div>
            <div className="card-body">
              <div className="recommendations-list">
                {analysis.recommendations.map((recommendation, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="recommendation-item"
                  >
                    <div className="recommendation-icon">
                      <i className="fas fa-arrow-right"></i>
                    </div>
                    <div className="recommendation-text">
                      {recommendation}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Subject Performance Breakdown */}
          {analysis.subjectPerformance && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 }}
              className="prediction-card subjects-card full-width"
            >
              <div className="card-header">
                <h3>
                  <i className="fas fa-books"></i>
                  Subject Performance Analysis
                </h3>
              </div>
              <div className="card-body">
                <div className="subjects-grid">
                  {analysis.subjectPerformance.map((subject, index) => (
                    <div key={index} className="subject-item">
                      <div className="subject-header">
                        <span className="subject-name">{subject.name}</span>
                        <span className={`subject-grade grade-${subject.grade.toLowerCase()}`}>
                          {subject.grade}
                        </span>
                      </div>
                      <div className="subject-metrics">
                        <div className="subject-metric">
                          <span>Attendance:</span>
                          <span>{Math.round(subject.attendance * 100)}%</span>
                        </div>
                        <div className="subject-metric">
                          <span>Average:</span>
                          <span>{subject.average}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIPredictionDashboard;