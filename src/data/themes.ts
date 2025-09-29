import { Theme } from '../types';
import mountains from '../../images/Montagnes.avif';
import ocean from '../../images/Ocean.avif';
import forest from '../../images/Forest.avif';
import city from '../../images/City.avif';
import space from '../../images/Space.avif';
import Delphin from '../../images/Delphin.avif';
import earth from '../../images/earth1.avif';

export const defaultThemes: Theme[] = [
  {
    id: 'purple',
    name: 'Violet Moderne',
    primary: '#8b5cf6',
    secondary: '#a78bfa',
    accent: '#c4b5fd',
    background: 'from-slate-900 via-purple-900 to-slate-900',
    text: '#ffffff',
  },
  {
    id: 'ocean',
    name: 'Océan',
    primary: '#0ea5e9',
    secondary: '#38bdf8',
    accent: '#7dd3fc',
    background: 'from-blue-900 via-cyan-900 to-blue-900',
    text: '#ffffff',
  },
  {
    id: 'forest',
    name: 'Forêt',
    primary: '#10b981',
    secondary: '#34d399',
    accent: '#6ee7b7',
    background: 'from-green-900 via-emerald-900 to-green-900',
    text: '#ffffff',
  },
  {
    id: 'sunset',
    name: 'Coucher de soleil',
    primary: '#f59e0b',
    secondary: '#fbbf24',
    accent: '#fcd34d',
    background: 'from-orange-900 via-red-900 to-pink-900',
    text: '#ffffff',
  },
  {
    id: 'dark',
    name: 'Sombre',
    primary: '#6b7280',
    secondary: '#9ca3af',
    accent: '#d1d5db',
    background: 'from-gray-900 via-gray-800 to-gray-900',
    text: '#ffffff',
  },
  {
    id: 'light',
    name: 'Clair',
    primary: '#3b82f6',
    secondary: '#60a5fa',
    accent: '#93c5fd',
    background: 'from-gray-50 via-blue-50 to-gray-50',
    text: '#1f2937',
  },
];

export const backgroundImages = [
  {
    id: 'earth',
    name: 'Terre',
    url: earth,
  },
  {
    id: 'mountains',
    name: 'Montagnes',
    url: mountains,
  },
  {
    id: 'ocean',
    name: 'Océan',
    url: ocean,
  },
  {
    id: 'forest',
    name: 'Forêt',
    url: forest,
  },
  {
    id: 'city',
    name: 'Ville',
    url: city,
  },
  {
    id: 'space',
    name: 'Espace',
    url: space,
  },
  {
    id: 'delphin',
    name: 'Delphin',
    url: Delphin,
  },
];