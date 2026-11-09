
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FaSearch,
  FaFilter,
  FaTimes,
  FaThLarge,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
  FaSlidersH,
  FaBoxOpen,
} from "react-icons/fa";

import "./LiveProductsCatalog.css";

const API = (
  process.env.REACT_APP_API_URL || "https://vector-engineers-backend-476393526056.asia-southeast1.run.app"
).replace(/\/$/, "");

const PAGE_SIZE = 9;

const mediaUrl = (url) => {
  if (!url) return "";

  if (/^(https?:)?\/\//i.test(url)) return url;

  return `${API}${url.startsWith("/") ? "" : "/"}${url}`;
};

async function getJson(path, signal) {
  const response = await fetch(`${API}${path}`, { signal });
  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || "Unable to load catalogue data"
    );
  }

  return result;
}

function ProductCard({ product }) {
  const image = mediaUrl(product.imageUrl);

  return (
    <article className="ve-catalog-card">
      <Link
        to={`/products/${product._id}`}
        className="ve-catalog-card-image"
        aria-label={`View ${product.name}`}
      >
        {image ? (
          <img
            src={image}
            alt={product.name}
            loading="lazy"
          />
        ) : (
          <div className="ve-catalog-image-empty">
            <FaBoxOpen />
            <span>Image coming soon</span>
          </div>
        )}
      </Link>

      <div className="ve-catalog-card-body">
        <div className="ve-catalog-card-category">
          {product.brand?.name || "Vector Engineers"}

          {product.group?.name && (
            <>
              <span> / </span>
              {product.group.name}
            </>
          )}
        </div>

        <h3>
          <Link to={`/products/${product._id}`}>
            {product.name}
          </Link>
        </h3>

        {product.description && (
          <p className="ve-catalog-card-desc">
            {product.description}
          </p>
        )}

        <div className="ve-catalog-card-footer">
          <Link
            to={`/products/${product._id}`}
            className="ve-catalog-card-link"
          >
            View Models <FaArrowRight />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function LiveProductsCatalog() {
  const [params, setParams] = useSearchParams();

  const brand = params.get("brand") || "";
  const group = params.get("group") || "";
  const industry = params.get("industry") || "";
  const query = params.get("q") || "";
  const sort = params.get("sort") || "featured";
  const page = Math.max(
    1,
    Number.parseInt(params.get("page"), 10) || 1
  );

  const [search, setSearch] = useState(query);
  const [brands, setBrands] = useState([]);
  const [groups, setGroups] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [products, setProducts] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    pages: 0,
    total: 0
  });

  const [loading, setLoading] = useState(true);
  const [loadingGroups, setLoadingGroups] = useState(false);
  const [error, setError] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Keep search input synchronized with browser URL.
  useEffect(() => {
    setSearch(query);
  }, [query]);

  // Load published brand and industry options.
  useEffect(() => {
    const controller = new AbortController();

    Promise.all([
      getJson("/api/v1/brands?limit=50", controller.signal),
      getJson("/api/v1/industries?limit=50", controller.signal)
    ])
      .then(([brandData, industryData]) => {
        setBrands(brandData.data || []);
        setIndustries(industryData.data || []);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      });

    return () => controller.abort();
  }, []);

  // A group belongs to a brand.
  // When the brand changes, show only its groups.
  useEffect(() => {
    const controller = new AbortController();

    setGroups([]);

    if (!brand) {
      setLoadingGroups(false);
      return () => controller.abort();
    }

    setLoadingGroups(true);

    getJson(
      `/api/v1/brands/${encodeURIComponent(brand)}/groups?limit=50`,
      controller.signal
    )
      .then((result) => {
        setGroups(result.data || []);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoadingGroups(false);
        }
      });

    return () => controller.abort();
  }, [brand]);

  // Load published products from MongoDB through the API.
  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError("");

    const requestParams = new URLSearchParams({
      page: String(page),
      limit: String(PAGE_SIZE)
    });

    if (brand) requestParams.set("brand", brand);
    if (group && brand) requestParams.set("group", group);
    if (industry) requestParams.set("industry", industry);
    if (query) requestParams.set("q", query);

    // Requires the small backend sorting update in Step 3.
    if (sort !== "featured") {
      requestParams.set("sort", sort);
    }

    getJson(
      `/api/v1/catalogue/products?${requestParams.toString()}`,
      controller.signal
    )
      .then((result) => {
        setProducts(result.data || []);

        setPagination(
          result.pagination || {
            page: 1,
            pages: 0,
            total: 0
          }
        );
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setProducts([]);
          setError(err.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [brand, group, industry, query, page, sort]);

  const updateFilters = (updates) => {
    const next = new URLSearchParams(params);

    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        next.set(key, value);
      } else {
        next.delete(key);
      }
    });

    // Any filter change returns to page one.
    next.delete("page");

    setParams(next);
  };

  const selectBrand = (newBrand) => {
    updateFilters({
      brand: newBrand,
      group: ""
    });
  };

  const clearFilters = () => {
    setSearch("");
    setParams(new URLSearchParams());
  };

  const goToPage = (newPage) => {
    if (
      newPage < 1 ||
      newPage > pagination.pages ||
      newPage === page
    ) {
      return;
    }

    const next = new URLSearchParams(params);
    next.set("page", String(newPage));
    setParams(next);

    document
      .getElementById("ve-products-results")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
  };

  const hasFilters = Boolean(brand || group || industry || query);

  const firstItem =
    pagination.total > 0 ? (page - 1) * PAGE_SIZE + 1 : 0;

  const lastItem = Math.min(
    page * PAGE_SIZE,
    pagination.total
  );

  return (
    <section
      className="ve-catalog-section"
      aria-label="Vector Engineers Product Catalogue"
    >
      <div className="container">

        {/* Catalogue introduction */}
        <div className="ve-catalog-heading">
          <div>
            <span className="ve-catalog-eyebrow">
              OUR PRODUCT RANGE
            </span>

            <h2>Explore Electrical Products</h2>

            <p>
              Browse products from leading manufacturers,
              explore available models and view detailed
              technical information.
            </p>
          </div>
        </div>

        {/* Search */}
        <form
          className="ve-catalog-searchbar"
          onSubmit={(e) => {
            e.preventDefault();
            updateFilters({ q: search.trim() });
          }}
        >
          <FaSearch className="ve-catalog-search-icon" />

          <input
            type="search"
            aria-label="Search products"
            placeholder="Search fans, energy meters, switchgear..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button type="submit">
            Search Products
          </button>
        </form>

        <div className="ve-catalog-layout">

          {/* Sidebar */}
          <aside
            className={`ve-catalog-sidebar ${
              filtersOpen ? "is-open" : ""
            }`}
            aria-label="Catalogue filters"
          >
            <div className="ve-catalog-sidebar-top">
              <h3>
                <FaSlidersH /> Filters
              </h3>

              {hasFilters && (
                <button
                  type="button"
                  className="ve-catalog-clear"
                  onClick={clearFilters}
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="ve-catalog-filter-block">
              <h4>Brands</h4>

              <div className="ve-catalog-filter-options">
                <label>
                  <input
                    type="radio"
                    name="ve-brand"
                    checked={!brand}
                    onChange={() => selectBrand("")}
                  />
                  <span>All Brands</span>
                </label>

                {brands.map((item) => (
                  <label key={item._id}>
                    <input
                      type="radio"
                      name="ve-brand"
                      checked={brand === item.slug}
                      onChange={() => selectBrand(item.slug)}
                    />
                    <span>{item.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="ve-catalog-filter-block">
              <h4>Product Groups</h4>

              {!brand ? (
                <p className="ve-catalog-filter-hint">
                  Select a brand to view its product groups.
                </p>
              ) : loadingGroups ? (
                <p className="ve-catalog-filter-hint">
                  Loading groups...
                </p>
              ) : (
                <div className="ve-catalog-filter-options">
                  <label>
                    <input
                      type="radio"
                      name="ve-group"
                      checked={!group}
                      onChange={() => updateFilters({ group: "" })}
                    />
                    <span>All Groups</span>
                  </label>

                  {groups.map((item) => (
                    <label key={item._id}>
                      <input
                        type="radio"
                        name="ve-group"
                        checked={group === item.slug}
                        onChange={() =>
                          updateFilters({ group: item.slug })
                        }
                      />
                      <span>{item.name}</span>
                    </label>
                  ))}

                  {groups.length === 0 && (
                    <p className="ve-catalog-filter-hint">
                      No published groups available.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="ve-catalog-filter-block">
              <h4>Industries</h4>

              <select
                aria-label="Filter products by industry"
                value={industry}
                onChange={(e) =>
                  updateFilters({ industry: e.target.value })
                }
              >
                <option value="">All Industries</option>

                {industries.map((item) => (
                  <option key={item._id} value={item.slug}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="ve-catalog-sidebar-bottom">
              <FaFilter />
              <p>
                Products shown here are managed through
                Vector Engineers Admin.
              </p>
            </div>
          </aside>

          {/* Right: Product results */}
          <div
            className="ve-catalog-content"
            id="ve-products-results"
          >
            <div className="ve-catalog-toolbar">
              <div className="ve-catalog-toolbar-left">
                <button
                  type="button"
                  className="ve-catalog-mobile-filter"
                  onClick={() =>
                    setFiltersOpen((value) => !value)
                  }
                  aria-expanded={filtersOpen}
                >
                  {filtersOpen ? <FaTimes /> : <FaFilter />}
                  {filtersOpen ? "Hide Filters" : "Filters"}
                </button>

                <FaThLarge
                  className="ve-catalog-grid-icon"
                  aria-hidden="true"
                />

                <span>
                  {loading
                    ? "Loading products..."
                    : `Showing ${firstItem}–${lastItem} of ${
                        pagination.total
                      } products`}
                </span>
              </div>

              <div className="ve-catalog-sort">
                <label htmlFor="ve-catalog-sort">
                  Sort by
                </label>

                <select
                  id="ve-catalog-sort"
                  value={sort}
                  onChange={(e) =>
                    updateFilters({ sort: e.target.value })
                  }
                >
                  <option value="featured">Featured</option>
                  <option value="name_asc">Name: A to Z</option>
                  <option value="name_desc">Name: Z to A</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>

            {hasFilters && (
              <div className="ve-catalog-active-filters">
                {brand && (
                  <button
                    type="button"
                    onClick={() => selectBrand("")}
                  >
                    {brands.find((b) => b.slug === brand)?.name ||
                      brand}
                    <FaTimes />
                  </button>
                )}

                {group && (
                  <button
                    type="button"
                    onClick={() =>
                      updateFilters({ group: "" })
                    }
                  >
                    {groups.find((g) => g.slug === group)?.name ||
                      group}
                    <FaTimes />
                  </button>
                )}

                {industry && (
                  <button
                    type="button"
                    onClick={() =>
                      updateFilters({ industry: "" })
                    }
                  >
                    {industries.find(
                      (i) => i.slug === industry
                    )?.name || industry}
                    <FaTimes />
                  </button>
                )}

                {query && (
                  <button
                    type="button"
                    onClick={() => updateFilters({ q: "" })}
                  >
                    Search: {query}
                    <FaTimes />
                  </button>
                )}
              </div>
            )}

            {error && (
              <div className="ve-catalog-error" role="alert">
                {error}
              </div>
            )}

            {loading ? (
              <div className="ve-catalog-grid" aria-busy="true">
                {Array.from({ length: 6 }, (_, index) => (
                  <div
                    className="ve-catalog-skeleton"
                    key={index}
                    aria-hidden="true"
                  >
                    <div />
                    <span />
                    <span />
                    <span />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="ve-catalog-empty">
                <FaBoxOpen />

                <h3>No Products Found</h3>

                <p>
                  Try changing your filters or search term.
                  Products must be published in Admin before
                  they appear here.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                >
                  View All Products
                </button>
              </div>
            ) : (
              <div className="ve-catalog-grid">
                {products.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                  />
                ))}
              </div>
            )}

            {!loading && pagination.pages > 1 && (
              <nav
                className="ve-catalog-pagination"
                aria-label="Product pagination"
              >
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => goToPage(page - 1)}
                  aria-label="Previous products page"
                >
                  <FaChevronLeft />
                </button>

                {Array.from(
                  { length: pagination.pages },
                  (_, index) => index + 1
                )
                  .filter(
                    (number) =>
                      number === 1 ||
                      number === pagination.pages ||
                      Math.abs(number - page) <= 1
                  )
                  .map((number, index, visible) => (
                    <React.Fragment key={number}>
                      {index > 0 &&
                        number - visible[index - 1] > 1 && (
                          <span
                            className="ve-catalog-page-gap"
                            aria-hidden="true"
                          >
                            ...
                          </span>
                        )}

                      <button
                        type="button"
                        className={
                          page === number ? "active" : ""
                        }
                        aria-current={
                          page === number ? "page" : undefined
                        }
                        onClick={() => goToPage(number)}
                      >
                        {number}
                      </button>
                    </React.Fragment>
                  ))}

                <button
                  type="button"
                  disabled={page >= pagination.pages}
                  onClick={() => goToPage(page + 1)}
                  aria-label="Next products page"
                >
                  <FaChevronRight />
                </button>
              </nav>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
