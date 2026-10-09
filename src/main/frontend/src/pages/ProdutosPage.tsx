import { useEffect, useState } from "react";
import api from "../services/api";
import type { Produto } from "../types/Produto";
import ProdutoForm from "../components/ProdutoForm";

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
    if (confirm("Tem certeza que deseja excluir?")) {
      try {
        await api.delete(`/produtos/${id}`);
        carregarProdutos();
      } catch (error) {
        alert("Erro ao excluir produto.");
      }
    }
  }

  return (
    <div>
      <h2>Produtos</h2>
      
      <ProdutoForm
        key={editando?.id ?? "novo"}
        produtoEditando={editando}
        onProdutoSalvo={() => {
          carregarProdutos();
          setEditando(null);
        }}
      />

      {loading && <p>Carregando produtos...</p>}
      {erro && <p style={{ color: "red" }}>{erro}</p>}

      {!loading && !erro && (
        <ul>
          {produtos.map((produto) => (
            <li key={produto.id} style={{ marginBottom: "10px" }}>
              <strong>{produto.nome}</strong> - R$ {produto.preco.toFixed(2)}
              <button onClick={() => setEditando(produto)} style={{ marginLeft: "10px" }}>Editar</button>
              <button onClick={() => excluir(produto.id)} style={{ marginLeft: "5px" }}>Excluir</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProdutosPage;
