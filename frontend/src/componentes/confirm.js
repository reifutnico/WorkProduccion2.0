import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Confirm = () => {
  const [confirmed, setConfirmed] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const isConfirmed = localStorage.getItem('accountConfirmed');
    if (isConfirmed) {
      setConfirmed(true);
    }
  }, []);

  const handleGoToLogin = () => {
    navigate('/login'); 
  };

  return (
    <div style={styles.container}>
      <h2>Confirm Your Account</h2>
      <p>Please check your email to confirm your account.</p>
      {confirmed && (
        <button
          onClick={handleGoToLogin}
          style={styles.button}
        >
          Go to Login
        </button>
        
      )}
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
    width: '100%', 
  },
  button: {
    marginTop: '20px',
    padding: '12px 0', 
    fontSize: '18px',
    backgroundColor: '#007BFF', 
    color: 'white',
    border: 'none',
    borderRadius: '8px', 
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
    transition: 'background-color 0.3s, transform 0.3s', 
    width: '80%', 
    maxWidth: '300px',
  },
};

export default Confirm;