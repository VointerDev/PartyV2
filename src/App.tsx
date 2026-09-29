import { Outlet, ScrollRestoration } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { PreviewInspector } from "./lib/PreviewInspector";
import { useCmsPreviewBridge } from "./lib/previewBridge";

export function App() {
  useCmsPreviewBridge();

  return (
    <div className="app-shell spark-shell">
      <ScrollRestoration />
      <Navbar />
      <main className="app-main">
        <Outlet />
      </main>
      <Footer />
      <PreviewInspector />
    </div>
  );
}
