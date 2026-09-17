import { Navigate, Route, Routes } from "react-router-dom";
import { AdminDashboard } from "./AdminDashboard";
import { AdminEvents } from "./AdminEvents";
import { AdminFlashbacks } from "./AdminFlashbacks";
import { AdminImages } from "./AdminImages";
import { AdminLayout } from "./AdminLayout";
import { AdminLogin } from "./AdminLogin";
import { AdminNews } from "./AdminNews";
import { AdminSettings } from "./AdminSettings";
import { AuthProvider } from "./AuthProvider";
import { AdminCustomizer } from "./customizer/AdminCustomizer";
import { RequireAuth } from "./RequireAuth";

export function AdminApp() {
  return (
    <AuthProvider>
      <Routes>
        <Route index element={<AdminLogin />} />
        <Route element={<RequireAuth />}>
          <Route path="edit" element={<AdminCustomizer />} />
          <Route element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="flashbacks" element={<AdminFlashbacks />} />
            <Route path="news" element={<AdminNews />} />
            <Route path="images" element={<AdminImages />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AuthProvider>
  );
}
