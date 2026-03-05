import { useContext } from "react";
import { Routes, Route } from "react-router";
import { UserContext } from "./contexts/UserContext.jsx";
import NavBar from "./components/NavBar/NavBar.jsx";
import SignUpForm from "./components/SignUpForm/SignUpForm.jsx";
import SignInForm from "./components/SignInForm/SignInForm.jsx";
import Landing from "./components/Landing/Landing.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import WorkoutDetail from "./components/Workouts/WorkoutDetail.jsx";
import TemplateBuilder from "./components/Templates/TemplateBuilder.jsx";
import TemplateDetail from "./components/Templates/TemplateDetail.jsx";
import TemplatesList from "./components/Templates/TemplatesList.jsx";
import PlanBuilder from "./components/Plans/PlanBuilder.jsx";
import PlanDetail from "./components/Plans/PlanDetail.jsx";
import PlansList from "./components/Plans/PlansList.jsx";
import ExerciseDetail from "./components/ExerciseLibrary/ExerciseDetail.jsx";
import ExerciseLibrary from "./components/ExerciseLibrary/ExerciseLibrary.jsx";
import Calendar from "./components/Calendar/Calendar.jsx";
import Profile from "./components/Calendar/Profile.jsx";


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
        <Route path="/profile" element={<Profile />} />

        {/* Library */}
        <Route path="/exercises" element={<ExerciseLibrary />} />
        <Route path="/exercises/:exerciseId" element={<ExerciseDetail />} />

        {/* Templates */}
        <Route path="/templates" element={<TemplatesList />} />
        <Route path="/templates/new" element={<TemplateBuilder />} />
        <Route path="/templates/:templateId" element={<TemplateDetail />} />
        <Route
          path="/templates/:templateId/edit"
          element={<TemplateBuilder />}
        />

        {/* Plans */}
        <Route path="/plans" element={<PlansList />} />
        <Route path="/plans/new" element={<PlanBuilder />} />
        <Route path="/plans/:planId" element={<PlanDetail />} />
        <Route path="/plans/:planId/edit" element={<PlanBuilder />} />

        {/* Calendar & Workouts */}
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/workouts/:workoutId" element={<WorkoutDetail />} />
      </Routes>
    </>
  );
};

export default App;
