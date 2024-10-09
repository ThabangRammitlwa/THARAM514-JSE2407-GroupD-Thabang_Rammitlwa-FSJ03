import { verifyIdToken } from '../../../middleware/verifyToken';
import { db } from '../../../firebaseConfig';

export default async function handler(req, res) {
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

      if (!review.exists) {
        return res.status(404).json({ message: 'Review not found' });
      }

      if (review.data().reviewerEmail !== user.email) {
        return res.status(403).json({ message: 'Not authorized to edit this review' });
      }

      await reviewRef.update({
        rating,
        comment,
        date: new Date().toISOString()
      });

      const updatedReview = await reviewRef.get();
      
      res.status(200).json({ id, ...updatedReview.data() });
    } catch (error) {
      res.status(500).json({ message: 'Error updating review', error: error.message });
    }
  });
}