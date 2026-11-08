package br.ueg.trindade.braullyweb2fullstack.repository;

import br.ueg.trindade.braullyweb2fullstack.model.Categoria;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
    Optional<Categoria> findByNome(String nome);
    boolean existsByNomeIgnoreCase(String nome);
}
