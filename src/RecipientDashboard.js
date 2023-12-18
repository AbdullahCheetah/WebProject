import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 

const AddDoctor = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const response = await fetch('http://localhost:3030/admin/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
            role: 'doctor',
          }),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
  
        if (data.message) {
          setError(data.message);
        } else {
          console.log('Doctor added successfully:', data);
          setEmail('');
          setPassword('');
          navigate('/recipient');
        }
      } catch (error) {
        console.error('Error adding Doctor:', error.message);
      }
    };
  
    return (
      <div>
        <h2>Add Doctor</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            Doctor Email:
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <br />
          <label>
            Doctor Password:
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <br />

          <button type="submit">Add Doctor</button>
        </form>
      </div>
    );
  };
  
  export default AddDoctor;
  
  
