export interface PortfolioImagesInter {
  alt: string;
  src: string;
}

export interface PortfolioVideosInter {
  title: string;
  src: string;
  description: string;
}

export interface PortfolioItemInter {
  company: string;
  description: string;
  images?: Array<PortfolioImagesInter>;
  videos?: Array<PortfolioVideosInter>;
  subtitle: string;
  thumbnail: string;
  title: string;
  url: string;
}
