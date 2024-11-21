import React, { useContext, useState } from "react";
import FirebaseHelper from "../Helpers/firebaseHelper";
import { AuthContext } from "./AuthContext";

const Login = () => {
  const { user } = useContext(AuthContext); // Access the authenticated user
  const [isLoading, setIsLoading] = useState(false); // Manage button loading state
  const [errorMessage, setErrorMessage] = useState(""); // Display error messages

  // Handle Google Sign-In
  const handleSignIn = async () => {
    setIsLoading(true); // Set loading state
    setErrorMessage(""); // Clear any previous error message

    try {
      const result = await FirebaseHelper.googleSignIn();
      if (result.success) {
        console.log("Sign-in successful:", result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error during Sign-In:", error.message);
      setErrorMessage("Failed to sign in. Please try again.");
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  // Handle Google Sign-Out
  const handleSignOut = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const result = await FirebaseHelper.googleSignOut();
      if (result.success) {
        console.log("Sign-out successful");
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error during Sign-Out:", error.message);
      setErrorMessage("Failed to sign out. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      {user ? (
        <div>
          <p>
            Welcome, <strong>{user.displayName || user.email}</strong>
          </p>
          <button
            onClick={handleSignOut}
            disabled={isLoading}
            style={{
              padding: "10px 20px",
              backgroundColor: isLoading ? "#ccc" : "#FF5252",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: isLoading ? "not-allowed" : "pointer",
              fontSize: "16px",
            }}
          >
            {isLoading ? "Signing Out..." : "Sign Out"}
          </button>
        </div>
      ) : (
        <div>
          <button
            onClick={handleSignIn}
            disabled={isLoading}
            style={{
              padding: "10px 20px",
              backgroundColor: isLoading ? "#ccc" : "#0F9D58",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: isLoading ? "not-allowed" : "pointer",
              fontSize: "16px",
            }}
          >
            {isLoading ? "Signing In..." : "Sign in with Google"}
          </button>
          {errorMessage && (
            <p style={{ color: "red", marginTop: "10px" }}>{errorMessage}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Login;
