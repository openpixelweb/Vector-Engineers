
import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  LayoutDashboard,
  Tags,
  FolderTree,
  Package,
  Boxes,
  Factory,
  Layers3,
  LogOut,
  Plus,
  Search,
  Pencil,
  Ban,
  CheckCircle2,
  X,
  RefreshCw,
  ShieldCheck,
  ChevronRight,
  UploadCloud,
  Trash2,
  FileText,
  Menu,
  ArrowUpRight,
  Clock3,
  Archive,
  Activity,
} from "lucide-react";

/* ==========================================
   API CONFIGURATION
========================================== */

const BASE = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000"
).replace(/\/$/, "");

const LOGO = "/vector-logo.png";

/* ==========================================
   CATALOGUE CONFIGURATION
========================================== */

const resources = {
  brands: {
    title: "Brands",
    singular: "Brand",
    icon: Tags,
    fields: [
      "name",
      "slug",
      "description",
      "logoUrl",
      "website",
      "sortOrder",
      "status",
    ],
  },

  groups: {
    title: "Product Groups",
    singular: "Product Group",
    icon: FolderTree,
    fields: [
      "brandId",
      "name",
      "slug",
      "description",
      "imageUrl",
      "sortOrder",
      "status",
    ],
  },

  products: {
    title: "Products",
    singular: "Product",
    icon: Package,
    fields: [
      "brandId",
      "groupId",
      "name",
      "slug",
      "description",
      "imageUrl",
      "industryIds",
      "applicationIds",
      "sortOrder",
      "status",
    ],
  },

  models: {
    title: "Product Models",
    singular: "Product Model",
    icon: Boxes,
    fields: [
      "productId",
      "modelName",
      "manufacturerModelNumber",
      "slug",
      "description",
      "images",
      "specifications",
      "brochureUrls",
      "industryOverrideIds",
      "applicationOverrideIds",
      "status",
    ],
  },

  industries: {
    title: "Industries",
    singular: "Industry",
    icon: Factory,
    fields: [
      "name",
      "slug",
      "description",
      "imageUrl",
      "sortOrder",
      "status",
    ],
  },

  applications: {
    title: "Applications",
    singular: "Application",
    icon: Layers3,
    fields: [
      "name",
      "slug",
      "description",
      "imageUrl",
      "sortOrder",
      "status",
    ],
  },
};

const resourceKeys = Object.keys(resources);

const multiFields = new Set([
  "industryIds",
  "applicationIds",
  "industryOverrideIds",
  "applicationOverrideIds",
]);

const relationFields = {
  brandId: "brands",
  groupId: "groups",
  productId: "products",
  industryIds: "industries",
  applicationIds: "applications",
  industryOverrideIds: "industries",
  applicationOverrideIds: "applications",
};

const requiredFields = {
  brands: ["name", "slug"],
  groups: ["brandId", "name", "slug"],
  products: ["brandId", "groupId", "name", "slug"],
  models: [
    "productId",
    "modelName",
    "manufacturerModelNumber",
    "slug",
  ],
  industries: ["name", "slug"],
  applications: ["name", "slug"],
};

const fieldLabels = {
  brandId: "Brand",
  groupId: "Product Group",
  productId: "Product",
  modelName: "Model Name",
  manufacturerModelNumber: "Manufacturer Model Number",
  logoUrl: "Brand Logo",
  imageUrl: "Product Image",
  industryIds: "Industries",
  applicationIds: "Applications",
  industryOverrideIds: "Industry Override",
  applicationOverrideIds: "Application Override",
  brochureUrls: "Brochures",
  sortOrder: "Sort Order",
};

function pretty(field) {
  return (
    fieldLabels[field] ||
    field
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (letter) => letter.toUpperCase())
  );
}

function displayName(record) {
  return (
    record?.name ||
    record?.modelName ||
    record?.manufacturerModelNumber ||
    record?.slug ||
    "Unnamed Record"
  );
}

