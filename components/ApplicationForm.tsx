"use client";
import { useRef, useState } from "react";

interface ApplicationFormProps {
  jobId: string;
}

export default function ApplicationForm({ jobId }: ApplicationFormProps) {
  const formDataRef = useRef(new FormData());
  const [fileName, setFileName] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    formDataRef.current.set(name, value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      formDataRef.current.set("resume", file);
      setFileName(file.name); // Show file name
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formDataRef.current.get("resume")) {
      alert("Please upload your resume.");
      return;
    }

    formDataRef.current.set("jobId", jobId);

    try {
      const response = await fetch("http://localhost:5000/applications", {
        method: "POST",
        body: formDataRef.current,
      });

      if (!response.ok) {
        throw new Error("Failed to submit application");
      }
      const result = await response.json();
      console.log("Application submitted successfully:", result);

      // Reset form
      formDataRef.current = new FormData();
      setFileName("");
      alert("Application submitted successfully!");
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Failed to submit application. Please try again.");
    }
  };

  return (
    <div className="max-w-lg w-full bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4 text-blue-600">Apply for Job</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="Full Name" onChange={handleChange} required className="w-full p-2 border rounded-lg text-black" />
        <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required className="w-full p-2 border rounded-lg text-black" />
        <input type="text" name="experience" placeholder="Years of Experience" onChange={handleChange} required className="w-full p-2 border rounded-lg text-black" />
        <input type="text" name="currentCTC" placeholder="Current CTC (in $)" onChange={handleChange} required className="w-full p-2 border rounded-lg text-black" />
        <input type="text" name="expectedCTC" placeholder="Expected CTC (in $)" onChange={handleChange} required className="w-full p-2 border rounded-lg text-black" />
        <textarea name="otherDetails" placeholder="Other Details" onChange={handleChange} required className="w-full p-2 border rounded-lg text-black"></textarea>
        
        <div className="w-full p-2 border rounded-lg text-black">
          <input type="file" name="resume" accept=".pdf,.doc,.docx" onChange={handleFileChange} required className="hidden" id="resume-upload" />
          <label htmlFor="resume-upload" className="cursor-pointer block text-blue-600 hover:underline">
            {fileName ? `Selected: ${fileName}` : "Upload Resume"}
          </label>
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition">Submit Application</button>
      </form>
    </div>
  );
}
