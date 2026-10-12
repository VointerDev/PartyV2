import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { AdminApp } from "./admin/AdminApp";
import { App } from "./App";
import "./index.css";

/** Set to true to enable the public Flashback pages again. */
const SHOW_FLASHBACK = false;

const Home = lazy(() => import("./pages/Home").then((m) => ({ default: m.Home })));
const Flashback = lazy(() => import("./pages/Flashback").then((m) => ({ default: m.Flashback })));
const FlashbackGallery = lazy(() =>
  import("./pages/Flashback").then((m) => ({ default: m.FlashbackGallery })),
);
const Contact = lazy(() => import("./pages/Contact").then((m) => ({ default: m.Contact })));
const CmsPage = lazy(() => import("./pages/CmsPage").then((m) => ({ default: m.CmsPage })));

function PageFallback() {
  return <div className="page page-fallback" aria-hidden="true" />;
}

const router = createBrowserRouter([
  {
    path: "/admin/*",
    element: <AdminApp />,
  },
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageFallback />}>
            <Home />
          </Suspense>
        ),
      },
      { path: "events", element: <Navigate to="/" replace /> },
      { path: "events/:slug", element: <Navigate to="/" replace /> },
      SHOW_FLASHBACK
        ? {
            path: "flashback",
            element: (
              <Suspense fallback={<PageFallback />}>
                <Flashback />
              </Suspense>
            ),
          }
        : { path: "flashback", element: <Navigate to="/" replace /> },
      SHOW_FLASHBACK
        ? {
            path: "flashback/:slug",
            element: (
              <Suspense fallback={<PageFallback />}>
                <FlashbackGallery />
              </Suspense>
            ),
          }
        : { path: "flashback/:slug", element: <Navigate to="/" replace /> },
      {
        path: "kontakt",
        element: (
          <Suspense fallback={<PageFallback />}>
            <Contact />
          </Suspense>
        ),
      },
      { path: "contact", element: <Navigate to="/kontakt" replace /> },
      { path: "about", element: <Navigate to="/" replace /> },
      { path: "evenemang", element: <Navigate to="/" replace /> },
      { path: "evenemang/:slug", element: <Navigate to="/" replace /> },
      { path: "vimmelbilder", element: <Navigate to="/" replace /> },
      { path: "vimmelbilder/:slug", element: <Navigate to="/" replace /> },
      { path: "om", element: <Navigate to="/" replace /> },
      { path: "residents", element: <Navigate to="/" replace /> },
      { path: "news", element: <Navigate to="/" replace /> },
      {
        path: ":slug",
        element: (
          <Suspense fallback={<PageFallback />}>
            <CmsPage />
          </Suspense>
        ),
      },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
