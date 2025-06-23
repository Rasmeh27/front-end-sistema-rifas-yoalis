import { BrowserRouter, Routes, Route } from "react-router-dom";
import FormularioParticipante from "./pages/FormularioParticipante";
import AdminPanel from "./pages/AdminPanel";
import LoginAdmin from "./pages/LoginAdmin";
import RutaProtegida from "./components/RutaProtegida";
import PublicLayout from "./components/PublicLayout";

// Página 404
function NotFound() {
  return (
    <div className="flex-grow flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-lg">Página no encontrada</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PublicLayout>
              <FormularioParticipante />
            </PublicLayout>
          }
        />
        <Route
          path="/admin/login"
          element={
            <PublicLayout>
              <LoginAdmin />
            </PublicLayout>
          }
        />
        <Route
          path="*"
          element={
            <PublicLayout>
              <NotFound />
            </PublicLayout>
          }
        />
        <Route
          path="/admin"
          element={
            <RutaProtegida>
              <AdminPanel />
            </RutaProtegida>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
