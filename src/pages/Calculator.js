import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, onSnapshot, collection, updateDoc, query, where, getDoc, getDocs, orderBy} from "firebase/firestore"; 
import {dateFormatter, dateInputFormatter, getCookie} from '../pages/helper';
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

export function Calculator(){
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
    const auth = getAuth();
    const navigate = useNavigate();
    
    const [fees, setFees] = useState("");
    const [date, setDate] = useState("");
    const [remarks, setRemarks] = useState("");
    const [updateFees, setUpdateFees] = useState("");
    const [updateDate, setUpdateDate] = useState("");
    const [updateRemark, setUpdateRemark] = useState("");
    const [parkingFeesRecords, setParkingFeesRecords] = useState([]);
    const [isRead, setIsRead] = useState(false);
    const [currentEditID, setCurrentEditID] = useState("");
    const [totalAmount, setTotalAmount] = useState(0.00);
    const [averageAmount, setAverageAmount] = useState(0.00);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [totalDays, setTotalDays] = useState(0);
    const [completeRecords, setCompleteRecords] = useState("");
    const [pagination, setPagination] = useState([]);
    const [prev, setPrev] = useState(1);
    const [next, setNext] = useState(1);
    const [maxPage, setMaxPage] = useState(1);
    const [userInfo, setUserInfo] = useState({email: "", uid: ""});
    var loopCount = 0;

    const handleSubmit = async () => {
        console.log(fees, date, remarks);  
        var randomID = crypto.randomUUID();
        const userCollection = collection(db, "parkingFeesRecords" , userInfo.uid, "fees")
        const userDoc = doc(userCollection, randomID);

        // Add a new document in collection "cities"
        await setDoc(userDoc, {
            fees: fees,
            date: date,
            remarks: remarks,
            deletedAt: ""
        });

        setIsRead(false);
    };

    const readRecords = () => {

        const userUID = getCookie("parkingFeesUID");

        onSnapshot(query(collection(db, "parkingFeesRecords", userUID, "fees"), where("deletedAt", "==", ""), orderBy("date")), (querySnapshot) => {
            var loopCount = 0;
            const array = [];
            const completeArr = [];
            const paginationArr = [];
            var subTotal = 0;
            var paginationCount = 0;
            const currentPageStorage = localStorage.getItem("currentPage") === null ? 1 : localStorage.getItem("currentPage");

            // pagination.splice(0, pagination.length);

            querySnapshot.forEach((doc) => {
                loopCount++;
                subTotal = subTotal + parseFloat(doc.data().fees);

                const record = {
                    id: doc.id,
                    date : dateFormatter(doc.data().date),
                    fees: doc.data().fees,
                    remarks: doc.data().remarks,
                }

                if(loopCount <= 5){
                    array.push(record);
                }

                if(loopCount % 5 === 1){
                    paginationCount++;                   
                    paginationArr.push(paginationCount);
                    const maxPagCount = paginationCount;
                    setMaxPage(maxPagCount);
                }

                completeArr.push(record);
            });

            setPagination(paginationArr)

            if(loopCount > 5){
                setNext(2);
            }

            setTotalAmount(subTotal.toFixed(2));
            setAverageAmount((subTotal/loopCount).toFixed(2))
            setParkingFeesRecords(array);
            setTotalDays(loopCount);
            setCompleteRecords(completeArr);
        })
    };

    const readExistingRecord = async(id) => {
        const userUID = getCookie("parkingFeesUID");
        const userCollection = collection(db, "parkingFeesRecords" , userUID, "fees")
        const userDoc = doc(userCollection, id);

        const docSnap = await getDoc(userDoc);

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
        const userUID = getCookie("parkingFeesUID");
        const userCollection = collection(db, "parkingFeesRecords" , userUID, "fees")
        const userDoc = doc(userCollection, id);

        await updateDoc(userDoc, {
            fees: updateFees,
            date: updateDate,
            remarks: updateRemark,
        });
    };

    const deleteRecord = async (id) => {

    if (window.confirm("Do you want to delete this record??")) {
        // Create an initial document to update.
        const userCollection = collection(db, "parkingFeesRecords" , userInfo.uid, "fees")
        const userDoc = doc(userCollection, id);
        await updateDoc(userDoc, {
            deletedAt: Date()
        });
    }

    };


    const filterRecord = async () =>{

    if(fromDate !== "" || toDate !== ""){

        var q;
        const userUID = getCookie("parkingFeesUID");
        const userCollection = collection(db, "parkingFeesRecords", userUID, "fees");

        if(fromDate !== "" && toDate !== ""){
        q = query(userCollection, where("date", ">=", fromDate), where("date", "<=", toDate), where("deletedAt", "==", ""), orderBy("date"));
        }
        else if(fromDate !== "" && toDate === ""){
        q = query(userCollection, where("date", ">=", fromDate), where("deletedAt", "==", ""), orderBy("date"));
        }
        else if(fromDate === "" && toDate !== ""){
        q = query(userCollection, where("date", "<=", toDate), where("deletedAt", "==", ""), orderBy("date"));
        }

        const querySnapshot = await getDocs(q);
        var loopCount = 0;
        const array = [];
        const completeArr = [];
        const paginationArr = [];
        var subTotal = 0;
        var paginationCount = 0;

        querySnapshot.forEach((doc) => {
            loopCount++;

            subTotal = subTotal + parseFloat(doc.data().fees);

            const record = {
                id: doc.id,
                date : dateFormatter(doc.data().date),
                fees: doc.data().fees,
                remarks: doc.data().remarks,
            }

            if(loopCount <= 5){
                array.push(record);
            }

            if(loopCount % 5 === 1){
                paginationCount++;
                paginationArr.push(paginationCount);
                const maxPagCount = paginationCount;
                setMaxPage(maxPagCount);
            }

            if(loopCount > 5){
                setNext(2);
            }

            completeArr.push(record);
        });

        setPagination(paginationArr);
        setTotalAmount(subTotal.toFixed(2));
        setAverageAmount((subTotal/loopCount).toFixed(2))
        setParkingFeesRecords(array);
        setTotalDays(loopCount);
        setCompleteRecords(completeArr);
    }
    }
    
    const paging = (index) =>{
        const array = [];
        index = parseInt(index);
        localStorage.setItem("currentPage", index);

        //Set pagination index
        const preIndex = index === 1 ? 1 : index - 1;
        setPrev(preIndex);

        const nextIndex = index === maxPage ? maxPage : index + 1;
        setNext(nextIndex);

        //Make option selected
        document.getElementById("pagination-" + index).selected = "true";

        index = (index - 1) * 5;

        for(var i = index; i < index + 5; i++){

            if(i < completeRecords.length){
                array.push(completeRecords[i]);
            }

        }

        setParkingFeesRecords(array);
    }

    useEffect(() => {
        if(userInfo.email === ""){
            onAuthStateChanged(auth, (user) => {
                if (!user) {
                    navigate("/", { replace: true});
                }
                else{
                    const info = {email : user.email, uid: user.uid};
                    setUserInfo(info);
                }
            });
        }


        if(!isRead){
            readRecords();
            setIsRead(true);
        }
    });


    return(
        <div className="p-3">
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
                    
                    {
                        parkingFeesRecords.map((record, index) => {
                            loopCount++;
                            return(
                                <tr id={"record-row-" + loopCount} key={index}>
                                    <td>{loopCount}</td>
                                    <td>{dateFormatter(record.date)}</td>
                                    <td>{record.fees}</td>
                                    <td>{record.remarks}</td>
                                    <td>
                                        <button className='btn btn-success mr-1' data-toggle="modal" data-target="#editModal" onClick={() => {readExistingRecord(record.id)}}>Edit</button>
                                        <button className='btn btn-danger' onClick={() => {deleteRecord(record.id)}}>Delete</button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>

                {/* Pagination */}
                <nav aria-label="Page navigation example">
                    <ul className="pagination">
                    <li className="page-item">
                        <span className="page-link" aria-label="Previous" onClick={() => {paging(prev)}}>
                        <span aria-hidden="true">&laquo;</span>
                        </span>
                    </li>
                    <select className='form-control' style={{width: "70px"}} onChange={(e) => {paging(e.currentTarget.value)}}>
                        {
                            pagination.map((page, index) => {

                                return(
                                    <option value={page} id={"pagination-" + page} key={index}>{page}</option>
                                )
                            })
                        
                        }
                    </select>
                    <li className="page-item">
                        <span className="page-link" aria-label="Next" onClick={() => {paging(next)}}>
                        <span aria-hidden="true">&raquo;</span>
                        </span>
                    </li>
                    </ul>
                </nav>
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
                            <input type="number" className="form-control" onChange={(e) => {setUpdateFees(e.currentTarget.value)}} value={updateFees}/>
                            </div>

                            <div className="form-group">
                            <label>Date</label>
                            <input type="date" id="test-date" className='form-control' onChange={(e) => {setUpdateDate(e.currentTarget.value)}} value={dateInputFormatter(updateDate)}/>
                            </div>

                            <div className="form-group">
                            <label>Remarks:</label>
                            <input className="form-control" type="text" onChange={(e) => {setUpdateRemark(e.currentTarget.value)}}  value={updateRemark} />
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