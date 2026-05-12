export type PortfolioSlide = {
  id: string;
  folder: string;
  title: string;
  subtitle: string;
  mode: "opening" | "bus" | "walk" | "scene" | "split" | "achievement";
  background?: string | null;
  contact?: string | null;
  frames: string[];
};
