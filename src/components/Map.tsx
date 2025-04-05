
import React from 'react';
import { ExternalLink } from 'lucide-react';

interface MapProps {
  address: string;
  className?: string;
}

export function Map({ address, className = "w-full h-full" }: MapProps) {
  // Build Google Maps URL for external link and embedding
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  const googleMapsEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(address)}&zoom=15&language=iw`;

  return (
    <div className={`relative ${className} rounded-lg overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md`}>
      <iframe
        title="Google Maps Location"
        src={googleMapsEmbedUrl}
        className="w-full h-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      ></iframe>
      
      <a
        href={googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-2 right-2 bg-white/90 hover:bg-white p-1.5 rounded-md shadow-sm text-xs flex items-center transition-all duration-300 hover:shadow"
      >
        <ExternalLink className="w-3 h-3 ml-1 text-law-navy" />
        פתח ב-Google Maps
      </a>
    </div>
  );
}
