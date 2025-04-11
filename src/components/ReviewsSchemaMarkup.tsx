
import React from 'react';

interface Review {
  id: string;
  text: string;
  name: string;
  location?: string;
  rating: number;
}

interface ReviewsSchemaMarkupProps {
  reviews: Review[];
  averageRating?: number;
  reviewCount?: number;
}

export const ReviewsSchemaMarkup: React.FC<ReviewsSchemaMarkupProps> = ({
  reviews,
  averageRating = 5.0,
  reviewCount
}) => {
  // Calculate average rating and count if not provided
  const calculatedReviewCount = reviewCount || reviews.length;
  const calculatedAverageRating = averageRating || 
    (reviews.reduce((acc, review) => acc + review.rating, 0) / calculatedReviewCount);

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "name": "עו\"ד דני פרץ",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": calculatedAverageRating.toFixed(1),
      "reviewCount": calculatedReviewCount,
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": reviews.map(review => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": review.name
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating,
        "bestRating": "5",
        "worstRating": "1"
      },
      "reviewBody": review.text
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

export default ReviewsSchemaMarkup;
