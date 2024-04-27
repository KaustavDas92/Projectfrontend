import React, { useEffect, useState } from "react"
import { useOktaAuth } from "@okta/okta-react"
import MessagesModel from "../../../models/MessagesModel"
import { SpinnerLoading } from "../../../utils/SpinnerLoading"
import Constants from '../../../utils/Constants.json';
import { Pagination } from "../../../utils/Pagination";
import { AdminMessage } from "./AdminMessage";
import AdminMessageRequest from "../../../models/AdminMessageRequest";


export const AdminMessages= () =>{
    
    const {authState} = useOktaAuth()

    // normal loading pieces
    const [isLoadingMessages, setIsLoadingMessages] = useState(true)
    const [httpError, setHttpError] = useState(null)

    //messages
    const [messages, setMessages] = useState<MessagesModel[]>([])
    
    //pagination
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [messagesPerPage,setMessagesPerPage]= useState(5)

    const [btnSubmit,setBtnSubmit] = useState(false)


    useEffect (()=>{

        let url:string=""
        const fetchMessages = async () => {
            if(authState && authState.isAuthenticated && authState.accessToken?.claims.userType === 'admin'){
                url = Constants.API_URL + Constants.Messages + Constants.SearchMessagesByClosed +
                    `?closed=false&page=${currentPage - 1}&size=${messagesPerPage}`;

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
                setMessages(data._embedded.messages)
                setTotalPages(data.page.totalPages)
            }
            setIsLoadingMessages(false)   
        }
        fetchMessages().catch((error:any) =>{
            setIsLoadingMessages(false)
            setHttpError(error.message)
        })
        window.scrollTo(0, 0)

    },[authState,currentPage,btnSubmit])

    const submitResponseToQuestion = async(id:number,adminResponse:string) =>{

        if(authState && authState.isAuthenticated && id != null && adminResponse !== "") {

            const url: string = Constants.API_URL + Constants.Messages + Constants.Secure + Constants.AdminMessageResponse 
            const adminMessageRequestModel:AdminMessageRequest= new AdminMessageRequest(id,adminResponse)
            const requestOptions = {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authState?.accessToken?.accessToken}`
                },
                body: JSON.stringify(adminMessageRequestModel)
            }
            const response = await fetch(url, requestOptions);
            if (!response.ok) {
                throw new Error("Something went wrong");
            }
            setBtnSubmit(!btnSubmit)
        }
    }

    if(isLoadingMessages){
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

    const paginate = (pageNumber:number) => setCurrentPage(pageNumber)

    return (
        <div className="mt-5">
            {messages.length > 0 ? 
            
                <>
                 {messages.map((message) =>(
                    // <p>Questions that need response</p>
                    <AdminMessage message={message} key={message.id} submitResponseToQuestion={submitResponseToQuestion}/>
                 ))}
                </>
                :
                <h5>No Pending Q/A</h5>
        }

        {totalPages >1 && <Pagination totalPages={totalPages} currentPage={currentPage} paginate={paginate}/>}
        </div>
    )
}