import { db } from './firebaseConfig';
import { doc, collection, query, getDocs, getDoc, where, orderBy, limit, startAfter, setDoc } from 'firebase/firestore';
import { openDB } from 'idb';

const DB_NAME = 'offlineStore';
const STORE_NAME = 'products';

async function getOfflineDb() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    },
  });
}

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

async function getLastVisibleDoc(q, skip) {
  const skipQuery = query(q, limit(skip));
  const skipSnapshot = await getDocs(skipQuery);
  return skipSnapshot.docs[skipSnapshot.docs.length - 1];
}

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

async function updateProductInFirebase(product) {
  const productRef = doc(db, 'products', product.id);
  await setDoc(productRef, product, { merge: true });
}

