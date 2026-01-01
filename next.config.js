/** @type {import('next').NextConfig} */
const nextConfig = {
    // Correctly handle ONNX and WASM files for local AI
    webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            "sharp$": false,
            "onnxruntime-node$": false,
        }
        return config;
    },
    // Prevent server-side packages from being bundled into client
    serverExternalPackages: ['@xenova/transformers'],
};

module.exports = nextConfig;
