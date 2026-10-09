import { useEffect, useState } from "react";
import api from "../services/api";
import type { Permissao } from "../types/Permissao";
import PermissaoForm from "../components/PermissaoForm";

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
    if (confirm("Tem certeza que deseja excluir?")) {
      try {
        await api.delete(`/permissoes/${id}`);
        carregarPermissoes();
      } catch (error) {
        alert("Erro ao excluir permissão.");
      }
    }
  }

  return (
    <div>
      <h2>Permissões</h2>
      
      <PermissaoForm
        key={editando?.id ?? "novo"}
        permissaoEditando={editando}
        onPermissaoSalva={() => {
          carregarPermissoes();
          setEditando(null);
        }}
      />

      {loading && <p>Carregando permissões...</p>}
      {erro && <p style={{ color: "red" }}>{erro}</p>}

      {!loading && !erro && (
        <ul>
          {permissoes.map((permissao) => (
            <li key={permissao.id}>
              <div className="item-info">
                <span className="item-title">{permissao.nome}</span>
                <span className="item-subtitle">{permissao.descricao}</span>
              </div>
              <div className="item-actions">
                <button className="btn-edit" onClick={() => setEditando(permissao)}>Editar</button>
                <button className="btn-delete" onClick={() => excluir(permissao.id)}>Excluir</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PermissoesPage;
