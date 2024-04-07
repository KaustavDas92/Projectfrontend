import { Link } from "react-router-dom";
import BookModel from "../../models/BooksModel";
import { useEffect, useState } from "react";
import Constants from '../../utils/Constants.json';
import { SpinnerLoading } from "../../utils/SpinnerLoading";
import { useOktaAuth } from "@okta/okta-react";
import { LeaveAReview } from "../../utils/LeaveAReview";

export const CheckoutAndReviewBox: React.FC<{ 
    book: BookModel | undefined, 
    mobile: boolean,
    currentLoansCount:number,
    isAuthenticated:any,
    isCheckedOut:boolean,
    checkoutBook:any,
    isReviewLeft:boolean,
    submitReview:any, }> = (props) => {
    
    const [bookCheckoutCount,setBookCheckoutCount] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [httpError, setHttpError] = useState(null)
    const {authState} = useOktaAuth()

    const buttonRender=() =>{
        console.log("Autheticated= ",props.isAuthenticated)
        if(props.isAuthenticated) {
            if (!props.isCheckedOut && props.currentLoansCount<5) {
                return (<button onClick={() => props.checkoutBook()} className="btn btn-success btn-lg">Checkout</button>)
            }
            else if (props.isCheckedOut){
                return (<p><b>Book Checked Out. Enjoy!!</b></p>)
            }
            else if(!props.isCheckedOut){
                return (<p className="text-danger">Too many books checked out.</p>)
            }
        }

        return(<Link to={'/login'} className="btn btn-success btn-lg">Sign In</Link>)
    }

    const reviewRender = () => {
        if(props.isAuthenticated && !props.isReviewLeft){
            return(<p>
                <LeaveAReview submitReview={props.submitReview} />
            </p>)
        }
        else if (props.isAuthenticated && props.isReviewLeft){
            return (<p><b>Thank you for the review.</b></p>)
        }

        return (<div><hr/> <p> Sign in to be able to leave a review. </p> </div>)
    }

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

    return (
        <div className={props.mobile ? 'card d-flex mt-5' : 'card col-3 container d-flex mb-5'}>
            <div className="card-body container">
                <div className="mt-3">
                    <p>
                        <b>{props.currentLoansCount}/5 </b>
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
                {buttonRender()}
                <hr/>
                <p className="mt-3"> This number can change until sign in</p>
              {reviewRender()}
            </div>
        </div>
    )
}