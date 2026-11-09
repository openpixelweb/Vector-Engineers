# Vector Engineers Catalogue - Agreed architecture (2026-11-04)

## Scope
First release: brands, brand product groups, products, models, industries, applications, documents, images, enquiries, and secure catalogue administration. Not in Phase 1: shopping cart, checkout, product prices, client-logo CMS, public website redesign, or generic pages CMS.

## Taxonomy
Brand -> Brand Product Group -> Product Type -> Product Model.
Example (illustrative): V-Guard -> Fans -> Ceiling Fans -> manufacturer model X.

### Entities
- Brand: name, slug, logo, website, description, publication status.
- BrandProductGroup: brandId, name, slug, image, sortOrder, status.
- ProductType: brandId, groupId, name, slug, image, description, industryIds[], applicationIds[], status.
- ProductModel: productTypeId, modelName, manufacturerModelNumber, slug, images[], description, specs[{name,value,unit}], brochureIds[], industryOverrideIds[] or null, applicationOverrideIds[] or null, status.
- Industry: name, slug, image, description, status (initial six).
- Application: name, slug, description, status (initial eight).
- Document: title, kind, storage key, mimeType, relation ids, status.
- Enquiry: visitor name, phone/email, message, referenced model or product, createdAt, status.
- AdminUser: email, passwordHash, role, status, timestamps.

## Mapping rules
Industry and application assignments default to the product type. A model optionally overrides (replaces, not adds to) the type-level assignment. `null` means inherit; `[]` means intentionally no mappings. Show a product in an industry if at least one published model is effectively mapped to that industry; deduplicate product types within results. If no models exist yet, policy to be confirmed before publishing; recommended not to publish empty product types.

## Publication rules
Only `published` entities appear publicly; unpublished or inactive ancestors exclude descendants. All write endpoints require authenticated authorized admin. Images and brochures must be approved for public release.

## Public routes (planned; not implemented Phase 1)
GET /api/v1/brands
GET /api/v1/brands/:slug/groups
GET /api/v1/products?brand=&group=&industry=&application=&q=&page=&limit=
GET /api/v1/products/:slug
GET /api/v1/models/:id-or-slug
GET /api/v1/industries
GET /api/v1/industries/:slug/products
GET /api/v1/applications
POST /api/v1/enquiries (validated, rate-limited)

## Admin routes (planned; not implemented Phase 1)
POST /api/v1/admin/auth/login
CRUD /api/v1/admin/brands
CRUD /api/v1/admin/groups
CRUD /api/v1/admin/products
CRUD /api/v1/admin/models
CRUD /api/v1/admin/industries
CRUD /api/v1/admin/applications
CRUD /api/v1/admin/documents
GET /api/v1/admin/enquiries

## Delivery sequence
1. Bootstrap API and verify health locally.
2. Configure MongoDB, define schemas and indexes, seed the client's approved brand list.
3. Build admin authentication and protect all writing operations before exposing CRUD.
4. Implement brands/groups/products/models CRUD, validation and publishing.
5. Implement industry/application mapping and query endpoints.
6. Implement secure uploads for images and brochures.
7. Build catalogue admin UI and integrate React public pages without redesign.
8. Implement enquiries, testing, backups and deployment.

## Safety and migrations
Never commit .env or passwords, do not publicly expose MongoDB, do not trust browser-side roles, validate uploads and request bodies, create backups before migrations, and keep data removal as soft deletion for business records.
