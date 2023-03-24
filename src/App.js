import './App.css';
import { useState } from 'react';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore"; 

function App() {
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

  const [fees, setFees] = useState("");
  const [date, setDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [parkingFeesRecords, setParkingFeesRecords] = useState("");

  const handleSubmit = async () => {
    console.log(fees, date, remarks);
    // Add a new document in collection "cities"
    var uuid = crypto.randomUUID();
    await setDoc(doc(db, "parkingFeesRecords", uuid), {
      fees: fees,
      date: Date(date),
      remarks: remarks
    });
  };

  return (
    <div className="App">
      <div className='content-container'>
        <div className="fees-form-container bg-light rounded">

          <div className="form-group">
            <label>Fees</label>
            <input type="number" className="form-control" onChange={(e) => {setFees(e.currentTarget.value)}} />
          </div>

          <div className="form-group">
            <label>Date</label>
            <input type="date" className='form-control' onChange={(e) => {setDate(e.currentTarget.value)}}/>
          </div>

          <div className="form-group">
            <label>Remarks:</label>
            <textarea className="form-control" rows="5" onChange={(e) => {setRemarks(e.currentTarget.value)}}></textarea>
          </div>

          <div className='form-group text-center'>
            <button className='btn btn-primary' onClick={handleSubmit}>Submit</button>
          </div>

        </div>

        <div className='calender-container ml-3'>
          <table className="table table-bordered bg-light">
            <thead className='thead-dark'>
              <tr>
              <th scope="col">No</th>
                <th scope="col">Date</th>
                <th scope="col">Fees</th>
                <th scope="col">Remarks</th>
              </tr>
            </thead>

            <tbody>
              
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default App;
