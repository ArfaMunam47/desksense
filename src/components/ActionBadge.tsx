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
          icon: <MousePointerClick className="w-4 h-4 text-purple-600 dark:text-purple-400" />,
          bg: 'bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-200',
          hint: 'Press the right mouse button or two-finger tap',
        };
      case 'double_click':
        return {
          label: 'Double-Click',
          icon: <MousePointerClick className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
          bg: 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
          hint: 'Click twice quickly with the left button',
        };
      case 'click':
        return {
          label: 'Click',
          icon: <MousePointer className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
          bg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200',
          hint: 'Click once with the left mouse button',
        };
      case 'shortcut':
        return {
          label: 'Keyboard Shortcut',
          icon: <Keyboard className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
          bg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200',
          hint: 'Press these keys together on your keyboard',
        };
      case 'type':
        return {
          label: 'Type Text',
          icon: <Keyboard className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />,
          bg: 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-200',
          hint: 'Type on your keyboard then press Enter',
        };
      case 'drag':
        return {
          label: 'Click & Drag',
          icon: <MoveHorizontal className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />,
          bg: 'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200 dark:border-cyan-800 text-cyan-800 dark:text-cyan-200',
          hint: 'Hold mouse button down while moving',
        };
      case 'look':
      default:
        return {
          label: 'Look For',
          icon: <Eye className="w-4 h-4 text-slate-600 dark:text-slate-400" />,
          bg: 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200',
          hint: 'Locate this item on your screen first',
        };
    }
  };

  const config = getActionConfig();

  return (
    <div className="inline-flex items-center gap-2">
      <span
        title={config.hint}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${config.bg}`}
      >
        {config.icon}
        <span>{config.label}</span>
      </span>
      {targetElement && (
        <span className="text-xs font-mono font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
          Target: {targetElement}
        </span>
      )}
    </div>
  );
};
