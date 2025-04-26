    // next.config.js

    /** @type {import('next').NextConfig} */
    const nextConfig = {
      reactStrictMode: true, // Domyślne ustawienie, dobre dla developmentu
      // --- NOWA SEKCJA: Konfiguracja obrazków ---
      images: {
        remotePatterns: [
          {
            protocol: 'https', // Protokół, z którego będziemy ładować
            hostname: 'placehold.co', // Nazwa hosta, którą dodajemy
            port: '', // Zostawiamy pusty dla standardowych portów (80/443)
            pathname: '/**', // Pozwalamy na dowolną ścieżkę na tym hoście (np. /600x400/...)
          },
          // Możesz dodać więcej obiektów tutaj dla innych hostów w przyszłości, np. dla IPFS Gateway
          // {
          //   protocol: 'https',
          //   hostname: 'twoja-brama-ipfs.infura-ipfs.io', // Przykładowa brama IPFS
          //   port: '',
          //   pathname: '/ipfs/**',
          // },
        ],
      },
      // --- KONIEC SEKCJI ---
    };

    module.exports = nextConfig;

    // Jeśli używasz next.config.mjs zamiast .js, składnia będzie podobna:
    // const nextConfig = { ... };
    // export default nextConfig;
    