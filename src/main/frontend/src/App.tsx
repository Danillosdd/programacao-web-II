import { useState } from "react";
import UsuariosPage from "./pages/UsuariosPage";
import PermissoesPage from "./pages/PermissoesPage";
import ProdutosPage from "./pages/ProdutosPage";

function App() {
  const [abaAtiva, setAbaAtiva] = useState("usuarios");

  return (
    <div>
      <h1 style={{ marginBottom: "1rem" }}>Sistema Completo - CRUD</h1>
      
      <div className="menu-tabs">
        <button 
          className={`tab-btn ${abaAtiva === "usuarios" ? "active" : ""}`}
          onClick={() => setAbaAtiva("usuarios")}
        >
          Usuários
        </button>
        <button 
          className={`tab-btn ${abaAtiva === "permissoes" ? "active" : ""}`}
          onClick={() => setAbaAtiva("permissoes")}
        >
          Permissões
        </button>
        <button 
          className={`tab-btn ${abaAtiva === "produtos" ? "active" : ""}`}
          onClick={() => setAbaAtiva("produtos")}
        >
          Produtos
        </button>
      </div>
      
      <div className="page-container">
        {abaAtiva === "usuarios" && <UsuariosPage />}
        {abaAtiva === "permissoes" && <PermissoesPage />}
        {abaAtiva === "produtos" && <ProdutosPage />}
      </div>
    </div>
  );
}

export default App;