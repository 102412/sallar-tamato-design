# Sallar Financial

A fully non-functional, static design-practice app that mimics the look and flow of a modern
banking/wallet app. **Not connected to any real bank, payment processor, or backend.** All data
is hardcoded fake data — no real authentication, no real transactions, no network calls.

## Publish the static site

The pre-built static export lives in [`/dist`](./dist) — that folder is a complete, self-contained
static site (HTML/CSS/JS) with no server or Metro bundler required. Point any static host at it:

- **GitHub Pages**: repo Settings → Pages → Deploy from branch → folder `/dist`
- **Netlify / Vercel**: drag-and-drop the `dist` folder, or set publish directory to `dist`

## Login

- Email: `Rylandritchie12@gmail.com`
- Password: `Keith2134!`

## Rebuilding

```bash
npm install
npx expo export --platform web   # regenerates /dist
```

## Stack

React Native (Expo, managed) + React Navigation + AsyncStorage + expo-blur + expo-linear-gradient.
