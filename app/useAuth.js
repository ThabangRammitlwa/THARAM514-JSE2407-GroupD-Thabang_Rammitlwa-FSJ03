import { useEffect, useState } from 'react';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

/**
 * Custom hook to manage Firebase user authentication state.
 *
 * @returns {Object|null} The authenticated user object or `null` if no user is authenticated.
 */
export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for changes in authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return user;
};
