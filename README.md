# 🎨 Color Generator

A modern React-based utility designed to generate visually cohesive color palettes using the [HSLuv](https://github.com/hsluv) color space. It provides intuitive controls and well-defined parameters for adjusting hue, saturation, and lightness, enabling designers and developers to create accessible and harmonious color systems with precision. Explore the HSLuv color space and its API at the [HSLuv GitHub repository](https://github.com/hsluv).


## ✨ Features

- Generates HSLuv-based color palettes.
- Responsive and modern UI built with MUI v6.
- Real-time color updates and previews.

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

- To customize the generated colors, modify the parameters at the top of `/src/ColorPaletteGenerator.js`.  The development server will automatically build and refresh the generated colors.


- To build the project for production:

```bash
npm run build
```

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
- Karel Suchomel


## 📄 License

This project is currently **private**. Licensing information can be added once the project is ready for open-source or public release.
