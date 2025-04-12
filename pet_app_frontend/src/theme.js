import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#3CB371', // Green for buttons and accents
        },
        secondary: {
            main: '#FFFFFF', // White for text and background
        },
        text: {
            primary: '#333333', // Dark text for contrast
        },
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif',
        h1: {
            fontSize: '2rem',
            fontWeight: 600,
        },
        h2: {
            fontSize: '1.5rem',
            fontWeight: 500,
        },
        body1: {
            fontSize: '1rem',
            color: '#333333',
        },
    },
});

export default theme;
