// components/UserProfile.js
import { useState, useEffect } from 'react';
import { authStateListener, signOutUser } from '../authFunctions';

const UserProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
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
