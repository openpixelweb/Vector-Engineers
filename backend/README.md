# Vector Engineers Backend - Phase 1

This package creates **only the backend foundation**. No catalog CRUD or database content is implemented yet. Your existing React frontend remains untouched.

## Windows PowerShell steps
1. Extract this folder next to `frontend`, e.g. `C:\Users\phani\Downloads\vector-engineers\backend`.
2. Open VS Code terminal in `backend`.
3. `node -v` (Node.js 20+)
4. `npm install`
5. `Copy-Item .env.example .env`
6. `npm run dev`
7. Open `http://localhost:5000/api/v1/health` in Chrome.

Expected result has `success: true`, `phase: 1`, and `database: "disconnected"` (correct until Phase 2). You may alternatively use `npm start` without file watching.

If port 5000 is taken, edit `PORT=5001` in `.env` and open port 5001.

**Do not put MongoDB credentials in source code or paste them into chat.**
