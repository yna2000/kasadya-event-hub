
import React from 'react';
import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Vendors from "./pages/Vendors";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import VendorServicePage from "./pages/VendorServicePage";
import OtpVerification from "./pages/OtpVerification";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/about" element={<Layout><About /></Layout>} />
      <Route path="/services" element={<Layout><Services /></Layout>} />
      <Route path="/vendors" element={<Layout><Vendors /></Layout>} />
      <Route path="/vendor/:vendorId" element={<Layout><VendorServicePage /></Layout>} />
      <Route path="/contact" element={<Layout><Contact /></Layout>} />
      <Route path="/login" element={<Layout><Login /></Layout>} />
      <Route path="/register" element={<Layout><Register /></Layout>} />
      <Route path="/verify-otp" element={<Layout><OtpVerification /></Layout>} />
      <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
      <Route path="/admin" element={<Layout><AdminDashboard /></Layout>} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<Layout><NotFound /></Layout>} />
    </Routes>
  );
};

export default AppRoutes;
