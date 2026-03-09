# HW App – Frontend

## About

The **Health is Wealth  (HW) App Frontend** is a React application that allows users to track fitness progress, browse exercises, and interact with workout plans.

It connects to a **Django REST API backend** and uses **JWT authentication** to manage secure user sessions.

---
## Deploy app 

Link [Health is Wealth App]([https://docs.github.com/](https://healthwealthapp.netlify.app/))

---
## Tech Stack

- React
- Vite
- React Router
- Axios
- JWT Authentication
- Netlify (deployment)

---

## Features
## Features

- JWT authentication
- Profile management (height tracking and weight logs)
- Exercise library with instructions and demo videos (admin seeded)
- Workout templates and plans (admin seeded)
- Calendar-based workout logging
- User authentication (sign up / sign in)
- Dashboard with nested routing

---
```bash
src
│
├── components
│   │
│   ├── Calendar
        ├── Calendar.jsx
        ├── Profile.css
│   │   └── Profile.jsx
│   │
│   ├── ExerciseLibrary
│   │   ├── ExerciseLibrary.jsx
│   │   └── ExerciseDetail.jsx
│   │
│   ├── Dashboard
│   │   └── Dashboard.jsx
│   │
│   └── Landing
│       └── Landing.jsx
│
├── contexts
│   └── UserContext.jsx
│
├── services
│   ├── apiConfig.js
│   ├── authService.js
│   ├── profileServices.js
│   └── exerciseService.js
│
└── App.jsx

```
## Calendar Workout Log

The app includes a **calendar-based workout log** that allows users to view and track workouts scheduled on specific dates.

Workout plans generate **dated workouts** that appear in the user's calendar. Each workout contains exercises derived from predefined workout templates.

### What Users Can Do

- View workouts scheduled for specific calendar days
- Open a workout to see exercises and instructions
- Log completion of workouts
- Track workout history over time

### How It Works

The workout system separates **planning** from **execution**:

- **Workout Templates**  
  Define the structure of a workout (exercises, order, and configuration).

- **Workout Plans**  
  Schedule workouts across a time period using templates.

- **Calendar Workouts**  
  Represent actual workouts assigned to specific calendar dates.

When a workout plan is generated, the backend creates dated workout entries that appear in the calendar. These entries represent **real workout sessions** that users can complete and track.

Each workout entry includes:

- Workout date
- List of exercises
- Instructions for each exercise

This structure allows users to plan workouts ahead of time while maintaining a clear log of completed training sessions.

