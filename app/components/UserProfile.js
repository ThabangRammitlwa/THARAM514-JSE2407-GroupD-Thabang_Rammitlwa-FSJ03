import { useState, useEffect } from 'react';
import { authStateListener, signOutUser } from '../authFunctions';

/**
 * UserProfile component displays the user's profile information
 * and allows the user to sign out.
 *
 * @returns {JSX.Element} The UserProfile component.
 */
const UserProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen for changes in the authentication state
    const unsubscribe = authStateListener((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      {user ? (
        <>
          <p>Welcome, {user.email}</p>
          <button onClick={signOutUser}>Sign Out</button>
        </>
      ) : (
        <p>No user is signed in</p>
      )}
    </div>
  );
};

export default UserProfile;

