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
            <li key={permissao.id} style={{ marginBottom: "10px" }}>
              <strong>{permissao.nome}</strong> - {permissao.descricao}
              <button onClick={() => setEditando(permissao)} style={{ marginLeft: "10px" }}>Editar</button>
              <button onClick={() => excluir(permissao.id)} style={{ marginLeft: "5px" }}>Excluir</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PermissoesPage;
