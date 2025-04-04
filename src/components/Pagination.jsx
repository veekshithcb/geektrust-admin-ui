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
                                setCurrentPage(1); 
                            } else if (page === '<') {
                                setCurrentPage(prev => Math.max(1, prev - 1)); 
                            } else if (page === '>') {
                                setCurrentPage(prev => Math.min(totalPages, prev + 1)); 
                            } else if (page === '>>') {
                                setCurrentPage(totalPages);
                            } else {
                                setCurrentPage(page); 
                            }
                            clearChecked(); 
                        }} >{page}</button>
                    )
                })
            }
        </div>
    );
}
export default Pagination;