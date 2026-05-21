
// import React, { useState, useMemo } from 'react';

// const data = {
//   India: {
//     Delhi: {
//       Delhi: [
//         { id: 1, name: 'AIIMS Delhi' },
//         { id: 2, name: 'Fortis Escorts Heart Institute' },
//       ],
//     },
//     Maharashtra: {
//       Mumbai: [
//         { id: 3, name: 'KEM Hospital Mumbai' },
//         { id: 4, name: 'Lilavati Hospital Mumbai' },
//       ],
//       Pune: [
//         { id: 5, name: 'Ruby Hall Clinic Pune' },
//         { id: 6, name: 'Jehangir Hospital Pune' },
//       ],
//     },
//     Karnataka: {
//       Bangalore: [
//         { id: 7, name: 'Manipal Hospital Bangalore' },
//         { id: 8, name: 'Narayana Health Bangalore' },
//       ],
//       Mysore: [
//         { id: 9, name: 'Apollo BGS Hospitals Mysore' },
//         { id: 10, name: 'JSS Hospital Mysore' },
//       ],
//     },
//     TamilNadu: {
//       Chennai: [
//         { id: 11, name: 'MIOT International Chennai' },
//         { id: 12, name: 'Apollo Hospital Chennai' },
//       ],
//       Coimbatore: [
//         { id: 13, name: 'GKNM Hospital Coimbatore' },
//         { id: 14, name: 'Kovai Medical Center Coimbatore' },
//       ],
//     },
//   },
// };

// export default function ViewHospitals() {
//   // Since only India is available, country is fixed
//   const country = 'India';

//   const [selectedState, setSelectedState] = useState('');
//   const [selectedCity, setSelectedCity] = useState('');
//   const [selectedHospitalId, setSelectedHospitalId] = useState(null);

//   // States in India
//   const states = useMemo(() => {
//     return Object.keys(data[country] || {});
//   }, [country]);

//   // Cities in selected state
//   const cities = useMemo(() => {
//     if (!selectedState) return [];
//     return Object.keys(data[country]?.[selectedState] || {});
//   }, [country, selectedState]);

//   // Hospitals in selected city
//   const hospitals = useMemo(() => {
//     if (!selectedState || !selectedCity) return [];
//     return data[country]?.[selectedState]?.[selectedCity] || [];
//   }, [country, selectedState, selectedCity]);

//   // Handlers
//   const handleStateChange = (e) => {
//     setSelectedState(e.target.value);
//     setSelectedCity('');
//     setSelectedHospitalId(null);
//   };

//   const handleCityChange = (e) => {
//     setSelectedCity(e.target.value);
//     setSelectedHospitalId(null);
//   };

//   const handleHospitalSelect = (id) => {
//     setSelectedHospitalId(id);
//   };

//   return (
//     <div style={{ maxWidth: 600, margin: '20px auto', fontFamily: 'Arial, sans-serif' }}>
//       <h2 style={{ textAlign: 'center' }}>View Hospitals in India</h2>

//       {/* State Dropdown */}
//       <div style={{ marginBottom: 20 }}>
//         <label htmlFor="state-select" style={{ fontWeight: 'bold' }}>
//           Select State:
//         </label>
//         <select
//           id="state-select"
//           value={selectedState}
//           onChange={handleStateChange}
//           style={{ width: '100%', padding: 8, fontSize: 16, borderRadius: 4, marginTop: 6 }}
//         >
//           <option value="">-- Select State --</option>
//           {states.map((state) => (
//             <option key={state} value={state}>
//               {state}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* City Dropdown */}
//       {selectedState && (
//         <div style={{ marginBottom: 20 }}>
//           <label htmlFor="city-select" style={{ fontWeight: 'bold' }}>
//             Select City:
//           </label>
//           <select
//             id="city-select"
//             value={selectedCity}
//             onChange={handleCityChange}
//             style={{ width: '100%', padding: 8, fontSize: 16, borderRadius: 4, marginTop: 6 }}
//           >
//             <option value="">-- Select City --</option>
//             {cities.map((city) => (
//               <option key={city} value={city}>
//                 {city}
//               </option>
//             ))}
//           </select>
//         </div>
//       )}

