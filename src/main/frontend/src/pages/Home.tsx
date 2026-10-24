import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="rounded-lg bg-white p-8 text-center shadow">
      <h1 className="mb-2 text-3xl font-bold text-blue-600">Bem-vindo ao sistema!</h1>
      <p className="mb-6 text-gray-600">Gerencie usuários, permissões e produtos.</p>
      <div className="flex justify-center gap-3 flex-wrap">
        <Link to="/usuarios" className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Usuários
        </Link>
        <Link to="/permissoes" className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
          Permissões
        </Link>
        <Link to="/atribuir-permissoes" className="rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700">
          Atribuir Permissões
        </Link>
        <Link to="/produtos" className="rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700">
          Produtos
        </Link>
      </div>
    </div>
  );
}

export default Home;
