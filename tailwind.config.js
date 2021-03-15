module.exports = {
  purge: {
    enabled: !process.env.ROLLUP_WATCH,
    mode: "all",
    content: ["./public/index.html", "./src/**/*.svelte"],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      scale: {
        175: "1.75",
        200: "2",
        225: "2.25",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
