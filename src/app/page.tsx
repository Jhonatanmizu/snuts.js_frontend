"use client";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
// Utils
import { cn } from "@/lib/utils";
// Components
import { Input } from "@/components/ui/input";
import Icon from "./common/components/Icon";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Loading from "./common/assets/Loading";
// Types
import { IHttpError, ISmell } from "./common/types";
// Stories
import useSmellStore from "@/store/smell.store";
// Service
import axiosInstance from "./common/services/axios.service";

type TableHead = {
  title: string;
};

const TABLE_HEADS: TableHead[] = [
  {
    title: "File",
  },
  {
    title: "Type",
  },
  {
    title: "StartLine",
  },
  {
    title: "EndLine",
  },
  {
    title: "It count",
  },
  {
    title: "Describe count",
  },
];

const Home = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const smells: ISmell[] = useSmellStore((state) => state.smells);
  const handleLoad = useSmellStore((state) => state.add);

  const handleAnalyzeToCSV = async (repositoryUrl: string) => {
    setIsLoading(true);
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
      toast({ title: "CSV loaded" });
    } catch (error) {
      const errorValue: IHttpError = error as IHttpError;
      const errorMessage = errorValue?.response?.data?.message as string;
      console.error("Error when we tried to handle analyze to csv", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyze = async (repositoryUrl: string) => {
    setIsLoading(true);
    try {
      const data = {
        repository: repositoryUrl,
        hasTestSmell: true,
      };
      const response = await axiosInstance.post("/", data);
      if (response.data && response.data.length > 0) {
        handleLoad(response.data);
        toast({ title: "Result loaded" });
      } else {
        toast({ title: "No smells found" });
      }
    } catch (error) {
      const errorValue: IHttpError = error as IHttpError;
      const errorMessage = errorValue?.response?.data?.message as string;
      console.error("Error when we tried to handle analyze");
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="w-full flex flex-1 flex-grow min-full items-center flex-col">
      <section className="flex flex-1 items-center justify-center h-full flex-col p-8 gap-8 w-full md:max-w-screen-lg ">
        <div className="flex items-center justify-center gap-6 flex-col">
          <h1 className="text-5xl font-bold">Explore</h1>
          <p className="text-2xl text-center">
            Refine Your Testing Strategy with Advanced Test Smell Analysis
          </p>
        </div>
        <div className="flex items-center justify-center w-full relative">
          <Input
            name="repository"
            required
            value={repositoryUrl}
            onChange={(event) => {
              setRepositoryUrl(event.target.value);
            }}
            onKeyDown={(event) => {
              const isEnter = event.key == "Enter";
              if (!isEnter) return;
              handleAnalyze(repositoryUrl);
            }}
            placeholder="Insert here the public project repository url"
            className={cn(
              "rounded-3xl h-12 text-foreground border-1 bg-primary  border-zinc-500 shadow-xl"
            )}
          />
          <Button
            disabled={!repositoryUrl || isLoading}
            className="absolute right-2  top-1 bottom-1 flex items-center justify-center rounded-full p-1"
            onClick={() => handleAnalyze(repositoryUrl)}
          >
            <Icon icon="ion:search" width={32} height={32} />
          </Button>
        </div>
        {isLoading ? (
          <div className=" flex flex-1 items-center justify-center">
            <Loading />
          </div>
        ) : (
          <>
            {smells.length > 0 && (
              <Table className={cn("bg-primary rounded-xl")}>
                <TableCaption>
                  A list of your test Smells detected in the current repository.
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    {TABLE_HEADS.map((th) => (
                      <TableHead key={th.title}>{th.title}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {smells.map((tr) => {
                    return (
                      <>
                        {tr.smells.map((sm) => (
                          <TableRow key={tr.file + Math.random() * 1000 + sm}>
                            <TableCell>{tr.file}</TableCell>
                            <TableCell>{tr.type}</TableCell>
                            <TableCell>{sm.startLine}</TableCell>
                            <TableCell>{sm.endLine}</TableCell>
                            <TableCell>{tr.info.itCount}</TableCell>
                            <TableCell>{tr.info.describeCount}</TableCell>
                          </TableRow>
                        ))}
                      </>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </>
        )}
        <Button
          className="rounded-xl w-full bg-secondary"
          disabled={!repositoryUrl || isLoading}
          onClick={() => handleAnalyzeToCSV(repositoryUrl)}
        >
          Get Csv
        </Button>
      </section>
    </main>
  );
};

export default Home;
