import React, { useState } from "react"
import { StarsReview } from "./StarsReview"

export const LeaveAReview: React.FC<{submitReview:any}> = (props) => {
    const [starInput, setStarInput] = useState(0)
    const [displayInput, setDisplayInput] = useState(false)
    const [reviewDescription, setReviewDescription] = useState("")

    const starValue = (value: number) => {
        setStarInput(value)
        setDisplayInput(true)
    }

    return (
        <div className="dropdown" style={{ cursor: 'pointer' }}>
            <h5 className="dropdown-toggle" id="dropdownMenuButton1" data-bs-toggle='dropdown'>
                Leave a review?
            </h5>
            <ul id="submitReviewRating" className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                <li><button onClick={() => starValue(0)} className="dropdown-item"> 0 Star</button></li>
                <li><button onClick={() => starValue(0.5)} className="dropdown-item"> 0.5 Star</button></li>
                <li><button onClick={() => starValue(1)} className="dropdown-item"> 1 Star</button></li>
                <li><button onClick={() => starValue(1.5)} className="dropdown-item"> 1.5 Star</button></li>
                <li><button onClick={() => starValue(2)} className="dropdown-item"> 2 Star</button></li>
                <li><button onClick={() => starValue(2.5)} className="dropdown-item"> 2.5 Star</button></li>
                <li><button onClick={() => starValue(3)} className="dropdown-item"> 3 Star</button></li>
                <li><button onClick={() => starValue(3.5)} className="dropdown-item"> 3.5 Star</button></li>
                <li><button onClick={() => starValue(4)} className="dropdown-item"> 4 Star</button></li>
                <li><button onClick={() => starValue(4.5)} className="dropdown-item"> 4.5 Star</button></li>
                <li><button onClick={() => starValue(5)} className="dropdown-item"> 5 Star</button></li>
            </ul>
            <StarsReview Rating={starInput} size={32} />

            {displayInput &&
                <form method="POST" action="#">
                    <div className="mb-3">
                        <hr></hr>
                        <label className="form-label"> Description</label>
                        <textarea
                            className="form-control"
                            rows={3}
                            onChange={(e) => setReviewDescription(e.target.value)}
                            placeholder="Optional"
                            id="submitReviewDescription"
                        >

                        </textarea>
                    </div>
                    <div>

                        <button type="button" onClick={()=> props.submitReview(starInput,reviewDescription)} className="btn btn-primary mt-3">Submit Review</button>
                    </div>

                </form>
            }
        </div>
    )
}
