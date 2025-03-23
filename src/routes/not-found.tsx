import { useNavigate } from "react-router";

const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#101828] text-white text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl mb-2">Page Not Found</h2>
      <p className="mb-6">
        Sorry, the page you are looking for i still in development
      </p>
      <button
        onClick={handleGoHome}
        className="bg-[#00bfff] text-white font-semibold py-2 px-4 rounded hover:bg-[#0091e0] transition duration-200"
      >
        Go back
      </button>
    </div>
  );
};

export default NotFoundPage;
