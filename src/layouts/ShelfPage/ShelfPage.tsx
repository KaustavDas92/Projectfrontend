import React,{useState,useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import { useOktaAuth } from "@okta/okta-react";
import { Loans } from "./Conponents/Loans";
import { History } from "./Conponents/History";

const ShelfPage= () =>{
    const { authState } = useOktaAuth()

    const [historyClick,setHistoryClick] =useState(false)

    return(
       <div className="container">
        {authState && authState.isAuthenticated ?
        
            <div className="mt-3">
                <nav>
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                        <button 
                            className="nav-link active"
                            id="nav-loans-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#nav-loans"
                            type="button"
                            role="tab"
                            aria-controls="nav-loans"
                            aria-selected="true"
                            onClick={() => setHistoryClick(false)}
                            > 
                            
                            Loans
                        </button>
                        <button 
                            className="nav-link"
                            id="nav-history-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#nav-history"
                            type="button"
                            role="tab"
                            aria-controls="nav-history"
                            aria-selected="false"
                            onClick={() => setHistoryClick(true)}

                            > 

                            Your History
                        </button>
                    </div>
                </nav>
                <div className="tab-content" id="nav-tabContent">
                    <div className="tab-pane fade show active" id="nav-loans" role="tabpanel"
                        aria-labelledby="nav-loans-tab">

                            <Loans/>
                    </div>
                    <div className="tab-pane fade" id="nav-history" role="tabpanel"
                        aria-labelledby="nav-history-tab">

                          {historyClick?<History/>:<></>}
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

export default ShelfPage;