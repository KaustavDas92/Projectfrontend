import { useState, useEffect } from "react"
import BookModel from "../../models/BooksModel"
import Constants from "../../utils/Constants.json"
import { SpinnderLoading } from "../../utils/SpinnerLoading"
import { SearchBook } from "./Components/SearchBook"
import { Pagination } from "../../utils/Pagination"


export const SearchBooksPage = () => {
    const [books, setBooks] = useState<BookModel[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [httpError, setHttpError] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [booksPerPage, setBooksPerPage] = useState(5)
    const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [search, setSearch] = useState('');
    const [searchUrl, setSearchUrl] = useState('');
    const [categorySelection,setCategorySelection] = useState('Select Category');


    useEffect(() => {
        const fetchBooks = async () => {
            let url: string = ""
            if (searchUrl === '')
                url = Constants.API_URL + Constants.Books + `?page=${currentPage - 1}&size=${booksPerPage}`;
            else{

                let searchUrlWithSearch = searchUrl.replace("<pageNo>",`${currentPage -1}`)
                url = Constants.API_URL + Constants.Books + searchUrlWithSearch;
            }

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
                    copiesAvailable: data[key].copiesAvailable,
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

        window.scrollTo(0, 0)
    }, [currentPage, searchUrl])

    if (isLoading) {
        return (
            <SpinnderLoading />
        )
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        )
    }


    const handleSearchSubmit = () => {
        setCurrentPage(1)
        if (search !== '') {
            setSearchUrl(`/${Constants.SearchByTitle}?title=${search}&page=<pageNo>&size=${booksPerPage}`)
        }
        else {
            setSearchUrl('')
        }
        setCategorySelection('Select Category')
    }

    const handleSearch = (e: any) => {
        setSearch(e.target.value)
    }

    const handleCategorySelection= (category:string) =>{
        setCurrentPage(1)
        setCategorySelection(category)
        if(category != 'All')
            setSearchUrl(`/${Constants.SearchByCategory}?category=${category}&page=<pageNo>&size=${booksPerPage}`)
        else
            setSearchUrl(`?page=0&size=${booksPerPage}`)

    }

    const indexOfLastBook: number = currentPage * booksPerPage;
    const indexOfFirstBook: number = indexOfLastBook - booksPerPage;
    let lastItem = booksPerPage * currentPage <= totalAmountOfBooks ? booksPerPage * currentPage
        : totalAmountOfBooks;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <>
            <div className="container">
                <div className="row mt-5">
                    <div className="col-6">
                        <div className="d-flex">
                            <input className="form-control me-2" type="search" placeholder="Search" aria-labelledby="Search" onChange={handleSearch} />
                            <button className="btn btn-outline-success" type="button" onClick={handleSearchSubmit}>
                                Search
                            </button>

                        </div>
                    </div>
                    <div className="col-4">
                        <div className="dropdown">
                            <button className="btn btn-secondary dropdown-toggle" type="button"
                                id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                {categorySelection}
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1" >
                                <li onClick={() => handleCategorySelection("All")}><a className="dropdown-item" href="#">All</a></li>
                                <li onClick={() => handleCategorySelection("FE")}><a className="dropdown-item" href="#">Front End</a></li>
                                <li onClick={() => handleCategorySelection("BE")}><a className="dropdown-item" href="#">Backend</a></li>
                                <li onClick={() => handleCategorySelection("Data")}><a className="dropdown-item" href="#">Data</a></li>
                                <li onClick={() => handleCategorySelection("Devops")}><a className="dropdown-item" href="#">DevOps</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                {
                    totalAmountOfBooks > 0 ? <>

                        <div className="mt-3">
                            <h5>Number of Results :{totalAmountOfBooks}</h5>
                        </div>
                        <p>{indexOfFirstBook + 1} to {indexOfLastBook} of {totalAmountOfBooks} items</p>
                        {
                            books.map(book => (
                                <SearchBook book={book} key={book.id} />
                            ))
                        }
                        {totalPages > 1 &&
                            <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />}

                    </> :
                        <div className="container m-5">
                            <h5>Can't Find what you are looking for?</h5>
                            <a type="button" href="#" className="btn main-color btn-md text-white fw-bold px-4 me-md-2">Library Service</a>
                        </div>
                }

            </div>
        </>
    )
}