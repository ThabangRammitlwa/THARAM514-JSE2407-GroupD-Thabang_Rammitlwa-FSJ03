// components/SignIn.js
import { useState } from 'react';
import { signIn } from '../authFunctions';
import { useRouter } from 'next/router';

/**
 * SignIn component for user authentication.
 * @returns {JSX.Element} SignIn form
 */
const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();
  const { redirectTo } = router.query;

  /**
   * Handles form submission for sign-in.
   * @param {Event} e - The form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      if (redirectTo) {
        router.push(decodeURIComponent(redirectTo));
      } else {
        router.push('/');
      }
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
      <button type="submit">Sign In</button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default SignIn;
