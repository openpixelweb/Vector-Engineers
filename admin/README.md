# Vector Engineers Admin Dashboard — Phase 5 starter

This **separate frontend** connects to your existing Phase 4 Node/Express/Mongoose backend; it does not modify your public React site. It includes login, a catalogue overview, and CRUD forms for brands, groups, products, models, industries and applications. Forms use the already implemented protected `/api/v1/admin/catalog` endpoints.

## Before running

1. **Back up** your project. Keep the existing backend and public frontend intact.
2. Extract this folder alongside `frontend` and `backend` and rename it `admin`:
   ```text
   vector-engineers/
     frontend/
     backend/
     admin/
   ```
3. In `backend/.env`, change only the CORS value to include the dashboard development origin:
   ```dotenv
   CLIENT_ORIGIN=http://localhost:3000,http://localhost:8080,http://127.0.0.1:5174
   ```
   You can also add `http://localhost:5174` if you use that address. **Keep your existing `MONGODB_URI` and `JWT_SECRET` unchanged.**
4. Restart backend from its folder: `npm run dev`. Verify `http://localhost:5000/api/v1/health`.
5. Open a SECOND VS Code terminal and run:
   ```powershell
   cd C:\Users\phani\Downloads\vector-engineers\admin
   Copy-Item .env.example .env
   npm install
   npm run dev
   ```
6. Open `http://127.0.0.1:5174` and sign in with your existing Super Admin account. Do **not** use the previously disclosed test password for production.

## Supported actions

- Login through `/api/v1/admin/login` and check Super Admin role.
- Overview counts based on protected list APIs.
- Add, edit, publish and deactivate (soft delete) each resource.
- Linked dropdowns: Brands → Groups → Products → Models.
- Product industry and application checkboxes.
- Model-level industry/application override or inherit.
- Enter model images, PDFs and specifications as JSON arrays (actual image/PDF **uploads are not implemented yet**).

## Limitations to understand

- The page loads the **first 50 records per collection**. This is an initial working dashboard, not final production pagination. We will add server pagination, filters and sorting later.
- Token is held **only in React memory**, never browser local storage. Refreshing the tab signs out for safety; later we'll design production-grade authentication with secure HttpOnly cookies and CSRF protection.
- The API currently allows any valid super_admin token to edit catalogues, as in Phase 4. Do not deploy the dashboard until it has been security reviewed and proper operational controls are implemented.
- Model `images` requires JSON like `[ {"url":"https://example.com/fan.jpg","alt":"Fan"} ]`; `specifications` requires `[ {"name":"Wattage","value":"35","unit":"W"} ]`; brochures require `["https://example.com/catalog.pdf"]`.
- **Changes are real database writes.** Start with draft/sample data, not approved client products.
- A parent record set inactive may affect public visibility of its children. It is not a hard delete.
- Old seeded test records can be managed from this dashboard; there is no hard-delete button.
- The Vite frontend runs on port 5174 to avoid your existing React frontend's port 3000 and backend's port 5000.

## Troubleshooting

- **CORS error**: confirm `backend/.env` includes `http://127.0.0.1:5174` and restart backend.
- **401**: log in again. Tokens expire after one hour.
- **403**: verify your account has `super_admin` role.
- **Cannot connect**: backend must run on port 5000 and MongoDB must be connected.
- **Duplicate slug / 409**: use a unique slug in the relevant scope.
- **Field validation**: make sure required parent IDs exist and JSON arrays follow the examples.

This admin app is an MVP. Next milestones: test edit/publish/deactivate, implement safer image/PDF uploads, pagination, detailed forms and deployment authentication hardening.
