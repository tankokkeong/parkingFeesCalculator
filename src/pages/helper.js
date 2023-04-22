import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDD_5UWM8lLsV2mnNP-KzDXRsV5Zhf00aU",
    authDomain: "react-ecommerce-b9a25.firebaseapp.com",
    projectId: "react-ecommerce-b9a25",
    storageBucket: "react-ecommerce-b9a25.appspot.com",
    messagingSenderId: "81866203071",
    appId: "1:81866203071:web:36d7b1000f89c216d94b0a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const dateFormatter = (dateInput) =>{
    var date = new Date(dateInput);

    var months_array = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    // Get date, month, and year
    var day = date.getDate(); 
    var month = months_array[date.getMonth()];
    var year = date.getFullYear();

    return day + "/" +  month + "/" + year;
};

export const dateInputFormatter = (dateInput) =>{
    var date = new Date(dateInput);

    // Get date, month, and year
    var day = date.getDate(); 
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    return year + "-" + checkTime(month) + "-" + checkTime(day);
};

export const authentication = async (email, password) =>{

    const auth = getAuth();
    var message = new Object();

    await signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        message.uid = userCredential.user.uid;
        message.email = userCredential.user.email;
        // ...
    })
    .catch((error) => {
        message.code = error.code;
        message.message = error.message;
        // ..
    });

    return message;
}

function checkTime(i)
{
    if(i<10)
    {
        i="0"+i;
    }
    return i;
}

export const setCookie = (cname, cvalue, exdays) => {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export const getCookie = (cname) => {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
        }
    }
    return "";
}