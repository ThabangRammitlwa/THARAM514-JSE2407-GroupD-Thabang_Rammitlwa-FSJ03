import { verifyIdToken } from '../../middleware/verifyToken';
import { db } from '../../firebaseConfig';

/**
 * API route handler for submitting a product review.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves when the response is sent.
 */
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  await verifyIdToken(req, res, async () => {
    try {
      const { productId, rating, comment } = req.body;
      const { user } = req;

      const newReview = {
        rating,
        comment,
        date: new Date().toISOString(),
        reviewerEmail: user.email,
        reviewerName: user.name || 'Anonymous'
      };

      // Add the new review to the database
      const reviewRef = await db.collection('products').doc(productId).collection('reviews').add(newReview);
      
      res.status(201).json({ id: reviewRef.id, ...newReview });
    } catch (error) {
      res.status(500).json({ message: 'Error adding review', error: error.message });
    }
  });
}
