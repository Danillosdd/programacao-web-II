import UsuariosPage from "./pages/UsuariosPage";
import PermissoesPage from "./pages/PermissoesPage";
import ProdutosPage from "./pages/ProdutosPage";

function App() {
  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>Sistema Completo - CRUD</h1>
      
      <div style={{ display: "flex", gap: "40px" }}>
        <div style={{ flex: 1 }}>
          <UsuariosPage />
        </div>
        <div style={{ flex: 1 }}>
          <PermissoesPage />
        </div>
        <div style={{ flex: 1 }}>
          <ProdutosPage />
        </div>
      </div>
    </div>
  );
}

export default App;