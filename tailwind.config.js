/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F3EFE8",
        band: "#E8E2D6",
        /* one surface tint per act of the story */
        clay: "#F5E7E0",
        sand: "#F4EDDD",
        sage: "#E6EEE8",
        mist: "#E6EAF5",
        /* the matching accents, dark enough for small text on those tints */
        rust: "#A33726",
        moss: "#1F5C58",
        amber: "#7A5716",
        ink: "#12151A",
        graphite: "#5F6873",
        rule: "#C7CCC4",
        signal: "#1B3AC7",
        flag: "#A33726",
        night: "#101319",
        orb: {
          blue: "#3A5BD9",
          rust: "#B04430",
          teal: "#2F6E6A",
          ochre: "#8B6B2E",
        },
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', "system-ui", "sans-serif"],
        body: ['"Source Serif 4"', "Georgia", "serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
      maxWidth: {
        measure: "62ch",
        page: "1080px",
      },
      borderRadius: {
        DEFAULT: "4px",
        lg: "8px",
      },
    },
  },
  plugins: [],
};
