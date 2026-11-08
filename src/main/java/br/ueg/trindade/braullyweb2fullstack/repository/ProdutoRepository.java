package br.ueg.trindade.braullyweb2fullstack.repository;

import br.ueg.trindade.braullyweb2fullstack.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    Optional<Produto> findByNome(String nome);
}
