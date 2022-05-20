module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "./docs/**/*.{html,js,jsx,ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        green: "#4F9253",
        pink: "#FE8A7E",
        blue: "#76B7E0",
        purple: "#94AFEB",
        indigo: "#717EF8",
      },
    },
  },
  plugins: [require("daisyui")],
  corePlugins: {
    preflight: false,
  },

  daisyui: {
    themes: [
      {
        light: {
          primary: "#E7B75B",
          secondary: "#263F40",
          accent: "#fefefe",
          neutral: "#fefefe",
          "base-100": "#fefefe",
          info: "#8CCAC1",
          success: "#9CB686",
          warning: "#FFD261",
          error: "#FC9783",
        },

        dark: {
          primary: "#E7B75B",
          secondary: "#263F40",
          accent: "#2B2B3B",
          neutral: "#120C12",
          "base-100": "#211720",
          info: "#8CCAC1",
          success: "#9CB686",
          warning: "#FFD261",
          error: "#FC9783",
        },
      },
    ],
  },
};
