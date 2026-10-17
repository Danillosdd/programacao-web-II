import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import type { Permissao } from "../types/Permissao";

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
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <h2>{permissao.nome}</h2>
      <p><strong>Descrição:</strong> {permissao.descricao}</p>
      <button onClick={() => navigate("/permissoes")}>Voltar</button>
    </div>
  );
}

export default PermissaoDetailPage;
