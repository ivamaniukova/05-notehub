import css from './App.module.css';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { fetchNotes, deleteNote, createNote } from '../../services/noteService';
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import { useDebounce } from 'use-debounce';
import SearchBox from '../SearchBox/SearchBox';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';


export default function App (){
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [debouncedSearch] = useDebounce(search, 500);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
  setIsModalOpen(false);
  createMutation.reset();
};

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notes'] }),
    onMutate: (id) => {setDeletingId(id)},
    onSettled: () => setDeletingId(null),
  });

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {queryClient.invalidateQueries({ queryKey: ['notes'] });
    setFormKey((k) => k + 1);
    setPage(1);
    closeModal();
    },
  })

  const {data, isLoading, isError, isFetching} = useQuery({
    queryKey: ['notes', page, debouncedSearch],
    queryFn: () => fetchNotes({page, perPage : 12, search: debouncedSearch}),
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value = {search} onChange={(value)=> {
          setSearch(value);
          setPage(1)}} />
          {isFetching && !isLoading && <span>Updating...</span>}
        {data && data.totalPages > 1 && (
          <div className={css.paginationWrap}>
        <Pagination
        totalPages = {data.totalPages}
        currentPage = {page}
        onPageChange = {setPage} /></div>
      )}
      <button className={css.button} onClick = {openModal} disabled={createMutation.isPending}>
          Create note +
        
        </button>
        {isModalOpen && (
          <Modal onClose={closeModal} titleId="create-note-title" descriptionId="create-note-desc">
              <h2 id="create-note-title">Create note</h2>
              <p id="create-note-desc">Fill the form to create a note.</p>
              {createMutation.isError && (
                <p role="alert" style={{ color: '#dc3545', margin: '8px 0' }}>
                  Failed to create note. Please try again.
                </p>
)}
            <NoteForm
              key = {formKey}
              onCancel={closeModal}
              onSubmit={(values) => createMutation.mutate(values)}
              isSubmitting={createMutation.isPending}
              />
          </Modal>
        )}
      </header>
      
      {isLoading && <p>Loading...</p>}
      {isError && <p>Something went wrong.</p>}
      {mutation.isError && (
        <p role="alert" style={{ color: '#dc3545' }}>
          Failed to delete note. Please try again.
        </p>
)}
      {data && data.notes.length > 0 && (
        <NoteList 
        notes = {data.notes} 
        onDelete={(id) => {
  mutation.reset();
  mutation.mutate(id);
}}
        deletingId = {deletingId}
        />
      )}
      {data && !isLoading && !isError && data.notes.length === 0 && (
  <p>{debouncedSearch.trim().length > 0 ? 'No notes found.' : 'No notes yet.'}</p>
)}
    </div>
  );
}