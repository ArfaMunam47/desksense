import React from 'react';
import { LucideIcon } from 'lucide-react';

export type IconVariant =
  | 'sage'
  | 'lavender'
  | 'peach'
  | 'rose'
  | 'cream'
  | 'neutral'
  | 'white'
  | 'charcoal';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface IconBoxProps {
  icon: LucideIcon;
  variant?: IconVariant;
  size?: IconSize;
  className?: string;
  iconClassName?: string;
  strokeWidth?: number;
  interactive?: boolean;
  title?: string;
  onClick?: (e: React.MouseEvent) => void;
}

const variantStyles: Record<
  IconVariant,
  { container: string; icon: string; border: string; shadow: string }
> = {
  sage: {
    container: 'bg-[#DDEBDD] hover:bg-[#D4E5D4]',
    icon: 'text-[#355C4B]',
    border: 'border-[#A9C9AD]/80',
    shadow: 'shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_2px_5px_rgba(53,92,75,0.12)]',
  },
  lavender: {
    container: 'bg-[#E8E2F1] hover:bg-[#DFD7EB]',
    icon: 'text-[#65517E]',
    border: 'border-[#C8BFD8]',
    shadow: 'shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_2px_5px_rgba(101,81,126,0.12)]',
  },
  peach: {
    container: 'bg-[#F4E3D6] hover:bg-[#EED8C7]',
    icon: 'text-[#8E5E47]',
    border: 'border-[#E4CCBC]',
    shadow: 'shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_2px_5px_rgba(142,94,71,0.12)]',
  },
  rose: {
    container: 'bg-[#F1DDE0] hover:bg-[#EACFD3]',
    icon: 'text-[#B96F7D]',
    border: 'border-[#DFC0C7]',
    shadow: 'shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_2px_5px_rgba(185,111,125,0.12)]',
  },
  cream: {
    container: 'bg-[#F4EBCF] hover:bg-[#EDE1BF]',
    icon: 'text-[#5A4F35]',
    border: 'border-[#E2D6B2]',
    shadow: 'shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_2px_5px_rgba(90,79,53,0.1)]',
  },
  neutral: {
    container: 'bg-[#ECEDE9] hover:bg-[#E3E5E0]',
    icon: 'text-[#303B38]',
    border: 'border-[#E2E4DF]',
    shadow: 'shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_2px_4px_rgba(48,59,56,0.06)]',
  },
  white: {
    container: 'bg-[#FFFFFF] hover:bg-[#F9F9F7]',
    icon: 'text-[#303B38]',
    border: 'border-[#E2E4DF]',
    shadow: 'shadow-[inset_0_1px_1px_rgba(255,255,255,1),0_2px_6px_rgba(48,59,56,0.08)]',
  },
  charcoal: {
    container: 'bg-[#303B38] hover:bg-[#252E2B]',
    icon: 'text-[#FFFFFF]',
    border: 'border-[#252E2B]',
    shadow: 'shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_3px_8px_rgba(0,0,0,0.2)]',
  },
};

const sizeStyles: Record<
  IconSize,
  { container: string; icon: string; defaultStroke: number }
> = {
  xs: {
    container: 'w-7 h-7 rounded-lg',
    icon: 'w-4 h-4',
    defaultStroke: 2.6,
  },
  sm: {
    container: 'w-8.5 h-8.5 rounded-xl',
    icon: 'w-4.5 h-4.5',
    defaultStroke: 2.6,
  },
  md: {
    container: 'w-10 h-10 rounded-xl',
    icon: 'w-5.5 h-5.5',
    defaultStroke: 2.65,
  },
  lg: {
    container: 'w-12 h-12 rounded-2xl',
    icon: 'w-6.5 h-6.5',
    defaultStroke: 2.7,
  },
  xl: {
    container: 'w-14 h-14 rounded-2xl',
    icon: 'w-8 h-8',
    defaultStroke: 2.75,
  },
};

export const IconBox: React.FC<IconBoxProps> = ({
  icon: Icon,
  variant = 'neutral',
  size = 'md',
  className = '',
  iconClassName = '',
  strokeWidth,
  interactive = false,
  title,
  onClick,
}) => {
  const v = variantStyles[variant];
  const s = sizeStyles[size];
  const finalStroke = strokeWidth ?? s.defaultStroke;

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`relative inline-flex items-center justify-center shrink-0 border transition-all select-none ${
        v.container
      } ${v.border} ${v.shadow} ${s.container} ${
        interactive || onClick
          ? 'cursor-pointer hover:scale-102 active:scale-98 focus-visible:ring-2 focus-visible:ring-[#355C4B]'
          : ''
      } ${className}`}
    >
      <Icon
        className={`${s.icon} ${v.icon} ${iconClassName} transition-transform`}
        strokeWidth={finalStroke}
      />
    </Component>
  );
};
