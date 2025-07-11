import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // This is the most crucial part for Vercel deployments causing blank pages.
  // It ensures that all your assets (JS, CSS, images) are referenced correctly
  // from the root of your deployed domain on Vercel.
  base: '/', 

  // The build configuration.
  // 'outDir' specifies where the production build files will be placed.
  // 'dist' is the default and what Vercel expects.
  build: {
    outDir: 'dist', // Ensure this matches Vercel's "Output Directory" setting
  },

  // 'server' options are primarily for local development (`npm run dev`)
  // and do not affect the Vercel deployment. You typically don't need to change these
  // unless you have specific local development requirements.
  server: {
    // You can set the port for local development if needed, e.g., port: 3000,
    // host: true, // This allows access from network IP as well
  },
});
