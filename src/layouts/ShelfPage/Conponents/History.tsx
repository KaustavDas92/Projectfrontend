import { useOktaAuth } from "@okta/okta-react";
import React, { useEffect, useState } from "react";
import HistoryModel from "../../../models/HistoryModel";
import { SpinnerLoading } from "../../../utils/SpinnerLoading";
import Constants from '../../../utils/Constants.json';
import { Link } from "react-router-dom";
import { Pagination } from "../../../utils/Pagination";

export const History = () => {
    const { authState } = useOktaAuth();
    const [isLoadingHistory, setIsLoadingHistory] = useState(true)
    const [httpError, setHttpError] = useState(null)

    //histories
    const [histories, setHistories] = useState<HistoryModel[]>([])

    //pagination
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)

    useEffect(() => {

        const fetchHistories = async () => {
            let url: string = ""
            if (authState && authState.isAuthenticated) {

                url = Constants.API_URL + Constants.Histories + Constants.GetAllHistories +
                    `?userEmail=${authState.accessToken?.claims.sub}&page=${currentPage - 1}&size=5`;

                const requestOptions = {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authState?.accessToken?.accessToken}`
                    }
                }
                const response = await fetch(url, requestOptions);
                if (!response.ok) {
                    throw new Error("Something went wrong");
                }

                const data = await response.json();
                setHistories(data._embedded.histories)
                setTotalPages(data.page.totalPages)
            }
            setIsLoadingHistory(false)

        }
        fetchHistories().catch((error: any) => {
            setHttpError(error.message)
            setIsLoadingHistory(false)
        })
    }, [authState, currentPage])

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

    if (isLoadingHistory) {
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
    return (
        <div className="mt-2">
            {histories.length > 0 ?
                <>
                    <h5>Recent History</h5>
                    {histories.map((history) => (
                        <div key={history.id}>
                            <div className="card mt-3 shadow p-3 mb-3 bg-body rounded">
                                <div className="row g-0">
                                    <div className="col-md-2">
                                        {/* desktop */}
                                        <div className="d-none d-lg-block">
                                            {history.img ?
                                                <img src={history.img} width="123" height="196" alt="book" />
                                                :
                                                <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')} width="123" height="196" alt="book" />
                                            }
                                        </div>
                                        {/* mobile */}
                                        <div className="d-lg-none d-flex justify-content-center align-items-center">
                                        {history.img ?
                                                <img src={history.img} width="123" height="196" alt="book" />
                                                :
                                                <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')} width="123" height="196" alt="book" />
                                            }
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="card-body">
                                            <h5 className="card-title"> {history.author}</h5>
                                            <h4>{history.title}</h4>
                                            <p className="card-text"> {history.description}</p>
                                            <hr/>
                                            <p className="card-text">Checked out on: {history.checkoutDate}</p>
                                            <p className="card-text">Returned on: {history.returnDate}</p>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr/>
                        </div>
                    ))}
                </>
                :  
                <>
                    <h3 className="mt-3"> Currently no history:</h3>
                    <Link className="btn btn-primary" to={'/search'}>Search for new book </Link>
                </>  
        }
        {totalPages >1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>}
        </div>
    )
}