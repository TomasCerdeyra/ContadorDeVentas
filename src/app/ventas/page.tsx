'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSales } from '@/hooks/useSales';
import { exportToExcel } from '@/utils/exportToExcel';
import products from '@/data/products.json';

export default function VentasPage() {
  const { sales, resetSales, getSalesData, isLoaded } = useSales();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleExport = () => {
    exportToExcel(getSalesData());
  };

  const handleReset = () => {
    setShowConfirm(true);
  };

  const confirmReset = () => {
    resetSales();
    setShowConfirm(false);
  };

  const totalSales = Object.values(sales).reduce((sum, count) => sum + count, 0);

  if (!isLoaded) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-2xl font-bold">Cargando...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <span className="text-2xl">←</span>
          <span className="font-medium">Volver</span>
        </Link>
        <h1 className="text-3xl font-black">Reporte de Ventas</h1>
        <div className="w-24" /> {/* Spacer for centering */}
      </div>

      {/* Sales Table */}
      <div className="max-w-2xl mx-auto bg-gray-800 rounded-xl overflow-hidden shadow-2xl mb-8">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-700">
              <th className="text-left py-4 px-6 font-bold text-gray-300">Producto</th>
              <th className="text-right py-4 px-6 font-bold text-gray-300">Cantidad</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr
                key={product.id}
                className={`border-t border-gray-700 ${
                  index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-800/50'
                }`}
              >
                <td className="py-4 px-6 font-medium">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: product.color }}
                    />
                    {product.name}
                  </div>
                </td>
                <td className="py-4 px-6 text-right font-bold text-xl">
                  {sales[product.id] || 0}
                </td>
              </tr>
            ))}
            {/* Total Row */}
            <tr className="bg-gray-700 border-t-2 border-gray-600">
              <td className="py-4 px-6 font-black text-lg">TOTAL</td>
              <td className="py-4 px-6 text-right font-black text-2xl text-emerald-400">
                {totalSales}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div className="max-w-2xl mx-auto flex gap-4">
        <button
          onClick={handleExport}
          className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-4 px-6 rounded-xl font-bold text-lg transition-colors shadow-lg"
        >
          📥 Exportar Excel
        </button>
        <button
          onClick={handleReset}
          className="flex-1 bg-red-600 hover:bg-red-500 text-white py-4 px-6 rounded-xl font-bold text-lg transition-colors shadow-lg"
        >
          🗑️ Resetear Todo
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-md mx-4">
            <h2 className="text-2xl font-bold mb-4 text-center">⚠️ ¿Estás seguro?</h2>
            <p className="text-gray-400 text-center mb-6">
              Esta acción eliminará todos los contadores de ventas. Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-500 text-white py-3 px-6 rounded-xl font-bold transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmReset}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white py-3 px-6 rounded-xl font-bold transition-colors"
              >
                Sí, Resetear
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
