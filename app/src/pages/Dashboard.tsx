// src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { Container } from "../components/common/Container";
import { Button } from "../components/common/Button";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

interface UserData {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const { signOut } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await api.get<UserData>("/users/me");

        setUserData(response.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-4">
        <h2 className="text-red-800 text-lg font-medium mb-2">
          Error Loading Data
        </h2>
        <p className="text-red-700">{error}</p>
        <button
          className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-md transition-colors"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow">
          <Container className="py-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <Button onClick={signOut} variant="primary">
                Sign Out
              </Button>
            </div>
          </Container>
        </header>

        <main className="py-6">
          <Container>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-lg font-medium text-gray-900">
                  Welcome, {userData?.name}!
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  This is your protected dashboard. Only authenticated users can
                  view this page.
                </p>

                <div className="mt-6">
                  <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Full name
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {userData?.name}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      Email address
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {userData?.email}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">id</dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {userData?._id}
                    </dd>
                  </div>
                  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      createdAt
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      {userData?.createdAt &&
                        new Date(userData?.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                    </dd>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
