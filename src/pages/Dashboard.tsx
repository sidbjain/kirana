import { useState, useMemo } from "react";
import { useProducts } from "../context/ProductContext";
import { Calculator, ShoppingBag, IndianRupee } from "lucide-react";
import { cn } from "../lib/utils";

export function Dashboard() {
    const { products } = useProducts();
    const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || "");
    const [amount, setAmount] = useState<string>("");

    const selectedProduct = useMemo(
        () => products.find((p) => p.id === selectedProductId),
        [products, selectedProductId]
    );

    const calculatedQuantity = useMemo(() => {
        if (!selectedProduct || !amount) return 0;
        const amountNum = parseFloat(amount);
        if (isNaN(amountNum)) return 0;

        // Quantity = Amount / Price
        const qty = amountNum / selectedProduct.price;
        return qty;
    }, [selectedProduct, amount]);

    const formatQuantity = (qty: number, unit: string) => {
        if (qty === 0) return "0.00";

        if (unit === "kg" || unit === "liter") {
            if (qty < 1) {
                // Convert to grams/ml if less than 1
                return `${(qty * 1000).toFixed(2)}`;
            }
            return `${qty.toFixed(2)}`;
        }
        return qty.toFixed(2);
    };

    const checkUnitLabel = (qty: number, unit: string) => {
        if (unit === "kg") {
            return qty < 1 ? "grams" : "kg";
        }
        if (unit === "liter") {
            return qty < 1 ? "ml" : "liter";
        }
        return unit;
    }

    return (
        <div className="bg-white min-h-full">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-1">Calculate quantity based on amount</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Calculator Section */}
                <div className="space-y-6">
                    <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-orange-500 rounded-lg text-white">
                                <Calculator size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Quick Calculator</h2>
                                <p className="text-sm text-gray-500">Calculate quantity based on amount</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-yellow-400 p-6 rounded-xl space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-yellow-900 mb-1">Select Product</label>
                                    <select
                                        value={selectedProductId}
                                        onChange={(e) => setSelectedProductId(e.target.value)}
                                        className="w-full bg-yellow-300 border-none text-yellow-900 font-medium rounded-lg p-3 focus:ring-2 focus:ring-yellow-600 outline-none cursor-pointer"
                                    >
                                        {products.map(p => (
                                            <option key={p.id} value={p.id}>
                                                {p.name} - ₹{p.price}/{p.unit}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-yellow-900 mb-1">Target Amount (₹)</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-yellow-700">
                                            <IndianRupee size={18} />
                                        </div>
                                        <input
                                            type="number"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            placeholder="Enter amount (e.g. 20)"
                                            className="w-full pl-9 bg-yellow-300 border-none placeholder-yellow-600 text-yellow-900 font-medium rounded-lg p-3 focus:ring-2 focus:ring-yellow-600 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white border rounded-xl p-4">
                                <p className="text-sm text-gray-500 mb-1">Price per Unit</p>
                                <p className="text-2xl font-bold text-orange-600">
                                    ₹{selectedProduct?.price}/{selectedProduct?.unit}
                                </p>
                            </div>

                            <div className="bg-green-50 border border-green-100 rounded-xl p-6 text-center">
                                <p className="text-sm text-green-700 font-medium mb-2">Quantity to Give</p>
                                <div className="text-5xl font-bold text-green-600 tracking-tight">
                                    {formatQuantity(calculatedQuantity, selectedProduct?.unit || 'kg')}
                                </div>
                                <div className="text-xl font-semibold text-green-600 mt-1">
                                    {checkUnitLabel(calculatedQuantity, selectedProduct?.unit || 'kg')}
                                </div>
                                <div className="mt-4 pt-4 border-t border-green-200">
                                    <p className="text-green-800 font-medium">{selectedProduct?.name}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Product List Section */}
                <div>
                    <div className="bg-yellow-400 rounded-xl p-6 h-full">
                        <div className="flex items-center gap-2 mb-6 text-yellow-900">
                            <ShoppingBag size={24} />
                            <h2 className="text-xl font-bold">Products</h2>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    onClick={() => setSelectedProductId(product.id)}
                                    className={cn(
                                        "bg-yellow-300 p-4 rounded-xl cursor-pointer transition-all hover:bg-yellow-200 hover:scale-[1.02]",
                                        selectedProductId === product.id ? "ring-2 ring-orange-500 ring-offset-2 ring-offset-yellow-400" : ""
                                    )}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-yellow-900">{product.name}</h3>
                                        <span className="bg-white/50 text-xs px-2 py-1 rounded-full text-yellow-800 font-medium">
                                            {product.category}
                                        </span>
                                    </div>
                                    <p className="text-2xl font-bold text-orange-600">
                                        ₹{product.price} <span className="text-sm text-yellow-800 font-medium">/{product.unit}</span>
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
