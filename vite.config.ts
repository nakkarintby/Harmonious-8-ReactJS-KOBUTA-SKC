import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  build: {
    outDir: 'dist'
  },
  resolve: {
    alias: {
      '@api': '/src/api', // ปรับเส้นทางให้ตรงกับโครงสร้างของคุณ
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  }
});