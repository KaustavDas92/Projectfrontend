import { useOktaAuth } from "@okta/okta-react";
import React, { useEffect, useState } from "react";
import { SpinnerLoading } from "../../utils/SpinnerLoading";
import Constants from '../../utils/Constants.json';
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Link } from "react-router-dom";
import PaymentInforRequest from "../../models/PaymentInfoRequest";


export const PaymentPage = () => {
    const { authState } = useOktaAuth();

    const [loadingFees, setLoadingFees] = useState(true)
    const [httpError, setHttpError] = useState(null)

    const [submitDisabled, setSubmitDisabled] = useState(false)
    const [fees, setFees] = useState(0)

    const elements = useElements()
    const stripe = useStripe()

    useEffect(() => {

        const fetchFees = async () => {
            if (authState && authState.isAuthenticated) {
                const url: string = Constants.API_URL + Constants.Payment + Constants.SearchPaymentByEmail + `?userEmail=${authState?.accessToken?.claims.sub}`
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
                const response = await fetch(url, requestOptions)
                if (!response.ok) {
                    throw new Error("Something went wrong");
                }
                const responseJson = await response.json();
                console.log("responseJson=", responseJson)
                setFees(responseJson.amount)
            }
            setLoadingFees(false)
        }
        fetchFees().catch((error: any) => {
            setLoadingFees(false)
            setHttpError(error.message)
        })
    }, [authState])


    const checkoutFees = async () => {
        if (!stripe || !elements || !elements.getElement(CardElement)) {
            return
        }
        setSubmitDisabled(true)
        let paymentInfo = new PaymentInforRequest(Math.round(fees * 100), 'INR', authState?.accessToken?.claims.sub)

        const url = Constants.API_URL + Constants.Payment + Constants.Secure + Constants.PaymentIntent;
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`
            },
            body: JSON.stringify(paymentInfo)
        }

        const response = await fetch(url, requestOptions);
        if (!response.ok) {
            // setHttpError(true)
            setSubmitDisabled(false)
            throw new Error('Something went wrong')
        }
        const responseJson = await response.json();
        console.log("stripe response json=", responseJson)

        stripe
            .confirmCardPayment(responseJson.client_secret, {
                payment_method: {
                    card: elements.getElement(CardElement)!,
                    billing_details: {
                        email: authState?.accessToken?.claims.sub,
                    },
                },
            })
            .then(async (result) => {
                // Handle result.error or result.paymentIntent

                if(result.error){
                    setSubmitDisabled(false)
                    alert("There was an error in processing payment")
                }
                else {
                    const url=Constants.API_URL + Constants.Payment + Constants.Secure + Constants.PaymentComplete
                    const requestHeader ={
                        method:'PUT',
                        headers:{
                            'Content-Type':'application/json',
                            Authorization:`Bearer ${authState?.accessToken?.accessToken}`
                        }
                    }

                    const response = await fetch(url,requestHeader)
                    if(!response.ok){
                        setSubmitDisabled(false)
                        throw new Error('Something went wrong')
                    }
                    setFees(0)
                    setSubmitDisabled(false)
                }
            });
            // setHttpError(false)
    }


    if (loadingFees) {
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

        <div>
            {authState && authState.isAuthenticated ?

                <div className="container">
                    {fees > 0 && <div className="card mt-3">
                        <h5 className="card-header">Fees Pending: <span className="text-danger">&#8377; {fees}</span></h5>
                        <div className="card-body">
                            <h5 className="card-title mb-3"> Credit Card</h5>
                            <CardElement id="card-element" />
                            <button disabled={submitDisabled} type='button'
                                className="btn btn-md main-color text-white mt-3" onClick={checkoutFees}>
                                Pay fees
                            </button>
                        </div>
                    </div>
                    }

                    {fees == 0 &&
                        <div className="mt-3">
                            <h5> You have no fees</h5>
                            <Link type="button" className="btn main-color text-white" to='/search'>Explore Top Books</Link>
                        </div>
                    }
                    {submitDisabled && <SpinnerLoading />}
                </div>
                :
                <div className="d-flex justify-content-center mt-5">
                    <Link className="btn main-color btn-lg text-white" to="/login">Login</Link>
                </div>
            }
        </div>
    )
}