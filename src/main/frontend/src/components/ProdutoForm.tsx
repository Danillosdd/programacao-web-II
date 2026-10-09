import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import api from "../services/api";
import type { Produto } from "../types/Produto";

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
    const dados = { nome, preco: parseFloat(preco) };

    try {
      if (produtoEditando) {
        await api.put(`/produtos/${produtoEditando.id}`, dados);
      } else {
        await api.post("/produtos", dados);
      }
      onProdutoSalvo();
    } catch (error) {
      alert("Erro ao salvar produto.");
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      <input
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        placeholder="Nome do Produto"
        required
      />
      <input
        type="number"
        step="0.01"
        value={preco}
        onChange={(e) => setPreco(e.target.value)}
        placeholder="Preço"
        required
      />
      <button type="submit">
        {produtoEditando ? "Salvar alterações" : "Cadastrar"}
      </button>
      {produtoEditando && (
        <button type="button" onClick={onProdutoSalvo} style={{ marginLeft: "5px" }}>
          Cancelar
        </button>
      )}
    </form>
  );
}

export default ProdutoForm;
