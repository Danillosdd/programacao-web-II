import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import api from "../services/api";
import type { Pedido } from "../types/Pedido";
import type { Produto } from "../types/Produto";
import type { Usuario } from "../types/Usuario";
import { obterSessao, temPapel } from "../services/auth";
import Botao from "./Botao";

interface PedidoFormProps {
  pedidoEditando: Pedido | null;
  onPedidoSalvo: () => void;
  onCancelar?: () => void;
}

function PedidoForm({
  pedidoEditando,
  onPedidoSalvo,
  onCancelar,
}: PedidoFormProps) {
  const [produtosDisponiveis, setProdutosDisponiveis] = useState<Produto[]>([]);
  const [usuariosDisponiveis, setUsuariosDisponiveis] = useState<Usuario[]>([]);
  const [produtosSelecionados, setProdutosSelecionados] = useState<number[]>([]);
  const [usuarioId, setUsuarioId] = useState<number | "">("");
  const [status, setStatus] = useState(pedidoEditando?.status ?? "PENDENTE");
  const [observacoes, setObservacoes] = useState(pedidoEditando?.observacoes ?? "");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  const isAdmin = temPapel("ADMIN");
  const sessao = obterSessao();

  useEffect(() => {
    // Carregar produtos disponíveis
    api.get<Produto[]>("/produtos")
      .then((res) => setProdutosDisponiveis(res.data))
      .catch(() => {});

    // Carregar usuários se for admin
    if (isAdmin) {
      api.get<Usuario[]>("/usuarios")
        .then((res) => setUsuariosDisponiveis(res.data))
        .catch(() => {});
    }
  }, [isAdmin]);

  useEffect(() => {
    if (pedidoEditando) {
      setStatus(pedidoEditando.status);
      setObservacoes(pedidoEditando.observacoes ?? "");
      setUsuarioId(pedidoEditando.usuario?.id ?? "");
      setProdutosSelecionados(pedidoEditando.produtos?.map((p) => p.id) ?? []);
    } else {
      setStatus("PENDENTE");
      setObservacoes("");
      setProdutosSelecionados([]);
      setUsuarioId("");
    }
  }, [pedidoEditando]);

  function toggleProduto(id: number) {
    if (produtosSelecionados.includes(id)) {
      setProdutosSelecionados(produtosSelecionados.filter((pId) => pId !== id));
    } else {
      setProdutosSelecionados([...produtosSelecionados, id]);
    }
  }

  // Cálculo dinâmico do total
  const valorTotalCalculado = produtosDisponiveis
    .filter((p) => produtosSelecionados.includes(p.id))
    .reduce((acc, p) => acc + (p.preco ?? 0), 0);

  async function salvar(e: FormEvent) {
    e.preventDefault();
    if (produtosSelecionados.length === 0 && !pedidoEditando) {
      setErro("Selecione pelo menos um produto para o pedido.");
      return;
    }
    setErro("");
    setSalvando(true);

    try {
      if (pedidoEditando?.id) {
        await api.put(`/pedidos/${pedidoEditando.id}`, {
          status,
          observacoes,
          valorTotal: valorTotalCalculado > 0 ? valorTotalCalculado : pedidoEditando.valorTotal,
        });
      } else {
        const payload: any = {
          status,
          observacoes,
          valorTotal: valorTotalCalculado,
          produtos: produtosSelecionados.map((id) => ({ id })),
        };

        if (usuarioId) {
          payload.usuario = { id: usuarioId };
        }

        await api.post("/pedidos", payload);
      }

      onPedidoSalvo();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.response?.data?.erro || "Erro ao salvar pedido.";
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
        {pedidoEditando ? `Editar Pedido #${pedidoEditando.id}` : "Novo Pedido de Venda"}
      </h2>

      {erro && (
        <div className="mb-3 rounded bg-red-50 p-2.5 text-sm text-red-700 border border-red-200">
          {erro}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {isAdmin && !pedidoEditando && usuariosDisponiveis.length > 0 && (
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Cliente / Usuário
            </label>
            <select
              value={usuarioId}
              onChange={(e) => setUsuarioId(Number(e.target.value))}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              <option value="">Selecione um cliente (ou atual: {sessao?.nome})</option>
              {usuariosDisponiveis.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nome} ({u.username})
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Status do Pedido
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="PENDENTE">PENDENTE (Aguardando Pagamento)</option>
            <option value="PAGO">PAGO (Confirmado)</option>
            <option value="CANCELADO">CANCELADO</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Observações do Pedido
          </label>
          <input
            type="text"
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            placeholder="Ex: Entrega prioritária, nota fiscal para CNPJ, etc."
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {!pedidoEditando && (
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Selecione os Produtos do Pedido:
          </label>
          {produtosDisponiveis.length === 0 ? (
            <p className="text-sm text-gray-400">Nenhum produto cadastrado para seleção.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto p-2 border rounded-md bg-gray-50">
              {produtosDisponiveis.map((prod) => {
                const checked = produtosSelecionados.includes(prod.id);
                return (
                  <label
                    key={prod.id}
                    className={`flex items-center gap-2 p-2 rounded cursor-pointer border text-sm transition-colors ${
                      checked
                        ? "bg-blue-50 border-blue-400 text-blue-900"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleProduto(prod.id)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1 truncate">
                      <span className="font-medium">{prod.nome}</span>
                      <span className="block text-xs text-gray-500">
                        R$ {prod.preco?.toFixed(2).replace(".", ",")}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          )}

          <div className="mt-3 text-right">
            <span className="text-sm text-gray-600 mr-2">Total Estimado:</span>
            <span className="text-xl font-bold text-emerald-600">
              R$ {valorTotalCalculado.toFixed(2).replace(".", ",")}
            </span>
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Botao type="submit" variante="primario" disabled={salvando}>
          {salvando ? "Processando..." : pedidoEditando ? "Atualizar Status" : "Emitir Pedido"}
        </Botao>
        {pedidoEditando && (
          <Botao type="button" variante="neutro" onClick={onCancelar}>
            Cancelar
          </Botao>
        )}
      </div>
    </form>
  );
}

export default PedidoForm;
