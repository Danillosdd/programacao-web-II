import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import api from "../services/api";
import type { Categoria } from "../types/Categoria";
import Botao from "./Botao";

interface CategoriaFormProps {
  categoriaEditando: Categoria | null;
  onCategoriaSalva: () => void;
  onCancelar?: () => void;
}

function CategoriaForm({
  categoriaEditando,
  onCategoriaSalva,
  onCancelar,
}: CategoriaFormProps) {
  const [nome, setNome] = useState(categoriaEditando?.nome ?? "");
  const [descricao, setDescricao] = useState(categoriaEditando?.descricao ?? "");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    setNome(categoriaEditando?.nome ?? "");
    setDescricao(categoriaEditando?.descricao ?? "");
    setErro("");
  }, [categoriaEditando]);

  async function salvar(e: FormEvent) {
    e.preventDefault();
    if (!nome.trim()) {
      setErro("O nome da categoria é obrigatório.");
      return;
    }
    setErro("");
    setSalvando(true);

    try {
      if (categoriaEditando?.id) {
        await api.put(`/categorias/${categoriaEditando.id}`, {
          nome: nome.trim(),
          descricao: descricao.trim(),
        });
      } else {
        await api.post("/categorias", {
          nome: nome.trim(),
          descricao: descricao.trim(),
        });
      }
      setNome("");
      setDescricao("");
      onCategoriaSalva();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.erro ||
        "Erro ao salvar categoria. Verifique se o nome já existe.";
      setErro(msg);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <form
      onSubmit={salvar}
      className="mb-6 rounded-lg bg-white p-5 shadow border border-gray-100"
    >
      <h2 className="mb-3 text-lg font-bold text-gray-800">
        {categoriaEditando ? "Editar Categoria" : "Nova Categoria"}
      </h2>

      {erro && (
        <div className="mb-3 rounded bg-red-50 p-2.5 text-sm text-red-700 border border-red-200">
          {erro}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Nome da Categoria *
          </label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Informática, Papelaria..."
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Descrição
          </label>
          <input
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descrição breve da categoria"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Botao type="submit" variante="primario" disabled={salvando}>
          {salvando ? "Salvando..." : categoriaEditando ? "Atualizar Categoria" : "Cadastrar Categoria"}
        </Botao>
        {categoriaEditando && (
          <Botao type="button" variante="neutro" onClick={onCancelar}>
            Cancelar
          </Botao>
        )}
      </div>
    </form>
  );
}

export default CategoriaForm;
