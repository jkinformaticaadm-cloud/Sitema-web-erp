import React, { useState, useMemo } from 'react';
import { Search, Plus, Filter, Download, Upload, AlertTriangle, X, Save, Trash2, Image as ImageIcon, Package, Wrench } from 'lucide-react';
import { Product } from '../types';

const CATEGORIES = [
  'Capas', 
  'Cabos', 
  'Informatica', 
  'Controles', 
  'Diversos', 
  'Peliculas 3D', 
  'Peliculas Priva',
  'Serviços'
];

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Tela iPhone 13 Pro OEM', category: 'Diversos', price: 1200, cost: 600, stock: 4, minStock: 5, image: 'https://picsum.photos/100/100?random=1', type: 'PRODUCT' },
  { id: '2', name: 'Película de Vidro 3D', category: 'Peliculas 3D', price: 30, cost: 5, stock: 150, minStock: 20, image: 'https://picsum.photos/100/100?random=2', type: 'PRODUCT' },
  { id: '3', name: 'Cabo USB-C Original', category: 'Cabos', price: 80, cost: 35, stock: 42, minStock: 10, image: 'https://picsum.photos/100/100?random=3', type: 'PRODUCT' },
  { id: '4', name: 'Formatação PC', category: 'Informatica', price: 150, cost: 0, stock: 0, minStock: 0, image: 'https://picsum.photos/100/100?random=4', type: 'SERVICE' },
];

