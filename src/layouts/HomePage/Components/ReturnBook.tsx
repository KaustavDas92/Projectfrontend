import React from "react";
import Img from './../../../Images/BooksImages/book-luv2code-1000.png';
export const ReturnBook = () => {
    return (
        <div className="row d-flex justify-content-center align-items-center">

            <div className="col-xs-6 col-sm-6 col-md-4 col-lg-3 mb-3">

                <div className="text-center ">
                    <img src={Img}
                        width='151'
                        height='233'
                        alt="book" />

                    <h6 className='mt-2'>Book</h6>
                    <p>Luv2Code</p>
                    <a type="button" className='btn main-color text-white' href='#'>Reserve</a>
                </div>

            </div>
        </div>
    )
}