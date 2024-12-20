import { collection, addDoc, getDoc, doc, getDocs, query, where, deleteDoc, updateDoc } from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { db, auth } from "./firebaseConfig";

class FirebaseHelper {
  /**
   * Sign in with Google
   * @returns {Promise<Object>} - User info or error
   */
  static async googleSignIn() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log(`User signed in: ${user.displayName} (${user.email})`);
      return { success: true, data: user };
    } catch (error) {
      console.error("Error during Google Sign-In:", error.message);
      return { success: false, error: error.message || "Unknown error during Google Sign-In." };
    }
  }

  /**
   * Sign out the current user
   * @returns {Promise<Object>} - Success or error
   */
  static async googleSignOut() {
    try {
      await signOut(auth);
      console.log("User signed out successfully.");
      return { success: true };
    } catch (error) {
      console.error("Error during Sign-Out:", error.message);
      return { success: false, error: error.message || "Unknown error during Sign-Out." };
    }
  }

  /**
   * Add a new document to a specified collection
   * @param {string} collectionName - Name of the Firestore collection
   * @param {Object} data - The data to store in the new document
   * @returns {Promise<Object>} - Success flag and document ID or error
   */
  static async addDocument(collectionName, data = {}) {
    if (!collectionName || typeof data !== "object") {
      console.error("Invalid parameters: Missing collection name or data object.");
      return { success: false, error: "Invalid parameters" };
    }
    try {
      const docRef = await addDoc(collection(db, collectionName), data);
      console.log(`Document added to '${collectionName}' with ID: ${docRef.id}`);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error(`Error adding document to '${collectionName}':`, error.message);
      return { success: false, error: error.message || "Unknown error while adding document." };
    }
  }

  /**
   * Get a document by its ID from a specified collection
   * @param {string} collectionName - Name of the Firestore collection
   * @param {string} id - Document ID
   * @returns {Promise<Object>} - Success flag and document data or error
   */
  static async getDocumentById(collectionName, id) {
    if (!collectionName || !id) {
      console.error("Invalid parameters: Missing collection name or document ID.");
      return { success: false, error: "Invalid parameters" };
    }
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log(`Document fetched from '${collectionName}' with ID: ${id}`);
        return { success: true, data: docSnap.data() };
      } else {
        console.warn(`No document found in '${collectionName}' with ID: ${id}`);
        return { success: false, message: "No document found" };
      }
    } catch (error) {
      console.error(`Error fetching document from '${collectionName}':`, error.message);
      return { success: false, error: error.message || "Unknown error while fetching document." };
    }
  }

  /**
   * Get all documents from a specified collection
   * @param {string} collectionName - Name of the Firestore collection
   * @returns {Promise<Object>} - Success flag and array of documents or error
   */
  static async getAllDocuments(collectionName) {
    if (!collectionName) {
      console.error("Invalid parameters: Missing collection name.");
      return { success: false, error: "Invalid parameters" };
    }
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      console.log(`Fetched ${documents.length} documents from '${collectionName}'`);
      return { success: true, data: documents };
    } catch (error) {
      console.error(`Error fetching documents from '${collectionName}':`, error.message);
      return { success: false, error: error.message || "Unknown error while fetching documents." };
    }
  }

  /**
   * Query documents based on a field condition
   * @param {string} collectionName - Name of the Firestore collection
   * @param {string} field - Field to query
   * @param {string} operator - Query operator (e.g., "==", ">", "<")
   * @param {*} value - Value to compare
   * @returns {Promise<Object>} - Success flag and array of documents or error
   */
  static async queryDocuments(collectionName, field, operator, value) {
    if (!collectionName || !field || !operator || value === undefined) {
      console.error("Invalid parameters: Missing query parameters.");
      return { success: false, error: "Invalid parameters" };
    }
    try {
      const q = query(collection(db, collectionName), where(field, operator, value));
      const querySnapshot = await getDocs(q);
      const results = [];
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() });
      });
      console.log(`Query in '${collectionName}' returned ${results.length} results.`);
      return { success: true, data: results };
    } catch (error) {
      console.error(`Error querying documents in '${collectionName}':`, error.message);
      return { success: false, error: error.message || "Unknown error while querying documents." };
    }
  }

  /**
   * Update a document by its ID
   * @param {string} collectionName - Name of the Firestore collection
   * @param {string} id - Document ID
   * @param {Object} data - The data to update in the document
   * @returns {Promise<Object>} - Success flag or error
   */
  static async updateDocument(collectionName, id, data = {}) {
    if (!collectionName || !id || typeof data !== "object") {
      console.error("Invalid parameters: Missing collection name, document ID, or data object.");
      return { success: false, error: "Invalid parameters" };
    }
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, data);
      console.log(`Document in '${collectionName}' with ID: ${id} updated successfully.`);
      return { success: true };
    } catch (error) {
      console.error(`Error updating document in '${collectionName}':`, error.message);
      return { success: false, error: error.message || "Unknown error while updating document." };
    }
  }

  /**
   * Delete a document by its ID
   * @param {string} collectionName - Name of the Firestore collection
   * @param {string} id - Document ID
   * @returns {Promise<Object>} - Success flag or error
   */
  static async deleteDocument(collectionName, id) {
    if (!collectionName || !id) {
      console.error("Invalid parameters: Missing collection name or document ID.");
      return { success: false, error: "Invalid parameters" };
    }
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      console.log(`Document in '${collectionName}' with ID: ${id} deleted successfully.`);
      return { success: true };
    } catch (error) {
      console.error(`Error deleting document in '${collectionName}':`, error.message);
      return { success: false, error: error.message || "Unknown error while deleting document." };
    }
  }
}

export default FirebaseHelper;
