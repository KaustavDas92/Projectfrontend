import { useEffect, useState } from "react"
import BookModel from "../../models/BooksModel"
import { useParams } from "react-router-dom"
import Constants from '../../utils/Constants.json';
import { SpinnerLoading } from "../../utils/SpinnerLoading";
import DefaultImg from './../../Images/BooksImages/book-luv2code-1000.png';
import { StarsReview } from "../../utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import ReviewModel from "../../models/ReviewModel";
import { LatestReviews } from "./LatestReviews";
import { useOktaAuth } from "@okta/okta-react";
import ReviewRequestModel from "../../models/ReviewRequestModel";


export const BookCheckoutPage = () => {

    const { authState } = useOktaAuth()

    const [book, setBook] = useState<BookModel>()
    const [isLoading, setIsLoading] = useState(false)
    const [httpError, setHttpError] = useState(null)

    // review state
    const [reviews, setReviews] = useState<ReviewModel[]>([])
    const [totalStars, setTotalStars] = useState(0)
    const [isLoadingReviews, setIsLoadingReviews] = useState(true)

    const [isReviewLeft, setIsReviewLeft] = useState(false)
    const [isLoadingUserReview,setIsLoadingUserReview]=useState(true)

    //loans count state
    const [currentLoansCount, setCurrentLoansCount] = useState(0)
    const [isLoadingCurrentStateCount, setIsLoadingCurrentStateCount] = useState(true)

    // Is Book Check out
    const [isCheckOut, setIsCheckedOut] = useState(false)
    const [isLoadingBookCheckedOut, setIsLoadingBookCheckedOut] = useState(true)

    //  Payment

    const [displayError, setDisplayError] = useState(false)

    const params = useParams()
    const bookid = params.bookid;

    // fetch books
    useEffect(() => {
        const fetchBooks = async () => {
            const url: string = Constants.API_URL + Constants.Books + "/" + bookid;
            const response = await fetch(url)
            if (!response.ok) {
                throw new Error("Something went wrong");
            }
            const responseJson = await response.json();
            // const data = responseJson._embedded.books;
            console.log("data=", responseJson)
            const loadedBook: BookModel = {
                id: responseJson.id,
                title: responseJson.title,
                author: responseJson.author,
                description: responseJson.description,
                copies: responseJson.copies,
                copiesAvailable: responseJson.copies_available,
                category: responseJson.category,
                img: responseJson.img
            }

            setBook(loadedBook)
            setIsLoading(false)
        }

        fetchBooks().catch((error: any) => {
            setIsLoading(false)
            setHttpError(error.message)
        })
    }, [isCheckOut])

    // fetch books reviews
    useEffect(() => {

        const fetchBooksReviews = async () => {
            const reviewUrl: string = Constants.API_URL + Constants.Reviews + Constants.SearchByBookId + `?bookId=${bookid}`

            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authState?.accessToken?.accessToken}`
                }
            }

            const response = await fetch(reviewUrl)
            if (!response.ok) {
                throw new Error("Something went wrong");
            }

            const responseJson = await response.json();
            const data = responseJson._embedded.reviews
            let weightedStarReviews: number = 0
            const loadedReviews: ReviewModel[] = []
            console.log("data=", responseJson)


            for (const key in data) {

                loadedReviews.push({
                    id: data[key],
                    userEmail: data[key].userEmail,
                    date: data[key].date,
                    rating: data[key].rating,
                    book_id: data[key].bookId,
                    reviewDescription: data[key].reviewDescription

                })
                weightedStarReviews += data[key].rating;
            }

            if (loadedReviews) {
                const round = (Math.round((weightedStarReviews / loadedReviews.length) * 2) / 2).toFixed(1)
                setTotalStars(Number(round))
            }
            setReviews(loadedReviews)
            setIsLoadingReviews(false)

        }

        fetchBooksReviews().catch((error: any) => {
            setIsLoadingReviews(false)
            setHttpError(error.message)
        })
    }, [isReviewLeft])

    //check if user has left a review or not
    useEffect(() => {

        const fetchUserReviewBook = async () => {
           if(authState && authState.isAuthenticated) {
            const url: string = Constants.API_URL + Constants.Reviews + Constants.Secure + Constants.IsReviewPresent + `?bookId=${bookid}`
            const requestOptions = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authState?.accessToken?.accessToken}`
                }
            }
            const response = await fetch(url, requestOptions)
            if (!response.ok) {
                throw new Error("Something went wrong");
            }
            const responseJson = await response.json();
            setIsReviewLeft(responseJson)
           }
            setIsLoadingUserReview(false)
        }

        fetchUserReviewBook().catch((error: any) => {
            setIsLoadingUserReview(false);
            setHttpError(error.message);
        })
    },[authState])

    // fetch user books Loaned
    useEffect(() => {
        const fetchUserCurrentLoansCount = async () => {
            if (authState && authState.isAuthenticated) {
                const url: string = Constants.API_URL + Constants.Books + Constants.Secure + Constants.CheckoutCount

                const requestOptions = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authState?.accessToken?.accessToken}`
                    }
                }
                const response = await fetch(url, requestOptions)
                if (!response.ok) {
                    throw new Error("Something went wrong");
                }
                const responseJson = await response.json();
                setCurrentLoansCount(responseJson)
            }
            setIsLoadingCurrentStateCount(false)
        }

        fetchUserCurrentLoansCount().catch((error: any) => {
            setIsLoadingCurrentStateCount(false);
            setHttpError(error.message);
        })
    }, [authState, isCheckOut])

    //  checkout user book
    useEffect(() => {
        const fetchUserCheckedOut = async () => {

            if (authState && authState.isAuthenticated) {
                const url: string = Constants.API_URL + Constants.Books + Constants.Secure + Constants.IsCheckedOut + `?bookId=${bookid}`
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authState?.accessToken?.accessToken}`
                    }
                }
                const response = await fetch(url, requestOptions)
                if (!response.ok) {
                    throw new Error("Something went wrong");
                }
                const responseJson = await response.json();
                console.log("responseJson=", responseJson)
                setIsCheckedOut(responseJson)
            }
            setIsLoadingBookCheckedOut(false)
        }

        fetchUserCheckedOut().catch((error: any) => {
            setIsLoadingBookCheckedOut(false);
            setHttpError(error.message);
        })
    }, [authState])

    


    if (isLoading || isLoadingReviews || isLoadingCurrentStateCount || isLoadingBookCheckedOut || isLoadingUserReview) {
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

    const checkoutBook = async () => {
        const url: string = Constants.API_URL + Constants.Books + Constants.Secure + Constants.CheckoutBook + `?bookId=${bookid}`
        const requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`
            }
        }
        const response = await fetch(url, requestOptions)
        console.log("response in bookcheckout= ",response)
        if (!response.ok) {

            setDisplayError(true)
            throw new Error("Something went wrong");
        }
        // const responseJson = await response.json();
        // console.log("responseJson checkout book=", responseJson)
        setDisplayError(false)
        setIsCheckedOut(true)
    }

    const submitReview = async (starInput:number,reviewDescription:string) => {
        let bookId:number=0;
        if(book?.id){
            bookId=book.id;
        }

        const reviewRequestModel= new ReviewRequestModel(starInput,bookId,reviewDescription)
        const url: string = Constants.API_URL + Constants.Reviews + Constants.Secure

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`
            },
            body: JSON.stringify(reviewRequestModel)
        }
        const response = await fetch(url, requestOptions)
        if (!response.ok) {
            throw new Error("Something went wrong");
        }
        // const responseJson = await response.json();
        // console.log("responseJson submit review=", responseJson)
        setIsReviewLeft(true)
       
    }
    return (
        <>
            <div className="container d-none d-lg-block d-md-block">
                {displayError && <div className="alert alert-danger" role="alert"> Please Pay outstanding fees and/or return book(s).</div>}
                <div className="row mt-5">
                    <div className="col-sm-2 col-md-2">
                        {
                            book?.img ? <img src={book?.img} height={349} width={226} alt='book' /> :
                                <img src={DefaultImg} height={349} width={226} alt='book' />
                        }
                    </div>

                    <div className="col-4 col-md-4 container">
                        <div className="ms-2">
                            <h2 className="text-center">{book?.title}</h2>
                            <h5 className="text-primary">{book?.author}</h5>
                            <p className="lead">{book?.description}</p>
                            <StarsReview Rating={totalStars} size={32} />
                        </div>
                    </div>
                    <CheckoutAndReviewBox
                        book={book}
                        mobile={false}
                        currentLoansCount={currentLoansCount}
                        isAuthenticated={authState?.isAuthenticated}
                        isCheckedOut={isCheckOut}
                        checkoutBook={checkoutBook}
                        isReviewLeft={isReviewLeft}
                        submitReview={submitReview}
                    />
                </div>
                <hr />
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={false} />
            </div>
                {/* Mobile */}
            <div className="container d-lg-none  mt-5">
            {displayError && <div className="alert alert-danger" role="alert"> Please Pay outstanding fees and/or return book(s).</div>}

                <div className="d-flex justify-content-center align-items-center">
                    {
                        book?.img ? <img src={book?.img} height={349} width={226} alt='book' /> :
                            <img src={DefaultImg} height={349} width={226} alt='book' />
                    }
                </div>
                <div className="mt-4">
                    <div className="ms-2">
                        <h2 className="text-center">{book?.title}</h2>
                        <h5 className="text-primary">{book?.author}</h5>
                        <p className="lead">{book?.description}</p>
                        <StarsReview Rating={totalStars} size={32} />

                    </div>
                </div>
                <CheckoutAndReviewBox
                    book={book}
                    mobile={true}
                    currentLoansCount={currentLoansCount}
                    isAuthenticated={authState?.isAuthenticated}
                    isCheckedOut={isCheckOut}
                    checkoutBook={checkoutBook}
                    isReviewLeft={isReviewLeft}
                    submitReview={submitReview}


                />

                <hr />
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={true} />

            </div>
        </>
    )
}