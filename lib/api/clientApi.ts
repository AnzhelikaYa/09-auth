import { api } from "./api";
import type { Note, FormValues } from "../../types/note";
import type { User } from "../../types/user";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}


interface UpdateUserRequest {
  username?: string;
  avatar?: string;
  email?: string;
}


export const fetchNotes = async (
  search: string,
  page: number,
  tag?: string
): Promise<FetchNotesResponse> => {
  const { data } = await api.get("/notes", {
    params: { search, page, perPage: 12, ...(tag ? { tag } : {}) },
  });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get(`/notes/${id}`);
  return data;
};

export const createNote = async (values: FormValues): Promise<Note> => {
  const { data } = await api.post("/notes", values);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete(`/notes/${id}`);
  return data;
};


export const updateCurrentUser = async (values: UpdateUserRequest): Promise<User> => {
  const { data } = await api.patch<User>("/users/me", values);
  return data;
};

export const getCurrentUser = async (): Promise<User> => {
  const { data } = await api.get<User>("/users/me");
  return data;
};

export const checkSession = async (): Promise<User | null> => {
  try {
    const { data } = await api.get<User>("/auth/session");
    return data || null; 
  } catch (eror) {
    return null;
  }
};

export const login = async (email: string, password: string): Promise<User> => {
  const { data } = await api.post<User>("/auth/login", { email, password });
  return data;
};

export const register = async (email: string, password: string): Promise<User> => {
  const { data } = await api.post<User>("/auth/register", { email, password });
  return data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};
