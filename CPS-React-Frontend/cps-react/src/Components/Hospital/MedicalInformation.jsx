
// import React, { useState } from 'react';
// import { Search, User, Heart, Pill, Calendar, Activity } from 'lucide-react';
// import './medicalinformation.css';  // Make sure this path is correct

// const MedicalInformation = () => {
//   const [patientId, setPatientId] = useState('');
//   const [medicalInfo, setMedicalInfo] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const searchMedicalInfo = () => {
//     setLoading(true);
//     setMedicalInfo(null);

//     fetch('http://localhost:9092/medicalinformations')
//       .then(response => {
//         if (!response.ok) {
//           throw new Error('Failed to fetch medical information');
//         }
//         return response.json();
//       })
//       .then(data => {
//         const foundPatient = data.find(
//           patient => patient.patientId.toLowerCase() === patientId.toLowerCase()
//         );
//         if (foundPatient) {
//           setMedicalInfo(foundPatient);
//         } else {
//           setMedicalInfo('not_found');
//         }
//         setLoading(false);
//       })
//       .catch(() => {
//         setMedicalInfo('not_found');
//         setLoading(false);
//       });
//   };

//   return (
//     <div className="medical-container">
//       <div className="medical-wrapper">
//         <div className="medical-max-width">
//           <div className="medical-main-card">
//             <div className="medical-header">
//               <Heart size={32} className="medical-header-icon" />
//               <h2 className="medical-header-title">Medical Information System</h2>
//             </div>

//             <div className="medical-search-section">
//               <label className="medical-search-label">Patient ID</label>
//               <div className="medical-search-container">
//                 <input
//                   type="text"
//                   value={patientId}
//                   onChange={(e) => setPatientId(e.target.value)}
//                   placeholder="Enter patient ID (e.g., P001, P002, P003)"
//                   className="medical-search-input"
//                 />
//                 <button
//                   onClick={searchMedicalInfo}
//                   disabled={!patientId || loading}
//                   className="medical-search-button"
//                 >
//                   <Search size={20} />
//                   {loading ? 'Searching...' : 'Search'}
//                 </button>
//               </div>
//             </div>

//             {medicalInfo && (
//               <div className="medical-results-section">
//                 {medicalInfo === 'not_found' ? (
//                   <div className="medical-not-found">
//                     <User size={48} className="medical-not-found-icon" />
//                     <p className="medical-not-found-title">
//                       No medical information found for Patient ID: {patientId}
//                     </p>
//                     <p className="medical-not-found-subtitle">
//                       Please verify the patient ID and try again.
//                     </p>
//                   </div>
//                 ) : (
//                   <div className="medical-info-sections">
//                     {/* Patient Basic Info */}
//                     <div className="medical-info-card medical-patient-info">
//                       <h3 className="medical-section-header">
//                         <User size={24} />
//                         Patient Information
//                       </h3>
//                       <div className="medical-grid-3">
//                         <div className="medical-info-item">
//                           <div className="medical-info-label">Name</div>
//                           <div className="medical-info-value">{medicalInfo.name}</div>
//                         </div>
//                         <div className="medical-info-item">
//                           <div className="medical-info-label">Age / Gender</div>
//                           <div className="medical-info-value">
//                             {medicalInfo.age} years / {medicalInfo.gender}
//                           </div>
//                         </div>
//                         <div className="medical-info-item">
//                           <div className="medical-info-label">Blood Type</div>
//                           <div className="medical-info-value">{medicalInfo.bloodType}</div>
//                         </div>
//                       </div>
//                       <div className="medical-grid-2">
//                         <div className="medical-info-item">
//                           <div className="medical-info-label">Last Visit</div>
//                           <div className="medical-info-value">{medicalInfo.lastVisit}</div>
//                         </div>
//                         <div className="medical-info-item">
//                           <div className="medical-info-label">Primary Doctor</div>
//                           <div className="medical-info-value">{medicalInfo.doctor}</div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Vital Signs */}
//                     <div className="medical-info-card medical-vitals-info">
//                       <h3 className="medical-section-header">
//                         <Activity size={24} />
//                         Vital Signs
//                       </h3>
//                       <div className="medical-grid-6">
//                         {medicalInfo.vitals && Object.entries(medicalInfo.vitals).map(([key, value]) => (
//                           <div key={key} className="medical-info-item">
//                             <div className="medical-info-label">{key.toUpperCase()}</div>
//                             <div className="medical-info-value">{value}</div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     {/* Current Medications */}
//                     <div className="medical-info-card medical-medications-info">
//                       <h3 className="medical-section-header">
//                         <Pill size={24} />
//                         Current Medications
//                       </h3>
//                       <div className="medical-medications-list">
//                         {medicalInfo.medications.map((medication, index) => (
//                           <div key={index} className="medical-medication-item">
//                             <div className="medical-medication-text">{medication}</div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     {/* Medical Conditions */}
//                     <div className="medical-info-card medical-conditions-info">
//                       <h3 className="medical-section-header">
//                         <Calendar size={24} />
//                         Medical Conditions
//                       </h3>
//                       <div className="medical-tags-container">
//                         {medicalInfo.conditions.map((condition, index) => (
//                           <span key={index} className="medical-tag medical-tag-condition">
//                             {condition}
//                           </span>
//                         ))}
//                       </div>
//                     </div>

