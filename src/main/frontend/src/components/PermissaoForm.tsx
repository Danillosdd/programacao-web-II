import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import api from "../services/api";
import type { Permissao } from "../types/Permissao";

interface PermissaoFormProps {
  onPermissaoSalva: () => void;
  permissaoEditando?: Permissao | null;
}

function PermissaoForm({ onPermissaoSalva, permissaoEditando }: PermissaoFormProps) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    if (permissaoEditando) {
      setNome(permissaoEditando.nome);
      setDescricao(permissaoEditando.descricao);
    } else {
      setNome("");
      setDescricao("");
    }
  }, [permissaoEditando]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const dados = { nome, descricao };

    try {
      if (permissaoEditando) {
        await api.put(`/permissoes/${permissaoEditando.id}`, dados);
      } else {
        await api.post("/permissoes", dados);
      }
      onPermissaoSalva();
    } catch (error) {
      alert("Erro ao salvar permissão.");
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <input
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Nome da Permissão"
        required
      />
      <input
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        placeholder="Descrição"
        required
      />
      <button type="submit">
        {permissaoEditando ? "Salvar alterações" : "Cadastrar"}
      </button>
      {permissaoEditando && (
        <button type="button" onClick={onPermissaoSalva} style={{ marginLeft: "5px" }}>
          Cancelar
        </button>
      )}
    </form>
  );
}

export default PermissaoForm;
