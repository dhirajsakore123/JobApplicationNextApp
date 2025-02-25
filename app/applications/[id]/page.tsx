"use client"

import withAuth from "@/components/withAuth";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Application {
  id: string;
  name: string;
  email: string;
  status: string;
  resume: string;
  expectedCTC: number;
  currentCTC: number;
  applicationDate: string;
  otherDetails: string;
  coverLetter: string;
}

function JobApplications() {
  const params = useParams();
  const router = useRouter();
  const jobId = params?.id as string;
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"Pending" | "Shortlisted" | "Rejected">("Pending");
  const fetchApplications = async () => {
    try {
      const res = await fetch(`http://localhost:5000/applications?jobId=${jobId}`);
      const text = await res.text();

      try {
        const data = JSON.parse(text);
        setApplications(data);
      } catch (jsonError) {
        throw new Error(`Invalid JSON: ${text}`);
      }
    } catch (error) {
      setError(error.message);
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (!jobId) return;

  

    fetchApplications();
  }, []);
  
  const handleStatusChange = async (applicationId: string, newStatus: "Rejected" | "Shortlisted") => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId ? { ...app, status: newStatus } : app
      )
    );
  
    try {
      const res = await fetch(`http://localhost:5000/applications/${applicationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if(res.status === 200){
        fetchApplications()
      }
  
      if (!res.ok) {
        throw new Error(`Failed to update application status: ${res.statusText}`);
      }

    } catch (error) {
      console.error("Error updating application status:", error);
      alert("Failed to update application status. Please try again.");
  
      // Revert state if the request fails
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status: app.status } : app
        )
      );
    }
  };
  
  

  const filteredApplications = applications.filter((app) => {
    if (activeTab === "Pending") return app.status === "Pending";
    if (activeTab === "Shortlisted") return app.status === "Shortlisted";
    if (activeTab === "Rejected") return app.status === "Rejected";
    return true;
  });

  if (loading) return <p>Loading applications...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-3xl mx-auto p-4 text-gray-900">
        {/* <div className=" flex gap-5 items-center border"> */}
        <button
          onClick={() => router.push("/dashboard")}
          className="block mt-6 border bg-blue-500 text-white py-1 px-4  hover:underline"
        >
          ⬅ Back to Jobs
        </button>
        <p className="text-2xl font-bold ">Applications for Job</p>
     
        {/* </div> */}
      
      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("Pending")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "Pending"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setActiveTab("Shortlisted")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "Shortlisted"
              ? "border-b-2 border-green-500 text-green-500"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Shortlisted
        </button>
        <button
          onClick={() => setActiveTab("Rejected")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "Rejected"
              ? "border-b-2 border-red-500 text-red-500"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Rejected
        </button>
      </div>

      {/* Application List */}
      {filteredApplications.length === 0 ? (
        <p>No {activeTab.toLowerCase()} applications found.</p>
      ) : (
        <ul className="space-y-4">
          {filteredApplications.map((app,index) => (
            <li
              key={index}
              className="p-6 text-sm bg-white border border-gray-200 rounded-lg shadow-lg"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-semibold">{app.name}</h3>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded-full ${
                    app.status === "Accepted"
                      ? "bg-green-100 text-green-800"
                      : app.status === "Rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {app.status}
                </span>
              </div>

              <p className="text-gray-700">
                <strong>Email:</strong> {app.email}
              </p>
              <p className="text-gray-700">
                <strong>Current Expectation:</strong> ₹{app.currentCTC.toLocaleString()}
              </p>
              <p className="text-gray-700">
                <strong>Salary Expectation:</strong> ₹{app.expectedCTC.toLocaleString()}
              </p>

              {app.applicationDate && (
                <p className="text-gray-700">
                  <strong>Applied Date:</strong> {new Date(app.applicationDate).toLocaleDateString()}
                </p>
              )}

              {app.otherDetails && (
                <p className="text-gray-700">
                  <strong>Additional Details:</strong> {app.otherDetails}
                </p>
              )}

              {app.coverLetter && (
                <p className="text-gray-700">
                  <strong>Cover Letter:</strong> {app.coverLetter}
                </p>
              )}

              <div className="mt-4 flex justify-between items-center">
                <a
                  href={`http://localhost:5000${app.resume}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  📄 View Resume
                </a>
                <div className="space-x-2">
                  <button
                    onClick={() => handleStatusChange(app._id, "Rejected")}
                    className="px-4 py-2 bg-red-500 text-white rounded-sm hover:bg-red-600 transition"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleStatusChange(app._id, "Shortlisted")}
                    className="px-4 py-2 bg-green-500 text-white rounded-sm hover:bg-green-600 transition"
                  >
                    Shortlist
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default withAuth(JobApplications)