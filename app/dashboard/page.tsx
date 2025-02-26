"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  experience: string;
  salary: string;
  applications:number
}

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const decodedToken: string = jwtDecode(token);
        const userId = decodedToken.userId;

        const response = await fetch(`http://localhost:5000/auth/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          fetchJobs(); // Fetch jobs after user is verified
        } else {
          Cookies.remove("token");
          router.push("/login");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        Cookies.remove("token");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch("http://localhost:5000/jobs");
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      } else {
        console.error("Failed to fetch jobs");
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this job?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/jobs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });

      if (response.ok) {
        setJobs(jobs.filter((job) => job._id !== id));
        alert("Job deleted successfully.");
      } else {
        alert("Failed to delete job.");
      }
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/login");
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-[#305aa8] to-[#99d2fe] text-white  shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Job Portal</h1>
          <div className="flex items-center space-x-6">
            {user && <p className="text-white font-medium">Welcome, {user.username}</p>}
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-1 rounded-sm hover:bg-red-600 transition duration-300 transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
            Welcome to Your Dashboard
          </h2>
          <button
            onClick={() => router.push("/create-job")}
            className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-8 py-2 rounded-sm hover:from-green-600 hover:to-teal-600 transition duration-300 transform hover:scale-105 shadow-lg"
          >
            Create Job Opening
          </button>
        </div>

        {/* Jobs List */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-700 mb-6 ">Your Job Listings</h3>
          {jobs.length === 0 ? (
            <p className="text-gray-500">No jobs posted yet.</p>
          ) : (
            <div className="grid gap-6">
              {jobs.map((job,index) => (
                <div key={index} className="p-6 bg-white shadow-lg text-black rounded-lg flex justify-between items-start">
                  <div>
                    <h4 className="text-xl font-bold">{job.title}</h4>
                    <p className="text-gray-500">{job.company} - {job.location}</p>
                    <p className="text-gray-600">Experience: {job.experience}</p>
                    <p className="text-gray-600">Salary: {job.salary}</p>
                    <div className="text-gray-600 mt-3"> <span className=" font-semibold">Applications:</span> {job.applications}  <button
                      onClick={() => router.push(`/applications/${job._id}`)}
                      className=" text-sm px-4 py-1 rounded-sm underline text-blue-500  transition"
                    >
                      Job Applications
                    </button> </div>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => router.push(`/edit-job/${job._id}`)}
                      className="bg-blue-500 text-white px-4 py-1 rounded-sm hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(job._id)}
                      className="bg-red-500 text-white px-4 py-1 rounded-sm hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
