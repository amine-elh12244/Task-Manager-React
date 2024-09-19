// mui theme settings
export const themeSettings = () => {
  return {
    palette: {
      gray: {
        first: "#F2F2F2",
        second: "#d2d2d2",
        third: "#e0e0e0"
      },
      white: {
        first: "#FFFFFF"
      },
      blue: {
        first: "#004BAB",
        second: "#C8DDF9"
      },
      black: {
        default: "#000000"
      },
      red:{
        first:"#f44336"
      }
    },
    typography: {
      fontFamily: ["Inter", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};
