"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../../styles/Home.module.css';

const ModalAviso = ({ mensagem, aoFechar }: { mensagem: string, aoFechar: () => void }) => {
    if (!mensagem) return null;
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalConteudo}>
                <img src='/icone-GB.png' alt="Logo" style={{ width: '60px', marginBottom: '10px' }} />
                <p>{mensagem}</p>
                <button onClick={aoFechar} className={styles.btnAcao}>OK</button>
            </div>
        </div>
    );
};


const mCPF = (value: string) => {
    return value.replace(/\D/g, "").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2").slice(0, 14);
};

const mCEP = (value: string) => {
    return value.replace(/\D/g, "").replace(/^(\d{5})(\d)/, "$1-$2").slice(0, 9);
};

const mTelefone = (value: string) => {
    return value.replace(/\D/g, "").replace(/^(\d{2})(\d)/g, "($1) $2").replace(/(\d)(\d{4})$/, "$1-$2").slice(0, 15);
};

export default function Cadastro() {
    const router = useRouter();
    const [mensagemModal, setMensagemModal] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        cpf: '',
        email: '',
        phone: '',
        senha: '',
        address: {
            zip_code: '',
            street: '',
            complement: ''
        }
    });

    useEffect(() => {
        document.body.style.backgroundImage = 'url("./bg-GeekBay.png")';
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundAttachment = 'fixed';
        return () => { document.body.style.backgroundImage = ''; };
    }, []);

    const handleCadastro = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
        !formData.name || 
        !formData.cpf || 
        !formData.email || 
        !formData.phone || 
        !formData.senha || 
        !formData.address.zip_code || 
        !formData.address.street
    ) {
        setMensagemModal("Por favor, preencha todos os campos para prosseguir com sua jornada!");
        return;
    }
    
    if (!formData.email.includes("@")) {
        setMensagemModal("O e-mail inserido não parece ser de nenhum planeta conhecido!");
        return;
    }

        
        const novoCliente = {
            ...formData,
            id: Math.floor(Math.random() * 10000).toString()
        };

        try {
            const response = await fetch('http://localhost:5000/clientes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novoCliente)
            });

            if (response.ok) {
                setMensagemModal("Cadastro realizado com sucesso, herói!");
                setTimeout(() => router.push('/login'), 2000);
            } else {
                setMensagemModal("Erro no servidor (500). Tente reiniciar o json-server.");
            }
        } catch (error) {
            setMensagemModal("Erro ao conectar com o servidor.");
        }
    };

    return (
        <main>
            <header className={styles.cabecalho}>
                <img src='/icone-GB.png' alt="Logo GeekBay" className={styles.logo} />
                <h1 className={styles.nomeCabecalho}>GeekBay</h1>
            </header>

            <div className={styles.corpo} style={{ padding: '40px 20px', backgroundColor: 'rgba(0, 0, 0, 0.75)' }}>
                <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '25px', border: '4px solid #ff7a00', maxWidth: '600px', width: '100%', textAlign: 'center' }}>
                    <img src="/icone-GB.png" alt="Logo" style={{ width: '50px' }} />
                    <h2 style={{ color: '#ff7a00', marginBottom: '20px' }}>Preencha seus dados</h2>

                    <form onSubmit={handleCadastro} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <input className={styles.inputGroup} placeholder="Nome" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                        <input className={styles.inputGroup} placeholder="CPF" value={formData.cpf} onChange={e => setFormData({...formData, cpf: mCPF(e.target.value)})} />
                        <input className={styles.inputGroup} placeholder="Email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                        
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input className={styles.inputGroup} placeholder="Telefone" style={{ flex: 2 }} value={formData.phone} onChange={e => setFormData({...formData, phone: mTelefone(e.target.value)})} />
                            <input className={styles.inputGroup} placeholder="CEP" style={{ flex: 1 }} value={formData.address.zip_code} onChange={e => setFormData({...formData, address: {...formData.address, zip_code: mCEP(e.target.value)}})} />
                        </div>

                        <input className={styles.inputGroup} placeholder="Endereço" value={formData.address.street} onChange={e => setFormData({...formData, address: {...formData.address, street: e.target.value}})} />
                        <input className={styles.inputGroup} placeholder="Complemento" value={formData.address.complement} onChange={e => setFormData({...formData, address: {...formData.address, complement: e.target.value}})} />
                        <input className={styles.inputGroup} placeholder="Senha" type="password" value={formData.senha} onChange={e => setFormData({...formData, senha: e.target.value})} />

                        <button type="submit" className={styles.btnAcao} style={{ width: '100%', marginTop: '10px' }}>Cadastrar</button>
                    </form>
                    <Link href="/login" style={{ color: '#ff7a00', display: 'block', marginTop: '15px', fontSize: '14px' }}>Já tem conta? Voltar ao login</Link>
                </div>
            </div>
            <ModalAviso mensagem={mensagemModal} aoFechar={() => setMensagemModal('')} />
        </main>
    );
}


