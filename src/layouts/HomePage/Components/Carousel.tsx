
import Img1 from './../../Images/BooksImages/new-book-1.png';
import Img2 from './../../Images/BooksImages/new-book-2.png';
import React, { useEffect, useState, } from "react";
import 'react-multi-carousel/lib/styles.css';
import { ReturnBook } from './ReturnBook';
import BookModel from '../../../models/BooksModel';
import Constants from '../../../utils/Constants.json';
import { SpinnderLoading } from '../../../utils/SpinnerLoading';
import { Link } from 'react-router-dom';
export const MyCarousel = () => {

    const [books, setBooks] = useState<BookModel[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [httpError, setHttpError] = useState(null)


    useEffect(() => {
        const fetchBooks = async () => {
            const url: string = Constants.API_URL + Constants.Books + "?page=0&size=9";
            const response = await fetch(url)
            if (!response.ok) {
                throw new Error("Something went wrong");
            }
            const responseJson = await response.json();
            const data = responseJson._embedded.books;
            console.log("data=", data)
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
    }, [])

    if (isLoading) {
        return (
          <SpinnderLoading/>
        )
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        )
    }
    return (
        <div className="container mt-5" style={{ height: 550 }}>
            <div className="homepage-carousel-title">
                <h3> Find your next " I stayed up too late reading" book</h3>
            </div>
            {/* Desktop */}
            <div id='carouselExampleControls' className='carousel carousel-dark slide mt-5 
                d-none d-lg-block' data-bs-interval="false" data-bs-pause="hover">


                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <div className="row d-flex justify-content-center align-items-center">
                            {
                                books.slice(0, 3).map((book, index) => (
                                    <ReturnBook book={book} key={index} />

                                ))
                            }

                        </div>
                    </div>
                    <div className="carousel-item ">
                        <div className="row d-flex justify-content-center align-items-center">
                            {
                                books.slice(3, 6).map((book, index) => (
                                    <ReturnBook book={book} key={index} />

                                ))
                            }

                        </div>
                    </div>
                    <div className="carousel-item ">
                        <div className="row d-flex justify-content-center align-items-center">
                            {
                                books.slice(6, 9).map((book, index) => (
                                    <ReturnBook book={book} key={index} />

                                ))
                            }

                        </div>
                    </div>
                </div>

                <button className='carousel-control-prev' type='button'
                    data-bs-target='#carouselExampleControls' data-bs-slide='prev'>
                    <span className='carousel-control-prev-icon' aria-hidden='true'></span>
                    <span className='visually-hidden'>Previous</span>
                </button>
                <button className='carousel-control-next' type='button'
                    data-bs-target='#carouselExampleControls' data-bs-slide='next'>
                    <span className='carousel-control-next-icon' aria-hidden='true'></span>
                    <span className='visually-hidden'>Next</span>
                </button>
            </div>
            {/* Mobile */}
            <div className='d-lg-none mt-3'>
                
                        <ReturnBook book={books[7]} key={books[7].id} />

                  
            </div>
            <div className='homepage-carousel-title mt-3'>
                <Link className='btn btn-outline-secondary btn-lg' to='/search'>View More</Link>
            </div>


        </div>

    )
}