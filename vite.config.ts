import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base path ต้องตรงกับชื่อ GitHub repo
// URL จะเป็น https://wuvapeedu-gif.github.io/health-detective/
export default defineConfig({
  plugins: [react()],
  base: '/health-detective/',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
