// import React, { useState } from "react";
// import AdminNavbar from "./Admin/AdminNavbar";
// import Level1Officer from "./Admin/Level1Officer";
// import Level2Officer from "./Admin/Level2Officer";
// import HospitalManager from "./Admin/HospitalManager";
// import FieldDoctor from "./Admin/FieldDoctor";
// import PolicyDetailManager from "./Admin/PolicyDetailManager";
 
// const PAGES = {
//   level1: <Level1Officer />,
//   level2: <Level2Officer />,
//   hospitals: <HospitalManager />,
//   fielddoctor: <FieldDoctor />,
//   policydetail: <PolicyDetailManager />,
// };
 
// const AdminPage = () => {
//   const [selectedPage, setSelectedPage] = useState("level1");
//   const [users, setUsers] = useState([]);
 
//   useEffect(() => {
//     axios
//       .get("http://localhost:9197/api/users")
//       .then((response) => {
//         setUsers(response.data);
//       })
//       .catch((error) => {
//         setError(error);
//       }),
//       [];
//   });
 
//   return (
//     <>
//       <AdminNavbar onNavigate={setSelectedPage} selectedPage={selectedPage} />
//       <div>{PAGES[selectedPage] || <h2>404 - Admin Page Not Found</h2>}</div>
//     </>
//   );
// };
 
// export default AdminPage;
import React, { useState, useEffect } from "react";
import axios from "axios"; // Make sure axios is imported
import AdminNavbar from "./Admin/AdminNavbar";
import Level1Officer from "./Admin/Level1Officer";
import Level2Officer from "./Admin/Level2Officer";
import HospitalManager from "./Admin/HospitalManager";
import FieldDoctor from "./Admin/FieldDoctor";
import PolicyDetailManager from "./Admin/PolicyDetailManager";
import RoleManager from "./Admin/RoleManager";
 
const PAGES = {
  level1: Level1Officer,
  level2: Level2Officer,
  hospitals: HospitalManager,
  fielddoctor: FieldDoctor,
  policydetail: PolicyDetailManager,
  role: RoleManager,
};
 
const AdminPage = () => {
  const [selectedPage, setSelectedPage] = useState("level1");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
 
  useEffect(() => {
    axios
      .get("http://localhost:9197/api/users")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        setError(error);
      });
  }, []); // <-- fixed empty dependency array
 
  console.log(users);
 
  const PageComponent = PAGES[selectedPage];
 
  return (
    <>
      <AdminNavbar onNavigate={setSelectedPage} selectedPage={selectedPage} />
      <div>
        {PageComponent ? (
          <PageComponent users={users} error={error} />
        ) : (
          <h2>404 - Admin Page Not Found</h2>
        )}
      </div>
    </>
  );
};
 
export default AdminPage;