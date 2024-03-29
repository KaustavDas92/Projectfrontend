import { Link } from "react-router-dom";
import BookModel from "../../models/BooksModel";
import { useEffect, useState } from "react";
import Constants from '../../utils/Constants.json';
import { SpinnderLoading } from "../../utils/SpinnerLoading";

export const CheckoutAndReviewBox: React.FC<{ book: BookModel | undefined, mobile: boolean }> = (props) => {
    
    const [bookCheckoutCount,setBookCheckoutCount] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [httpError, setHttpError] = useState(null)

    useEffect(() =>{
        const getbookCount = async () => {
            const url: string = Constants.API_URL + Constants.Books +Constants.Secure+Constants.CheckoutCount ;
            const response = await fetch(url)
            if (!response.ok) {
                throw new Error("Something went wrong");
            }
            const responseJson = await response.json();
            // const data = responseJson._embedded.books;
            console.log("data=", responseJson)
            

            // setBook(loadedBook)
            setIsLoading(false)
        }

        getbookCount().catch((error: any) => {
            setIsLoading(false)
            setHttpError(error.message)
        })
    },[])

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

    return (
        <div className={props.mobile ? 'card d-flex mt-5' : 'card col-3 container d-flex mb-5'}>
            <div className="card-body container">
                <div className="mt-3">
                    <p>
                        <b>0/5 </b>
                        books checked out
                    </p>
                    <hr />
                    {props.book && props.book.copiesAvailable && props.book.copiesAvailable > 0 ?
                        <h4 className="text-success">Available</h4> :
                        <h4 className="text-danger">Waitlist</h4>}

                    <div className="row">
                        <p className="col-6 lead">
                            <b>{props.book?.copies} </b>
                            copies
                        </p>
                        <p className="col-6 lead">
                            <b>{props.book?.copiesAvailable} </b>
                            Available
                        </p>
                    </div>
                </div>
                <Link to="/#" className="btn btn-success btn-lg">Sign in</Link>
                <hr/>
                <p className="mt-3"> This number can change until sign in</p>
                <p> Sign in to leave a review</p>
            </div>
        </div>
    )
}