"use client"; 

import Link from 'next/link';
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
    const [mensagemModal, setMensagemModal] = useState(''); 
    const router = useRouter(); 
       
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
            const response = await fetch(`http://localhost:5000/clientes?email=${email}`); 
            const clientes: Cliente[] = await response.json();
            const clienteEncontrado = clientes[0];
    
            if (clienteEncontrado && clienteEncontrado.senha === senha) {
                setMensagemModal(`Bem-vindo de volta, ${clienteEncontrado.name}!`);
                
            
                setTimeout(() => {
                    router.push('/loja');
                }, 2000);
            } else {
                setMensagemModal("Email ou senha incorretos. Tente novamente, herói!");
            }
        } catch (error) {
            console.error("Erro ao conectar:", error);
            setMensagemModal("Erro no servidor. Verifique se o banco de dados está online!");
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
                        <h3 style={{ marginBottom: '40px', textAlign: 'center', fontWeight: 'bold' }}>
                            Faça seu login para mergulhar no mundo GEEK
                        </h3>
                        
                        <input 
                            className={styles.inputGroup} 
                            type="email" 
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        
                        <input 
                            className={styles.inputGroup} 
                            type="password" 
                            placeholder="Senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                        />

                        <button className={styles.btnAcao} onClick={handleLogin}>
                            Entrar
                        </button>

                        <Link href="/cadastro" style={{
                            marginTop: '20px',
                            color: '#ff7a00',
                            textDecoration: 'underline',
                            fontSize: '14px'
                        }}>
                            Ou cadastre-se aqui
                        </Link>
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











