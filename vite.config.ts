import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import basicSsl from "@vitejs/plugin-basic-ssl"
import mkcert from "vite-plugin-mkcert";

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react(), mkcert()],
//   server: {
//     port: 1234,
//     host: true
//   }
// })
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: 'privkey.pem',
      cert: 'fullchain.pem',
    },
    port: 443,
    host: true
  }
})
