import React, { useState, useEffect } from 'react';

const DONATION_URL = "https://arkad-server.onrender.com/users/donations";

const Donations = () => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('254');
  const [amount, setAmount] = useState('');
  const [mpesaReceiptNumber, setMpesaReceiptNumber] = useState('');
  const [donations, setDonations] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [token, setToken] = useState('');
  const [endDate, setEndDate] = useState('');
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken');
    if (storedAccessToken) setToken(JSON.parse(storedAccessToken));
  }, []);

  // Handle submitting new donation
  const handleSubmit = async () => {
    if (!token) return;

    // Validate Mpesa receipt number: alphanumeric and uppercase only
    const isAlphanumeric = /^[A-Z0-9]+$/;
    if (!isAlphanumeric.test(mpesaReceiptNumber)) {
      setError("Mpesa Receipt Number must be alphanumeric only.");
      setTimeout(() => setError(""), 5000);
      return;
    }

    if (fullName && phoneNumber && amount && mpesaReceiptNumber) {
      setLoading(true);
      try {
        const response = await fetch(DONATION_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fullName,
            phoneNumber,
            amount: parseFloat(amount),
            mpesaReceiptNumber: mpesaReceiptNumber.toUpperCase(), // Ensure uppercase
          }),
        });
        const result = await response.json();

        if (response.ok) {
          setSuccess('Donation submitted successfully!');
          setTimeout(() => setSuccess(""), 5000);
          setFullName('');
          setPhoneNumber('254');
          setAmount('');
          setMpesaReceiptNumber('');
        } else {
          setError(`Submission failed: ${result.message}`);
          setTimeout(() => setError(""), 5000);
        }
      } catch (error) {
        console.error('Error submitting donation:', error);
        setError('An error occurred while submitting the donation.');
        setTimeout(() => setError(""), 5000);
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please fill in all fields.');
    }
  };

  // Handle fetching donations by date range
  const handleFetchDonations = async () => {
    if (!token) return;
    if (!startDate || !endDate) {
      alert('Please select both start and end dates.');
      return;
    }
    setLoad(true);

    try {
      const response = await fetch(`${DONATION_URL}?startDate=${startDate}&endDate=${endDate}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      });
      const data = await response.json();

      if (response.ok) {
        setDonations(data.transactions || []);
      } else {
        alert(`Failed to fetch donations: ${data.message}`);
      }
    } catch (error) {
      console.error('Error fetching donations:', error);
      setError('An error occurred while fetching donations.');
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoad(false);
    }
  };

  // Helper function to format dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl flex justify-center items-center font-bold text-[#006D5B] mb-4">Donation Submission</h1>

      <div className="flex flex-col gap-4 mb-8">
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="border p-2"
        />
        <input
          type="text"
          placeholder="Phone Number (e.g., 2547xxxxxxxx)"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="border p-2"
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="border p-2"
        />
        <input
          type="text"
          placeholder="Mpesa Receipt Number"
          value={mpesaReceiptNumber}
          onChange={(e) => setMpesaReceiptNumber(e.target.value.toUpperCase())} // Convert to uppercase as user types
          className="border p-2"
        />
        <button
          onClick={handleSubmit}
          className="bg-[#006D5B] text-white p-2 rounded hover:bg-[#004d40]"
        >
          {loading ? "Sending..." : "Submit"}
        </button>
      </div>

      {error && (
        <div className="text-red-500 mt-2 text-sm text-center">{error}</div>
      )}
      {success && (
        <div className="text-green-600 mt-2 text-sm text-center">{success}</div>
      )}

      <h2 className="text-xl font-bold mb-4">Fetch Donations by Date Range</h2>
      <div className="flex gap-4 mb-4">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2"
        />
        <button
          onClick={handleFetchDonations}
          className="bg-[#006D5B] text-white p-2 rounded hover:bg-[#004d40]"
        >
          {load ? "Getting Donations..." : "Get Donations"}
        </button>
      </div>

      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="py-2 px-4 border">Transaction ID</th>
            <th className="py-2 px-4 border">Full Name</th>
            <th className="py-2 px-4 border">Phone Number</th>
            <th className="py-2 px-4 border">Amount</th>
            <th className="py-2 px-4 border">Mpesa Receipt Number</th>
            <th className="py-2 px-4 border">Date</th>
          </tr>
        </thead>
        <tbody>
          {donations.map((donation, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border">{donation.transactionId}</td>
              <td className="py-2 px-4 border">{donation.fullName}</td>
              <td className="py-2 px-4 border">{donation.phoneNumber}</td>
              <td className="py-2 px-4 border">{donation.amount}</td>
              <td className="py-2 px-4 border">{donation.mpesaReceiptNumber}</td>
              <td className="py-2 px-4 border">{formatDate(donation.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Donations;
