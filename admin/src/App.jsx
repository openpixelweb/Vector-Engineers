import React, { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard, Tags, FolderTree, Package, Boxes, Factory, Layers3,
  LogOut, Plus, Search, Pencil, Ban, CheckCircle2, X, RefreshCw,
  ShieldCheck, ChevronRight, UploadCloud, Trash2, FileText, Menu,
  ArrowUpRight, Clock3, Archive, Activity
} from "lucide-react";

const BASE = (import.meta.env.VITE_API_BASE_URL ||
  "https://vector-engineers-backend-476393526056.asia-southeast1.run.app"
).replace(/\/+$/, "");
const LOGO = "/vector-logo.png";

const resources = {
  brands: { title: "Brands", singular: "Brand", icon: Tags,
    fields: ["name", "slug", "description", "logoUrl", "website", "sortOrder", "status"] },
  groups: { title: "Product Groups", singular: "Product Group", icon: FolderTree,
    fields: ["brandId", "name", "slug", "description", "imageUrl", "sortOrder", "status"] },
  products: { title: "Products", singular: "Product", icon: Package,
    fields: ["brandId", "groupId", "name", "slug", "description", "imageUrl", "industryIds", "applicationIds", "sortOrder", "status"] },
  models: { title: "Product Models", singular: "Product Model", icon: Boxes,
    fields: ["productId", "modelName", "manufacturerModelNumber", "slug", "description", "images", "specifications", "brochureUrls", "industryOverrideIds", "applicationOverrideIds", "status"] },
  industries: { title: "Industries", singular: "Industry", icon: Factory,
    fields: ["name", "slug", "description", "imageUrl", "sortOrder", "status"] },
  applications: { title: "Applications", singular: "Application", icon: Layers3,
    fields: ["name", "slug", "description", "imageUrl", "sortOrder", "status"] }
};
const resourceKeys = Object.keys(resources);
const multiFields = new Set(["industryIds", "applicationIds", "industryOverrideIds", "applicationOverrideIds"]);
const relationFields = {
  brandId: "brands", groupId: "groups", productId: "products",
  industryIds: "industries", applicationIds: "applications",
  industryOverrideIds: "industries", applicationOverrideIds: "applications"
};
const requiredFields = {
  brands: ["name"], groups: ["brandId", "name"],
  products: ["brandId", "groupId", "name"],
  models: ["productId", "modelName", "manufacturerModelNumber"],
  industries: ["name"], applications: ["name"]
};
const fieldLabels = {
  brandId: "Brand", groupId: "Product Group", productId: "Product",
  modelName: "Model Name", manufacturerModelNumber: "Manufacturer Model Number",
  logoUrl: "Brand Logo", imageUrl: "Image", industryIds: "Industries",
  applicationIds: "Applications", industryOverrideIds: "Industry Override",
  applicationOverrideIds: "Application Override", brochureUrls: "Brochures"
};
function pretty(key) { return fieldLabels[key] || key.replace(/([A-Z])/g, " $1").replace(/^./, c => c.toUpperCase()); }
function displayName(item) { return item?.name || item?.modelName || item?.manufacturerModelNumber || item?.slug || "Unnamed record"; }
function makeSlug(value) { return String(value || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
function newRecord(section) {
  return Object.fromEntries(resources[section].fields.map(key => {
    if (key === "status") return [key, "draft"];
    if (multiFields.has(key)) return [key, key.includes("Override") ? null : []];
    if (["images", "specifications", "brochureUrls"].includes(key)) return [key, []];
    if (key === "sortOrder") return [key, undefined];
    return [key, ""];
  }));
}
function nameOf(list, id) {
  const item = (list || []).find(row => String(row._id) === String(id));
  return item ? displayName(item) : String(id || "—").slice(0, 8);
}
function fullMediaUrl(url) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  return `${BASE}${url.startsWith("/") ? "" : "/"}${url}`;
}
async function api(path, token, options = {}) {
  const response = await fetch(`${BASE}/api/v1${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || result.success === false) {
    throw new Error(result.message || `Request failed (${response.status})`);
  }
  return result;
}

function CompanyLogo({ className = "" }) {
  const [failed, setFailed] = useState(false);
  return <div className={`ve-company-logo ${className}`}>
    {failed ? <div className="ve-logo-fallback"><strong>VECTOR</strong><small>ENGINEERS</small></div>
      : <img src={LOGO} alt="Vector Engineers" onError={() => setFailed(true)} />}
  </div>;
}

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function submit(event) {
    event.preventDefault(); setLoading(true); setError("");
    try {
      const result = await api("/admin/login", null, {
        method: "POST", body: JSON.stringify({ email: email.trim(), password })
      });
      if (result.admin?.role !== "super_admin") throw new Error("Super Admin permissions are required.");
      onLogin(result.accessToken, result.admin); setPassword("");
    } catch (e) { setError(e.message); } finally { setLoading(false); }
  }
  return <div className="login-shell">
    <div className="login-aside">
      <CompanyLogo className="ve-login-logo" />
      <h1>Vector Engineers</h1><p>CATALOGUE MANAGEMENT PORTAL</p>
      <div className="login-copy">Manage manufacturer brands, product groups, individual models, specifications and applications from one secure workspace.</div>
    </div>
    <div className="login-main">
      <form className="login-card" onSubmit={submit}>
        <span className="eyebrow">SECURE ADMIN ACCESS</span><h2>Welcome back</h2>
        <p>Sign in to manage the Vector Engineers product catalogue.</p>
        <label>Email Address<input type="email" required autoComplete="username" placeholder="Enter admin email"
          value={email} onChange={e => setEmail(e.target.value)} /></label>
        <label>Password<input type="password" required autoComplete="current-password" placeholder="Enter password"
          value={password} onChange={e => setPassword(e.target.value)} /></label>
        {error && <p className="alert error" role="alert">{error}</p>}
        <button type="submit" className="primary full" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}<ChevronRight size={17} />
        </button>
        <div className="login-note"><ShieldCheck size={15}/><span>Authorized administrator access only. Session ends when the page reloads.</span></div>
      </form>
    </div>
  </div>;
}

function DashboardOverview({ counts, lookups, onNavigate, loading }) {
  const summary = useMemo(() => {
    const rows = Object.values(lookups).flat();
    return { published: rows.filter(r => r.status === "published").length,
      draft: rows.filter(r => r.status === "draft").length,
      inactive: rows.filter(r => r.status === "inactive").length };
  }, [lookups]);
  const recent = useMemo(() => Object.entries(lookups)
    .flatMap(([resourceType, items]) => (items || []).map(item => ({ ...item, resourceType })))
    .filter(item => item.updatedAt)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 6), [lookups]);
  return <div className="ve-dashboard-overview">
    <div className="stats">{resourceKeys.map(key => {
      const Icon = resources[key].icon;
      return <button type="button" className="stat-card" key={key} onClick={() => onNavigate(key)}>
        <Icon size={24}/><strong>{counts[key] ?? "—"}</strong><span>{resources[key].title}</span>
        <ChevronRight size={16} className="stat-chevron"/>
      </button>;
    })}</div>
    <div className="ve-dashboard-insights">
      <section className="ve-insight-section">
        <div className="ve-insight-title"><div><span className="ve-insight-kicker">CATALOGUE HEALTH</span>
          <h2>Publication Overview</h2><p>Status of records currently loaded from your catalogue API.</p></div></div>
        <div className="ve-publication-grid">
          {[["Published", CheckCircle2, "published"], ["Draft", Clock3, "draft"], ["Inactive", Archive, "inactive"]].map(([title, Icon, key]) =>
            <div className="ve-publication-item" key={key}><Icon size={20}/><strong>{loading ? "—" : summary[key]}</strong><span>{title}</span></div>)}
        </div>
        <p className="ve-data-note">These publication summaries reflect records currently loaded into the dashboard. Full totals come from the catalogue API.</p>
      </section>
      <div className="ve-insights-two-column">
        <section className="ve-insight-section"><div className="ve-insight-title"><div>
          <span className="ve-insight-kicker">CATALOGUE UPDATES</span><h2>Recently Updated</h2></div></div>
          {recent.length === 0 ? <div className="ve-insight-empty">No recent catalogue updates available.</div> :
            <div className="ve-recent-list">{recent.map(item =>
              <button type="button" className="ve-recent-row" key={`${item.resourceType}-${item._id}`}
                onClick={() => onNavigate(item.resourceType)}>
                <div className="ve-recent-icon"><Package size={18}/></div>
                <div className="ve-recent-details"><strong>{displayName(item)}</strong>
                  <small>{resources[item.resourceType]?.title} · {new Date(item.updatedAt).toLocaleDateString()}</small></div>
                <span className={`status ${item.status || "draft"}`}>{item.status || "draft"}</span><ArrowUpRight size={16}/>
              </button>)}</div>}
        </section>
        <section className="ve-insight-section"><div className="ve-insight-title"><div>
          <span className="ve-insight-kicker">QUICK ACCESS</span><h2>Catalogue Management</h2></div></div>
          <div className="ve-quick-actions">{["brands", "groups", "products", "models"].map(key => {
            const Icon = resources[key].icon;
            return <button type="button" key={key} onClick={() => onNavigate(key)}>
              <span className="ve-quick-icon"><Icon size={18}/></span>
              <span className="ve-quick-text"><strong>Manage {resources[key].title}</strong><small>{counts[key] ?? 0} records</small></span>
              <ArrowUpRight size={17}/>
            </button>;
          })}</div>
        </section>
      </div>
      <section className="info-panel" style={{ marginTop: 24 }}>
        <div className="ve-info-heading"><Activity size={20}/><h2>Catalogue Workflow</h2></div>
        <p>Create a Brand, then a Product Group, followed by Products and their individual Models. Add model images, specifications and brochures before publishing.</p>
        <p>Assign Industries and Applications to Products. Models can inherit their mappings or use their own overrides.</p>
        <button type="button" className="primary" onClick={() => onNavigate("brands")}>Manage Brands<ChevronRight size={16}/></button>
      </section>
    </div>
  </div>;
}

function App() {
  const [token, setToken] = useState("");
  const [admin, setAdmin] = useState(null);
  const [section, setSection] = useState("overview");
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
  const [page, setPage] = useState(1);
  const [listRows, setListRows] = useState([]);
  const [listTotal, setListTotal] = useState(0);
  const current = resources[section];
  const PAGE_SIZE = 25;

  function logout() {
    setToken(""); setAdmin(null); setLookups({}); setCounts({});
    setListRows([]); setEditing(null); setSection("overview"); setSidebarOpen(false);
  }
  async function loadAll() {
    if (!token) return;
    setLoading(true); setError("");
    try {
      const results = await Promise.all(resourceKeys.map(key => api(`/admin/catalog/${key}?limit=50`, token)));
      const nextLookups = {}; const nextCounts = {};
      results.forEach((result, index) => {
        const key = resourceKeys[index];
        nextLookups[key] = result.data || [];
        nextCounts[key] = result.pagination?.total ?? result.data?.length ?? 0;
      });
      setLookups(nextLookups); setCounts(nextCounts);
    } catch (e) {
      if (/token|auth|unauthor|expired/i.test(e.message)) logout();
      setError(e.message);
    } finally { setLoading(false); }
  }
  async function loadPage(resource, number) {
    if (!token || resource === "overview") return;
    try {
      const result = await api(`/admin/catalog/${resource}?page=${number}&limit=${PAGE_SIZE}`, token);
      setListRows(result.data || []);
      setListTotal(result.pagination?.total ?? (result.data || []).length);
    } catch (e) { setError(e.message); }
  }
  useEffect(() => { if (token) loadAll(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [token]);
  useEffect(() => { if (token && section !== "overview") loadPage(section, page); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [token, section, page]);
  function navigateTo(next) {
    setSection(next); setPage(1); setSearch(""); setFilter("all");
    setEditing(null); setError(""); setMessage(""); setSidebarOpen(false);
  }
  async function reloadSection() {
    await loadAll();
    if (section !== "overview") await loadPage(section, page);
  }
  async function save(data) {
    setSaving(true); setError(""); setMessage("");
    try {
      const isEdit = Boolean(editing?._id);
      const path = `/admin/catalog/${section}` + (isEdit ? `/${editing._id}` : "");
      const body = { ...data };
      if (!isEdit) {
        for (const field of resources[section].fields) {
          if (!requiredFields[section].includes(field) && body[field] === "") delete body[field];
        }
      }
      await api(path, token, { method: isEdit ? "PATCH" : "POST", body: JSON.stringify(body) });
      setEditing(null);
      setMessage(`${resources[section].singular} ${isEdit ? "updated" : "created"} successfully.`);
      await loadAll();
      await loadPage(section, isEdit ? page : 1);
      if (!isEdit) setPage(1);
    } catch (e) { setError(e.message); } finally { setSaving(false); }
  }
  async function changeStatus(record, status) {
    if (!window.confirm(`Set "${displayName(record)}" to ${status}?`)) return;
    setError(""); setMessage("");
    try {
      await api(`/admin/catalog/${section}/${record._id}`, token,
        { method: "PATCH", body: JSON.stringify({ status }) });
      setMessage(`Record status changed to ${status}.`);
      await reloadSection();
    } catch (e) { setError(e.message); }
  }
  async function deleteRecord(record) {
    const name = displayName(record);
    if (!window.confirm(`Permanently delete "${name}"?\n\nThis cannot be undone. Linked records must be deleted first.`)) return;
    // A second confirmation protects real client content from accidental deletion.
    if (window.prompt(`Type DELETE to permanently remove "${name}":`) !== "DELETE") return;
    setError(""); setMessage("");
    try {
      await api(`/admin/catalog/${section}/${record._id}`, token, { method: "DELETE" });
      setMessage(`"${name}" permanently deleted.`);
      await loadAll();
      if (listRows.length === 1 && page > 1) setPage(page - 1);
      else await loadPage(section, page);
    } catch (e) { setError(e.message); }
  }
  const filtered = useMemo(() => listRows.filter(record => {
    const validStatus = filter === "all" || record.status === filter;
    const text = [displayName(record), record.description || "", record.manufacturerModelNumber || ""].join(" ").toLowerCase();
    return validStatus && text.includes(search.trim().toLowerCase());
  }), [listRows, filter, search]);

  if (!token) return <Login onLogin={(newToken, newAdmin) => { setToken(newToken); setAdmin(newAdmin); }}/>
  return <div className="shell">
    {sidebarOpen && <button type="button" className="ve-sidebar-overlay" aria-label="Close navigation" onClick={() => setSidebarOpen(false)}/>}
    <aside className={`sidebar ve-admin-sidebar ${sidebarOpen ? "is-open" : ""}`}>
      <div className="sidebar-brand"><CompanyLogo className="ve-sidebar-logo"/><span className="ve-sidebar-caption">CATALOGUE MANAGEMENT</span></div>
      <div className="menu-caption">WORKSPACE</div>
      <button type="button" className={`nav-item ${section === "overview" ? "active" : ""}`} onClick={() => navigateTo("overview")}>
        <LayoutDashboard size={18}/> Overview
      </button>
      <div className="menu-caption">PRODUCT CATALOGUE</div>
      {resourceKeys.map(key => { const Icon = resources[key].icon; return <button key={key} type="button"
        className={`nav-item ${section === key ? "active" : ""}`} onClick={() => navigateTo(key)}>
        <Icon size={18}/>{resources[key].title}<span className="nav-count">{counts[key] ?? "—"}</span>
      </button>; })}
      <div className="sidebar-bottom"><div className="signed-in">
        <span className="avatar">{(admin?.displayName || "A").charAt(0).toUpperCase()}</span>
        <div><b>{admin?.displayName || "Administrator"}</b><small>Super Admin</small></div>
      </div>
      <button className="nav-item" type="button" onClick={logout}><LogOut size={18}/> Sign Out</button></div>
    </aside>
    <main className="main">
      <header className="topbar ve-admin-topbar"><div className="ve-topbar-left">
        <div className="ve-topbar-breadcrumb">
          <button type="button" className="ve-mobile-menu" onClick={() => setSidebarOpen(v => !v)}
            aria-label="Toggle navigation" aria-expanded={sidebarOpen}><Menu size={21}/></button>
          <span>Workspace</span><ChevronRight size={14}/><strong>{current?.title || "Dashboard Overview"}</strong>
        </div><span className="ve-topbar-subtitle">Product Catalogue Management System</span>
      </div><div className="ve-topbar-right"><span className="ve-admin-system-status"><span className="online-dot"/>Admin Workspace</span>
        <button type="button" className="ve-topbar-refresh" onClick={reloadSection} disabled={loading} title="Refresh catalogue data"><RefreshCw size={16}/></button>
        <div className="ve-topbar-profile"><span className="ve-profile-avatar">{(admin?.displayName || "A").charAt(0).toUpperCase()}</span>
          <div><strong>{admin?.displayName || "Administrator"}</strong><small>Super Admin</small></div></div>
      </div></header>
      <div className="content">
        <div className="heading-row"><div><span className="eyebrow">VECTOR ENGINEERS / ADMIN</span>
          <h1>{current?.title || "Catalogue Overview"}</h1>
          <p>{current ? `Manage ${current.title.toLowerCase()}, records and publication status.` : "Monitor and manage your complete electrical products catalogue."}</p>
        </div><div className="heading-actions">
          <button type="button" className="secondary" onClick={reloadSection} disabled={loading}><RefreshCw size={16}/>Refresh</button>
          {current && <button type="button" className="primary" onClick={() => { setEditing(newRecord(section)); setError(""); }}>
            <Plus size={17}/>Add {current.singular}</button>}
        </div></div>
        {error && <p className="alert error" role="alert">{error}</p>}
        {message && <p className="alert success" role="status">{message}</p>}
        {section === "overview" ? <DashboardOverview counts={counts} lookups={lookups} loading={loading} onNavigate={navigateTo}/> :
          <div className="table-panel">
            <div className="toolbar"><div className="search"><Search size={17}/>
              <input type="search" value={search} placeholder={`Search current page of ${current.title.toLowerCase()}...`}
                onChange={e => setSearch(e.target.value)}/></div>
              <select value={filter} onChange={e => setFilter(e.target.value)} aria-label="Filter by status">
                <option value="all">All Statuses</option><option value="draft">Draft</option>
                <option value="published">Published</option><option value="inactive">Inactive</option>
              </select></div>
            <div className="table-wrap"><table><thead><tr><th>Name</th><th>Parent / Reference</th><th>Status</th><th>Updated</th><th>Actions</th></tr></thead>
              <tbody>{filtered.map(record => <tr key={record._id}>
                <td><strong>{displayName(record)}</strong>
                  {section === "models" && <small>{record.manufacturerModelNumber}</small>}</td>
                <td>{record.brandId ? nameOf(lookups.brands, record.brandId)
                  : record.groupId ? nameOf(lookups.groups, record.groupId)
                  : record.productId ? nameOf(lookups.products, record.productId) : "—"}</td>
                <td><span className={`status ${record.status}`}>{record.status}</span></td>
                <td>{record.updatedAt ? new Date(record.updatedAt).toLocaleDateString() : "—"}</td>
                <td><div className="actions">
                  <button type="button" title="Edit Record" aria-label={`Edit ${displayName(record)}`}
                    onClick={() => { setEditing(record); setError(""); }}><Pencil size={16}/></button>
                  {record.status !== "published" && <button type="button" title="Publish"
                    onClick={() => changeStatus(record, "published")}><CheckCircle2 size={16}/></button>}
                  {record.status !== "inactive" && <button type="button" title="Deactivate"
                    onClick={() => changeStatus(record, "inactive")}><Ban size={16}/></button>}
                  <button type="button" title="Delete Permanently" aria-label={`Delete ${displayName(record)}`}
                    className="ve-delete-action" onClick={() => deleteRecord(record)}><Trash2 size={16}/></button>
                </div></td>
              </tr>)}
              {filtered.length === 0 && <tr><td className="empty" colSpan={5}>
                {loading ? "Loading catalogue records..." : "No matching records on this page."}
              </td></tr>}</tbody></table></div>
            <div className="table-foot">Showing {filtered.length} of {listTotal} records.
              <span>Page {page} of {Math.max(1, Math.ceil(listTotal / PAGE_SIZE))}. Search and status filters apply to this page.</span>
              <div style={{ display: "inline-flex", gap: 8, marginLeft: 12 }}>
                <button type="button" className="secondary" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Previous</button>
                <button type="button" className="secondary" disabled={page * PAGE_SIZE >= listTotal} onClick={() => setPage(p => p + 1)}>Next</button>
              </div>
            </div>
          </div>}
      </div>
    </main>
    {editing && current && <Editor key={`${section}-${editing._id || "new"}`} token={token}
      resource={section} initial={editing} lookups={lookups} saving={saving} error={error}
      onClose={() => { if (!saving) setEditing(null); }} onSave={save}/>}
  </div>;
}

async function uploadMedia(file, kind, token) {
  const payload = new FormData(); payload.append("file", file);
  const response = await fetch(`${BASE}/api/v1/admin/media?kind=${kind}`, {
    method: "POST", headers: { Authorization: `Bearer ${token}` }, body: payload
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result.success) throw new Error(result.message || `Upload failed (${response.status})`);
  return result.data.url;
}
function validateUpload(file, kind) {
  const types = kind === "image" ? ["image/png", "image/jpeg", "image/webp"] : ["application/pdf"];
  if (!types.includes(file.type)) throw new Error(kind === "image" ? "Only JPG, PNG and WebP images are allowed." : "Only PDF documents are allowed.");
  const max = kind === "image" ? 5 : 15;
  if (file.size > max * 1024 * 1024) throw new Error(`File must not exceed ${max} MB.`);
}
function UploadField({ token, label, value, onChange }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function upload(event) {
    const file = event.target.files?.[0]; if (!file) return;
    setBusy(true); setError("");
    try { validateUpload(file, "image"); onChange(await uploadMedia(file, "image", token)); }
    catch (e) { setError(e.message); }
    finally { setBusy(false); event.target.value = ""; }
  }
  return <div className="field wide media-field">
    <label>{label}</label>
    <div className="ve-simple-upload"><UploadCloud size={26}/>
      <strong>{value ? "Replace existing image" : "Select an image from your computer"}</strong>
      <small>JPG, PNG or WebP — Maximum 5 MB</small>
      <label className="media-upload"><UploadCloud size={16}/>{busy ? "Uploading..." : value ? "Replace Image" : "Choose Image"}
        <input type="file" disabled={busy} accept="image/jpeg,image/png,image/webp" onChange={upload}/>
      </label>
    </div>
    {value && <div className="media-preview">
      <img src={fullMediaUrl(value)} alt={label}/>
      <button type="button" className="secondary" disabled={busy} onClick={() => onChange("")}>
        <Trash2 size={15}/>Remove Image Reference</button>
    </div>}
    {error && <span className="invalid" role="alert">{error}</span>}
    <small>Upload the image, then click Save Changes or Create Record. Removing a reference does not delete the stored file.</small>
  </div>;
}
function MediaCollection({ token, kind, title, value, onChange }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const items = Array.isArray(value) ? value : [];
  async function upload(event) {
    const file = event.target.files?.[0]; if (!file) return;
    setBusy(true); setError("");
    try {
      validateUpload(file, kind);
      if (items.length >= 25) throw new Error("Maximum 25 files permitted.");
      const url = await uploadMedia(file, kind, token);
      onChange([...items, kind === "image" ? { url, alt: file.name.replace(/\.[^.]+$/, ""), sortOrder: items.length } : url]);
    } catch (e) { setError(e.message); }
    finally { setBusy(false); event.target.value = ""; }
  }
  return <div className="field wide"><label>{title}</label>
    <label className="media-upload media-upload-wide"><UploadCloud size={17}/>
      {busy ? "Uploading..." : kind === "image" ? "Upload Model Image" : "Upload PDF Brochure"}
      <input type="file" disabled={busy || items.length >= 25}
        accept={kind === "image" ? "image/jpeg,image/png,image/webp" : "application/pdf"} onChange={upload}/>
    </label>
    {error && <span className="invalid">{error}</span>}
    <div className="media-gallery">{items.map((item, index) => {
      const url = kind === "image" ? item.url : item;
      return <div className="media-tile" key={`${url}-${index}`}>
        {kind === "image" ? <img src={fullMediaUrl(url)} alt={item.alt || "Product Model"}/> : <FileText size={30}/>}
        <a href={fullMediaUrl(url)} target="_blank" rel="noopener noreferrer">{kind === "image" ? `Image ${index + 1}` : `PDF ${index + 1}`}</a>
        <button type="button" className="media-remove" title="Remove Reference" onClick={() => onChange(items.filter((_, i) => i !== index))}>
          <Trash2 size={15}/></button>
      </div>;
    })}</div>
    <small>{kind === "image" ? "Up to 25 images, 5 MB each. First image is primary." : "Up to 25 PDF files, 15 MB each."} Removing references does not delete files from storage.</small>
  </div>;
}
function SpecificationsEditor({ value, onChange }) {
  const specs = Array.isArray(value) ? value : [];
  function update(index, key, next) { onChange(specs.map((spec, i) => i === index ? { ...spec, [key]: next } : spec)); }
  return <div className="field wide specs-editor">
    <div className="specs-heading"><div><label>Technical Specifications</label>
      <small>Add specification name, value and optional unit for each row.</small></div>
      <button type="button" className="secondary specs-add" onClick={() => onChange([...specs, { name: "", value: "", unit: "" }])}>
        <Plus size={16}/>Add Specification</button>
    </div>
    {specs.length === 0 ? <div className="specs-empty">No specifications added. Select <b>Add Specification</b> to begin.</div> :
      <div className="specs-list">{specs.map((spec, index) => <div className="specs-row" key={index}>
        <div className="specs-row-title"><strong>Specification {index + 1}</strong>
          <button type="button" className="specs-remove" aria-label={`Remove specification ${index + 1}`}
            onClick={() => onChange(specs.filter((_, i) => i !== index))}><Trash2 size={16}/></button>
        </div>
        <div className="specs-columns">
          <label>Specification Name<input type="text" maxLength={120} value={spec?.name ?? ""}
            placeholder="e.g. Sweep" onChange={e => update(index, "name", e.target.value)}/></label>
          <label>Value<input type="text" maxLength={250} value={spec?.value ?? ""}
            placeholder="e.g. 1200" onChange={e => update(index, "value", e.target.value)}/></label>
          <label>Unit (Optional)<input type="text" maxLength={40} value={spec?.unit ?? ""}
            placeholder="e.g. mm" onChange={e => update(index, "unit", e.target.value)}/></label>
        </div>
      </div>)}</div>}
    <small>Example: Sweep = 1200 mm. Use verified manufacturer specifications only.</small>
  </div>;
}

function Editor({ token, resource, initial, lookups, onClose, onSave, saving, error }) {
  const config = resources[resource];
  const [form, setForm] = useState({ ...initial });
  const [validationError, setValidationError] = useState("");
  const isEdit = Boolean(initial._id);
  function setField(key, value) { setForm(previous => ({ ...previous, [key]: value })); }
  function submit(event) {
    event.preventDefault(); setValidationError("");
    const data = {};
    // The backend creates a slug on new records; preserve the original on edit.
    // For compatibility with older deployed APIs, explicitly send generated slug on create.
    if (!isEdit) {
      data.slug = makeSlug(form.name || form.modelName || "");
      if (!data.slug) { setValidationError("Please enter a name using letters or numbers."); return; }
    }
    for (const key of config.fields) {
      if (key === "slug" || key === "sortOrder") continue;
      if (isEdit && ["brandId", "groupId", "productId"].includes(key)) continue;
      if (key === "specifications") {
        const cleaned = (Array.isArray(form.specifications) ? form.specifications : []).map(spec => ({
          name: String(spec?.name ?? "").trim(), value: String(spec?.value ?? "").trim(), unit: String(spec?.unit ?? "").trim()
        }));
        if (cleaned.some(spec => (spec.name && !spec.value) || (!spec.name && spec.value))) {
          setValidationError("Every specification needs both a name and value."); return;
        }
        data.specifications = cleaned.filter(spec => spec.name && spec.value);
      } else {
        data[key] = form[key];
      }
    }
    onSave(data);
  }
  function renderField(key) {
    if (key === "slug" || key === "sortOrder") return null;
    if (key === "logoUrl" || key === "imageUrl") return <UploadField key={key} token={token}
      label={pretty(key)} value={form[key] || ""} onChange={v => setField(key, v)}/>;
    if (key === "images") return <MediaCollection key={key} token={token} kind="image"
      title="Model Images" value={form.images || []} onChange={v => setField("images", v)}/>;
    if (key === "brochureUrls") return <MediaCollection key={key} token={token} kind="document"
      title="Model Brochures (PDF)" value={form.brochureUrls || []} onChange={v => setField("brochureUrls", v)}/>;
    if (key === "specifications") return <SpecificationsEditor key={key}
      value={form.specifications || []} onChange={v => setField("specifications", v)}/>;
    const value = form[key] ?? "";
    const isParent = ["brandId", "groupId", "productId"].includes(key);
    const disabled = isEdit && isParent;
    const mandatory = requiredFields[resource].includes(key) && !disabled;
    if (multiFields.has(key)) {
      const list = lookups[relationFields[key]] || [];
      const canInherit = key.includes("Override");
      const inherits = form[key] == null;
      return <div className="field" key={key}>
        <label>{pretty(key)}</label>
        {canInherit && <label className="check-line"><input type="checkbox" checked={inherits}
          onChange={e => setField(key, e.target.checked ? null : [])}/>Inherit from Product</label>}
        <div className="multi-select">
          {list.length === 0 ? <span className="muted">Create {relationFields[key]} first.</span> : list.map(item =>
            <label className="check-line" key={item._id}><input type="checkbox" disabled={canInherit && inherits}
              checked={Array.isArray(form[key]) && form[key].some(id => String(id) === String(item._id))}
              onChange={e => { const existing = Array.isArray(form[key]) ? form[key] : [];
                setField(key, e.target.checked ? [...existing, item._id] : existing.filter(id => String(id) !== String(item._id))); }}/>
              {displayName(item)} <span className="muted">({item.status})</span>
            </label>)}
        </div>
      </div>;
    }
    if (key in relationFields) {
      let items = lookups[relationFields[key]] || [];
      if (key === "groupId" && form.brandId) items = items.filter(item => String(item.brandId) === String(form.brandId));
      return <div className="field" key={key}><label>{pretty(key)}{mandatory ? " *" : ""}</label>
        <select required={mandatory} disabled={disabled} value={value}
          onChange={e => setForm(previous => ({ ...previous, [key]: e.target.value,
            ...(key === "brandId" && resource === "products" ? { groupId: "" } : {}) }))}>
          <option value="">Select {pretty(key)}</option>
          {items.map(item => <option key={item._id} value={item._id}>{displayName(item)} ({item.status})</option>)}
        </select></div>;
    }
    if (key === "status") return <div className="field" key={key}><label>Publication Status</label>
      <select value={value || "draft"} onChange={e => setField(key, e.target.value)}>
        <option value="draft">Draft</option><option value="published">Published</option><option value="inactive">Inactive</option>
      </select></div>;
    if (key === "description") return <div className="field wide" key={key}>
      <label>Description</label><textarea rows={4} value={value} placeholder="Enter a clear description..."
        onChange={e => setField(key, e.target.value)}/></div>;
    return <div className="field" key={key}><label>{pretty(key)}{mandatory ? " *" : ""}</label>
      <input required={mandatory} disabled={disabled} type={key === "website" ? "url" : "text"} value={value}
        onChange={e => setField(key, e.target.value)} /></div>;
  }
  return <div className="modal-overlay" onMouseDown={e => { if (!saving && e.target === e.currentTarget) onClose(); }}>
    <div className="modal" role="dialog" aria-modal="true" aria-label={`${isEdit ? "Edit" : "Add"} ${config.singular}`}>
      <div className="modal-header"><div><span className="eyebrow">CATALOGUE MANAGEMENT</span>
        <h2>{isEdit ? "Edit" : "Add"} {config.singular}</h2></div>
        <button type="button" className="icon-button" disabled={saving} onClick={onClose} aria-label="Close editor"><X size={21}/></button>
      </div>
      <form onSubmit={submit}><div className="modal-body">{config.fields.map(renderField)}
        {validationError && <p className="alert error wide" role="alert">{validationError}</p>}
        {error && <p className="alert error wide" role="alert">{error}</p>}
      </div><div className="modal-footer"><button type="button" className="secondary" disabled={saving} onClick={onClose}>Cancel</button>
        <button type="submit" className="primary" disabled={saving}>{saving ? "Saving..." : isEdit ? "Save Changes" : "Create Record"}</button>
      </div></form>
    </div>
  </div>;
}

export default App;
