# CTF Rankings
Built with React, Vite, and Tailwind CSS.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`

## Building for Production

To build the application for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Deploying to GitHub Pages

1. Update the `base` in `vite.config.js` to match your repository name:
```javascript
base: '/your-repo-name/',
```

2. Update the `basename` in `src/App.jsx`:
```javascript
<BrowserRouter basename="/your-repo-name">
```

3. Deploy:
```bash
npm run deploy
```

This will build the application and push it to the `gh-pages` branch.

- Flag icons from [FlagCDN](https://flagcdn.com/)
