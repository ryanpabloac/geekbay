"use client";

import { useState, useEffect, useRef } from 'react';
import styles from '../../styles/Home.module.css';
import Link from 'next/link';

export default function Loja() {
    const [produtos, setProdutos] = useState<any[]>([]);
    const [carrinho, setCarrinho] = useState<any[]>([]);
    const [mostrarCarrinho, setMostrarCarrinho] = useState(false);
    const [mostrarIntro, setMostrarIntro] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);
    

    useEffect(() => {
        listarProdutosLoja();
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

    const alternarSom = () => {
        if (videoRef.current) {
            const novoEstadoMuto = !videoRef.current.muted;
            videoRef.current.muted = novoEstadoMuto;
            setIsMuted(novoEstadoMuto);
        }
    };

    const listarProdutosLoja = async () => {
        try {
            const response = await fetch('http://localhost:5000/produtos');
            const dados = await response.json();
            setProdutos(dados);
        } catch (error) {
            console.error("Erro ao carregar vitrine.");
        }
    };

    // --- FUNÇÕES DO CARRINHO ---

    const adicionarAoCarrinho = (produto: any) => {
    setCarrinho((carrinhoAtual) => {
        let novoCarrinho;
        const itemExistente = carrinhoAtual.find((item) => item.id === produto.id);

        if (itemExistente) {
            novoCarrinho = carrinhoAtual.map((item) =>
                item.id === produto.id 
                ? { ...item, quantidade: (item.quantidade || 1) + 1 } 
                : item
            );
        } else {
            novoCarrinho = [...carrinhoAtual, { ...produto, quantidade: 1 }];
        }

        
        localStorage.setItem('geekbay_cart', JSON.stringify(novoCarrinho));
        return novoCarrinho;
    });
};

    const removerDoCarrinho = (id: string) => {
        setCarrinho(carrinho.filter(item => item.id !== id));
    };

    const calcularTotal = () => {
        return carrinho.reduce((acc, item) => {
            
            const precoLimpo = typeof item.preco === 'string' 
                ? parseFloat(item.preco.replace(',', '.')) 
                : item.preco;
            return acc + (precoLimpo * (item.quantidade || 1));
        }, 0);
    };

    return (
        <>
            
            {mostrarIntro && (
                <div className={styles.introOverlay}>
                    <video 
                        className={styles.videoIntro}
                        autoPlay 
                        muted={isMuted} 
                        ref={videoRef}
                        onEnded={() => setMostrarIntro(false)}
                        style={{width: '50%'}}
                    >
                        <source src="/intro-GeekBay (1).mp4" type="video/mp4" />
                        Seu navegador não suporta vídeos.
                    </video>

                    <button onClick={alternarSom} className={styles.btnAcao} style={{ position: 'absolute', top: '20px', right: '20px', width: '60px', height: '60px', borderRadius: '50%', zIndex: 10002 }}>
                        {isMuted ? '🔇' : '🔊'}
                    </button>

                    <button className={styles.btnAcao} style={{ position: 'absolute', bottom: '20px', right: '20px', width: 'auto' }} onClick={() => setMostrarIntro(false)}>
                        Pular Intro
                    </button>
                </div>
            )}

            <div className={styles.corpo} style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', minHeight: '100vh', filter: mostrarIntro ? 'blur(10px)' : 'none', transition: 'filter 0.5s ease' }}>
                <header className={styles.cabecalho}>
                    <img src='/icone-GB.png' alt="Logo" className={styles.logo} />
                    <h1 className={styles.nomeCabecalho} style={{ marginRight: "100px" }}>GeekBay Store</h1>
                    <div style={{ display: 'flex', gap: '50px', alignItems: 'center' }}>
                        <Link href="/login" style={{ textDecoration: 'none', color: '#ff7004', marginLeft: '200px' }}>Login</Link>
                        <button onClick={() => setMostrarCarrinho(true)} className={styles.btnAcaoCarrinho} >
                            <img src="/carrinhoGB.png" alt="carrinho" style={{ width: '20px' }} /> ({carrinho.reduce((acc, i) => acc + (i.quantidade || 1), 0)})
                        </button>
                    </div>
                </header>

                <main className={styles.mainContainer}>
                    <h2 style={{ color: 'black', textAlign: 'center', marginTop: '30px', fontSize: '35px', fontWeight: '600', textShadow: '-1px -1px 0 #ff7004, 1px -1px 0 #ff7004, -1px 1px 0 #ff7004, 1px 1px 0 #ff7004' }}> Explore o Multiverso Geek ! </h2>
                    <div style={{ display: 'flex', flexDirection: 'row', overflowX: 'auto', gap: '30px', padding: '20px', width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
                        {produtos.map((p) => (
                            <section key={p.id} className={styles.card} style={{ textAlign: 'center', minWidth: '280px', flexShrink: 0 }}>
                                <img src={p.img || '/icone-GB.png'} alt={p.nome} style={{ height: '130px', objectFit: 'contain', borderRadius: '8px' }} />
                                <h3 style={{ marginTop: '15px', fontSize: '16px' }}>{p.nome}</h3>
                                <p style={{ color: '#757575', fontSize: '14px' }}>{p.categoria}</p>
                                <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#ff7a00' }}>R$ {p.preco}</p>
                                <button className={styles.btnAcao} style={{ width: '100%', marginTop: '10px' }} onClick={() => adicionarAoCarrinho(p)}>
                                    Adicionar ao Inventário
                                </button>
                            </section>
                        ))}
                    </div>
                </main>

                
                {mostrarCarrinho && (
                    <div className={styles.modalOverlay}>
                        <div className={styles.modalConteudo} style={{ maxWidth: '600px' }}>
                            <h3 style={{ color: '#ff7a00', fontSize: '24px' }}>Seu Inventário</h3>
                            {carrinho.length === 0 ? <p>O multiverso está vazio...</p> : (
                                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    <table className={styles.tabelaContainer} style={{ width: '100%',background: '#fff' }}>
                                        <thead style={{background: '#fff'}}>
                                            <tr>
                                                <th>Item</th>
                                                <th>Qtd</th>
                                                <th>Preço</th>
                                                <th>Remover</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {carrinho.map((item, index) => (
                                                <tr key={item.id || index}>
                                                    <td>{item.nome}</td>
                                                    <td>{item.quantidade}</td>
                                                    <td>R$ {item.preco}</td>
                                                    <td>
                                                        <button onClick={() => removerDoCarrinho(item.id)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>❌</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                            <div style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                                <strong>Total: R$ {calcularTotal().toFixed(2)}</strong>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                <button className={styles.btnAcao} onClick={() => setMostrarCarrinho(false)}>Continuar</button>
                                <Link href="/finalizarCompra" className={styles.btnAcao} style={{ textDecoration: 'none', textAlign: 'center', fontFamily:'sans-serif', fontSize:'13px', fontWeight:'bold' }}>Finalizar</Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
        
    );
}













