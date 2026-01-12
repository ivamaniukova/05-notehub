import axios, { type AxiosInstance } from "axios";
import type { Note, NoteTag } from "../types/note";

const BASE_URL = "https://notehub-public.goit.study/api";

const token = import.meta.env.VITE_NOTEHUB_TOKEN;

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export interface FetchNotesResponse{
    notes: Note[];
    totalPages: number;
}

export interface CreateNoteParams{
    title: string;
    content: string;
    tag: NoteTag;
} 

export type CreateNoteResponse = Note;
export type DeleteNoteResponse = Note;

export async function fetchNotes( 
    params: FetchNotesParams = {}
): Promise<FetchNotesResponse> {const {  
        page = 1,
        perPage = 12,
        search,
    } = params;

    const response = await api.get<FetchNotesResponse>("/notes",{
        params:{
            page, 
            perPage,
            search,
        },
    })

    return response.data; 
}

export async function createNote (
    payload: CreateNoteParams
): Promise<CreateNoteResponse>{
    const response = await api.post<CreateNoteResponse>("/notes", payload);
    return response.data;
}

export async function deleteNote (id: string): Promise<DeleteNoteResponse>{
    const response = await api.delete<DeleteNoteResponse>(`/notes/${id}`);
    return response.data;
}

