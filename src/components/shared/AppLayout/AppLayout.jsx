import React from 'react'
import { Outlet } from 'react-router'
import WorkoutNav from '../../Workouts/WorkoutNav'

const AppLayout = () => (
    <main className="page-root">
      <WorkoutNav />
      <section className="page-shell">
        <Outlet />
      </section>
    </main>
  );

export default AppLayout