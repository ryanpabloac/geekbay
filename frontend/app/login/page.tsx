"use client"; 

import styles from '../../styles/Home.module.css';
import { useEffect, useState } from 'react'; 
import { useRouter } from 'next/navigation'; 


interface Cliente {
  id: number;
  name: string;   
  email: string;
  senha: string;  
}


const ModalAviso = ({ mensagem, aoFechar, aoConfirmar }: {
  mensagem: string,
  aoFechar: () => void,
  aoConfirmar?: () => void
}) => {
  if (!mensagem) return null;
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalConteudo}>
        <img src='/icone-GB.png' alt="Logo GeekBay" style={{ width: '60px', marginBottom: '10px' }} />
        <p>{mensagem}</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          {aoConfirmar ? (
            <>
              <button onClick={aoConfirmar} className={styles.btnAcao}>Sim, Excluir</button>
              <button onClick={aoFechar} className={styles.btnAcao} style={{ backgroundColor: '#757575' }}>Cancelar</button>
            </>
          ) : (
            <button onClick={aoFechar} className={styles.btnAcao}>OK</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [showCadastro, setShowCadastro] = useState(false);
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [telefone, setTelefone] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mensagemModal, setMensagemModal] = useState(''); 
    const router = useRouter(); 
       
    const temOitoCaracteres = senha.length >= 8;
    const temLetraMaiuscula = /[A-Z]/.test(senha);
    const temNumero = /[0-9]/.test(senha);
    const temSimbolo = /[!@#$%^&*(),.?":{}|<>]/.test(senha);

    useEffect(() => {
        document.body.style.backgroundImage = 'url("./bg-GeekBay.png")';
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundAttachment = 'fixed';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundColor = '#000';

        return () => {
            document.body.style.backgroundImage = '';
            document.body.style.backgroundSize = '';
            document.body.style.backgroundAttachment = '';
            document.body.style.backgroundPosition = '';
            document.body.style.backgroundColor = '';
        };
    }, []);

    const handleLogin = async () => {
        if (!email || !senha) {
            setMensagemModal("Por favor, preencha todos os campos!");
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, senha })
            });

            if (!response.ok) {
                const errText = await response.text();
                console.error('Login error:', errText);
                setMensagemModal('Email ou senha incorretos. Tente novamente!');
                return;
            }

            const data = await response.json().catch(() => null);
            console.log('Resposta do backend:', data);
            
            const token = data?.token ?? data?.jwt ?? data?.accessToken ?? null;
            console.log('Token extraído:', token);

            if (token) {
                localStorage.setItem('jwt_token', token);
                localStorage.setItem('usuario_logado', JSON.stringify({ email }));
                console.log('Token salvo no localStorage');
                
                // Extrai email do token para buscar role
                try {
                    const parts = token.split('.');
                    if (parts.length === 3) {
                        const payload = JSON.parse(atob(parts[1]));
                        const emailDoToken = payload.sub || payload.email || email;
                        console.log('Email extraído do token:', emailDoToken);
                        
                        // Busca dados do usuário com o email para obter a role
                        const responseUsuario = await fetch(
                            `http://localhost:8080/api/usuarios/email/${emailDoToken}`,
                            {
                                method: 'GET',
                                headers: {
                                    'Accept': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                }
                            }
                        );

                        if (responseUsuario.ok) {
                            const usuarioData = await responseUsuario.json();
                            console.log('Dados do usuário:', usuarioData);
                            
                            const perfil = usuarioData?.perfil || null;
                            console.log('Perfil do usuário:', perfil);

                            if (perfil === 'ADMIN') {
                                setMensagemModal('Login realizado com sucesso! Redirecionando...');
                                setTimeout(() => router.push('/'), 1200);
                            } else if (perfil === 'CLIENTE') {
                                setMensagemModal('Login realizado com sucesso! Redirecionando...');
                                setTimeout(() => router.push('/loja'), 1200);
                            } else {
                                setMensagemModal('Login realizado, mas perfil não identificado.');
                            }
                        } else {
                            console.error('Erro ao buscar usuário');
                            setMensagemModal('Erro ao buscar informações do usuário.');
                        }
                    }
                } catch (decodeError) {
                    console.error('Erro ao processar token:', decodeError);
                    setMensagemModal('Erro ao processar token.');
                }
            } else {
                setMensagemModal('Login realizado, mas não recebi token do servidor.');
                console.error('Nenhum token encontrado na resposta');
            }
        } catch (error) {
            console.error('Erro ao conectar:', error);
            setMensagemModal('Erro no servidor. Verifique se o backend está online!');
        }
    };

    const handleRegister = async () => {
        if (!nome || !cpf || !email || !telefone || !senha) {
            setMensagemModal('Por favor, preencha todos os campos de cadastro!');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    nome,
                    cpf,
                    email,
                    telefone,
                    senha
                })
            });

            if (!response.ok) {
                const errText = await response.text();
                console.error('Registro error:', errText);
                setMensagemModal('Erro ao registrar usuário. Verifique os dados.');
                return;
            }

            const data = await response.json().catch(() => null);
            console.log('Resposta do cadastro:', data);
            
            const token = data?.token ?? data?.jwt ?? data?.accessToken ?? null;
            console.log('Token extraído:', token);

            if (token) {
                localStorage.setItem('jwt_token', token);
                localStorage.setItem('usuario_logado', JSON.stringify({ nome, email }));
                console.log('Token salvo no localStorage');
                
                // Extrai email do token para buscar role
                try {
                    const parts = token.split('.');
                    if (parts.length === 3) {
                        const payload = JSON.parse(atob(parts[1]));
                        const emailDoToken = payload.sub || payload.email || email;
                        console.log('Email extraído do token:', emailDoToken);
                        
                        // Busca dados do usuário com o email para obter a role
                        const responseUsuario = await fetch(
                            `http://localhost:8080/api/usuarios/email/${emailDoToken}`,
                            {
                                method: 'GET',
                                headers: {
                                    'Accept': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                }
                            }
                        );

                        if (responseUsuario.ok) {
                            const usuarioData = await responseUsuario.json();
                            console.log('Dados do usuário:', usuarioData);
                            
                            const perfil = usuarioData?.perfil || null;
                            console.log('Perfil do usuário:', perfil);

                            setMensagemModal('Registro realizado com sucesso! Redirecionando...');
                            // Novo usuário normalmente é CLIENTE
                            setTimeout(() => router.push('/loja'), 1200);
                        } else {
                            console.error('Erro ao buscar usuário');
                            setMensagemModal('Registro realizado, mas erro ao buscar informações.');
                            setTimeout(() => router.push('/loja'), 1200);
                        }
                    }
                } catch (decodeError) {
                    console.error('Erro ao processar token:', decodeError);
                    setMensagemModal('Registro realizado, mas erro ao processar token.');
                    setTimeout(() => router.push('/loja'), 1200);
                }
            } else {
                setMensagemModal('Usuário criado, mas não recebi token do servidor.');
                console.error('Nenhum token encontrado na resposta de cadastro');
            }
        } catch (error) {
            console.error('Erro ao registrar:', error);
            setMensagemModal('Erro no servidor ao registrar. Tente novamente mais tarde.');
        }
    };

    return (
        <main>
            <header className={styles.cabecalho} style={{width:'100%'}}>
                <img src='/icone-GB.png' alt="Logo GeekBay" className={styles.logo} />
                <h1 className={styles.nomeCabecalho}>GeekBay</h1>
            </header>
            
            <div className={styles.corpo} style={{
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                minHeight: '100vh',
                display: 'flex',
                flexDirection:'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px'
            }}>

                <div style={{
                    display: 'flex',
                    gap: '40px',
                    maxWidth: '900px',
                    width: '100%',
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                }}>
                    
                    <div style={{
                        flex: '1',
                        minWidth: '300px',
                        backgroundColor: '#fff',
                        padding: '40px',
                        borderRadius: '15px',
                        border: '4px solid #ff7a00', 
                        textAlign: 'center'
                    }}>
                        <img src="/icone-GB.png" alt="Logo" style={{ width: '80px', marginBottom: '20px' }} />
                        <h2 style={{ color: '#ff7a00', fontSize: '24px', fontWeight: 'bold' }}>Bem vindo(a) ao GeekBay !</h2>
                        <p style={{ margin: '20px 0', color: '#333', fontWeight: 'bold' }}>Entre no universo geek que você ama.</p>
                        <p style={{ color: '#666', fontSize: '14px' }}>Descubra produtos épicos...</p>
                    </div>

                    
                    <div style={{
                        flex: '1',
                        minWidth: '300px',
                        backgroundColor: '#fff',
                        padding: '40px',
                        borderRadius: '15px',
                        border: '4px solid #ff7a00',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        {!showCadastro ? (
                            <>
                                <h3 style={{ marginBottom: '24px', textAlign: 'center', fontWeight: 'bold' }}>
                                    Faça seu login para mergulhar no mundo GEEK
                                </h3>

                                <input
                                    className={styles.inputGroup}
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />

                                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                    <input
                                        className={styles.inputGroup}
                                        type={mostrarSenha ? 'text' : 'password'}
                                        placeholder="Senha"
                                        value={senha}
                                        onChange={(e) => setSenha(e.target.value)}
                                        style={{ flex: 1 }}
                                    />
                                    <button type="button" onClick={() => setMostrarSenha(!mostrarSenha)} aria-label="Alternar visibilidade da senha" style={{ marginLeft: '8px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '18px' }}>
                                        {mostrarSenha ? '🙈' : '👁️'}
                                    </button>
                                </div>

                                <div style={{ alignSelf: 'flex-start', marginBottom: '20px' }}>
                                    <p style={{ fontSize: '10px', color: temOitoCaracteres ? '#ff7a00' : '#999', margin: '2px 0' }}>
                                        {temOitoCaracteres ? '✓' : '○'} Mínimo de 8 caracteres
                                    </p>
                                    <p style={{ fontSize: '10px', color: temLetraMaiuscula ? '#ff7a00' : '#999', margin: '2px 0' }}>
                                        {temLetraMaiuscula ? '✓' : '○'} Pelo menos uma letra maiúscula
                                    </p>
                                    <p style={{ fontSize: '10px', color: temNumero ? '#ff7a00' : '#999', margin: '2px 0' }}>
                                        {temNumero ? '✓' : '○'} Pelo menos um número
                                    </p>
                                    <p style={{ fontSize: '10px', color: temSimbolo ? '#ff7a00' : '#999', margin: '2px 0' }}>
                                        {temSimbolo ? '✓' : '○'} Pelo menos um símbolo (!@#...)
                                    </p>
                                </div>

                                <button className={styles.btnAcao} onClick={handleLogin}>
                                    Entrar
                                </button>

                                <button onClick={() => router.push('/cadastro')} style={{
                                    marginTop: '20px',
                                    color: '#ff7a00',
                                    background: 'transparent',
                                    border: 'none',
                                    textDecoration: 'underline',
                                    fontSize: '14px',
                                    cursor: 'pointer'
                                }}>
                                    Ou cadastre-se aqui
                                </button>
                            </>
                        ) : (
                            <>
                                <h3 style={{ marginBottom: '24px', textAlign: 'center', fontWeight: 'bold' }}>
                                    Crie sua conta GeekBay
                                </h3>

                                <input
                                    className={styles.inputGroup}
                                    type="text"
                                    placeholder="Nome"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                />

                                <input
                                    className={styles.inputGroup}
                                    type="text"
                                    placeholder="CPF"
                                    value={cpf}
                                    onChange={(e) => setCpf(e.target.value)}
                                />

                                <input
                                    className={styles.inputGroup}
                                    type="text"
                                    placeholder="Telefone"
                                    value={telefone}
                                    onChange={(e) => setTelefone(e.target.value)}
                                />

                                <input
                                    className={styles.inputGroup}
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />

                                <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                    <input
                                        className={styles.inputGroup}
                                        type={mostrarSenha ? 'text' : 'password'}
                                        placeholder="Senha"
                                        value={senha}
                                        onChange={(e) => setSenha(e.target.value)}
                                        style={{ flex: 1 }}
                                    />
                                    <button type="button" onClick={() => setMostrarSenha(!mostrarSenha)} aria-label="Alternar visibilidade da senha" style={{ marginLeft: '8px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '18px' }}>
                                        {mostrarSenha ? '🙈' : '👁️'}
                                    </button>
                                </div>

                                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                                    <button className={styles.btnAcao} onClick={handleRegister}>
                                        Cadastrar
                                    </button>
                                    <button className={styles.btnAcao} style={{ backgroundColor: '#757575' }} onClick={() => setShowCadastro(false)}>
                                        Voltar
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            
            <ModalAviso 
                mensagem={mensagemModal} 
                aoFechar={() => setMensagemModal('')} 
            />
        </main>
    );
}











