import { NavLink, Outlet } from "react-router-dom";

function Layout() {
  return (
    <div>
      <h1 style={{ marginBottom: "1rem" }}>Sistema Completo - CRUD</h1>
      
      <nav className="menu-tabs">
        <NavLink 
          to="/" 
          end 
          className={({ isActive }) => `tab-btn ${isActive ? "active" : ""}`}
        >
          Home
        </NavLink>
        <NavLink 
          to="/usuarios" 
          className={({ isActive }) => `tab-btn ${isActive ? "active" : ""}`}
        >
          Usuários
        </NavLink>
        <NavLink 
          to="/permissoes" 
          className={({ isActive }) => `tab-btn ${isActive ? "active" : ""}`}
        >
          Permissões
        </NavLink>
        <NavLink 
          to="/atribuir-permissoes" 
          className={({ isActive }) => `tab-btn ${isActive ? "active" : ""}`}
        >
          Atribuir Permissões
        </NavLink>
        <NavLink 
          to="/produtos" 
          className={({ isActive }) => `tab-btn ${isActive ? "active" : ""}`}
        >
          Produtos
        </NavLink>
      </nav>

      <main className="page-container">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
