import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import Barcode from 'react-barcode';
const IDCard = () => {
  const [idCard, setIdCard] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    fetchIDCard();
  }, []);
  const fetchIDCard = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('/api/student/idcard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIdCard(data.idCard);
    } catch (error) {
      console.error('ID Card error:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  if (!idCard) return null;
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-indigo-600 text-white p-6 rounded-b-3xl shadow-lg">
        <button onClick={() => navigate('/student/dashboard')} className="mb-4">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-bold">Virtual ID Card</h1>
        <p className="text-white/80 text-sm mt-1">Your digital identity</p>
      </div>
      <div className="p-4 space-y-4">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl shadow-2xl p-6 text-white">
          <div className="text-center mb-4 pb-4 border-b border-white/20">
            <h2 className="text-xl font-bold">Islamic College</h2>
            <p className="text-xs text-white/80 mt-1">Student Identity Card</p>
          </div>
          <div className="flex items-start space-x-4 mb-4">
            <div className="w-20 h-20 rounded-xl bg-white/20 flex items-center justify-center overflow-hidden border-2 border-white/30">
              {idCard.photoUrl ? (
                <img src={idCard.photoUrl} alt={idCard.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-white">{idCard.name?.charAt(0)}</span>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold">{idCard.name}</h3>
              <p className="text-sm text-white/80">{idCard.rollNo}</p>
              <p className="text-xs text-white/70 mt-1">{idCard.class}</p>
              <p className="text-xs text-white/70">{idCard.department}</p>
            </div>
          </div>
          <div className="space-y-2 bg-white/10 backdrop-blur rounded-xl p-3 text-sm">
            <div className="flex justify-between">
              <span className="text-white/80">Admission No:</span>
              <span className="font-medium">{idCard.admissionNo}</span>
            </div>
            {idCard.batch && (
              <div className="flex justify-between">
                <span className="text-white/80">Batch:</span>
                <span className="font-medium">{idCard.batch}</span>
              </div>
            )}
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-2 flex">
          <button
            onClick={() => setShowQR(false)}
            className={`flex-1 py-3 rounded-xl font-medium transition ${
              !showQR ? 'bg-indigo-600 text-white' : 'text-gray-600'
            }`}
          >
            Barcode
          </button>
          <button
            onClick={() => setShowQR(true)}
            className={`flex-1 py-3 rounded-xl font-medium transition ${
              showQR ? 'bg-indigo-600 text-white' : 'text-gray-600'
            }`}
          >
            QR Code
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6">
          {!showQR ? (
            <div className="flex flex-col items-center">
              <div className="mb-3">
                <Barcode 
                  value={idCard.barcode || idCard.admissionNo || '000000'} 
                  width={2}
                  height={80}
                  displayValue={true}
                />
              </div>
              <p className="text-xs text-gray-500 text-center">
                Use this barcode for library and attendance
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="p-4 bg-white rounded-xl border-2 border-indigo-200">
                <QRCodeSVG 
                  value={idCard.qrCode || JSON.stringify({ id: idCard.admissionNo })} 
                  size={200}
                  level="H"
                  includeMargin={false}
                />
              </div>
              <p className="text-xs text-gray-500 text-center mt-3">
                Scan this QR code for quick verification
              </p>
            </div>
          )}
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <h3 className="font-bold text-blue-900 mb-2 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            How to Use
          </h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Show this card for library book issues</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Use barcode for quick attendance marking</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>QR code contains your complete student details</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Always keep your ID card accessible</span>
            </li>
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => window.print()}
            className="bg-white rounded-2xl shadow-sm p-4 flex flex-col items-center hover:bg-gray-50 transition"
          >
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
              <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700">Print</span>
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'My Student ID',
                  text: `Student ID: ${idCard.admissionNo}`
                });
              } else {
                alert('Share not supported on this device');
              }
            }}
            className="bg-white rounded-2xl shadow-sm p-4 flex flex-col items-center hover:bg-gray-50 transition"
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-gray-700">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};
export default IDCard;
