import React from 'react'
import { Link } from 'react-router-dom'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '../database/firebase'
import { useDispatch } from 'react-redux'
import { userLogin } from '../slice/userSlice'
import { useNavigate } from 'react-router-dom';

export default function Home() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const provider = new GoogleAuthProvider();

    const onGoogleLogin =()=> {

        
        signInWithPopup(auth, provider)

            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                // IdP data available using getAdditionalUserInfo(result)
                // ...
                console.log(user.email, user.displayName);

                dispatch(userLogin({
                    name : user.displayName,
                    email : user.email,
                    uid : user.uid,
                    photo : user.photoURL
                }))

                
                // 세션 스토리지에 값 저장하기;
                // 그 값을 문자로 만들어서 저장
                const userData = {
                    name : user.displayName,
                    email : user.email,
                    uid : user.uid,
                    photo : user.photoURL
                };
                sessionStorage.setItem('user', JSON.stringify(userData))

                navigate('/')

            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
            });
            // navigate('/books')
    }

    return (
        <div>
            <h3>Home</h3>
            <Link to='/books'>Reading Books</Link>
            <br />
            <br />
            <button onClick={onGoogleLogin}>구글로그인</button>
        </div>
    )
}
