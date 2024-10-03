import Products from './components/ProductCard'
import { fetchProducts } from './api'

/**
 * 
  * @param {Object} props 
 * @param {Object} props.searchParams 
 * @param {string} [props.searchParams.page] 
 * @returns {JSX.Element}
 */

export default async function Home({ searchParams }) {
  const page = Number(searchParams.page) || 1;
  let products;
  let error;

  try {
    products = await fetchProducts(page);
  } catch (err) {
    error = err.message;
  }
  
  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }


  return (
    <div>
      <header className='py-12 font-serif bg-amber-100'>
        <h1 className='text-3xl font-bold text-amber-800'>**Family Store**</h1>
      </header>
      <Products products={ products} currentPage ={page} />
    </div>
  )
}
  
