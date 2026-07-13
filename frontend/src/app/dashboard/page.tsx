'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Note, Category } from '@/types';
import Sidebar from '@/components/Sidebar';
import NoteCard from '@/components/NoteCard';
import ConfirmDialog from '@/components/ConfirmDialog';

export default function DashboardPage() {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteNoteId, setDeleteNoteId] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [notesData, catsData] = await Promise.all([
        api.get<Note[]>('/notes/'),
        api.get<Category[]>('/categories/'),
      ]);
      setNotes(notesData);
      setCategories(catsData);
    } catch {
      setError('Could not load notes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewNote = async () => {
    try {
      const note = await api.post<Note>('/notes/');
      router.push(`/notes/${note.id}`);
    } catch {
      setError('Could not create note. Please try again.');
    }
  };

  const handleDeleteNote = async () => {
    if (!deleteNoteId) return;
    try {
      await api.del(`/notes/${deleteNoteId}/`);
      setNotes(notes.filter((n) => n.id !== deleteNoteId));
      // Re-fetch categories to update note counts
      const catsData = await api.get<Category[]>('/categories/');
      setCategories(catsData);
    } catch {
      setError('Could not delete note.');
    }
    setDeleteNoteId(null);
  };

  const filteredNotes = selectedCategory
    ? notes.filter((note) => note.category.id === selectedCategory)
    : notes;

  if (isLoading) {
    return <div className="min-h-screen bg-beige flex items-center justify-center">
      <p className="text-secondary">Loading...</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-beige">
      <div className="px-6 py-6 flex items-start gap-20">
        {/* Sidebar column */}
        <div className="flex flex-col h-[calc(100vh-48px)] w-64 shrink-0">
          <Sidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          <div className="mt-auto">
            <button
              onClick={logout}
              className="text-secondary text-sm font-['Inter'] hover:text-primary transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <div />
            <div className="flex items-center gap-3">
              <button
                onClick={handleNewNote}
                className="px-4 py-2 bg-beige border border-[#957139] rounded-full text-[#957139] text-sm font-bold font-['Inter'] hover:bg-[#95713933] transition-colors"
              >
                + New Note
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-secondary">Loading notes...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4">
              <p className="text-red-500">{error}</p>
              <button onClick={fetchData} className="text-primary underline text-sm">
                Retry
              </button>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
              <img src="/home-notes.png" alt="Waiting for notes" className="mb-6 h-64" />
              <p className="font-['Inter'] font-normal text-[24px] leading-none text-secondary">
                I&apos;m just here waiting for your charming notes...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {filteredNotes.map((note) => (
                <NoteCard key={note.id} note={note} onDelete={(id) => setDeleteNoteId(id)} />
              ))}
            </div>
          )}
        </main>
      </div>

      {deleteNoteId && (
        <ConfirmDialog
          message="Are you sure you want to delete this note?"
          onConfirm={handleDeleteNote}
          onCancel={() => setDeleteNoteId(null)}
        />
      )}
    </div>
  );
}
