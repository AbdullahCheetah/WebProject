import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [editAppointmentId, setEditAppointmentId] = useState(null);
  const [editedDate, setEditedDate] = useState('');
  const [editedTime, setEditedTime] = useState('');
  
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
  useEffect(() => {
   

    fetchAppointments();
  }, []);

  const handleStatusChange = async (appointmentId) => {
    try {
      const response = await fetch(`http://localhost:3030/recipient/updateAppointmentStatus/${appointmentId}`, {
        method: 'PUT',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, ApproveStatus: true }
            : appointment
        )
      );
    } catch (error) {
      console.error('Error updating appointment status:', error.message);
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      const response = await fetch(`http://localhost:3030/recipient/deleteAppointment/${appointmentId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setAppointments((prevAppointments) =>
        prevAppointments.filter((appointment) => appointment._id !== appointmentId)
      );
    } catch (error) {
      console.error('Error deleting appointment:', error.message);
    }
  };

  const handleEditClick = (appointmentId, date, time) => {
    setEditAppointmentId(appointmentId);
    setEditedDate(date);
    setEditedTime(time);
  };

  const handleEditSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:3030/recipient/updateAppointment/${editAppointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newDate: editedDate,
          newTime: editedTime,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setEditAppointmentId(null);
      setEditedDate('');
      setEditedTime('');

      const updatedAppointments = await response.json();
      //setAppointments(updatedAppointments);
      fetchAppointments()
    } catch (error) {
      console.error('Error updating appointment:', error.message);
    }
  };

  const handleEditCancel = () => {
    setEditAppointmentId(null);
    setEditedDate('');
    setEditedTime('');
  };

  const containerStyles = {
    textAlign: 'center',
    margin: '20px auto',
    width: '70%',
  };

  const appointmentItemStyles = {
    marginBottom: '15px',
    padding: '15px',
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
    border: '1px solid #ddd',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
  };

  const buttonStyles = {
    marginTop: '10px',
    display: 'flex',
    justifyContent: 'right',

  };

  const mar ={
    marginRight:'10px',
  } 

 

  const editInputsStyles = {
    marginTop: '10px',
    display: 'flex',
    justifyContent: 'space-between',
  };

  const editInputStyles = {
    flexGrow: '1',
    marginRight: '10px',
    padding: '5px',
  };

  const editButtonsStyles = {
    marginTop: '10px',
    display: 'flex',
    justifyContent: 'flex-end',
  };

  const editButtonStyle = {
    marginRight: '5px',
  };

  const navStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px',
    backgroundColor: 'rgb(105, 113, 243)',
    marginBottom: '3px',
  };

  const linkContainer = {
    display: 'flex',
    alignItems: 'center',
  };

  const linkStyles = {
    color: 'black',
    textDecoration: 'none',
    marginLeft: '15px',
    border: '1px solid black',
    padding: '5px',
    borderRadius: '5px',
  };

  const logoutLinkStyles = {
    ...linkStyles,
    border: '1px solid red',
  };

  return (
    <div>
      <nav style={navStyles}>
        <div>
          <h3>Healthcare App</h3>
        </div>
        <div style={linkContainer}>
          <Link to="/recipient" style={linkStyles}>
            Doctors
          </Link>
          <Link to="/appointments" style={linkStyles}>
            Appointments
          </Link>
          <Link to="/" style={logoutLinkStyles}>
            Logout
          </Link>
        </div>
      </nav>

      <div style={containerStyles}>
        <h2>Appointments</h2>
        <ul>
          {appointments.map((appointment) => (
            <li key={appointment._id} style={appointmentItemStyles}>
              <div>
                <strong>Date:</strong> {appointment.Date}, <strong>Time:</strong> {appointment.Time}, <strong>Doctor Name:</strong> {appointment.DoctorName}, <strong>Patient Name:</strong> {appointment.PatientName},
                <strong>Approve Status:</strong>
                {appointment.ApproveStatus ? (
                  'Approved'
                ) : (
                  <button onClick={() => handleStatusChange(appointment._id)}>Not Approved</button>
                )},
                <strong>Status:</strong> {appointment.Status}
              </div>
              {editAppointmentId === appointment._id ? (
                <>
                  <div style={editInputsStyles}>
                    <input
                      type="text"
                      value={editedDate}
                      onChange={(e) => setEditedDate(e.target.value)}
                      style={editInputStyles}
                    />
                    <input
                      type="text"
                      value={editedTime}
                      onChange={(e) => setEditedTime(e.target.value)}
                      style={editInputStyles}
                    />
                  </div>
                  <div style={editButtonsStyles}>
                    <button onClick={handleEditSubmit} style={editButtonStyle}>
                      Submit
                    </button>
                    <button onClick={handleEditCancel} style={editButtonStyle}>
                      Cancel
                    </button>
                    <button onClick={() => handleDeleteAppointment(appointment._id)}>
                      Delete
                    </button>
                  </div>
                </>
              ) : (
                <div style={buttonStyles}>
                  <button style={mar} onClick={() => handleEditClick(appointment._id, appointment.Date, appointment.Time)} >
                    Edit
                  </button>
                  <button onClick={() => handleDeleteAppointment(appointment._id)}>
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AppointmentsPage;