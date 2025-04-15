
import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

// Your Sanity project details from the screenshot
export const projectId = 'joxy2aff';
export const dataset = 'production';
export const apiVersion = '2023-05-03';

// Create a Sanity client
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false if you want to ensure fresh content
});

// Set up the image URL builder
const builder = imageUrlBuilder(sanityClient);

// Helper function to get image URLs from Sanity
export const urlFor = (source: SanityImageSource) => {
  return builder.image(source);
};
