// src/context/ThemeContext.jsx
import { createContext, useState, useMemo, useEffect } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('themeMode') || 'light';
    return savedMode;
  });

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(() =>
    createTheme({
      typography: {
        fontFamily: 'Inter, sans-serif',
      },
      // --- PALET WARNA BARU, DIJAMIN SAMA PERSIS SEPERTI TAILADMIN ---
      palette: {
        mode,
        ...(mode === 'light'
        ? {
            // Palet Terang
            primary: { main: '#3056D3' },
            background: { default: '#F1F5F9', paper: '#FFFFFF' },
            text: { primary: '#1C2434', secondary: '#637381' },
            divider: 'rgba(0, 0, 0, 0.12)',
          }
        : {
            // Palet Gelap
            primary: { main: '#3C50E0' }, // Warna biru tombol/link
            background: {
              default: '#1C2434', // Latar halaman paling gelap
              paper: '#2E3A4D',   // Latar untuk kartu, header, dan sidebar
            },
            text: {
              primary: '#DEE4EE',   // Teks utama (putih keabu-abuan)
              secondary: '#8A99AF', // Teks sekunder (abu-abu)
            },
            divider: 'rgba(255, 255, 255, 0.12)', // Warna garis pemisah
          }),
      },
    }),
  [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}