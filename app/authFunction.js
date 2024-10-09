// authFunctions.js
import { auth } from './firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

/**
 * Sign up a new user with email and password.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<UserCredential>} A promise that resolves with the user credentials.
 * @throws {Error} If sign-up fails.
 */
export const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

/**
 * Sign in an existing user with email and password.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<UserCredential>} A promise that resolves with the user credentials.
 * @throws {Error} If sign-in fails.
 */
export const signIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

/**
 * Sign out the current user.
 * @returns {Promise<void>} A promise that resolves when sign-out is complete.
 * @throws {Error} If sign-out fails.
 */
export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

/**
 * Set up an authentication state listener.
 * @param {function(User|null): void} callback - The callback function to handle auth state changes.
 * @returns {function(): void} A function to unsubscribe the listener.
 */
export const authStateListener = (callback) => {
  return onAuthStateChanged(auth, callback);
};
