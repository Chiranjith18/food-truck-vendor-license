import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

import Home from './components/Home';
import Navbar from './components/NavBar';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
import Unauthorized from './components/Unauthorized';

import ApplyForm from './components/ApplyForm';
import VendorDashboard from './components/VendorDashboard';
import VendorProfile from './components/VendorProfile';
import VendorApplication from './components/VendorApplication';

import ReviewerDashboard from './components/ReviewerDashboard';
import InspectorDashboard from './components/InspectorDashboard';
import AdminDashboard from './components/AdminDashboard';
import AuditLogs from './components/AuditLogs';
import DisplayFoodTruck from './components/DisplayFoodTruck';
import SuperAdminDashboard from './components/SuperAdminDashboard';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Navbar />
                <div className="content">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/unauthorized" element={<Unauthorized />} />

                        <Route path="/" element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        } />

                        <Route path="/superadmin" element={
                            <ProtectedRoute roles={['SUPER_ADMIN']}>
                                <SuperAdminDashboard />
                            </ProtectedRoute>
                        } />

                        <Route path="/apply" element={
                            <ProtectedRoute roles={['VENDOR']}>
                                <ApplyForm />
                            </ProtectedRoute>
                        } />

                        <Route path="/vendor/profile" element={
                            <ProtectedRoute roles={['VENDOR']}>
                                <VendorProfile />
                            </ProtectedRoute>
                        } />

                        <Route path="/vendor/application" element={
                            <ProtectedRoute roles={['VENDOR']}>
                                <VendorApplication />
                            </ProtectedRoute>
                        } />

                        <Route path="/vendor/dashboard" element={
                            <ProtectedRoute roles={['VENDOR']}>
                                <VendorDashboard />
                            </ProtectedRoute>
                        } />

                        <Route path="/reviewer/dashboard" element={
                            <ProtectedRoute roles={['REVIEWER']}>
                                <ReviewerDashboard />
                            </ProtectedRoute>
                        } />

                        <Route path="/inspector/dashboard" element={
                            <ProtectedRoute roles={['INSPECTOR']}>
                                <InspectorDashboard />
                            </ProtectedRoute>
                        } />

                        <Route path="/getAllVendors" element={
                            <ProtectedRoute roles={['ADMIN','REVIEWER','INSPECTOR']}>
                                <DisplayFoodTruck />
                            </ProtectedRoute>
                        } />

                        <Route path="/admin/dashboard" element={
                            <ProtectedRoute roles={['ADMIN']}>
                                <AdminDashboard />
                            </ProtectedRoute>
                        } />

                        <Route path="/admin/audit-logs" element={
                            <ProtectedRoute roles={['ADMIN']}>
                                <AuditLogs />
                            </ProtectedRoute>
                        } />
                    </Routes>
                </div>
                <Footer />
            </Router>
        </AuthProvider>
    );
}

export default App;
