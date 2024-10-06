// components/AddReviewForm.js
import { useState } from 'react';
import { useRouter } from 'next/router';

const AddReviewForm = ({ productId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = await auth.currentUser.getIdToken(); // Fetch Firebase auth token
      const response = await fetch('/api/review/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, rating, comment }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to add review');
        setSuccess('');
      } else {
        setSuccess('Review added successfully!');
        setError('');
        router.reload(); // Reload page to fetch and display the new review
      }
    } catch (error) {
      setError('An error occurred while adding the review');
      setSuccess('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">{success}</div>}
      <div className="mb-4">
        <label className="block text-gray-700">Rating</label>
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="mt-1 block w-full p-2 border rounded"
        >
          <option value={0}>Select rating</option>
          {[1, 2, 3, 4, 5].map((star) => (
            <option key={star} value={star}>
              {star}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="mt-1 block w-full p-2 border rounded"
          rows={4}
        />
      </div>
      <button type="submit" className="bg-amber-600 text-white p-2 rounded">
        Add Review
      </button>
    </form>
  );
};

export default AddReviewForm;
