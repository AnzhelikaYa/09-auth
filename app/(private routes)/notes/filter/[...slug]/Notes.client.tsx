'use client';

import css from './Notes.module.css';
import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import Pagination from '@/components/Pagination/Pagination';
import NoteList from '@/components/NoteList/NoteList';
import { fetchNotes } from '@/lib/api/clientApi';
import SearchBox from '@/components/SearchBox/SearchBox';
import Link from 'next/link';

interface NotesClientProps {
  initialPage: number;
  initialQuery: string;
  initialTag?: string;
}

export default function NotesClient({
  initialPage = 1,
  initialQuery = '',
  initialTag,
}: NotesClientProps) {
  const [page, setPage] = useState(initialPage);
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const [debouncedQuery] = useDebounce(searchQuery, 500);

  const handleSearchChange = (query: string) => {
    setPage(1);
    setSearchQuery(query);
  };

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['notes', page, debouncedQuery, initialTag],
    queryFn: () => fetchNotes(debouncedQuery, page, initialTag),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={searchQuery} onChange={handleSearchChange} />

        {isSuccess && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}

        <Link href="/notes/action/create">
          <button className={css.button}>Create note +</button>
        </Link>
      </header>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error!</p>}
      {isSuccess && <NoteList notes={data.notes} />}
    </div>
  );
}
