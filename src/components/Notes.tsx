import React, { useState } from 'react';
import { Plus, CreditCard as Edit3, Trash2, Save, X } from 'lucide-react';
import { Note } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface NotesProps {
  theme: any;
}

const Notes: React.FC<NotesProps> = ({ theme }) => {
  const [notes, setNotes] = useLocalStorage<Note[]>('notes', []);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const createNote = () => {
    const note: Note = {
      id: Date.now().toString(),
      title: 'Nouvelle note',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setNotes([note, ...notes]);
    startEditing(note);
  };

  const startEditing = (note: Note) => {
    setEditingNote(note.id);
    setEditTitle(note.title);
    setEditContent(note.content);
  };

  const saveNote = () => {
    if (editingNote) {
      setNotes(notes.map(note =>
        note.id === editingNote
          ? {
              ...note,
              title: editTitle.trim() || 'Note sans titre',
              content: editContent,
              updatedAt: new Date(),
            }
          : note
      ));
      setEditingNote(null);
    }
  };

  const cancelEdit = () => {
    setEditingNote(null);
    setEditTitle('');
    setEditContent('');
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    if (editingNote === id) {
      setEditingNote(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Mes Notes</h1>
        <p style={{ color: theme.accent }}>{notes.length} note{notes.length !== 1 ? 's' : ''}</p>
      </div>

      <button
        onClick={createNote}
        className="w-full mb-6 py-3 px-4 rounded-xl text-white font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2"
        style={{ backgroundColor: theme.primary }}
      >
        <Plus className="w-5 h-5" />
        <span>Nouvelle note</span>
      </button>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {notes.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center border border-white/20">
            <div className="text-6xl mb-4">📝</div>
            <p style={{ color: theme.accent }}>Aucune note pour le moment</p>
            <p className="text-white/60 text-sm mt-2">Créez votre première note ci-dessus</p>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20"
            >
              {editingNote === note.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
                    placeholder="Titre de la note..."
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={4}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 resize-none"
                    placeholder="Contenu de la note..."
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={saveNote}
                      className="flex-1 py-2 px-3 rounded-lg text-white font-medium transition-all duration-200 flex items-center justify-center space-x-1"
                      style={{ backgroundColor: theme.primary }}
                    >
                      <Save className="w-4 h-4" />
                      <span>Sauvegarder</span>
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-2 rounded-lg bg-white/10 text-white transition-all duration-200 flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-medium flex-1 mr-2">{note.title}</h3>
                    <div className="flex space-x-1">
                      <button
                        onClick={() => startEditing(note)}
                        className="p-1 rounded bg-white/10 hover:bg-white/20 transition-all duration-200"
                      >
                        <Edit3 className="w-4 h-4 text-white/80" />
                      </button>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="p-1 rounded bg-red-500/20 hover:bg-red-500/30 transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                  {note.content && (
                    <p className="text-white/80 text-sm mb-2 whitespace-pre-wrap">
                      {note.content}
                    </p>
                  )}
                  <p className="text-white/50 text-xs">
                    Modifié le {formatDate(note.updatedAt)}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notes;