import type { Metadata } from 'next';
import css from './not-found.module.css';

export const metadata: Metadata = {
  title: '404 — Page Not Found | NoteHub',
  description: 'Page not found. The requested page does not exist in the application NoteHub.',
  alternates: {
    canonical: '/404',
  },

  openGraph: {
    title: '404 — Page Not Found | NoteHub',
    description: 'Sorry, the page you are looking for does not exist',
    url: 'https://notehub.app/404',
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: '404 Page Not Found',
      },
    ],
  },
};

export default function NotFound() {
  return (
    <div className={css.container}>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
    </div>
  );
}
