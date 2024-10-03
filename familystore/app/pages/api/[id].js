// pages/api/products/[id].js
import { db } from '../../../firebase';

const handler = async (req, res) => {
  const { id } = req.query;
  const doc = await db.collection('products').doc(id).get();

  if (!doc.exists) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.status(200).json({ id: doc.id, ...doc.data() });
};

export default handler;
