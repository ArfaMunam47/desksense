import React from 'react';

interface DeskSenseEmblemProps {
  className?: string;
  strokeWidth?: number;
}

/**
 * DeskSense Custom Brand Emblem
 * Represents computer assistance, digital guidance, and confidence:
 * - Bold rounded computer-monitor outline
 * - Clean geometric stand beneath the monitor
 * - Integrated circular guidance beacon marker
 */
export const DeskSenseEmblem: React.FC<DeskSenseEmblemProps> = ({
  className = 'w-5 h-5',
  strokeWidth = 2.6,
}) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Bold, rounded computer-monitor outline */}
      <rect x="2.5" y="3" width="19" height="13" rx="2.5" />
      {/* Simple stand beneath the monitor */}
      <path d="M12 16v4.5" />
      <path d="M8 20.5h8" />
      {/* Small circular guidance marker integrated into the design */}
      <circle cx="12" cy="9.5" r="2.2" fill="currentColor" stroke="none" />
    </svg>
  );
};
