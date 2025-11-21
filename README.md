# Designed Weather App

This project contains a small frontend (weather UI) and a Node.js backend proxy that forwards requests to OpenWeatherMap using a server-side API key. The goal is to keep your API key out of client-side code and GitHub history.

## Files added
- `server.js` - Express proxy that exposes `/api/weather` and `/api/forecast`.
- `package.json` - Node dependencies and scripts.
- `public/` - Copy of the frontend (served by the Express server).
- `.env` - (local) contains `API_KEY=...` (already in your repo root locally but ignored by Git via `.gitignore`).

## Local development
1. Install dependencies (PowerShell):

```powershell
cd "c:\Users\MLAB - KIMBERLEY\OneDrive\Documentos\designed-weather-app"
npm install
```

2. Add your API key to the `.env` file in project root:

```dotenv
API_KEY=your_openweather_api_key_here
```

3. Run the server:

```powershell
npm start
# or for dev with auto-reload (if you install nodemon):
# npm run dev
```

4. Open `http://localhost:3000` in your browser. The server serves the frontend from `public/` and forwards API calls to OpenWeather.

## Deploying the backend on Render
1. Push this repo to GitHub.
2. Create a new **Web Service** on Render and connect your GitHub repository.
3. Set the **Build Command** to empty (not needed) and **Start Command** to:

```
node server.js
```

4. In Render's **Environment** tab, add a `API_KEY` environment variable with your OpenWeather API key.
5. Deploy. The service will run the server which serves the frontend and proxies requests. Your key remains secret in Render's environment.

## Using GitHub Pages for the frontend and Render for the backend
- Option A — simple config file: create a small `config.js` next to `index.html` with:

```html
<script>
  // Replace with your Render service URL (no trailing slash)
  window.BACKEND_URL = 'https://your-service.onrender.com';
</script>
```

Include that script before your main `script.js` in `index.html`. The frontend will use `window.BACKEND_URL` to call the backend.

- Option B — set the URL directly in `index.html` by adding the same inline script before `script.js`.

- When using GitHub Pages, leave your server running on Render and add the `API_KEY` in Render's environment settings. The client will call the Render URL and the secret remains on the server.

## Notes and next steps
- If you accidentally committed `.env`, I can provide commands to remove it from Git history. Let me know and I'll prepare them.
- Optionally add `nodemon` as a devDependency for local development: `npm install -D nodemon`.

If you want, I can:
- Prepare the `git rm --cached .env` and Git history cleanup commands.
- Update `public/script.js` to call a configurable backend URL (so it works from GitHub Pages to a Render backend).
- Add a small CI config or Render build settings file.
