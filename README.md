# 🎨 Color Generator

A modern React-based application for generating and managing HSLuv color palettes with a clean Material UI interface.

## 🧩 Introduction

**Color Generator** is a web application designed to generate aesthetically pleasing color palettes using the HSLuv color space. It leverages Material UI for a responsive and visually appealing interface and Emotion for CSS-in-JS styling.

## ✨ Features

- Generate HSLuv-based color palettes.
- Responsive and modern UI built with MUI v6.
- Real-time color updates and previews.
- Integration with Emotion for dynamic styling.

## ⚙️ Installation

Make sure you have [Node.js](https://nodejs.org/) installed.

```bash
git clone https://github.com/JaiDoubleU/color-generator
cd color-generator
npm install
```

## 🚀 Usage

- To start the development server:

```bash
npm start
```
This runs the app in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.


- To customize the generated colors, modify the parameters at the top of `/src/ColorPaletteGenerator.js`.  The development server will automatically build and refresh the colors.


- To build the project for production:

```bash
npm run build
```

- To explore the HSLuv color space and its API at the [HSLuv GitHub repository](https://github.com/hsluv).


## 📦 Dependencies

Key dependencies include:

- `react` ^19.0.0
- `@mui/material` ^6.4.6
- `@mui/icons-material` ^6.4.6
- `@emotion/react` & `@emotion/styled` ^11.14.0
- `hsluv` ^1.0.1

For a full list, refer to the `package.json`.

## 🛠 Scripts

- `start` – Launches the dev server
- `build` – Builds the app for production
- `test` – Runs tests using Jest and Testing Library
- `eject` – Ejects the app from Create React App setup

## ⚙️ Configuration

- Uses `react-scripts` from Create React App
- ESLint extended with `react-app` and `react-app/jest` presets
- Browserslist configured for modern production and dev environments

## 🧪 Testing

This project is set up with:

- `@testing-library/react`
- `@testing-library/jest-dom`
- `@testing-library/user-event`

To run tests:

```bash
npm test
```

## 🛠 Troubleshooting

- Ensure Node.js version is compatible with React 19 and MUI v6.
- Delete `node_modules` and reinstall if encountering dependency issues:

```bash
rm -rf node_modules package-lock.json
npm install
```

## 👥 Contributors

- Jason Shannon


## 📄 License

This project is currently **private**. Licensing information can be added once the project is ready for open-source or public release.
