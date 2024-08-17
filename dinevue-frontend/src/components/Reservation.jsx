import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../style/Reservation.css';
import {jwtDecode} from 'jwt-decode'; // Correct the import
import { createReservationApi } from "../apis/Api";

Modal.setAppElement('#root');

const Reservation = ({ restaurant }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [partySize, setPartySize] = useState("2");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [seatingOption, setSeatingOption] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [occasion, setOccasion] = useState(""); // Added
  const [specialRequests, setSpecialRequests] = useState(""); // Added
  const [timeOptions, setTimeOptions] = useState([]);
  const [showContactMessage, setShowContactMessage] = useState(false);
  const [seatingOptions, setSeatingOptions] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [userId, setUserId] = useState(""); // Added

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setPhone(decodedToken.phone || "");
        setEmail(decodedToken.email || "");
        setUserId(decodedToken.id || ""); // Extract userId from token
      } catch (err) {
        console.error('Failed to decode token', err);
      }
    }
  }, []);

  useEffect(() => {
    if (restaurant.openingtime && restaurant.closingtime) {
      setTimeOptions(generateTimeOptions(restaurant.openingtime, restaurant.closingtime, date));
    }

    if (restaurant.seatingDetails) {
      setSeatingOptions(restaurant.seatingDetails);
      if (restaurant.seatingDetails.length > 0) {
        setSeatingOption(restaurant.seatingDetails[0].type);
      }
    }
  }, [restaurant, date]);

  useEffect(() => {
    const isDateValid = new Date(date) >= new Date(new Date().toISOString().split("T")[0]);
    if (parseInt(partySize) > 6 || !isDateValid) {
      setIsButtonDisabled(true);
      setShowContactMessage(parseInt(partySize) > 6);
    } else {
      setIsButtonDisabled(false);
      setShowContactMessage(false);
    }
  }, [partySize, date]);

  const handleReservationSubmit = (e) => {
    e.preventDefault();
    if (userId) { // Check if userId is available
      setModalIsOpen(true);
    } else {
      toast.error("Login before reservation");
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const completeReservation = async () => {
    const reservationData = {
      restaurantId: restaurant.id,
      numberOfPeople: parseInt(partySize),
      date: date,
      time: time,
      seatingType: seatingOption,
      customerPhone: phone,
      customerEmail: email,
      occasion: occasion, // Added
      specialRequests: specialRequests, // Added
      userId: userId // Added
    };

    try {
      const result = await createReservationApi(reservationData);
      toast.success(result.message || "Reservation completed successfully!"); // Display backend message
      setModalIsOpen(false); // Close the modal
    } catch (error) {
      console.error('Error during reservation:', error);
      toast.error(error.response?.data?.error || `We are out of seats please select different time or different table `);
    }
  };

  return (
    <div className="reservation">
      <h2>Make a Reservation</h2>
      <form onSubmit={handleReservationSubmit}>
        <label>
          Party Size
          <select 
            className="reservation-select"
            value={partySize}
            onChange={(e) => setPartySize(e.target.value)}
          >
            <option value="1">1 Person</option>
            <option value="2">2 People</option>
            <option value="4">4 People</option>
            <option value="6">6 People</option>
            <option value="8">8 People</option>
            <option value="10">10 People</option>
          </select>
        </label>
        {showContactMessage && (
          <>
            <p className="contact-message">
              Your party is too big for reservation
            </p>
            <p className="contact-message">
              Please contact the restaurant directly at {restaurant.phone}
            </p>
          </>
        )}
        <div className="date-time-row">
          <label>
            Date
            <input 
              type="date" 
              className="reservation-date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </label>
          <label>
            Time
            <select 
              className="reservation-select"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            >
              {timeOptions.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
          </label>
        </div>
        <label>
          Seating Options
          <select 
            className="reservation-select"
            value={seatingOption}
            onChange={(e) => setSeatingOption(e.target.value)}
          >
            {seatingOptions.map((seating, index) => (
              <option key={index} value={seating.type}>{seating.type}</option>
            ))}
          </select>
        </label>
        <button type="submit" className={`reservation-button ${isButtonDisabled ? 'disabled' : ''}`} disabled={isButtonDisabled}>
          Continue Reservation
        </button>
      </form>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Reservation Details"
        className="reservation-modal"
        overlayClassName="reservation-overlay"
      >
        <div className="modal-content">
          <h2>One step away from reserving your table!</h2>
          <div className="modall-header">
            <img src={restaurant.coverphoto} alt="Restaurant" className="restaurant-image" />
            <div className="restaurant-details">
              <h3>{restaurant.restaurantName}</h3>
              <div className="restaurant-details-row">
                <p><span role="img" aria-label="people">👥</span> {partySize} People</p>
                <p><span role="img" aria-label="calendar">📅</span> {new Date(date).toDateString()}</p>
                <p><span role="img" aria-label="clock">⏰</span> {time}</p>
              </div>
              <p>{restaurant.address}</p>
            </div>
          </div>
          <div className="diner-details">
            <h2>Diner Details</h2>
            <div className="diner-details-row">
              <label>
                Phone Number
                <input 
                  type="text" 
                  className="reservation-text" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </label>
              <label>
                Email
                <input 
                  type="email" 
                  className="reservation-text" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
            </div>
            <div className="diner-details-row">
              <label>
                Select Occasion (Optional)
                <select 
                  className="reservation-select"
                  value={occasion} // Updated
                  onChange={(e) => setOccasion(e.target.value)} // Updated
                >
                  <option value="">None</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Anniversary">Anniversary</option>
                </select>
              </label>
              <label>
                Special Requests (Optional)
                <input 
                  type="text" 
                  className="reservation-text" 
                  placeholder="Special Requests" 
                  value={specialRequests} // Updated
                  onChange={(e) => setSpecialRequests(e.target.value)} // Updated
                />
              </label>
            </div>
          </div>
          <button className="reservation-button" onClick={completeReservation}>Complete Reservation</button>
        </div>
      </Modal>

      <ToastContainer />
    </div>
  );
};

const generateTimeOptions = (openingTime, closingTime, selectedDate) => {
  const options = [];
  const today = new Date();
  let currentTime = new Date(`1970-01-01T${openingTime}`);
  const endTime = new Date(`1970-01-01T${closingTime}`);
  const selectedDateObj = new Date(selectedDate);

  while (currentTime <= endTime) {
    if (selectedDateObj.toDateString() !== today.toDateString() || currentTime.getHours() >= today.getHours()) {
      options.push(formatAMPM(currentTime));
    }
    currentTime.setMinutes(currentTime.getMinutes() + 60);
  }

  return options;
};

const formatAMPM = (date) => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  const strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
};

export default Reservation;
