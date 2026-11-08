import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import type { Produto } from "../types/Produto";
import ProdutoForm from "../components/ProdutoForm";
import Botao from "../components/Botao";

function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [editando, setEditando] = useState<Produto | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  function carregarProdutos() {
    setLoading(true);
    setErro("");
    api.get<Produto[]>("/produtos")
      .then((resposta) => {
        setProdutos(resposta.data);
      })
      .catch(() => {
        setErro("Erro ao carregar produtos. O backend está rodando?");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    carregarProdutos();
  }, []);

  async function excluir(id: number) {
    if (!window.confirm("Deseja realmente excluir este produto?")) {
      return;
    }
    try {
      await api.delete(`/produtos/${id}`);
      carregarProdutos();
    } catch {
      alert("Erro ao excluir produto.");
    }
  }

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Catálogo de Produtos</h1>
        <p className="text-sm text-gray-500">
          Cadastre novos produtos e vincule-os às suas categorias correspondentes.
        </p>
      </div>

      <ProdutoForm
        key={editando?.id ?? "novo"}
        produtoEditando={editando}
        onProdutoSalvo={() => {
          carregarProdutos();
          setEditando(null);
        }}
      />

      {loading && <p className="text-gray-500">Carregando produtos...</p>}
      {erro && <p className="text-red-600">{erro}</p>}

      {!loading && !erro && (
        <ul className="divide-y divide-gray-200 rounded-lg bg-white shadow">
          {produtos.map((produto) => (
            <li key={produto.id} className="flex items-center justify-between p-4">
              <div>
                <Link
                  to={`/produtos/${produto.id}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  <strong>{produto.nome}</strong>
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-600">
                    Preço: <strong>R$ {produto.preco.toFixed(2).replace(".", ",")}</strong>
                  </span>
                  {produto.categoria && (
                    <span className="rounded bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">
                      📁 {produto.categoria.nome}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <Botao variante="neutro" onClick={() => setEditando(produto)}>
                  Editar
                </Botao>
                <Botao variante="perigo" onClick={() => excluir(produto.id)}>
                  Excluir
                </Botao>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProdutosPage;
