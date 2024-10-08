import { db } from './firebaseConfig';
import {doc ,collection, query, getDocs,getDoc, where, orderBy, limit, startAfter } from 'firebase/firestore';

export async function fetchProducts({
  page = 1,
  search = '',
  category = '',
  sortBy = '',
  sortOrder = '',
  limitValue = 20
}) {

  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    sortBy,
    sortOrder,
  });

  const productsRef = collection(db, 'products');
  let q = query(productsRef);

  // Apply category filter
  if (category) {
    q = query(q, where('category', '==', category));
  }

  // Apply search filter
  if (search) {
    q = query(q, where('title', '>=', search), where('title', '<=', search + '\uf8ff'));
  }

  // Apply sorting
  if (sortBy) {
    q = query(q, orderBy(sortBy, sortOrder));
  } else {
    q = query(q, orderBy('title'));
  }

  // Apply pagination
  q = query(q, limit(limitValue));
  if (page > 1) {
    const lastVisibleSnapshot = await getLastVisibleDoc(q, (page - 1) * limitValue);
    if (lastVisibleSnapshot) {
      q = query(q, startAfter(lastVisibleSnapshot));
    }
  }

  const querySnapshot = await getDocs(q);
  const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  const totalQuery = query(productsRef);
  const totalSnapshot = await getDocs(totalQuery);
  const totalProducts = totalSnapshot.size;
  const totalPages = Math.ceil(totalProducts / limitValue);

  return {
    products,
    totalPages,
    totalProducts
  };
}

async function getLastVisibleDoc(q, skip) {
  const skipQuery = query(q, limit(skip));
  const skipSnapshot = await getDocs(skipQuery);
  return skipSnapshot.docs[skipSnapshot.docs.length - 1];
}

// Fetch a single product by ID
export async function fetchProductById(id) {
  const productRef = doc(db, 'products', id);
  const productSnapshot = await getDoc(productRef);

  if (!productSnapshot.exists()) {
    throw new Error('Product not found');
  }

  return { id: productSnapshot.id, ...productSnapshot.data() };
}

export async function fetchCategories() {
  const productsCollection = collection(db, 'products');
  const snapshot = await getDocs(productsCollection);

  const categories = new Set();
  snapshot.docs.forEach(doc => {
    categories.add(doc.data().category);
  });

  return Array.from(categories);
}


