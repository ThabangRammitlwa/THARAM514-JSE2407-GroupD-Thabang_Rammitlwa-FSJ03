import { auth } from '../firebaseConfig';
import { getAuth } from 'firebase-admin/auth';

/**
 * Middleware function to verify Firebase ID tokens for protected routes.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {function} next - The next middleware function to call.
 * @returns {Promise<void>} A promise that resolves when the token is verified.
 */
export const verifyIdToken = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
