'use client';

import { motion } from 'framer-motion';
import { useCallback, useRef } from 'react';

interface Product {
  id: number;
  name: string;
  color: string;
}

interface ProductButtonProps {
  product: Product;
  count: number;
  onTap: (productId: number, x: number, y: number) => void;
}

// Calculate contrasting text color (white or black) based on background
function getContrastColor(hexColor: string): string {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

export function ProductButton({ product, count, onTap }: ProductButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    // Prevent default behavior to ensure clean event handling
    e.preventDefault();
    onTap(product.id, e.clientX, e.clientY);
  }, [product.id, onTap]);

  const textColor = getContrastColor(product.color);

  return (
    <motion.button
      ref={buttonRef}
      className="relative flex flex-col items-center justify-center w-full h-full select-none touch-none overflow-hidden"
      style={{ 
        backgroundColor: product.color,
        WebkitTapHighlightColor: 'transparent',
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      onPointerDown={handlePointerDown}
    >
      {/* Product Name */}
      <span 
        className="text-2xl md:text-3xl lg:text-4xl font-black text-center px-2 leading-tight"
        style={{ color: textColor }}
      >
        {product.name}
      </span>
      
      {/* Counter Badge */}
      <motion.span 
        key={count}
        initial={{ scale: 1.3 }}
        animate={{ scale: 1 }}
        className="mt-2 text-lg md:text-xl lg:text-2xl font-bold opacity-80"
        style={{ color: textColor }}
      >
        {count}
      </motion.span>
      
      {/* Subtle overlay for depth */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.1) 100%)',
        }}
      />
    </motion.button>
  );
}
