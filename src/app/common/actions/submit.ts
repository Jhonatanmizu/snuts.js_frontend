"use client";
import useSmellStore from "@/store/smell.store";

import { revalidatePath } from "next/cache";
import z from "zod";
import axiosInstance from "../services/axios.service";

const schema = z.object({
  repository: z.coerce.string().min(5, "You should pass a repository"),
});

const handleAnalyze = async (formData: FormData) => {
  const parsedData = schema.parse({
    repository: formData.get("repository"),
  });
  try {
    const data = {
      repository: parsedData.repository,
      hasTestSmell: true,
    };
    const response = await axiosInstance.post("/", data);
    useSmellStore.getState().add(response.data.data);
    // revalidatePath("/");
  } catch (error) {
    console.error("Error when we tried to handle analyze", error);
  }
};

const handleAnalyzeToCSV = async (repositoryUrl: string) => {
  try {
    const data = {
      repository: repositoryUrl,
      hasTestSmell: true,
    };
    const response = await axiosInstance.post("/export-csv", data);
    const blob = response.data;
    const url = window.URL.createObjectURL(new Blob([blob]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "output.csv");
    document.body.appendChild(link);
    link.click();
    if (link.parentNode) link.parentNode?.removeChild(link);
  } catch (error) {
    console.error("Error when we tried to handle analyze to csv", error);
  }
};

export { handleAnalyze, handleAnalyzeToCSV };
