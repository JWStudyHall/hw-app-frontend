import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router";
import { UserContext } from "./contexts/UserContext.jsx";
import "./App.css";
import NavBar from "./components/NavBar/NavBar.jsx";
import SignUpForm from "./components/SignUpForm/SignUpForm.jsx";
import SignInForm from "./components/SignInForm/SignInForm.jsx";
import Landing from "./components/Landing/Landing.jsx";
import AppLayout from "./components/shared/AppLayout/AppLayout.jsx";
import WorkoutList from "./components/Workouts/WorkoutList.jsx";
import WorkoutDetail from "./components/Workouts/WorkoutDetail.jsx";
import WorkoutBuilder from "./components/Workouts/WorkoutBuilder.jsx";
import TemplateBuilder from "./components/Templates/TemplateBuilder.jsx";
import TemplateDetail from "./components/Templates/TemplateDetail.jsx";
import TemplateList from "./components/Templates/TemplateList.jsx";
import PlanBuilder from "./components/Plans/PlanBuilder.jsx";
import PlanBuilderEdit from "./components/Plans/PlanBuilderEdit.jsx";
import PlanFormTest from "./components/Plans/PlanFormTest.jsx";
import PlanDetail from "./components/Plans/PlanDetail.jsx";
import PlansList from "./components/Plans/PlansList.jsx";
import ExerciseDetail from "./components/ExerciseLibrary/ExerciseDetail.jsx";
import ExerciseLibrary from "./components/ExerciseLibrary/ExerciseLibrary.jsx";
import Profile from "./components/Calendar/Profile.jsx";
import Explore from "./components/Explore/Explore.jsx";
import MyWorkouts from "./components/Workouts/MyWorkouts.jsx";
import RequireAuth from "./components/RequireAuth/RequireAuth.jsx";
import { LoadingSpinner } from "./components/LoadingSpinner/LoadingSpinner.jsx";

const App = () => {
  const { user, loading } = useContext(UserContext);
  if (loading) {
    return <LoadingSpinner />; // or a proper loading component
  }
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/sign-up" element={<SignUpForm />} />
        <Route path="/sign-in" element={<SignInForm />} />
        <Route path="/" element={<Landing />} />
        {/* App Routes Entry Point */}
        <Route path="/app" element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        } >
            <>
              {/* Profile & Library */}
              <Route path="profile" element={<Profile />} />
              <Route path="exercises" element={<ExerciseLibrary />} />
              <Route
                path="exercises/:exerciseId"
                element={<ExerciseDetail />}
              />

              {/* Templates */}
              <Route path="templates" element={<TemplateList />} />
              <Route path="templates/new" element={<TemplateBuilder />} />
              <Route
                path="templates/:templateId"
                element={<TemplateDetail />}
              />
              <Route
                path="templates/:templateId/edit"
                element={<TemplateBuilder />}
              />

              {/* Plans */}
              <Route path="plans" element={<PlansList />} />
              <Route path="plans/new" element={<PlanFormTest />} />
              <Route path="plans/:planId" element={<PlanDetail />} />
              <Route path="plans/:planId/edit" element={<PlanFormTest />} />

              {/* Workouts & Calendar */}
              <Route path="workouts" element={<MyWorkouts />} />
              <Route path="workouts/new" element={<WorkoutBuilder />} />
              <Route path="workouts/:workoutId" element={<WorkoutDetail />} />
              <Route path="workouts/:workoutId/edit" element={<WorkoutBuilder />} />
              {/* Explore */}
              <Route path="explore" element={<Explore />} />
            </>
        </Route>

        {/* CATCH-ALL: Redirects unknown URLs to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;
