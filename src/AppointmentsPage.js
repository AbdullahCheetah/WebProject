import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    // Fetch appointments from your backend when the component mounts
    const fetchAppointments = async () => {
      try {
        const response = await fetch('http://localhost:3030/recipient/getAllAppointments');

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error.message);
      }
    };

    fetchAppointments();
  }, []); // The empty dependency array ensures that this effect runs only once when the component mounts

  return (
    <div>
      {/* Navbar for AppointmentsPage */}
      <nav>
        <ul>
          <li>
            <Link to="/recipient">Doctors</Link>
          </li>
          <li>
            <Link to="/appointments">Appointments</Link>
          </li>
        </ul>
      </nav>

      {/* Appointments Page Content */}
      <div className="appointments-container">
        <h2>Appointments</h2>
        <ul>
          {appointments.map((appointment) => (
            <li key={appointment._id}>
              Date: {appointment.Date}, Time: {appointment.Time}, Doctor ID: {appointment.DoctorID}, Patient ID: {appointment.PatientID}, Approve Status: {appointment.ApproveStatus ? 'Approved' : 'Not Approved'}, Status: {appointment.Status}, Type: {appointment.Type}, Fees: {appointment.Fees}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AppointmentsPage;
