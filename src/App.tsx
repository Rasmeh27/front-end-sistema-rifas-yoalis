import { BrowserRouter, Routes, Route } from "react-router-dom";
import FormularioParticipante from "./pages/FormularioParticipante";
import AdminPanel from "./pages/AdminPanel";
import LoginAdmin from "./pages/LoginAdmin";
import RutaProtegida from "./components/RutaProtegida";

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
      </Routes>
    </BrowserRouter>
  );
}
