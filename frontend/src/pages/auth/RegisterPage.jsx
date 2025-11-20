import { Link } from 'react-router-dom';

const RegisterPage = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full text-center">
        <h2 className="text-2xl font-bold">Registration Disabled</h2>
        <p className="text-gray-600 mt-4">
          Registration is disabled. To get an account, please contact the site
          administrator.
        </p>
        <div className="mt-6">
          <Link to="/login" className="btn-primary">
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
