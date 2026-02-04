import type { Metadata } from 'next';
import { fetchNoteById } from '../../../../lib/api/clientApi';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import NoteDetailsClient from './NoteDetails.client';

interface NoteDetailsProps {
  params: Promise<{
    id: string;
  }>;
}

/* Metadata */
export async function generateMetadata(
  { params }: NoteDetailsProps
): Promise<Metadata> {
  const { id } = await params;

  const note = await fetchNoteById(id);

  return {
    title: note.title,
    description: note.content?.slice(0, 160) || 'Note details in NoteHub',

    openGraph: {
      title: note.title,
      description: note.content?.slice(0, 160) || 'Note details in NoteHub',
      url: `https://notehub.app/notes/${id}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: note.title,
        },
      ],
    },
  };
}

const NoteDetails = async ({ params }: NoteDetailsProps) => {
  const queryClient = new QueryClient();
  const { id } = await params;

  await queryClient.prefetchQuery({
    queryKey: ['noteDetails', id],
    queryFn: () => fetchNoteById(id),
  });

  const dehydrateState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydrateState}>
      <NoteDetailsClient id={id} />
    </HydrationBoundary>
  );
};

export default NoteDetails;
