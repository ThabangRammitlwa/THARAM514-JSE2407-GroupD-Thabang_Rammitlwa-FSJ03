

/**
 * Filter component for filtering and sorting products.
 * 
 * @param {Object} props - The properties object.
 * @param {Array<string>} props.categories - The list of categories to filter by.
 * @param {string} props.currentCategory - The currently selected category.
 * @param {string} props.currentSortBy - The current sorting criteria.
 * @param {string} props.currentSortOrder - The current sorting order.
 * @param {Function} props.onFilter - Callback function to handle filtering by category.
 * @param {Function} props.onSort - Callback function to handle sorting.
 * @param {Function} props.onReset - Callback function to reset filters and sorting.
 * 
 * @returns {JSX.Element} The rendered Filter component.
 */
export default function Filter({
    categories,
    currentCategory,
    currentSortBy,
    currentSortOrder,
    onFilter,
    onSort,
    onReset
}) {
    return (
        <div className="flex flex-wrap items-center gap-4 py-6 px-6 text-amber-800 font-serif">
          <select
            value={currentCategory}
            onChange={(e) => onFilter(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">All Categories</option>
            {categories && categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
  value={`${currentSortBy}-${currentSortOrder}`}
  onChange={(e) => {
    const [sortBy, sortOrder] = e.target.value.split('-');
    onSort(sortBy, sortOrder);
  }}
  className="p-2 border rounded"
>
  <option value="">Default Sorting</option>
  <option value="price-asc">Price: Low to High</option>
  <option value="price-desc">Price: High to Low</option>
  <option value="title-asc">Title: A-Z</option>
  <option value="title-desc">Title: Z-A</option>
  <option value="rating-desc">Highest Rated</option>
</select>
          <button onClick={onReset} className="bg-amber-100 p-2 rounded">Reset All</button>
        </div>
    );
}
