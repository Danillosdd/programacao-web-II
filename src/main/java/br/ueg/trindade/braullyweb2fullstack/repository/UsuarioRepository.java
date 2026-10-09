package br.ueg.trindade.braullyweb2fullstack.repository;

import br.ueg.trindade.braullyweb2fullstack.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
}
