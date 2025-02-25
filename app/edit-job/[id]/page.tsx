"use client"

import { use } from "react";
import EditJobForm from "@/components/EditjobFrom";
import withAuth from "@/components/withAuth";

const EditJob = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params); 

  return (
    <div className="bg-white">
      <EditJobForm jobId={id} />
    </div>
  );
};

export default withAuth(EditJob);
