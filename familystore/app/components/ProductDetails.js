"use client"

function goBack() {
  window.history.back();
}

import Image from 'next/image';
import { useState, useEffect } from 'react'
//import AddReviewForm from './ReviewForm';
import Reviews from './Reviews';
import { useAuth } from '../useAuth';
import { auth } from '../firebaseConfig';


/**
 * 
 * @param {Object} props 
 * @param {Object} props.product 
 * @param {string} props.product.title 
 * @param {number} props.product.price 
 * @param {string} props.product.description 
 * @param {string} props.product.category 
 * @param {string[]} props.product.tags 
 * @param {number} props.product.rating 
 * @param {number} props.product.stock 
 * @param {string[]} props.product.images 
 * @param {Object[]} props.product.reviews 
 * @param {string} props.product.reviews[].reviewerName 
 * @param {string} props.product.reviews[].date 
 * @param {number} props.product.reviews[].rating 
 * @param {string} props.product.reviews[].comment 
 * @returns {JSX.Element} 
 */

export function ProductDetail({ product }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [reviewSort, setReviewSort] = useState('date-desc')
  const { user } = useAuth() || {};

  useEffect(() => {
    if (product) {
      setLoading(false);
    }
  }, [product]);
  
  /**
   * Handle previous image navigation.
   */
  
  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };
  
  /**
   * Handle next image navigation.
   */
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };
  /**
   * Handle image click to set current image
   * @param {number} index 
   */
  const handleImageClick = (index) => {
    setCurrentImageIndex(index);
  };
  
  /**
   * Render star ratings
   * @param {number} rating 
   * @returns {JSX.Element}
   */
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        stars.push(<span key={i} className="text-yellow-500">&#9733;</span>); // Filled star
      } else {
        stars.push(<span key={i} className="text-gray-400">&#9733;</span>); // Empty star
      }
    }
    return stars;
  };

  if (loading) {
    return <div className='text-centre p-4'>Loading details...</div>;
  }
  
  const sortedReviews = product.reviews.slice().sort((a, b) => {
    switch (reviewSort) {
      case 'date-desc':
        return new Date(b.date) - new Date(a.date);
      case 'date-asc':
        return new Date(a.date) - new Date(b.date);
      case 'rating-desc':
        return b.rating - a.rating;
      case 'rating-asc':
        return a.rating - b.rating;
      default:
        return 0;
    }
  });
  
  return (
    <div className="py-12">
      <div className="flex justify-center mb-8">
        <button
          onClick={goBack}
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300"
        >
          Back to list ←
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-6xl mx-auto">
        <div className="md:flex">
          <div className="relative md:w-1/2">
            <img
              src={product.images[currentImageIndex]}
              className="w-full object-cover"
            />
            {product.images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute top-1/2 left-0 transform -translate-y-1/2  text-amber-800 p-2 rounded-full hover:bg-amber-500 transition-colors duration-300"
                >
                  &lt;
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute top-1/2 right-0 transform -translate-y-1/2  text-amber-800 p-2 rounded-full hover:bg-amber-500 transition-colors duration-300"
                >
                  &gt;
                </button>
              </>
            )}
            <div className="flex justify-center mt-4 space-x-2">
              {product.images.map((image, index) => (
                <Image
                  src={image}
                  alt={`Product image ${index + 1}`}
                  width={64} // 16 * 4 (to match h-16 w-16)
                  height={64} // 16 * 4 (to match h-16 w-16)
                  className={`object-cover cursor-pointer ${currentImageIndex === index ? 'border-2 border-amber-600' : 'border'}`}
                  onClick={() => handleImageClick(index)}
                  priority={index === 0} // Optionally prioritize the first image
                />
              ))}
            </div>
          </div>
          <div className="md:w-1/2 p-8">
            <h1 className="text-3xl font-bold mb-4 text-amber-800">
              {product.title}
            </h1>
            <p className="text-2xl font-semibold text-amber-600 mb-4">
              R{product.price.toFixed(2)}
            </p>
            <p className="text-gray-700 mb-6">{product.description}</p>
            <p className="text-sm text-gray-600 mb-2">
              Category: {product.category}
            </p>
            <div className="mb-4">
              {product.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block bg-amber-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Rating: {product.rating} / 5
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Stock: {product.stock}
              {product.stock > 0 ? (
                <span className="text-green-600 ml-2">(In Stock)</span>
              ) : (
                <span className="text-red-600 ml-2">(Out of Stock)</span>
              )}
            </p>
            <button className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300">
              Add to Cart
            </button>
          </div>
        </div>
        <div className="mt-8 p-8">
          <h2 className="text-2xl font-bold mb-4 text-amber-800">Reviews</h2>
          <select
            value={reviewSort}
            onChange={(e) => setReviewSort(e.target.value)}
            className="p-2 border rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 bg-white"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="rating-desc">Highest Rating First</option>
            <option value="rating-asc">Lowest Rating First</option>
          </select>
        </div>
        <Reviews reviews={sortedReviews} />
      </div>
    </div>
  );
}