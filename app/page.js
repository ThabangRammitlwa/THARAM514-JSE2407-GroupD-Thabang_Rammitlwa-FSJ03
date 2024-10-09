"use client";

import { Suspense, useEffect, useState } from 'react';
import { fetchProducts, fetchCategories, syncOfflineChanges } from './firebaseFunctions'; 
import { useRouter, useSearchParams } from 'next/navigation';
import Header from './components/Header';
import Filter from './components/Filter';
import ProductCard from './components/ProductCard';
import Pagination from './components/Pagination';
import Footer from './components/Footer';

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [lastVisible, setLastVisible] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const [newVersionAvailable, setNewVersionAvailable] = useState(false);

  const page = Number(searchParams.get('page')) || 1;
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sortBy = searchParams.get('sortBy') || '';
  const sortOrder = searchParams.get('sortOrder') || '';

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          fetchProducts({ page, search, category, sortBy, sortOrder, lastVisible }),
          fetchCategories()
        ]);
        setProducts(productsData.products);
        setTotalPages(productsData.totalPages);
        setCurrentPage(page);
        setTotalProducts(productsData.totalProducts);
        setLastVisible(productsData.lastVisible);
        setCategories(categoriesData);
        setError(null);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    const handleOnline = () => {
      setIsOffline(false);
      syncOfflineChanges();
    };
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check if a new version is available
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        setNewVersionAvailable(true);
      });
    }

    loadData();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [page, search, category, sortBy, sortOrder, lastVisible]);

  const updateUrl = (newParams) => {
    const updatedSearchParams = new URLSearchParams(searchParams);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        updatedSearchParams.set(key, value);
      } else {
        updatedSearchParams.delete(key);
      }
    });
    router.push(`/?${updatedSearchParams.toString()}`);
  };

  const handleFilter = (newCategory) => updateUrl({ category: newCategory, page: 1 });
  const handleSort = (newSortBy, newSortOrder) => updateUrl({ sortBy: newSortBy, sortOrder: newSortOrder, page: 1 });
  const handleSearch = (newSearch) => updateUrl({ search: newSearch, page: 1 });
  const handlePageChange = (newPage) => {
    if (newPage > currentPage) {
      // Load next set of products when navigating to the next page
      fetchProducts({ page: newPage, search, category, sortBy, sortOrder, lastVisible }).then(({ products: newProducts, lastVisible: newLastVisible }) => {
        setProducts((prevProducts) => [...prevProducts, ...newProducts]);
        setLastVisible(newLastVisible);
        setCurrentPage(newPage);
      }).catch(e => setError(e.message));
    } else {
      updateUrl({ page: newPage });
    }
  };

  const handleReset = () => router.push('/');

  const handleNewVersionAvailable = () => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then((reg) => {
        if (reg && reg.waiting) {
          reg.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      });
    }
    window.location.reload();
  };

  if (error) {
    return <div className="text-red-600 text-center p-4 bg-red-100 rounded-lg">Error: {error}</div>;
  }

  return (
    <div>
      <Header currentSearch={search} onSearch={handleSearch} />

      {isOffline && (
        <div className="bg-yellow-100 text-yellow-800 p-2 text-center">
          You are currently offline. Some features may be limited.
        </div>
      )}
      {newVersionAvailable && (
        <div className="bg-blue-100 text-blue-800 p-2 text-center">
          A new version is available.{' '}
          <button onClick={handleNewVersionAvailable} className="underline">
            Refresh to update
          </button>
        </div>
      )}
      <Filter
        categories={categories}
        currentCategory={category}
        currentSortBy={sortBy}
        currentSortOrder={sortOrder}
        onFilter={handleFilter}
        onSort={handleSort}
        onReset={handleReset}
      />
      {loading ? (
        <div className="text-center font-bold text-amber-800 p-8">Loading...</div>
      ) : (
        <>
          <ProductCard products={products} />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            hasMore={products.length < totalProducts}
            onPageChange={handlePageChange}
          />
          <Footer />
        </>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="text-center font-bold text-amber-800 p-8">Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}







  
