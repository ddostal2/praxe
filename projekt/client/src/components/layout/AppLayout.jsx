import { Outlet } from "react-router-dom";

/**
 * Společný layout s navigací a výstupem pro vnořené routy.
 * @component
 * @returns {JSX.Element}
 */
const AppLayout = () => {
  return (
    <div className="app-layout">
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
