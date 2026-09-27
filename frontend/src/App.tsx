import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom"

import Analytics
  from "./pages/Analytics"

import ComplaintDetails
  from "./pages/ComplaintDetails"

import Complaints
  from "./pages/Complaints"

import Customers
  from "./pages/Customers"

import Dashboard
  from "./pages/Dashboard"

import Settings
  from "./pages/Settings"

import DashboardLayout
  from "./components/layout/DashboardLayout"


function App() {

  return (

    <BrowserRouter>

      <DashboardLayout>

        <Routes>

          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/complaints"
            element={<Complaints />}
          />

          <Route
            path="/complaints/:id"
            element={<ComplaintDetails />}
          />

          <Route
            path="/customers"
            element={<Customers />}
          />

          <Route
            path="/analytics"
            element={<Analytics />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />

        </Routes>

      </DashboardLayout>

    </BrowserRouter>
  )
}


export default App