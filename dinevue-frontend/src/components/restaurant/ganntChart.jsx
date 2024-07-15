import React, { useEffect, useRef } from 'react';
import Gantt from 'frappe-gantt'; // Import the default export
import 'frappe-gantt/dist/frappe-gantt.css'; // Import Gantt CSS

const ReservationsGantt = ({ reservations }) => {
  const ganttRef = useRef(null);

  useEffect(() => {
    if (ganttRef.current) {
      // Transform reservation data into Gantt tasks
      const tasks = reservations.map((reservation) => {
        try {
          const startDate = new Date(`${reservation.date}T${reservation.time}`);
          if (isNaN(startDate.getTime())) throw new Error('Invalid date');

          // Assuming each reservation lasts for 1 hour for simplicity
          const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

          return {
            id: reservation.reservationId,
            name: `${reservation.seatingType} - ${reservation.numberOfPeople} people`,
            start: startDate.toISOString().split('T')[0], // Convert to YYYY-MM-DD format
            end: endDate.toISOString().split('T')[0], // Convert to YYYY-MM-DD format
            progress: 100, // Assuming all reservations are complete
            custom_class: 'bar-blue',
          };
        } catch (error) {
          console.error(`Error processing reservation ${reservation.reservationId}:`, error);
          return null; // Skip this reservation
        }
      }).filter(task => task !== null); // Remove invalid tasks

      if (tasks.length > 0) {
        new Gantt(ganttRef.current, tasks, {
          view_mode: 'Day',
          date_format: 'YYYY-MM-DD',
          custom_popup_html: null,
        });
      }
    }
  }, [reservations]);

  return <div ref={ganttRef} className="gantt-container"></div>;
};

export default ReservationsGantt;
