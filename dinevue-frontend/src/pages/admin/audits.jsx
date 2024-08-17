import React, { useEffect, useState } from 'react';
import '../../style/Home.css';
import Footer from '../../components/footer';
import NavbarAdmin from '../../components/adminNav';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Audits = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Sample data
    const sampleLogs = [
      { time: '2024-08-16T10:00:00Z', username: 'john.doe@example.com', url: '/create_reservation', method: 'POST' },
      { time: '2024-08-15T11:00:00Z', username: 'roshanac6533@gmail.com', url: '/user/2', method: 'GET' },
      { time: '2024-08-14T12:00:00Z', username: 'roshanacharya6533@gmail.com', url: '/1/update_status', method: 'PUT' },
      { time: '2024-08-13T13:00:00Z', username: 'test1@gmail.com', url: '/2', method: 'DELETE' },
      { time: '2024-08-12T14:00:00Z', username: 'test2@gmail.com', url: '/create_review', method: 'POST' },
      { time: '2024-08-11T15:00:00Z', username: 'roshnaacharya6@gmail.com', url: '/restaurant/1', method: 'GET' },
      { time: '2024-08-10T16:00:00Z', username: 'ramhari123@gmail.com', url: '/createRestaurant', method: 'POST' },
      { time: '2024-08-09T17:00:00Z', username: 'hello@gmail.com', url: '/getAllRestaurants', method: 'GET' },
      { time: '2024-08-08T18:00:00Z', username: 'sam@gmail.com', url: '/restaurant/1/approve', method: 'PUT' },
      { time: '2024-08-07T19:00:00Z', username: 'roshanac86533@gmail.com', url: '/loginRestaurant', method: 'POST' },
      { time: '2024-08-06T20:00:00Z', username: 'roshanac776533@gmail.com', url: '/getAllReviews', method: 'GET' },
      { time: '2024-08-05T21:00:00Z', username: 'roshanac222@gmail.com', url: '/create_review', method: 'POST' },
      { time: '2024-08-04T22:00:00Z', username: 'ram123@gmail.com', url: '/user/3', method: 'GET' },
      { time: '2024-08-03T23:00:00Z', username: 'john.doe@example.com', url: '/2/update_status', method: 'PUT' },
      { time: '2024-08-02T00:00:00Z', username: 'roshanac6533@gmail.com', url: '/create_reservation', method: 'POST' },
      { time: '2024-08-01T01:00:00Z', username: 'roshanacharya6533@gmail.com', url: '/1', method: 'DELETE' },
      { time: '2024-07-31T02:00:00Z', username: 'test1@gmail.com', url: '/restaurant/2', method: 'GET' },
      { time: '2024-07-30T03:00:00Z', username: 'test2@gmail.com', url: '/restaurant/2/approve', method: 'PUT' },
      { time: '2024-07-29T04:00:00Z', username: 'roshnaacharya6@gmail.com', url: '/createReview', method: 'POST' },
      { time: '2024-07-28T05:00:00Z', username: 'ramhari123@gmail.com', url: '/user/4', method: 'GET' },
      { time: '2024-07-27T06:00:00Z', username: 'hello@gmail.com', url: '/create_reservation', method: 'POST' },
      { time: '2024-07-26T07:00:00Z', username: 'sam@gmail.com', url: '/1/update_status', method: 'PUT' },
      { time: '2024-07-25T08:00:00Z', username: 'roshanac86533@gmail.com', url: '/3', method: 'DELETE' },
    ];
    
    // Update state with sample data
    setLogs(sampleLogs);

    // Show toast message
    toast.success("Audit logs fetched successfully");
  }, []);

  return (
    <>
      <NavbarAdmin />
      <br />
      <h5>Audit Logs</h5>
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Username</th>
            <th>URL</th>
            <th>Method</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={index}>
              <td>{new Date(log.time).toLocaleString()}</td> {/* Format the timestamp */}
              <td>{log.username}</td>
              <td>{log.url}</td>
              <td>{log.method}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Footer />
      <ToastContainer /> {/* Add ToastContainer to render toast notifications */}
    </>
  );
};

export default Audits;
