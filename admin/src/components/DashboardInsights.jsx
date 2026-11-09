
import React, { useMemo } from "react";
import {
  CheckCircle2,
  Clock3,
  Archive,
  ArrowUpRight,
  Package,
  Tags,
  Boxes,
  FolderTree
} from "lucide-react";

const TITLES = {
  brands: "Brands",
  groups: "Product Groups",
  products: "Products",
  models: "Product Models",
  industries: "Industries",
  applications: "Applications"
};

const getName = (item) =>
  item.name ||
  item.modelName ||
  item.manufacturerModelNumber ||
  "Untitled Record";

export default function DashboardInsights({
  lookups = {},
  counts = {},
  onNavigate
}) {
  const summary = useMemo(() => {
    const records = Object.values(lookups).flat();

    return {
      published: records.filter(
        (r) => r.status === "published"
      ).length,
      draft: records.filter(
        (r) => r.status === "draft"
      ).length,
      inactive: records.filter(
        (r) => r.status === "inactive"
      ).length,
      loaded: records.length
    };
  }, [lookups]);

  const recent = useMemo(() => {
    return Object.entries(lookups)
      .flatMap(([type, records]) =>
        (records || []).map((record) => ({
          ...record,
          type
        }))
      )
      .sort(
        (a, b) =>
          new Date(b.updatedAt || 0) -
          new Date(a.updatedAt || 0)
      )
      .slice(0, 6);
  }, [lookups]);

  const quickActions = [
    {
      type: "brands",
      label: "Manage Brands",
      icon: Tags
    },
    {
      type: "groups",
      label: "Product Groups",
      icon: FolderTree
    },
    {
      type: "products",
      label: "Manage Products",
      icon: Package
    },
    {
      type: "models",
      label: "Product Models",
      icon: Boxes
    }
  ];

  return (
    <div className="ve-dashboard-insights">
      <section className="ve-insight-section">
        <div className="ve-insight-title">
          <div>
            <span className="ve-insight-kicker">
              CATALOGUE HEALTH
            </span>
            <h2>Publication Overview</h2>
            <p>
              Current status of catalogue records loaded
              from your backend.
            </p>
          </div>
        </div>

        <div className="ve-publication-grid">
          <div className="ve-publication-item">
            <CheckCircle2 size={20} />
            <strong>{summary.published}</strong>
            <span>Published</span>
          </div>

          <div className="ve-publication-item">
            <Clock3 size={20} />
            <strong>{summary.draft}</strong>
            <span>Draft</span>
          </div>

          <div className="ve-publication-item">
            <Archive size={20} />
            <strong>{summary.inactive}</strong>
            <span>Inactive</span>
          </div>
        </div>

        <p className="ve-data-note">
          Publication counts cover {summary.loaded} loaded
          records across the six catalogue sections.
          The existing dashboard loads up to 50 records
          per section, so these are not necessarily
          complete database-wide totals.
        </p>
      </section>

      <div className="ve-insights-two-column">
        <section className="ve-insight-section">
          <div className="ve-insight-title">
            <div>
              <span className="ve-insight-kicker">
                RECENT ACTIVITY
              </span>
              <h2>Recently Updated</h2>
            </div>
          </div>

          {recent.length === 0 ? (
            <div className="ve-insight-empty">
              No catalogue records available yet.
            </div>
          ) : (
            <div className="ve-recent-list">
              {recent.map((item) => (
                <button
                  key={`${item.type}-${item._id}`}
                  className="ve-recent-row"
                  type="button"
                  onClick={() => onNavigate(item.type)}
                >
                  <div className="ve-recent-icon">
                    <Package size={18} />
                  </div>

                  <div className="ve-recent-details">
                    <strong>{getName(item)}</strong>
                    <small>
                      {TITLES[item.type]}
                      {" · "}
                      {item.updatedAt
                        ? new Date(
                            item.updatedAt
                          ).toLocaleDateString()
                        : "No update date"}
                    </small>
                  </div>

                  <span
                    className={`status ${
                      item.status || "draft"
                    }`}
                  >
                    {item.status || "draft"}
                  </span>

                  <ArrowUpRight size={15} />
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
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <button
                  key={action.type}
                  type="button"
                  onClick={() =>
                    onNavigate(action.type)
                  }
                >
                  <span className="ve-quick-icon">
                    <Icon size={18} />
                  </span>

                  <span className="ve-quick-text">
                    <strong>{action.label}</strong>
                    <small>
                      {counts[action.type] ?? 0} records
                    </small>
                  </span>

                  <ArrowUpRight size={17} />
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
