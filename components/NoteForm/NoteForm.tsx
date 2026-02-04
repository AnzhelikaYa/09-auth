'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import css from './NoteForm.module.css';
import { useNoteStore, initialDraft } from '@/lib/store/noteStore';
import type { DraftNote } from '@/lib/store/noteStore';
import { createNote } from '@/lib/api/clientApi';

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { draft, setDraft, clearDraft } = useNoteStore();

  const values: DraftNote = draft ?? initialDraft;

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      clearDraft();
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      router.push('/notes');
    },
    onError: (error) => {
      console.error('Failed to create note:', error);
      alert('Failed to create note. Please try again.');
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const newNote: DraftNote = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      tag: formData.get('tag') as DraftNote['tag'],
    };

    mutation.mutate(newNote);
  }

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          className={css.input}
          value={values.title}
          required
          minLength={3}
          maxLength={50}
          onChange={(e) =>
            setDraft({ ...values, title: e.target.value })
          }
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          value={values.content}
          maxLength={500}
          onChange={(e) =>
            setDraft({ ...values, content: e.target.value })
          }
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={values.tag}
          required
          onChange={(e) =>
            setDraft({
              ...values,
              tag: e.target.value as DraftNote['tag'],
            })
          }
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={() => router.back()}
          disabled={mutation.isPending}
        >
          Cancel
        </button>

        <button
          type="submit"
          className={css.submitButton}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? 'Creating...' : 'Create note'}
        </button>
      </div>
    </form>
  );
}