//       {/* Hospitals List */}
//       {selectedCity && (
//         <div>
//           <h3>
//             Hospitals in {selectedCity}, {selectedState}:
//           </h3>
//           {hospitals.length > 0 ? (
//             <ul style={{ listStyle: 'none', padding: 0 }}>
//               {hospitals.map((hospital) => (
//                 <li
//                   key={hospital.id}
//                   onClick={() => handleHospitalSelect(hospital.id)}
//                   style={{
//                     padding: '10px 15px',
//                     marginBottom: 8,
//                     borderRadius: 6,
//                     cursor: 'pointer',
//                     backgroundColor: hospital.id === selectedHospitalId ? '#1A3E72' : '#f0f0f0',
//                     color: hospital.id === selectedHospitalId ? 'white' : 'black',
//                     boxShadow: hospital.id === selectedHospitalId ? '0 0 8px #1A3E72' : 'none',
//                     userSelect: 'none',
//                   }}
//                 >
//                   {hospital.name}
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p>No hospitals found in this city.</p>
//           )}
//         </div>
//       )}

//       {/* Selected hospital info */}
//       {selectedHospitalId && (
//         <div
//           style={{
//             marginTop: 20,
//             padding: 15,
//             border: '1px solid #1A3E72',
//             borderRadius: 6,
//             backgroundColor: '#e6f0ff',
//           }}
//         >
//           <strong>Selected Hospital:</strong>{' '}
//           {hospitals.find((h) => h.id === selectedHospitalId)?.name}
//         </div>
//       )}
//     </div>
//   );
// }
// import React, { useState, useEffect, useMemo } from "react";
// import axios from "axios";
 
// export default function ViewHospitals() {
//   const country = "India"; // fixed as per your data assumption
 
//   // Raw hospitals fetched from backend
//   const [hospitalsData, setHospitalsData] = useState([]);
 
//   // UI state
//   const [selectedState, setSelectedState] = useState("");
//   const [selectedCity, setSelectedCity] = useState("");
//   const [selectedHospitalId, setSelectedHospitalId] = useState(null);
 
//   // Fetch hospitals on mount
//   useEffect(() => {
//     axios
//       .get("http://localhost:9196/api/hospitals")
//       .then((response) => {
//         setHospitalsData(response.data);
//         console.log(hospitals);
        
//       })
//       .catch((error) => {
//         console.error("Failed to fetch hospitals:", error);
//         setHospitalsData([]);
//       });
//   }, []);
 
//   // Extract unique states (filter by country if needed)
//   const states = useMemo(() => {
//     const statesSet = new Set();
//     hospitalsData.forEach((h) => {
//       if (h.state) {
//         statesSet.add(h.state);
//       }
//     });
//     return Array.from(statesSet).sort();
//   }, [hospitalsData]);
 
//   // Extract cities filtered by selected state
//   const cities = useMemo(() => {
//     if (!selectedState) return [];
//     const citySet = new Set();
//     hospitalsData.forEach((h) => {
//       if (h.state === selectedState && h.city) {
//         citySet.add(h.city);
//       }
//     });
//     return Array.from(citySet).sort();
//   }, [hospitalsData, selectedState]);
 
//   // Hospitals filtered by selected state & city
//   const hospitals = useMemo(() => {
//     if (!selectedState || !selectedCity) return [];
//     return hospitalsData.filter(
//       (h) => h.state === selectedState && h.city === selectedCity
//     );
//   }, [hospitalsData, selectedState, selectedCity]);
 
//   // Handlers
//   const handleStateChange = (e) => {
//     setSelectedState(e.target.value);
//     setSelectedCity("");
//     setSelectedHospitalId(null);
//   };
 
//   const handleCityChange = (e) => {
//     setSelectedCity(e.target.value);
//     setSelectedHospitalId(null);
//   };
 
//   const handleHospitalSelect = (id) => {
//     setSelectedHospitalId(id);
//   };
 