function makeSlug(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function newRecord(resource) {
  const fields = resources[resource].fields;

  return Object.fromEntries(
    fields.map((key) => {
      if (key === "status") return [key, "draft"];

      if (multiFields.has(key)) {
        return [
          key,
          key.includes("Override") ? null : [],
        ];
      }

      if (
        ["images", "specifications", "brochureUrls"].includes(key)
      ) {
        return [key, []];
      }

      if (key === "sortOrder") return [key, 0];

      return [key, ""];
    })
  );
}

function nameOf(list, id) {
  const item = (list || []).find(
    (record) => String(record._id) === String(id)
  );

  return item
    ? displayName(item)
    : String(id || "—").slice(0, 8);
}

function fullMediaUrl(url) {
  if (!url) return "";

  if (url.startsWith("/media/")) {
    return `${BASE}${url}`;
  }

  if (url.startsWith("/uploads/")) {
    return `${BASE}${url}`;
  }

  return url;
}

/* ==========================================
   API HELPER
========================================== */

async function api(path, token, options = {}) {
  const response = await fetch(
    `${BASE}/api/v1${path}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token
          ? { Authorization: `Bearer ${token}` }
          : {}),
        ...(options.headers || {}),
      },
    }
  );

  const result = await response.json().catch(() => ({}));

  if (!response.ok || result.success === false) {
    throw new Error(
      result.message ||
      `Request failed (${response.status})`
    );
  }

  return result;
}

/* ==========================================
   COMPANY LOGO
========================================== */

function CompanyLogo({ className = "" }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`ve-company-logo ${className}`}>
      {failed ? (
        <div className="ve-logo-fallback">
          <strong>VECTOR</strong>
          <small>ENGINEERS</small>
        </div>
      ) : (
        <img
          src={LOGO}
          alt="Vector Engineers"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

/* ==========================================
   LOGIN SCREEN
========================================== */

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const result = await api(
        "/admin/login",
        null,
        {
          method: "POST",
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      if (result.admin?.role !== "super_admin") {
        throw new Error(
          "Super Admin permissions are required."
        );
      }

      onLogin(result.accessToken, result.admin);
      setPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-shell">
      <div className="login-aside">
        <CompanyLogo className="ve-login-logo" />

        <h1>Vector Engineers</h1>

        <p>CATALOGUE MANAGEMENT PORTAL</p>

        <div className="login-copy">
          Manage manufacturer brands, product groups,
          individual models, specifications and applications
          from one secure workspace.
        </div>
      </div>

      <div className="login-main">
        <form
          className="login-card"
          onSubmit={submit}
        >
          <span className="eyebrow">
            SECURE ADMIN ACCESS
          </span>

          <h2>Welcome back</h2>

          <p>
            Sign in to manage the Vector Engineers
            product catalogue.
          </p>

          <label>
            Email Address

            <input
              type="email"
              required
              autoComplete="username"
              placeholder="Enter admin email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
            />
          </label>

          <label>
            Password

            <input
              type="password"
              required
              autoComplete="current-password"
              placeholder="Enter password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
            />
          </label>

          {error && (
            <p className="alert error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="primary full"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}

            <ChevronRight size={17} />
          </button>

          <div className="login-note">
            <ShieldCheck size={15} />

            <span>
              Authorized administrator access only.
              Session ends when the page reloads.
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ==========================================
   DASHBOARD OVERVIEW
========================================== */

function DashboardOverview({
  counts,
  lookups,
  onNavigate,
  loading,
}) {
  const statistics = resourceKeys.map((key) => ({
    key,
    ...resources[key],
    count: counts[key],
  }));

  const summary = useMemo(() => {
    const allRecords = Object.values(lookups).flat();

    return {
      published: allRecords.filter(
        (record) => record.status === "published"
      ).length,

      draft: allRecords.filter(
        (record) => record.status === "draft"
      ).length,

      inactive: allRecords.filter(
        (record) => record.status === "inactive"
      ).length,

      loaded: allRecords.length,
    };
  }, [lookups]);

  const recent = useMemo(() => {
    return Object.entries(lookups)
      .flatMap(([type, items]) =>
        (items || []).map((item) => ({
          ...item,
          resourceType: type,
        }))
      )
      .filter((item) => item.updatedAt)
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() -
          new Date(a.updatedAt).getTime()
      )
      .slice(0, 6);
  }, [lookups]);

  const quickActions = [
    "brands",
    "groups",
    "products",
    "models",
  ];

  return (
    <div className="ve-dashboard-overview">

      {/* LIVE STATISTICS */}
      <div className="stats">
        {statistics.map((item) => {
          const Icon = item.icon;

          return (
            <button
              type="button"
              key={item.key}
              className="stat-card"
              onClick={() => onNavigate(item.key)}
            >
              <Icon size={24} />

              <strong>
                {item.count === undefined
                  ? "—"
                  : item.count}
              </strong>

              <span>{item.title}</span>

              <ChevronRight
                className="stat-chevron"
                size={16}
              />
            </button>
          );
        })}
      </div>

      {/* PUBLICATION OVERVIEW */}
      <div className="ve-dashboard-insights">
        <section className="ve-insight-section">
          <div className="ve-insight-title">
            <div>
              <span className="ve-insight-kicker">
                CATALOGUE HEALTH
              </span>

              <h2>Publication Overview</h2>

              <p>
                Status of records currently loaded
                from your catalogue API.
              </p>
            </div>
          </div>

          <div className="ve-publication-grid">
            <div className="ve-publication-item">
              <CheckCircle2 size={20} />

              <strong>
                {loading ? "—" : summary.published}
              </strong>

              <span>Published</span>
            </div>

            <div className="ve-publication-item">
              <Clock3 size={20} />

              <strong>
                {loading ? "—" : summary.draft}
              </strong>

              <span>Draft</span>
            </div>

            <div className="ve-publication-item">
              <Archive size={20} />

              <strong>
                {loading ? "—" : summary.inactive}
              </strong>

              <span>Inactive</span>
            </div>
          </div>

          <p className="ve-data-note">
            These publication summaries reflect the
            records loaded into the dashboard.
            Full totals come from the pagination
            metadata returned by the API.
          </p>
        </section>

        {/* RECENT ACTIVITY + QUICK LINKS */}
        <div className="ve-insights-two-column">
          <section className="ve-insight-section">
            <div className="ve-insight-title">
              <div>
                <span className="ve-insight-kicker">
                  CATALOGUE UPDATES
                </span>

                <h2>Recently Updated</h2>
              </div>
            </div>

            {recent.length === 0 ? (
              <div className="ve-insight-empty">
                No recent catalogue updates available.
              </div>
            ) : (
              <div className="ve-recent-list">
                {recent.map((item) => (
                  <button
                    type="button"
                    className="ve-recent-row"
                    key={`${item.resourceType}-${item._id}`}
                    onClick={() =>
                      onNavigate(item.resourceType)
                    }
                  >
                    <div className="ve-recent-icon">
                      <Package size={18} />
                    </div>

                    <div className="ve-recent-details">
                      <strong>
                        {displayName(item)}
                      </strong>

                      <small>
                        {resources[item.resourceType]?.title}

                        {" · "}

                        {new Date(
                          item.updatedAt
                        ).toLocaleDateString()}
                      </small>
                    </div>

                    <span
                      className={`status ${
                        item.status || "draft"
                      }`}
                    >
                      {item.status || "draft"}
                    </span>

                    <ArrowUpRight size={16} />
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="ve-insight-section">
            <div className="ve-insight-title">
              <div>
                <span className="ve-insight-kicker">
                  QUICK ACCESS
                </span>

                <h2>Catalogue Management</h2>
              </div>
            </div>

            <div className="ve-quick-actions">
              {quickActions.map((key) => {
                const Icon = resources[key].icon;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => onNavigate(key)}
                  >
                    <span className="ve-quick-icon">
                      <Icon size={18} />
                    </span>

                    <span className="ve-quick-text">
                      <strong>
                        Manage {resources[key].title}
                      </strong>

                      <small>
                        {counts[key] ?? 0} records
                      </small>
                    </span>

                    <ArrowUpRight size={17} />
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* GETTING STARTED */}
        <section
          className="info-panel"
          style={{ marginTop: 24 }}
        >
          <div className="ve-info-heading">
            <Activity size={20} />

            <h2>Catalogue Workflow</h2>
          </div>

          <p>
            Create a Brand, then a Product Group,
            followed by Products and their individual
            Models. Add model images, specifications
            and brochures before publishing.
          </p>

          <p>
            Assign Industries and Applications to
            Products. Models can inherit the mappings
            or use their own overrides.
          </p>

          <button
            type="button"
            className="primary"
            onClick={() => onNavigate("brands")}
          >
            Manage Brands

            <ChevronRight size={16} />
          </button>
        </section>
      </div>
    </div>
  );
}

/* ==========================================
   MAIN ADMIN APPLICATION
========================================== */

function App() {
  const [token, setToken] = useState("");
  const [admin, setAdmin] = useState(null);

  const [section, setSection] = useState("overview");

  const [rows, setRows] = useState([]);
  const [lookups, setLookups] = useState({});
  const [counts, setCounts] = useState({});

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [editing, setEditing] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const current = resources[section];

  function logout() {
    setToken("");
    setAdmin(null);
    setRows([]);
    setLookups({});
    setCounts({});
    setEditing(null);
    setSection("overview");
    setSidebarOpen(false);
  }

  async function loadAll() {
    if (!token) return;

    setLoading(true);
    setError("");

    try {
      const results = await Promise.all(
        resourceKeys.map((key) =>
          api(
            `/admin/catalog/${key}?limit=50`,
            token
          )
        )
      );

      const nextLookups = {};
      const nextCounts = {};

      results.forEach((result, index) => {
        const key = resourceKeys[index];

        nextLookups[key] = result.data || [];

        nextCounts[key] =
          result.pagination?.total ??
          result.data?.length ??
          0;
      });

      setLookups(nextLookups);
      setCounts(nextCounts);

    } catch (err) {
      if (
        /token|auth|unauthor|expired/i.test(
          err.message
        )
      ) {
        logout();
      }

      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) {
      loadAll();
    }
    // Reload when a new admin session starts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (current) {
      setRows(lookups[section] || []);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lookups, section]);

  function navigateTo(nextSection) {
    setSection(nextSection);
    setSearch("");
    setFilter("all");
    setEditing(null);
    setError("");
    setMessage("");
    setSidebarOpen(false);
  }

  async function reloadSection() {
    await loadAll();
  }

  async function save(data) {
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const isEdit = Boolean(editing?._id);

      const path =
        `/admin/catalog/${section}` +
        (isEdit ? `/${editing._id}` : "");

      const body = { ...data };

      // Do not send optional empty fields on create.
      if (!isEdit) {
        for (const field of resources[section].fields) {
          if (
            !requiredFields[section].includes(field) &&
            body[field] === ""
          ) {
            delete body[field];
          }
        }
      }

      await api(path, token, {
        method: isEdit ? "PATCH" : "POST",
        body: JSON.stringify(body),
      });

      setEditing(null);

      setMessage(
        `${resources[section].singular} ${
          isEdit ? "updated" : "created"
        } successfully.`
      );

      await loadAll();

    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(record, status) {
    const confirmed = window.confirm(
      `Set "${displayName(record)}" to ${status}?`
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      await api(
        `/admin/catalog/${section}/${record._id}`,
        token,
        {
          method: "PATCH",
          body: JSON.stringify({ status }),
        }
      );

      setMessage(
        `Record status changed to ${status}.`
      );

      await loadAll();

    } catch (err) {
      setError(err.message);
    }
  }

  const filtered = useMemo(() => {
    return rows.filter((record) => {
      const statusMatch =
        filter === "all" ||
        record.status === filter;

      const text = [
        displayName(record),
        record.description || "",
        record.manufacturerModelNumber || "",
      ]
        .join(" ")
        .toLowerCase();

      return (
        statusMatch &&
        text.includes(search.toLowerCase())
      );
    });
  }, [rows, filter, search]);

  if (!token) {
    return (
      <Login
        onLogin={(newToken, newAdmin) => {
          setToken(newToken);
          setAdmin(newAdmin);
        }}
      />
    );
  }

  return (
    <div className="shell">

      {/* MOBILE SIDEBAR TOGGLE */}
      {sidebarOpen && (
        <button
          type="button"
          className="ve-sidebar-overlay"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={
          `sidebar ve-admin-sidebar ` +
          (sidebarOpen ? "is-open" : "")
        }
      >
        <div className="sidebar-brand">
          <CompanyLogo className="ve-sidebar-logo" />

          <span className="ve-sidebar-caption">
            CATALOGUE MANAGEMENT
          </span>
        </div>

        <div className="menu-caption">
          WORKSPACE
        </div>

        <button
          type="button"
          className={
            "nav-item " +
            (section === "overview" ? "active" : "")
          }
          onClick={() => navigateTo("overview")}
        >
          <LayoutDashboard size={18} />

          Overview
        </button>

        <div className="menu-caption">
          PRODUCT CATALOGUE
        </div>

        {resourceKeys.map((key) => {
          const Icon = resources[key].icon;

          return (
            <button
              type="button"
              key={key}
              className={
                "nav-item " +
                (section === key ? "active" : "")
              }
              onClick={() => navigateTo(key)}
            >
              <Icon size={18} />

              {resources[key].title}

              <span className="nav-count">
                {counts[key] ?? "—"}
              </span>
            </button>
          );
        })}

        {/* SIDEBAR FOOTER */}
        <div className="sidebar-bottom">
          <div className="signed-in">
            <span className="avatar">
              {(admin?.displayName || "A")
                .charAt(0)
                .toUpperCase()}
            </span>

            <div>
              <b>
                {admin?.displayName || "Administrator"}
              </b>

              <small>
                Super Admin
              </small>
            </div>
          </div>

          <button
            type="button"
            className="nav-item"
            onClick={logout}
          >
            <LogOut size={18} />

            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main">

        {/* TOP HEADER */}
        <header className="topbar ve-admin-topbar">
          <div className="ve-topbar-left">
            <div className="ve-topbar-breadcrumb">
              <button
                type="button"
                className="ve-mobile-menu"
                onClick={() =>
                  setSidebarOpen((open) => !open)
                }
                aria-label="Toggle navigation"
                aria-expanded={sidebarOpen}
              >
                <Menu size={21} />
              </button>

              <span>Workspace</span>

              <ChevronRight size={14} />

              <strong>
                {current?.title || "Dashboard Overview"}
              </strong>
            </div>

            <span className="ve-topbar-subtitle">
              Product Catalogue Management System
            </span>
          </div>

          <div className="ve-topbar-right">
            <span className="ve-admin-system-status">
              <span className="online-dot" />

              Admin Workspace
            </span>

            <button
              type="button"
              className="ve-topbar-refresh"
              onClick={reloadSection}
              disabled={loading}
              title="Refresh catalogue data"
            >
              <RefreshCw size={16} />
            </button>

            <div className="ve-topbar-profile">
              <span className="ve-profile-avatar">
                {(admin?.displayName || "A")
                  .charAt(0)
                  .toUpperCase()}
              </span>

              <div>
                <strong>
                  {admin?.displayName ||
                    "Administrator"}
                </strong>

                <small>Super Admin</small>
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="content">

          {/* PAGE HEADING */}
          <div className="heading-row">
            <div>
              <span className="eyebrow">
                VECTOR ENGINEERS / ADMIN
              </span>

              <h1>
                {current?.title ||
                  "Catalogue Overview"}
              </h1>

              <p>
                {current
                  ? `Manage ${current.title.toLowerCase()}, records and publication status.`
                  : "Monitor and manage your complete electrical products catalogue."}
              </p>
            </div>

            <div className="heading-actions">
              <button
                type="button"
                className="secondary"
                onClick={reloadSection}
                disabled={loading}
              >
                <RefreshCw size={16} />

                Refresh
              </button>

              {current && (
                <button
                  type="button"
                  className="primary"
                  onClick={() => {
                    setEditing(
                      newRecord(section)
                    );

                    setError("");
                  }}
                >
                  <Plus size={17} />

                  Add {current.singular}
                </button>
              )}
            </div>
          </div>

          {/* ALERTS */}
          {error && (
            <p
              className="alert error"
              role="alert"
            >
              {error}
            </p>
          )}

          {message && (
            <p
              className="alert success"
              role="status"
            >
              {message}
            </p>
          )}

          {/* OVERVIEW */}
          {section === "overview" ? (
            <DashboardOverview
              counts={counts}
              lookups={lookups}
              loading={loading}
              onNavigate={navigateTo}
            />
          ) : (
            /* MANAGEMENT TABLE */
            <div className="table-panel">
              <div className="toolbar">

                {/* SEARCH */}
                <div className="search">
                  <Search size={17} />

                  <input
                    type="search"
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder={
                      `Search ${current.title.toLowerCase()}...`
                    }
                  />
                </div>

                {/* STATUS FILTER */}
                <select
                  value={filter}
                  onChange={(event) =>
                    setFilter(event.target.value)
                  }
                  aria-label="Filter by status"
                >
                  <option value="all">
                    All Statuses
                  </option>

                  <option value="draft">
                    Draft
                  </option>

                  <option value="published">
                    Published
                  </option>

                  <option value="inactive">
                    Inactive
                  </option>
                </select>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Parent / Reference</th>
                      <th>Status</th>
                      <th>Updated</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filtered.map((record) => (
                      <tr key={record._id}>
                        <td>
                          <strong>
                            {displayName(record)}
                          </strong>

                          <small>
                            {record.slug ||
                              record.manufacturerModelNumber ||
                              ""}
                          </small>
                        </td>

                        <td>
                          {record.brandId
                            ? nameOf(
                                lookups.brands,
                                record.brandId
                              )
                            : record.groupId
                            ? nameOf(
                                lookups.groups,
                                record.groupId
                              )
                            : record.productId
                            ? nameOf(
                                lookups.products,
                                record.productId
                              )
                            : "—"}
                        </td>

                        <td>
                          <span
                            className={
                              `status ${record.status}`
                            }
                          >
                            {record.status}
                          </span>
                        </td>

                        <td>
                          {record.updatedAt
                            ? new Date(
                                record.updatedAt
                              ).toLocaleDateString()
                            : "—"}
                        </td>

                        <td>
                          <div className="actions">
                            <button
                              type="button"
                              title="Edit Record"
                              aria-label={
                                `Edit ${displayName(record)}`
                              }
                              onClick={() => {
                                setEditing(record);
                                setError("");
                              }}
                            >
                              <Pencil size={16} />
                            </button>

                            {record.status !==
                              "published" && (
                              <button
                                type="button"
                                title="Publish"
                                onClick={() =>
                                  changeStatus(
                                    record,
                                    "published"
                                  )
                                }
                              >
                                <CheckCircle2
                                  size={16}
                                />
                              </button>
                            )}

                            {record.status !==
                              "inactive" && (
                              <button
                                type="button"
                                title="Deactivate"
                                onClick={() =>
                                  changeStatus(
                                    record,
                                    "inactive"
                                  )
                                }
                              >
                                <Ban size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filtered.length === 0 && (
                      <tr>
                        <td
                          className="empty"
                          colSpan={5}
                        >
                          {loading
                            ? "Loading catalogue records..."
                            : "No records found. Use Add to create a new record."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="table-foot">
                Showing {filtered.length} of{" "}
                {counts[section] ?? 0} records.

                <span>
                  First 50 records are loaded.
                  Full pagination is a future enhancement.
                </span>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ADD / EDIT MODAL */}
      {editing && current && (
        <Editor
          key={`${section}-${editing._id || "new"}`}
          token={token}
          resource={section}
          initial={editing}
          lookups={lookups}
          saving={saving}
          error={error}
          onClose={() => {
            if (!saving) {
              setEditing(null);
            }
          }}
          onSave={save}
        />
      )}
    </div>
  );
}

/* ==========================================
   FILE UPLOAD
========================================== */

async function uploadMedia(file, kind, token) {
  const payload = new FormData();

  payload.append("file", file);

  const response = await fetch(
    `${BASE}/api/v1/admin/media?kind=${kind}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: payload,
    }
  );

  const result = await response.json().catch(() => ({}));

  if (!response.ok || !result.success) {
    throw new Error(
      result.message ||
      `Upload failed (${response.status})`
    );
  }

  return result.data.url;
}

