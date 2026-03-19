import { createServer, Model, belongsTo, hasMany, RestSerializer } from 'miragejs';
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';

let _server: ReturnType<typeof createServer> | null = null;

export async function makeServer() {
  if (_server) {
    _server.shutdown();
  }

  const storedDB = await AsyncStorage.getItem('mirage_db');
  let initialData = null;
  if (storedDB) {
    try {
      initialData = JSON.parse(storedDB);
    } catch (e) {}
  }

  _server = createServer({
    models: {
      store: Model.extend({
        products: hasMany(),
      }),
      product: Model.extend({
        store: belongsTo(),
      }),
      user: Model,
      category: Model,
    },

    serializers: {
      application: RestSerializer,
    },

    seeds(server) {
      if (initialData) {
        server.db.loadData(initialData);
        return;
      }

      server.create('category', { id: 'cat-1', name: 'Roupas' });
      server.create('category', { id: 'cat-2', name: 'Calçados' });
      server.create('category', { id: 'cat-3', name: 'Eletrônicos' });
      server.create('category', { id: 'cat-4', name: 'Acessórios' });
      server.create('category', { id: 'cat-5', name: 'Papelaria' });

      // IDs fixos para que as URLs continuem válidas após recarregar a página
      const lojaCentro = server.create('store', {
        id: 'seed-store-001',
        name: 'Loja Centro',
        address: 'Rua das Flores, 123 – Centro',
        createdAt: new Date().toISOString(),
      });

      const lojaShopping = server.create('store', {
        id: 'seed-store-002',
        name: 'Loja Shopping Norte',
        address: 'Av. das Américas, 4666 – Shopping Norte, Loja 102',
        createdAt: new Date().toISOString(),
      });

      const lojaZonaSul = server.create('store', {
        id: 'seed-store-003',
        name: 'Loja Zona Sul',
        address: 'Rua XV de Novembro, 890 – Zona Sul',
        createdAt: new Date().toISOString(),
      });

      const storeData: Array<{
        storeId: string;
        name: string;
        category: string;
        price: number;
      }> = [
        { storeId: lojaCentro.id, name: 'Camiseta Básica', category: 'Roupas', price: 49.9 },
        { storeId: lojaCentro.id, name: 'Calça Jeans Slim', category: 'Roupas', price: 129.9 },
        { storeId: lojaCentro.id, name: 'Tênis Casual', category: 'Calçados', price: 219.9 },
        { storeId: lojaShopping.id, name: 'Fone de Ouvido Bluetooth', category: 'Eletrônicos', price: 299.9 },
        { storeId: lojaShopping.id, name: 'Mochila Executiva', category: 'Acessórios', price: 189.9 },
        { storeId: lojaZonaSul.id, name: 'Notebook i5', category: 'Eletrônicos', price: 3499.9 },
        { storeId: lojaZonaSul.id, name: 'Mouse Sem Fio', category: 'Eletrônicos', price: 89.9 },
        { storeId: lojaZonaSul.id, name: 'Caderno A4', category: 'Papelaria', price: 24.9 },
      ];

      storeData.forEach(({ storeId, name, category, price }) => {
        server.create('product', {
          id: uuidv4(),
          storeId,
          name,
          category,
          price,
          createdAt: new Date().toISOString(),
        });
      });
    },

    routes() {
      this.urlPrefix = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
      this.namespace = 'api';
      this.timing = 300;

      // Persist helper
      const persistDB = () => {
        AsyncStorage.setItem('mirage_db', JSON.stringify(this.db.dump())).catch(() => {});
      };

      // ─── Categories ────────────────────────────────────────────────────────
      this.get('/categories', (schema) => {
        return schema.all('category').models;
      });

      // ─── Auth ─────────────────────────────────────────────────────────────
      this.post('/auth/register', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        const existing = schema.findBy('user', { email: attrs.email } as any);
        if (existing) {
          return new Response(JSON.stringify({ message: 'E-mail já está em uso' }), { status: 400 });
        }
        const user = schema.create('user', { id: uuidv4(), ...attrs });
        persistDB();
        return { user, token: 'fake-jwt-token-' + user.id };
      });

      this.post('/auth/login', (schema, request) => {
        const { email, password } = JSON.parse(request.requestBody);
        const user = schema.findBy('user', { email, password } as any);
        if (!user) {
          return new Response(JSON.stringify({ message: 'Credenciais inválidas' }), { status: 401 });
        }
        return { user, token: 'fake-jwt-token-' + user.id };
      });

      // ─── Stores ───────────────────────────────────────────────────────────
      this.get('/stores', (schema, request) => {
        const userId = request.requestHeaders.Authorization?.replace('Bearer ', '');
        const stores = schema.where('store', (store: any) => store.userId === userId || store.userId === undefined);
        return stores.models.map((store) => ({
          id: store.id,
          name: (store as any).name,
          address: (store as any).address,
          createdAt: (store as any).createdAt,
          productsCount: schema.where('product', { storeId: store.id } as any).models.length,
        }));
      });

      this.post('/stores', (schema, request) => {
        const userId = request.requestHeaders.Authorization?.replace('Bearer ', '');
        const attrs = JSON.parse(request.requestBody);
        const res = schema.create('store', {
          id: uuidv4(),
          userId,
          ...attrs,
          createdAt: new Date().toISOString(),
        });
        persistDB();
        return res;
      });

      this.get('/stores/:id', (schema, request) => {
        const store = schema.find('store', request.params.id);
        if (!store) return new Response(JSON.stringify({ message: 'Loja não encontrada' }), { status: 404 });
        return {
          id: store.id,
          name: (store as any).name,
          address: (store as any).address,
          createdAt: (store as any).createdAt,
          productsCount: schema.where('product', { storeId: store.id } as any).models.length,
        };
      });

      this.patch('/stores/:id', (schema, request) => {
        const store = schema.find('store', request.params.id);
        if (!store) return new Response(JSON.stringify({ message: 'Loja não encontrada' }), { status: 404 });
        const attrs = JSON.parse(request.requestBody);
        store.update(attrs);
        persistDB();
        return {
          id: store.id,
          name: (store as any).name,
          address: (store as any).address,
          createdAt: (store as any).createdAt,
          productsCount: schema.where('product', { storeId: store.id } as any).models.length,
        };
      });

      this.del('/stores/:id', (schema, request) => {
        const store = schema.find('store', request.params.id);
        if (!store) return new Response(JSON.stringify({ message: 'Loja não encontrada' }), { status: 404 });
        schema.where('product', { storeId: request.params.id } as any).destroy();
        store.destroy();
        persistDB();
        return { message: 'Loja excluída com sucesso' };
      });

      // ─── Products ─────────────────────────────────────────────────────────
      this.get('/stores/:storeId/products', (schema, request) => {
        return schema.where('product', { storeId: request.params.storeId } as any).models.map((p) => ({
          id: p.id,
          storeId: (p as any).storeId,
          name: (p as any).name,
          category: (p as any).category,
          price: (p as any).price,
          createdAt: (p as any).createdAt,
        }));
      });

      this.post('/stores/:storeId/products', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        const product = schema.create('product', {
          id: uuidv4(),
          storeId: request.params.storeId,
          ...attrs,
          price: Number(attrs.price),
          createdAt: new Date().toISOString(),
        });
        persistDB();
        return {
          id: product.id,
          storeId: (product as any).storeId ?? request.params.storeId,
          name: (product as any).name,
          category: (product as any).category,
          price: Number((product as any).price),
          createdAt: (product as any).createdAt,
        };
      });

      this.patch('/products/:id', (schema, request) => {
        const product = schema.find('product', request.params.id);
        if (!product) return new Response(JSON.stringify({ message: 'Produto não encontrado' }), { status: 404 });
        const attrs = JSON.parse(request.requestBody);
        product.update(attrs);
        persistDB();
        return {
          id: product.id,
          storeId: (product as any).storeId,
          name: (product as any).name,
          category: (product as any).category,
          price: (product as any).price,
          createdAt: (product as any).createdAt,
        };
      });

      this.del('/products/:id', (schema, request) => {
        const product = schema.find('product', request.params.id);
        if (!product) return new Response(JSON.stringify({ message: 'Produto não encontrado' }), { status: 404 });
        product.destroy();
        persistDB();
        return { message: 'Produto excluído com sucesso' };
      });
    },
  });

  return _server;
}
