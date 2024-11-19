import React, { useState } from "react";
import FirebaseHelper from "../Helpers/firebaseHelper";

const TestFirebase = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" }); // Enhanced message state
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.trimStart(), // Prevent leading spaces
    }));
  };

  // Validate input fields
  const validateInputs = () => {
    const { name, email, phone } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!name || !email || !phone) {
      return "All fields are required!";
    }
    if (!emailRegex.test(email)) {
      return "Invalid email format!";
    }
    if (!phoneRegex.test(phone)) {
      return "Phone number must be 10 digits!";
    }
    return null; // Validation passed
  };

  // Add user to Firebase
  const addUser = async () => {
    const validationError = validateInputs();
    if (validationError) {
      setMessage({ text: validationError, type: "error" });
      return;
    }

    setIsLoading(true);
    try {
      const response = await FirebaseHelper.addDocument("users", formData);
      if (response.success) {
        setMessage({ text: `User added successfully with ID: ${response.id}`, type: "success" });
        setFormData({ name: "", email: "", phone: "" }); // Reset form
        fetchUsers(); // Refresh user list
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      setMessage({ text: `Error adding user: ${error.message}`, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all users
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await FirebaseHelper.getAllDocuments("users");
      if (response.success) {
        setUsers(response.data);
        setMessage({ text: "Users fetched successfully.", type: "success" });
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      setMessage({ text: `Error fetching users: ${error.message}`, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  // Render message
  const renderMessage = () => {
    if (message.text) {
      return (
        <p
          style={{
            marginTop: "10px",
            color: message.type === "error" ? "red" : "green",
          }}
        >
          {message.text}
        </p>
      );
    }
    return null;
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Firebase User Management</h1>

      <h2>Add a New User</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          addUser();
        }}
        style={{
          marginBottom: "20px",
          display: "flex",
          flexDirection: "column",
          maxWidth: "400px",
        }}
      >
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{
              padding: "10px",
              margin: "5px 0",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              padding: "10px",
              margin: "5px 0",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
        </label>
        <label>
          Phone:
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            style={{
              padding: "10px",
              margin: "5px 0",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          />
        </label>
        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: "10px",
            marginTop: "10px",
            backgroundColor: isLoading ? "#ccc" : "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? "Adding..." : "Add User"}
        </button>
      </form>

      <h2>Users</h2>
      <button
        onClick={fetchUsers}
        disabled={isLoading}
        style={{
          padding: "10px",
          backgroundColor: isLoading ? "#ccc" : "#008CBA",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: isLoading ? "not-allowed" : "pointer",
        }}
      >
        {isLoading ? "Fetching..." : "Fetch All Users"}
      </button>

      {renderMessage()}

      <ul style={{ marginTop: "20px", listStyle: "none", padding: "0" }}>
        {users.map((user) => (
          <li
            key={user.id}
            style={{
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              marginBottom: "10px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <strong>Name:</strong> {user.name}
            <strong>Email:</strong> {user.email}
            <strong>Phone:</strong> {user.phone}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TestFirebase;
