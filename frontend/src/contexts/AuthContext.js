// import React, { createContext, useState, useContext, useEffect } from 'react';
// import authApi from '../api/authApi';

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   // Check if user is logged in on mount
//   useEffect(() => {
//     const initAuth = async () => {
//       if (authApi.isAuthenticated()) {
//         try {
//           const userData = await authApi.getCurrentUser();
//           setUser(userData);
//           setIsAuthenticated(true);
//         } catch (error) {
//           console.error('Failed to fetch user:', error);
//           authApi.logout();
//           setIsAuthenticated(false);
//         }
//       }
//       setLoading(false);
//     };

//     initAuth();
//   }, []);

//   const login = async (credentials) => {
//     try {
//       const data = await authApi.login(credentials);
//       const userData = await authApi.getCurrentUser();
//       setUser(userData);
//       setIsAuthenticated(true);
//       return { success: true, data };
//     } catch (error) {
//       return { 
//         success: false, 
//         error: error.response?.data?.detail || 'Login failed' 
//       };
//     }
//   };

//   const register = async (userData) => {
//     try {
//       const data = await authApi.register(userData);
//       const currentUser = await authApi.getCurrentUser();
//       setUser(currentUser);
//       setIsAuthenticated(true);
//       return { success: true, data };
//     } catch (error) {
//       return { 
//         success: false, 
//         error: error.response?.data || 'Registration failed' 
//       };
//     }
//   };

//   const logout = () => {
//     authApi.logout();
//     setUser(null);
//     setIsAuthenticated(false);
//   };

//   const value = {
//     user,
//     loading,
//     isAuthenticated,
//     login,
//     register,
//     logout,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// // Custom hook to use auth context
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export default AuthContext;


// frontend/src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import authApi from '../api/authApi';
import api from '../api/axios'; // Add this import

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // NEW: Function to switch company
  const switchCompany = async (companyId) => {
    try {
      const response = await api.post('/switch-company/', {
        company_id: companyId
      });
      
      // Update user with new company
      const updatedUser = {
        ...user,
        default_company: response.data.company,
        role: response.data.role
      };
      
      setUser(updatedUser);
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to switch company' 
      };
    }
  };

  // Update the initAuth to check for companies
  useEffect(() => {
    const initAuth = async () => {
      if (authApi.isAuthenticated()) {
        try {
          const userData = await authApi.getCurrentUser();
          // Ensure companies array exists
          const userWithCompanies = {
            ...userData,
            companies: userData.companies || [],
            default_company: userData.default_company || null,
            role: userData.role || 'user'
          };
          setUser(userWithCompanies);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to fetch user:', error);
          authApi.logout();
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Update login to handle new response structure
  const login = async (credentials) => {
    try {
      const data = await authApi.login(credentials);
      
      // The backend now returns user data directly in login response
      const userData = {
        ...data.user,
        companies: data.user.companies || [],
        default_company: data.user.default_company || null,
        role: data.user.role || 'user'
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      };
    }
  };

  // Update register to handle new response structure
  const register = async (userData) => {
    try {
      const data = await authApi.register(userData);
      
      // Register also returns user data
      const userInfo = {
        ...data.user,
        companies: data.user.companies || [],
        default_company: data.user.default_company || null,
        role: data.user.role || 'user'
      };
      
      setUser(userInfo);
      setIsAuthenticated(true);
      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    switchCompany, // NEW: Expose switchCompany function
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;