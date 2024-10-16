"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '../useAuth';
import { signIn, signOutUser, signUp } from '../authFunction';
import { FaUser, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import SignInModal from './SingnInModal';
import SignUpModal from './SignUpModal'; // Import the new SignUpModal component

/**
 * Header component for the application.
 *
 * @param {Object} props - Component props.
 * @param {string} [props.currentSearch=''] - The initial search term.
 * @param {function} props.onSearch - Callback function when search is submitted.
 * @returns {JSX.Element} - Rendered Header component.
 */
export default function Header({ currentSearch = '', onSearch }) {
  const [search, setSearch] = useState(currentSearch);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false); // State for sign-up modal

  const user = useAuth();

  useEffect(() => {
    if (currentSearch !== undefined) {
      setSearch(currentSearch);
    }
  }, [currentSearch]);

  /**
   * Handles the search form submission.
   *
   * @param {Event} e - The form submit event.
   */
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(search);
  };

  /**
   * Handles user sign-in action.
   *
   * @param {string} email - The user's email.
   * @param {string} password - The user's password.
   */
  const handleSignIn = async (email, password) => {
    try {
      await signIn(email, password);
      setIsSignInModalOpen(false); // Close the modal on successful sign-in
    } catch (error) {
      console.error("Sign-in error:", error);
    }
  };

  /**
   * Handles user sign-out action.
   */
  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  /**
   * Handles user sign-up action.
   *
   * @param {string} email - The user's email.
   * @param {string} password - The user's password.
   */
  const handleSignUp = async (email, password) => {
    try {
      await signUp(email, password);
      setIsSignUpModalOpen(false); // Close the modal on successful sign-up
    } catch (error) {
      console.error("Sign-up error:", error);
    }
  };

  return (
    <header className="bg-gradient-to-r from-amber-800 via-yellow-600 to-brown-400 shadow-lg ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
        <Link href="/" className="flex items-center group">
          <span className="font-['Brush_Script_MT',_cursive] text-4xl text-white tracking-wider group-hover:text-yellow-300 transition-colors duration-300">
            Family Store
          </span>
        </Link>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-white sm:hidden"
        >
          ☰
        </button>
        <nav className={`${isMenuOpen ? 'block' : 'hidden'} sm:flex space-x-8`}>
          <ul className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-8 mt-4 sm:mt-0">
            <li>
              <Link href="/" className="text-amber-800 hover:text-yellow-300 transition-colors duration-300 text-lg font-semibold">
                Home
              </Link>
            </li>
            {/* Add more navigation links here */}
          </ul>
        </nav>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <FaUser className="text-white text-2xl" />
              <button onClick={handleSignOut} className="text-white flex items-center space-x-1">
                <FaSignOutAlt />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setIsSignInModalOpen(true)} className="text-white flex items-center space-x-1">
                <FaSignInAlt />
                <span>Sign In</span>
              </button>
              <button onClick={() => setIsSignUpModalOpen(true)} className="text-white flex items-center space-x-1">
                <span>Sign Up</span>
              </button>
            </>
          )}
        </div>
        <form onSubmit={handleSearchSubmit} className="hidden sm:block">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="p-2 border rounded mr-2"
          />
          <button type="submit" className="bg-amber-600 text-white p-2 rounded">Search</button>
        </form>
      </div>
      <div className="sm:hidden px-4 pb-4">
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="p-2 border rounded mr-2 w-full"
          />
          <button type="submit" className="bg-amber-600 text-white p-2 rounded w-full mt-2">Search</button>
        </form>
      </div>
      {isSignInModalOpen && <SignInModal onClose={() => setIsSignInModalOpen(false)} onSignIn={handleSignIn} />}
      {isSignUpModalOpen && <SignUpModal onClose={() => setIsSignUpModalOpen(false)} onSignUp={handleSignUp} />} {/* Add the sign-up modal */}
    </header>
  );
}




