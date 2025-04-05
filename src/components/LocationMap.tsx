
import React from 'react';
import { Map } from '@/components/Map';

interface LocationMapProps {
  address: string;
}

export function LocationMap({ address }: LocationMapProps) {
  return (
    <div className="glass-card p-8 h-64 transition-all duration-300 hover:shadow-xl">
      <h3 className="text-2xl font-bold text-law-dark mb-4">מיקום המשרד</h3>
      <Map address={address} />
    </div>
  );
}
