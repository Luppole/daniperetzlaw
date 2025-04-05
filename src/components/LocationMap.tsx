
import React from 'react';
import { Map } from '@/components/Map';

interface LocationMapProps {
  address: string;
}

export function LocationMap({ address }: LocationMapProps) {
  return (
    <div className="glass-card p-8 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl overflow-hidden h-full">
      <h3 className="text-2xl font-bold text-law-navy mb-6">מיקום המשרד</h3>
      <div className="h-[300px] w-full overflow-hidden rounded-lg">
        <Map address={address} />
      </div>
    </div>
  );
}
