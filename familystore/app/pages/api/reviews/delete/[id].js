import { verifyIdToken } from '../../../../middleware/verifyToken';
import { db } from '../../../../firebaseConfig';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  await verifyIdToken(req, res, async () => {
    try {
      const { id } = req.query;
      const { user } = req;

      const reviewRef = db.collection('reviews').doc(id);
      const review = await reviewRef.get();

      if (!review.exists) {
        return res.status(404).json({ message: 'Review not found' });
      }

      if (review.data().reviewerEmail !== user.email) {
        return res.status(403).json({ message: 'Not authorized to delete this review' });
      }

      await reviewRef.delete();
      
      res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting review', error: error.message });
    }
  });
}