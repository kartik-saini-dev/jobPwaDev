/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true,
  });
  
  const nextConfig = { 
    images: {
      remotePatterns: [
        {
          hostname: 'res.cloudinary.com',
        },
        {
          hostname: 'lh3.googleusercontent.com',
        },
      ],
    },
  };
  
  
  module.exports = withPWA(nextConfig);

  //This to use next/image url from cloudinary and google to show image and pwa 