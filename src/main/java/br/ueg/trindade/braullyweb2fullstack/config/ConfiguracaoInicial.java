package br.ueg.trindade.braullyweb2fullstack.config;

import java.util.HashSet;
import java.util.Set;
import java.util.regex.Pattern;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import br.ueg.trindade.braullyweb2fullstack.model.Permissao;
import br.ueg.trindade.braullyweb2fullstack.model.Usuario;
import br.ueg.trindade.braullyweb2fullstack.repository.PermissaoRepository;
import br.ueg.trindade.braullyweb2fullstack.repository.UsuarioRepository;

@Configuration
public class ConfiguracaoInicial {

    private static final Pattern HASH_BCRYPT = Pattern.compile("^\\$2[aby]\\$\\d{2}\\$.{53}$");

    @Bean
    CommandLineRunner carregarDados(UsuarioRepository usuarios,
            PermissaoRepository permissoes, PasswordEncoder encoder) {
        return args -> {
            Permissao admin = buscarOuCriarPermissao(permissoes, "ADMIN", "Acesso total");
            Permissao user = buscarOuCriarPermissao(permissoes, "USER", "Acesso comum");

            criarOuAtualizarUsuario(usuarios, encoder, "Admin", "admin", "admin123",
                    "admin@ueg.br", Set.of(admin, user));
            criarOuAtualizarUsuario(usuarios, encoder, "João", "joao", "joao123",
                    "joao@ueg.br", Set.of(user));

            // Senhas gravadas em texto puro por versões anteriores passam a ser hash.
            usuarios.findAll().forEach(usuario -> {
                if (usuario.getSenha() != null && !ehHashBcrypt(usuario.getSenha())) {
                    usuario.setSenha(encoder.encode(usuario.getSenha()));
                    usuarios.save(usuario);
                }
            });
        };
    }

    private Permissao buscarOuCriarPermissao(PermissaoRepository permissoes,
            String nome, String descricao) {
        return permissoes.findByNome(nome)
                .orElseGet(() -> permissoes.save(new Permissao(nome, descricao)));
    }

    private void criarOuAtualizarUsuario(UsuarioRepository usuarios, PasswordEncoder encoder,
            String nome, String username, String senha, String email, Set<Permissao> permissoes) {

        Usuario usuario = usuarios.findByUsername(username).orElseGet(() -> {
            Usuario novo = new Usuario(nome, username, encoder.encode(senha), email);
            novo.setPermissoes(new HashSet<>(permissoes));
            return usuarios.save(novo);
        });

        if (usuario.getSenha() == null || !ehHashBcrypt(usuario.getSenha())) {
            usuario.setSenha(encoder.encode(senha));
            usuarios.save(usuario);
        }
    }

    private boolean ehHashBcrypt(String senha) {
        return HASH_BCRYPT.matcher(senha).matches();
    }
}
