import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import type { Produto } from "../types/Produto";

function ProdutoDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produto, setProduto] = useState<Produto | null>(null);

  useEffect(() => {
    api.get<Produto>(`/produtos/${id}`).then((resposta) => {
      setProduto(resposta.data);
    });
  }, [id]);

  if (!produto) {
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <h2>{produto.nome}</h2>
      <p><strong>Preço:</strong> R$ {produto.preco.toFixed(2).replace(".", ",")}</p>
      <button onClick={() => navigate("/produtos")}>Voltar</button>
    </div>
  );
}

export default ProdutoDetailPage;
