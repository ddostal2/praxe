import { Route, Routes, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import "./App.css";

/**
 * Kořenová aplikace — definice rout.
 * @component
 * @returns {JSX.Element}
 */
const App = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/products" replace />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
      </Route>
    </Routes>
  );
};

export default App;
