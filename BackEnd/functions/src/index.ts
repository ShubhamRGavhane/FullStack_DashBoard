import * as functions from 'firebase-functions'; // Ensure this is correct
import * as admin from 'firebase-admin'; 
import express from 'express';
import cors from 'cors';

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();
const app = express();

// Enable Cross-Origin Resource Sharing (CORS)
app.use(
  cors({
    origin: true
  })
);
app.use(express.json()); // Middleware to parse JSON bodies


// CRUD Operation: Get all users
app.get('/users', async (req, res) => {
  try {
    const snapshot = await db.collection('users').get();
    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// CRUD Operation: Create a new user
app.post('/users', async (req, res) => {
  try {
    const data = req.body;
    const userRef = await db.collection('users').add(data);
    res.status(201).json({
      id: userRef.id,
    });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ error: "Failed to add user" });
  }
});

// CRUD Operation: Update an existing user by ID
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    await db.collection('users').doc(id).update(data);
    res.status(200).json({
      message: 'User updated successfully',
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

// CRUD Operation: Delete a user by ID
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.collection('users').doc(id).delete();
    res.status(200).json({
      message: 'User deleted successfully',
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// Export the API for Firebase Functions
export const api = functions.https.onRequest(app);
