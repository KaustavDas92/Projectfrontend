import { useOktaAuth } from "@okta/okta-react";
// import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { AdminMessages } from "./components/AdminMessages";
import { AddNewBook } from "./components/AddNewBook";
import { ChangeQuantityOfBooks } from "./components/ChangeQuantityOfBooks";

export const ManageLibraryPage = () => {

    const { authState } = useOktaAuth()
    const navigate = useNavigate()
    const [changeQuantityOfBooksClicked, setChangeQuantityOfBooksClicked] = useState(false)
    const [messagesClicked, setMessagesClicked] = useState(false)

    const addBookClickFunction = () => {
        setChangeQuantityOfBooksClicked(false)
        setMessagesClicked(false)
    }
    const ChangeQuantityOfBooksClickedFunction = () => {
        setChangeQuantityOfBooksClicked(true)
        setMessagesClicked(false)
    }
    const messagesClickFunction = () => {
        setChangeQuantityOfBooksClicked(false)
        setMessagesClicked(true)
    }

    // useEffect(() => {
    //     setTimeout(
    //         () => {
    //             console.log('userType=', authState?.accessToken?.claims.userType)

    //             if (authState?.accessToken?.claims.userType != 'admin') {
    //                 console.log("inside if")
    //                 navigateToHomePage()
    //             }
    //         }, 1000)



    // }, [authState])

    // const navigateToHomePage = () => {
    //     navigate('/home')
    // }



    return (
        <div className="container">

            {authState && authState.isAuthenticated ?
                <>
                    {authState?.accessToken?.claims.userType === 'admin' ?
                        <div className="mt-5">

                            <h5>Manage Library Page</h5>
                            <nav>
                                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                    <button className="nav-link active"
                                        id="nav-add-book-tab"
                                        data-bs-toggle="tab"
                                        data-bs-target="#nav-add-book"
                                        type="button"
                                        role="tab"
                                        aria-controls="nav-add-book"
                                        aria-selected="false"
                                        onClick={addBookClickFunction}
                                    >
                                        Add new book
                                    </button>
                                    <button className="nav-link"
                                        id="nav-quantity-tab"
                                        data-bs-toggle="tab"
                                        data-bs-target="#nav-quantity"
                                        type="button"
                                        role="tab"
                                        aria-controls="nav-quantity"
                                        aria-selected="true"
                                        onClick={ChangeQuantityOfBooksClickedFunction}

                                    >
                                        Change Quantity
                                    </button>
                                    <button className="nav-link"
                                        id="nav-messages-tab"
                                        data-bs-toggle="tab"
                                        data-bs-target="#nav-messages"
                                        type="button"
                                        role="tab"
                                        aria-controls="nav-messages"
                                        aria-selected="true"
                                        onClick={messagesClickFunction}

                                    >
                                        Messages
                                    </button>
                                </div>
                            </nav>
                            <div className="tab-content" id="nav-tabContent">
                                <div className="tab-pane fade show active" id="nav-add-book" role="tabpanel" aria-labelledby="nav-add-book-tab">
                                    <AddNewBook />
                                </div>
                                <div className="tab-pane fade" id="nav-quantity" role="tabpanel" aria-labelledby="nav-quantity-tab">
                                    {changeQuantityOfBooksClicked ? <><ChangeQuantityOfBooks /></> : <></>}
                                </div>
                                <div className="tab-pane fade" id="nav-messages" role="tabpanel" aria-labelledby="nav-messages-tab">
                                    {messagesClicked ? <><AdminMessages /></> : <></>}
                                </div>
                            </div>
                        </div>
                        :
                        <Navigate to="/home " />}


                </>
                :
                <div className="d-flex justify-content-center mt-5">
                    <Link className="btn main-color btn-lg text-white" to="/login">Login</Link>
                </div>
            }

        </div>
    )
}