import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import type { Usuario } from "../types/Usuario";
import UsuarioForm from "../components/UsuarioForm";
import Botao from "../components/Botao";

function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [editando, setEditando] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  function carregarUsuarios() {
    setLoading(true);
    setErro("");
    api.get<Usuario[]>("/usuarios")
      .then((resposta) => {
        setUsuarios(resposta.data);
      })
      .catch(() => {
        setErro("Erro ao carregar usuários. O backend está rodando?");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    carregarUsuarios();
  }, []);

  async function excluir(id: number) {
    try {
      await api.delete(`/usuarios/${id}`);
      carregarUsuarios();
    } catch {
      alert("Erro ao excluir usuário.");
    }
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-gray-800">Usuários</h1>
      <UsuarioForm
        key={editando?.id ?? "novo"}
        usuarioEditando={editando}
        onUsuarioSalvo={() => {
          carregarUsuarios();
          setEditando(null);
        }}
      />

      {loading && <p className="text-gray-500">Carregando usuários...</p>}
      {erro && <p className="text-red-600">{erro}</p>}

      {!loading && !erro && (
        <ul className="divide-y divide-gray-200 rounded-lg bg-white shadow">
          {usuarios.map((usuario) => (
            <li key={usuario.id} className="flex items-center justify-between p-4">
              <Link
                to={`/usuarios/${usuario.id}`}
                className="font-medium text-blue-600 hover:underline"
              >
                {usuario.nome} <span className="text-gray-500">({usuario.username})</span>
              </Link>
              <div className="flex gap-2">
                <Botao variante="neutro" onClick={() => setEditando(usuario)}>
                  Editar
                </Botao>
                <Botao variante="perigo" onClick={() => excluir(usuario.id)}>
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

export default UsuariosPage;