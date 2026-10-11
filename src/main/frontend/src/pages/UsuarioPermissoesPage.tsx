import { useEffect, useState } from "react";
import api from "../services/api";
import type { Usuario } from "../types/Usuario";
import type { Permissao } from "../types/Permissao";

function UsuarioPermissoesPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [permissoes, setPermissoes] = useState<Permissao[]>([]);
  const [usuarioId, setUsuarioId] = useState<number | null>(null);
  const [idsSelecionados, setIdsSelecionados] = useState<number[]>([]);

  useEffect(() => {
    api.get<Usuario[]>("/usuarios").then((r) => setUsuarios(r.data));
    api.get<Permissao[]>("/permissoes").then((r) => setPermissoes(r.data));
  }, []);

  function selecionarUsuario(id: number) {
    setUsuarioId(id);
    api.get<Usuario>(`/usuarios/${id}/permissoes`).then((r) => {
      setIdsSelecionados(r.data.permissoes?.map((p) => p.id) ?? []);
    });
  }

  function alternarPermissao(id: number) {
    setIdsSelecionados((prev) =>
      prev.includes(id)
        ? prev.filter((p) => p !== id)
        : [...prev, id]
    );
  }

  async function salvar() {
    if (usuarioId === null) return;
    try {
      await api.put(`/usuarios/${usuarioId}/permissoes`, idsSelecionados);
      alert("Permissões salvas!");
    } catch (error) {
      alert("Erro ao salvar permissões.");
    }
  }

  return (
    <div>
      <h2>Atribuir Permissões</h2>
      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>
          Usuário:
        </label>
        <select
          value={usuarioId ?? ""}
          onChange={(e) => {
            const val = e.target.value;
            if (val) {
              selecionarUsuario(Number(val));
            } else {
              setUsuarioId(null);
              setIdsSelecionados([]);
            }
          }}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "6px",
            background: "var(--bg-card)",
            color: "var(--text)",
            border: "1px solid var(--border)",
            fontSize: "1rem"
          }}
        >
          <option value="">Selecione...</option>
          {usuarios.map((u) => (
            <option key={u.id} value={u.id}>
              {u.nome} ({u.username})
            </option>
          ))}
        </select>
      </div>

      <fieldset
        style={{
          border: "1px solid var(--border)",
          borderRadius: "8px",
          padding: "16px",
          marginBottom: "20px",
          background: "var(--bg-card)"
        }}
      >
        <legend style={{ fontWeight: "bold", padding: "0 8px" }}>Permissões</legend>
        {permissoes.length === 0 ? (
          <p style={{ color: "var(--text)" }}>Nenhuma permissão cadastrada.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {permissoes.map((p) => (
              <label
                key={p.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: usuarioId ? "pointer" : "not-allowed",
                  opacity: usuarioId ? 1 : 0.6
                }}
              >
                <input
                  type="checkbox"
                  checked={idsSelecionados.includes(p.id)}
                  onChange={() => alternarPermissao(p.id)}
                  disabled={usuarioId === null}
                  style={{ width: "18px", height: "18px", cursor: usuarioId ? "pointer" : "not-allowed" }}
                />
                <span>
                  <strong>{p.nome}</strong> — {p.descricao}
                </span>
              </label>
            ))}
          </div>
        )}
      </fieldset>

      <button onClick={salvar} disabled={usuarioId === null}>
        Salvar permissões
      </button>
    </div>
  );
}

export default UsuarioPermissoesPage;
