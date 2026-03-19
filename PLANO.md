# Plano de Implementação – Desafio Vaga React Native

## Status atual
✅ **CONCLUÍDO** – Todas as etapas 1–9 implementadas e validadas.
- `npm install` OK (corrigido `expo-router@~55.0.7`)
- TypeScript sem erros (`npx tsc --noEmit` limpo)
- 14/14 testes passando (`npm test`)
- App pronto para `npx expo start`

---

## Etapa 1 – Base limpa com Expo funcionando
**Objetivo:** `npx expo start` abre sem erros.

- [ ] Criar projeto base com `npx create-expo-app` (garante versões compatíveis)
- [ ] Validar que o app abre no browser/dispositivo
- [ ] Fazer commit: `chore: project base setup`

---

## Etapa 2 – Expo Router
**Objetivo:** Navegação entre telas funcionando.

- [ ] Instalar e configurar `expo-router`
- [ ] Criar estrutura de rotas (`app/` com `_layout.tsx` e `index.tsx`)
- [ ] Validar navegação básica
- [ ] Fazer commit: `feat: add expo-router navigation`

---

## Etapa 3 – NativeWind + Gluestack UI
**Objetivo:** Estilização com Tailwind funcionando.

- [ ] Instalar `nativewind`, `tailwindcss`, `@gluestack-ui/nativewind-utils`
- [ ] Instalar dependências obrigatórias: `react-native-reanimated`, `react-native-worklets`
- [ ] Configurar `babel.config.js`, `metro.config.js`, `tailwind.config.js`, `global.css`
- [ ] Criar componente simples com className e validar
- [ ] Fazer commit: `feat: add nativewind + gluestack ui`

---

## Etapa 4 – MirageJS (mock backend)
**Objetivo:** Endpoints `/stores` e `/products` respondendo.

- [ ] Instalar `miragejs` (com `.npmrc` legacy-peer-deps)
- [ ] Criar `src/services/mock/server.ts` com seed de dados
- [ ] Testar endpoints com `fetch` no console
- [ ] Fazer commit: `feat: add miragejs mock server`

---

## Etapa 5 – Zustand + tipos + serviços
**Objetivo:** Estado global funcionando com chamadas à API mock.

- [ ] Instalar `zustand`
- [ ] Criar `src/types/index.ts`
- [ ] Criar `src/services/api.ts`
- [ ] Criar `src/store/index.ts`
- [ ] Criar hooks `useStores` e `useProducts`
- [ ] Fazer commit: `feat: add zustand store and api service`

---

## Etapa 6 – Módulo de Lojas
**Objetivo:** CRUD de lojas funcionando.

- [ ] Tela de listagem (`app/stores/index.tsx`)
- [ ] Formulário de criação (`app/stores/new.tsx`)
- [ ] Formulário de edição (`app/stores/[id]/edit.tsx`)
- [ ] Exclusão com confirmação
- [ ] Fazer commit: `feat: stores module – list, create, edit, delete`

---

## Etapa 7 – Módulo de Produtos
**Objetivo:** CRUD de produtos por loja funcionando.

- [ ] Tela de detalhe da loja + lista de produtos (`app/stores/[id]/index.tsx`)
- [ ] Formulário de criação (`app/stores/[id]/products/new.tsx`)
- [ ] Formulário de edição (`app/stores/[id]/products/[productId]/edit.tsx`)
- [ ] Exclusão com confirmação
- [ ] Fazer commit: `feat: products module – list, create, edit, delete`

---

## Etapa 8 – Busca e filtro
**Objetivo:** Busca de lojas e produtos funcionando.

- [ ] Componente `SearchBar`
- [ ] Filtro na listagem de lojas
- [ ] Filtro na listagem de produtos
- [ ] Fazer commit: `feat: add search and filter`

---

## Etapa 9 – Validação de formulários
**Objetivo:** Formulários com validação e mensagens de erro.

- [ ] Instalar `react-hook-form`, `@hookform/resolvers`, `zod`
- [ ] Aplicar schemas de validação nos formulários de loja e produto
- [ ] Fazer commit: `feat: add form validation with zod`

---

## Etapa 10 – Diferenciais (após core funcionando)
**Objetivo:** Pontuar nos critérios extras.

- [ ] Design Patterns: Repository e Adapter na camada de serviços
- [ ] AsyncStorage para cache offline
- [ ] Testes unitários com Jest + @testing-library/react-native
- [ ] Fazer commits separados por item

---

## Regras do plano
1. **Não avançar** para a próxima etapa sem validar a atual
2. **Um commit por etapa** — histórico limpo
3. Se uma dependência gerar conflito, **resolver antes de adicionar outra**
4. O código das etapas anteriores já existe — será **aproveitado, não reescrito do zero**
