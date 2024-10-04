"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

/**
 * Header component that displays the navigation bar with links to different pages.
 * 
 * @param {Object} props - The properties object.
 * @param {string} props.currentSearch - The current search term.
 * @param {Function} props.onSearch - Callback function to handle search submission.
 * 
 * @returns {JSX.Element} - The header component containing the website's logo and navigation links.
 */
export default function Header({
  currentSearch,
  onSearch,
}) {
  const [search, setSearch] = useState(currentSearch);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setSearch(currentSearch);
  }, [currentSearch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch(search);
  };

  return (
    <header className="bg-gradient-to-r from-amber-800 via-yellow-600 to-brown-400 shadow-lg">
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
    </header>
  );
}