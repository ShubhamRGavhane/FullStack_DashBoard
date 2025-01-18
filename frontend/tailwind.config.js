/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Includes all files in the `app` directory
    "./app/components/**/*.{js,ts,jsx,tsx}", // Includes all files in the `components` directory
    "./app/dashboard/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
