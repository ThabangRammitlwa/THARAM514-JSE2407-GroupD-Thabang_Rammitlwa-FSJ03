import { collection, getDocs } from 'firebase/firestore';
import { db } from "../../../firebaseConfig";

/**
 * API route handler for fetching unique product categories from Firestore.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves when the response is sent.
 */
export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const productsCollection = collection(db, 'products');
      const snapshot = await getDocs(productsCollection);

      // Use a Set to collect unique categories
      const categories = new Set();
      snapshot.docs.forEach(doc => {
        categories.add(doc.data().category);
      });

      // Convert the Set to an array before sending
      res.status(200).json({ categories: Array.from(categories) });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching categories' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}



