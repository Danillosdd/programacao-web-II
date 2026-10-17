import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import UsuariosPage from "./pages/UsuariosPage";
import UsuarioDetailPage from "./pages/UsuarioDetailPage";
import PermissoesPage from "./pages/PermissoesPage";
import PermissaoDetailPage from "./pages/PermissaoDetailPage";
import UsuarioPermissoesPage from "./pages/UsuarioPermissoesPage";
import ProdutosPage from "./pages/ProdutosPage";
import ProdutoDetailPage from "./pages/ProdutoDetailPage";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/usuarios" element={<UsuariosPage />} />
        <Route path="/usuarios/:id" element={<UsuarioDetailPage />} />
        <Route path="/permissoes" element={<PermissoesPage />} />
        <Route path="/permissoes/:id" element={<PermissaoDetailPage />} />
        <Route path="/atribuir-permissoes" element={<UsuarioPermissoesPage />} />
        <Route path="/produtos" element={<ProdutosPage />} />
        <Route path="/produtos/:id" element={<ProdutoDetailPage />} />
        <Route path="*" element={<h2>Página não encontrada</h2>} />
      </Route>
    </Routes>
  );
}

export default App;