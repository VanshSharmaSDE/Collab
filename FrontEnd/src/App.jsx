import React from 'react';
import './App.css';
import Home from '../src/pages/HomePage/Home';
import About from '../src/pages/AboutPage/About';
import Contact from '../src/pages/ContactPage/Contact';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Auth from './pages/AuthPage/Auth';
import Dashboard from './pages/DashboardPage/Dashboard';
import PrivateRoute from './utils/private/PrivateRoute';
import ProjectDetail from './components/ProjectDetails/ProjectDetail';
function App() {
  return (

    <div className="app">
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/user" element={<PrivateRoute requiredRole="admin" />}>
            <Route path="/user/Dashboard" element={<Dashboard />} />
            <Route path="/user/project" element={<Dashboard />} />
            <Route path="/user/invites" element={<Dashboard />} />
            <Route path="/user/chat" element={<Dashboard />} />
            <Route path="/user/profile" element={<Dashboard />} />
          </Route>
          <Route path="" element={<PrivateRoute requiredRole="admin" />}>
            <Route path="/user/project/:id" element={<ProjectDetail />} />
          </Route>
        </Routes>
      </Layout>
    </div>

  )
}

export default App



