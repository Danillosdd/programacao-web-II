import { NavLink, Outlet } from "react-router-dom";

const link = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-2 text-sm font-medium ${
    isActive ? "bg-blue-800 text-white" : "text-blue-100 hover:bg-blue-500"
  }`;

function Layout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 shadow">
        <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-3">
          <span className="mr-4 text-lg font-bold text-white">Sistema</span>
          <NavLink to="/" end className={link}>Home</NavLink>
          <NavLink to="/usuarios" className={link}>Usuários</NavLink>
          <NavLink to="/permissoes" className={link}>Permissões</NavLink>
          <NavLink to="/atribuir-permissoes" className={link}>Atribuir Permissões</NavLink>
          <NavLink to="/produtos" className={link}>Produtos</NavLink>
        </div>
      </nav>
      <main className="mx-auto max-w-5xl p-4">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
