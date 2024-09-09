import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Login from './pages/Login'; 
import Dashboard from './pages/Dashboard';   
import Signup from './pages/Signup';
import Produits from './pages/Produits'; 
import Impressions from './pages/Impressions';   


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
      </Routes>
    </Router>
  );
}

export default App;
