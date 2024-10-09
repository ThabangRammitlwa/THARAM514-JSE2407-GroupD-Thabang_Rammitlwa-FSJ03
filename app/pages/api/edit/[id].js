import { verifyIdToken } from '../../../middleware/verifyToken';
import { db } from '../../../firebaseConfig';

/**
 * API route handler for updating a product review.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves when the response is sent.
 */
export default async function handler(req, res) {
  // Only allow PUT requests
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  await verifyIdToken(req, res, async () => {
    try {
      const { id } = req.query;
      const { rating, comment } = req.body;
      const { user } = req;

      const reviewRef = db.collection('reviews').doc(id);
      const review = await reviewRef.get();

      // Check if the review exists
      if (!review.exists) {
        return res.status(404).json({ message: 'Review not found' });
      }

      // Check if the user is authorized to edit the review
      if (review.data().reviewerEmail !== user.email) {
        return res.status(403).json({ message: 'Not authorized to edit this review' });
      }

      // Update the review in the database
      await reviewRef.update({
        rating,
        comment,
        date: new Date().toISOString()
      });

      const updatedReview = await reviewRef.get();
      
      // Respond with the updated review
      res.status(200).json({ id, ...updatedReview.data() });
    } catch (error) {
      res.status(500).json({ message: 'Error updating review', error: error.message });
    }
  });
}
