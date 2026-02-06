import { cookies } from "next/headers";
import { api } from "./api"; 
import type { Note, FormValues } from "../../types/note";
import type { User } from "../../types/user";

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

const withServerCookies = async () => {
  const cookieStore = await cookies();
  api.defaults.headers.Cookie = cookieStore.toString();
};

export const fetchNotes = async (
  search: string,
  page: number,
  tag?: string
): Promise<FetchNotesResponse> => {
  await withServerCookies();
  const { data } = await api.get<FetchNotesResponse>("/notes", {
    params: { search, page, perPage: 12, ...(tag ? { tag } : {}) },
  });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  await withServerCookies();
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};

export const getMe = async (): Promise<User> => {
  await withServerCookies();
  const { data } = await api.get<User>("/users/me");
  return data;
};

export const checkServerSession = async () => {
  await withServerCookies();
  return api.get<User | null>("/auth/session"); 
};
