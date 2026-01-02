/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",     // React source files
    "./public/**/*.html",             // Static HTML
    "./client/src/**/*.{js,jsx}"      // If separate client folder
  ],
  theme: { extend: {} },
  plugins: [],
}