/* ==========================================
   SINGLE IMAGE UPLOAD
========================================== */

function UploadField({
  token,
  label,
  kind,
  value,
  onChange,
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function upload(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    setBusy(true);
    setError("");

    try {
      const url = await uploadMedia(
        file,
        kind,
        token
      );

      onChange(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  }

  return (
    <div className="field wide media-field">
      <label>{label}</label>

      <div className="media-input-row">
        <input
          type="text"
          value={value || ""}
          placeholder="Image URL or upload an image"
          onChange={(event) =>
            onChange(event.target.value)
          }
        />

        <label className="media-upload">
          <UploadCloud size={16} />

          {busy ? "Uploading..." : "Upload Image"}

          <input
            type="file"
            disabled={busy}
            accept="image/png,image/jpeg,image/webp"
            onChange={upload}
          />
        </label>
      </div>

      {value && (
        <div className="media-preview">
          <img
            src={fullMediaUrl(value)}
            alt="Selected catalogue asset"
          />

          <button
            type="button"
            className="secondary"
            onClick={() => onChange("")}
          >
            Remove Reference
          </button>
        </div>
      )}

      {error && (
        <span className="invalid">
          {error}
        </span>
      )}

      <small>
        JPG, PNG or WebP, maximum 5 MB.
        Uploaded files are publicly accessible.
        Save the record to attach the image.
      </small>
    </div>
  );
}

/* ==========================================
   MODEL IMAGE / PDF COLLECTION
========================================== */

function MediaCollection({
  token,
  kind,
  title,
  value,
  onChange,
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const items = Array.isArray(value) ? value : [];

  async function upload(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    setBusy(true);
    setError("");

    try {
      const url = await uploadMedia(
        file,
        kind,
        token
      );

      const next =
        kind === "image"
          ? {
              url,
              alt: file.name.replace(/\.[^.]+$/, ""),
              sortOrder: items.length,
            }
          : url;

      onChange([...items, next]);

    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  }

  function remove(index) {
    onChange(
      items.filter(
        (_, itemIndex) => itemIndex !== index
      )
    );
  }

  return (
    <div className="field wide">
      <label>{title}</label>

      <label className="media-upload media-upload-wide">
        <UploadCloud size={17} />

        {busy
          ? "Uploading..."
          : kind === "image"
          ? "Upload Model Image"
          : "Upload PDF Brochure"}

        <input
          type="file"
          disabled={busy}
          accept={
            kind === "image"
              ? "image/jpeg,image/png,image/webp"
              : "application/pdf"
          }
          onChange={upload}
        />
      </label>

      {error && (
        <span className="invalid">{error}</span>
      )}

      <div className="media-gallery">
        {items.map((item, index) => {
          const url =
            kind === "image"
              ? item.url
              : item;

          return (
            <div
              key={`${url}-${index}`}
              className="media-tile"
            >
              {kind === "image" ? (
                <img
                  src={fullMediaUrl(url)}
                  alt={
                    item.alt || "Product Model"
                  }
                />
              ) : (
                <FileText size={30} />
              )}

              <a
                href={fullMediaUrl(url)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {kind === "image"
                  ? `Image ${index + 1}`
                  : `PDF ${index + 1}`}
              </a>

              <button
                type="button"
                className="media-remove"
                title="Remove Reference"
                onClick={() => remove(index)}
              >
                <Trash2 size={15} />
              </button>
            </div>
          );
        })}
      </div>

      <small>
        {kind === "image"
          ? "Up to 25 images, maximum 5 MB each. First image is the primary image."
          : "Up to 25 PDF files, maximum 15 MB each."}
        {" "}
        Removing a reference does not
        delete its uploaded file from storage.
      </small>
    </div>
  );
}

/* ==========================================
   DYNAMIC TECHNICAL SPECIFICATIONS
========================================== */

function SpecificationsEditor({
  value,
  onChange,
}) {
  const specs = Array.isArray(value) ? value : [];

  function update(index, field, nextValue) {
    onChange(
      specs.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: nextValue,
            }
          : item
      )
    );
  }

  function addSpecification() {
    onChange([
      ...specs,
      {
        name: "",
        value: "",
        unit: "",
      },
    ]);
  }

  function removeSpecification(index) {
    onChange(
      specs.filter(
        (_, itemIndex) => itemIndex !== index
      )
    );
  }

  return (
    <div className="field wide specs-editor">
      <div className="specs-heading">
        <div>
          <label>
            Technical Specifications
          </label>

          <small>
            Add specification name, value and
            optional unit for each row.
          </small>
        </div>

        <button
          type="button"
          className="secondary specs-add"
          onClick={addSpecification}
        >
          <Plus size={16} />

          Add Specification
        </button>
      </div>

      {specs.length === 0 ? (
        <div className="specs-empty">
          No specifications added yet.

          Select <b>Add Specification</b> to begin.
        </div>
      ) : (
        <div className="specs-list">
          {specs.map((spec, index) => (
            <div
              className="specs-row"
              key={index}
            >
              <div className="specs-row-title">
                <strong>
                  Specification {index + 1}
                </strong>

                <button
                  type="button"
                  className="specs-remove"
                  onClick={() =>
                    removeSpecification(index)
                  }
                  aria-label={
                    `Remove specification ${index + 1}`
                  }
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="specs-columns">
                <label>
                  Specification Name

                  <input
                    type="text"
                    maxLength={120}
                    placeholder="e.g. Sweep"
                    value={spec?.name ?? ""}
                    onChange={(event) =>
                      update(
                        index,
                        "name",
                        event.target.value
                      )
                    }
                  />
                </label>

                <label>
                  Value

                  <input
                    type="text"
                    maxLength={250}
                    placeholder="e.g. 1200"
                    value={spec?.value ?? ""}
                    onChange={(event) =>
                      update(
                        index,
                        "value",
                        event.target.value
                      )
                    }
                  />
                </label>

                <label>
                  Unit (Optional)

                  <input
                    type="text"
                    maxLength={40}
                    placeholder="e.g. mm"
                    value={spec?.unit ?? ""}
                    onChange={(event) =>
                      update(
                        index,
                        "unit",
                        event.target.value
                      )
                    }
                  />
                </label>
              </div>
            </div>
          ))}
        </div>
      )}

      <small>
        Example: Sweep = 1200 mm.
        Use verified manufacturer specifications only.
      </small>
    </div>
  );
}

/* ==========================================
   ADD / EDIT RECORD FORM
========================================== */

function Editor({
  token,
  resource,
  initial,
  lookups,
  onClose,
  onSave,
  saving,
  error,
}) {
  const config = resources[resource];

  const [form, setForm] = useState({
    ...initial,
  });

  const [validationError, setValidationError] =
    useState("");

  const isEdit = Boolean(initial._id);

  function setField(key, value) {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  }

  function submit(event) {
    event.preventDefault();

    setValidationError("");

    const data = {};

    for (const key of config.fields) {
      // Existing parent relations cannot be changed.
      if (
        isEdit &&
        ["brandId", "groupId", "productId"].includes(key)
      ) {
        continue;
      }

      if (key === "specifications") {
        const rows = Array.isArray(
          form.specifications
        )
          ? form.specifications
          : [];

        const cleaned = rows.map((item) => ({
          name: String(
            item?.name ?? ""
          ).trim(),

          value: String(
            item?.value ?? ""
          ).trim(),

          unit: String(
            item?.unit ?? ""
          ).trim(),
        }));

        const incomplete = cleaned.some(
          (item) =>
            (item.name && !item.value) ||
            (!item.name && item.value)
        );

        if (incomplete) {
          setValidationError(
            "Every specification requires a name and value."
          );

          return;
        }

        data.specifications = cleaned.filter(
          (item) =>
            item.name &&
            item.value
        );
      } else {
        data[key] = form[key];
      }
    }

    onSave(data);
  }

  function renderField(key) {
    /* IMAGE UPLOAD */
    if (
      key === "logoUrl" ||
      key === "imageUrl"
    ) {
      return (
        <UploadField
          key={key}
          token={token}
          label={pretty(key)}
          kind="image"
          value={form[key] || ""}
          onChange={(value) =>
            setField(key, value)
          }
        />
      );
    }

    /* MULTIPLE MODEL IMAGES */
    if (key === "images") {
      return (
        <MediaCollection
          key={key}
          token={token}
          kind="image"
          title="Model Images"
          value={form.images || []}
          onChange={(value) =>
            setField("images", value)
          }
        />
      );
    }

    /* PDF BROCHURES */
    if (key === "brochureUrls") {
      return (
        <MediaCollection
          key={key}
          token={token}
          kind="document"
          title="Model Brochures (PDF)"
          value={form.brochureUrls || []}
          onChange={(value) =>
            setField("brochureUrls", value)
          }
        />
      );
    }

    /* DYNAMIC SPECIFICATIONS */
    if (key === "specifications") {
      return (
        <SpecificationsEditor
          key={key}
          value={form.specifications || []}
          onChange={(value) => {
            setField(
              "specifications",
              value
            );

            setValidationError("");
          }}
        />
      );
    }

    const value = form[key] ?? "";

    const isParent = [
      "brandId",
      "groupId",
      "productId",
    ].includes(key);

    const disabled =
      isEdit && isParent;

    const mandatory =
      requiredFields[resource].includes(key) &&
      !disabled;

    /* MULTIPLE INDUSTRIES/APPLICATIONS */
    if (multiFields.has(key)) {
      const list =
        lookups[relationFields[key]] || [];

      const canInherit =
        key.includes("Override");

      const inherits =
        form[key] === null ||
        form[key] === undefined;

      return (
        <div className="field" key={key}>
          <label>
            {pretty(key)}
          </label>

          {canInherit && (
            <label className="check-line">
              <input
                type="checkbox"
                checked={inherits}
                onChange={(event) =>
                  setField(
                    key,
                    event.target.checked
                      ? null
                      : []
                  )
                }
              />

              Inherit from Product
            </label>
          )}

          <div className="multi-select">
            {list.length === 0 ? (
              <span className="muted">
                Create {relationFields[key]} first.
              </span>
            ) : (
              list.map((item) => (
                <label
                  key={item._id}
                  className="check-line"
                >
                  <input
                    type="checkbox"
                    disabled={
                      canInherit && inherits
                    }
                    checked={
                      Array.isArray(form[key]) &&
                      form[key].some(
                        (id) =>
                          String(id) ===
                          String(item._id)
                      )
                    }
                    onChange={(event) => {
                      const existing =
                        Array.isArray(form[key])
                          ? form[key]
                          : [];

                      setField(
                        key,
                        event.target.checked
                          ? [...existing, item._id]
                          : existing.filter(
                              (id) =>
                                String(id) !==
                                String(item._id)
                            )
                      );
                    }}
                  />

                  {displayName(item)}

                  <span className="muted">
                    ({item.status})
                  </span>
                </label>
              ))
            )}
          </div>
        </div>
      );
    }

    /* PARENT DROPDOWNS */
    if (key in relationFields) {
      let items =
        lookups[relationFields[key]] || [];

      if (
        key === "groupId" &&
        form.brandId
      ) {
        items = items.filter(
          (item) =>
            String(item.brandId) ===
            String(form.brandId)
        );
      }

      return (
        <div className="field" key={key}>
          <label>
            {pretty(key)}
            {mandatory ? " *" : ""}
          </label>

          <select
            required={mandatory}
            disabled={disabled}
            value={value}
            onChange={(event) => {
              setField(
                key,
                event.target.value
              );

              if (
                key === "brandId" &&
                resource === "products"
              ) {
                setField("groupId", "");
              }
            }}
          >
            <option value="">
              Select {pretty(key)}
            </option>

            {items.map((item) => (
              <option
                key={item._id}
                value={item._id}
              >
                {displayName(item)}
                {" "}
                ({item.status})
              </option>
            ))}
          </select>
        </div>
      );
    }

    /* STATUS */
    if (key === "status") {
      return (
        <div className="field" key={key}>
          <label>Status</label>

          <select
            value={value || "draft"}
            onChange={(event) =>
              setField(
                key,
                event.target.value
              )
            }
          >
            <option value="draft">
              Draft
            </option>

            <option value="published">
              Published
            </option>

            <option value="inactive">
              Inactive
            </option>
          </select>
        </div>
      );
    }

    /* DESCRIPTION */
    if (key === "description") {
      return (
        <div
          className="field wide"
          key={key}
        >
          <label>
            Description
          </label>

          <textarea
            rows={4}
            value={value}
            placeholder="Enter a clear product description..."
            onChange={(event) =>
              setField(
                key,
                event.target.value
              )
            }
          />
        </div>
      );
    }

    /* STANDARD INPUTS */
    return (
      <div className="field" key={key}>
        <label>
          {pretty(key)}
          {mandatory ? " *" : ""}
        </label>

        <input
          required={mandatory}
          disabled={disabled}
          type={
            key === "sortOrder"
              ? "number"
              : key === "website"
              ? "url"
              : "text"
          }
          value={value}
          onChange={(event) => {
            const nextValue =
              key === "sortOrder"
                ? Number(
                    event.target.value
                  )
                : event.target.value;

            setForm((previous) => {
              const next = {
                ...previous,
                [key]: nextValue,
              };

              if (
                !isEdit &&
                (key === "name" ||
                  key === "modelName") &&
                !previous.slug
              ) {
                next.slug = makeSlug(
                  nextValue
                );
              }

              return next;
            });
          }}
        />

        {key === "slug" && (
          <small>
            Lowercase letters, numbers and
            hyphens only.
          </small>
        )}
      </div>
    );
  }

  return (
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        if (
          !saving &&
          event.target ===
            event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={
          `${isEdit ? "Edit" : "Add"} ` +
          config.singular
        }
      >
        {/* MODAL HEADER */}
        <div className="modal-header">
          <div>
            <span className="eyebrow">
              CATALOGUE MANAGEMENT
            </span>

            <h2>
              {isEdit ? "Edit" : "Add"}{" "}
              {config.singular}
            </h2>
          </div>

          <button
            type="button"
            className="icon-button"
            disabled={saving}
            onClick={onClose}
            aria-label="Close editor"
          >
            <X size={21} />
          </button>
        </div>

        {/* MODAL FORM */}
        <form onSubmit={submit}>
          <div className="modal-body">
            {config.fields.map(
              renderField
            )}

            {validationError && (
              <p
                className="alert error wide"
                role="alert"
              >
                {validationError}
              </p>
            )}

            {error && (
              <p
                className="alert error wide"
                role="alert"
              >
                {error}
              </p>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="secondary"
              disabled={saving}
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : isEdit
                ? "Save Changes"
                : "Create Record"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
