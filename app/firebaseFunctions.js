import { db } from './firebaseConfig';
import { doc, collection, query, getDocs, getDoc, where, orderBy, limit, startAfter, setDoc } from 'firebase/firestore';
import { openDB } from 'idb';

const DB_NAME = 'offlineStore';
const STORE_NAME = 'products';

/**
 * Opens or creates an IndexedDB database for offline storage.
 *
 * @returns {Promise<IDBDatabase>} The offline database instance.
 */
async function getOfflineDb() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    },
  });
}

/**
 * Fetches products from Firestore with optional filtering, sorting, and pagination.
 *
 * @param {Object} options - Options for fetching products.
 * @param {number} [options.page=1] - The page number for pagination.
 * @param {string} [options.search=''] - Search term for product titles.
 * @param {string} [options.category=''] - Category filter for products.
 * @param {string} [options.sortBy=''] - Field to sort by.
 * @param {string} [options.sortOrder=''] - Order of sorting ('asc' or 'desc').
 * @param {number} [options.limitValue=20] - Number of products per page.
 * @returns {Promise<Object>} The fetched products, total pages, and total products.
 */
export async function fetchProducts({
  page = 1,
  search = '',
  category = '',
  sortBy = '',
  sortOrder = '',
  limitValue = 20,
}) {
  try {
    const productsRef = collection(db, 'products');
    let q = query(productsRef);

    if (category) {
      q = query(q, where('category', '==', category));
    }
    if (search) {
      q = query(q, where('title', '>=', search), where('title', '<=', search + '\uf8ff'));
    }
    if (sortBy) {
      q = query(q, orderBy(sortBy, sortOrder));
    } else {
      q = query(q, orderBy('title'));
    }

    q = query(q, limit(limitValue));
    if (page > 1) {
      const lastVisibleSnapshot = await getLastVisibleDoc(q, (page - 1) * limitValue);
      if (lastVisibleSnapshot) {
        q = query(q, startAfter(lastVisibleSnapshot));
      }
    }

    const querySnapshot = await getDocs(q);
    const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const offlineDb = await getOfflineDb();
    const tx = offlineDb.transaction(STORE_NAME, 'readwrite');
    products.forEach(product => tx.store.put(product));
    await tx.done;

    const totalQuery = query(productsRef);
    const totalSnapshot = await getDocs(totalQuery);
    const totalProducts = totalSnapshot.size;
    const totalPages = Math.ceil(totalProducts / limitValue);

    return {
      products,
      totalPages,
      totalProducts,
    };
  } catch (error) {
    console.error('Error fetching products:', error);

    const offlineDb = await getOfflineDb();
    const offlineProducts = await offlineDb.getAll(STORE_NAME);
    return {
      products: offlineProducts,
      totalPages: 1,
      totalProducts: offlineProducts.length,
    };
  }
}

/**
 * Retrieves the last visible document for pagination.
 *
 * @param {Query} q - The Firestore query to get documents.
 * @param {number} skip - The number of documents to skip.
 * @returns {Promise<DocumentSnapshot>} The last visible document snapshot.
 */
async function getLastVisibleDoc(q, skip) {
  const skipQuery = query(q, limit(skip));
  const skipSnapshot = await getDocs(skipQuery);
  return skipSnapshot.docs[skipSnapshot.docs.length - 1];
}

/**
 * Fetches a product by its ID from Firestore.
 *
 * @param {string} id - The ID of the product to fetch.
 * @returns {Promise<Object>} The product data.
 * @throws {Error} If the product is not found.
 */
export async function fetchProductById(id) {
  const productRef = doc(db, 'products', id);
  const productSnapshot = await getDoc(productRef);

  if (!productSnapshot.exists()) {
    throw new Error('Product not found');
  }

  return { id: productSnapshot.id, ...productSnapshot.data() };
}

/**
 * Fetches unique categories from the products collection.
 *
 * @returns {Promise<string[]>} An array of unique categories.
 */
export async function fetchCategories() {
  const productsCollection = collection(db, 'products');
  const snapshot = await getDocs(productsCollection);

  const categories = new Set();
  snapshot.docs.forEach(doc => {
    categories.add(doc.data().category);
  });

  return Array.from(categories);
}

/**
 * Synchronizes offline changes from IndexedDB to Firestore.
 *
 * @returns {Promise<void>}
 */
export async function syncOfflineChanges() {
  const offlineDb = await getOfflineDb();
  const tx = offlineDb.transaction(STORE_NAME, 'readonly');
  const offlineProducts = await tx.store.getAll();

  for (const product of offlineProducts) {
    try {
      await updateProductInFirebase(product);
    } catch (error) {
      console.error('Error syncing product:', error);
    }
  }
}

/**
 * Updates a product in Firestore.
 *
 * @param {Object} product - The product data to update.
 * @returns {Promise<void>}
 */
async function updateProductInFirebase(product) {
  const productRef = doc(db, 'products', product.id);
  await setDoc(productRef, product, { merge: true });
}


