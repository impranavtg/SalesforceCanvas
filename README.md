# Salesforce Canvas Test Application

A full-stack test application for Salesforce Canvas integration.

## Architecture

| Layer       | Tech              | Port   |
| ----------- | ----------------- | ------ |
| **Client**  | React + Vite      | `5173` |
| **Server**  | Express + jsforce | `3001` |
| **Hosting** | Netlify (both)    | —      |

```
SalesforceCanvas/
├── client/            # React frontend
│   ├── src/
│   │   ├── components/   # ContextPanel, DataPanel, EventsPanel
│   │   ├── hooks/        # useCanvasContext
│   │   ├── App.jsx
│   │   └── index.css     # Design system
│   ├── netlify.toml
│   └── package.json
├── server/            # Express backend
│   ├── src/
│   │   ├── routes/       # canvas.js, api.js
│   │   ├── __tests__/    # canvasAuth.test.js
│   │   ├── canvasAuth.js # Signed request verification
│   │   ├── sessionStore.js
│   │   ├── mockData.js
│   │   └── index.js
│   ├── netlify/
│   │   └── functions/
│   │       └── api.js    # Serverless wrapper
│   ├── netlify.toml
│   └── package.json
└── README.md
```

## Quick Start

### 1. Server

```bash
cd server
npm install
cp .env.example .env    # then fill in your credentials
npm run dev
```

### 2. Client

```bash
cd client
npm install
npm run dev
```

### 3. Test with Mock Mode

With both running, visit:

```
http://localhost:3001/canvas/mock
```

This creates a mock Salesforce session and redirects you to the client with test data — **no Salesforce org needed**.

### 4. Run Unit Tests

```bash
cd server
node --test src/__tests__/canvasAuth.test.js
```

## Salesforce Connected App Setup

1. **Setup → Apps → App Manager → New Connected App**
2. Fill in app name, API name, contact email
3. **Enable OAuth Settings**:
   - Callback URL: `https://<your-netlify-server-url>/canvas`
   - Scopes: `Full access (full)`, `Perform requests at any time`, `Manage user data via APIs`
4. **Canvas App Settings**:
   - ✅ Is a Canvas App
   - Canvas App URL: `https://<your-netlify-server-url>/canvas`
   - Access Method: **Signed Request (POST)**
   - Locations: Visualforce Page / Chatter Tab
5. Save → copy **Consumer Key** & **Consumer Secret** into server `.env`
6. **Manage → Policies**: Permitted Users = "Admin approved users are pre-authorized", assign System Administrator profile

## Netlify Deployment

### Server (Netlify Functions)

```bash
cd server
npx netlify-cli deploy --prod
```

Set environment variables in Netlify dashboard: `CONSUMER_KEY`, `CONSUMER_SECRET`, `CLIENT_URL`, `MOCK_MODE`.

### Client

```bash
cd client
npx netlify-cli deploy --prod
```

Set `VITE_API_BASE` to your Netlify server URL.
