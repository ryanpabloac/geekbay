"use client";

import { useState, useEffect } from 'react';
import styles from '../../styles/Home.module.css';
import Link from 'next/link';

export default function FinalizarCompra() {
    const [itensCarrinho, setItensCarrinho] = useState<any[]>([]);
    const [cep, setCep] = useState('');
    const [mostrarAgradecimento, setMostrarAgradecimento] = useState(false);
    const [opcaoFrete, setOpcaoFrete] = useState<'PAC' | 'SEDEX' | null>(null);
    const [valorFrete, setValorFrete] = useState(0);
    const [valorBasePAC, setValorBasePAC] = useState(0);
    const [valorBaseSEDEX, setValorBaseSEDEX] = useState(0);
    const [erroCEP, setErroCEP] = useState(false);
    const [etapaPagamento, setEtapaPagamento] = useState(false);
    const [dadosCliente, setDadosCliente] = useState<any>(null);
    const [metodoPagamento, setMetodoPagamento] = useState<'Pix' | 'Cartao' | null>(null);

    useEffect(() => {

        const usuarioLogado = localStorage.getItem('usuario_logado');
        if (usuarioLogado) {
            setDadosCliente(JSON.parse(usuarioLogado));
        }

        document.body.style.backgroundImage = 'url("./bg-GeekBay.png")';
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundAttachment = 'fixed';
        document.body.style.backgroundPosition = 'center';
        document.body.style.backgroundColor = '#000';

        const dadosSalvos = localStorage.getItem('geekbay_cart');
        if (dadosSalvos) setItensCarrinho(JSON.parse(dadosSalvos));

        return () => {
            document.body.style.backgroundImage = '';
            document.body.style.backgroundColor = '';
        };
    }, []);

    const calcularSubtotal = () => {
        return itensCarrinho.reduce((acc, item) => {
            const preco = typeof item.preco === 'string'
                ? parseFloat(item.preco.replace(',', '.'))
                : item.preco;
            return acc + (preco * (item.quantidade || 1));
        }, 0);
    };

    const lidarComCalculoFrete = () => {
        const cepLimpo = cep.replace(/\D/g, '');
        if (cepLimpo.length === 8) {
            const base = cepLimpo.startsWith('0') ? 15.00 : 26.00;
            setValorBasePAC(base);
            setValorBaseSEDEX(base + 28.90);
            setOpcaoFrete('PAC');
            setValorFrete(base);
        } else {
            setErroCEP(true);
        }
    };

    const removerItemDoCheckout = (id: string) => {
        const novaLista = itensCarrinho.filter(item => item.id !== id);
        setItensCarrinho(novaLista);
        localStorage.setItem('geekbay_cart', JSON.stringify(novaLista));
        if (novaLista.length === 0) {
            setOpcaoFrete(null);
            setValorFrete(0);
        }
    };

    const confirmarCompra = async () => {
    if (!metodoPagamento) return;

    if (metodoPagamento === 'Cartao') {
    
        console.log("Enviando dados do Bruce Wayne para a API de Crédito...");
    }

    setItensCarrinho([]);
    localStorage.removeItem('geekbay_cart');
    setMostrarAgradecimento(true);
};

    return (
        <div className={styles.corpo} style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', minHeight: '100vh' }}>
            <header className={styles.cabecalho}>
                <img src='/icone-GB.png' alt="Logo" className={styles.logo} />
                <h1 className={styles.nomeCabecalho}>GeekBay Store</h1>
                <div style={{ marginLeft: 'auto' }}>
                    <Link href="/loja" style={{ textDecoration: 'none', color: '#ff7004' }}>Voltar</Link>
                </div>
            </header>

            <main style={{ maxWidth: '900px', margin: '0 auto', width: '100%', padding: '20px' }}>
                {!etapaPagamento ? (
                    <>
                        <h2 style={{ color: '#FF7A00', textAlign: 'center', margin: '30px 0', textTransform: 'uppercase' }}>
                            Este é o seu carrinho de compras
                        </h2>

                        {itensCarrinho.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#fff', borderRadius: '15px', border: '2px dashed #FF7A00' }}>
                                <img src="/icone-GB.png" alt="Vazio" style={{ width: '80px', opacity: 0.5 }} />
                                <h3 style={{ color: '#666', marginTop: '20px' }}>O multiverso está vazio...</h3>
                                <Link href="/loja" className={styles.btnAcao} style={{ display: 'inline-block', marginTop: '20px', textDecoration: 'none' }}>
                                    VOLTAR PARA A LOJA
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    {itensCarrinho.map((item, index) => (
                                        <div key={item.id || index} style={{ display: 'flex', backgroundColor: '#fff', borderRadius: '15px', border: '2px solid #FF7A00', padding: '15px', gap: '20px', position: 'relative' }}>
                                            <button onClick={() => removerItemDoCheckout(item.id)} style={{ position: 'absolute', top: '10px', right: '15px', background: 'none', border: 'none', color: '#FF7A00', cursor: 'pointer', fontSize: '18px' }}>❌</button>
                                            <img src={item.img} alt={item.nome} style={{ width: '120px', height: '120px', objectFit: 'contain', border: '1px solid #FF7A00', borderRadius: '10px' }} />
                                            <div style={{ flex: 1 }}>
                                                <h3 style={{ fontSize: '18px', marginBottom: '5px' }}>{item.nome}
                                                    <span style={{ color: '#ff7a00', marginLeft: '10px', fontSize: '16px' }}>
                                                        (x{item.quantidade || 1})
                                                    </span>
                                                </h3>
                                                <p style={{ maxWidth:'450px', fontSize: '13px', color: '#666', fontFamily:'sans-serif' }}>
                                                    <strong>Especificações Técnicas: </strong>{item.descricao}</p>
                                                <div style={{ textAlign: 'right', marginTop: '10px' }}>
                                                    <span style={{ fontWeight: 'bold', fontSize: '20px' }}>R${(parseFloat(item.preco.replace(',', '.')) * (item.quantidade || 1)).toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', backgroundColor: '#fff', padding: '25px', borderRadius: '15px', border: '2px solid #FF7A00' }}>
                                    <div>
                                        <p style={{ fontWeight: 'bold' }}>Vamos calcular o frete?</p>
                                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                            <input type="text" placeholder="CEP" value={cep} onChange={(e) => setCep(e.target.value)} style={{ padding: '10px', borderRadius: '10px', border: '1px solid #ccc', flex: 1 }} />
                                            <button className={styles.btnAcao} style={{ margin: 0 }} onClick={lidarComCalculoFrete}>Calcular</button>
                                        </div>
                                        <img src="/balao-Frete.png" alt="Mascote" style={{ width: '250px', marginTop: '20px' }} />
                                    </div>

                                    <div style={{ borderLeft: '1px solid #ddd', paddingLeft: '20px' }}>
                                        <p style={{ fontWeight: 'bold', marginBottom: '15px' }}>Opções de Envio</p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => { setOpcaoFrete('PAC'); setValorFrete(valorBasePAC); }}>
                                                <div style={{ width: '20px', height: '20px', border: '2px solid #FF7A00', borderRadius: '4px', backgroundColor: opcaoFrete === 'PAC' ? '#FF7A00' : 'transparent', color: '#fff', textAlign: 'center', lineHeight: '18px', fontWeight: 'bold' }}>{opcaoFrete === 'PAC' && 'X'}</div>
                                                <p style={{ margin: 0 }}>PAC: R$ {valorBasePAC.toFixed(2)}</p>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => { setOpcaoFrete('SEDEX'); setValorFrete(valorBaseSEDEX); }}>
                                                <div style={{ width: '20px', height: '20px', border: '2px solid #FF7A00', borderRadius: '4px', backgroundColor: opcaoFrete === 'SEDEX' ? '#FF7A00' : 'transparent', color: '#fff', textAlign: 'center', lineHeight: '18px', fontWeight: 'bold' }}>{opcaoFrete === 'SEDEX' && 'X'}</div>
                                                <p style={{ margin: 0 }}>SEDEX: R$ {valorBaseSEDEX.toFixed(2)}</p>
                                            </div>
                                        </div>
                                        <div style={{ marginTop: '100px', textAlign: 'right' }}>
                                            <h3 style={{ fontSize: '18px', textAlign:'center' }}>TOTAL: R$ {(calcularSubtotal() + valorFrete).toFixed(2)}</h3>
                                            <button className={styles.btnAcao} style={{ width: '100%', marginTop:'20px'}} onClick={() => setEtapaPagamento(true)} disabled={!opcaoFrete}>FINALIZAR COMPRA</button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    /*Pagamento*/
                    <div style={{ backgroundColor: '#fff', borderRadius: '15px', border: '3px solid #FF7A00', padding: '30px', marginTop: '20px' }}>
                        <h2 style={{ color: '#FF7A00', textAlign: 'center', marginBottom: '20px' }}>FINALIZAR A COMPRA</h2>

                        {/* Dados do Cliente */}
                        <div style={{ border: '2px solid #FF7A00', borderRadius: '10px', padding: '15px', marginBottom: '20px', fontFamily:'sans-serif' }}>
                            <p><strong>{dadosCliente?.name || 'Carregando nome...'}</strong></p>
                            <p style={{ fontSize: '14px' }}>
                                CPF: {dadosCliente?.cpf || '000.000.000-00'} | email: {dadosCliente?.email} </p>
                            <p style={{ fontSize: '14px' }}>
                                Endereço: {dadosCliente?.address?.street}, {dadosCliente?.address?.number} - {dadosCliente?.address?.neighborhood} ,{dadosCliente?.address.zip_code}</p>
                            <p style={{ fontSize: '14px' }}>
                                {dadosCliente?.address?.city} / {dadosCliente?.address?.state} | CEP: {dadosCliente?.address?.zip_code}
                            </p>
                            <p style={{ fontSize: '14px' }}>Telefone:
                                {dadosCliente?.phone || '()00000-0000'} 
                            </p>
                            
                            {dadosCliente?.address?.complement && (
                                <p style={{ fontSize: '12px', color: '#666' }}>Obs: {dadosCliente.address.complement}</p>
                            )}
                        </div>

                        {/* Resumo do Pedido */}
                
                        <div style={{
                            border: '2px solid #FF7A00',
                            borderRadius: '10px',
                            padding: '20px',
                            marginBottom: '20px',
                            width: '100%',
                            boxSizing: 'border-box'
                        }}>
                            <div style={{ maxHeight: '250px', overflowY: 'auto', paddingRight: '10px' }}>
                                {itensCarrinho.map((item, index) => (
                                    <div key={item.id || index} style={{
                                        display: 'flex',
                                        gap: '20px',
                                        alignItems: 'center',
                                        marginBottom: '15px',
                                        borderBottom: index !== itensCarrinho.length - 1 ? '1px solid #eee' : 'none',
                                        paddingBottom: '15px',
                                        width: '100%'
                                    }}>
                                        
                                        <img
                                            src={item.img}
                                            style={{ width: '70px', height: '70px', objectFit: 'contain', border: '1px solid #FF7A00', borderRadius: '8px' }}
                                            alt={item.nome}
                                        />

                                        <div style={{ flex: 1 }}>
                                            <p style={{ margin: 0, fontSize: '18px' }}>
                                                <strong>{item.nome}</strong>
                                                <span style={{ color: '#FF7A00', marginLeft: '10px', fontWeight: 'bold' }}>
                                                    x{item.quantidade || 1}
                                                </span>
                                            </p>
                                            <p style={{ margin: '5px 0 0 0', fontSize: '16px', color: '#444' }}>
                                                Valor Unitário: R$ {item.preco}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Rodapé do Resumo */}
                            <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '2px solid #FF7A00', fontSize: '14px', color: '#666', fontFamily:'sans-serif' }}>
                                <p style={{ margin: 0 }}><strong>Frete: </strong> Opção {opcaoFrete} (R$ {valorFrete.toFixed(2)})</p>
                            </div>
                        </div>
                        {/*Metodos Pagamento*/}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div style={{ border: '2px solid #FF7A00', borderRadius: '10px', padding: '15px' }}>
                                <p style={{ fontWeight: 'bold', marginBottom: '15px' }}>Métodos de Pagamento</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', cursor: 'pointer' }} onClick={() => setMetodoPagamento('Pix')}>
                                    <div style={{ width: '18px', height: '18px', border: '2px solid #FF7A00', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: metodoPagamento === 'Pix' ? '#FF7A00' : 'transparent' }}>
                                        {metodoPagamento === 'Pix' && <span style={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>X</span>}
                                    </div>
                                    <div style={{ width: '15px', height: '15px', backgroundColor: '#FF7A00', transform: 'rotate(45deg)' }}></div>
                                    <span>Pix</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setMetodoPagamento('Cartao')}>
                                    <div style={{ width: '18px', height: '18px', border: '2px solid #FF7A00', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: metodoPagamento === 'Cartao' ? '#FF7A00' : 'transparent' }}>
                                        {metodoPagamento === 'Cartao' && <span style={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>X</span>}
                                    </div>
                                    <span>💳 Cartão de Crédito</span>
                                </div>
                                {metodoPagamento === 'Cartao' && (
                                    <input type="text" placeholder="0000 0000 0000 0000" style={{ width: '100%', marginTop: '15px', padding: '10px', borderRadius: '8px', border: '1px solid #FF7A00' }} />
                                )}
                            </div>

                            <div style={{ textAlign: 'center' }}>
                                <img src="/balao-Finalizar.png" alt="Mascote" style={{ width: '200px' }} />
                                <h3 style={{ fontSize: '22px', margin: '15px 0' }}>TOTAL: R$ {(calcularSubtotal() + valorFrete).toFixed(2)}</h3>
                                <button className={styles.btnAcao} style={{ width: '100%' }} onClick={confirmarCompra} disabled={!metodoPagamento}>FINALIZAR COMPRA</button>
                                <button onClick={() => setEtapaPagamento(false)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer', marginTop: '10px', textDecoration: 'underline' }}>Voltar para o Frete</button>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* MODAIS */}
            {erroCEP && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalConteudo} style={{ border: '5px solid #FF7A00', textAlign: 'center' }}>
                        <h2 style={{ color: '#FF7A00' }}>ALERTA: CEP INVÁLIDO!</h2>
                        <p>Verifique as coordenadas e tente novamente.</p>
                        <button className={styles.btnAcao} onClick={() => { setErroCEP(false); setCep(''); setValorFrete(0); setOpcaoFrete(null); }}>Digitar CEP</button>
                    </div>
                </div>
            )}

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