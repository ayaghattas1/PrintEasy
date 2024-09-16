import React, { useEffect, useState } from 'react';
import { BsFillBellFill, BsFillEnvelopeFill, BsPersonCircle, BsJustify } from 'react-icons/bs';
import { MDBNavbar, MDBContainer, MDBInputGroup, MDBBtn } from 'mdb-react-ui-kit';
import logo from '../assets/logoo.png'; // Adjust path if necessary
import { Link } from 'react-router-dom';
import axios from 'axios';

function Header({ OpenSidebar }) {
  const [profilePhoto, setProfilePhoto] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfilePhoto = async () => {
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
            setProfilePhoto(`http://localhost:5000/uploads/${currentUser.photo.replace(/\\/g, '/')}`);
          } else {
            throw new Error('Failed to get user info.');
          }
        } catch (error) {
          console.error('Error fetching user info:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchProfilePhoto();
  }, []);

  return (
    <header className='header'>
      <div className='header-left'>
        <img src={logo} alt='Logo' className='logo' />
      </div>
      <div className='menu-icon'>
        <BsJustify className='icon' onClick={OpenSidebar} />
      </div>
      <div className='header-center'>
        {/* Search bar integration */}
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
        <BsFillBellFill className='icon' />
        <BsFillEnvelopeFill className='icon' />
        <Link to="/Profile">
          {loading ? (
            <span>Loading...</span>
          ) : profilePhoto ? (
            <img
              src={profilePhoto}
              alt="Profile"
              className="profile-icon"
            />
          ) : (
            <BsPersonCircle className='icon' />
          )}
        </Link>
      </div>
    </header>
  );
}

export default Header;
