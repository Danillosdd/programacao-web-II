import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import type { Permissao } from "../types/Permissao";
import Botao from "../components/Botao";

function PermissaoDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [permissao, setPermissao] = useState<Permissao | null>(null);

  useEffect(() => {
    api.get<Permissao>(`/permissoes/${id}`).then((resposta) => {
      setPermissao(resposta.data);
    });
  }, [id]);

  if (!permissao) {
    return <p className="text-gray-500">Carregando...</p>;
  }

  return (
    <div className="max-w-md rounded-lg bg-white p-6 shadow">
      <h1 className="mb-4 text-2xl font-bold text-gray-800">{permissao.nome}</h1>
      <p className="mb-4 text-gray-700"><strong>Descrição:</strong> {permissao.descricao}</p>
      <Botao variante="neutro" onClick={() => navigate("/permissoes")}>
        Voltar
      </Botao>
    </div>
  );
}

export default PermissaoDetailPage;
