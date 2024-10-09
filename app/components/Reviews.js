import React, { useState } from 'react';
import { useAuth } from '../useAuth'

/**
 * Reviews component to display customer reviews with a rating and comment.
 *
 * @param {Object} props - The properties passed to the Reviews component.
 * @param {Array} props.reviews - An array of review objects.
 * @param {string} props.reviews[].reviewerName - The name of the reviewer.
 * @param {string} props.reviews[].date - The date when the review was posted.
 * @param {number} props.reviews[].rating - The rating given by the reviewer (from 1 to 5).
 * @param {string} props.reviews[].comment - The review comment text.
 * @returns {JSX.Element} - A component that renders a list of customer reviews.
 */
export default function Reviews({ reviews, productId, onReviewAdded, onReviewUpdated, onReviewDeleted }) {
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [editingReview, setEditingReview] = useState({ id: null, rating: 5, comment: '' });
  const [error, setError] = useState(null);
  const { user } = useAuth() || {};

  const handleAddReview = async () => {
    if (!user) {
      alert('You must be logged in to add a review.');
      return;
    }

    try {
      const response = await fetch('/api/reviews/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user.getIdToken()}`
        },
        body: JSON.stringify({ ...newReview, productId })
      });

      if (response.ok) {
        const addedReview = await response.json();
        onReviewAdded(addedReview);
        setNewReview({ rating: 5, comment: '' });
        alert('Review added successfully!');
      } else {
        throw new Error('Failed to add review');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEditReview = async (reviewId) => {
    try {
      const response = await fetch(`/api/reviews/edit/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user.getIdToken()}`
        },
        body: JSON.stringify({ ...editingReview, productId })
      });

      if (response.ok) {
        const updatedReview = await response.json();
        onReviewUpdated(updatedReview);
        setEditingReview({ id: null, rating: 5, comment: '' }); 
        alert('Review updated successfully!');
      } else {
        throw new Error('Failed to update review');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const response = await fetch(`/api/reviews/delete/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${await user.getIdToken()}`
        }
      });

      if (response.ok) {
        onReviewDeleted(reviewId);
        alert('Review deleted successfully!');
      } else {
        throw new Error('Failed to delete review');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const renderStars = (rating) => (
    <div className="flex text-yellow-400">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={`text-2xl ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
          ★
        </span>
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Review Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Add a Review</h3>
        {error && <p className="text-red-600">{error}</p>}
        <div className="mb-4">
          <label className="block mb-2">Rating:</label>
          <select
            value={newReview.rating}
            onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
            className="border p-2 rounded w-full"
          >
            {[1, 2, 3, 4, 5].map((rating) => (
              <option key={rating} value={rating}>{rating}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Comment:</label>
          <textarea
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            className="border p-2 rounded w-full"
            rows="4"
            placeholder="Write your review..."
          />
        </div>
        <button
          onClick={handleAddReview}
          className="bg-amber-600 text-white py-2 px-4 rounded"
        >
          Submit Review
        </button>
      </div>

      {/* Displaying Reviews */}
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <span className="font-semibold text-lg text-amber-700 mb-2 sm:mb-0">
              {review.reviewerName}
            </span>
            <span className="text-sm text-amber-600">
              {new Date(review.date).toLocaleDateString('en-GB')}
            </span>
          </div>
          <div className="flex items-center mb-4">
            {renderStars(review.rating)}
            <span className="ml-2 text-amber-700 font-semibold">
              {review.rating} / 5
            </span>
          </div>
          <p className="text-gray-700 leading-relaxed">{review.comment}</p>
          {/* Edit and Delete buttons */}
          <div className="flex space-x-4 mt-4">
            <button
              onClick={() => setEditingReview({ id: review.id, rating: review.rating, comment: review.comment })}
              className="text-amber-600 hover:underline"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteReview(review.id)}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </div>

          {/* Editing Form */}
          {editingReview.id === review.id && (
            <div className="mt-4">
              <h4 className="text-lg font-semibold mb-2">Edit Review</h4>
              <div className="mb-4">
                <label className="block mb-2">Rating:</label>
                <select
                  value={editingReview.rating}
                  onChange={(e) => setEditingReview({ ...editingReview, rating: Number(e.target.value) })}
                  className="border p-2 rounded w-full"
                >
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <option key={rating} value={rating}>{rating}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2">Comment:</label>
                <textarea
                  value={editingReview.comment}
                  onChange={(e) => setEditingReview({ ...editingReview, comment: e.target.value })}
                  className="border p-2 rounded w-full"
                  rows="4"
                  placeholder="Edit your review..."
                />
              </div>
              <button
                onClick={() => handleEditReview(review.id)}
                className="bg-amber-600 text-white py-2 px-4 rounded"
              >
                Update Review
              </button>
              <button
                onClick={() => setEditingReview({ id: null, rating: 5, comment: '' })} // Reset after cancel
                className="text-gray-600 hover:underline ml-4"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
