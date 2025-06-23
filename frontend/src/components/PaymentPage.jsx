import { useLocation } from "react-router-dom";

const PaymentPage = () => {
  const location = useLocation();
  const { user } = location.state || {};

  return (
    <div>
      <h1>Payment Page</h1>
      {user && (
        <div>
          <p>User: {user.name}</p>
          <p>User ID: {user._id}</p>
        </div>
      )}
    </div>
  );
};
