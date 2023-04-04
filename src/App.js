import './App.css';
import {dateFormatter, dateInputFormatter} from '../src/pages/helper';
import { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { doc, setDoc, getFirestore, onSnapshot, collection, updateDoc, query, where, getDoc, getDocs, orderBy} from "firebase/firestore"; 

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

  const defaultRecord = (
    <tr>
      <td>No Records yet</td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
  );

  const [fees, setFees] = useState("");
  const [date, setDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [updateFees, setUpdateFees] = useState("");
  const [updateDate, setUpdateDate] = useState("");
  const [updateRemark, setUpdateRemark] = useState("");
  const [parkingFeesRecords, setParkingFeesRecords] = useState(defaultRecord);
  const [isRead, setIsRead] = useState(false);
  const [currentEditID, setCurrentEditID] = useState("");
  const [totalAmount, setTotalAmount] = useState(0.00);
  const [averageAmount, setAverageAmount] = useState(0.00);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [totalDays, setTotalDays] = useState(0);

  const handleSubmit = async () => {
    console.log(fees, date, remarks);
    // Add a new document in collection "cities"
    var uuid = crypto.randomUUID();
    await setDoc(doc(db, "parkingFeesRecords", uuid), {
      fees: fees,
      date: date,
      remarks: remarks,
      deletedAt: ""
    });
  };

  const readRecords = () => {
    onSnapshot(query(collection(db, "parkingFeesRecords"), where("deletedAt", "==", ""), orderBy("date")), (querySnapshot) => {
      var loopCount = 0;
      const array = [];
      var subTotal = 0;

      querySnapshot.forEach((doc) => {

        loopCount++;
        subTotal = subTotal + parseFloat(doc.data().fees);

        const record = (
          <tr>
            <td>{loopCount}</td>
            <td>{dateFormatter(doc.data().date)}</td>
            <td>{doc.data().fees}</td>
            <td>{doc.data().remarks}</td>
            <td>
              <button className='btn btn-success mr-1' data-toggle="modal" data-target="#editModal" onClick={() => {readExistingRecord(doc.id)}}>Edit</button>
              <button className='btn btn-danger' onClick={() => {deleteRecord(doc.id)}}>Delete</button>
            </td>
          </tr>
        );

        array.push(record);

      });

      setTotalAmount(subTotal.toFixed(2));
      setAverageAmount((subTotal/loopCount).toFixed(2))
      setParkingFeesRecords(array);
      setTotalDays(loopCount);
    });
  };

  const readExistingRecord = async(id) => {
    const docRef = doc(db, "parkingFeesRecords", id);
    const docSnap = await getDoc(docRef);

    setCurrentEditID(id);

    if (docSnap.exists()) {

      //Set Data
      setUpdateFees(docSnap.data().fees);
      setUpdateDate(docSnap.data().date);
      setUpdateRemark(docSnap.data().remarks);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }

  };

  const updateRecord = async (id) => {
      // Create an initial document to update.
      const DocRef = doc(db, "parkingFeesRecords", id);

      await updateDoc(DocRef, {
          fees: updateFees,
          date: Date(updateDate),
          remarks: updateRemark,
      });
  };

  const deleteRecord = async (id) => {

    if (window.confirm("Do you want to delete this record??")) {
      // Create an initial document to update.
      const DocRef = doc(db, "parkingFeesRecords", id);
      await updateDoc(DocRef, {
          deletedAt: Date()
      });
    }

  };

  const filterRecord = async () =>{

    if(fromDate !== "" || toDate !== ""){

      var q;

      if(fromDate !== "" && toDate !== ""){
        q = query(collection(db, "parkingFeesRecords"), where("date", ">=", fromDate), where("date", "<=", toDate), where("deletedAt", "==", ""), orderBy("date"));
      }
      else if(fromDate !== "" && toDate === ""){
        q = query(collection(db, "parkingFeesRecords"), where("date", ">=", fromDate), where("deletedAt", "==", ""), orderBy("date"));
      }
      else if(fromDate === "" && toDate !== ""){
        q = query(collection(db, "parkingFeesRecords"), where("date", "<=", toDate), where("deletedAt", "==", ""), orderBy("date"));
      }

      const querySnapshot = await getDocs(q);
      var loopCount = 0;
      const array = [];
      var subTotal = 0;

      querySnapshot.forEach((doc) => {
        loopCount++;

        subTotal = subTotal + parseFloat(doc.data().fees);
        const record = (
          <tr>
            <td>{loopCount}</td>
            <td>{dateFormatter(doc.data().date)}</td>
            <td>{doc.data().fees}</td>
            <td>{doc.data().remarks}</td>
            <td>
              <button className='btn btn-success mr-1' data-toggle="modal" data-target="#editModal" onClick={() => {readExistingRecord(doc.id)}}>Edit</button>
              <button className='btn btn-danger' onClick={() => {deleteRecord(doc.id)}}>Delete</button>
            </td>
          </tr>
        );

        array.push(record);

      });

      setTotalAmount(subTotal.toFixed(2));
      setAverageAmount((subTotal/loopCount).toFixed(2))
      setParkingFeesRecords(array);
      setTotalDays(loopCount);
    }
  }

  useEffect(() => {
    if(!isRead){
      readRecords();
      setIsRead(true);
    }
  });

  return (
    <div className="App">
      <div className='content-container'>
        <div className="fees-form-container bg-light rounded mb-3">

          <div className="form-group">
            <label>Fees</label>
            <input type="number" className="form-control" onChange={(e) => {setFees(e.currentTarget.value)}} />
          </div>

          <div className="form-group">
            <label>Date</label>
            <input type="date" className='form-control' onChange={(e) => {setDate(e.currentTarget.value); console.log(e.currentTarget.value);}}/>
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
          <table className="table table-bordered bg-light" id='record-table'>
            <thead className='thead-dark'>
              <tr>
              <th scope="col">No</th>
                <th scope="col">Date</th>
                <th scope="col">Fees</th>
                <th scope="col">Remarks</th>
                <th scope="col">Action</th>
              </tr>
            </thead>

            <tbody>
              {parkingFeesRecords.length === 0 && 
                <tr>
                  <th>-</th>
                  <th>-</th>
                  <th>-</th>
                  <th>-</th>
                  <th>No Record</th>
                </tr>
              }
              {parkingFeesRecords}
            </tbody>
          </table>
        </div>

        <div className="price-analysis-container bg-light rounded ml-3">
          <div className='form-inline mb-3'>
            <div className='mr-3 form-group'>
              <label>Total Amount (RM):</label>
            </div>

            <div className='form-group'>
              <input type="text" className='form-control' readOnly value={totalAmount}/>
            </div>
          </div>

          <div className='form-inline mb-3'>
            <div className='mr-3 form-group'>
              <label>Average Amount (RM):</label>
            </div>

            <div className='form-group'>
              <input type="text" className='form-control' readOnly value={averageAmount}/>
            </div>
          </div>

          <div className='form-inline mb-3'>
            <div className='mr-3 form-group'>
              <label>Total Days:</label>
            </div>

            <div className='form-group'>
              <input type="text" className='form-control' readOnly value={totalDays}/>
            </div>
          </div>


          <div className='mt-3'>
            <strong>Filter</strong>
          </div>

          <div className='form-inline mb-3'>
            <div className='mr-3 form-group'>
              <label>Start From:</label>
            </div>

            <div className='form-group'>
              <input type="date" className='form-control' onChange={(e) => {setFromDate(e.currentTarget.value); console.log(e.currentTarget.value);}}/>
            </div>
          </div>
          
          <div className='form-inline mb-3'>
            <div className='mr-3 form-group'>
              <label>To:</label>
            </div>

            <div className='form-group'>
              <input type="date" className='form-control' onChange={(e) => {setToDate(e.currentTarget.value); console.log(e.currentTarget.value);}}/>
            </div>
          </div>

          <div className='mt-3'>
            <button className='btn btn-primary' onClick={filterRecord}>Submit</button>
          </div>
        </div>
      </div>

    {/* Modal */}
    <div className="modal fade" id="editModal" tabIndex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Update Record</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div className="modal-body">
            <div className="form-group">
              <label>Fees</label>
              <input type="number" className="form-control" onChange={(e) => {setUpdateFees(e.currentTarget.value)}} defaultValue={updateFees}/>
            </div>

            <div className="form-group">
              <label>Date</label>
              <input type="date" id="test-date" className='form-control' onChange={(e) => {setUpdateDate(e.currentTarget.value)}} value={dateInputFormatter(updateDate)}/>
            </div>

            <div className="form-group">
              <label>Remarks:</label>
              <textarea className="form-control" rows="5" onChange={(e) => {setUpdateRemark(e.currentTarget.value)}} 
              defaultValue={updateRemark}
              data-value={updateRemark}
              ></textarea>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => {updateRecord(currentEditID)}}>Save changes</button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default App;
