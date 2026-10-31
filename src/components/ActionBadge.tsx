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
          icon: <MousePointerClick className="w-3.5 h-3.5 text-[#254E4A]" strokeWidth={2.25} />,
          bg: 'bg-[#E3EFEB] border-[#254E4A]/30 text-[#254E4A]',
          hint: 'Press the right mouse button or two-finger tap',
        };
      case 'double_click':
        return {
          label: 'Double-Click',
          icon: <MousePointerClick className="w-3.5 h-3.5 text-[#D98F9B]" strokeWidth={2.25} />,
          bg: 'bg-[#F5E2E3] border-[#D98F9B] text-[#3C3436]',
          hint: 'Click twice quickly with the left button',
        };
      case 'click':
        return {
          label: 'Click',
          icon: <MousePointer className="w-3.5 h-3.5 text-[#D98F9B]" strokeWidth={2.25} />,
          bg: 'bg-[#F5E2E3] border-[#D98F9B] text-[#3C3436]',
          hint: 'Click once with the left mouse button',
        };
      case 'shortcut':
        return {
          label: 'Keyboard Shortcut',
          icon: <Keyboard className="w-3.5 h-3.5 text-[#254E4A]" strokeWidth={2.25} />,
          bg: 'bg-[#E3EFEB] border-[#254E4A]/30 text-[#254E4A]',
          hint: 'Press these keys together on your keyboard',
        };
      case 'type':
        return {
          label: 'Type Text',
          icon: <Keyboard className="w-3.5 h-3.5 text-[#D98F9B]" strokeWidth={2.25} />,
          bg: 'bg-white border-[#D98F9B] text-[#3C3436]',
          hint: 'Type on your keyboard then press Enter',
        };
      case 'drag':
        return {
          label: 'Click & Drag',
          icon: <MoveHorizontal className="w-3.5 h-3.5 text-[#254E4A]" strokeWidth={2.25} />,
          bg: 'bg-[#E3EFEB] border-[#254E4A]/30 text-[#254E4A]',
          hint: 'Hold mouse button down while moving',
        };
      case 'look':
      default:
        return {
          label: 'Look For',
          icon: <Eye className="w-3.5 h-3.5 text-[#6F6263]" strokeWidth={2.25} />,
          bg: 'bg-white border-[#E8DDDA] text-[#3C3436]',
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
        <span className="text-xs font-mono font-bold text-[#3C3436] bg-white px-2.5 py-0.5 rounded-lg border border-[#E8DDDA] shadow-2xs">
          Target: {targetElement}
        </span>
      )}
    </div>
  );
};
