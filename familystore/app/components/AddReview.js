import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const AddReview = ({ productId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { user, token } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/review/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ rating, comment, productId }),
    });

    const result = await response.json();
    if (response.ok) {
      alert(result.message);
    } else {
      alert(result.error);
    }
  };

  if (!user) {
    return <p>Please sign in to add a review.</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Rating:
        <input
          type="number"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          min="1"
          max="5"
        />
      </label>
      <label>
        Comment:
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </label>
      <button type="submit">Add Review</button>
    </form>
  );
};

export default AddReview;
