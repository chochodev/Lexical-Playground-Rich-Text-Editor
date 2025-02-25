import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [react(), dts(),],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: "chocho-lexicaleditor",
      fileName: "chocho-lexicaleditor",
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: [
        'react', 
        'react-dom', 
        'lexical', 
        '@lexical/react', 
        "@heroui/react",
        "framer-motion",
        "react-icons",
        "zod",
        "zustand",],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "@heroui/react": "HeroUI",
          lexical: "Lexical",
          "@lexical/react": "LexicalReact",
          "framer-motion": "FramerMotion",
          "react-icons": "ReactIcons",
          zod: "Zod",
          zustand: "Zustand",
        }
      }
    }
  },
  resolve: {
    alias: {
      "@": "/src"
    }
  }
});
