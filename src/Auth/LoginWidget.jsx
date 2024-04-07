import React from 'react'
import {useNavigate} from 'react-router-dom'
import {useOktaAuth } from'@okta/okta-react'
import { SpinnerLoading } from '../utils/SpinnerLoading';
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
            <SpinnerLoading/>
        )
    }

    const go_to_home=() =>{
         navigate('/')
        
    }

    return (
        <div>
            {
            authState.isAuthenticated?
                {go_to_home}
                :
                <OktaSignInWidget onSuccess={onSuccess} onError={onError}/>
            }
        </div>
    ) 
}

export default LoginWidget;