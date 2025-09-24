import { createContext, useEffect, useState } from "react";
import axios from "axios";
export const userDataContext = createContext();
const UserContext = ({ children }) => {
  const serverUrl = "https://virtual-assistant-backend-opd2.onrender.com";
  const [userData, setUserData] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setbackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState();

  const handleCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/current`, {
        withCredentials: true,
      });
      setUserData(result.data);
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getGeminiResponse = async (command) => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/user/asktoassistant`,
        { command },
        { withCredentials: true }
      );
      return result.data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleCurrentUser();
  }, []);

  const value = {
    serverUrl, // <-- Add this
    setUserData,
    userData,
    backendImage,
    setbackendImage,
    frontendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage,
    getGeminiResponse,
  };
  return (
    <div>
      <userDataContext.Provider value={value}>
        {children}
      </userDataContext.Provider>
    </div>
  );
};

export default UserContext;

// import { createContext, useEffect, useState } from "react";
// import axios from "axios";

// export const userDataContext = createContext();

// const UserContext = ({ children }) => {
//   const serverUrl = "http://localhost:8000";
//   const [userData, setUserData] = useState(null);
//   const handleCurrentUser = async () => {
//     try {
//       const result = await axios.get(`${serverUrl}/api/user/current`);
//       setUserData(result.data);
//       console.log(result.data);
//     } catch (error) {
//       console.log(
//         "Error fetching user:",
//         error.response?.data || error.message
//       );
//     }
//   };

//   useEffect(() => {
//     handleCurrentUser();
//   }, []);

//   const value = {
//     serverUrl,
//     userData,
//     setUserData,
//   };

//   return (
//     <userDataContext.Provider value={value}>
//       {children}
//     </userDataContext.Provider>
//   );
// };

// export default UserContext;
