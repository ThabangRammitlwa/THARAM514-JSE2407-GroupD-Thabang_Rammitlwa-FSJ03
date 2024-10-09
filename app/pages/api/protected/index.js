import { verifyIdToken } from '../../../middleware/verifyToken';

/**
 * API route handler for a protected route.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves when the response is sent.
 */
export default async function handler(req, res) {
  await verifyIdToken(req, res, async () => {
    res.status(200).json({ message: 'This is a protected route' });
  });
}

