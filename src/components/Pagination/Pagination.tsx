import css from './Pagination.module.css';
import ReactPaginate from 'react-paginate';


export interface PaginationProps{
   totalPages: number;
   currentPage: number;
   onPageChange: (page: number) => void;
}

export default function Pagination({totalPages, currentPage, onPageChange}: PaginationProps) {
    
    return(
    <ReactPaginate 
    pageCount = {totalPages}
    forcePage = {currentPage - 1}
    onPageChange = {({selected}: {selected: number})=> onPageChange(selected+1)}
    nextLabel = "→"
    previousLabel ="←"
    breakLabel = "..."
    containerClassName={css.pagination}
    activeClassName={css.active}/>)
}