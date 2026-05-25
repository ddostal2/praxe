import {Route, Routes} from "react-router-dom";
import AppLayout from "./components/layout/AppLayout.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProductsPage from "./pages/ProductsPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
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
            <Route element={<AppLayout/>}>
                <Route index element={<HomePage/>}/>
                <Route path="products" element={<ProductsPage/>}/>
                <Route path="products/:id" element={<ProductDetailPage/>}/>
                <Route path="contact" element={<ContactsPage/>}/>
                <Route path="cart" element={<CartPage/>}/>
            </Route>
        </Routes>
    );
};

export default App;
