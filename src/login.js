import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/signup', { email, password });
      alert(response.data.message); // Handle successful signup
      navigate('/login');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message); // Handle specific error from server
      } else {
        alert('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="container" style={{ marginTop: '10vh' }}>
      <form onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address :</label>
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="form-control"
            id="email"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password :</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="form-control"
            id="password"
          />
        </div>
        <button type="submit" className="btn btn-primary">Sign Up</button>
        <p style={{ marginTop: '2vh' }}>Already have an account? <a href="/login">Login</a></p>
      </form>
    </div>
  );
};

export default Signup;
