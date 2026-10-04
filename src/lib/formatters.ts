import { format, parseISO } from "date-fns";

export function bdt(n: number): string {
  const v = Math.round(n);
  return `৳${v.toLocaleString("en-US")}`;
}

export function fmtDate(iso: string): string {
  try {
    return format(parseISO(iso), "dd MMM yyyy");
  } catch {
    return iso;
  }
}

export function fmtDateTime(iso: string): string {
  try {
    return format(parseISO(iso), "dd MMM yyyy, h:mm a");
  } catch {
    return iso;
  }
}

export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const s = Math.max(1, Math.floor((now - then) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return fmtDate(iso);
}

export function stars(rating: number): string {
  return rating.toFixed(1);
}
