import React, { useState, useEffect } from 'react';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    const fetchDoctorAppointments = async () => {
      try {
        const response = await fetch('http://localhost:3030/doctor/appointments', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include token in the Authorization header
          },
          credentials: 'include', // Include if using cookies for authentication
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setAppointments(data.appointments);
      } catch (error) {
        console.error('Error fetching doctor appointments:', error.message);
        setError(`Failed to fetch doctor appointments: ${error.message}`);
      }
    };

    if (token) {
      fetchDoctorAppointments();
    }
  }, [token]); // Fetch appointments whenever the token changes

  return (
    <div>
      <h2>Your Appointments</h2>
      {error && <p>Error: {error}</p>}
      <ul>
        {appointments.map((appointment) => (
          <li key={appointment._id}>
            <p>Date: {appointment.Date}</p>
            <p>Time: {appointment.Time}</p>
            {/* Add more details if needed */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorAppointments;
