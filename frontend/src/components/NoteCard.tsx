'use client';

import { Note } from '@/types';
import { formatRelativeDate, truncate } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface NoteCardProps {
  note: Note;
  onDelete: (noteId: number) => void;
}

export default function NoteCard({ note, onDelete }: NoteCardProps) {
  const router = useRouter();

  return (
    <div
      className="relative w-full h-[246px] p-[16px] rounded-[11px] border-[3px] cursor-pointer hover:shadow-md transition-shadow flex flex-col gap-[12px]"
      style={{ backgroundColor: note.category.color + '80', borderColor: note.category.color }}
    >
      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(note.id);
        }}
        className="absolute top-3 right-3 text-black/40 hover:text-red-500 transition-colors"
        title="Delete note"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
      </button>

      {/* Clickable area */}
      <div onClick={() => router.push(`/notes/${note.id}`)} className="flex flex-col gap-[12px] flex-1">
        {/* Date and Category */}
        <div className="flex items-center gap-2">
          <span className="font-['Inter'] font-bold text-[12px] leading-none text-black">
            {formatRelativeDate(note.updated_at)}
          </span>
          <span className="font-['Inter'] font-normal text-[12px] leading-none text-black">
            {note.category.name}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-serif font-bold text-[24px] leading-[1.1] text-black">
          {note.title || 'Untitled'}
        </h3>

        {/* Body preview */}
        <p className="font-['Inter'] font-normal text-[12px] leading-[1.1] text-black mt-2">
          {truncate(note.body || '', 100)}
        </p>
      </div>
    </div>
  );
}
