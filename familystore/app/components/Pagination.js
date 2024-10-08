import Link from 'next/link';

/**
 * Pagination component for navigating between pages of products.
 * 
 * @param {Object} props - The properties object.
 * @param {number} props.currentPage - The current page number.
 * @param {number} props.totalPages - The total number of pages.
 * @param {boolean} props.hasMore - Flag indicating if there are more pages to load.
 * @param {Function} props.onPageChange - Callback function to handle page changes.
 * 
 * @returns {JSX.Element} The rendered Pagination component.
 */
export default function Pagination({ currentPage, totalPages, onPageChange,hasMore=true }) {
  return (
    <div className="flex justify-center items-center space-x-4 my-12">
      {currentPage > 1 && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300"
        >
          ← Previous
        </button>
      )}
      <span className="text-gray-700 font-semibold">Page {currentPage} of {totalPages}</span>
      {(currentPage < totalPages ||hasMore)&& (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300"
        >
          Next →
        </button>
      )}
    </div>
  );
}