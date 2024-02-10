import { useEffect, useRef } from "react";
import { useOktaAuth } from '@okta/okta-react'
import OktaSignIn from '@okta/okta-signin-widget'
import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css'
import { oktaConfig } from "../lib/OktaConfig";


const OktaSignInWidget = ({ onSuccess, onError }) => {
    const widgetRef = useRef()

    useEffect(() => {
        if (!widgetRef.current) return false;

        const widget = new OktaSignIn(oktaConfig);

        widget.showSignInToGetTokens({
            el: widgetRef.current,
        }).then(onSuccess).catch(onError)

    },[onSuccess,onError])

    return (
        <div className="container mt-5 mb-5">
            <div ref={widgetRef}></div>
        </div>
    )

}

export default OktaSignInWidget;