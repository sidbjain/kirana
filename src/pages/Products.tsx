import { useState } from "react";
import { useProducts, type Product, type Unit } from "../context/ProductContext";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";

export function Products() {
    const { products, addProduct, updateProduct, deleteProduct } = useProducts();
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Form State
    const [formData, setFormData] = useState<Omit<Product, "id">>({
        name: "",
        price: 0,
        unit: "kg",
        category: "",
        stock: 0,
    });

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenModal = (product?: Product) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                price: product.price,
                unit: product.unit,
                category: product.category,
                stock: product.stock || 0,
            });
        } else {
            setEditingProduct(null);
            setFormData({ name: "", price: 0, unit: "kg", category: "", stock: 0 });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingProduct) {
            updateProduct(editingProduct.id, formData);
        } else {
            addProduct(formData);
        }
        handleCloseModal();
    };

    return (
        <div className="bg-white min-h-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-3">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Inventory</h1>
                    <p className="text-gray-500 mt-1">Manage your product stock</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors self-start sm:self-auto"
                >
                    <Plus size={20} />
                    Add Product
                </button>
            </div>

            <div className="bg-yellow-400 rounded-xl p-4 md:p-6">
                {/* Search */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
                    <h2 className="text-xl font-bold text-yellow-900">Products List</h2>
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-700" size={18} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-yellow-300 placeholder-yellow-700 text-yellow-900 border-none focus:ring-2 focus:ring-orange-500 outline-none"
                        />
                    </div>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-3">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="bg-white rounded-xl p-4 shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-gray-900">{product.name}</h3>
                                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{product.category}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleOpenModal(product)} className="text-yellow-600 p-1.5 hover:bg-yellow-100 rounded-lg transition-colors">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => deleteProduct(product.id)} className="text-red-500 p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex gap-4 mt-2 text-sm">
                                <div>
                                    <p className="text-gray-500 text-xs">Price</p>
                                    <p className="font-bold text-orange-600">₹{product.price}/{product.unit}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500 text-xs">Stock</p>
                                    <p className={`font-bold ${product.stock < 10 ? 'text-red-600' : 'text-green-600'}`}>
                                        {product.stock} {product.unit}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredProducts.length === 0 && (
                        <div className="bg-white rounded-xl py-8 text-center text-gray-500">No products found.</div>
                    )}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto rounded-lg">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-yellow-300 text-yellow-900">
                                <th className="px-6 py-3 font-semibold">Product Name</th>
                                <th className="px-6 py-3 font-semibold">Price</th>
                                <th className="px-6 py-3 font-semibold">Stock</th>
                                <th className="px-6 py-3 font-semibold">Unit</th>
                                <th className="px-6 py-3 font-semibold">Category</th>
                                <th className="px-6 py-3 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-yellow-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                                    <td className="px-6 py-4 text-orange-600 font-bold">₹{product.price}</td>
                                    <td className="px-6 py-4 font-medium">
                                        <span className={product.stock < 10 ? "text-red-600" : "text-green-600"}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 capitalize">{product.unit === 'liter' ? 'Liter' : product.unit}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            onClick={() => handleOpenModal(product)}
                                            className="text-yellow-600 hover:text-yellow-800 p-1 hover:bg-yellow-100 rounded transition-colors"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => deleteProduct(product.id)}
                                            className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredProducts.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        No products found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-t-2xl sm:rounded-xl shadow-xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-4">
                            {editingProduct ? "Edit Product" : "Add New Product"}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                        className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.stock}
                                        onChange={(e) => setFormData({ ...formData, stock: parseFloat(e.target.value) })}
                                        className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                                    <select
                                        value={formData.unit}
                                        onChange={(e) => setFormData({ ...formData, unit: e.target.value as Unit })}
                                        className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
                                    >
                                        <option value="kg">kg</option>
                                        <option value="liter">liter</option>
                                        <option value="piece">piece</option>
                                        <option value="gram">gram</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500"
                                        placeholder="e.g. Grains"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
                                >
                                    {editingProduct ? "Save Changes" : "Add Product"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
