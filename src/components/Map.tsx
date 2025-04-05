
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, ExternalLink } from 'lucide-react';

interface MapProps {
  address: string;
  className?: string;
}

export function Map({ address, className = "w-full h-64" }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);

  // This would ideally come from an environment variable
  const handleTokenInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const token = e.target.value;
    setMapboxToken(token);
    localStorage.setItem('mapbox-token', token);
    
    if (token) {
      setLoading(true);
      setError(null);
      initializeMap(token, address);
    }
  };

  const geocodeAddress = async (address: string, token: string): Promise<[number, number]> => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${token}&country=IL`
      );
      
      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const center = data.features[0].center as [number, number];
        setCoordinates(center);
        return center;
      }
      throw new Error('Address not found');
    } catch (error) {
      console.error('Geocoding error:', error);
      setError('Could not find address on map');
      return [35.2137, 32.6001]; // Default to Afula, Israel
    }
  };

  const initializeMap = async (token: string, address: string) => {
    if (!mapContainer.current) return;
    
    setLoading(true);
    
    try {
      const coordinates = await geocodeAddress(address, token);
      
      mapboxgl.accessToken = token;
      
      if (map.current) map.current.remove();
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: coordinates,
        zoom: 15,
      });
      
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Add marker for the address with animation
      const markerElement = document.createElement('div');
      markerElement.className = 'custom-marker';
      markerElement.innerHTML = `
        <div class="flex justify-center items-center w-8 h-8 bg-law-navy rounded-full shadow-md animate-bounce">
          <span class="text-white">📍</span>
        </div>
      `;
      
      new mapboxgl.Marker(markerElement)
        .setLngLat(coordinates)
        .addTo(map.current);
          
      // Add subtle animation to marker on load
      map.current.on('load', () => {
        setLoading(false);
      });
    } catch (error) {
      console.error('Map initialization error:', error);
      setError('Failed to load map');
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check for saved token in localStorage
    const savedToken = localStorage.getItem('mapbox-token');
    if (savedToken) {
      setMapboxToken(savedToken);
      initializeMap(savedToken, address);
    }
  }, [address]);

  // Build the Google Maps URL for the external link
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  if (!mapboxToken) {
    return (
      <div className={`${className} rounded-lg bg-gray-100 p-4 flex flex-col items-center justify-center relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10 pattern-grid-lg"></div>
        <MapPin className="h-8 w-8 text-law-gray/60 mb-2 animate-float" />
        <p className="mb-2 text-sm text-law-navy font-medium">יש להכניס Mapbox token כדי להציג את המפה</p>
        <p className="mb-4 text-xs text-law-gray">ניתן להשיג token בחינם מ- <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-law-blue hover:underline">mapbox.com</a></p>
        <input 
          type="text" 
          placeholder="הכנס Mapbox token" 
          className="p-2 border border-gray-300 rounded w-full mb-2 text-center focus:ring-2 focus:ring-law-blue/20 focus:border-law-blue/40 transition-all"
          onChange={handleTokenInput}
        />
        <a 
          href={googleMapsUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-law-blue hover:underline text-sm flex items-center mt-2"
        >
          פתח ב-Google Maps
          <ExternalLink className="w-3 h-3 mr-1" />
        </a>
      </div>
    );
  }

  return (
    <div className={`relative ${className} rounded-lg overflow-hidden transition-all duration-300 shadow-md hover:shadow-lg`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Skeleton className="absolute inset-0" />
          <div className="relative z-20 text-law-navy/70 text-sm font-medium animate-pulse">
            טוען מפה...
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 z-20">
          <div className="text-center p-4">
            <p className="text-law-gray mb-2">{error}</p>
            <a 
              href={googleMapsUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-law-blue hover:underline text-sm flex items-center justify-center"
            >
              פתח ב-Google Maps
              <ExternalLink className="w-3 h-3 mr-1" />
            </a>
          </div>
        </div>
      )}
      
      <div ref={mapContainer} className="w-full h-full" />
      
      {coordinates && !loading && !error && (
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-2 left-2 bg-white/90 hover:bg-white p-1.5 rounded-md shadow-sm text-xs flex items-center transition-all duration-300 hover:shadow"
        >
          <ExternalLink className="w-3 h-3 mr-1 text-law-navy" />
          פתח ב-Google Maps
        </a>
      )}
    </div>
  );
}
