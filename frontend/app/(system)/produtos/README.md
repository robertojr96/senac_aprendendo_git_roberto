# 📦 Cadastro de Produtos - Documentação de Implementação

## 🎯 Visão Geral

O cadastro de produtos foi implementado seguindo a arquitetura e padrões já estabelecidos no projeto. A implementação envolve:

- **Backend**: Já estava 100% pronto com endpoints RESTful em NestJS
- **Frontend**: Página interativa em Next.js com formulário de CRUD

---

## 🏗️ Arquitetura do Backend (NestJS)

### 1. **Entidade (Banco de Dados)**
Local: `api/src/entidades/produto.entidade.ts`

A entidade define a estrutura da tabela `produtos` no PostgreSQL:

```typescript
@Entity('produtos')
export class Produto {
  @PrimaryGeneratedColumn()
  id: number;                          // ID único

  @Column({ name: 'codigo_sku', unique: true, nullable: true })
  codigoSku: string | null;            // Código SKU (opcional, mas único)

  @Column({ type: 'varchar', length: 200 })
  nome: string;                        // Nome do produto

  @Column({ type: 'text', nullable: true })
  descricao: string | null;            // Descrição detalhada

  @Column({ name: 'preco_unitario', type: 'numeric', precision: 14, scale: 2 })
  precoUnitario: string;               // Preço com precisão decimal

  @Column({ type: 'varchar', length: 20, default: 'UN' })
  unidade: string;                     // Unidade de medida (padrão: UN)

  @Column({ name: 'ativo', type: 'boolean', default: true })
  ativo: boolean;                      // Status ativo/inativo

  @CreateDateColumn({ name: 'criado_em', type: 'timestamptz' })
  criadoEm: Date;                      // Timestamp de criação

  @UpdateDateColumn({ name: 'atualizado_em', type: 'timestamptz' })
  atualizadoEm: Date;                  // Timestamp de última atualização

  @OneToMany(() => ItemOrcamento, (i) => i.produto)
  itensOrcamento: ItemOrcamento[];     // Relação com itens de orçamento
}
```

### 2. **DTOs (Data Transfer Objects)**
Locais: `api/src/produtos/dto/`

- **CriarProdutoDto**: Validação de entrada para POST
- **AtualizarProdutoDto**: PartialType de CriarProdutoDto (todos campos opcionais)

Usam `class-validator` para validações automáticas (tamanho máximo, tipos, etc.)

### 3. **Service (Lógica de Negócio)**
Local: `api/src/produtos/produtos.service.ts`

Responsável por:
- **`listar(filtros)`**: Busca com ILIKE para case-insensitive, filtros por `nome` e `ativo`
- **`obter(id)`**: Retorna produto específico
- **`criar(dto)`**: Valida duplicata SKU, cria novo produto
- **`atualizar(id, dto)`**: Atualiza campos parcialmente
- **`remover(id)`**: Remove com proteção contra FK (orçamentos)

### 4. **Controller (Endpoints HTTP)**
Local: `api/src/produtos/produtos.controller.ts`

**Rotas implementadas:**

```
GET    /api/produtos                 - Listar produtos
GET    /api/produtos/:id             - Detalhe do produto
POST   /api/produtos                 - Criar produto
PATCH  /api/produtos/:id             - Atualizar produto
DELETE /api/produtos/:id             - Remover produto
```

**Filtros na listagem:**
- `?nome=xyz` - Busca parcial (case-insensitive)
- `?ativo=true|false` - Filtra por status

Todas as rotas requerem autenticação JWT (`@UseGuards(AuthGuard('jwt'))`)

### 5. **Módulo (Configuração)**
Local: `api/src/produtos/produtos.module.ts`

Registra a entidade Produto no TypeORM e importa o módulo de autenticação para proteção das rotas.

---

## 🎨 Arquitetura do Frontend (Next.js + React)

### 1. **Server Actions**
Local: `frontend/app/(system)/produtos/actions.ts`

Funções executadas **no servidor** que chamam a API:

```typescript
// Tipos definidos para type-safety
export type Produto = { ... }
export type CriarProdutoInput = { ... }

// Server actions
export async function listarProdutos(filtros?: ListarProdutosFilters): Promise<Produto[]>
export async function criarProduto(input: CriarProdutoInput): Promise<Produto>
export async function atualizarProduto(id: number, input: AtualizarProdutoInput): Promise<Produto>
export async function removerProduto(id: number): Promise<void>
```

**Por que server actions?**
- JWT token armazenado em cookie httpOnly (seguro)
- Não expõe a URL da API para o cliente
- Validação e tratamento de erros centralizados

### 2. **Componente de Formulário**
Local: `frontend/app/(system)/produtos/ProdutoForm.tsx`

