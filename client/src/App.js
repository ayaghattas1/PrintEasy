import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Login from './pages/Login'; 
import Dashboard from './pages/Dashboard';   
import Signup from './pages/Signup';
import Produits from './pages/Produits'; 
import Impressions from './pages/Impressions';
//import Notifications from './components/Notifications';   
import Profile from './pages/Profile';   
import Commandes from './pages/Commandes';
import AdminDash from './pages/AdminDash';
import Reports from './pages/Reports';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import MonPanier from './pages/MonPanier';
import DesignPerso from './pages/DesignPerso';
import HeaderAdmin from './components/HeaderAdmin';
import SidebarAdmin from './components/SidebarAdmin';
import ProduitsAdmin from './pages/ProduitsAdmin';
import axios from 'axios';

// Layout component with Header and Sidebar
const Layout = ({ children }) => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // State to track if the user is an admin

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  useEffect(() => {
    // Fetch user role on component mount
    const fetchUserRole = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await axios.get('http://localhost:5000/user/current', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const currentUser = response.data;
          setIsAdmin(currentUser.role === 'Admin'); // Set isAdmin based on the user's role
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      }
    };
    fetchUserRole();
  }, []);

  return (
    <div className='grid-container'>
      {isAdmin ? (
        <>
          <HeaderAdmin OpenSidebar={OpenSidebar} />
          <SidebarAdmin openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
        </>
      ) : (
        <>
          <Header OpenSidebar={OpenSidebar} />
          <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
        </>
      )}
      <div className='main-content'>{children}</div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/produits" element={<Layout><Produits /></Layout>} />
        <Route path="/impressions" element={<Layout><Impressions /></Layout>} />
        <Route path="/DesignPerso" element={<Layout><DesignPerso /></Layout>} />
        <Route path="/Profile" element={<Layout><Profile /></Layout>} />
        <Route path="/commandes" element={<Layout><Commandes /></Layout>} />
        <Route path="/AdminDash" element={<Layout><AdminDash /></Layout>} />
        <Route path="/produitsAdmin" element={<Layout><ProduitsAdmin /></Layout>} />
        <Route path="/Reports" element={<Layout><Reports /></Layout>} />
        <Route path="/MonPanier" element={<Layout><MonPanier /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
