import React, { createContext, useContext, useState, useEffect } from "react";

export type Unit = "kg" | "gram" | "liter" | "piece";

export interface Product {
    id: string;
    name: string;
    price: number; // Price per unit
    unit: Unit;
    category: string;
    stock: number; // Available quantity
}

interface ProductContextType {
    products: Product[];
    addProduct: (product: Omit<Product, "id">) => void;
    updateProduct: (id: string, product: Partial<Product>) => void;
    deleteProduct: (id: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const INITIAL_PRODUCTS: Product[] = [
    { id: "1", name: "Rice", price: 60, unit: "kg", category: "Grains", stock: 100 },
    { id: "2", name: "Sugar", price: 45, unit: "kg", category: "Grocery", stock: 50 },
    { id: "3", name: "Toor Dal", price: 120, unit: "kg", category: "Pulses", stock: 30 },
    { id: "4", name: "Cooking Oil", price: 180, unit: "liter", category: "Oil & Ghee", stock: 40 },
    { id: "5", name: "Turmeric Powder", price: 200, unit: "kg", category: "Spices", stock: 15 },
    { id: "6", name: "Wheat Flour", price: 35, unit: "kg", category: "Grains", stock: 60 },
];

export function ProductProvider({ children }: { children: React.ReactNode }) {
    const [products, setProducts] = useState<Product[]>(() => {
        const saved = localStorage.getItem("products");
        return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    });

    useEffect(() => {
        localStorage.setItem("products", JSON.stringify(products));
    }, [products]);

    const addProduct = (product: Omit<Product, "id">) => {
        const newProduct = { ...product, id: crypto.randomUUID() };
        setProducts((prev) => [...prev, newProduct]);
    };

    const updateProduct = (id: string, updates: Partial<Product>) => {
        setProducts((prev) =>
            prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
        );
    };

    const deleteProduct = (id: string) => {
        setProducts((prev) => prev.filter((p) => p.id !== id));
    };

    return (
        <ProductContext.Provider
            value={{ products, addProduct, updateProduct, deleteProduct }}
        >
            {children}
        </ProductContext.Provider>
    );
}

export function useProducts() {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error("useProducts must be used within a ProductProvider");
    }
    return context;
}