**Client Component** (`'use client'`) com:
- Hook `useActionState` para gerenciar estado do formulário
- Campos: código SKU, nome, descrição, preço, unidade, status
- Modo criação (novo) e modo edição
- Exibição de erros e sucesso
- Bootstrap para estilização

### 3. **Página Principal**
Local: `frontend/app/(system)/produtos/page.tsx`

**Client Component** que orquestra:

**Filtros:**
- Campo de texto para buscar por nome
- Select para filtrar por status (todos/ativos/inativos)

**Tabela de produtos:**
- Lista todos os produtos com ID, SKU, nome, preço, unidade, status
- Botões: "Editar" e "Excluir"
- Preço formatado em BRL

**CRUD completo:**
- Criar novo produto via formulário
- Editar produto existente
- Deletar com confirmação
- Carregamento e gerenciamento de erros

---

## 🔄 Fluxo de Dados

### Criar Produto:
```
Usuário preenche formulário
     ↓
handleCriarProduto (extrai FormData)
     ↓
criarProduto (server action)
     ↓
apiServerFetch injeta JWT
     ↓
POST /api/produtos (NestJS)
     ↓
ProdutosService.criar valida e salva
     ↓
Resposta retorna para frontend
     ↓
carregarProdutos() recarrega lista
```

### Listar com Filtros:
```
Usuário altera filtro (nome ou status)
     ↓
setFiltros atualiza estado
     ↓
useEffect dispara carregarProdutos()
     ↓
listarProdutos(filtros) (server action)
     ↓
GET /api/produtos?nome=xyz&ativo=true
     ↓
QueryBuilder monta WHERE com ILIKE
     ↓
Retorna lista filtrada
```

---

## 🛡️ Segurança

1. **JWT no Cookie httpOnly**: Token não acessível via JavaScript
2. **Server Actions**: Valida token no servidor antes de chamar API
3. **Validação Backend**: DTOs com class-validator validam tipos e tamanhos
4. **Proteção FK**: Não permite deletar produto usado em orçamentos
5. **Erro handling**: Mensagens genéricas ao usuário, logs específicos no servidor

---

## 📋 Checklist de Implementação

✅ Backend (já existia):
- [x] Entity Produto com relacionamento OneToMany
- [x] DTOs com validações
- [x] Service com CRUD e filtros
- [x] Controller com endpoints autenticados
- [x] Módulo registrado em AppModule

✅ Frontend (criado):
- [x] Server actions para comunicação com API
- [x] Componente formulário reutilizável
- [x] Página com tabela, filtros e CRUD
- [x] Tratamento de erros e loading
- [x] Formatação de moeda (BRL)
- [x] Confirmação antes de deletar

---

## 🚀 Como Usar

1. **Navegar para /produtos**
2. **Listar produtos**: Carrega automaticamente ao abrir a página
3. **Filtrar**: Use campos de busca (nome, status)
4. **Criar**: Clique em "+ Novo Produto"
5. **Editar**: Clique em "Editar" na tabela
6. **Deletar**: Clique em "Excluir" (pede confirmação)

---

## 📝 Padrões Seguidos

### Backend
- **Pastas por feature**: `clientes/`, `produtos/`, `orcamentos/` agrupam controller, service, DTOs
- **Dependências injetadas**: `@InjectRepository` para acesso ao banco
- **Async/Await**: Código assíncrono legível
- **Exceções específicas**: `NotFoundException`, `ConflictException`, etc.
- **Swagger**: `@ApiOperation`, `@ApiQuery` para documentação automática

### Frontend
- **Server Components por padrão**: Apenas Client Components quando necessário
- **Server Actions**: Encapsulam lógica de API
- **Bootstrap classes**: Estilização consistente com projeto
- **Type Safety**: TypeScript em todo o código
- **Error boundaries**: Tratamento de erros em cada nível

---

## 🧩 Estrutura de Pastas Criada

```
frontend/app/(system)/produtos/
├── actions.ts          # Server actions para API
├── page.tsx            # Página principal com listagem
├── ProdutoForm.tsx     # Componente de formulário
└── README.md           # (opcional) Documentação local
```

---

## 🔗 Relacionamentos

- **Produto** ← (OneToMany) → **ItemOrcamento**
  - Um produto pode estar em múltiplos itens de orçamento
  - Proteção: não permite deletar produto referenciado

---

## ✨ Próximos Passos Sugeridos

1. Importar `ProdutosPage` no layout de sistema
2. Adicionar link em menu de navegação para `/produtos`
3. Considerar paginação para listas grandes
4. Adicionar validação de preço mínimo no formulário
5. Implementar import/export de produtos (CSV)
6. Adicionar busca por SKU além de nome
