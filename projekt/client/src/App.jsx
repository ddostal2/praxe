import { Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout.jsx";
import HomePage from "./pages/HomePage.jsx";
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
      </Route>
    </Routes>
  );
};

export default App;
