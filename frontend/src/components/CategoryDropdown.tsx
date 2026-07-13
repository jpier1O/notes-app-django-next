'use client';

import { useState, useRef, useEffect } from 'react';
import { Category } from '@/types';

interface CategoryDropdownProps {
  categories: Category[];
  selectedId: number | null;
  onChange: (categoryId: number) => void;
}

export default function CategoryDropdown({ categories, selectedId, onChange }: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = categories.find((c) => c.id === selectedId);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-[225px] h-[39px] px-[15px] py-[7px] rounded-[6px] border border-[#957139] bg-white hover:bg-[#95713933] transition-colors text-sm"
      >
        {selected && (
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selected.color }} />
        )}
        <span className="text-black font-['Inter'] font-normal text-[12px] leading-none flex-1 text-left">{selected?.name || 'Select category'}</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#957139" className="w-3.5 h-3.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-[225px] bg-[#FAF1E3] rounded-[6px] shadow-lg border border-[#957139]/20 z-50 py-1">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                onChange(category.id);
                setIsOpen(false);
              }}
              className={`w-full text-left px-[15px] py-[7px] flex items-center gap-2 hover:bg-[#95713933] transition-colors ${
                category.id === selectedId ? 'bg-[#95713933]' : ''
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: category.color }} />
              <span className="text-black font-['Inter'] font-normal text-[12px] leading-none">{category.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
