import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import api from "../services/api";
import type { Produto } from "../types/Produto";
import type { Categoria } from "../types/Categoria";
import Botao from "./Botao";

interface ProdutoFormProps {
  onProdutoSalvo: () => void;
  produtoEditando?: Produto | null;
}

function ProdutoForm({ onProdutoSalvo, produtoEditando }: ProdutoFormProps) {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [categoriaId, setCategoriaId] = useState<number | "">("");
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    api.get<Categoria[]>("/categorias")
      .then((res) => setCategorias(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (produtoEditando) {
      setNome(produtoEditando.nome);
      setPreco(produtoEditando.preco.toString());
      setCategoriaId(produtoEditando.categoria?.id ?? "");
    } else {
      setNome("");
      setPreco("");
      setCategoriaId("");
    }
  }, [produtoEditando]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const dados: any = {
      nome,
      preco: parseFloat(preco.replace(",", ".")),
    };

    if (categoriaId) {
      dados.categoria = { id: categoriaId };
    } else {
      dados.categoria = null;
    }

    try {
      if (produtoEditando) {
        await api.put(`/produtos/${produtoEditando.id}`, dados);
      } else {
        await api.post("/produtos", dados);
      }
      onProdutoSalvo();
      if (!produtoEditando) {
        setNome("");
        setPreco("");
        setCategoriaId("");
      }
    } catch {
      alert("Erro ao salvar produto.");
    }
  }

  const campo =
    "rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none";

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 grid gap-3 rounded-lg bg-white p-4 shadow md:grid-cols-4"
    >
      <input
        className={campo}
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Nome do Produto"
        required
      />

      <div className="flex items-center rounded-md border border-gray-300 bg-white px-3 focus-within:border-blue-500">
        <span className="mr-2 font-medium text-gray-500 text-sm">R$</span>
        <input
          type="text"
          className="w-full py-2 text-sm outline-none"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          placeholder="0,00"
          required
        />
      </div>

      <select
        value={categoriaId}
        onChange={(e) => setCategoriaId(e.target.value ? Number(e.target.value) : "")}
        className={campo}
      >
        <option value="">Sem categoria (opcional)</option>
        {categorias.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.nome}
          </option>
        ))}
      </select>

      <div className="flex gap-2">
        <Botao type="submit" variante="primario" className="w-full">
          {produtoEditando ? "Salvar" : "Cadastrar"}
        </Botao>
        {produtoEditando && (
          <Botao type="button" variante="neutro" onClick={onProdutoSalvo}>
            Cancelar
          </Botao>
        )}
      </div>
    </form>
  );
}

export default ProdutoForm;
