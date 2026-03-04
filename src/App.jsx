import { useContext } from "react";
import { Routes, Route } from "react-router";
import { UserContext } from "./contexts/UserContext.jsx";
import NavBar from "./components/NavBar/NavBar.jsx";
import SignUpForm from "./components/SignUpForm/SignUpForm.jsx";
import SignInForm from "./components/SignInForm/SignInForm.jsx";
import Landing from "./components/Landing/Landing.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import Workouts from "./components/Workouts/WorkoutDetail.jsx";
import Templates from "./components/Template/TemplateBuilder.jsx";
import Templates from "./components/Template/TemplateDetail.jsx";
import Templates from "./components/Template/TemplatesList.jsx";
import Plans from "./components/Plans/PlanBuilder.jsx";
import Plans from "./components/Plans/PlanDetail.jsx";
import Plans from "./components/Plans/PlansList.jsx";
import ExerciseLibrary from "./components/ExerciseLibrary/ExerciseDetail.jsx";
import ExerciseLibrary from "./components/ExerciseLibrary/ExerciseLibrary.jsx";
import Calendar from "./components/Calendar/Calendar.jsx";
import Calendar from "./components/Calendar/Profile.jsx";

import ExerciseLibrary from "./components/ExerciseLibrary";
import Calendar from "./components/Calendar";

const App = () => {
  const { user } = useContext(UserContext);

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <Landing />} />
        <Route path="/sign-up" element={<SignUpForm />} />
        <Route path="/sign-in" element={<SignInForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/exercises" element={<ExerciseLibrary />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/plans" element={<Plans />} />
      </Routes>
    </>
  );
};

export default App;
