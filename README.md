# Desafio Técnico – React Native (Expo)

Aplicativo mobile multiplataforma para cadastro e gestão de lojas e produtos de uma rede de varejo.

---

## Versões utilizadas

| Ferramenta       | Versão         |
|------------------|----------------|
| Node.js          | 20.x           |
| Expo SDK         | ~54.0.0        |
| React            | 19.0.0         |
| React Native     | 0.79.0         |
| Expo Router      | ~4.0.0         |
| TypeScript       | ~5.7.0         |
| NativeWind       | ^4.1.23        |
| Tailwind CSS     | ^3.4.15        |
| Gluestack UI     | @gluestack-ui/nativewind-utils ^1.1.0 (v2 / NativeWind) |
| Zustand          | ^5.0.3         |
| MirageJS         | ^0.1.47        |

---

## Arquitetura

```
desafio-vaga-react/
├── 
├──src/
├── app/
│   ├── _layout.tsx             # Root layout + inicialização do MirageJS
│   ├── index.tsx               # Redirect → /stores
│   ├── stores/
│   │   ├── index.tsx           # Lista de lojas
│   │   ├── new.tsx             # Formulário de nova loja
│   │   └── [id]/
│   │       ├── index.tsx       # Detalhe da loja + lista de produtos
│   │       ├── edit.tsx        # Editar loja
│   │       └── products/
│   │           ├── new.tsx     # Novo produto
│   │           └── [productId]/
│   │               └── edit.tsx  # Editar produto
├── components/
│   ├── ui/                     # Componentes Gluestack UI v2 (NativeWind)
│   │   ├── box/
│   │   ├── vstack/
│   │   ├── hstack/
│   │   ├── text/
│   │   ├── heading/
│   │   ├── button/
│   │   ├── input/
│   │   ├── form-control/
│   │   ├── badge/
│   │   ├── spinner/
│   │   ├── card/
│   │   ├── select/
│   │   ├── pressable/
│   │   └── alert-dialog/
│   ├── StoreCard.tsx
│   ├── ProductCard.tsx
│   ├── SearchBar.tsx
│   └── EmptyState.tsx
│   ├── types/index.ts          # Tipos TypeScript (Store, Product, …)
│   ├── services/
│   │   ├── api.ts              # Cliente HTTP
│   │   └── mock/server.ts      # MirageJS – endpoints simulados
│   ├── store/index.ts          # Zustand – estado global
│   └── hooks/
│       ├── useStores.ts
│       └── useProducts.ts
└── __tests__/
    ├── StoreCard.test.tsx
    ├── store.test.ts
    └── useStores.test.ts
```

---

## Instalação e execução

### Pré-requisitos

- Node.js 20+ instalado
- Expo CLI: `npm install -g expo-cli` (ou use `npx expo`)

### Passos

```bash
# 1. Clone o repositório
git clone https://github.com/evandojunior/desafio-vaga-react.git
cd desafio-vaga-react

# 2. Instale as dependências
npm install
# O arquivo .npmrc já inclui legacy-peer-deps=true automaticamente
# (necessário pelo MirageJS, que é requisito do desafio)

# 3. Inicie o app
npx expo start
```

> Pressione `a` para Android, `i` para iOS ou `w` para Web.

---

## Rodando no emulador Android (apenas WSL2)

> ⚠️ Esta seção é **exclusiva para quem roda o projeto dentro do WSL2** no Windows.  
> Se você estiver no **Linux nativo, macOS ou Windows com terminal nativo**, o `npx expo start` + tecla `a` já funciona sem configuração extra.

### Por que o WSL2 precisa de um passo extra?

No WSL2, o Metro roda dentro de uma VM Linux com IP próprio. O emulador Android roda no Windows e não consegue alcançar esse IP diretamente:

```
Emulador Android (Windows) → localhost:8081
                                    ↓ (sem adb reverse: conexão falha)
                               WSL2 VM → Metro Bundler
```

O comando `adb reverse` cria um túnel entre o emulador e o WSL2.

### Passo a passo (somente WSL2)

```bash
# 1. Com o emulador Android já aberto, rode no terminal WSL2:
adb reverse tcp:8081 tcp:8081

# 2. Inicie o Metro normalmente
npx expo start

# 3. No menu do Expo, pressione 'a' para abrir no emulador
```

> Se o Expo Go mostrar erro de conexão, force-feche o app no emulador e tente novamente.

---

## Mock de back-end (MirageJS)

O MirageJS é inicializado automaticamente em `app/_layout.tsx` ao montar o root layout.
Não é necessário nenhum comando extra — o servidor mock sobe junto com o app.

### Endpoints simulados

| Método   | Endpoint                         | Descrição                     |
|----------|----------------------------------|-------------------------------|
| `GET`    | `/api/stores`                    | Lista todas as lojas          |
| `POST`   | `/api/stores`                    | Cria nova loja                |
| `GET`    | `/api/stores/:id`                | Detalhe de uma loja           |
| `PATCH`  | `/api/stores/:id`                | Atualiza loja                 |
| `DELETE` | `/api/stores/:id`                | Remove loja + seus produtos   |
| `GET`    | `/api/stores/:storeId/products`  | Lista produtos da loja        |
| `POST`   | `/api/stores/:storeId/products`  | Cria produto na loja          |
| `PATCH`  | `/api/products/:id`              | Atualiza produto              |
| `DELETE` | `/api/products/:id`              | Remove produto                |

O banco é populado com **3 lojas** e **8 produtos** de seed ao iniciar.

---

## Testes unitários

```bash
npm test
```

Os testes utilizam **Jest** + **@testing-library/react-native** e cobrem:

- Renderização e interações do `StoreCard`
- Actions do Zustand store (fetch, create, delete)
- Hook `useStores` — filtragem por busca

---

## Decisões técnicas

### Gluestack UI v2 (NativeWind)
Utilizado na abordagem **v2 / NativeWind** (`@gluestack-ui/nativewind-utils`) em vez do pacote `@gluestack-ui/themed` legado. Isso evita conflitos de peer dependencies com React 19, pois os componentes são scaffolded localmente e usam apenas classes Tailwind.

### Zustand v5
Estado global simples e tipado, sem boilerplate. Slices organizados em um único store com seletores exportados.

### Expo Router v4
Navegação baseada em arquivos com suporte a deep links, TypeScript e layouts aninhados.

### Validação com Zod + React Hook Form
Formulários com validação client-side robusta e mensagens de erro em português.

---

## Funcionalidades implementadas

- [x] Listagem de lojas com contador de produtos
- [x] Cadastro de nova loja (nome + endereço obrigatório)
- [x] Edição de loja
- [x] Exclusão de loja (com diálogo de confirmação + cascata nos produtos)
- [x] Listagem de produtos por loja
- [x] Cadastro de produto (nome, categoria, preço)
- [x] Edição de produto
- [x] Exclusão de produto
- [x] Busca/filtro de lojas por nome e endereço
- [x] Busca/filtro de produtos por nome e categoria
- [x] Pull-to-refresh
- [x] Estados de loading e erro
- [x] Estado vazio com mensagem contextual
- [x] Testes unitários (Jest + RNTL)
- [x] TypeScript estrito
- [x] ESLint + Prettier configurados
