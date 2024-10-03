// pages/api/products/index.js
import { db } from '../../../firebase';
import Fuse from 'fuse.js';

const productsPerPage = 20;

const handler = async (req, res) => {
  const { page = 1, search = '', category = '', sort = '' } = req.query;
  let query = db.collection('products');

  if (category) {
    query = query.where('category', '==', category);
  }

  const snapshot = await query.get();
  let products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  if (search) {
    const fuse = new Fuse(products, { keys: ['title'] });
    products = fuse.search(search).map(result => result.item);
  }

  if (sort) {
    products.sort((a, b) => (sort === 'asc' ? a.price - b.price : b.price - a.price));
  }

  const total = products.length;
  const paginatedProducts = products.slice((page - 1) * productsPerPage, page * productsPerPage);

  res.status(200).json({ total, products: paginatedProducts });
};

export default handler;
