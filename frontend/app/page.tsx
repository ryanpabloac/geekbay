"use client";

import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {


const rolarParaSecao = (id: string) => {
  const elemento = document.getElementById(id);
  if (elemento) {
    elemento.scrollIntoView({ behavior: 'smooth' });
  }
};


  return (
    <div className={styles.corpo } style={{backgroundImage: 'url("/bg-GeekBay.png")', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', minHeight: '100vh', width: '100%'}}>
      <header className={styles.cabecalho}>
        <img src='/icone-GB.png' alt="Logo GeekBay" className={styles.logo} />
        <h1 className={styles.nomeCabecalho}>GeekBay</h1>
      </header>

      <main className={styles.mainContainer} style={{flexDirection: 'column', textAlign: 'center', minHeight: '80vh', justifyContent: 'center', alignItems:'center'}}>
        <section className={styles.card} style={{padding: '20px'}}>
          <div className={styles.cardTituloImg}>
            <img src='/icone-GB.png' alt="Logo" className={styles.logoCard} style={{width: '80px', height: 'auto'}} />
            <h2 style={{fontSize: '28px', color: '#FF7A00'}}>Bem-vindo ao GeekBay</h2>
          </div>
          
          <p style={{color: '#757575', marginBottom: '30px', fontFamily: 'sans-serif'}}>
            O seu portal administrativo para gerenciar o estoque da melhor loja geek de Uberlândia.
          </p>

          <Link href="/produtos" style={{ textDecoration: 'none' }} >
            <button className={styles.btnAcao} style={{width: '100%', fontSize: '18px'}} onClick={() => rolarParaSecao('secao-produtos')}>
              Gerenciar Produtos
            </button>
          </Link>
          <Link href="/produtos#secao-estoque" style={{ textDecoration: 'none' }} >
            <button className={styles.btnAcao} style={{width: '100%', fontSize: '18px'}} onClick={() => rolarParaSecao('secao-clientes')}>
              Gerenciar Estoque
            </button>
            </Link>
            
            <Link href="/produtos#secao-clientes" style={{ textDecoration: 'none' }}>
              <button className={styles.btnAcao} style={{ width: '100%', fontSize: '18px' }} onClick={() => rolarParaSecao('secao-estoque')}>
                Gerenciar Clientes
              </button>
            </Link>
            
            <Link href="/produtos#secao-pedidos" style={{ textDecoration: 'none' }} >
            <button className={styles.btnAcao} style={{width: '100%', fontSize: '18px'}} onClick={() => rolarParaSecao('secao-pedidos')}>
              Gerenciar Pedidos
            </button>
          </Link>
        
        </section>
      </main>

      <footer style={{color: '#ffffff', fontSize: '12px', fontWeight:'600' ,marginTop: '40px', textShadow: '2px 2px #000'}}>
        © 2026 GeekBay - Inovação e Cultura Geek
      </footer>
    </div>
  );
}