import { useState } from "react";
import { useProducts, type Product } from "../context/ProductContext";
import { Search, Plus, Minus, Trash2, Printer, ShoppingCart } from "lucide-react";

interface CartItem extends Product {
    quantity: number;
    amount: number;
}

export function Billing() {
    const { products, updateProduct } = useProducts();
    const [searchTerm, setSearchTerm] = useState("");
    const [cart, setCart] = useState<CartItem[]>([]);
    const [mobileTab, setMobileTab] = useState<"products" | "cart">("products");

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addToCart = (product: Product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1, amount: (item.quantity + 1) * item.price }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1, amount: product.price }];
        });
    };

    const updateQuantity = (id: string, newQty: number) => {
        if (newQty < 0) return;
        setCart((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, quantity: newQty, amount: newQty * item.price }
                    : item
            )
        );
    };

    const updateAmount = (id: string, newAmount: number) => {
        if (newAmount < 0) return;
        setCart((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, amount: newAmount, quantity: newAmount / item.price }
                    : item
            )
        );
    };

    const removeFromCart = (id: string) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
    };

    const clearCart = () => setCart([]);

    const grandTotal = cart.reduce((sum, item) => sum + item.amount, 0);

    const handlePrint = () => {
        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (product) {
                const newStock = Math.max(0, (product.stock || 0) - item.quantity);
                updateProduct(item.id, { stock: newStock });
            }
        });
        window.print();
    };

    // Shared product list JSX
    const productListJSX = (
        <div className="flex flex-col gap-4 h-full print:hidden">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
            </div>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border-none shadow-sm focus:ring-2 focus:ring-orange-500 outline-none"
                />
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {filteredProducts.map(product => (
                    <div
                        key={product.id}
                        onClick={() => addToCart(product)}
                        className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:border-orange-500 active:bg-orange-50 transition-all flex justify-between items-center"
                    >
                        <div>
                            <h3 className="font-bold text-gray-800">{product.name}</h3>
                            <p className="text-sm text-gray-500">₹{product.price} / {product.unit}</p>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                            <Plus size={18} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // Shared cart JSX
    const cartJSX = (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden h-full">
            <div id="printable-bill" className="flex-1 flex flex-col p-4 md:p-6 overflow-y-auto">
                <div className="text-center mb-6 border-b border-dashed border-gray-300 pb-6">
                    <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">Kirana Flow</h2>
                    <p className="text-gray-500 text-sm">Receipt / Bill</p>
                    <p className="text-gray-400 text-xs mt-1">{new Date().toLocaleString()}</p>
                </div>

                <div className="flex-1">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-gray-500 border-b border-gray-100">
                                <th className="text-left py-2">Item</th>
                                <th className="text-center py-2">Qty</th>
                                <th className="text-right py-2">Amount</th>
                                <th className="w-8 print:hidden"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {cart.map((item) => (
                                <tr key={item.id}>
                                    <td className="py-3 font-medium text-gray-800">
                                        {item.name}
                                        <div className="text-xs text-gray-400 font-normal">₹{item.price}/{item.unit}</div>
                                    </td>
                                    <td className="py-3 text-center">
                                        <div className="flex flex-col items-center print:hidden">
                                            <div className="flex items-center justify-center gap-1">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="p-1 hover:bg-gray-100 rounded text-gray-500"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <input
                                                    type="number"
                                                    value={item.quantity || ""}
                                                    onChange={(e) => {
                                                        const val = parseFloat(e.target.value);
                                                        updateQuantity(item.id, isNaN(val) ? 0 : val);
                                                    }}
                                                    className="w-14 text-center border rounded py-1 text-sm outline-none focus:border-orange-500"
                                                />
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-1 hover:bg-gray-100 rounded text-gray-500"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            {(item.unit === "kg" || item.unit === "liter") && (
                                                <span className="text-xs text-gray-500 mt-1">
                                                    = {(item.quantity * 1000).toFixed(0)} {item.unit === "kg" ? "g" : "ml"}
                                                </span>
                                            )}
                                        </div>
                                        <span className="hidden print:inline font-mono">
                                            {item.quantity.toFixed(2)} {item.unit}
                                        </span>
                                    </td>
                                    <td className="py-3 text-right font-medium text-gray-900">
                                        <div className="print:hidden">
                                            <input
                                                type="number"
                                                value={item.amount || ""}
                                                onChange={(e) => {
                                                    const val = parseFloat(e.target.value);
                                                    updateAmount(item.id, isNaN(val) ? 0 : val);
                                                }}
                                                className="w-16 text-right border rounded py-1 text-sm outline-none focus:border-orange-500"
                                            />
                                        </div>
                                        <span className="hidden print:inline">₹{item.amount.toFixed(2)}</span>
                                    </td>
                                    <td className="py-3 pl-2 text-right print:hidden">
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-gray-300 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {cart.length === 0 && (
                        <div className="text-center py-12 text-gray-400">
                            <ShoppingCart size={48} className="mx-auto mb-3 opacity-20" />
                            <p>Cart is empty</p>
                        </div>
                    )}
                </div>

                <div className="border-t border-dashed border-gray-300 pt-6 mt-6">
                    <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total</span>
                        <span>₹{grandTotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div className="p-4 border-t bg-gray-50 print:hidden">
                <div className="flex gap-3">
                    <button
                        onClick={clearCart}
                        disabled={cart.length === 0}
                        className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Trash2 size={20} />
                        Clear
                    </button>
                    <button
                        onClick={handlePrint}
                        disabled={cart.length === 0}
                        className="flex-[2] bg-gray-900 hover:bg-black text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Printer size={20} />
                        Print Bill
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Layout: Side by side */}
            <div className="hidden md:flex bg-gray-50 h-[calc(100vh-4rem)] gap-6">
                <div className="w-1/2 flex flex-col gap-4 print:hidden">
                    {productListJSX}
                </div>
                <div className="w-1/2 flex flex-col overflow-hidden h-full">
                    {cartJSX}
                </div>
            </div>

            {/* Mobile Layout: Tabs */}
            <div className="md:hidden flex flex-col h-[calc(100vh-8rem)]">
                {/* Tab Bar */}
                <div className="flex border-b border-gray-200 mb-3 print:hidden">
                    <button
                        onClick={() => setMobileTab("products")}
                        className={`flex-1 py-2.5 text-sm font-semibold transition-colors border-b-2 ${mobileTab === "products"
                                ? "border-orange-500 text-orange-600"
                                : "border-transparent text-gray-500"
                            }`}
                    >
                        Products
                    </button>
                    <button
                        onClick={() => setMobileTab("cart")}
                        className={`flex-1 py-2.5 text-sm font-semibold transition-colors border-b-2 relative ${mobileTab === "cart"
                                ? "border-orange-500 text-orange-600"
                                : "border-transparent text-gray-500"
                            }`}
                    >
                        Cart
                        {cart.length > 0 && (
                            <span className="ml-1.5 bg-orange-500 text-white text-xs rounded-full px-1.5 py-0.5">
                                {cart.length}
                            </span>
                        )}
                    </button>
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-hidden">
                    <div className={mobileTab === "products" ? "h-full flex flex-col gap-3" : "hidden"}>
                        {productListJSX}
                    </div>
                    <div className={mobileTab === "cart" ? "h-full" : "hidden"}>
                        {cartJSX}
                    </div>
                </div>
            </div>
        </>
    );
}
