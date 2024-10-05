import { db } from './firebaseConfig';
import { collection, query, getDocs, doc, getDoc, orderBy, limit, startAfter } from 'firebase/firestore';

// Fetch paginated products
export async function fetchProducts(page = 1, limitValue = 20, cursor = null) {
  const productsRef = collection(db, 'products');
  let q;

  if (cursor) {
    q = query(productsRef, orderBy('title'), startAfter(cursor), limit(limitValue));
  } else {
    q = query(productsRef, orderBy('title'), limit(limitValue));
  }

  const querySnapshot = await getDocs(q);
  const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  return {
    products,
    lastVisible: querySnapshot.docs[querySnapshot.docs.length - 1]
  };
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


