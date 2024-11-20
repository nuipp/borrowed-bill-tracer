import React, { createContext, useState, useEffect } from "react";
import { auth } from "./Helpers/firebaseConfig"; // Firebase authentication instance
import { onAuthStateChanged } from "firebase/auth";

// Create a context for authentication
export const AuthContext = createContext();

/**
 * AuthProvider Component: Wraps the application and provides authentication state.
 * @param {Object} children - Components that need access to the authentication state.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores the authenticated user
  const [isLoading, setIsLoading] = useState(true); // Tracks if authentication state is being loaded

  useEffect(() => {
    // Listen to authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log("User logged in:", currentUser.email);
      } else {
        console.log("No user is currently logged in.");
      }
      setUser(currentUser); // Update user state
      setIsLoading(false); // Authentication state is loaded
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  // Provide user and authentication state
  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {isLoading ? (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <p>Loading authentication...</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
