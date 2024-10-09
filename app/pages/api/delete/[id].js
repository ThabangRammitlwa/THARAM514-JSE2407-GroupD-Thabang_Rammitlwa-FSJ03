import { verifyIdToken } from '../../../middleware/verifyToken';
import { db } from '../../../firebaseConfig';

/**
 * API route handler for deleting a product review.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves when the response is sent.
 */
export default async function handler(req, res) {
  // Only allow DELETE requests
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  await verifyIdToken(req, res, async () => {
    try {
      const { id } = req.query;
      const { user } = req;

      const reviewRef = db.collection('reviews').doc(id);
      const review = await reviewRef.get();

      // Check if the review exists
      if (!review.exists) {
        return res.status(404).json({ message: 'Review not found' });
      }

      // Check if the user is authorized to delete the review
      if (review.data().reviewerEmail !== user.email) {
        return res.status(403).json({ message: 'Not authorized to delete this review' });
      }

      // Delete the review from the database
      await reviewRef.delete();
      
      // Respond with a success message
      res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting review', error: error.message });
    }
  });
}
