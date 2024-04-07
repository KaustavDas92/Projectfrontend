import React, { useEffect, useState } from "react";
import ReviewModel from "../../../models/ReviewModel";
import Constants from '../../../utils/Constants.json';
import { SpinnerLoading } from "../../../utils/SpinnerLoading";
import { Review } from "../../../utils/Review";
import { Pagination } from "../../../utils/Pagination";

const ReviewListPage = () =>{

    const [reviews,setReviews] = useState<ReviewModel[]>([])
    const [isLoading,setIsLoading] = useState(true)
    const [httpError,setHttpError]=useState(null)

    // Pagination
    const [currentPage,setCurrentPage]=useState(1)
    const [reviewPerPage]=useState(5)
    const [totalAmountOfReviews,setTotalAmountOfReviews]=useState(0)
    const [totalPages,setTotalPages]=useState(0)
    
    const bookid= (window.location.pathname).split("/")[2] 


    useEffect(() => {

        const fetchBooksReviews = async () => {
            const reviewUrl: string = Constants.API_URL + Constants.Reviews + Constants.SearchByBookId + `?bookId=${bookid}&page=${currentPage-1}&size=${reviewPerPage}`

            const response = await fetch(reviewUrl)
            if (!response.ok) {
                throw new Error("Something went wrong");
            }

            const responseJson = await response.json();
            const data = responseJson._embedded.reviews

            setTotalAmountOfReviews(responseJson.page.totalElements)
            setTotalPages(responseJson.page.totalPages)

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
       
            }

        
            setReviews(loadedReviews)
            setIsLoading(false)

        }

        fetchBooksReviews().catch((error: any) => {
            setIsLoading(false)
            setHttpError(error.message)
        })
    }, [currentPage])

    if(isLoading) {
        return (
            <SpinnerLoading />
        )
    }
    if(httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        )
    }

    const indexOfLastReview:number = currentPage * reviewPerPage;
    const indexOfFirstReview:number = indexOfLastReview - reviewPerPage;
    let lastItem = reviewPerPage * currentPage <= totalAmountOfReviews ? reviewPerPage * currentPage : totalAmountOfReviews
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    return (
        <div className="container m-5"> 
            <div>
                <h3>Comments: ( {reviews.length} )</h3>
            </div>
            <p>
                {indexOfFirstReview +1} to {lastItem} of {totalAmountOfReviews}
            </p>

            <div className="row">
                {reviews.map(review =>(
                    <Review review={review} key={review.id} />
                ))}
            </div>

            {totalPages>1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>}
        </div>
    )
}

export default ReviewListPage;