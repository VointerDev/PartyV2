import { Outlet, ScrollRestoration } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { SiteBanner, bannerIsVisible } from "./components/SiteBanner";
import { PreviewInspector } from "./lib/PreviewInspector";
import { useCmsPreviewBridge } from "./lib/previewBridge";
import { usePublishedEvents } from "./lib/usePublishedEvents";

export function App() {
  useCmsPreviewBridge();
  const { site } = usePublishedEvents();
  const showBanner = bannerIsVisible(site);
  const stickyChrome = showBanner && site.bannerSticky;

  return (
    <div className="app-shell">
      <ScrollRestoration />
      <div className={stickyChrome ? "site-chrome site-chrome--sticky" : "site-chrome"}>
        <SiteBanner site={site} />
        <Navbar />
      </div>
      <main className="app-main">
        <Outlet />
      </main>
      <Footer />
      <PreviewInspector />
    </div>
  );
}
