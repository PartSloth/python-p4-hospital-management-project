import { useOutletContext } from "react-router-dom";
import DoctorCard from "./DoctorCard";
import { useState } from "react";

function Doctors() {
    const {doctors, setDoctors} = useOutletContext();
    const [isUpdating, setIsUpdating] = useState(false);

    //Post form states
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastname] = useState("");
    const [npi, setNPI] = useState("");
    const [gender, setGender] = useState("");
    const [field, setField] = useState("");
    
    //Pop-up form
    function handleToggleForm() {
        setIsUpdating(!isUpdating)
    }

    //Form data
    function handleFormInput(event) {
        const field = event.target.name;
        let input = event.target.value;
        if(field === "firstName") {
            setFirstName(input)
        } else if(field === "lastName") {
            setLastname(input)
        } else if(field === "gender") {
            setGender(input)
        } else if(field === "npi") {
            setNPI(input)
        } else {
            setField(input)
        }
    }

    function handleAddSubmit(event) {
        event.preventDefault()
        fetch("http://127.0.0.1:5555/doctors", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName,
                field: field,
                gender: gender,
                npi: npi
            })
        })
        .then(res => res.json())
        .then(newDoctor => {
            setDoctors([...doctors, newDoctor])
            clearForm()
        })
    }

    function clearForm() {
        setFirstName("")
        setLastname("")
        setField("")
        setGender("")
        setNPI("")
    }


    return(
        <>
        <h1>Doctor Index</h1>
        <button className="open-button" onClick={handleToggleForm}>Add New Doctor</button>
            {isUpdating ? (
                <div className="form-popup" id="doctorForm" onSubmit={handleAddSubmit}>
                <form class="form-container">
                    <label>First Name</label>
                    <input type="text" placeholder="First Name" name="firstName" value={firstName} onChange={handleFormInput} required/>

                    <label>Last Name</label>
                    <input type="text" placeholder="Last Name" name="lastName" value={lastName} onChange={handleFormInput} required/>

                    <label>NPI#</label>
                    <input type="text" placeholder="NPI" name="npi" value={npi} onChange={handleFormInput} required/>

                    <label>Field</label>
                    <input type="text" placeholder="Field" name="field" value={field} onChange={handleFormInput} required/>

                    <label>Gender</label>
                    <input type="text" placeholder="Gender" name="gender" value={gender} onChange={handleFormInput} required/>

                    <button type="submit" className="btn">Add</button>
                    <button type="button" className="btn cancel" onClick={handleToggleForm}>Cancel</button>
                </form>
            </div>
            ) : ("")}
        {doctors.map(doctor => <DoctorCard key={doctor.id} doctor={doctor}/>)}
        </>
    )
}

export default Doctors;