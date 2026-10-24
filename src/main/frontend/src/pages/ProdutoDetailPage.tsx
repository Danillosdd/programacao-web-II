import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import type { Produto } from "../types/Produto";
import Botao from "../components/Botao";

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
    return <p className="text-gray-500">Carregando...</p>;
  }

  return (
    <div className="max-w-md rounded-lg bg-white p-6 shadow">
      <h1 className="mb-4 text-2xl font-bold text-gray-800">{produto.nome}</h1>
      <p className="mb-4 text-gray-700">
        <strong>Preço:</strong> R$ {produto.preco.toFixed(2).replace(".", ",")}
      </p>
      <Botao variante="neutro" onClick={() => navigate("/produtos")}>
        Voltar
      </Botao>
    </div>
  );
}

export default ProdutoDetailPage;
