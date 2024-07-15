import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Modal, Button, Form } from 'react-bootstrap';
import { getReservationByRestaurantId, getUserById, updateReservationStatusApi } from '../../apis/Api';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    // Retrieve data from local storage
    const storedRestaurant = localStorage.getItem('user');
    if (storedRestaurant) {
      const restaurantData = JSON.parse(storedRestaurant);
      console.log('Stored Restaurant Data:', restaurantData); // Debugging: Check stored data

      // Check if seatingDetails exists and is an array
      if (Array.isArray(restaurantData.seatingDetails)) {
        setSeatingDetails(restaurantData.seatingDetails);
        if (restaurantData.seatingDetails.length > 0) {
          setSelectedSeatingType(restaurantData.seatingDetails[0]);
        }
      }
    }

    // Fetch reservations from API
    const fetchReservations = async () => {
      try {
        const response = await getReservationByRestaurantId(4); // Use the appropriate restaurant ID
        console.log('Fetched Reservations:', response.data); // Debugging: Check fetched data
        if (response.data.length === 0) {
          toast.info('No reservations found for this date.');
        }
        setReservations(response.data);
      } catch (error) {
        console.error('Error fetching reservations:', error);
        toast.error('Error fetching reservations.');
      }
    };

    fetchReservations();
  }, []);

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

    const storedRestaurant = localStorage.getItem('user');
    if (!storedRestaurant) return [];

    const restaurantData = JSON.parse(storedRestaurant);
    const restaurantId = restaurantData.id;

    const selectedDateString = selectedDate.toISOString().split('T')[0];
    const numberOfPeople = parseInt(selectedOption.replace(/\D/g, ''), 10);

    const filteredReservations = reservations
      .filter(
        (reservation) =>
          reservation.restaurantId === restaurantId &&
          reservation.seatingType === selectedSeatingType.type &&
          reservation.numberOfPeople === numberOfPeople &&
          reservation.date === selectedDateString
      )
      .map((reservation) => ({
        id: reservation.reservationId,
        title: `${reservation.seatingType} - ${reservation.numberOfPeople} people`,
        start: new Date(`${reservation.date}T${reservation.time}`),
        end: new Date(new Date(`${reservation.date}T${reservation.time}`).getTime() + 60 * 60000), // Default duration 1 hour
        extendedProps: {
          ...reservation
        },
      }));

    console.log('Filtered Reservations:', filteredReservations); // Debugging: Check filtered data
    return filteredReservations;
  };

  const eventContent = (arg) => {
    const { status } = arg.event.extendedProps;
    let backgroundColor = '#3788d8'; // Default color

    if (status === 'pending') {
      backgroundColor = 'red';
    } else if (status === 'seated') {
      backgroundColor = 'green';
    } else if (status === 'completed') {
      backgroundColor = 'blue';
    }

    return (
      <div style={{ backgroundColor, padding: '5px', borderRadius: '5px', color: '#fff' }}>
        {arg.timeText} - {arg.event.title}
      </div>
    );
  };

  const handleEventClick = async (clickInfo) => {
    const { userId } = clickInfo.event.extendedProps;
    try {
      const userResponse = await getUserById(userId);
      const customerName = `${userResponse.data.firstName} ${userResponse.data.lastName}`;
      setCustomerName(customerName);
      setModalData(clickInfo.event.extendedProps);
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
      await updateReservationStatusApi(modalData.reservationId, modalData.status);
      toast.success('Reservation status updated successfully!');
      setShowModal(false);

      // Re-fetch reservations to update the state
      const response = await getReservationByRestaurantId(4);
      console.log('Updated Reservations:', response.data); // Debugging: Check updated data
      setReservations(response.data);
    } catch (error) {
      console.error('Error updating reservation status:', error);
      toast.error('Error updating reservation status.');
    }
  };

  return (
    <>
      <div className="date-picker-container">
        <label>Select Date: </label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
        />
      </div>
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
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridDay"
        headerToolbar={false}
        slotMinTime="10:00:00"
        slotMaxTime="24:00:00"
        events={filterReservations()}
        eventContent={eventContent}
        eventClick={handleEventClick}
        validRange={{ start: selectedDate, end: selectedDate }}
      />

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reservation Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p><strong>Customer Name:</strong> {customerName}</p>
          <p><strong>Number of People:</strong> {modalData.numberOfPeople}</p>
          <p><strong>Date:</strong> {modalData.date}</p>
          <p><strong>Time:</strong> {modalData.time}</p>
          <p><strong>Seating Type:</strong> {modalData.seatingType}</p>
          <p><strong>Customer Phone:</strong> {modalData.customerPhone}</p>
          <p><strong>Customer Email:</strong> {modalData.customerEmail}</p>
          <p><strong>Occasion:</strong> {modalData.occasion}</p>
          <p><strong>Special Requests:</strong> {modalData.specialRequests}</p>
          <Form.Group controlId="reservationStatus">
            <Form.Label><strong>Status:</strong></Form.Label>
            <Form.Control as="select" value={modalData.status || 'pending'} onChange={handleStatusChange}>
              <option value="pending">Pending</option>
              <option value="seated">Seated</option>
              <option value="completed">Completed</option>
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </>
  );
};

export default Reservations;
