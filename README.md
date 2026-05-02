# GeekBay - Plataforma de E-commerce Geek

## 📋 Descrição do Projeto

GeekBay é uma plataforma completa de e-commerce especializada em produtos geek, desenvolvida com arquitetura moderna e separação de responsabilidades clara entre frontend e backend. A plataforma oferece funcionalidades robustas de gerenciamento de produtos, categorias, estoque, pedidos e usuários.

## 🎯 Objetivos

- Fornecer uma experiência de compra intuitiva e responsiva para clientes
- Oferecer um painel administrativo robusto para gerenciamento de produtos e pedidos
- Manter segurança e validação de dados em todos os níveis
- Garantir performance e escalabilidade da aplicação

## 🏗️ Arquitetura do Projeto

```
geekbay/
├── backend/          # API REST (Spring Boot 3.5.11)
│   └── demo/
│       ├── src/
│       │   ├── main/
│       │   │   ├── java/com/geekbay/demo/
│       │   │   │   ├── controller/      # Endpoints REST
│       │   │   │   ├── services/        # Lógica de negócio
│       │   │   │   ├── entities/        # Modelos de dados
│       │   │   │   ├── dtos/            # Data Transfer Objects
│       │   │   │   ├── repositories/    # Acesso ao banco de dados
│       │   │   │   ├── mappers/         # Conversão entre entidades e DTOs
│       │   │   │   ├── config/          # Configurações (CORS, Security)
│       │   │   │   ├── exceptions/      # Exceções customizadas
│       │   │   │   └── enums/           # Enumeradores
│       │   │   └── resources/db/migration/  # Scripts SQL (Flyway)
│       │   └── test/                    # Testes unitários
│       └── pom.xml                      # Dependências Maven
│
└── frontend/         # SPA (Next.js 16.1.6 + React 19)
    ├── app/
    │   ├── page.tsx               # Home/Dashboard
    │   ├── login/page.tsx         # Página de login
    │   ├── cadastro/page.tsx      # Registro de usuários
    │   ├── loja/page.tsx          # Loja pública
    │   ├── produtos/page.tsx      # Painel de produtos (admin)
    │   ├── dashboard/page.tsx     # Dashboard administrativo
    │   ├── finalizarCompra/page.tsx # Checkout
    │   ├── layout.tsx             # Layout raiz
    │   └── globals.css            # Estilos globais
    ├── styles/                    # Módulos CSS
    ├── public/                    # Ativos estáticos
    ├── package.json               # Dependências npm
    └── db.json                    # Banco de dados mock (json-server)
```

## 🛠️ Stack Tecnológico

### Backend
- **Framework**: Spring Boot 3.5.11
- **Linguagem**: Java 21
- **Banco de Dados**: PostgreSQL
- **ORM**: JPA/Hibernate
- **Segurança**: Spring Security + BCrypt
- **Migrations**: Flyway
- **Validation**: Jakarta Bean Validation
- **API Documentation**: SpringDoc OpenAPI (Swagger)
- **Build Tool**: Maven 3.8+

### Frontend
- **Framework**: Next.js 16.1.6
- **Biblioteca UI**: React 19.2.3
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS 4 + CSS Modules
- **Gráficos**: Recharts 3.7.0
- **Mock API**: json-server 0.17.4
- **Linting**: ESLint 9

## 📦 Módulos do Projeto

### Backend - Principais Entidades

#### 1. **Usuário (Usuario)**
- Autenticação e autorização
- Perfis: ADMIN e CLIENTE
- Validação com BCrypt para senhas

#### 2. **Endereço (Endereco)**
- Associado a usuários
- Integração com API de CEP (viaCEP)
- Complemento e número de endereço

#### 3. **Categoria (Categoria)**
- Classificação de produtos
- Gerenciamento administrativo
- Queries por ID e nome

#### 4. **Produto (Produto)**
- Informações detalhadas
- Associação com categoria
- Descrição e preço

#### 5. **Estoque (Estoque)**
- Gerenciamento de quantidade
- Vinculado a produtos
- Controle de disponibilidade

#### 6. **Pedido (Pedido)**
- Status de pedido (enum OrderStatus)
- Itens do pedido
- Associação com usuário

#### 7. **Carrinho (Carrinho)**
- Itens temporários antes da compra
- Cálculo de total

### Frontend - Páginas Principais

| Página | Caminho | Descrição |
|--------|---------|-----------|
| Home | `/` | Dashboard principal e menu de navegação |
| Login | `/login` | Autenticação de usuários |
| Cadastro | `/cadastro` | Registro de novos usuários |
| Loja | `/loja` | Loja pública para clientes |
| Produtos | `/produtos` | Painel administrativo de produtos |
| Dashboard | `/dashboard` | Dashboard com relatórios |
| Finalizar Compra | `/finalizarCompra` | Checkout e confirmação de pedido |

