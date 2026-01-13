import css from './App.module.css';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useState } from 'react';
import { fetchNotes } from '../../services/noteService';
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import { useDebounce } from 'use-debounce';
import SearchBox from '../SearchBox/SearchBox';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';

export default function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['notes', page, debouncedSearch],
    queryFn: () => fetchNotes({ page, perPage: 12, search: debouncedSearch }),
    placeholderData: keepPreviousData,
  });

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
        />

        {isFetching && !isLoading && <span>Updating...</span>}

        {data && data.totalPages > 1 && (
          <div className={css.paginationWrap}>
            <Pagination
              totalPages={data.totalPages}
              currentPage={page}
              onPageChange={setPage}
            />
          </div>
        )}

        <button className={css.button} onClick={openModal}>
          Create note +
        </button>

        {isModalOpen && (
          <Modal
            onClose={closeModal}
            titleId="create-note-title"
            descriptionId="create-note-desc"
          >
            <h2 id="create-note-title">Create note</h2>
            <p id="create-note-desc">Fill the form to create a note.</p>
            <NoteForm onCancel={closeModal} />
          </Modal>
        )}
      </header>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Something went wrong.</p>}

      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}

      {data && !isLoading && !isError && data.notes.length === 0 && (
        <p>{debouncedSearch.trim().length > 0 ? 'No notes found.' : 'No notes yet.'}</p>
      )}
    </div>
  );
}
