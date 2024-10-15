import React, { useState } from 'react';
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


// Layout component with Header and Sidebar
const Layout = ({ children }) => {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <div className='grid-container'>
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      <div className='main-content'>
        {children}
      </div>
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

        <Route path="/dashboard" element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route 
          path="/produits" 
          element={
            <Layout>
              <Produits />
            </Layout>
          } 
        />

        <Route 
          path="/impressions" 
          element={
            <Layout>
              <Impressions />
            </Layout>
          } 
        />
        
        <Route 
          path="/Profile" 
          element={
            <Layout>
              <Profile />
            </Layout>
          } 
        />

        <Route 
          path="/commandes" 
          element={
            <Layout>
              <Commandes />
            </Layout>
          } 
        />
        <Route 
          path="/AdminDash" 
          element={
            <Layout>
              <AdminDash />
            </Layout>
          } 
        />
        <Route 
          path="/Reports" 
          element={
            <Layout>
              <Reports />
            </Layout>
          } 
        />

      </Routes>
    </Router>
  );
}

export default App;
