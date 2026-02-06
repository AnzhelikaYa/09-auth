import type { Metadata } from 'next';
import { QueryClient, HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/serverApi';
import NotesClient from './Notes.client';

type NotesProps = {
  params: Promise<{ slug: string[] }>;
};

/* Metadata */
export async function generateMetadata(
  { params }: NotesProps
): Promise<Metadata> {
  const { slug } = await params;

  const filter = slug?.[0] ?? 'all';
  const filterLabel = filter === 'all' ? 'All notes' : `Notes filtered by "${filter}"`;

  return {
    title: `NoteHub — ${filterLabel}`,
    description: `Browse notes in NoteHub with filter: ${filter}.`,

    openGraph: {
      title: `NoteHub — ${filterLabel}`,
      description: `Browse notes in NoteHub with filter: ${filter}.`,
      url: `https://notehub.app/notes/filter/${filter}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: 'NoteHub Notes Filter',
        },
      ],
    },
  };
}

export default async function Notes({ params }: NotesProps) {
  const { slug } = await params;

  const actualTag = slug?.[0] === 'all' ? undefined : slug?.[0];

  const queryClient = new QueryClient();

  const page = 1;
  const query = '';

  await queryClient.prefetchQuery({
    queryKey: ['notes', page, query, actualTag],
    queryFn: () => fetchNotes(query, page, actualTag),
  });

  const dehydrateState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydrateState}>
      <NotesClient
        initialPage={page}
        initialQuery={query}
        initialTag={actualTag}
      />
    </HydrationBoundary>
  );
}
