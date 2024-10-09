
import { fetchProducts } from '../../../firebaseFunctions';

/**
 * API handler for fetching products.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} - A promise that resolves when the response is sent.
 */
export default async function handler(req, res) {
  // Check if the request method is GET
  if (req.method === 'GET') {
    // Destructure query parameters with default values
    const { page = 1, pageSize = 10, cursor } = req.query;

    try {
      // Fetch products using the provided pagination parameters
      const { products, lastVisible } = await fetchProducts(
        parseInt(page),
        parseInt(pageSize),
        cursor
      );
      // Respond with the products and the next cursor for pagination
      res.status(200).json({ products, cursor: lastVisible });
    } catch (error) {
      // Handle errors during product fetching
      res.status(500).json({ error: 'Error fetching products' });
    }
  } else {
    // Set allowed methods in the response header and send method not allowed status
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

