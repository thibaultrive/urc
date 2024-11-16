// theme.js
import { extendTheme } from '@mui/joy/styles';

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          solidBg: '#1976d2', // Couleur principale pour les boutons, etc.
        },
        neutral: {
          solidBg: '#d32f2f', // Couleur secondaire
        },
      },
    },
  },
});

export default theme;
