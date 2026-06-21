import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (name: string) =>
  name.split(' ').map(n => n[0]).join('').toUpperCase();

export const getAvatarColor = (name: string) => {
  const colors = [
    'bg-primary', 'bg-accent', 'bg-success', 'bg-warning',
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};
