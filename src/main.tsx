import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import { AdminApp } from "./admin/AdminApp";
import { App } from "./App";
import "./index.css";
import { EventSlugRedirect, FlashbackSlugRedirect } from "./pages/Redirects";

const Home = lazy(() => import("./pages/Home").then((m) => ({ default: m.Home })));
const Events = lazy(() => import("./pages/Events").then((m) => ({ default: m.Events })));
const EventDetail = lazy(() => import("./pages/EventDetail").then((m) => ({ default: m.EventDetail })));
const Flashback = lazy(() => import("./pages/Flashback").then((m) => ({ default: m.Flashback })));
const FlashbackGallery = lazy(() =>
  import("./pages/Flashback").then((m) => ({ default: m.FlashbackGallery })),
);
const About = lazy(() => import("./pages/About").then((m) => ({ default: m.About })));
const NotFound = lazy(() => import("./pages/NotFound").then((m) => ({ default: m.NotFound })));

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
      {
        path: "events",
        element: (
          <Suspense fallback={<PageFallback />}>
            <Events />
          </Suspense>
        ),
      },
      {
        path: "events/:slug",
        element: (
          <Suspense fallback={<PageFallback />}>
            <EventDetail />
          </Suspense>
        ),
      },
      {
        path: "flashback",
        element: (
          <Suspense fallback={<PageFallback />}>
            <Flashback />
          </Suspense>
        ),
      },
      {
        path: "flashback/:slug",
        element: (
          <Suspense fallback={<PageFallback />}>
            <FlashbackGallery />
          </Suspense>
        ),
      },
      {
        path: "about",
        element: (
          <Suspense fallback={<PageFallback />}>
            <About />
          </Suspense>
        ),
      },
      { path: "evenemang", element: <Navigate to="/events" replace /> },
      { path: "evenemang/:slug", element: <EventSlugRedirect /> },
      { path: "vimmelbilder", element: <Navigate to="/flashback" replace /> },
      { path: "vimmelbilder/:slug", element: <FlashbackSlugRedirect /> },
      { path: "om", element: <Navigate to="/about" replace /> },
      { path: "residents", element: <Navigate to="/about" replace /> },
      { path: "news", element: <Navigate to="/" replace /> },
      {
        path: "*",
        element: (
          <Suspense fallback={<PageFallback />}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
