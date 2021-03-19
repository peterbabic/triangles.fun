module.exports = {
  purge: {
    enabled: !process.env.ROLLUP_WATCH,
    mode: "all",
    content: ["./public/index.html", "./src/**/*.svelte"],
    options: {
      safelist: [
        /^bg\-(green|cyan|blue|yellow|orange|red|purple)(\-(lighter|darker))?/,
      ],
    },
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      gray: "hsl(219, 28%, 88%)",
      "gray-lighter": "hsl(218, 27%, 94%)",
      "gray-darker": "hsl(219, 28%, 68%)",
      green: "hsl(92, 28%, 65%)",
      "green-lighter": "hsl(92, 28%, 85%)",
      "green-darker": "hsl(92, 28%, 30%)",
      cyan: "hsl(179, 25%, 65%)",
      "cyan-lighter": "hsl(179, 25%, 85%)",
      "cyan-darker": "hsl(179, 25%, 30%)",
      blue: "hsl(210, 34%, 63%)",
      "blue-lighter": "hsl(213, 32%, 82%)",
      "blue-darker": "hsl(213, 32%, 37%)",
      yellow: "hsl(40, 71%, 73%)",
      "yellow-lighter": "hsl(40, 71%, 88%)",
      "yellow-darker": "hsl(40, 71%, 37%)",
      orange: "hsl(14, 51%, 63%)",
      "orange-lighter": "hsl(14, 51%, 83%)",
      "orange-darker": "hsl(14, 51%, 28%)",
      red: "hsl(354, 42%, 56%)",
      "red-lighter": "hsl(354, 42%, 76%)",
      "red-darker": "hsl(354, 42%, 28%)",
      purple: "hsl(311, 20%, 63%)",
      "purple-lighter": "hsl(311, 20%, 83%)",
      "purple-darker": "hsl(311, 20%, 28%)",
    },
    extend: {
      scale: {
        175: "1.75",
        200: "2",
        225: "2.25",
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ["active"],
      textColor: ["active"],
    },
  },
  plugins: [],
}
