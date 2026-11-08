import { Link } from "react-router-dom";
import { temPapel, obterSessao } from "../services/auth";

function Home() {
  const sessao = obterSessao();
  const isAdmin = temPapel("ADMIN");

  return (
    <div className="space-y-6">
      {/* Banner de Boas-vindas */}
      <div className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-white shadow-lg">
        <h1 className="text-3xl font-extrabold tracking-tight">
          Olá, {sessao?.nome || "Visitante"}! 👋
        </h1>
        <p className="mt-2 text-blue-100 max-w-2xl text-sm md:text-base">
          Bem-vindo ao <strong>Sistema de Gestão de E-commerce e Vendas</strong> (Avaliação N2).
          Utilize o menu acima ou os cartões abaixo para gerenciar o catálogo, categorias e pedidos de venda.
        </p>
      </div>

      {/* Grid de Módulos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Card Categorias */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="text-3xl mb-2">📁</div>
            <h2 className="text-xl font-bold text-gray-800">Categorias</h2>
            <p className="text-sm text-gray-500 mt-1">
              Classifique os produtos do catálogo por departamentos e seções comerciais.
            </p>
          </div>
          <Link
            to="/categorias"
            className="mt-4 inline-block text-center rounded-lg bg-blue-600 py-2.5 px-4 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Acessar Categorias ➔
          </Link>
        </div>

        {/* Card Produtos */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="text-3xl mb-2">📦</div>
            <h2 className="text-xl font-bold text-gray-800">Produtos</h2>
            <p className="text-sm text-gray-500 mt-1">
              Cadastre e consulte os produtos em estoque, preços e especificações.
            </p>
          </div>
          <Link
            to="/produtos"
            className="mt-4 inline-block text-center rounded-lg bg-emerald-600 py-2.5 px-4 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
          >
            Acessar Produtos ➔
          </Link>
        </div>

        {/* Card Pedidos */}
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="text-3xl mb-2">🛍️</div>
            <h2 className="text-xl font-bold text-gray-800">Pedidos de Venda</h2>
            <p className="text-sm text-gray-500 mt-1">
              Emita novos pedidos, monitore pagamentos e acompanhe o fluxo de compras.
            </p>
          </div>
          <Link
            to="/pedidos"
            className="mt-4 inline-block text-center rounded-lg bg-indigo-600 py-2.5 px-4 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            Acessar Pedidos ➔
          </Link>
        </div>

        {/* Card Usuários (ADMIN) */}
        {isAdmin && (
          <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="text-3xl mb-2">👥</div>
              <h2 className="text-xl font-bold text-gray-800">Usuários & Permissões</h2>
              <p className="text-sm text-gray-500 mt-1">
                Controle de acessos administrativos, cadastro de contas e papéis (ADMIN/USER).
              </p>
            </div>
            <Link
              to="/usuarios"
              className="mt-4 inline-block text-center rounded-lg bg-gray-800 py-2.5 px-4 text-sm font-semibold text-white hover:bg-black transition-colors"
            >
              Administrar Usuários ➔
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
