// pages/api/categories/index.js
import { db } from '../../../firebase';

const handler = async (req, res) => {
  const snapshot = await db.collection('categories').get();
  const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  res.status(200).json(categories);
};

export default handler;
