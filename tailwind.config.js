/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    fontSize: {
      xs: [
        "0.625rem",
        {
          lineHeight: "1.1",
          letterSpacing: "-0.02em",
        },
      ],
      sm: [
        "0.875rem",
        {
          lineHeight: "1.1",
          letterSpacing: "-0.02em",
        },
      ],

      base: [
        "1.125rem",
        {
          lineHeight: "1.1",
          letterSpacing: "-0.02em",
        },
      ],
      md: [
        "1.375rem",
        {
          lineHeight: "1.1",
          letterSpacing: "-0.02em",
        },
      ],
      lg: [
        "2rem",
        {
          lineHeight: "1.1",
          letterSpacing: "-0.02em",
        },
      ],
      xl: [
        "4rem",
        {
          lineHeight: "1",
          letterSpacing: "-0.02em",
        },
      ],
      "2xl": [
        "7rem",
        {
          lineHeight: "0.9",
          letterSpacing: "-0.02em",
        },
      ],
      "3xl": [
        "10.25rem",
        {
          lineHeight: "0.67",
          letterSpacing: "-0.02em",
        },
      ],
    },
    fontWeight: {
      normal: "400",
      medium: "500",
      black: "900",
    },
    spacing: {
      px: "1px",
      0: "0px",
      1: "5px",
      2: "10px",
      3: "15px",
      4: "20px",
      5: "25px",
      6: "30px",
      7: "35px",
      8: "40px",
      9: "45px",
      10: "50px",
      11: "55px",
      12: "60px",
      13: "65px",
      14: "70px",
      15: "75px",
      16: "80px",
      18: "90px",
      19: "95px",
      20: "100px",
      24: "120px",
      28: "140px",
      30: "150px",
      32: "160px",
      34: "170px",
      36: "180px",
      38: "190px",
      40: "200px",
      44: "220px",
      48: "240px",
      52: "260px",
      56: "280px",
      60: "300px",
      64: "320px",
      68: "340px",
      72: "360px",
      80: "400px",
      96: "440px",
    },
    extend: {
      colors: {
        green: "rgb(2, 169, 71)",
        "green-dark": "rgb(7, 144, 64)",
        "purple-light": "rgb(93, 59, 178)",
        purple: "rgb(76, 47, 146)",
        "purple-dark": "rgb(61, 34, 125)",
        "purple-darkest": "rgb(49, 27, 100)",
        yellow: "rgb(255, 207, 0)",
        pink: "rgb(248, 187, 214)",
        cream: "rgb(240, 240, 239)",
        red: "rgb(227, 0, 11)",
      },
      screens: {
        "h-lg": { raw: "(min-height: 900px)" },
        "h-md": { raw: "(min-height: 768px)" },
        "h-sm": { raw: "(min-height: 640px)" },
        "h-xs": { raw: "(min-height: 400px)" },
        xs: "350px",
        "2xl": "1440px",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(2deg)" },
        },
      },
      animation: {
        wiggle: "wiggle 0.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
