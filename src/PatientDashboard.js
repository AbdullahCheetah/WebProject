import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const GetAllDoctor = () => {
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState(new Date());
  const [appointmentTime, setAppointmentTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    if (storedToken && storedUserId) {
      setToken(storedToken);
      setUserId(storedUserId);
    }
  }, []);

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
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleRequestAppointment = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleAppointmentSubmit = async () => {
    try {
      if (!appointmentDate || !appointmentTime || !selectedDoctor) {
        console.error('Invalid appointment data. Check the following:');
        console.log('Date:', appointmentDate);
        console.log('Time:', appointmentTime);
        console.log('Selected Doctor:', selectedDoctor);
        return;
      }
  
      const token = localStorage.getItem('token');
  
      const requestData = {
        Date: appointmentDate.toISOString().split('T')[0],
        Time: appointmentTime,
        DoctorID: selectedDoctor._id,
        PatientID: userId,
      };
  
      console.log('Request Data:', requestData);
  
      const response = await fetch('http://localhost:3030/patient/request-appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'token': token,
        },
        body: JSON.stringify(requestData),
      });
  
      const data = await response.json();
      console.log(data);
  
      if (response.ok && data.Success) {
        console.log('Appointment requested successfully:', data.appointment);
  
      } else {
        console.error('Error requesting appointment:', data.Message);
      }
    } catch (error) {
      console.error('Error requesting appointment:', error.message);
    }
  };
  

  return (
    <div>
      <h2>All Doctors</h2>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <ul>
        {doctors.map((doctor) => (
          <li key={doctor._id}>
            {doctor.name}
            <button onClick={() => handleRequestAppointment(doctor)}>Request Appointment</button>
            {selectedDoctor && selectedDoctor._id === doctor._id && (
              <div>
                <h3>Request Appointment</h3>
                <label>
                  Date:
                  <DatePicker selected={appointmentDate} onChange={(date) => setAppointmentDate(date)} />
                </label>
                <br />
                <label>
                  Time:
                  <input
                    type="text"
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    required
                  />
                </label>
                <br />
                <button onClick={handleAppointmentSubmit}>Submit Appointment Request</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GetAllDoctor;