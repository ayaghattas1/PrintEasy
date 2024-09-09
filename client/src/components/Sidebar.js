import React from 'react';
import { Link } from 'react-router-dom';
import {
  BsCart3, BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, 
  BsListCheck, BsMenuButtonWideFill, BsFillGearFill
} from 'react-icons/bs';

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
        <div className='sidebar-title'>
            <div className='sidebar-brand'>
                <BsCart3 className='icon_header'/> Panier
            </div>
            <span className='icon close_icon' onClick={OpenSidebar}>X</span>
        </div>

        <ul className='sidebar-list'>
            <li className='sidebar-list-item'>
                <Link to="/dashboard">
                    <BsGrid1X2Fill className='icon'/> Accueil
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
        </ul>
    </aside>
  );
}

export default Sidebar;
