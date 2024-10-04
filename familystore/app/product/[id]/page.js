import { ProductDetail } from '../../components/ProductDetails.js';
import { fetchProductById } from '../../firebaseFunctions';


/**
 * 
 * @param {Object} props 
 * @param {Object} props.params 
 * @param {string} props.params.id 
 * @returns {JSX.Element}
 */

export default async function ProductPage({ params }) {
  const { id } = params;
  let product;
  let error;

  try {
    product = await fetchProductById(id);
  } catch (err) {
    error = err.message;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  return <ProductDetail product={product} />;
}