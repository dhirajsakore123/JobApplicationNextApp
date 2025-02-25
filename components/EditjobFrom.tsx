"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface JobFormProps {
  jobId?: string; // Optional for edit mode
}

const EditJobForm = ({ jobId }: JobFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(!!jobId);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    experience: "",
    salary: "",
    description: "",
    responsibilities: [""],
  });

  useEffect(() => {
    if (jobId) {
      fetch(`http://localhost:5000/jobs/${jobId}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching job:", error);
          setError("Failed to fetch job details.");
          setLoading(false);
        });
    }
  }, [jobId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleResponsibilityChange = (index: number, value: string) => {
    const updatedResponsibilities = [...formData.responsibilities];
    updatedResponsibilities[index] = value;
    setFormData((prev) => ({
      ...prev,
      responsibilities: updatedResponsibilities,
    }));
  };

  const addResponsibility = () => {
    setFormData((prev) => ({
      ...prev,
      responsibilities: [...prev.responsibilities, ""],
    }));
  };

  const removeResponsibility = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const url =`http://localhost:5000/jobs/${jobId}`

    const method = "PATCH";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(
          jobId ? "Failed to update job." : "Failed to create job."
        );
      }

      alert(jobId ? "Job updated successfully!" : "Job created successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading job details...</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10 mb-10 text-black">
      <h2 className="text-2xl font-semibold text-center mb-4">
        {jobId ? "Edit Job" : "Create Job"}
      </h2>
      {error && <p className="text-red-500 text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
        <input
          type="text"
          name="company"
          placeholder="Company Name"
          value={formData.company}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
        <input
          type="text"
          name="experience"
          placeholder="Experience Required"
          value={formData.experience}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
        <input
          type="text"
          name="salary"
          placeholder="Salary Range"
          value={formData.salary}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />
        <textarea
          name="description"
          placeholder="Job Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg"
          required
        />

        <div>
          <h3 className="text-lg font-semibold mb-2">Responsibilities</h3>
          {formData.responsibilities.map((res, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={res}
                onChange={(e) => handleResponsibilityChange(index, e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removeResponsibility(index)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  ✖
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addResponsibility}
            className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-sm"
          >
            + Add Responsibility
          </button>
        </div>

        <div className="flex  gap-2">
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-sm"
            disabled={loading}
          >
            {loading ? "Submitting..." : jobId ? "Update Job" : "Create Job"}
          </button>
          <button
            type="button"
            className="w-full bg-red-500 text-white py-2 rounded-sm"
            onClick={() => router.push("/dashboard")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditJobForm;
