import React, { useState, useEffect } from 'react';

const GetAllDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('http://localhost:3030/patient/doctors');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch doctors');
        }

        setDoctors(data.doctors);
      } catch (error) {
        console.error('Error fetching doctors:', error.message);
        setError('Failed to fetch doctors');
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div>
      <h2>All Doctors</h2>
      <ul>
        {doctors.map((doctor) => (
          <li key={doctor._id}>{doctor.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default GetAllDoctor;
