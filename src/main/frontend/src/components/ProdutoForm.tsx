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
      <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "6px", padding: "0 12px", marginBottom: "12px" }}>
        <span style={{ color: "var(--text)", fontWeight: "bold" }}>R$</span>
        <input
          type="text"
          value={preco}
          onChange={(e) => setPreco(e.target.value)}
          placeholder="0,00"
          required
          style={{ border: "none", outline: "none", padding: "10px 0", width: "100%", background: "transparent", color: "var(--text-h)" }}
        />
      </div>
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
