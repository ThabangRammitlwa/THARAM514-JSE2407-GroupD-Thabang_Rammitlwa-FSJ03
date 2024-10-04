// pages/api/products/[id].js
import { fetchProductById } from '../../../firebaseFunctions';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { id } = req.query;

    try {
      const product = await fetchProductById(id);
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching product' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}



