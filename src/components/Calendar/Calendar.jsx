import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { getWorkouts, updateWorkout, deleteWorkout } from "../../services/workoutService.js";
import "./Calendar.css";

export default function Calendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popover, setPopover] = useState({ show: false, x: 0, y: 0, workoutId: null });
  const navigate = useNavigate();
  const calendarRef = useRef(null);
  const [isMobile, setIsMobile] = useState(() =>
    window.innerWidth < 768
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!calendarRef.current) return;
    const calendarApi = calendarRef.current.getApi();
    calendarApi.changeView(isMobile ? "timeGridWeek" : "dayGridMonth");
  }, [isMobile]);

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

  const handleDatesSet = (dateInfo) => {
    fetchWorkouts(dateInfo.start, dateInfo.end);
  };

  const handleEventClick = (clickInfo) => {
    // Show popover at click position
    setPopover({
      show: true,
      x: clickInfo.jsEvent.clientX,
      y: clickInfo.jsEvent.clientY,
      workoutId: clickInfo.event.id,
    });
    clickInfo.jsEvent.preventDefault();
  };

  const handleEdit = () => {
    if (popover.workoutId) {
      navigate(`/app/workouts/${popover.workoutId}/edit`);
      setPopover({ show: false, x: 0, y: 0, workoutId: null });
    }
  };

  const handleView = () => {
    if (popover.workoutId) {
      navigate(`/app/workouts/${popover.workoutId}`);
      setPopover({ show: false, x: 0, y: 0, workoutId: null });
    }
  };

  const handleDelete = async () => {
    if (!popover.workoutId) return;
    
    if (!window.confirm("Are you sure you want to delete this workout?")) {
      setPopover({ show: false, x: 0, y: 0, workoutId: null });
      return;
    }
    
    try {
      await deleteWorkout(popover.workoutId);
      setPopover({ show: false, x: 0, y: 0, workoutId: null });
      
      // Refresh calendar - get current view dates
      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        const view = calendarApi.view;
        fetchWorkouts(view.activeStart, view.activeEnd);
      }
    } catch (error) {
      alert(error.response?.data?.detail || "Could not delete workout");
      setPopover({ show: false, x: 0, y: 0, workoutId: null });
    }
  };

  const handleClosePopover = () => {
    setPopover({ show: false, x: 0, y: 0, workoutId: null });
  };

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popover.show && !event.target.closest('.workout-popover')) {
        setPopover({ show: false, x: 0, y: 0, workoutId: null });
      }
    };

    if (popover.show) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [popover.show]);

  const handleEventDrop = async (dropInfo) => {
    const workoutId = dropInfo.event.id;
    const newStart = dropInfo.event.start;
    const originalEnd = dropInfo.event.end;
    const duration = originalEnd 
      ? originalEnd.getTime() - newStart.getTime() 
      : 60 * 60 * 1000; // Default 1 hour if no end time
    const newEnd = new Date(newStart.getTime() + duration);
    
    try {
      await updateWorkout(workoutId, {
        start_dt: newStart.toISOString(),
        end_dt: newEnd.toISOString(),
      });
      fetchWorkouts(dropInfo.view.activeStart, dropInfo.view.activeEnd);
    } catch (error) {
      dropInfo.revert();
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.non_field_errors?.[0] ||
                          error.message || 
                          "Could not move workout";
      alert(errorMessage);
      console.error("Error moving workout:", error);
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
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.non_field_errors?.[0] ||
                          error.message || 
                          "Could not resize workout";
      alert(errorMessage);
      console.error("Error resizing workout:", error);
    }
  };

  return (
    <div style={{ padding: "20px", position: "relative" }}>
      <h2>Workout Schedule</h2>
      {loading && <p>Loading workouts...</p>}
      
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={isMobile ? "timeGridWeek" : "dayGridMonth"}
        events={events}
        datesSet={handleDatesSet}
        editable={true}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
        eventResize={handleEventResize}
        selectable={true}
        headerToolbar={{
          left: isMobile ? "prev,next" : "prev,next today",
          center: "title",
          right: isMobile ? "timeGridWeek,timeGridDay createWorkout" : "dayGridMonth,timeGridWeek,timeGridDay createWorkout",
        }}
        contentHeight="auto"
        expandRows={true}
        handleWindowResize={true}
        customButtons={{
          createWorkout: {
            text: "+ Workout",
            click: () => navigate("/app/workouts/new"),
          },
        }}
      />

      {/* Popover for edit/delete actions */}
      {popover.show && (
        <div
          className="workout-popover"
          style={{
            position: 'fixed',
            left: `${popover.x}px`,
            top: `${popover.y}px`,
            background: 'white',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1000,
            minWidth: '120px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          <button
            onClick={handleView}
            style={{
              padding: '6px 12px',
              border: 'none',
              background: '#2196F3',
              color: 'white',
              cursor: 'pointer',
              borderRadius: '4px',
              fontSize: '14px',
              textAlign: 'left',
            }}
            onMouseEnter={(e) => e.target.style.background = '#1976D2'}
            onMouseLeave={(e) => e.target.style.background = '#2196F3'}
          >
            View Details
          </button>
          <button
            onClick={handleEdit}
            style={{
              padding: '6px 12px',
              border: 'none',
              background: '#4CAF50',
              color: 'white',
              cursor: 'pointer',
              borderRadius: '4px',
              fontSize: '14px',
              textAlign: 'left',
            }}
            onMouseEnter={(e) => e.target.style.background = '#45a049'}
            onMouseLeave={(e) => e.target.style.background = '#4CAF50'}
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            style={{
              padding: '6px 12px',
              border: 'none',
              background: '#f44336',
              color: 'white',
              cursor: 'pointer',
              borderRadius: '4px',
              fontSize: '14px',
              textAlign: 'left',
            }}
            onMouseEnter={(e) => e.target.style.background = '#da190b'}
            onMouseLeave={(e) => e.target.style.background = '#f44336'}
          >
            Delete
          </button>
          <button
            onClick={handleClosePopover}
            style={{
              padding: '6px 12px',
              border: 'none',
              background: '#757575',
              color: 'white',
              cursor: 'pointer',
              borderRadius: '4px',
              fontSize: '14px',
              textAlign: 'left',
            }}
            onMouseEnter={(e) => e.target.style.background = '#616161'}
            onMouseLeave={(e) => e.target.style.background = '#757575'}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}