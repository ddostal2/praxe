import './App.css'
import Counter from "./Counter.jsx";
import {createContext, useEffect, useState} from "react";
import {Link} from "react-router";

const ThemeContext = createContext("dark");

export default function App() {
    const [produkty, setProdukty] = useState({});
    const [state, setState] = useState("loading");

    const [theme, setTheme] = useState("dark");

    useEffect(() => {
        const controller = new AbortController();

        async function loadProducts() {
            try {
                setState("loading");
                const response = await fetch("https://fakestoreapi.com/products", {signal: controller.signal});

                if (response.ok) {
                    const data = await response.json();
                    setProdukty(data)

                    setState("loaded")
                } else
                    setState("error");
            } catch (error) {
                if (error.name === "AbortError") return; // zrušení fetche

                setState("error")
                console.log("Error while loading products: " + error.message);
            }
        }

        loadProducts();

        return () => controller.abort();
    }, []);

    useEffect(() => { // so theme applies to the rest of the page
        document.body.className = theme;
    }, [theme]);

    return (
        <>
            <ThemeContext value={theme}>
                <h1 className={theme}>React test</h1>
                <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                    Change theme
                </button>
                <p className={theme}>Counter component</p>
                <Counter/>
                <p className={theme}>{(state === "loaded") ? "Products loaded." : (state !== "error") ? "Loading products..." : "Error!"}</p>
                <Link to="/about">About page</Link>
                <Link to="/user/test">Test user page</Link>
            </ThemeContext>
        </>
    )
}