export const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas Categorias');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: 'Diversos',
    price: 0,
    cost: 0,
    stock: 0,
    minStock: 5,
    image: '',
    type: 'PRODUCT'
  });

  const handleNewProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'Diversos',
      price: 0,
      cost: 0,
      stock: 0,
      minStock: 5,
      image: '',
      type: 'PRODUCT'
    });
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({ ...product });
    setIsModalOpen(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este item?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.price) {
      alert("Nome e Preço são obrigatórios!");
      return;
    }

    const isService = formData.type === 'SERVICE';

    // Force stock to 0/ignored if it's a service, or keep user input
    const finalData = {
      ...formData,
      stock: isService ? 0 : formData.stock,
      minStock: isService ? 0 : formData.minStock,
    };

    if (editingProduct) {
      // Update existing
      setProducts(products.map(p => p.id === editingProduct.id ? { ...finalData, id: p.id } as Product : p));
    } else {
      // Create new
      const newProduct: Product = {
        ...finalData as Product,
        id: Math.random().toString(36).substr(2, 9),
        image: formData.image || `https://picsum.photos/100/100?random=${Math.random()}`
      };
      setProducts([newProduct, ...products]);
    }
    setIsModalOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'cost' || name === 'stock' || name === 'minStock' ? parseFloat(value) || 0 : value
    }));
  };

  const handleTypeChange = (type: 'PRODUCT' | 'SERVICE') => {
    setFormData(prev => ({ ...prev, type }));
  };

  // Helper to check if inputs should be disabled
  const isService = formData.type === 'SERVICE';

  // Calculate critical stock excluding services (based on all products)
  const criticalStockCount = products.filter(p => p.type !== 'SERVICE' && p.stock <= p.minStock).length;

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = categoryFilter === 'Todas Categorias' || product.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, categoryFilter]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Produtos / Serviços</h2>
          <p className="text-gray-500">Gerencie seus produtos, variações e serviços.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
            <Upload size={18} />
            <span className="hidden sm:inline">Importar XML</span>
          </button>
          <button 
            onClick={handleNewProduct}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
          >
            <Plus size={18} />
            <span>Novo Item</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Buscar por nome, código ou categoria..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select 
            className="px-4 py-2 border border-gray-200 rounded-full bg-white text-gray-600 outline-none"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option>Todas Categorias</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button className="p-2 border border-gray-200 rounded-full hover:bg-gray-50 text-gray-600">
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Stock Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-red-50 border border-red-100 p-4 rounded-lg flex items-start gap-3">
          <div className="bg-red-100 p-2 rounded-full text-red-600">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-red-800">Estoque Crítico</h4>
            <p className="text-sm text-red-600">{criticalStockCount} produtos abaixo do mínimo</p>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex items-start gap-3">
          <div className="bg-blue-100 p-2 rounded-full text-blue-600">
            <Download size={20} />
          </div>
          <div>
            <h4 className="font-semibold text-blue-800">Total de Itens</h4>
            <p className="text-sm text-blue-600">{products.length} itens cadastrados</p>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Item</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoria</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Custo</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Preço Venda</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estoque</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={product.image} alt={product.name} className="h-10 w-10 rounded-lg object-cover bg-gray-100" />
                        <span className="font-medium text-gray-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded font-medium ${product.type === 'SERVICE' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                        {product.type === 'SERVICE' ? 'Serviço' : 'Produto'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{product.category}</td>
                    <td className="px-6 py-4 text-gray-500">R$ {product.cost.toFixed(2)}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">R$ {product.price.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      {product.type === 'SERVICE' ? (
                        <span className="text-gray-400">-</span>
                      ) : (
                        <span className={`${product.stock <= product.minStock ? 'text-red-600 font-bold' : 'text-gray-700'}`}>
                          {product.stock} un
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {product.type === 'SERVICE' ? (
                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                          Disponível
                        </span>
                      ) : (
                        product.stock <= product.minStock ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Repor
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Em dia
                          </span>
                        )
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                          <button 
                              onClick={() => handleEditProduct(product)}
                              className="text-blue-600 hover:text-blue-900 font-medium text-sm p-1 hover:bg-blue-50 rounded"
                          >
                              Editar
                          </button>
                          <button 
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-400 hover:text-red-700 p-1 hover:bg-red-50 rounded"
                          >
                              <Trash2 size={16} />
                          </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    Nenhum produto encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500">
          <span>Mostrando {filteredProducts.length} de {products.length} itens</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50">Anterior</button>
            <button className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50">Próximo</button>
          </div>
        </div>
      </div>

      {/* Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl animate-scale-in">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-xl">
              <h3 className="text-lg font-bold text-gray-800">
                {editingProduct ? 'Editar Item' : 'Novo Item'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-1 rounded-full"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              
              {/* Type Selection */}
              <div className="mb-6 flex justify-center">
                <div className="bg-gray-100 p-1 rounded-lg flex gap-1">
                  <button 
                    onClick={() => handleTypeChange('PRODUCT')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-all ${!isService ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <Package size={16} />
                    Produto
                  </button>
                  <button 
                    onClick={() => handleTypeChange('SERVICE')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-all ${isService ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <Wrench size={16} />
                    Serviço
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Item</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL da Imagem</label>
                  <div className="flex gap-2">
                    <input 
                        type="text" 
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
                        placeholder="http://..." 
                    />
                    <div className="w-10 h-10 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-gray-400">
                       {formData.image ? <img src={formData.image} alt="Preview" className="w-full h-full object-cover rounded" /> : <ImageIcon size={20}/>}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preço de Custo (R$)</label>
                  <input 
                    type="number" 
                    name="cost"
                    value={formData.cost}
                    onChange={handleChange}
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preço de Venda (R$)</label>
                  <input 
                    type="number" 
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-800 bg-white" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estoque Atual</label>
                  <input 
                    type="number" 
                    name="stock"
                    value={isService ? 0 : formData.stock}
                    onChange={handleChange}
                    disabled={isService}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${isService ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-900'}`}
                  />
                  {isService && <p className="text-xs text-gray-400 mt-1">Não aplicável para serviços</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estoque Mínimo</label>
                  <input 
                    type="number" 
                    name="minStock"
                    value={isService ? 0 : formData.minStock}
                    onChange={handleChange}
                    disabled={isService}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${isService ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-900'}`}
                  />
                  {isService && <p className="text-xs text-gray-400 mt-1">Não aplicável para serviços</p>}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 rounded-b-xl">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg border border-gray-300 bg-white transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSave}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg shadow-blue-900/20 font-medium"
              >
                <Save size={18} />
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
