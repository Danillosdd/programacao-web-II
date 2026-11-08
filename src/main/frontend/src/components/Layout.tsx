import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { obterSessao, sair, temPapel } from "../services/auth";

const link = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? "bg-blue-800 text-white" : "text-blue-100 hover:bg-blue-500"
  }`;

function Layout() {
  const navigate = useNavigate();
  const sessao = obterSessao();

  function deslogar() {
    sair();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 shadow">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 py-3">
          <span className="mr-3 text-lg font-bold text-white tracking-wide">
            E-Commerce UEG
          </span>
          <NavLink to="/" end className={link}>Home</NavLink>
          <NavLink to="/categorias" className={link}>Categorias</NavLink>
          <NavLink to="/produtos" className={link}>Produtos</NavLink>
          <NavLink to="/pedidos" className={link}>Pedidos</NavLink>

          {temPapel("ADMIN") && (
            <>
              <span className="mx-1 text-blue-300">|</span>
              <NavLink to="/usuarios" className={link}>Usuários</NavLink>
              <NavLink to="/atribuir-permissoes" className={link}>Permissões</NavLink>
            </>
          )}

          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm font-medium text-blue-100">
              👤 {sessao?.nome ?? "Visitante"}
            </span>
            <button
              onClick={deslogar}
              className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 transition-colors shadow-sm"
            >
              Sair
            </button>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-6xl p-5">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
