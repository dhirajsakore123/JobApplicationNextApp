"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ApplicationForm from "@/components/ApplicationForm";

interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  experience: string;
  salary: string;
  description: string;
  responsibilities: string[];
}

export default function JobDetail({ params }: { params: { id: string } }) {
  const { id } = use(params);
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`http://localhost:5000/jobs/${id}`);
        if (!res.ok) throw new Error("Job not found");
        const data = await res.json();
        setJob(data);
      } catch (err) {
        setError("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) {
    return <h1 className="text-center mt-10 text-blue-500 text-xl">Loading...</h1>;
  }

  if (error || !job) {
    return <h1 className="text-center mt-10 text-red-500 text-xl">{error || "Job not found"}</h1>;
  }

  return (
    <div className="min-h-screen  p-6 relative">
           <div className="fixed  inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"><div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d5c5ff,transparent)]"></div></div>

      <div className="max-w-3xl mx-auto bg-white p-6 shadow-md rounded-lg">
        <h1 className="text-3xl font-bold text-blue-500">{job.title}</h1>
        <p className="text-gray-600">{job.company} - {job.location}</p>
        <p className="text-gray-500 mt-2">📅 Experience: {job.experience}</p>
        <p className="text-gray-500">💰 Salary: {job.salary}</p>
        <p className="mt-4 text-gray-800">{job.description}</p>

        <h3 className="mt-6 text-xl font-semibold text-gray-500">Responsibilities:</h3>
        <ul className="list-disc pl-5 mt-2 text-gray-700">
          {job.responsibilities.map((resp, index) => (
            <li key={index}>{resp}</li>
          ))}
        </ul>

        <div className="grid place-content-center p-4">
          <ApplicationForm jobId={job._id} />
        </div>

        <button
          onClick={() => router.push("/")}
          className="block mt-6 text-blue-500 hover:underline"
        >
          ⬅ Back to Jobs
        </button>
      </div>
    </div>
  );
}
