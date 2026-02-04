
import React from 'react';
import { Hairstyle } from './types';

export const HAIRSTYLES: Hairstyle[] = [
  {
    id: 'textured-fringe',
    name: 'Textured Fringe',
    description: 'Modern messy volume with a forward sweep. Very popular.',
    icon: '⚡',
    prompt: 'a modern men textured fringe haircut, messy voluminous top, short sides, realistic hair texture, natural lighting'
  },
  {
    id: 'modern-mullet',
    name: 'Modern Mullet',
    description: 'The trendiest look of the year. Edgy and bold.',
    icon: '🎸',
    prompt: 'a trendy modern men mullet, short textured front and sides with long flowing back, high realism, professional cut'
  },
  {
    id: 'burst-fade',
    name: 'Burst Fade',
    description: 'Sharp curved fade around the ear. Clean and sharp.',
    icon: '🔥',
    prompt: 'a clean men burst fade haircut, curved taper around the ear, textured hair on top, sharp lineup, realistic'
  },
  {
    id: 'taper-curls',
    name: 'Taper + Curls',
    description: 'Natural volume on top with tight side tapers.',
    icon: '🥦',
    prompt: 'men curly hair with a low taper fade, voluminous natural curls on top, sharp edges, realistic hair follicles'
  },
  {
    id: 'icy-buzz',
    name: 'Icy Buzz Cut',
    description: 'Ultra-short platinum blonde buzz. High contrast.',
    icon: '❄️',
    prompt: 'men buzz cut dyed icy platinum silver, sharp clean hairline, short stubble, realistic scalp and lighting'
  },
  {
    id: 'slicked-back-flow',
    name: 'Slick Back Flow',
    description: 'Longer hair swept back for a natural, classy look.',
    icon: '🌊',
    prompt: 'men long slicked back flow hairstyle, natural medium length hair swept away from face, realistic shine'
  },
  {
    id: 'viking-undercut',
    name: 'Viking Undercut',
    description: 'Disconnected undercut with long textured top.',
    icon: '🪓',
    prompt: 'men viking style undercut, shaved sides with long textured hair on top gathered back, rugged and realistic'
  },
  {
    id: 'korean-comma',
    name: 'Comma Hair',
    description: 'Elegant K-Pop style with a curved front fringe.',
    icon: '✨',
    prompt: 'men Korean comma hairstyle, curved fringe at the front, soft voluminous layers, realistic hair texture'
  },
  {
    id: 'braided-top',
    name: 'Man Braids',
    description: 'Intricate braids on top with faded sides.',
    icon: '🧶',
    prompt: 'men hair braids on top with a high skin fade, neat cornrows, detailed braiding, realistic lighting'
  },
  {
    id: 'classic-side-part',
    name: 'Executive Part',
    description: 'Sharp, professional, and timeless grooming.',
    icon: '💼',
    prompt: 'men sharp side part haircut, hard part line, neat pomade finish, professional barbershop style'
  }
];

export const ICONS = {
  Camera: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
  ),
  Refresh: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
  ),
  Download: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
  ),
  Check: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  ),
  Sparkles: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
  ),
  ArrowLeft: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
  )
};
