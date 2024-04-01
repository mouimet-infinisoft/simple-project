// ConnectionStringForm.tsx
import React, { useState } from 'react';

const AddDatabase: React.FC = () => {
  const [connectionString, setConnectionString] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Here, you would handle the connection string, such as storing it or using it to connect to a database.
    console.log(connectionString);
    alert(`Connection string submitted: ${connectionString}`);
    // Reset the input field
    setConnectionString('');
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded-lg shadow-md overflow-hidden md:max-w-lg">
      <div className="md:flex">
        <div className="w-full p-4">
          <div className="mb-4">
            <h1 className="font-bold text-lg">Database Connection</h1>
            <p>Enter your database connection string below:</p>
          </div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="w-full px-3 py-2 mb-3 text-base text-gray-700 placeholder-gray-600 border rounded-lg focus:shadow-outline"
              placeholder="Database connection string"
              value={connectionString}
              onChange={(e) => setConnectionString(e.target.value)}
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDatabase;
