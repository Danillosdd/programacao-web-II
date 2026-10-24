import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import type { Usuario } from "../types/Usuario";
import Botao from "../components/Botao";

function UsuarioDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    api.get<Usuario>(`/usuarios/${id}`).then((resposta) => {
      setUsuario(resposta.data);
    });
  }, [id]);

  if (!usuario) {
    return <p className="text-gray-500">Carregando...</p>;
  }

  return (
    <div className="max-w-md rounded-lg bg-white p-6 shadow">
      <h1 className="mb-4 text-2xl font-bold text-gray-800">{usuario.nome}</h1>
      <p className="text-gray-700"><strong>Username:</strong> {usuario.username}</p>
      <p className="mb-4 text-gray-700"><strong>E-mail:</strong> {usuario.email}</p>
      <Botao variante="neutro" onClick={() => navigate("/usuarios")}>
        Voltar
      </Botao>
    </div>
  );
}

export default UsuarioDetailPage;
