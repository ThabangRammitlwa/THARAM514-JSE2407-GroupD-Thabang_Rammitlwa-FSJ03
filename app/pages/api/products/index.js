
// pages/api/products/index.js
import { fetchProducts } from '../../../firebaseFunctions';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { page = 1, pageSize = 10, cursor } = req.query;

    try {
      const { products, lastVisible } = await fetchProducts(parseInt(page), parseInt(pageSize), cursor);
      res.status(200).json({ products, cursor: lastVisible });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching products' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
