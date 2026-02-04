'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface FloatingParticle {
  id: number;
  x: number;
  y: number;
  text?: string;
  color?: string;
}

interface FloatingParticlesProps {
  particles: FloatingParticle[];
  onComplete: (id: number) => void;
}

export function FloatingParticles({ particles, onComplete }: FloatingParticlesProps) {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ 
              opacity: 1, 
              y: 0,
              scale: 1,
            }}
            animate={{ 
              opacity: 0, 
              y: -120,
              scale: 1.5,
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 0.8,
              ease: 'easeOut',
            }}
            onAnimationComplete={() => onComplete(particle.id)}
            className="absolute text-4xl font-black drop-shadow-lg"
            style={{
              left: particle.x,
              top: particle.y,
              color: particle.color || 'white',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            }}
          >
            {particle.text || '+1'}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
