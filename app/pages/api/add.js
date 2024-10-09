import { verifyIdToken } from '../../middleware/verifyToken';
import { db } from '../../firebaseConfig';

export default async function handler(req, res) {
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

      const reviewRef = await db.collection('products').doc(productId).collection('reviews').add(newReview);
      
      res.status(201).json({ id: reviewRef.id, ...newReview });
    } catch (error) {
      res.status(500).json({ message: 'Error adding review', error: error.message });
    }
  });
}