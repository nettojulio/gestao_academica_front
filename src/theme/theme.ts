// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
        main: '#6750A4',
        50: "#E8F1F5",
        100: "#B8D4E1",
        300: "#66A3BF",
        500: "#1A759F",
        700: "#125371",
        900: "#0B3143", 
      },
      secondary: {
        main: "#625B71",
        50: "#EAEFF1",
        100: "#BECED5",
        300: "#7294A4",
        500: "#125371",
        700: "#204354",
        900: "#132832",
      },
      grey: {
        50: "#F2F5F7",
        100: "#E4EAED",
        200: "#BCC8C3",
        300: "#9FAEB5",
        400: "#84949C",
        500: "#6C7B82",
        600: "#556369",
        700: "#2C3438",
        800: "#1E2629",
        900: "#151C1F",
      },
      success: {
        50: "#E8F5EA",
        100: "#B8E1BD",
        300: "#66BF70",
        500: "#1A9F2A",
        700: "#12711E",
        900: "#0B4312",
      },
      warning: {
        50: "#F5F2E8",
        100: "#E1D6B8",
        300: "#BFA766",
        500: "#9F7C1A",
        700: "#715812",
        900: "#43340B",
      },
      error: {
        50: "#F5E8E8",
        100: "#E1BDB8",
        300: "#BF7066",
        500: "#9F2A1A",
        700: "#711E12",
        900: "#43120B",
      },
    background: {
      default: '#E4EAED', // Cor de fundo padrão
    },
  },
  typography: {
    fontFamily: 'Lato, Arial, sans-serif', // Fonte principal
    h1: {
      fontSize: '57px',
      lineHeight: '64px',
      fontWeight: 600, // SemiBold
      letterSpacing: '-0.25px',
    },
    h2: {
      fontSize: '45px',
      lineHeight: '52px',
      fontWeight: 600, // SemiBold
      letterSpacing: '0px',
    },
    h3: {
      fontSize: '36px',
      lineHeight: '44px',
      fontWeight: 600, // SemiBold
      letterSpacing: '0px',
    },
    h4: {
      fontSize: '32px',
      lineHeight: '40px',
      fontWeight: 600, // SemiBold
      letterSpacing: '0px',
    },
    h5: {
      fontSize: '28px',
      lineHeight: '36px',
      fontWeight: 600, // SemiBold
      letterSpacing: '0px',
    },
    h6: {
      fontSize: '24px',
      lineHeight: '32px',
      fontWeight: 600, // SemiBold
      letterSpacing: '0px',
    },
    subtitle1: {
      fontSize: '22px',
      lineHeight: '28px',
      fontWeight: 600, // SemiBold
      letterSpacing: '0px',
    },
    subtitle2: {
      fontSize: '16px',
      lineHeight: '24px',
      fontWeight: 600, // SemiBold
      letterSpacing: '0.15px',
    },
    body1: {
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: 600, // SemiBold
      letterSpacing: '0.1px',
    },
    body2: {
      fontSize: '14px',
      lineHeight: '20px',
      fontWeight: 400, // Regular
      letterSpacing: '0.5px',
    },
    caption: {
      fontSize: '12px',
      lineHeight: '16px',
      fontWeight: 600, // SemiBold
      letterSpacing: '-0.05px',
    },
    overline: {
      fontSize: '11px',
      lineHeight: '16px',
      fontWeight: 600, // SemiBold
      letterSpacing: '-0.05px',
    },
  },
  shape: {
    borderRadius: 8, // Exemplo para cantos arredondados
  },
});

export default theme;