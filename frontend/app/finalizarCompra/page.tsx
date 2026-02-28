"use client";

import { useState, useEffect } from 'react';
import styles from '../../styles/Home.module.css';
import Link from 'next/link';

export default function FinalizarCompra() {
    const [itensCarrinho, setItensCarrinho] = useState<any[]>([]);
    const [cep, setCep] = useState('');
    const [frete, setFrete] = useState(0);
    const [mostrarAgradecimento, setMostrarAgradecimento] = useState(false);

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
    

    
    useEffect(() => {
        
        const dadosSalvos = localStorage.getItem('geekbay_cart');
        if (dadosSalvos) setItensCarrinho(JSON.parse(dadosSalvos));
    }, []);

    const calcularSubtotal = () => {
        return itensCarrinho.reduce((acc, item) => {
            const preco = typeof item.preco === 'string' 
                ? parseFloat(item.preco.replace(',', '.')) 
                : item.preco;
            return acc + (preco * (item.quantidade || 1));
        }, 0);
    };

    const confirmarCompra = () => {
        setItensCarrinho([]);
        localStorage.removeItem('geekbay_cart');
        setMostrarAgradecimento(true);
    };

    const totalGeral = calcularSubtotal() + frete;

    return (
   <div className={styles.corpo} style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', minHeight: '100vh' }}>
                   <header className={styles.cabecalho}>
                       <img src='/icone-GB.png' alt="Logo" className={styles.logo} />
                       <h1 className={styles.nomeCabecalho} style={{ marginRight: "100px" }}>GeekBay Store</h1>
                       <div style={{ display: 'flex', gap: '50px', alignItems: 'center' }}>
                           <Link href="/login" style={{ textDecoration: 'none', color: '#ff7004', marginLeft: '200px' }}>Login</Link>
                       </div>
                   </header>

            <main style={{ maxWidth: '900px', margin: '0 auto', width: '100%', backgroundColor:'' }}>
                <h2 style={{ color: '#FF7A00', textAlign: 'center', margin: '30px 0', textTransform: 'uppercase' }}>
                    Este é o seu carrinho de compras
                </h2>

            
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {itensCarrinho.map((item, index) => (
                        <div key={index} style={{ 
                            display: 'flex', 
                            backgroundColor: '#fff', 
                            borderRadius: '15px', 
                            border: '2px solid #FF7A00', 
                            padding: '15px',
                            gap: '20px'
                        }}>
                            <img src={item.img} alt={item.nome} style={{ width: '120px', height: '120px', objectFit: 'contain', border: '1px solid #FF7A00', borderRadius: '10px' }} />
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '18px', marginBottom: '5px' }}>{item.nome}</h3>
                                <p style={{ fontSize: '12px', color: '#666' }}><strong>Especificações Técnicas:</strong> {item.descricao}</p>
                                <div style={{ textAlign: 'right', marginTop: '10px' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '20px' }}>R${item.preco}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                
                <div style={{ 
                    marginTop: '30px', 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '20px',
                    backgroundColor: '#fff',
                    padding: '25px',
                    borderRadius: '15px',
                    border: '2px solid #FF7A00'
                }}>
                    <div>
                        <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>Vamos calcular o frete?</p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input 
                                type="text" 
                                placeholder="Insira seu CEP aqui" 
                                value={cep}
                                onChange={(e) => setCep(e.target.value)}
                                style={{ padding: '10px', borderRadius: '10px', border: '1px solid #ccc', flex: 1 }} 
                            />
                            <button className={styles.btnAcao} style={{ margin: 0, width: 'auto' }} onClick={() => setFrete(26.00)}>
                                Calcular
                            </button>
                        </div>
                        <img src="/balao-Frete.png" alt="Mascote" style={{ width: '250px', marginTop: '20px' }} />
                    </div>

                    <div style={{ borderLeft: '1px solid #ddd', paddingLeft: '20px' }}>
                        <p style={{ fontWeight: 'bold', marginBottom: '15px' }}>Opções de Envio</p>
                        <div style={{ fontSize: '14px', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span>1. PAC (Econômico)</span>
                                <span>R$ 26,00</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>2. SEDEX (Expresso)</span>
                                <span>R$ 54,90</span>
                            </div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <h3 style={{ fontSize: '18px', marginBottom: '15px' }}>TOTAL (com frete): R$ {totalGeral.toFixed(2)}</h3>
                            <button className={styles.btnAcao} style={{ width: '100%', fontSize: '16px' }} onClick={confirmarCompra}>
                                Finalizar compra
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {mostrarAgradecimento && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalConteudo} style={{ border: '5px solid #FF7A00', textAlign: 'center' }}>
                        <h2 style={{ color: '#FF7A00', fontFamily: 'Orbitron' }}> MISSÃO CUMPRIDA!</h2>
                        <img src="/icone-GB.png" alt="Mascote" style={{ width: '100px', marginTop: '20px' }} className={styles.logoPulsante} />
                        <p style={{ fontSize: '18px', fontWeight: 'bold' }}>Obrigado, Player 1!</p>
                        <p>Seu pedido foi processado no multiverso.</p>
                        <Link href="/loja" className={styles.btnAcao} style={{ textDecoration: 'none', display: 'block', marginTop: '20px', fontFamily:'sans-serif', fontSize:'13px' }}>
                            Voltar para Homepage
                        </Link>
                    </div>
                </div>
            )}
            

        </div>
    );
}