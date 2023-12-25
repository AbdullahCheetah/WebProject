import React, { useState, useEffect } from 'react';
import { useNavigate,Link } from 'react-router-dom';

const RecipientDashboard = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [availableDays, setAvailableDays] = useState('');
  const [availableTimeStart, setAvailableTimeStart] = useState('');
  const [availableTimeEnd, setAvailableTimeEnd] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3030/recipient/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role: 'doctor',
          availableDays,
          availableTimeStart,
          availableTimeEnd,
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
        setName('');
        setEmail('');
        setPassword('');
        setAvailableDays('');
        setAvailableTimeStart('');
        setAvailableTimeEnd('');
        handleGetAllDoctors(); // Refresh the doctor list after adding a new one
      }
    } catch (error) {
      console.error('Error adding Doctor:', error.message);
    }
  };

  const handleGetAllDoctors = async () => {
    try {
      const response = await fetch('http://localhost:3030/recipient/getAll');

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setDoctors(data);
    } catch (error) {
      console.error('Error getting doctors:', error.message);
    }
  };

  const handleUpdateDoctor = (doctor) => {
    // Set the selected doctor and show the update modal
    setSelectedDoctor(doctor);
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async () => {
  try {
    const response = await fetch(`http://localhost:3030/recipient/update/${selectedDoctor._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: selectedDoctor.name,
        email: selectedDoctor.email,
        password: selectedDoctor.password,
        availableDays: selectedDoctor.availableDays,
        availableTimeStart: selectedDoctor.availableTimeStart,
        availableTimeEnd: selectedDoctor.availableTimeEnd,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    console.log('Doctor updated successfully:', selectedDoctor._id);
    setShowUpdateModal(false);
    handleGetAllDoctors(); // Refresh the doctor list after updating one
  } catch (error) {
    console.error('Error updating doctor:', error.message);
  }
};


  const handleDeleteDoctor = async (id) => {
    try {
      const response = await fetch(`http://localhost:3030/recipient/delete/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log('Doctor deleted successfully');
      handleGetAllDoctors(); // Refresh the doctor list after deleting one
    } catch (error) {
      console.error('Error deleting doctor:', error.message);
    }
  };

  useEffect(() => {
    handleGetAllDoctors();
  }, []);

  return (
    <div>
      {/* Navbar */}
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
    <div className="doctor-container">
      <h2>Add Doctor</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="doctor-form">
        <label>
          Doctor Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Doctor Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Doctor Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Available Days:
          <input
            type="text"
            value={availableDays}
            onChange={(e) => setAvailableDays(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Available Start Time:
          <input
            type="text"
            value={availableTimeStart}
            onChange={(e) => setAvailableTimeStart(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Available End Time:
          <input
            type="text"
            value={availableTimeEnd}
            onChange={(e) => setAvailableTimeEnd(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Add Doctor</button>
      </form>

      {showUpdateModal && selectedDoctor && (
  <div className="update-modal">
    <h2>Update Doctor</h2>
    <form onSubmit={handleUpdateSubmit} className="doctor-form">
      <label>
        Doctor Name:
        <input
          type="text"
          value={selectedDoctor.name}
          onChange={(e) => setSelectedDoctor({ ...selectedDoctor, name: e.target.value })}
          required
        />
      </label>
      <br />
      <label>
        Doctor Email:
        <input
          type="email"
          value={selectedDoctor.email}
          onChange={(e) => setSelectedDoctor({ ...selectedDoctor, email: e.target.value })}
          required
        />
      </label>
      <br />
      <label>
        Doctor Password:
        <input
          type="password"
          value={selectedDoctor.password}
          onChange={(e) => setSelectedDoctor({ ...selectedDoctor, password: e.target.value })}
          required
        />
      </label>
      <br />
      <label>
        Available Days:
        <input
          type="text"
          value={selectedDoctor.availableDays}
          onChange={(e) => setSelectedDoctor({ ...selectedDoctor, availableDays: e.target.value })}
          required
        />
      </label>
      <br />
      <label>
        Available Start Time:
        <input
          type="text"
          value={selectedDoctor.availableTimeStart}
          onChange={(e) => setSelectedDoctor({ ...selectedDoctor, availableTimeStart: e.target.value })}
          required
        />
      </label>
      <br />
      <label>
        Available End Time:
        <input
          type="text"
          value={selectedDoctor.availableTimeEnd}
          onChange={(e) => setSelectedDoctor({ ...selectedDoctor, availableTimeEnd: e.target.value })}
          required
        />
      </label>
      <br />
      <button type="submit">Update Doctor</button>
    </form>
  </div>
)}


      {/* Display All Doctors */}
      <div>
        <h2>All Doctors</h2>
        <ul>
          {doctors.map((doctor) => (
            <li key={doctor._id}>
              {doctor.name} - {doctor.email}
              <button onClick={() => handleUpdateDoctor(doctor)}>Update</button>
              <button onClick={() => handleDeleteDoctor(doctor._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
  );
};

export default RecipientDashboard;
