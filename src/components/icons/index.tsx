"use client";

import React from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  Filter,
  ArrowRight,
  ArrowUpRight,
  ArrowLeft,
  ArrowUp,
  Star,
  Check,
  CheckCircle,
  CheckCircle2,
  X,
  Menu,
  Sun,
  Moon,
  Upload,
  UploadCloud,
  Trash2,
  Edit3,
  Plus,
  Image as ImageIcon,
  Images,
  Tag,
  Sparkles,
  ExternalLink,
  Lock,
  Mail,
  Phone,
  Heart,
  AlertTriangle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  LayoutDashboard,
  FolderGit2,
  User,
  LogOut,
  Layers,
  Award,
  Globe,
  Share2,
  Copy,
  Info,
  Target,
  Brain,
  Handshake,
  Trophy,
  TrendingUp,
  Palette,
  Briefcase,
} from "lucide-react";

export {
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  Filter,
  ArrowRight,
  ArrowUpRight,
  ArrowLeft,
  ArrowUp,
  Star,
  Target,
  Brain,
  Handshake,
  Trophy,
  TrendingUp,
  Palette,
  Briefcase,
  Check,
  CheckCircle,
  CheckCircle2,
  X,
  Menu,
  Sun,
  Moon,
  Upload,
  UploadCloud,
  Trash2,
  Edit3,
  Plus,
  ImageIcon,
  Images,
  Tag,
  Sparkles,
  ExternalLink,
  Lock,
  Mail,
  Phone,
  Heart,
  AlertTriangle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  LayoutDashboard,
  FolderGit2,
  User,
  LogOut,
  Layers,
  Award,
  Globe,
  Share2,
  Copy,
  Info,
};

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
}

/* ── Brand and Custom Social Icons ──────────────────────────── */

export function LinkedInIcon({ className = "w-5 h-5", size, ...props }: IconProps) {
  return (
    <svg
      width={size || "20"}
      height={size || "20"}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...props}
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.68 1.68 0 1 0 0-3.36 1.68 1.68 0 0 0 0 3.36M5.1 18.5h2.72v-8.37H5.1v8.37Z" />
    </svg>
  );
}

export function XTwitterIcon({ className = "w-5 h-5", size, ...props }: IconProps) {
  return (
    <svg
      width={size || "20"}
      height={size || "20"}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...props}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function InstagramIcon({ className = "w-5 h-5", size, ...props }: IconProps) {
  return (
    <svg
      width={size || "20"}
      height={size || "20"}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function GitHubIcon({ className = "w-5 h-5", size, ...props }: IconProps) {
  return (
    <svg
      width={size || "20"}
      height={size || "20"}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...props}
    >
      <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z" />
    </svg>
  );
}

export function TikTokIcon({ className = "w-5 h-5", size, ...props }: IconProps) {
  return (
    <svg
      width={size || "20"}
      height={size || "20"}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      {...props}
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
    </svg>
  );
}

export function MpesaIcon({ className = "w-6 h-6", size, ...props }: IconProps) {
  return (
    <svg
      width={size || "24"}
      height={size || "24"}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      {...props}
    >
      <rect width="48" height="48" rx="8" fill="#43B02A" />
      <path
        d="M12 34V14L20 26L28 14V34"
        stroke="#FFFFFF"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="36" cy="18" r="4" fill="#E21A22" />
    </svg>
  );
}
