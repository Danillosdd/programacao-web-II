package br.ueg.trindade.braullyweb2fullstack.repository;

import br.ueg.trindade.braullyweb2fullstack.model.Pedido;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByUsuarioId(Long usuarioId);
    List<Pedido> findByStatus(String status);
}
