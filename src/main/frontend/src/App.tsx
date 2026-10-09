import UsuariosPage from "./pages/UsuariosPage";
import PermissoesPage from "./pages/PermissoesPage";
import ProdutosPage from "./pages/ProdutosPage";

function App() {
  return (
    <div>
      <h1>Sistema Completo - CRUD</h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
        <div className="page-container">
          <UsuariosPage />
        </div>
        <div className="page-container">
          <PermissoesPage />
        </div>
        <div className="page-container">
          <ProdutosPage />
        </div>
      </div>
    </div>
  );
}

export default App;