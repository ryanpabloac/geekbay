"use client";

import { useState,useEffect , useRef } from 'react';
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

    const adicionarAoCarrinho = (produto: any) => {
        setCarrinho([...carrinho, produto]);

    };
return (
        <>
            {/* 1. Camada do Vídeo de Introdução */}
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

                    <button 
                        onClick={alternarSom}
                        className={styles.btnAcao}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '20px',
                            zIndex: 10002
                        }}
                    >
                        {isMuted ? '🔇' : '🔊'}
                    </button>

                    <button 
                        className={styles.btnAcao} 
                        style={{ position: 'absolute', bottom: '20px', right: '20px', width: 'auto' }}
                        onClick={() => setMostrarIntro(false)}
                    >
                        Pular Intro
                    </button>
                </div>
            )}

            
            <div 
                className={styles.corpo} 
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    minHeight: '100vh',
                    filter: mostrarIntro ? 'blur(10px)' : 'none', 
                    transition: 'filter 0.5s ease'
                }}
            >
                <header className={styles.cabecalho}>
                    <img src='/icone-GB.png' alt="Logo" className={styles.logo} />
                    <h1 className={styles.nomeCabecalho} style={{ marginRight: "100px" }}>GeekBay Store</h1>

                    <div style={{ display: 'flex', gap: '50px', alignItems: 'center' }}>
                        <Link href="/login" style={{ textDecoration: 'none', color: '#ff7004', marginLeft: '200px' }}>Login</Link>
                        <button onClick={() => setMostrarCarrinho(true)} className={styles.btnAcaoCarrinho} >
                            <img src="/carrinhoGB.png" alt="carrinho de compras" style={{ width: '20px' }} /> ({carrinho.length})
                        </button>
                    </div>
                </header>

                <main className={styles.mainContainer}>
                    <h2 style={{
                        color: 'black',
                        textAlign: 'center',
                        marginTop: '30px',
                        fontSize: '35px',
                        fontWeight: '600',
                        textShadow: '-1px -1px 0 #ff7004, 1px -1px 0 #ff7004, -1px 1px 0 #ff7004, 1px 1px 0 #ff7004'
                    }}> Explore o Multiverso Geek ! </h2>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        overflowX: 'auto',
                        gap: '30px',
                        padding: '20px',
                        width: '100%',
                        maxWidth: '1400px',
                        margin: '0 auto',
                    }}>
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
                        <div className={styles.modalConteudo}>
                            <h3>Seu Carrinho</h3>
                            {carrinho.length === 0 ? <p>Inventário vazio...</p> : (
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {carrinho.map((item, i) => (
                                        <li key={i} style={{ borderBottom: '1px solid #ccc', padding: '10px' }}>{item.nome} <br /> R$ {item.preco}</li>
                                    ))}
                                </ul>
                            )}
                            <button className={styles.btnAcao} onClick={() => setMostrarCarrinho(false)}>Continuar Comprando</button>
                            <Link href="/finalizarCompra" className={styles.btnAcao} style={{fontFamily:'sans-serif', textDecoration:'none', fontSize:'13px', fontWeight:'bold' }} >Finalizar Compra</Link>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}