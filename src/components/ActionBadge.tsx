import React from 'react';
import { ActionType } from '../types';
import { MousePointer, MousePointerClick, Keyboard, Eye, MoveHorizontal } from 'lucide-react';

interface ActionBadgeProps {
  actionType: ActionType;
  targetElement?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ActionBadge: React.FC<ActionBadgeProps> = ({
  actionType,
  targetElement,
  size = 'md',
}) => {
  const getActionConfig = () => {
    switch (actionType) {
      case 'right_click':
        return {
          label: 'Right-Click',
          icon: <MousePointerClick className="w-4 h-4 text-[#355C4B]" strokeWidth={2.65} />,
          bg: 'bg-[#DDEBDD] border-[#A9C9AD] text-[#355C4B]',
          hint: 'Press the right mouse button or two-finger tap',
        };
      case 'double_click':
        return {
          label: 'Double-Click',
          icon: <MousePointerClick className="w-4 h-4 text-[#65517E]" strokeWidth={2.65} />,
          bg: 'bg-[#E8E2F1] border-[#C8BFD8] text-[#65517E]',
          hint: 'Click twice quickly with the left button',
        };
      case 'click':
        return {
          label: 'Click',
          icon: <MousePointer className="w-4 h-4 text-[#355C4B]" strokeWidth={2.65} />,
          bg: 'bg-[#DDEBDD] border-[#A9C9AD] text-[#355C4B]',
          hint: 'Click once with the left mouse button',
        };
      case 'shortcut':
        return {
          label: 'Keyboard Shortcut',
          icon: <Keyboard className="w-4 h-4 text-[#303B38]" strokeWidth={2.65} />,
          bg: 'bg-[#F4E3D6] border-[#E4CCBC] text-[#303B38]',
          hint: 'Press these keys together on your keyboard',
        };
      case 'type':
        return {
          label: 'Type Text',
          icon: <Keyboard className="w-4 h-4 text-[#355C4B]" strokeWidth={2.65} />,
          bg: 'bg-[#FFFFFF] border-[#E2E4DF] text-[#303B38]',
          hint: 'Type on your keyboard then press Enter',
        };
      case 'drag':
        return {
          label: 'Click & Drag',
          icon: <MoveHorizontal className="w-4 h-4 text-[#B96F7D]" strokeWidth={2.65} />,
          bg: 'bg-[#F1DDE0] border-[#DFC0C7] text-[#B96F7D]',
          hint: 'Hold mouse button down while moving',
        };
      case 'look':
      default:
        return {
          label: 'Look For',
          icon: <Eye className="w-4 h-4 text-[#727A75]" strokeWidth={2.65} />,
          bg: 'bg-[#ECEDE9] border-[#E2E4DF] text-[#303B38]',
          hint: 'Locate this item on your screen first',
        };
    }
  };

  const config = getActionConfig();

  return (
    <div className="inline-flex items-center gap-2">
      <span
        title={config.hint}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${config.bg} shadow-2xs`}
      >
        {config.icon}
        <span>{config.label}</span>
      </span>
      {targetElement && (
        <span className="text-xs font-mono font-bold text-[#303B38] bg-[#FFFFFF] px-2.5 py-0.5 rounded-lg border border-[#E2E4DF] shadow-2xs">
          Target: {targetElement}
        </span>
      )}
    </div>
  );
};
