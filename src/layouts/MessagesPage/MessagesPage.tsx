import { useOktaAuth } from "@okta/okta-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PostNewMessage } from "./components/PostNewMessage";
import { Messages } from "./components/Messages";

export const MessagesPage = () => {
    const { authState } = useOktaAuth();

    const [messagesClick, setMessagesClick] = useState(false)
    return (
        <div>
            {authState && authState.isAuthenticated ?
                <div className="container">
                    <div className="mt-3 mb-2">
                        <nav>
                            <div className="nav nav-tabs" id="nav-tab" role='tablist'>
                                <button onClick={() => setMessagesClick(false)}
                                    className="nav-link active"
                                    id="nav-send-message-tab"
                                    data-bs-toggle='tab'
                                    data-bs-target="#nav-send-message"
                                    type="button"
                                    role="tab"
                                    aria-controls="nav-send-message"
                                    aria-selected='true'>
                                    Submit Question

                                </button>
                                <button onClick={() => setMessagesClick(true)}
                                    className="nav-link"
                                    id="nav-message-tab"
                                    data-bs-toggle='tab'
                                    data-bs-target="#nav-message"
                                    type="button"
                                    role="tab"
                                    aria-controls="nav-message"
                                    aria-selected='true'>
                                    Q/A Response/Pending

                                </button>
                            </div>
                        </nav>
                        <div className="tab-content" id="nav-tabContent">
                            <div className="tab-pane fade show active"
                                id="nav-send-message"
                                role="tabpanel"
                                aria-labelledby="nav-send-message-tab">
                                <PostNewMessage/>
                            </div>
                            <div className="tab-pane fade"
                                id="nav-message"
                                role="tabpanel"
                                aria-labelledby="nav-message-tab">
                                {messagesClick ? <Messages /> : <></>}
                            </div>
                        </div>
                    </div>
                </div>
                :
                <div className="d-flex justify-content-center mt-5">
                    <Link className="btn main-color btn-lg text-white" to="/login">Login</Link>
                </div>
            }

        </div>
    )
}