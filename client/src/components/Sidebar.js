import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BsCart3, BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, 
  BsListCheck, BsMenuButtonWideFill, BsFillGearFill
} from 'react-icons/bs';
import { TbLogout2 } from "react-icons/tb";

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Effacer les données d'authentification (par exemple, le token)
    localStorage.removeItem('token');
    // Rediriger vers la page de connexion ou la page d'accueil
    navigate('/');
  };

  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>

        <ul className='sidebar-list'>
            <li className='sidebar-list-item'>
                <Link to="/dashboard">
                    <BsGrid1X2Fill className='icon'/> Accueil
                </Link>
            </li>
            <li className='sidebar-list-item'>
                <Link to="/commandes">
                <BsCart3 className='icon_header'/> Mes Commandes
                </Link>
            </li>

            <li className='sidebar-list-item'>
                <Link to="/produits">
                    <BsFillArchiveFill className='icon'/> Produits
                </Link>
            </li>
            <li className='sidebar-list-item'>
                <Link to="/impressions">
                    <BsFillGrid3X3GapFill className='icon'/> Impression numérique 
                </Link>
            </li>
            <li className='sidebar-list-item'>
                <Link to="/grand-format">
                    <BsPeopleFill className='icon'/> Grand Format
                </Link>
            </li>
            <li className='sidebar-list-item'>
                <Link to="/design">
                    <BsListCheck className='icon'/> Design Personnalisé
                </Link>
            </li>
            <li className='sidebar-list-item'>
                <Link to="/reports">
                    <BsMenuButtonWideFill className='icon'/> Reports
                </Link>
            </li>
            <li className='sidebar-list-item'>
                <Link to="/settings">
                    <BsFillGearFill className='icon'/> Setting
                </Link>
            </li>
            <li className='sidebar-list-item'>
                <span onClick={handleLogout} style={{ cursor: 'pointer' }}>
                    <TbLogout2 className='icon'/> Logout
                </span>
            </li>
        </ul>
    </aside>
  );
}

export default Sidebar;