## 🚀 Como Começar

### Pré-requisitos
- Java 21+
- Node.js 18+
- PostgreSQL 12+
- Maven 3.8+

### Instalação e Execução

#### Backend

```bash
cd backend/demo

# Build do projeto
mvn clean install

# Execução
mvn spring-boot:run
```

A API estará disponível em: `http://localhost:8080`
Documentação Swagger: `http://localhost:8080/swagger-ui.html`

#### Frontend

```bash
cd frontend

# Instalação de dependências
npm install

# Desenvolvimento
npm run dev

# Build para produção
npm run build
npm start
```

O frontend estará disponível em: `http://localhost:3000`

Para executar o mock server (json-server):
```bash
npm run server
```

## 📡 Endpoints Principais da API

### Usuários
- `GET /usuarios` - Listar todos os usuários
- `GET /usuarios/{usuarioId}` - Obter usuário por ID
- `POST /usuarios` - Criar novo usuário

### Categorias
- `GET /api/categoria` - Listar categorias
- `GET /api/categoria/{id}` - Obter categoria por ID
- `GET /api/categoria/nome/{nome}` - Buscar por nome
- `POST /api/categoria` - Criar categoria
- `PUT /api/categoria/{id}` - Atualizar categoria

### Produtos
- `GET /api/produto` - Listar produtos
- `GET /api/produto/{id}` - Obter produto por ID
- `POST /api/produto` - Criar produto
- `PUT /api/produto/{id}` - Atualizar produto

### Estoque
- `GET /api/estoque` - Listar estoques
- `GET /api/estoque/produto/{id}` - Obter estoque por produto

### Endereços
- `GET /api/enderecos/cep/{cep}` - Buscar por CEP
- `GET /api/enderecos/usuario/{usuarioId}` - Obter endereço do usuário
- `POST /api/enderecos` - Criar endereço

### Carrinho
- `GET /api/carrinho/{usuarioId}` - Obter carrinho do usuário

## 🔐 Segurança

- **CORS**: Configurado para aceitar requisições de `http://localhost:3000`
- **Autenticação**: Spring Security com HTTP Basic
- **Senhas**: Criptografadas com BCrypt
- **Validação**: Validação em todos os DTOs com Jakarta Bean Validation

## 📝 Estrutura de DTOs

O projeto utiliza Data Transfer Objects (DTOs) para transferência de dados entre layers:

```
dtos/
├── usuario/
│   ├── UsuarioRequestDTO
│   └── UsuarioResponseDTO
├── categoria/
│   ├── CategoriaRequestDTO
│   └── CategoriaResponseDTO
├── produto/
│   ├── ProdutoRequestDTO
│   ├── ProdutoResponseDTO
│   └── ProdutoUpdateRequestDTO
├── estoque/
│   ├── EstoqueRequestDTO
│   └── EstoqueResponseDTO
├── endereco/
│   ├── EnderecoRequestDTO
│   └── EnderecoResponseDTO
└── pedido/
    └── ...
```

## 🗄️ Migrações de Banco de Dados

As migrações SQL são gerenciadas pelo Flyway:

| Migração | Descrição |
|----------|-----------|
| V1 | Criação tabela Usuario |
| V2 | Criação tabela Endereco |
| V3 | Criação tabela Categoria |
| V4 | Criação tabela Produto |
| V5 | Criação tabela Estoque |
| V6 | Inserção de categorias padrão |
| V7 | Criação tabela Pedido |
| V8 | Criação tabela ItemPedido |
| V9 | Atualização senha admin para BCrypt |
| V10 | Adição de campos number e complement em Endereco |

## 🧪 Testes

### Backend
```bash
cd backend/demo
mvn test
```

Testes incluídos:
- `UsuarioControllerTest` - Testes do controller de usuários
- `DemoApplicationTests` - Teste de contexto

## 📚 Documentação Adicional

- [Documentação do Backend](./backend/README.md)
- [Documentação do Frontend](./frontend/README.md)

## 👥 Perfis de Usuário

### ADMIN
- Acesso ao painel administrativo completo
- Gerenciamento de produtos, categorias e estoque
- Gerenciamento de usuários e pedidos

### CLIENTE
- Acesso à loja pública
- Gerenciamento do carrinho
- Histórico de pedidos
- Atualização de perfil

## 🔄 Fluxo de Compra

1. Usuário navega pela loja (`/loja`)
2. Adiciona produtos ao carrinho
3. Acessa o carrinho e revisa itens
4. Prossegue para checkout (`/finalizarCompra`)
5. Confirma endereço de entrega
6. Realiza pagamento (integração futura)
7. Pedido é criado com status PENDENTE
8. Admin gerencia o pedido pelo painel (`/produtos`)

## 🤝 Contribuições

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é propriedade da GeekBay.

## 📞 Suporte

Para dúvidas ou problemas, entre em contato através dos issues do repositório.
