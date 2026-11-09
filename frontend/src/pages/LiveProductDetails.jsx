
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductPageLayout from "../components/ProductPageLayout";
import "./LiveProductDetails.css";

const API = (
  process.env.REACT_APP_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const mediaUrl = (url) => {
  if (!url) return "";

  if (/^(https?:)?\/\//i.test(url)) return url;

  return `${API}${url.startsWith("/") ? "" : "/"}${url}`;
};

async function getCatalogue(path, signal) {
  const response = await fetch(`${API}${path}`, { signal });
  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || "Unable to load product information."
    );
  }

  return result.data;
}

function ProductImage({ src, alt, className = "" }) {
  return src ? (
    <img
      src={mediaUrl(src)}
      alt={alt}
      className={className}
      loading="lazy"
    />
  ) : (
    <div className="ve-pd-image-placeholder">
      <span>Product image coming soon</span>
    </div>
  );
}

function PageNotice({ loading, error, text }) {
  if (loading) {
    return (
      <div className="ve-pd-notice" role="status">
        <div className="ve-pd-loader" />
        <p>{text || "Loading..."}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ve-pd-notice ve-pd-error" role="alert">
        <h3>Unable to load this page</h3>
        <p>{error}</p>
        <Link to="/products">Return to Products</Link>
      </div>
    );
  }

  return null;
}

