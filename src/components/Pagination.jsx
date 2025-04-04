import React from 'react';

import "./Pagination.css";

const Pagination = ({ totalPosts, postPerPage, currentPage ,setCurrentPage ,clearChecked }) => {

    let pages = [];

    pages.push('<<')

    pages.push('<')

    let totalPages  = Math.ceil(totalPosts / postPerPage);

    for (let i = 1; i <=totalPages; i++) {
        pages.push(i);
    }
    pages.push('>')
    pages.push('>>')

   

    return (
        <div className="pagination" >
            {
                pages.map((page, index) => {
                    return (
                        <button key={index} className={ page ==currentPage ? "paginationBtnClicked": "paginationBtn"} onClick={() => {
                            if (page === '<<') {
                                setCurrentPage(1); // Go to first page
                            } else if (page === '<') {
                                setCurrentPage(prev => Math.max(1, prev - 1)); // Previous page
                            } else if (page === '>') {
                                setCurrentPage(prev => Math.min(totalPages, prev + 1)); // Next page
                            } else if (page === '>>') {
                                setCurrentPage(totalPages); // Go to last page
                            } else {
                                setCurrentPage(page); // Go to the selected page
                            }
                            clearChecked(); // Clear selected checkboxes when changing pages
                        }} >{page}</button>
                    )
                })
            }
        </div>
    );
}
export default Pagination;