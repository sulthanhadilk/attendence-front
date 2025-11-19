import React from 'react';

export default function AISection({ onShowPrediction, onShowReports, onShowChatbot }) {
  return (
    <div className="card mt-4">
      <div className="card-header">
        <h3 className="card-title"><i className="fas fa-robot"/> AI-Powered Administration</h3>
      </div>
      <div className="card-body">
        <div className="dashboard-grid">
          <button className="btn btn-gradient-primary" onClick={onShowPrediction}><i className="fas fa-brain"/> AI Student Analysis</button>
          <button className="btn btn-gradient-success" onClick={onShowReports}><i className="fas fa-file-alt"/> AI Report Generator</button>
          <button className="btn btn-gradient-info" onClick={onShowChatbot}><i className="fas fa-comments"/> AI Assistant</button>
        </div>
        <p className="text-muted mt-3 mb-0"><i className="fas fa-info-circle"/> Predictive analytics, automated reporting, insights</p>
      </div>
    </div>
  );
}
