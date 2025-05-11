import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  optimizeDeps: {
    include: [
      'react-icons/hi',
      'react-icons/ri',
      'react-chartjs-2',
      'chart.js'
    ]
  }
});
