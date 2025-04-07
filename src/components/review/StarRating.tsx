
import React, { useState } from 'react';
import { StarIcon } from 'lucide-react';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  onHover?: (value: number) => void;
}

export const StarRating: React.FC<StarRatingProps> = ({ 
  value, 
  onChange, 
  onHover 
}) => {
  const [hover, setHover] = useState(0);
  
  const handleHover = (rating: number) => {
    setHover(rating);
    if (onHover) onHover(rating);
  };
  
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange && onChange(star)}
          onMouseEnter={() => handleHover(star)}
          onMouseLeave={() => handleHover(0)}
          className={`focus:outline-none ${onChange ? 'cursor-pointer' : 'cursor-default'}`}
        >
          <StarIcon
            className={`h-6 w-6 ${
              star <= (hover || value) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
};
