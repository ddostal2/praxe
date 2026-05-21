import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, useTheme } from './ThemeContext';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { UserDetail } from './pages/UserDetail';
import { ProductList } from './ProductList';

// Zjednodušená komponenta pro obsah aplikace
function AppContent() {
  const { theme } = useTheme();

  return (
    // Pomocí třídy `app-wrapper` a `light`/`dark` z ThemeContextu měníme vzhled celé aplikace
    <div className={`app-wrapper ${theme}`}>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/user/:id" element={<UserDetail />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
