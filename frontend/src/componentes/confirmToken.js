import React, { useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ConfirmToken = () => {
  const { token } = useParams(); // Obtiene el token de la URL

  useEffect(() => {
    const confirmUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/account/confirm/${token}`);
        
        if (response.status === 200) {
          localStorage.setItem('accountConfirmed', 'true');
        }
      } catch (error) {
        console.error('Error confirming token:', error);
      }
    };
    confirmUser();
  }, [token]);

  return (
    <div style={styles.container}>
      <h2>Your account has been confirmed</h2>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center',
  },
};

export default ConfirmToken;