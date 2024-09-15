import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation, useNavigate } from 'react-router-dom';
import UserTable from './components/UserTable';
import UserProfile from './components/UserProfile';
import CreateUserForm from './components/CreateUserForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


const queryClient = new QueryClient();

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const renderButton = () => {
    switch (location.pathname) {
      case '/':
        return (
          <Link 
            to="/create" 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
          >
            Create User
          </Link>
        );
      case '/create':
      case (location.pathname.match(/^\/user\/\d+$/) || {}).input:
        return (
          <button 
            onClick={() => navigate('/')}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
          >
            Back to User List
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-4xl font-extrabold text-gray-900">User Management</h1>
      {renderButton()}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-100 flex justify-center items-center">
          <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8">
            <Header />
            <Routes>
              <Route path="/" element={<UserTable />} />
              <Route path="/create" element={<CreateUserForm />} />
              <Route path="/user/:userId" element={<UserProfile  />} />
            </Routes>
          </div>
        </div>
      </Router>
    </QueryClientProvider>
  );
};

export default App;