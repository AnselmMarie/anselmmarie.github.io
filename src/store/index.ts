import { create } from 'zustand';

import { activeData } from './active.data';
import { otherData } from './other.data';

export interface PortfolioDataInter {
  id: string;
  company: string;
  title: string;
  subtitle: string;
  thumbnail: string;
  description: string;
  images?: Array<ImagesDataInter>;
  videos?: Array<VideosDataInter>;
}

export type PortfolioStoreItem = PortfolioDataInter | null;

interface PortfolioStoreInter {
  activeData: Array<PortfolioDataInter>;
  otherData: Array<PortfolioDataInter>;
  item: PortfolioStoreItem;
  addItem: (item: PortfolioDataInter) => void;
  clearItem: () => void;
}

export interface ImagesDataInter {
  src: string;
  alt: string;
  width: string;
  height: string;
}

export interface VideosDataInter {
  description: string;
  src: string;
  title: string;
}

export const usePortfolioStore = create<PortfolioStoreInter>((set) => ({
  activeData,
  otherData,
  item: null,
  addItem: (item) => {
    set({ item });
  },
  clearItem: () => {
    set({ item: null });
  },
}));
