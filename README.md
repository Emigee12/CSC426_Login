# Simple Login App (Node.js + Express)

This is a small demonstration login app built with Node.js and Express. It provides a static front-end and a simple server-side login endpoint using an in-memory user (demo only).

Demo credentials:
- Username: student
- Password: Password123

How to run locally
1. Open a terminal in this folder (`c:\Users\USER\Downloads\DR_AJAYI\LOGIN`).
2. Install dependencies:

```powershell
npm install
```

3. Start the server:

```powershell
npm start
```

4. Open http://localhost:3000 in your browser.

Deployment notes
- This app is intentionally small and uses an in-memory user store. For production, use a real database and environment variables for secrets.
- To deploy to Render (recommended):
  - Create a new Web Service in Render, link the GitHub repo, and set the start command to `npm start`. Render will install dependencies automatically.
- To deploy to Vercel: you can deploy the `public/` static part, but for the Node.js server choose a platform that supports server processes (Render, Heroku, Render is simplest).

Environment variables
- `SESSION_SECRET` — set a strong secret in production.

Files
- `server.js` — Express server
- `public/` — front-end files
- `package.json` — project manifest