//                     {/* Lab Results */}
//                     <div className="medical-info-card medical-lab-results-info">
//                       <h3 className="medical-section-header">
//                         <Activity size={24} />
//                         Latest Lab Results
//                       </h3>
//                       <div className="medical-grid-3">
//                         {medicalInfo.labResults && Object.entries(medicalInfo.labResults).map(([test, result], index) => (
//                           <div key={index} className="medical-info-item">
//                             <div className="medical-info-label">
//                               {test.replace(/([A-Z])/g, ' $1').trim()}
//                             </div>
//                             <div className="medical-info-value">{result}</div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MedicalInformation;
import React, { useState } from 'react';
import { Search, User, Heart, Pill, Calendar, Activity, Download } from 'lucide-react';
import './medicalinformation.css'; 
const MedicalInformation = () => {
  const [patientId, setPatientId] = useState('');
  const [medicalInfo, setMedicalInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const searchMedicalInfo = () => {
    setLoading(true);
    setMedicalInfo(null);

    fetch('http://localhost:9092/medicalinformations')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch medical information');
        }
        return response.json();
      })
      .then(data => {
        const foundPatient = data.find(
          patient => patient.patientId.toLowerCase() === patientId.toLowerCase()
        );
        if (foundPatient) {
          setMedicalInfo(foundPatient);
        } else {
          setMedicalInfo('not_found');
        }
        setLoading(false);
      })
      .catch(() => {
        setMedicalInfo('not_found');
        setLoading(false);
      });
  };

  const downloadPDFReport = () => {
    if (!medicalInfo || medicalInfo === 'not_found') return;
    
    setDownloading(true);
    
    // Create PDF content
    const createPDFContent = () => {
      return `
        <html>
          <head>
            <title>Medical Report - ${medicalInfo.name}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                text-align: center;
                border-bottom: 2px solid #007bff;
                padding-bottom: 20px;
                margin-bottom: 30px;
              }
              .header h1 {
                color: #007bff;
                margin: 0;
              }
              .section {
                margin-bottom: 25px;
                border: 1px solid #e0e0e0;
                padding: 15px;
                border-radius: 8px;
              }
              .section h2 {
                color: #007bff;
                border-bottom: 1px solid #e0e0e0;
                padding-bottom: 10px;
                margin-top: 0;
              }
              .info-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin: 15px 0;
              }
              .info-item {
                display: flex;
                flex-direction: column;
              }
              .info-label {
                font-weight: bold;
                color: #666;
                font-size: 0.9em;
                margin-bottom: 5px;
              }
              .info-value {
                color: #333;
                font-size: 1em;
              }
              .medications-list, .conditions-list {
                list-style: none;
                padding: 0;
              }
              .medications-list li, .conditions-list li {
                background: #f8f9fa;
                padding: 8px 12px;
                margin: 5px 0;
                border-radius: 4px;
                border-left: 3px solid #007bff;
              }
              .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e0e0e0;
                font-size: 0.9em;
                color: #666;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Medical Report</h1>
              <p>Generated on ${new Date().toLocaleDateString()}</p>
            </div>

            <div class="section">
              <h2>Patient Information</h2>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Patient ID</div>
                  <div class="info-value">${medicalInfo.patientId}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Name</div>
                  <div class="info-value">${medicalInfo.name}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Age</div>
                  <div class="info-value">${medicalInfo.age} years</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Gender</div>
                  <div class="info-value">${medicalInfo.gender}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Blood Type</div>
                  <div class="info-value">${medicalInfo.bloodType}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Last Visit</div>
                  <div class="info-value">${medicalInfo.lastVisit}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Primary Doctor</div>
                  <div class="info-value">${medicalInfo.doctor}</div>
                </div>
              </div>
            </div>

            ${medicalInfo.vitals ? `
            <div class="section">
              <h2>Vital Signs</h2>
              <div class="info-grid">
                ${Object.entries(medicalInfo.vitals).map(([key, value]) => `
                  <div class="info-item">
                    <div class="info-label">${key.toUpperCase()}</div>
                    <div class="info-value">${value}</div>
                  </div>
                `).join('')}
              </div>
            </div>
            ` : ''}

            ${medicalInfo.medications ? `
            <div class="section">
              <h2>Current Medications</h2>
              <ul class="medications-list">
                ${medicalInfo.medications.map(med => `<li>${med}</li>`).join('')}
              </ul>
            </div>
            ` : ''}

            ${medicalInfo.conditions ? `
            <div class="section">
              <h2>Medical Conditions</h2>
              <ul class="conditions-list">
                ${medicalInfo.conditions.map(condition => `<li>${condition}</li>`).join('')}
              </ul>
            </div>
            ` : ''}

            ${medicalInfo.labResults ? `
            <div class="section">
              <h2>Latest Lab Results</h2>
              <div class="info-grid">
                ${Object.entries(medicalInfo.labResults).map(([test, result]) => `
                  <div class="info-item">
                    <div class="info-label">${test.replace(/([A-Z])/g, ' $1').trim()}</div>
                    <div class="info-value">${result}</div>
                  </div>
                `).join('')}
              </div>
            </div>
            ` : ''}

            <div class="footer">
              <p>This report was generated from the Medical Information System</p>
              <p>For any questions, please contact your healthcare provider</p>
            </div>
          </body>
        </html>
      `;
    };

    // Create and download PDF
    const element = document.createElement('div');
    element.innerHTML = createPDFContent();
    element.style.position = 'absolute';
    element.style.left = '-9999px';
    document.body.appendChild(element);

    // Use window.print() to generate PDF
    const printWindow = window.open('', '_blank');
    printWindow.document.write(createPDFContent());
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
        setDownloading(false);
      };
      
      // Fallback in case onafterprint doesn't work
      setTimeout(() => {
        if (!printWindow.closed) {
          printWindow.close();
        }
        setDownloading(false);
      }, 3000);
    }, 500);

    document.body.removeChild(element);
  };

  return (
    <div className="medical-container">
      <div className="medical-wrapper">
        <div className="medical-max-width">
          <div className="medical-main-card">
            <div className="medical-header">
              <Heart size={32} className="medical-header-icon" />
              <h2 className="medical-header-title">Medical Information System</h2>
            </div>

            <div className="medical-search-section">
              <label className="medical-search-label">Patient ID</label>
              <div className="medical-search-container">
                <input
                  type="text"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  placeholder="Enter patient ID (e.g., P001, P002, P003)"
                  className="medical-search-input"
                />
                <button
                  onClick={searchMedicalInfo}
                  disabled={!patientId || loading}
                  className="medical-search-button"
                >
                  <Search size={20} />
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </div>

            {medicalInfo && (
              <div className="medical-results-section">
                {medicalInfo === 'not_found' ? (
                  <div className="medical-not-found">
                    <User size={48} className="medical-not-found-icon" />
                    <p className="medical-not-found-title">
                      No medical information found for Patient ID: {patientId}
                    </p>
                    <p className="medical-not-found-subtitle">
                      Please verify the patient ID and try again.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Download Report Button */}
                    <div className="medical-download-section">
                      <button
                        onClick={downloadPDFReport}
                        disabled={downloading}
                        className="medical-download-button"
                      >
                        <Download size={20} />
                        {downloading ? 'Generating PDF...' : 'Download Report'}
                      </button>
                    </div>

                    <div className="medical-info-sections">
                      {/* Patient Basic Info */}
                      <div className="medical-info-card medical-patient-info">
                        <h3 className="medical-section-header">
                          <User size={24} />
                          Patient Information
                        </h3>
                        <div className="medical-grid-3">
                          <div className="medical-info-item">
                            <div className="medical-info-label">Name</div>
                            <div className="medical-info-value">{medicalInfo.name}</div>
                          </div>
                          <div className="medical-info-item">
                            <div className="medical-info-label">Age / Gender</div>
                            <div className="medical-info-value">
                              {medicalInfo.age} years / {medicalInfo.gender}
                            </div>
                          </div>
                          <div className="medical-info-item">
                            <div className="medical-info-label">Blood Type</div>
                            <div className="medical-info-value">{medicalInfo.bloodType}</div>
                          </div>
                        </div>
                        <div className="medical-grid-2">
                          <div className="medical-info-item">
                            <div className="medical-info-label">Last Visit</div>
                            <div className="medical-info-value">{medicalInfo.lastVisit}</div>
                          </div>
                          <div className="medical-info-item">
                            <div className="medical-info-label">Primary Doctor</div>
                            <div className="medical-info-value">{medicalInfo.doctor}</div>
                          </div>
                        </div>
                      </div>

                      {/* Vital Signs */}
                      {medicalInfo.vitals && (
                        <div className="medical-info-card medical-vitals-info">
                          <h3 className="medical-section-header">
                            <Activity size={24} />
                            Vital Signs
                          </h3>
                          <div className="medical-grid-6">
                            {Object.entries(medicalInfo.vitals).map(([key, value]) => (
                              <div key={key} className="medical-info-item">
                                <div className="medical-info-label">{key.toUpperCase()}</div>
                                <div className="medical-info-value">{value}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Current Medications */}
                      {medicalInfo.medications && (
                        <div className="medical-info-card medical-medications-info">
                          <h3 className="medical-section-header">
                            <Pill size={24} />
                            Current Medications
                          </h3>
                          <div className="medical-medications-list">
                            {medicalInfo.medications.map((medication, index) => (
                              <div key={index} className="medical-medication-item">
                                <div className="medical-medication-text">{medication}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Medical Conditions */}
                      {medicalInfo.conditions && (
                        <div className="medical-info-card medical-conditions-info">
                          <h3 className="medical-section-header">
                            <Calendar size={24} />
                            Medical Conditions
                          </h3>
                          <div className="medical-tags-container">
                            {medicalInfo.conditions.map((condition, index) => (
                              <span key={index} className="medical-tag medical-tag-condition">
                                {condition}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Lab Results */}
                      {medicalInfo.labResults && (
                        <div className="medical-info-card medical-lab-results-info">
                          <h3 className="medical-section-header">
                            <Activity size={24} />
                            Latest Lab Results
                          </h3>
                          <div className="medical-grid-3">
                            {Object.entries(medicalInfo.labResults).map(([test, result], index) => (
                              <div key={index} className="medical-info-item">
                                <div className="medical-info-label">
                                  {test.replace(/([A-Z])/g, ' $1').trim()}
                                </div>
                                <div className="medical-info-value">{result}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalInformation;