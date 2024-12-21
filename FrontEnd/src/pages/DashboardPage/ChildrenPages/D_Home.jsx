import React from 'react'

function D_Home() {
  return (
    <>
      <div className="dashboard-search-notification-profile">
        <div className="dashboard-search">
          <i className="ri-search-eye-line"></i>
          <input type="text" />
        </div>
        <div className="dashboard-notification-profile">
          <div className="dashboard-notification">
            <i className="ri-notification-3-line"></i>
          </div>
          <div className="dashboard-search-profile">
            <img src="https://images.unsplash.com/photo-1731505103716-7ee6fa96dee5?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="" />
          </div>
        </div>
      </div>

      <div className="dashboard-header">
        <h1>Hi, Welcome back</h1>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="ri-android-line"></i>
          </div>
          <div className="stat-info">
            <h2>714k</h2>
            <p>Weekly Sales</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="ri-apple-line"></i>
          </div>
          <div className="stat-info">
            <h2>1.35m</h2>
            <p>New Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="ri-windows-line"></i>
          </div>
          <div className="stat-info">
            <h2>1.72m</h2>
            <p>Item Orders</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="ri-bug-line"></i>
          </div>
          <div className="stat-info">
            <h2>234</h2>
            <p>Bug Reports</p>
          </div>
        </div>
      </div>

      <div className="dashboard-charts">
        <div className="chart-card">
          <h3>Website Visits</h3>
          <div className="chart-placeholder"></div>
        </div>
        <div className="chart-card">
          <h3>Current Visits</h3>
          <div className="chart-placeholder"></div>
        </div>
      </div>
    </>
  )
}

export default D_Home