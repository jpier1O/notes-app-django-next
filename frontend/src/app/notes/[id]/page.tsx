'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Note, Category } from '@/types';
import { formatLastEdited } from '@/lib/utils';
import CategoryDropdown from '@/components/CategoryDropdown';
import ConfirmDialog from '@/components/ConfirmDialog';

export default function NoteEditorPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const noteId = params.id as string;

  const [note, setNote] = useState<Note | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [lastEdited, setLastEdited] = useState('');
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated && noteId) {
      fetchNote();
      fetchCategories();
    }
  }, [isAuthenticated, noteId]);

  const fetchNote = async () => {
    try {
      const data = await api.get<Note>(`/notes/${noteId}/`);
      setNote(data);
      setTitle(data.title);
      setBody(data.body);
      setSelectedCategoryId(data.category.id);
      setLastEdited(data.updated_at);
    } catch {
      setError('Could not load note.');
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await api.get<Category[]>('/categories/');
      setCategories(data);
    } catch {
      setError('Could not load categories.');
    }
  };

  const autoSave = useCallback(
    (fields: Partial<{ title: string; body: string; category_id: number }>) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      debounceTimer.current = setTimeout(async () => {
        setSaving(true);
        setError(null);
        try {
          const updated = await api.patch<Note>(`/notes/${noteId}/`, fields);
          setLastEdited(updated.updated_at);
        } catch {
          setError('Could not save. Retrying...');
          setTimeout(async () => {
            try {
              const updated = await api.patch<Note>(`/notes/${noteId}/`, fields);
              setLastEdited(updated.updated_at);
              setError(null);
            } catch {
              setError('Could not save. Please try again.');
            }
          }, 3000);
        } finally {
          setSaving(false);
        }
      }, 1000);
    },
    [noteId]
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.slice(0, 100);
    setTitle(val);
    autoSave({ title: val });
  };

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value.slice(0, 5000);
    setBody(val);
    autoSave({ body: val });
  };

  const handleCategoryChange = async (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    // Save category immediately (no debounce)
    setSaving(true);
    try {
      const updated = await api.patch<Note>(`/notes/${noteId}/`, { category_id: categoryId });
      setLastEdited(updated.updated_at);
    } catch {
      setError('Could not save category.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.del(`/notes/${noteId}/`);
      router.push('/dashboard');
    } catch {
      setError('Could not delete note.');
    }
    setShowDelete(false);
  };

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);
  const bgColor = selectedCategory?.color || '#FFFFFF';

  if (isLoading || !note) {
    return (
      <div className="min-h-screen bg-beige flex items-center justify-center">
        <p className="text-secondary">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige p-4">
      <div className="w-full p-4">
        {/* Header — outside the card */}
        <div className="flex items-center justify-between mb-4">
          <CategoryDropdown
            categories={categories}
            selectedId={selectedCategoryId}
            onChange={handleCategoryChange}
          />

          <button
            onClick={() => router.push('/dashboard')}
            className="text-primary/60 hover:text-primary transition-colors"
            title="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Note card with category color */}
        <div
          className="rounded-xl border p-8 min-h-[calc(100vh-120px)]"
          style={{ backgroundColor: bgColor, borderColor: bgColor }}
        >
          {/* Last edited inside card top-right */}
          <div className="flex justify-end mb-4">
            <span className="font-['Inter'] font-normal text-[12px] leading-none text-black text-right">
              {saving ? 'Saving...' : lastEdited ? `Last Edited: ${formatLastEdited(lastEdited)}` : ''}
            </span>
          </div>

          {/* Editor */}
          <div className="space-y-4">
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder="Note Title"
              className="w-full text-[24px] font-bold text-black bg-transparent border-none outline-none placeholder-black font-serif leading-none"
            />
            <textarea
              value={body}
              onChange={handleBodyChange}
              placeholder="Pour your heart out..."
              className="w-full min-h-[55vh] text-black font-['Inter'] font-normal text-[16px] leading-[27px] bg-transparent border-none outline-none resize-none placeholder-black"
            />
          </div>
        </div>
      </div>

      {showDelete && (
        <ConfirmDialog
          message="Are you sure you want to delete this note?"
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </div>
  );
}
