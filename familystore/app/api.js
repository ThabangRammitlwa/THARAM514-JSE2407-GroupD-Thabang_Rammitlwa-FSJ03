const API_BASE_URL = 'https://next-ecommerce-api.vercel.app';

export async function fetchProducts(page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  const response = await fetch(`${API_BASE_URL}/products?limit=${limit}&skip=${skip}`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
}

export async function fetchProductById(id) {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }
  return response.json();
}
