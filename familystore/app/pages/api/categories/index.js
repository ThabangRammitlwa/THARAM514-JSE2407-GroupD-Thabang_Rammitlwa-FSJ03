// pages/api/categories.js
import { collection, getDocs } from 'firebase/firestore';
import { db } from 'firebase';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const productsCollection = collection(db, 'products');
      const snapshot = await getDocs(productsCollection);
      
      const categories = new Set();
      snapshot.docs.forEach(doc => {
        categories.add(doc.data().category);
      });
      
      res.status(200).json({ categories: Array.from(categories) });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching categories' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
