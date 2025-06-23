import { BrowserRouter, Routes, Route } from "react-router-dom";
import FormularioParticipante from "./pages/FormularioParticipante";
import AdminPanel from "./pages/AdminPanel";
import LoginAdmin from "./pages/LoginAdmin";
import RutaProtegida from "./components/RutaProtegida";

// Componente simple para rutas no encontradas
function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
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
        <Route path="/" element={<FormularioParticipante />} />
        <Route path="/admin/login" element={<LoginAdmin />} />
        <Route
          path="/admin"
          element={
            <RutaProtegida>
              <AdminPanel />
            </RutaProtegida>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}