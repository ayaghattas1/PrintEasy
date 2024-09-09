import React from 'react';
import { BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle, BsJustify } from 'react-icons/bs';
import { MDBNavbar, MDBContainer, MDBInputGroup, MDBBtn } from 'mdb-react-ui-kit';
import logo from '../assets/logoo.png'; // Ajustez le chemin si nécessaire

function Header({ OpenSidebar }) {
  return (
    <header className='header'>
        <div className='header-left'>
            <img src={logo} alt='Logo' className='logo' />
        </div>
        <div className='menu-icon'>
            <BsJustify className='icon' onClick={OpenSidebar}/>
        </div>
        <div className='header-center'>
            {/* Intégration de la barre de recherche */}
            <MDBNavbar dark bgColor='dark'>
      <MDBContainer fluid>
        <MDBInputGroup tag="form" className='d-flex w-auto mb-3'>
          <input className='form-control' placeholder="Type query" aria-label="Search" type='Search' />
          <MDBBtn outline>Search</MDBBtn>
        </MDBInputGroup>
      </MDBContainer>
    </MDBNavbar>
        </div>
        <div className='header-right'>
            <BsFillBellFill className='icon'/>
            <BsFillEnvelopeFill className='icon'/>
            <BsPersonCircle className='icon'/>
        </div>
    </header>
  );
}

export default Header;
