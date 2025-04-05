
import React from 'react';
import { Map } from '@/components/Map';

interface LocationMapProps {
  address: string;
}

export function LocationMap({ address }: LocationMapProps) {
  return (
    <div className="glass-card p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-xl overflow-hidden max-h-[400px]">
      <h3 className="text-xl font-bold text-law-navy mb-4">מיקום המשרד</h3>
      <div className="h-[200px] w-full overflow-hidden rounded-lg">
        <Map address={address} />
      </div>
      <div className="mt-3 text-center text-law-gray text-sm">
        <p>רח' שד' בן גוריון 1, מגדל בסר 2, קומה 15, באר שבע</p>
      </div>
    </div>
  );
}