/*
  PAGE 2: PRODUCT DETAILS
*/
export function LiveProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError("");
    setProduct(null);
    setModels([]);

    Promise.all([
      getCatalogue(
        `/api/v1/catalogue/products/${encodeURIComponent(id)}`,
        controller.signal
      ),
      getCatalogue(
        `/api/v1/products/${encodeURIComponent(id)}/models?limit=50`,
        controller.signal
      )
    ])
      .then(([productData, modelData]) => {
        if (controller.signal.aborted) return;

        setProduct(productData);
        setModels(Array.isArray(modelData) ? modelData : []);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [id]);

  return (
    <ProductPageLayout
      title={product?.name || "Product Details"}
      breadcrumb={[
        {
          label: product?.name || "Product Details"
        }
      ]}
    >
      <div className="ve-pd-container">
        <PageNotice
          loading={loading}
          error={error}
          text="Loading product information..."
        />

        {product && !loading && (
          <>
            <Link className="ve-pd-back" to="/products">
              ← Back to All Products
            </Link>

            <section className="ve-pd-product-overview">
              <div className="ve-pd-overview-image">
                <ProductImage
                  src={product.imageUrl}
                  alt={product.name}
                />
              </div>

              <div className="ve-pd-overview-content">
                <span className="ve-pd-eyebrow">
                  {product.brand?.name || "Vector Engineers"}
                </span>

                <h2>{product.name}</h2>

                <div className="ve-pd-meta">
                  <span>
                    Group: {product.group?.name || "Products"}
                  </span>
                </div>

                {product.description && (
                  <p className="ve-pd-description">
                    {product.description}
                  </p>
                )}

                <div className="ve-pd-highlight-row">
                  <div>
                    <strong>{models.length}</strong>
                    <span>
                      {models.length === 1
                        ? "Available Model"
                        : "Available Models"}
                    </span>
                  </div>

                  <div>
                    <strong>Technical</strong>
                    <span>Product Information</span>
                  </div>
                </div>

                <a
                  href="#available-models"
                  className="ve-pd-primary-btn"
                >
                  Explore Models
                </a>
              </div>
            </section>

            <section
              id="available-models"
              className="ve-pd-models-section"
            >
              <div className="ve-pd-section-heading">
                <div>
                  <span className="ve-pd-eyebrow">
                    PRODUCT RANGE
                  </span>
                  <h2>Available Models</h2>
                  <p>
                    Explore technical details and specifications
                    for individual models.
                  </p>
                </div>
              </div>

              {!models.length ? (
                <div className="ve-pd-empty">
                  No published models are available for this
                  product yet.
                </div>
              ) : (
                <div className="ve-pd-model-grid">
                  {models.map((model) => {
                    const image = model.images?.[0]?.url;

                    return (
                      <article
                        className="ve-pd-model-card"
                        key={model._id}
                      >
                        <Link
                          to={`/products/models/${model._id}`}
                          className="ve-pd-model-image"
                        >
                          <ProductImage
                            src={image || product.imageUrl}
                            alt={model.modelName}
                          />
                        </Link>

                        <div className="ve-pd-model-body">
                          <span className="ve-pd-model-brand">
                            {product.brand?.name}
                          </span>

                          <h3>
                            <Link
                              to={`/products/models/${model._id}`}
                            >
                              {model.modelName}
                            </Link>
                          </h3>

                          <p className="ve-pd-model-number">
                            Model:{" "}
                            {model.manufacturerModelNumber || "—"}
                          </p>

                          <Link
                            className="ve-pd-model-link"
                            to={`/products/models/${model._id}`}
                          >
                            View Model Details
                            <span aria-hidden="true"> →</span>
                          </Link>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </ProductPageLayout>
  );
}

/*
  REUSABLE MODEL IMAGE GALLERY
*/
function ModelGallery({ model }) {
  const images = (model.images || [])
    .filter((image) => image && image.url);

  const [selected, setSelected] = useState(0);

  useEffect(() => {
    setSelected(0);
  }, [model._id]);

  const selectedImage = images[selected];

  return (
    <div className="ve-pd-gallery">
      <div className="ve-pd-thumbnails">
        {images.map((image, index) => (
          <button
            key={`${image.url}-${index}`}
            type="button"
            className={
              selected === index
                ? "ve-pd-thumb active"
                : "ve-pd-thumb"
            }
            onClick={() => setSelected(index)}
            aria-label={`View product image ${index + 1}`}
            aria-pressed={selected === index}
          >
            <img
              src={mediaUrl(image.url)}
              alt={image.alt || `Thumbnail ${index + 1}`}
            />
          </button>
        ))}
      </div>

      <div className="ve-pd-main-image">
        <ProductImage
          src={selectedImage?.url}
          alt={selectedImage?.alt || model.modelName}
        />

        {images.length > 1 && (
          <span className="ve-pd-image-count">
            {selected + 1} / {images.length}
          </span>
        )}
      </div>
    </div>
  );
}

/*
  PAGE 3: INDIVIDUAL MODEL DETAILS
*/
export function LiveModelDetails() {
  const { id } = useParams();

  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError("");
    setModel(null);

    getCatalogue(
      `/api/v1/catalogue/models/${encodeURIComponent(id)}`,
      controller.signal
    )
      .then((data) => {
        if (!controller.signal.aborted) {
          setModel(data);
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [id]);

  const specifications = model?.specifications || [];
  const brochures = model?.brochureUrls || [];

  const quotationParams = new URLSearchParams();

  if (model) {
    quotationParams.set(
      "model",
      model.manufacturerModelNumber || model.modelName
    );

    quotationParams.set("product", model.product?.name || "");
  }

  return (
    <ProductPageLayout
      title={model?.modelName || "Model Details"}
      breadcrumb={[
        model?.product
          ? {
              label: model.product.name,
              to: `/products/${model.product._id}`
            }
          : {
              label: "Product"
            },
        {
          label: model?.modelName || "Model Details"
        }
      ]}
    >
      <div className="ve-pd-container">
        <PageNotice
          loading={loading}
          error={error}
          text="Loading model specifications..."
        />

        {model && !loading && (
          <>
            <Link
              to={`/products/${model.product._id}`}
              className="ve-pd-back"
            >
              ← Back to {model.product.name}
            </Link>

            <section className="ve-pd-model-detail">
              {/* LEFT: Product photos */}
              <ModelGallery model={model} />

              {/* RIGHT: Product information */}
              <div className="ve-pd-detail-info">
                <div className="ve-pd-brand-line">
                  <span className="ve-pd-eyebrow">
                    {model.product?.brand?.name ||
                      "Vector Engineers"}
                  </span>

                  <span className="ve-pd-availability">
                    Product Enquiries
                  </span>
                </div>

                <h2>{model.modelName}</h2>

                <div className="ve-pd-sku">
                  Model Number:
                  <strong>
                    {model.manufacturerModelNumber || "—"}
                  </strong>
                </div>

                <div className="ve-pd-info-divider" />

                {model.description && (
                  <div className="ve-pd-about">
                    <h3>Product Overview</h3>
                    <p>{model.description}</p>
                  </div>
                )}

                {specifications.length > 0 && (
                  <div className="ve-pd-key-specs">
                    <h3>Key Specifications</h3>

                    <div className="ve-pd-key-spec-grid">
                      {specifications
                        .filter((s) => s.name)
                        .slice(0, 4)
                        .map((spec, index) => (
                          <div key={index}>
                            <span>{spec.name}</span>
                            <strong>
                              {spec.value}
                              {spec.unit ? ` ${spec.unit}` : ""}
                            </strong>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {model.industries?.length > 0 && (
                  <div className="ve-pd-related-tags">
                    <h3>Applicable Industries</h3>

                    <div>
                      {model.industries.map((industry) => (
                        <span key={industry._id}>
                          {industry.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="ve-pd-enquiry-card">
                  <span className="ve-pd-enquiry-label">
                    Need this product for your project?
                  </span>

                  <p>
                    Contact our team for product availability,
                    technical assistance and quotation details.
                  </p>

                  <Link
                    to={`/contact?${quotationParams.toString()}`}
                    className="ve-pd-primary-btn"
                  >
                    Request Quotation
                    <span aria-hidden="true"> →</span>
                  </Link>
                </div>
              </div>
            </section>

            {/* TECHNICAL INFORMATION */}
            <section className="ve-pd-technical-section">
              <div className="ve-pd-section-heading">
                <span className="ve-pd-eyebrow">
                  TECHNICAL DETAILS
                </span>
                <h2>Specifications & Documentation</h2>
              </div>

              <div className="ve-pd-technical-grid">
                <div className="ve-pd-spec-panel">
                  <h3>Technical Specifications</h3>

                  {specifications.length === 0 ? (
                    <p>
                      Detailed specifications will be added soon.
                    </p>
                  ) : (
                    <table className="ve-pd-spec-table">
                      <tbody>
                        {specifications
                          .filter((s) => s.name)
                          .map((spec, index) => (
                            <tr key={index}>
                              <th scope="row">{spec.name}</th>

                              <td>
                                {spec.value}
                                {spec.unit
                                  ? ` ${spec.unit}`
                                  : ""}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  )}
                </div>

                <div className="ve-pd-doc-panel">
                  <h3>Brochures & Downloads</h3>

                  {brochures.length === 0 ? (
                    <p>
                      No brochures are currently available.
                    </p>
                  ) : (
                    brochures.map((url, index) => (
                      <a
                        key={`${url}-${index}`}
                        className="ve-pd-document"
                        href={mediaUrl(url)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="ve-pd-pdf-icon">
                          PDF
                        </span>

                        <span>
                          <strong>
                            Product Document {index + 1}
                          </strong>

                          <small>
                            View brochure or datasheet
                          </small>
                        </span>

                        <span aria-hidden="true">↗</span>
                      </a>
                    ))
                  )}
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </ProductPageLayout>
  );
}
