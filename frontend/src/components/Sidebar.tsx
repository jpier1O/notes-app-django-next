'use client';

import { Category } from '@/types';

interface SidebarProps {
  categories: Category[];
  selectedCategory: number | null;
  onSelectCategory: (categoryId: number | null) => void;
}

export default function Sidebar({ categories, selectedCategory, onSelectCategory }: SidebarProps) {
  const totalNotes = categories.reduce((sum, cat) => sum + cat.note_count, 0);

  return (
    <aside className="w-64 p-6 mt-12 bg-beige/50 backdrop-blur-sm rounded-2xl shadow-md border border-[#957139]/10">
      <h2 className="font-['Inter'] font-bold text-[12px] leading-none text-black mb-4">All Categories</h2>
      <ul className="space-y-2">
        <li>
          <button
            onClick={() => onSelectCategory(null)}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              selectedCategory === null ? 'bg-[#95713933] font-medium' : 'hover:bg-[#95713933]'
            }`}
          >
            <span className="w-3 h-3 rounded-full bg-gradient-to-br from-cat-random to-cat-personal" />
            <span className="font-['Inter'] font-normal text-[12px] leading-none text-black flex-1">All</span>
            <span className="font-['Inter'] font-normal text-[12px] leading-none text-black">{totalNotes}</span>
          </button>
        </li>
        {categories.map((category) => (
          <li key={category.id}>
            <button
              onClick={() => onSelectCategory(category.id)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                selectedCategory === category.id ? 'bg-[#95713933] font-medium' : 'hover:bg-[#95713933]'
              }`}
            >
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="font-['Inter'] font-normal text-[12px] leading-none text-black flex-1">{category.name}</span>
              <span className="font-['Inter'] font-normal text-[12px] leading-none text-black">{category.note_count}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
