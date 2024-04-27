import React, { useEffect, useState } from "react";
import BookModel from "../../../models/BooksModel";
import { useOktaAuth } from "@okta/okta-react";
import Constants from "../../../utils/Constants.json";

export const ChangeQuantityOfBook: React.FC<{ book: BookModel, bookDelete:any }> = (props, key) => {

    const {authState}= useOktaAuth()
    const [quantity, setQuantity] = useState<number>(0);
    const [remaining, setRemaining] = useState<number>(0);

    useEffect(() => {
        const fetchBookInState = () => {
            props.book.copies ? setQuantity(props.book.copies) : setQuantity(0)
            props.book.copiesAvailable ? setRemaining(props.book.copiesAvailable) : setRemaining(0)

        }
        fetchBookInState()
    }, [])

    const increaseQuantity = async() =>{
        if(authState && authState.isAuthenticated) {
            const url=Constants.API_URL + Constants.Admin + Constants.Secure + Constants.IncreaseBookQuantity + `?bookId=${props.book.id}`
            const requestHeaders= {
                method:"PUT",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authState?.accessToken?.accessToken}`
                }
            }

            const response = await fetch(url, requestHeaders)
            if (!response.ok) {
                throw new Error("Something went wrong");
            }

            setQuantity(quantity +1)
            setRemaining(remaining +1) 
        }
    }
    const decreaseQuantity = async() =>{
        if(authState && authState.isAuthenticated) {
            const url=Constants.API_URL + Constants.Admin + Constants.Secure + Constants.DecreaseBookQuantity + `?bookId=${props.book.id}`
            const requestHeaders= {
                method:"PUT",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authState?.accessToken?.accessToken}`
                }
            }

            const response = await fetch(url, requestHeaders)
            if (!response.ok) {
                throw new Error("Something went wrong");
            }
            setQuantity(quantity - 1)
            setRemaining(remaining - 1)
        }
    }

    const deleteBook = async() =>{
        if(authState && authState.isAuthenticated) {
            const url=Constants.API_URL + Constants.Admin + Constants.Secure + Constants.DeleteBook + `?bookId=${props.book.id}`
            const requestHeaders= {
                method:"DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authState?.accessToken?.accessToken}`
                }
            }

            const response = await fetch(url, requestHeaders)
            if (!response.ok) {
                throw new Error("Something went wrong");
            }
            props.bookDelete()
        }
    }
    
    return (
        <div className="card mt-3 shadow p-3 mb-3 bg-body rounded">
            <div className="row g-0">
                <div className="col-md-2">
                    <div className="d-none d-lg-block">
                        {
                            props.book.img ?
                                <img src={props.book.img}
                                    width='123'
                                    height='196'
                                    alt="book" />
                                :
                                <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')} width="123" height="196" alt="book" />
                        }
                    </div>
                    <div className="d-lg-none d-flex justify-content-center align-items-center">
                        {
                            props.book.img ?
                                <img src={props.book.img}
                                    width='123'
                                    height='196'
                                    alt="book" />
                                :
                                <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')} width="123" height="196" alt="book" />
                        }
                    </div>
                </div>
                <div className="col-md-6">
                    <h5 className="card-title">{props.book.author}</h5>
                    <h4>{props.book.title}</h4>
                    <p className="card-text">{props.book.description}</p>
                </div>
                <div className="col-md-4">
                    <div className="d-flex justify-content-center align-items-center">
                        <p>Total Quantity: <b>{quantity}</b></p>
                    </div>
                    <div className="d-flex justify-content-center align-items-center">
                        <p>Remaining : <b>{remaining}</b></p>
                    </div>
                </div>
                <div className="col-md-1 mt-3">
                    <div className="d-flex justify-content">
                        <button className="btn btn-md btn-danger m-1" onClick={deleteBook}>Delete</button>
                    </div>
                </div>
            </div>
            <button className=" m-1 btn btn-md main-color text-white" onClick={increaseQuantity}>Add Quantity</button>
            <button className=" m-1 btn btn-md btn-warning" onClick={decreaseQuantity}>Decrease Quantity</button>
        </div>
    )
}