"use client";
import { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar, Legend 
} from 'recharts';
import styles from '../../styles/Home.module.css';
import Link from 'next/link'; 

export default function DashboardPage() {
  const [pedidos, setPedidos] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/pedidos')
      .then(res => res.json())
      .then(dados => setPedidos(dados))
      .catch(err => console.error("Erro ao carregar pedidos:", err));
  }, []);

  const CORES_PIZZA = ['#FF7A00', '#2196F3', '#4CAF50', '#FFC107'];

  // --- 1. PROCESSAMENTO DE DADOS (KPIs e Gráficos) ---
  
  // Cálculos dos Cards Superiores
  const faturamentoTotal = pedidos.reduce((acc, p) => acc + parseFloat(p.valor_total || 0), 0);
  const ticketMedio = pedidos.length > 0 ? faturamentoTotal / pedidos.length : 0;

  // Gráfico de Pizza
  const dadosProdutosPizza = Object.values(
    pedidos.reduce((acc: any, p: any) => {
      const cat = p.categoria || 'Outros';
      if (!acc[cat]) acc[cat] = { name: cat, value: 0 };
      acc[cat].value += 1;
      return acc;
    }, {})
  );

  // Gráfico de Linha
  const dadosVendasPeriodo = Object.values(
    pedidos.reduce((acc: any, p: any) => {
      const data = p.data_pedido || 'Sem data';
      if (!acc[data]) acc[data] = { data, total: 0 };
      acc[data].total += parseFloat(p.valor_total || 0);
      return acc;
    }, {})
  ).sort((a: any, b: any) => new Date(a.data).getTime() - new Date(b.data).getTime());

  // Gráfico de Barras
  const dadosVendasPedidos = pedidos.slice(-6).map(p => ({
    id: `#${p.id}`,
    valor: parseFloat(p.valor_total || 0)
  }));

  return (
    <div className={styles.corpo} style={{ 
      backgroundImage: 'url("/bg-GeekBay.png")', 
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed',
      minHeight: '100vh',
      paddingBottom: '40px'
    }}>
      
    <header className={styles.cabecalho}>
           
            <img src='/icone-GB.png' alt="Logo GeekBay" className={styles.logo} />
            <h1 className={styles.nomeCabecalho} style={{marginRight:"100px"}} >Dashboard</h1>
          
           <div style={{display:'flex', flexDirection: 'row', gap:'30px'}} >
           <Link href="/" style={{textDecoration:'none', color:'#ff7004'}}>
           Home
           </Link>
    
           <Link href="/produtos" style={{textDecoration:'none', color:'#ff7004', marginLeft:'40px'}}>
           Gerenciamento
           </Link>
    
           <Link href="/dashboard" style={{textDecoration:'none' , color:'#ff7004', marginLeft:'40px'}}>
           Dashboard
           </Link>
           </div>
    
          </header>

      {/* Aumentamos a largura máxima do main para caber tudo lado a lado */}
      <main className={styles.mainContainer} style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* --- CARDS DE INDICADORES (KPIs) --- */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <div className={styles.card} style={{ flex: 1, minWidth: '250px', textAlign: 'center', borderLeft: '8px solid #4CAF50' }}>
            <h3 style={{ color: '#757575', fontSize: '14px' }}>💰 Faturamento Total</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50' }}>
              R$ {faturamentoTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className={styles.card} style={{ flex: 1, minWidth: '250px', textAlign: 'center', borderLeft: '8px solid #FF7A00' }}>
            <h3 style={{ color: '#757575', fontSize: '14px' }}>📦 Total de Pedidos</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF7A00' }}>{pedidos.length}</p>
          </div>
          <div className={styles.card} style={{ flex: 1, minWidth: '250px', textAlign: 'center', borderLeft: '8px solid #2196F3' }}>
            <h3 style={{ color: '#757575', fontSize: '14px' }}>📈 Ticket Médio</h3>
            <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#2196F3' }}>
              R$ {ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* --- SEÇÃO PRINCIPAL DE GRÁFICOS --- */}
        <section className={styles.card} style={{ padding: '40px 20px 20px', position: 'relative', width: '100%' }}>
          
          {/* BOTÃO VOLTAR REDONDO */}
          <button 
            onClick={() => window.location.href = '/produtos'} 
            title="Voltar para Produtos"
            style={{
              position: 'absolute', top: '15px', left: '15px', width: '40px', height: '40px',
              borderRadius: '50%', backgroundColor: '#FF7A00', color: 'white', border: 'none',
              cursor: 'pointer', fontSize: '20px', fontWeight: 'bold', display: 'flex',
              alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', zIndex: 10
            }}
          >
            ←
          </button>

          <div className={styles.cardTituloImg} style={{ justifyContent: 'center', marginBottom: '30px' }}>
            <img src='/icone-GB.png' alt="Pedidos" className={styles.logoCard} />
            <h2 style={{ color: '#000000', marginTop:'10px', fontSize:'24px' }}>Indicadores de Desempenho</h2>
          </div>

          {/* CONTAINER PARA OS GRÁFICOS LADO A LADO */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'row', 
            gap: '20px', 
            flexWrap: 'wrap', // Permite quebrar linha em telas pequenas
            justifyContent: 'center'
          }}>
            
            {/* 1. LINHA (Evolução) */}
            <div style={{ flex: '1', minWidth: '400px', backgroundColor: '#f9f9f9', border: '1px solid #ddd', borderRadius: '15px', padding: '15px' }}>
              <p style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '15px' }}>Evolução de Vendas (R$)</p>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={dadosVendasPeriodo}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="data" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip formatter={(value) => `R$ ${value}`} />
                  <Line type="monotone" dataKey="total" stroke="#FF7A00" strokeWidth={3} dot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* 2. PIZZA (Categorias) */}
            <div style={{ flex: '1', minWidth: '400px', backgroundColor: '#f9f9f9', border: '1px solid #ddd', borderRadius: '15px', padding: '15px' }}>
              <p style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '15px' }}>Mix de Categorias</p>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={dadosProdutosPizza} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" label>
                    {dadosProdutosPizza.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CORES_PIZZA[index % CORES_PIZZA.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* 3. BARRAS (Últimos Pedidos) - Ocupa a largura total na base */}
            <div style={{ width: '100%', backgroundColor: '#f9f9f9', border: '1px solid #ddd', borderRadius: '15px', padding: '15px', marginTop: '10px' }}>
              <p style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '15px' }}>Comparativo dos Últimos Pedidos</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={dadosVendasPedidos}>
                  <XAxis dataKey="id" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip formatter={(value) => `R$ ${value}`} />
                  <Bar dataKey="valor" fill="#2196F3" radius={[5, 5, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}





