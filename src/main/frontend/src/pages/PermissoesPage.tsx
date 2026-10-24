import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import type { Permissao } from "../types/Permissao";
import PermissaoForm from "../components/PermissaoForm";
import Botao from "../components/Botao";

function PermissoesPage() {
  const [permissoes, setPermissoes] = useState<Permissao[]>([]);
  const [editando, setEditando] = useState<Permissao | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  function carregarPermissoes() {
    setLoading(true);
    setErro("");
    api.get<Permissao[]>("/permissoes")
      .then((resposta) => {
        setPermissoes(resposta.data);
      })
      .catch(() => {
        setErro("Erro ao carregar permissões. O backend está rodando?");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    carregarPermissoes();
  }, []);

  async function excluir(id: number) {
    try {
      await api.delete(`/permissoes/${id}`);
      carregarPermissoes();
    } catch {
      alert("Erro ao excluir permissão.");
    }
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-gray-800">Permissões</h1>
      
      <PermissaoForm
        key={editando?.id ?? "novo"}
        permissaoEditando={editando}
        onPermissaoSalva={() => {
          carregarPermissoes();
          setEditando(null);
        }}
      />

      {loading && <p className="text-gray-500">Carregando permissões...</p>}
      {erro && <p className="text-red-600">{erro}</p>}

      {!loading && !erro && (
        <ul className="divide-y divide-gray-200 rounded-lg bg-white shadow">
          {permissoes.map((permissao) => (
            <li key={permissao.id} className="flex items-center justify-between p-4">
              <div>
                <Link
                  to={`/permissoes/${permissao.id}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  <strong>{permissao.nome}</strong>
                </Link>
                <p className="text-sm text-gray-500">{permissao.descricao}</p>
              </div>
              <div className="flex gap-2">
                <Botao variante="neutro" onClick={() => setEditando(permissao)}>
                  Editar
                </Botao>
                <Botao variante="perigo" onClick={() => excluir(permissao.id)}>
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

export default PermissoesPage;
