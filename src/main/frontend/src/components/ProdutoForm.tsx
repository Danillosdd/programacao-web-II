import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import api from "../services/api";
import type { Produto } from "../types/Produto";
import Botao from "./Botao";

interface ProdutoFormProps {
  onProdutoSalvo: () => void;
  produtoEditando?: Produto | null;
}

function ProdutoForm({ onProdutoSalvo, produtoEditando }: ProdutoFormProps) {
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");

  useEffect(() => {
    if (produtoEditando) {
      setNome(produtoEditando.nome);
      setPreco(produtoEditando.preco.toString());
    } else {
      setNome("");
      setPreco("");
    }
  }, [produtoEditando]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const dados = { nome, preco: parseFloat(preco.replace(",", ".")) };

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
      }
    } catch {
      alert("Erro ao salvar produto.");
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
        placeholder="Nome do Produto"
        required
      />
      <div className="flex items-center rounded-md border border-gray-300 bg-white px-3 focus-within:border-blue-500">
        <span className="mr-2 font-medium text-gray-500">R$</span>
        <input
          type="text"
          className="w-full py-2 outline-none"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          placeholder="0,00"
          required
        />
      </div>
      <div className="flex gap-2">
        <Botao type="submit" className="w-full">
          {produtoEditando ? "Salvar alterações" : "Cadastrar"}
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
