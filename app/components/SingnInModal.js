import { useState } from 'react';

/**
 * SignInModal component provides a modal for users to sign in with their email and password.
 *
 * @param {Object} props - Component props.
 * @param {function} props.onClose - Function to close the modal.
 * @param {function} props.onSignIn - Function to handle user sign-in with email and password.
 * @returns {JSX.Element} The SignIn modal component.
 */
export default function SignInModal({ onClose, onSignIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  /**
   * Handles the form submission for user sign-in.
   *
   * @param {Event} e - The form submission event.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    onSignIn(email, password);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl mb-4">Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 border rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 border rounded w-full"
              required
            />
          </div>
          <button type="submit" className="bg-amber-600 text-white p-2 rounded w-full">Sign In</button>
        </form>
        <button onClick={onClose} className="mt-4 text-amber-600 hover:text-amber-800">Close</button>
      </div>
    </div>
  );
}

