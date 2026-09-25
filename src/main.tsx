import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  useParams,
} from "react-router-dom";
import { AdminApp } from "./admin/AdminApp";
import { App } from "./App";
import "./index.css";

const Home = lazy(() => import("./pages/Home").then((m) => ({ default: m.Home })));
const Flashback = lazy(() => import("./pages/Flashback").then((m) => ({ default: m.Flashback })));
const FlashbackGallery = lazy(() =>
  import("./pages/Flashback").then((m) => ({ default: m.FlashbackGallery })),
);

function PageFallback() {
  return <div className="page page-fallback" aria-hidden="true" />;
}

function RedirectToFlashbackSlug() {
  const { slug } = useParams();
  return <Navigate to={`/flashback/${slug ?? ""}`} replace />;
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
      { path: "about", element: <Navigate to="/" replace /> },
      { path: "evenemang", element: <Navigate to="/" replace /> },
      { path: "evenemang/:slug", element: <Navigate to="/" replace /> },
      { path: "vimmelbilder", element: <Navigate to="/flashback" replace /> },
      { path: "vimmelbilder/:slug", element: <RedirectToFlashbackSlug /> },
      { path: "om", element: <Navigate to="/" replace /> },
      { path: "residents", element: <Navigate to="/" replace /> },
      { path: "news", element: <Navigate to="/" replace /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
