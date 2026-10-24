import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import api from "../services/api";
import type { Permissao } from "../types/Permissao";
import Botao from "./Botao";

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
      if (!permissaoEditando) {
        setNome("");
        setDescricao("");
      }
    } catch {
      alert("Erro ao salvar permissão.");
    }
  }

  const campo =
    "rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none";

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 grid gap-3 rounded-lg bg-white p-4 shadow md:grid-cols-3"
    >
      <input
        className={campo}
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Nome da Permissão"
        required
      />
      <input
        className={campo}
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        placeholder="Descrição"
        required
      />
      <div className="flex gap-2">
        <Botao type="submit" className="w-full">
          {permissaoEditando ? "Salvar alterações" : "Cadastrar"}
        </Botao>
        {permissaoEditando && (
          <Botao type="button" variante="neutro" onClick={onPermissaoSalva}>
            Cancelar
          </Botao>
        )}
      </div>
    </form>
  );
}

export default PermissaoForm;
