
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./IndustryApplicationProducts.css";

const API = (
  process.env.REACT_APP_API_URL || "https://vector-engineers-backend-476393526056.asia-southeast1.run.app"
).replace(/\/$/, "");

const mediaUrl = (url) => {
  if (!url) return "";

  if (/^(https?:)?\/\//i.test(url)) {
    return url;
  }

  return `${API}${url.startsWith("/") ? "" : "/"}${url}`;
};

async function request(path, signal) {
  const response = await fetch(`${API}${path}`, { signal });
  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || "Unable to load catalogue information"
    );
  }

  return result;
}

export default function IndustryApplicationProducts({
  type = "industry"
}) {
  const isIndustry = type === "industry";

  const collectionPath = isIndustry
    ? "/api/v1/industries"
    : "/api/v1/applications";

  const productPath = isIndustry
    ? "/api/v1/catalogue/industries"
    : "/api/v1/catalogue/applications";

  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState("");
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 0,
    total: 0
  });

  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [error, setError] = useState("");

  // Load published industries or applications.
  useEffect(() => {
    const controller = new AbortController();

    setLoadingCategories(true);
    setError("");
    setCategories([]);
    setSelected("");
    setPage(1);

    request(`${collectionPath}?limit=50`, controller.signal)
      .then((result) => {
        const records = result.data || [];

        setCategories(records);

        if (records.length > 0) {
          setSelected(records[0].slug);
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoadingCategories(false);
        }
      });

    return () => controller.abort();
  }, [collectionPath]);

  // Load products matching the selected category.
  useEffect(() => {
    if (!selected) {
      setProducts([]);
      setCategory(null);
      setPagination({ page: 1, pages: 0, total: 0 });
      return;
    }

    const controller = new AbortController();

    setLoadingProducts(true);
    setError("");

    const url =
      `${productPath}/${encodeURIComponent(selected)}` +
      `/products?page=${page}&limit=9`;

    request(url, controller.signal)
      .then((result) => {
        setProducts(result.data || []);
        setCategory(result.category || null);

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
          setError(err.message);
          setProducts([]);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoadingProducts(false);
        }
      });

    return () => controller.abort();
  }, [selected, page, productPath]);

  const selectCategory = (slug) => {
    setSelected(slug);
    setPage(1);
    setProducts([]);
    setCategory(null);
  };

  const heading = isIndustry
    ? "Products by Industry"
    : "Products by Application";

  return (
    <section className="ve-category-products">
      <div className="container">
        <div className="ve-category-heading">
          <span className="ve-category-eyebrow">
            VECTOR ENGINEERS
          </span>

          <h2>{heading}</h2>

          <p>
            {isIndustry
              ? "Explore electrical products suitable for different industries."
              : "Discover electrical products based on their applications."}
          </p>
        </div>

        {loadingCategories && (
          <p role="status" className="ve-category-notice">
            Loading categories...
          </p>
        )}

        {error && (
          <p role="alert" className="ve-category-error">
            {error}
          </p>
        )}

        {!loadingCategories && categories.length === 0 && !error && (
          <p className="ve-category-notice">
            No published categories are available yet.
          </p>
        )}

        {categories.length > 0 && (
          <>
            <div
              className="ve-category-selector"
              aria-label={
                isIndustry ? "Select industry" : "Select application"
              }
            >
              {categories.map((item) => (
                <button
                  type="button"
                  key={item._id}
                  className={
                    selected === item.slug
                      ? "ve-category-tab active"
                      : "ve-category-tab"
                  }
                  aria-pressed={selected === item.slug}
                  onClick={() => selectCategory(item.slug)}
                >
                  {item.name}
                </button>
              ))}
            </div>

            <div className="ve-category-result-heading">
              <div>
                <h3>
                  {category?.name ||
                    categories.find((x) => x.slug === selected)?.name}
                </h3>

                {category?.description && (
                  <p>{category.description}</p>
                )}
              </div>

              {!loadingProducts && (
                <span>
                  {pagination.total}{" "}
                  {pagination.total === 1 ? "Product" : "Products"}
                </span>
              )}
            </div>

            {loadingProducts ? (
              <p role="status" className="ve-category-notice">
                Loading products...
              </p>
            ) : (
              <>
                {products.length === 0 && !error ? (
                  <div className="ve-category-empty">
                    <h4>No published products yet</h4>
                    <p>
                      Products assigned to this category will appear
                      here once published by the administrator.
                    </p>
                  </div>
                ) : (
                  <div className="ve-category-grid">
                    {products.map((product) => (
                      <article
                        className="ve-category-product-card"
                        key={product._id}
                      >
                        <Link
                          to={`/products/${product._id}`}
                          className="ve-category-image"
                        >
                          {product.imageUrl ? (
                            <img
                              src={mediaUrl(product.imageUrl)}
                              alt={product.name}
                              loading="lazy"
                            />
                          ) : (
                            <div className="ve-category-placeholder">
                              Product Image
                            </div>
                          )}
                        </Link>

                        <div className="ve-category-card-body">
                          <span className="ve-category-brand">
                            {product.brand?.name || "Brand"}
                            {product.group?.name
                              ? ` / ${product.group.name}`
                              : ""}
                          </span>

                          <h4>
                            <Link to={`/products/${product._id}`}>
                              {product.name}
                            </Link>
                          </h4>

                          {product.description && (
                            <p>{product.description}</p>
                          )}

                          <Link
                            to={`/products/${product._id}`}
                            className="ve-category-view"
                          >
                            View Product Models
                            <span aria-hidden="true"> →</span>
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                )}

                {pagination.pages > 1 && (
                  <div className="ve-category-pagination">
                    <button
                      type="button"
                      disabled={page <= 1}
                      onClick={() => setPage((x) => x - 1)}
                    >
                      Previous
                    </button>

                    <span>
                      Page {page} of {pagination.pages}
                    </span>

                    <button
                      type="button"
                      disabled={page >= pagination.pages}
                      onClick={() => setPage((x) => x + 1)}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}
