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
    if (window.confirm("Tem certeza que deseja excluir?")) {
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
        <div style={{ marginTop: "24px" }}>
          <h3>Lista de Produtos</h3>
          <ul>
          {produtos.map((produto) => (
            <li key={produto.id}>
              <div className="item-info">
                <span className="item-title"><strong>Produto:</strong> {produto.nome}</span>
                <span className="item-subtitle"><strong>Preço:</strong> R$ {produto.preco.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="item-actions">
                <button className="btn-edit" onClick={() => setEditando(produto)}>Editar</button>
                <button className="btn-delete" onClick={() => excluir(produto.id)}>Excluir</button>
              </div>
            </li>
          ))}
        </ul>
        </div>
      )}
    </div>
  );
}

export default ProdutosPage;
