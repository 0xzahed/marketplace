import {
  Wrench, Sparkles, Zap, Droplets, Snowflake, Truck, Heart, Camera, Palette,
  Laptop, BookOpen, Briefcase,
} from "lucide-react";

const map: Record<string, typeof Wrench> = {
  wrench: Wrench, sparkles: Sparkles, zap: Zap, droplets: Droplets, snowflake: Snowflake,
  truck: Truck, heart: Heart, camera: Camera, palette: Palette, laptop: Laptop,
  book: BookOpen, briefcase: Briefcase,
};

export function iconFor(icon: string) {
  return map[icon] ?? Wrench;
}
