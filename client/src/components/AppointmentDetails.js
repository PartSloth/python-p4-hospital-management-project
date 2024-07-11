import { useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";

function AppointmentDetails() {
    const {appointments, setAppointments, doctors} = useOutletContext();
    const {id} = useParams();
    const [appointment, setAppointment] = useState();
    const navigate = useNavigate();
    const [isUpdating, setIsUpdating] = useState(false);
    
    //Update form states
    const [date, setDate] = useState("")
    const [hour, setHour] = useState("")
    const [reason, setReason] = useState("")
    const [doctor, setDoctor] = useState("")

    useEffect(() => {
        fetch(`http://127.0.0.1:5555/appointments/${id}`)
        .then(res => res.json())
        .then(appointment => setAppointment(appointment))
    }, [])

    function generateTime(hour) {

        if (parseInt(hour) <= 12) {
            return hour + ":00AM"
        } else {
            return hour - 12 + ":00PM"
        }
    }

    //Pop-up form
    function handleToggleForm() {
        setIsUpdating(!isUpdating)
    }

    //Form data
    function handleFormInput(event) {
        const field = event.target.name;
        let input = event.target.value;
        if(field === "date") {
            setDate(input)
        } else if(field === "hour") {
            setHour(input)
        } else if(field === "reason") {
            setReason(input)
        } else {
            setDoctor(input)
        }
    }

    function handleUpdate() {
        fetch(`http://127.0.0.1:5555/appointments/${id}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                date: date,
                hour: hour,
                reason: reason,
                doctor_id: doctor
            })
        })
        .then(res => res.json())
        .then(res => console.log(res))
    }

    function handleDelete() {
        fetch(`http://127.0.0.1:5555/appointments/${id}`, {
            method: 'DELETE'
        })
        .then(res => res.json())
        .then(deletedAppointment => {
            const updatedAppointments = appointments.filter(appointment => appointment.id !== deletedAppointment.id)
            setAppointments(updatedAppointments)
        })
        .then(navigate('/appointments'))
    }

    if (!appointment) {
        return <p>Loading...</p>
    } else {
        return (
            <>
                <button className="open-button" onClick={handleToggleForm}>Update</button>
                {isUpdating ? (
                    <div className="form-popup" id="updateForm" onSubmit={handleUpdate}>
                    <form class="form-container">
                        <label>Date</label>
                        <input type="text" placeholder="Date" name="date" value={date} onChange={handleFormInput} required/>

                        <label>Hour</label>
                        <input type="text" placeholder="Hour" name="hour" value={hour} onChange={handleFormInput} required/>

                        <label>Doctor</label>
                        <select name="doctor" onChange={handleFormInput} required>
                            <option value="" disabled selected>Select Doctor</option>
                            {doctors.map(doctor => <option value={doctor.id}>{doctor.last_name}, {doctor.first_name}</option>)}
                        </select>

                        <label>Reason</label>
                        <input type="text" placeholder="Reason" name="reason" value={reason} onChange={handleFormInput} required/>

                        <button type="submit" className="btn">Confirm</button>
                        <button type="button" className="btn cancel" onClick={handleToggleForm}>Cancel</button>
                    </form>
                </div>
                ) : ("")}
                <div>
                    <h3>Appointment Overview</h3>
                    <button onClick={handleDelete}>Delete</button>
                    <h3>{appointment.date} {generateTime(appointment.hour)}</h3>
                    <p>Reason: {appointment.reason}</p>
                    <p>Doctor: {appointment.doctor.last_name}, {appointment.doctor.first_name}</p>
                    <p>Patient: {appointment.patient.last_name}, {appointment.patient.first_name}</p>
                </div>
            </>
        )
    }
}

export default AppointmentDetails