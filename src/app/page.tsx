'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { ProductButton } from '@/components/ProductButton';
import { FloatingParticles } from '@/components/FloatingParticles';
import { useSales } from '@/hooks/useSales';
import products from '@/data/products.json';

interface Particle {
  id: number;
  x: number;
  y: number;
  text?: string;
  color?: string;
}

let particleId = 0;

export default function Home() {
  const { sales, addSale, undoLastSale, isLoaded, canUndo } = useSales();
  const [particles, setParticles] = useState<Particle[]>([]);

  const handleTap = useCallback((productId: number, x: number, y: number) => {
    addSale(productId);
    
    // Add floating particle
    const newParticle: Particle = {
      id: particleId++,
      x: x - 20,
      y: y - 30,
    };
    setParticles((prev) => [...prev, newParticle]);
  }, [addSale]);

  const handleUndo = useCallback(() => {
    const undoneProductId = undoLastSale();
    
    if (undoneProductId !== null) {
      // Add floating particle for undo
      // We position it near the undo button for clarity
      const newParticle: Particle = {
        id: particleId++,
        x: window.innerWidth - 80, // Near right edge
        y: window.innerHeight - 80, // Near bottom edge
        text: '-1',
        color: '#EF4444', // Red
      };
      setParticles((prev) => [...prev, newParticle]);
    }
  }, [undoLastSale]);

  const handleParticleComplete = useCallback((id: number) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  }, []);

  if (!isLoaded) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white text-2xl font-bold">Cargando...</div>
      </div>
    );
  }

  return (
    <main className="w-screen h-screen overflow-hidden relative">
      {/* Product Grid - 4 columns x 2 rows */}
      <div className="grid grid-cols-4 grid-rows-2 w-full h-full">
        {products.map((product) => (
          <ProductButton
            key={product.id}
            product={product}
            count={sales[product.id] || 0}
            onTap={handleTap}
          />
        ))}
      </div>

      {/* Floating Particles */}
      <FloatingParticles 
        particles={particles} 
        onComplete={handleParticleComplete} 
      />

      {/* Undo Button */}
      {canUndo && (
        <button
          onClick={handleUndo}
          className="fixed bottom-6 right-6 w-16 h-16 bg-white shadow-xl rounded-full flex items-center justify-center text-3xl z-40 hover:bg-gray-100 active:scale-90 transition-all border-4 border-gray-200"
          aria-label="Deshacer última venta"
        >
          ↩️
        </button>
      )}
    </main>
  );
}
