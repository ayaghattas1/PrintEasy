import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BsCart3, BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, 
  BsListCheck, BsMenuButtonWideFill
} from 'react-icons/bs';
import { TbLogout2 } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";
import axios from 'axios';
import { confirmAlert } from 'react-confirm-alert'; // Import the confirmation alert
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import styles

function Sidebar({ openSidebarToggle }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // Fetch user role when the component mounts
  useEffect(() => {
    const fetchUserRole = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const response = await axios.get('http://localhost:5000/user/current', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.status === 200) {
            const currentUser = response.data;
            setIsAdmin(currentUser.role === 'Admin');
          } else {
            throw new Error('Failed to get user info.');
          }
        } catch (error) {
          console.error('Error fetching user info:', error);
        }
      }
    };

    fetchUserRole();
  }, []);

  const handleLogout = () => {
    confirmAlert({
      title: 'Confirmer la déconnexion',
      message: 'Êtes-vous sûr de vouloir vous déconnecter ?',
      buttons: [
        {
          label: 'Oui',
          onClick: () => {
            // Clear authentication data (e.g., token)
            localStorage.removeItem('authToken');
            // Redirect to login or home page
            navigate('/');
          },
        },
        {
          label: 'Non',
          onClick: () => {}, // Do nothing
        },
      ],
    });
  };

  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
      <ul className='sidebar-list'>
        <li className='sidebar-list-item'>
          <Link to="/dashboard">
            <BsGrid1X2Fill className='icon' /> Accueil
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/commandes">
            <BsCart3 className='icon_header' /> Mes Commandes
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/produits">
            <BsFillArchiveFill className='icon' /> Produits
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/impressions">
            <BsFillGrid3X3GapFill className='icon' /> Impression numérique
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/grand-format">
            <BsPeopleFill className='icon' /> Grand Format
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/design">
            <BsListCheck className='icon' /> Design Personnalisé
          </Link>
        </li>
        {isAdmin && (
          <li className='sidebar-list-item'>
            <Link to="/reports">
              <BsMenuButtonWideFill className='icon' /> Reports
            </Link>
          </li>
        )}
        <li className='sidebar-list-item'>
          <Link to="/profile">
            <CgProfile className='icon' /> Profil
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <span onClick={handleLogout} style={{ cursor: 'pointer' }}>
            <TbLogout2 className='icon' /> Logout
          </span>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
