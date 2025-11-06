import './NavBar.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => { 
        logout(); 
        navigate('/login'); 
    };

    return (
        <nav>
            <h2>Food Truck Vendor Application</h2>
            <ul>
                {user ? (
                    <>
                        <li><Link to="/">Home</Link></li>
                        {user.role === 'VENDOR' && (
                            <>
                                <li><Link to="/vendor/profile">Profile</Link></li>
                                <li><Link to="/vendor/application">Application</Link></li>
                                <li><Link to="/vendor/dashboard">My Applications</Link></li>
                            </>
                        )}
                        {user.role === 'REVIEWER' && (
                            <li><Link to="/reviewer/dashboard">Review Tasks</Link></li>
                        )}
                        {user.role === 'INSPECTOR' && (
                            <li><Link to="/inspector/dashboard">Inspection Tasks</Link></li>
                        )}
                        {(user.role === 'ADMIN' || user.role === 'REVIEWER' || user.role === 'INSPECTOR') && (
                            <li><Link to="/getAllVendors">Vendor Details</Link></li>
                        )}
                        {user.role === 'ADMIN' && (
                            <>
                                <li><Link to="/admin/dashboard">Admin Dashboard</Link></li>
                                <li><Link to="/admin/audit-logs">Audit Logs</Link></li>
                            </>
                        )}
                        {user.role === 'SUPER_ADMIN' && (
                            <li><Link to="/superadmin">Super Admin Panel</Link></li>
                        )}
                        <li>
                            <button onClick={handleLogout}>Logout</button>
                        </li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;
