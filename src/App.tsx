import { Outlet, ScrollRestoration } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";

export function App() {
  return (
    <div className="app-shell spark-shell">
      <ScrollRestoration />
      <Navbar />
      <main className="app-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
