import type { Usuario } from "./Usuario";
import type { Produto } from "./Produto";

export interface Pedido {
  id: number;
  dataPedido?: string;
  status: string;
  valorTotal: number;
  observacoes?: string;
  usuario?: Usuario;
  produtos?: Produto[];
}
