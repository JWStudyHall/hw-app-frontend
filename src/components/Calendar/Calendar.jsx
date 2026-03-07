import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { getWorkouts } from "../../services/workoutService.js";

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWorkouts = async (start, end) => {
    setLoading(true);
    try {
      const startISO = start.toISOString();
      const endISO = end.toISOString();
      const workouts = await getWorkouts(startISO, endISO);
      
      const transformedEvents = Array.isArray(workouts)
        ? workouts.map((workout) => ({
            id: workout.id,
            title: workout.title,
            start: workout.start_dt,
            end: workout.end_dt,
            extendedProps: {
              status: workout.status,
              notes: workout.notes,
            },
          }))
        : [];
      
      setEvents(transformedEvents);
    } catch (error) {
      console.error("Failed to fetch workouts:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle date range changes (when user navigates calendar)
  const handleDatesSet = (dateInfo) => {
    fetchWorkouts(dateInfo.start, dateInfo.end);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Workout Schedule</h2>
      {loading && <p>Loading workouts...</p>}
      
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        datesSet={handleDatesSet} // Called when date range changes
        editable={true}
        selectable={true}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
      />
    </div>
  );
}