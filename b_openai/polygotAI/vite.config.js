import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'aceternity': path.resolve(__dirname, './src/aceternity/ui'), // Correction ici
      'shadcn': path.resolve(__dirname, './src/shadcn'), // Alias correct pour Shadcn
    }
  }
});