//   return (
// <div
//       style={{ maxWidth: 600, margin: "20px auto", fontFamily: "Arial, sans-serif" }}
// >
// <h2 style={{ textAlign: "center" }}>View Hospitals in India</h2>
 
//       {/* State Dropdown */}
// <div style={{ marginBottom: 20 }}>
// <label htmlFor="state-select" style={{ fontWeight: "bold" }}>
//           Select State:
// </label>
// <select
//           id="state-select"
//           value={selectedState}
//           onChange={handleStateChange}
//           style={{ width: "100%", padding: 8, fontSize: 16, borderRadius: 4, marginTop: 6 }}
// >
// <option value="">-- Select State --</option>
//           {states.map((state) => (
// <option key={state} value={state}>
//               {state}
// </option>
//           ))}
// </select>
// </div>
 
//       {/* City Dropdown */}
//       {selectedState && (
// <div style={{ marginBottom: 20 }}>
// <label htmlFor="city-select" style={{ fontWeight: "bold" }}>
//             Select City:
// </label>
// <select
//             id="city-select"
//             value={selectedCity}
//             onChange={handleCityChange}
//             style={{ width: "100%", padding: 8, fontSize: 16, borderRadius: 4, marginTop: 6 }}
// >
// <option value="">-- Select City --</option>
//             {cities.map((city) => (
// <option key={city} value={city}>
//                 {city}
// </option>
//             ))}
// </select>
// </div>
//       )}
 
//       {/* Hospitals List */}
//       {selectedCity && (
// <div>
// <h3>
//             Hospitals in {selectedCity}, {selectedState}:
// </h3>
//           {hospitals.length > 0 ? (
// <ul style={{ listStyle: "none", padding: 0 }}>
//               {hospitals.map((hospital) => (
// <li
//                   key={hospital.id}
//                   onClick={() => handleHospitalSelect(hospital.id)}
//                   style={{
//                     padding: "10px 15px",
//                     marginBottom: 8,
//                     borderRadius: 6,
//                     cursor: "pointer",
//                     backgroundColor:
//                       hospital.id === selectedHospitalId ? "#1A3E72" : "#f0f0f0",
//                     color: hospital.id === selectedHospitalId ? "white" : "black",
//                     boxShadow:
//                       hospital.id === selectedHospitalId ? "0 0 8px #1A3E72" : "none",
//                     userSelect: "none",
//                   }}
// >
//                   {hospital.name}
// </li>
//               ))}
// </ul>
//           ) : (
// <p>No hospitals found in this city.</p>
//           )}
// </div>
//       )}
 
//       {/* Selected hospital info */}
//       {selectedHospitalId && (
// <div
//           style={{
//             marginTop: 20,
//             padding: 15,
//             border: "1px solid #1A3E72",
//             borderRadius: 6,
//             backgroundColor: "#e6f0ff",
//           }}
// >
// <strong>Selected Hospital:</strong>{" "}
//           {hospitals.find((h) => h.id === selectedHospitalId)?.name}
// </div>
//       )}
// </div>
//   );
// }








import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { API_ROUTES } from "../../utils/api";
 
