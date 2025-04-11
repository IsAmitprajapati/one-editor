"use client";
import { useParams } from "next/navigation";
import React from "react";

const BrowserPage = () => {
  const { username, projectId, fileName } = useParams();

  console.log("browser page", username, projectId, fileName);

  return (
    <iframe
      className="w-full h-full min-h-screen min-w-screen"
      src={`${process.env.NEXT_PUBLIC_BASE_URL}/api/file/${projectId}/${fileName}`}
    />
  );
};

export default BrowserPage;
