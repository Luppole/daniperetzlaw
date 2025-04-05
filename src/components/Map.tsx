
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Skeleton } from '@/components/ui/skeleton';

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

  // This would ideally come from an environment variable
  const handleTokenInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMapboxToken(e.target.value);
    localStorage.setItem('mapbox-token', e.target.value);
  };

  const geocodeAddress = async (address: string) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxToken}&country=IL`
      );
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        return data.features[0].center;
      }
      throw new Error('Address not found');
    } catch (error) {
      console.error('Geocoding error:', error);
      setError('Could not find address on map');
      return [35.2137, 32.6001]; // Default to Afula, Israel
    }
  };

  useEffect(() => {
    // Check for saved token in localStorage
    const savedToken = localStorage.getItem('mapbox-token');
    if (savedToken) {
      setMapboxToken(savedToken);
    }
  }, []);

  useEffect(() => {
    if (!mapboxToken || !mapContainer.current) return;
    
    const initializeMap = async () => {
      setLoading(true);
      
      try {
        const coordinates = await geocodeAddress(address);
        
        mapboxgl.accessToken = mapboxToken;
        
        if (map.current) map.current.remove();
        
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: coordinates,
          zoom: 15,
        });
        
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
        
        // Add marker for the address
        new mapboxgl.Marker({ color: '#1E2756' })
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
    
    initializeMap();
    
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [address, mapboxToken]);

  if (!mapboxToken) {
    return (
      <div className={`${className} rounded-lg bg-gray-100 p-4 flex flex-col items-center justify-center`}>
        <p className="mb-2 text-sm text-gray-700">יש להכניס Mapbox token כדי להציג את המפה</p>
        <p className="mb-4 text-xs text-gray-500">ניתן להשיג token בחינם מ- <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-law-blue">mapbox.com</a></p>
        <input 
          type="text" 
          placeholder="הכנס Mapbox token" 
          className="p-2 border border-gray-300 rounded w-full mb-2 text-center"
          onChange={handleTokenInput}
        />
      </div>
    );
  }

  return (
    <div className={`relative ${className} rounded-lg overflow-hidden`}>
      {loading && <Skeleton className="absolute inset-0 z-10" />}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 z-20">
          <p className="text-law-gray">{error}</p>
        </div>
      )}
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
}
