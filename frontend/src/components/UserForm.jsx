import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserForm = () => {
  const [formdata, setFormdata] = useState({
    name: "",
    email: "",
    number: "",
  });

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
    
    // Clear error message when user starts typing
    if (message && !success) {
      setMessage("");
      setSuccess(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccess(null);

    try {
      const res = await axios.post("https://razorpay-integration-1-ogch.onrender.com/api/users/create", formdata);
      if (res.data.success) {
        setSuccess(true);
        setMessage("User created successfully!");
        setFormdata({ name: "", email: "", number: "" });
        console.log("res.data.data", res.data.data);
        console.log("res.data.data[0]", res.data.data[0]);
        navigate("/payment", { state: { user: res.data.data[0] } });
      } else {
        setSuccess(false);
        
        // Check if there are specific field validation errors
        if (res.data.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
          // Extract specific field error messages
          const fieldErrors = res.data.data
            .filter(error => error.type === "field" && error.msg)
            .map(error => error.msg);
          
          if (fieldErrors.length > 0) {
            setMessage(fieldErrors.join(", "));
          } else {
            setMessage(res.data.message || "Something went wrong.");
          }
        } else {
          setMessage(res.data.message || "Something went wrong.");
        }
      }
    } catch (err) {
      setSuccess(false);
      
      // Handle error response with field validation errors
      if (err.response?.data?.data && Array.isArray(err.response.data.data) && err.response.data.data.length > 0) {
        const fieldErrors = err.response.data.data
          .filter(error => error.type === "field" && error.msg)
          .map(error => error.msg);
        
        if (fieldErrors.length > 0) {
          setMessage(fieldErrors.join(", "));
        } else {
          setMessage(err.response?.data?.message || "An error occurred.");
        }
      } else {
        setMessage(err.response?.data?.message || "An error occurred.");
      }
    }
  };

  return (
    <div className="min-h-screen from-slate-100 via-white to-slate-200 flex justify-center items-center px-4 bg-gray-600">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">Register Now</h2>

        {message && (
          <div
            className={`text-center py-2 px-4 mb-4 rounded-md text-sm ${
              success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formdata.name}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Your full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formdata.email}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              name="number"
              value={formdata.number}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="10-digit number"
              maxLength={10}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md font-medium transition duration-200"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserForm;