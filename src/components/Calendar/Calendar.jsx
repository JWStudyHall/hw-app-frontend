import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { getWorkouts, updateWorkout } from "../../services/workoutService.js";

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  // Handle event clicks - navigate to workout detail page
  const handleEventClick = (clickInfo) => {
    const workoutId = clickInfo.event.id;
    navigate(`/workouts/${workoutId}`);
  };

  const handleEventDrop = async (dropInfo) => {
    const workoutId = dropInfo.event.id;
    const newStart = dropInfo.event.start;
    const newEnd = dropInfo.event.end || 
      new Date(newStart.getTime() + (dropInfo.event.end - dropInfo.event.start));
    
    try {
      await updateWorkout(workoutId, {
        start_dt: newStart.toISOString(),
        end_dt: newEnd.toISOString(),
      });
      // Optionally refresh calendar
      fetchWorkouts(dropInfo.view.activeStart, dropInfo.view.activeEnd);
    } catch (error) {
      // Revert the event position
      dropInfo.revert();
      alert(error.response?.data?.detail || "Could not move workout");
    }
  };
  
  const handleEventResize = async (resizeInfo) => {
    const workoutId = resizeInfo.event.id;
    const newEnd = resizeInfo.event.end;
    
    try {
      await updateWorkout(workoutId, {
        end_dt: newEnd.toISOString(),
      });
    } catch (error) {
      resizeInfo.revert();
      alert(error.response?.data?.detail || "Could not resize workout");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Workout Schedule</h2>
      {loading && <p>Loading workouts...</p>}
      
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        datesSet={handleDatesSet}
        editable={true}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
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