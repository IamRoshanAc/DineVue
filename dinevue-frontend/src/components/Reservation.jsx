import React from "react";
import '../style/Reservation.css';

const Reservation = () => {
  return (
    <div className="reservation">
      <h2>Make a Reservation</h2>
      <form>
        <label>
          Party Size
          <select className="reservation-select">
            <option>2 People</option>
            <option>4 People</option>
            <option>6 People</option>
          </select>
        </label>
        <div className="date-time-row">
          <label>
            Date
            <input type="date" className="reservation-date" />
          </label>
          <label>
            Time
            <select className="reservation-select">
              {[...Array(24).keys()].map(hour => (
                <option key={hour}>{`${hour.toString().padStart(2, '0')}:00`}</option>
              ))}
            </select>
          </label>
        </div>
        <label>
          Seating Options
          <select className="reservation-select">
            <option>Standard</option>
            <option>Outdoor</option>
          </select>
        </label>
        <button type="submit" className="reservation-button">Continue Reservation</button>
      </form>
    </div>
  );
};

export default Reservation;
