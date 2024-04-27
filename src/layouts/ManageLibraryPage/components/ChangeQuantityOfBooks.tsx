import { useOktaAuth } from "@okta/okta-react";
import React, { useEffect, useState } from "react";
import BookModel from "../../../models/BooksModel";
import Constants from "../../../utils/Constants.json";
import { SpinnerLoading } from "../../../utils/SpinnerLoading";
import { Pagination } from "../../../utils/Pagination";
import { ChangeQuantityOfBook } from "./ChangeQuantityOfBook";


export const ChangeQuantityOfBooks = () =>{
    
    const {authState}= useOktaAuth()
    
    const [books, setBooks] = useState<BookModel[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [httpError, setHttpError] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [booksPerPage, setBooksPerPage] = useState(5)
    const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [bookDelete,setBookDelete] = useState(false)


    useEffect(() => {
        const fetchBooks = async () => {
            let url: string = ""
          
                url = Constants.API_URL + Constants.Books + `?page=${currentPage - 1}&size=${booksPerPage}`;
           

            const response = await fetch(url)

            if (!response.ok) {
                throw new Error("Something went wrong");
            }

            const responseJson = await response.json();
            const data = responseJson._embedded.books;

            setTotalAmountOfBooks(responseJson.page.totalElements)
            setTotalPages(responseJson.page.totalPages)

            const loadedBooks: BookModel[] = []

            for (const key in data) {
                loadedBooks.push({
                    id: data[key].id,
                    title: data[key].title,
                    author: data[key].author,
                    description: data[key].description,
                    copies: data[key].copies,
                    copiesAvailable: data[key].copies_available,
                    category: data[key].category,
                    img: data[key].img
                })
            }

            setBooks(loadedBooks)
            setIsLoading(false)

        }

        fetchBooks().catch((error: any) => {
            setIsLoading(false)
            setHttpError(error.message)
        })

    }, [currentPage,bookDelete])

    if (isLoading) {
        return (
            <SpinnerLoading />
        )
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        )
    }

    const indexOfLastBook: number = currentPage * booksPerPage;
    const indexOfFirstBook: number = indexOfLastBook - booksPerPage;
    let lastItem = booksPerPage * currentPage <= totalAmountOfBooks ? booksPerPage * currentPage
        : totalAmountOfBooks;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    const deleteBook= () =>{
        setBookDelete(!bookDelete)
    }
    
    return (
        <div className="container mt-5">
            {
                    totalAmountOfBooks > 0 ? <>

                        <div className="mt-3">
                            <h5>Number of Results :{totalAmountOfBooks}</h5>
                        </div>
                        <div>{indexOfFirstBook + 1} to {indexOfLastBook} of {totalAmountOfBooks} items</div>
                        {
                            books.map(book => (
                                <div><ChangeQuantityOfBook book={book} bookDelete={deleteBook}/></div>
                            ))
                        }
                        {totalPages > 1 &&
                            <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />}

                    </> :
                        <h5>Add a book before changing quantity.</h5>
                }
        </div>
    )
}