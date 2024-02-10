import React from 'react'
import {useNavigate} from 'react-router-dom'
import {useOktaAuth } from'@okta/okta-react'
import { SpinnderLoading } from '../utils/SpinnerLoading';
import OktaSignInWidget from './SignInWidget';


const LoginWidget=({config}) =>{
    const {oktaAuth,authState}=useOktaAuth();
    
    const onSuccess=(tokens) =>{
        oktaAuth.handleLoginRedirect(tokens)
    }

    const navigate=useNavigate();
    
    const onError=(err) =>{
        console.log("Sign in error",err)
    }

    if(!authState){
        return (
            <SpinnderLoading/>
        )
    }

    const go_to_home=() =>{
        navigate('/')
    }

    return authState.isAuthenticated ?
        {go_to_home}
        :
        <OktaSignInWidget config={config} onSuccess={onSuccess} onError={onError}/>
}

export default LoginWidget;