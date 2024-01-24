
import Img1 from './../../Images/BooksImages/new-book-1.png';
import Img2 from './../../Images/BooksImages/new-book-2.png';
import React, { useEffect, useState, } from "react";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { ReturnBook } from './ReturnBook';

export const MyCarousel = () => {
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
                        <ReturnBook />

                    </div>
                    <div className="carousel-item">
                        <ReturnBook />

                    </div>
                    <div className="carousel-item">
                        <ReturnBook />
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
                <ReturnBook />
            </div>
            <div className='homepage-carousel-title mt-3'>
                <a className='btn btn-outline-secondary btn-lg' href='#'>View More</a>
            </div>


        </div>

    )
}