import React, { useEffect, useState } from "react";
import { useOktaAuth } from "@okta/okta-react";
import Constants from '../../../utils/Constants.json';
import MessageModel from "../../../models/MessagesModel";

export const PostNewMessage = () => {

    const { authState } = useOktaAuth()

    const [title, setTitle] = useState("")
    const [question, setQuestion] = useState("")
    const [displayWarning, setDisplayWarning] = useState(false)
    const [displaySuccess, setDisplaySuccess] = useState(false)

    useEffect(() => {

    }, [])

    const submitNewQuestion = async () => {
        if (authState && authState.isAuthenticated && title !== "" && question !== "") {
            const url: string = Constants.API_URL + Constants.Messages + Constants.Secure + Constants.PostNewMessage
            const messageModel = new MessageModel(title, question)

            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authState?.accessToken?.accessToken}`
                },
                body: JSON.stringify(messageModel)
            }
            const response = await fetch(url, requestOptions)
            if (!response.ok) {
                throw new Error("Something went wrong");
            }
            setTitle("")
            setQuestion("")
            setDisplayWarning(false)
            setDisplaySuccess(true)
        } else {
            setDisplayWarning(true)
            setDisplaySuccess(false)
        }
    }
    return (
        <div className="card mt-3">

            <div className="card-header">
                Ask a question to the admin
            </div>
            <div className="card-body">
                <form method="POST">
                    {displayWarning &&
                        <div className="alert alert-danger" role="alert">
                            All fields must be filled out
                        </div>
                    }
                    {displaySuccess &&
                        <div className="alert alert-success" role="alert">
                            Question added successfully
                        </div>
                    }
                    <div className="mb-3">
                        <label className="form-label"> Title</label>
                        <input
                            type="text"
                            className="form-control"
                            id="exampleFormControlInput1"
                            placeholder="Title"
                            onChange={e => setTitle(e.target.value)}
                            value={title}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label"> Question</label>
                        <textarea
                            className="form-control"
                            id="exampleFormControlTextarea1"
                            placeholder="Question"
                            onChange={e => setQuestion(e.target.value)}
                            value={question}
                            rows={3}
                        />
                    </div>
                    <div>
                        <button type="button" className="btn btn-primary mt-3" onClick={submitNewQuestion}>
                            Submit Question
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}