'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, SlidersHorizontal } from 'lucide-react';

interface SortOption {
  label: string;
  value: string;
}

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: SortOption[];
}

export const SortDropdown: React.FC<SortDropdownProps> = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find(opt => opt.value === value)?.label;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-3 px-4 py-2.5 bg-white border rounded-xl text-sm font-medium transition-all duration-200 min-w-[160px]
          ${isOpen
            ? 'border-primary ring-2 ring-primary/10 text-primary shadow-md'
            : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
          }`}
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className={isOpen ? 'text-primary' : 'text-slate-400'} />
          <span className="truncate">{selectedLabel}</span>
        </div>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary' : 'text-slate-400'}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-full min-w-[180px] bg-white border border-slate-100 rounded-xl shadow-xl shadow-slate-200/50 z-50 p-1.5 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-col gap-0.5">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg flex items-center justify-between transition-all duration-150
                  ${value === option.value
                    ? 'bg-primary/5 text-primary font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                {option.label}
                {value === option.value && <Check size={14} className="text-primary" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
