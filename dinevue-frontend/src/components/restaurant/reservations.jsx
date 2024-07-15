import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getReservationByRestaurantId, getUserById, updateReservationStatusApi } from '../../apis/Api';
import CustomModal from './customModal'; // Import the custom modal
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const localizer = momentLocalizer(moment);

const Reservations = () => {
  const [seatingDetails, setSeatingDetails] = useState([]);
  const [selectedSeatingType, setSelectedSeatingType] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({});
  const [customerName, setCustomerName] = useState('');

  useEffect(() => {
    const storedRestaurant = localStorage.getItem('user');
    if (storedRestaurant) {
      const restaurantData = JSON.parse(storedRestaurant);
      console.log('Stored Restaurant Data:', restaurantData);

      if (Array.isArray(restaurantData.seatingDetails)) {
        setSeatingDetails(restaurantData.seatingDetails);
        if (restaurantData.seatingDetails.length > 0) {
          setSelectedSeatingType(restaurantData.seatingDetails[0]);
        }
      }

      const restaurantId = restaurantData.id; // Retrieve restaurant ID from local storage
      fetchReservations(restaurantId);
    }
  }, []);

  const fetchReservations = async (restaurantId) => {
    try {
      const response = await getReservationByRestaurantId(restaurantId);
      console.log('Fetched Reservations:', response.data);
      if (response.data.length === 0) {
        toast.info('No reservations found.');
      }
      setReservations(response.data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      toast.error('Error fetching reservations.');
    }
  };

  const handleNavClick = (seating) => {
    setSelectedSeatingType(seating);
    setSelectedOption(null);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const filterReservations = () => {
    if (!selectedSeatingType || !selectedOption || !reservations.length) {
      return [];
    }

    const numberOfPeople = parseInt(selectedOption.replace(/\D/g, ''), 10);

    const filteredReservations = reservations
      .filter(
        (reservation) =>
          reservation.seatingType === selectedSeatingType.type &&
          reservation.numberOfPeople === numberOfPeople
      )
      .map((reservation) => ({
        id: reservation.reservationId,
        title: `${reservation.seatingType} - ${reservation.numberOfPeople} people`,
        start: moment(`${reservation.date}T${reservation.time}`).toDate(),
        end: new Date(moment(`${reservation.date}T${reservation.time}`).add(1, 'hour').toDate()), // Default duration 1 hour
        extendedProps: {
          ...reservation
        },
      }));

    console.log('Filtered Reservations:', filteredReservations);
    return filteredReservations;
  };

  const eventStyleGetter = (event) => {
    const { status } = event.extendedProps;
    let backgroundColor = '#3788d8';

    if (status === 'pending') {
      backgroundColor = 'red';
    } else if (status === 'seated') {
      backgroundColor = 'green';
    } else if (status === 'completed') {
      backgroundColor = 'blue';
    } else if (status === 'cancelled') {
      backgroundColor = 'grey';}

    return {
      style: {
        backgroundColor,
        borderRadius: '5px',
        color: '#fff',
        padding: '5px'
      }
    };
  };

  const handleSelectEvent = async (event) => {
    const { userId } = event.extendedProps;
    try {
      const userResponse = await getUserById(userId);
      const customerName = `${userResponse.data.firstName} ${userResponse.data.lastName}`;
      setCustomerName(customerName);
      setModalData(event.extendedProps);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Error fetching customer details.');
    }
  };

  const handleStatusChange = (e) => {
    setModalData({
      ...modalData,
      status: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      if (!modalData.reservationId || !modalData.status) {
        throw new Error('Missing reservation ID or status.');
      }

      await updateReservationStatusApi(modalData.reservationId, modalData.status);

      toast.success('Reservation status updated successfully!');
      setShowModal(false);

      const storedRestaurant = localStorage.getItem('user');
      if (storedRestaurant) {
        const restaurantData = JSON.parse(storedRestaurant);
        const restaurantId = restaurantData.id;
        const response = await getReservationByRestaurantId(restaurantId);
        console.log('Updated Reservations:', response.data);
        setReservations(response.data);
      }
    } catch (error) {
      toast.error(error.message || 'Error updating reservation status.');
      console.error('Error updating reservation status:', error);
    }
  };

  return (
    <>
      <ul className="nav nav-tabs">
        {seatingDetails.map((seating, index) => (
          <li key={index} className="nav-item dropdown">
            <a
              className={`nav-link dropdown ${seating === selectedSeatingType ? 'active' : ''}`}
              onClick={() => handleNavClick(seating)}
              href="#"
              id={`dropdownMenuButton-${index}`}
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {seating.type}
            </a>
            <ul className="dropdown-menu" aria-labelledby={`dropdownMenuButton-${index}`}>
              {Object.keys(seating.options).map((optionKey, optionIndex) => (
                <li key={optionIndex}>
                  <a
                    className={`dropdown-item ${optionKey === selectedOption ? 'active' : ''}`}
                    href="#"
                    onClick={() => handleOptionClick(optionKey)}
                  >
                    {optionKey}
                  </a>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <Calendar
        localizer={localizer}
        events={filterReservations()}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={handleSelectEvent}
      />

      <CustomModal
        show={showModal}
        onHide={() => setShowModal(false)}
        title="Reservation Details"
        onSave={handleSave}
      >
        <p><strong>Customer Name:</strong> {customerName}</p>
        <p><strong>Number of People:</strong> {modalData.numberOfPeople}</p>
        <p><strong>Date:</strong> {modalData.date}</p>
        <p><strong>Time:</strong> {modalData.time}</p>
        <p><strong>Seating Type:</strong> {modalData.seatingType}</p>
        <p><strong>Customer Phone:</strong> {modalData.customerPhone}</p>
        <p><strong>Customer Email:</strong> {modalData.customerEmail}</p>
        <p><strong>Occasion:</strong> {modalData.occasion}</p>
        <p><strong>Special Requests:</strong> {modalData.specialRequests}</p>
        <div className="custom-form-group">
          <label htmlFor="reservationStatus"><strong>Status:</strong></label>
          <select
            id="reservationStatus"
            value={modalData.status || 'pending'}
            onChange={handleStatusChange}
          >
            <option value="pending">Pending</option>
            <option value="seated">Seated</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </CustomModal>

      <ToastContainer />
    </>
  );
};

export default Reservations;
