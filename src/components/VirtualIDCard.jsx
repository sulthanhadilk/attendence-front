import React from 'react';

const VirtualIDCard = ({ profile, onClose }) => {
  // Generate QR code data
  const qrData = {
    name: profile.name,
    rollNo: profile.rollNo,
    class: profile.class,
    studentId: profile.studentDetails?._id,
    validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // Valid for 1 year
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(JSON.stringify(qrData))}`;

  const handleDownload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 600;

    // Create ID card background
    ctx.fillStyle = '#1a365d';
    ctx.fillRect(0, 0, 400, 600);

    // Add school name
    ctx.fillStyle = 'white';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('ISLAMIC COLLEGE', 200, 40);

    // Add student photo placeholder
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(150, 70, 100, 120);
    ctx.fillStyle = '#64748b';
    ctx.font = '12px Arial';
    ctx.fillText('PHOTO', 200, 135);

    // Add student details
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    
    ctx.fillText(`Name: ${profile.name}`, 30, 230);
    ctx.fillText(`Roll No: ${profile.rollNo}`, 30, 260);
    ctx.fillText(`Class: ${profile.class || 'Not Assigned'}`, 30, 290);
    const addr = profile.studentDetails?.address ? [profile.studentDetails.address.street, profile.studentDetails.address.city].filter(Boolean).join(', ') : '';
    ctx.fillText(`Address: ${addr || 'Not Provided'}`, 30, 320);
    
    // Add QR code placeholder
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(275, 350, 100, 100);
    ctx.fillStyle = '#64748b';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('QR CODE', 325, 405);

    // Add footer
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.fillText('Valid for Academic Year 2024-25', 200, 550);

    // Download
    const link = document.createElement('a');
    link.download = `${profile.name}_ID_Card.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content medium-modal">
        <div className="modal-header">
          <h3>
            <i className="fas fa-id-card"></i> Virtual ID Card
          </h3>
          <div className="modal-actions">
            <button className="btn-primary" onClick={handleDownload}>
              <i className="fas fa-download"></i> Download
            </button>
            <button className="btn-danger" onClick={onClose}>
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        <div className="modal-body">
          <div className="id-card">
            <div className="id-card-header">
              <div className="school-logo">
                <i className="fas fa-graduation-cap"></i>
              </div>
              <div className="school-info">
                <h3>ISLAMIC COLLEGE</h3>
                <p>Attendance & Exam Management System</p>
              </div>
            </div>

            <div className="id-card-body">
              <div className="student-photo">
                <div className="photo-placeholder">
                  <i className="fas fa-user"></i>
                </div>
              </div>

              <div className="student-details">
                <div className="detail-row">
                  <span className="label">Name:</span>
                  <span className="value">{profile.name}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Roll No:</span>
                  <span className="value">{profile.rollNo}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Class:</span>
                  <span className="value">{profile.class || 'Not Assigned'}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Address:</span>
                  <span className="value">{profile.studentDetails?.address ? [profile.studentDetails.address.street, profile.studentDetails.address.city].filter(Boolean).join(', ') : 'Not Provided'}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Blood Group:</span>
                  <span className="value">{profile.studentDetails?.medical_info?.blood_group || 'Not Specified'}</span>
                </div>
              </div>

              <div className="qr-section">
                <div className="qr-code">
                  <img 
                    src={qrCodeUrl} 
                    alt="Student QR Code" 
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="qr-placeholder" style={{display: 'none'}}>
                    <i className="fas fa-qrcode"></i>
                    <span>QR Code</span>
                  </div>
                </div>
                <p className="qr-label">Scan for Details</p>
              </div>
            </div>

            <div className="id-card-footer">
              <p>Valid for Academic Year 2024-25</p>
              <p className="emergency">Emergency: {profile.guardianInfo?.guardian_phone || 'Not Provided'}</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .id-card {
          background: linear-gradient(135deg, #1a365d, #2d5a87);
          color: white;
          border-radius: 15px;
          padding: 20px;
          max-width: 350px;
          margin: 0 auto;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          position: relative;
          overflow: hidden;
        }

        .id-card::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          animation: shimmer 3s infinite;
        }

        @keyframes shimmer {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .id-card-header {
          text-align: center;
          padding-bottom: 15px;
          border-bottom: 2px solid rgba(255, 255, 255, 0.3);
          position: relative;
          z-index: 1;
        }

        .school-logo {
          font-size: 2rem;
          margin-bottom: 8px;
        }

        .school-info h3 {
          margin: 0;
          font-size: 1.2rem;
          font-weight: bold;
        }

        .school-info p {
          margin: 0;
          font-size: 0.8rem;
          opacity: 0.9;
        }

        .id-card-body {
          display: grid;
          grid-template-columns: auto 1fr auto;
          gap: 15px;
          padding: 20px 0;
          position: relative;
          z-index: 1;
        }

        .student-photo {
          display: flex;
          align-items: center;
        }

        .photo-placeholder {
          width: 80px;
          height: 100px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
        }

        .student-details {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 8px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
        }

        .label {
          font-weight: 600;
          opacity: 0.9;
        }

        .value {
          font-weight: bold;
          text-align: right;
        }

        .qr-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .qr-code {
          width: 80px;
          height: 80px;
          background: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 5px;
        }

        .qr-code img {
          width: 100%;
          height: 100%;
          border-radius: 4px;
        }

        .qr-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          color: #333;
          font-size: 0.7rem;
        }

        .qr-placeholder i {
          font-size: 1.5rem;
          margin-bottom: 4px;
        }

        .qr-label {
          font-size: 0.7rem;
          margin-top: 5px;
          text-align: center;
          opacity: 0.9;
        }

        .id-card-footer {
          text-align: center;
          padding-top: 15px;
          border-top: 2px solid rgba(255, 255, 255, 0.3);
          position: relative;
          z-index: 1;
        }

        .id-card-footer p {
          margin: 5px 0;
          font-size: 0.8rem;
          opacity: 0.9;
        }

        .emergency {
          color: #fbbf24 !important;
          font-weight: bold;
        }

        .medium-modal {
          max-width: 450px;
        }
      `}</style>
    </div>
  );
};

export default VirtualIDCard;