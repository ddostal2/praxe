import { Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import ContactsPage from "./pages/ContactsPage.jsx";
import CartPage from "./pages/CartPage.jsx";
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
        <Route index element={<HomePage />} />
        <Route path="o-nas" element={<AboutPage />} />
        <Route path="kontakty" element={<ContactsPage />} />
        <Route path="kosik" element={<CartPage />} />
      </Route>
    </Routes>
  );
};

export default App;
