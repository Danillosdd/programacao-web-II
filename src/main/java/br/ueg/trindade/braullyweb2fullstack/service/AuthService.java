package br.ueg.trindade.braullyweb2fullstack.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.ueg.trindade.braullyweb2fullstack.model.Permissao;
import br.ueg.trindade.braullyweb2fullstack.model.Usuario;
import br.ueg.trindade.braullyweb2fullstack.repository.UsuarioRepository;
import br.ueg.trindade.braullyweb2fullstack.security.JwtUtil;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Transactional(readOnly = true)
    public LoginResposta login(String username, String senha) {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Credenciais inválidas"));

        if (usuario.getSenha() == null
                || !passwordEncoder.matches(senha, usuario.getSenha())) {
            throw new RuntimeException("Credenciais inválidas");
        }

        List<String> permissoes = usuario.getPermissoes().stream()
                .map(Permissao::getNome)
                .toList();

        return new LoginResposta(jwtUtil.gerarToken(usuario), usuario.getNome(), permissoes);
    }

    public record LoginResposta(String token, String nome, List<String> permissoes) {
    }
}
