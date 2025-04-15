
import React from 'react';
import { PortableText } from '@portabletext/react';

interface PortableTextRendererProps {
  content: any;
}

export function PortableTextRenderer({ content }: PortableTextRendererProps) {
  try {
    // If content is a string (from JSON.stringify), parse it
    const contentData = typeof content === 'string' ? JSON.parse(content) : content;
    
    return (
      <PortableText
        value={contentData}
        components={{
          block: {
            // Add custom styling for different block types
            normal: ({ children }) => <p className="mb-4 whitespace-pre-line">{children}</p>,
            h1: ({ children }) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
            h2: ({ children }) => <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>,
            h3: ({ children }) => <h3 className="text-xl font-bold mt-5 mb-2">{children}</h3>,
            blockquote: ({ children }) => (
              <blockquote className="border-r-4 border-law-navy pr-4 py-2 my-4 bg-gray-50 italic">
                {children}
              </blockquote>
            ),
          },
          marks: {
            link: ({ children, value }) => (
              <a href={value.href} className="text-law-navy underline hover:text-law-navy/80" target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            ),
          },
          list: {
            bullet: ({ children }) => <ul className="list-disc list-inside mb-4 pl-4">{children}</ul>,
            number: ({ children }) => <ol className="list-decimal list-inside mb-4 pl-4">{children}</ol>,
          },
          listItem: {
            bullet: ({ children }) => <li className="mb-2 whitespace-pre-line">{children}</li>,
            number: ({ children }) => <li className="mb-2 whitespace-pre-line">{children}</li>,
          },
        }}
      />
    );
  } catch (error) {
    console.error('Error rendering Portable Text:', error);
    // Fallback to simple text display if there's an error
    return <div className="whitespace-pre-line">{typeof content === 'string' ? content : 'Error displaying content'}</div>;
  }
}
