import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, onSnapshot, collection, updateDoc, query, where, getDoc, getDocs, orderBy} from "firebase/firestore"; 
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

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
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

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