export default function ViewHospitals() {
  const country = "India"; // fixed as per your data assumption
 
  // Raw hospitals fetched from backend
  const [hospitalsData, setHospitalsData] = useState([]);
 
  // UI state
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedHospitalId, setSelectedHospitalId] = useState(null);
  
 
  // Fetch hospitals on mount
  useEffect(() => {
    axios
      .get(API_ROUTES.CUSTOMER.ALL_HOSPITALS)
      .then((response) => {
        setHospitalsData(response.data || []);
      })
      .catch((error) => {
        console.error("Failed to fetch hospitals:", error);
        setHospitalsData([]);
      });
  }, []);

  console.log(hospitalsData);
  
 
  // Extract unique states (filter by country if needed)
  // const states = useMemo(() => {
  //   const statesSet = new Set();
  //   hospitalsData.forEach((h) => {
  //     if (h.state) {
  //       statesSet.add(h.address.state);
  //     }
  //   });
  //   return Array.from(statesSet).sort();
  // }, [hospitalsData]);

  const states = useMemo(() => {
  const statesSet = new Set();
  hospitalsData.forEach((h) => {
    if (h.address && h.address.state) {
      statesSet.add(h.address.state);
    }
  });
  return Array.from(statesSet).sort();
}, [hospitalsData]);


  console.log(states);
  
 
  // Extract cities filtered by selected state
  const cities = useMemo(() => {
    if (!selectedState) return [];
    const citySet = new Set();
    hospitalsData.forEach((h) => {
      if (h.address.state === selectedState && h.address.city) {
        citySet.add(h.address.city);
      }
    });
    return Array.from(citySet).sort();
  }, [hospitalsData, selectedState]);
 
  // Hospitals filtered by selected state & city
  const hospitals = useMemo(() => {
    if (!selectedState || !selectedCity) return [];
    return hospitalsData.filter(
      (h) => h.address.state === selectedState && h.address.city === selectedCity
    );
  }, [hospitalsData, selectedState, selectedCity]);
 
  // Handlers
  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setSelectedCity("");
    setSelectedHospitalId(null);
  };
 
  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    setSelectedHospitalId(null);
  };
 
  const handleHospitalSelect = (id) => {
    setSelectedHospitalId(id);
  };
 
  return (
<div
      style={{ maxWidth: 600, margin: "20px auto", fontFamily: "Arial, sans-serif" }}
>
<h2 style={{ textAlign: "center" }}>View Hospitals in India</h2>
 
      {/* State Dropdown */}
<div style={{ marginBottom: 20 }}>
<label htmlFor="state-select" style={{ fontWeight: "bold" }}>
          Select State:
</label>
<select
          id="state-select"
          value={selectedState}
          onChange={handleStateChange}
          style={{ width: "100%", padding: 8, fontSize: 16, borderRadius: 4, marginTop: 6 }}
>
<option value="">-- Select State --</option>
          {states.map((state) => (
<option key={state} value={state}>
              {state}
</option>
          ))}
</select>
</div>
 
      {/* City Dropdown */}
      {selectedState && (
<div style={{ marginBottom: 20 }}>
<label htmlFor="city-select" style={{ fontWeight: "bold" }}>
            Select City:
</label>
<select
            id="city-select"
            value={selectedCity}
            onChange={handleCityChange}
            style={{ width: "100%", padding: 8, fontSize: 16, borderRadius: 4, marginTop: 6 }}
>
<option value="">-- Select City --</option>
            {cities.map((city) => (
<option key={city} value={city}>
                {city}
</option>
            ))}
</select>
</div>
      )}
 
      {/* Hospitals List */}
      {selectedCity && (
<div>
<h3>
            Hospitals in {selectedCity}, {selectedState}:
</h3>
          {hospitals.length > 0 ? (
<ul style={{ listStyle: "none", padding: 0 }}>
              {hospitals.map((hospital) => (
<li
                  key={hospital.id}
                  onClick={() => handleHospitalSelect(hospital.id)}
                  style={{
                    padding: "10px 15px",
                    marginBottom: 8,
                    borderRadius: 6,
                    cursor: "pointer",
                    backgroundColor:
                      hospital.id === selectedHospitalId ? "#1A3E72" : "#f0f0f0",
                    color: hospital.id === selectedHospitalId ? "white" : "black",
                    boxShadow:
                      hospital.id === selectedHospitalId ? "0 0 8px #1A3E72" : "none",
                    userSelect: "none",
                  }}
>
                  {hospital.name}
</li>
              ))}
</ul>
          ) : (
<p>No hospitals found in this city.</p>
          )}
</div>
      )}
 
      {/* Selected hospital info */}
      {selectedHospitalId && (
<div
          style={{
            marginTop: 20,
            padding: 15,
            border: "1px solid #1A3E72",
            borderRadius: 6,
            backgroundColor: "#e6f0ff",
          }}
>
<strong>Selected Hospital:</strong>{" "}
          {hospitals.find((h) => h.id === selectedHospitalId)?.name}
</div>
      )}
</div>
  );
}