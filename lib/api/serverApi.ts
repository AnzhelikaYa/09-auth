import axios from "axios";
import { cookies } from "next/headers";
import type { Note } from "../../types/note";
import type { User } from "../../types/user";

const baseURL = `${process.env.NEXT_PUBLIC_API_URL}/api`;

const serverApi = () =>
  axios.create({
    baseURL,
    headers: {
      Cookie: cookies().toString(),
    },
  });

export const fetchNotes = async (): Promise<Note[]> => {
  const { data } = await serverApi().get("/notes");
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await serverApi().get(`/notes/${id}`);
  return data;
};

export const getMe = async (): Promise<User> => {
  const { data } = await serverApi().get("/users/me");
  return data;
};

export const checkSession = async (): Promise<User | null> => {
  const { data } = await serverApi().get("/auth/session");
  return data ?? null;
};
