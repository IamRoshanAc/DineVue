import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { getReservationByRestaurantId, getAllReviewsApi } from '../../apis/Api'; // Adjust the import according to your project structure
import '../../style/Dashboard.css';

// Register necessary components and plugins with ChartJS
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [reservations, setReservations] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [seatingDetails, setSeatingDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const restaurantData = storedUser ? JSON.parse(storedUser) : null;
        if (!restaurantData || !restaurantData.id) {
          setError('Restaurant data not found in local storage');
          setLoading(false);
          return;
        }
        
        setSeatingDetails(restaurantData.seatingDetails);

        // Fetch reservations
        const reservationsResponse = await getReservationByRestaurantId(restaurantData.id);
        setReservations(reservationsResponse.data);

        // Fetch reviews
        const reviewsResponse = await getAllReviewsApi();
        const allReviews = reviewsResponse.data.data;
        setReviews(allReviews);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateSeatingDetails = () => {
    const seatingDetailsMap = new Map();

    // Initialize seating details map with types from local storage
    seatingDetails.forEach(seating => {
      seatingDetailsMap.set(seating.type, 0);
    });

    // Count reservations for each seating detail type
    reservations.forEach(reservation => {
      const seatingType = reservation.seatingType;
      if (seatingDetailsMap.has(seatingType)) {
        seatingDetailsMap.set(seatingType, seatingDetailsMap.get(seatingType) + 1);
      }
    });

    return {
      labels: Array.from(seatingDetailsMap.keys()),
      data: Array.from(seatingDetailsMap.values()),
    };
  };

  const calculateTotalGuests = () => {
    const seatingDetailsMap = new Map();

    // Initialize seating details map with types from local storage
    seatingDetails.forEach(seating => {
      seatingDetailsMap.set(seating.type, 0);
    });

    // Sum number of guests for each seating detail type
    reservations.forEach(reservation => {
      const seatingType = reservation.seatingType;
      if (seatingDetailsMap.has(seatingType)) {
        seatingDetailsMap.set(seatingType, seatingDetailsMap.get(seatingType) + reservation.numberOfPeople);
      }
    });

    return {
      labels: Array.from(seatingDetailsMap.keys()),
      data: Array.from(seatingDetailsMap.values()),
    };
  };

  const seatingData = calculateSeatingDetails();
  const totalGuestsData = calculateTotalGuests();

  const seatingChartData = {
    labels: seatingData.labels,
    datasets: [
      {
        label: 'Number of Reservations',
        data: seatingData.data,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const totalGuestsChartData = {
    labels: totalGuestsData.labels,
    datasets: [
      {
        label: 'Total Guests',
        data: totalGuestsData.data,
        backgroundColor: 'green',
        borderColor: 'green',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: Math.max(...seatingData.data, ...totalGuestsData.data) + 1,
      },
    },
  };

  const calculateReviewAverages = () => {
    // Calculate average ratings
    const avgOverall = reviews.reduce((acc, review) => acc + review.OverallRating, 0) / reviews.length;
    const avgFood = reviews.reduce((acc, review) => acc + review.FoodRating, 0) / reviews.length;
    const avgService = reviews.reduce((acc, review) => acc + review.ServiceRating, 0) / reviews.length;
    const avgAmbience = reviews.reduce((acc, review) => acc + review.AmbienceRating, 0) / reviews.length;

    return {
      overall: avgOverall.toFixed(1),
      food: avgFood.toFixed(1),
      service: avgService.toFixed(1),
      ambience: avgAmbience.toFixed(1),
    };
  };

  const reviewAverages = calculateReviewAverages();

  const reviewChartData = {
    labels: ['Overall', 'Food', 'Service', 'Ambience'],
    datasets: [
      {
        label: 'Average Rating',
        data: [reviewAverages.overall, reviewAverages.food, reviewAverages.service, reviewAverages.ambience],
        backgroundColor: 'orange',
        borderColor: 'orange',
        borderWidth: 1,
      },
    ],
  };

  const reviewOptions = {
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: 5,
      },
    },
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="dashboard">
      <div className="chart-row">
        <div className="section">
          <h2>Seating Details</h2>
          <div className="chart-container">
            <Bar data={seatingChartData} options={chartOptions} />
          </div>
        </div>
        <div className="section">
          <h2>Total Guests</h2>
          <div className="chart-container">
            <Bar data={totalGuestsChartData} options={chartOptions} />
          </div>
        </div>
      </div>
      <br/>
      <br/>
      <br/>
      <div className="section">
        <h2>Review Averages</h2>
        <div className="chart-container">
          <Bar data={reviewChartData} options={reviewOptions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
