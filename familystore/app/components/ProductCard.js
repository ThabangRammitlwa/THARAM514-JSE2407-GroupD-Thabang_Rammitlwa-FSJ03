"use client"


import React, { useState, useEffect } from 'react';
import Link from 'next/link';

/**
 * 
 * * @param {Object} props 
 * @param {Object[]} props.products 
 * @param {number} props.currentPage 
 * @param {Object} props.products[].id 
 * @param {string} props.products[].title 
 * @param {number} props.products[].price 
 * @param {string} props.products[].category 
 * @param {number} props.products[].rating 
 * @param {string[]} props.products[].images 
 * @returns {JSX.Element} 
 */
 

export default function ProductCard({ products,currentPage }) {
  const [loading, setLoading] = useState(true);
  const [currentImages, setCurrentImages] = useState({});

  useEffect(() => {
    if (products) {
      setLoading(false);
      const initialImageState = products.reduce((acc, product) => {
        acc[product.id] = 0;
        return acc;
      }, {});
      setCurrentImages(initialImageState);
    }
    
  }, [products]);

  /**
   * 
   * @param {React.MouseEvent} e 
   * @param {number} productId 
   * @param {number} direction 
   */

  const changeImage = (e, productId, direction) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImages(prev => {
      const currentIndex = prev[productId];
      const imageCount = products.find(p => p.id === productId).images.length;
      let newIndex = (currentIndex + direction + imageCount) % imageCount;
      return { ...prev, [productId]: newIndex };
    });
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm: py-8 bg-white">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products && products.map((product, index) => (
          <Link key={index} href={`/product/${product.id}?page={currentPage}`}>
            <div className="bg-white shadow-md rounded-lg overflow-hidden flex flex-col h-[300px] sm:h-[350px] md:h-[400px]">
              <div className="p-4">
                <h2 className="text-xl font-semibold text-amber-900 mb-2">{product.title}</h2>
                <div className="relative aspect-w-1 aspect-h-1 h-32 sm:h-40 md:h-48">
                <Image
                  src={product.thumbnail} // Ensure 'image' is the key for the image URL in your product data
                  alt={product.title} // Use a descriptive alt text
                  width={300} // Set the width you want
                  height={200} // Set the height you want
                  className="object-cover rounded-md" // Optional: Add any Tailwind classes you want
                />
                  {item.images.length > 1 && (
                    <div className="absolute inset-0 flex justify-between items-center px-2">
                      <button
                        onClick={(e) => changeImage(e, product.id, -1)}
                        className="text-amber-900 bg-white bg-opacity-50 rounded-full p-1 hover:bg-opacity-75"
                      >
                        &lt;
                      </button>
                    
                      <button
                        onClick={(e) => changeImage(e, product.id, 1)}
                        className="text-amber-900 bg-white bg-opacity-50 rounded-full p-1 hover:bg-opacity-75"
                      >
                        &gt;
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-4 bg-amber-50">
                <p className="text-lg font-bold text-amber-900">R{product.price.toFixed(2)}</p>
                <p className="inline-block bg-amber-100 rounded-full px-3 py-1 text-sm font-semibold text-amber-800 mr-2 mb-2">
                  {item.category}
                </p>
                <p className="text-sm text-gray-600">Rating: {product.rating.toFixed(2)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}