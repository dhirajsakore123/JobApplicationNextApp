"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaRegUser } from "react-icons/fa";

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  experience: string;
  salary: string;
  description: string;
}

export default function JobsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  
  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     console.log("Client-side execution");
  //   }
  // }, []);

  useEffect(() => {
    const authenticateAndFetchJobs = async () => {
      try {
        await fetch("http://localhost:5000/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: "SketchMonk",
            password: "Admin@123",
            role: "admin",
          }),
        });

        const response = await fetch("http://localhost:5000/jobs");
        if (!response.ok) throw new Error("Failed to fetch jobs");

        const data: Job[] = await response.json();
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    authenticateAndFetchJobs();
  }, []);

  if (loading) return <div className="text-center mt-10">Loading jobs...</div>;

  return (
    <div className="min-h-screen p-6 relative">
      <div className="fixed inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d5c5ff,transparent)]"></div>
      </div>
      <h1 className="text-4xl font-bold text-center mb-8 text-blue-600">
        Find Your Dream Job ✨
      </h1>
      <button
        onClick={() => router.push("/login")}
        className="bg-gray-800 absolute flex items-center gap-2 top-5 right-5 text-white px-4 py-2 text-sm rounded-sm font-medium hover:bg-gray-900 transition duration-200"
      >
        <FaRegUser /> Login
      </button>
      <div className="max-w-4xl mx-auto space-y-6">
        {jobs.length === 0 ? (
          <p className="text-center text-gray-600">No jobs available</p>
        ) : (
          jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white p-6 shadow-lg rounded-xl border border-gray-200 hover:shadow-xl transition duration-300"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">{job.title}</h2>
                  <p className="text-gray-600">{job.company} - {job.location}</p>
                  <p className="mt-2 text-gray-500">
                    📅 Experience: <span className="font-medium">{job.experience}</span>
                  </p>
                  <p className="text-gray-500">
                    💰 Salary: <span className="font-medium">{job.salary}</span>
                  </p>
                  <p className="mt-3 text-gray-700 text-sm leading-relaxed">{job.description}</p>
                </div>
                <button 
                  onClick={() => router.push(`/jobs/${job._id}`)}
                  className="bg-blue-500 text-white px-5 py-2 text-sm rounded-sm font-medium hover:bg-blue-600 transition duration-200"
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
