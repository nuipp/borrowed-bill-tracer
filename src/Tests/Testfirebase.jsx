import React, { useState, useContext } from "react";
import FirebaseHelper from "../Helpers/firebaseHelper";
import { AuthContext } from "../AuthContext"; // Access authentication context

const TestFirebase = () => {
  const { user } = useContext(AuthContext); // Authenticated user
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState({ text: "", type: "" }); // Message for user feedback
  const [isLoading, setIsLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.trimStart(), // Remove leading spaces
    }));
  };

  // Validate input fields
  const validateInputs = () => {
    const { name, email, phone } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!name || !email || !phone) return "All fields are required!";
    if (!emailRegex.test(email)) return "Invalid email format!";
    if (!phoneRegex.test(phone)) return "Phone number must be 10 digits!";
    return null; // Validation passed
  };

  // Add a user to Firebase
  const addUser = async () => {
    if (!user) {
      setMessage({ text: "You must be signed in to add users!", type: "error" });
      return;
    }

    const validationError = validateInputs();
    if (validationError) {
      setMessage({ text: validationError, type: "error" });
      return;
    }

    const data = { ...formData, userId: user.uid }; // Tie data to the logged-in user

    setIsLoading(true);
    try {
      const response = await FirebaseHelper.addDocument("users", data);
      if (response.success) {
        setMessage({ text: `User added successfully (ID: ${response.id})`, type: "success" });
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

  // Fetch users associated with the current logged-in user
  const fetchUsers = async () => {
    if (!user) {
      setMessage({ text: "You must be signed in to view users!", type: "error" });
      return;
    }

    setIsLoading(true);
    try {
      const response = await FirebaseHelper.queryDocuments("users", "userId", "==", user.uid);
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

  // Render user feedback message
  const renderMessage = () =>
    message.text && (
      <p
        style={{
          marginTop: "10px",
          color: message.type === "error" ? "red" : "green",
          textAlign: "center",
        }}
      >
        {message.text}
      </p>
    );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f9f9f9",
        padding: "20px",
      }}
    >
      <h1 style={{ marginBottom: "20px" }}>Borrowed Bill Tracer</h1>

      {user ? (
        <p>Logged in as: <strong>{user.email}</strong></p>
      ) : (
        <p style={{ color: "red" }}>You are not signed in. Please log in to add or view users.</p>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          addUser();
        }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            width: "300px",
          }}
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            width: "300px",
          }}
        />
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone"
          required
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            width: "300px",
          }}
        />
        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: "10px 20px",
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

      <button
        onClick={fetchUsers}
        disabled={isLoading}
        style={{
          padding: "10px 20px",
          backgroundColor: isLoading ? "#ccc" : "#008CBA",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: isLoading ? "not-allowed" : "pointer",
          marginBottom: "20px",
        }}
      >
        {isLoading ? "Fetching..." : "Fetch My Users"}
      </button>

      {renderMessage()}

      <ul style={{ listStyle: "none", padding: "0", width: "300px" }}>
        {users.map((user) => (
          <li
            key={user.id}
            style={{
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              backgroundColor: "#fff",
              marginBottom: "10px",
            }}
          >
            <strong>Name:</strong> {user.name}
            <br />
            <strong>Email:</strong> {user.email}
            <br />
            <strong>Phone:</strong> {user.phone}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TestFirebase;
