import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";

import { getSavedJobs } from "@/api/apiJobs";
import JobCard from "@/components/jobCard";
import useFetch from "@/hooks/useFetch";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

const PER_PAGE = 6;

const SavedJobs = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const {
    loading: loadingSavedJobs,
    data: savedJobs = [],
    fn: fnSavedJobs,
  } = useFetch(getSavedJobs);

  useEffect(() => {
    if (isLoaded && user?.unsafeMetadata?.role === "jobseeker") {
      fnSavedJobs();
    }
  }, [isLoaded]);

  const totalPages = Math.ceil(savedJobs.length / PER_PAGE);
  const paginatedSavedJobs = savedJobs.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (!isLoaded || loadingSavedJobs) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  if (user?.unsafeMetadata?.role !== "jobseeker") {
    return (
      <Card className="flex flex-col h-[300px] w-[400px] mt-[5rem] mx-auto lg:mx-[22rem] lg:w-[500px]">
        <CardHeader className="flex mt-3">
          <CardTitle className="flex flex-col justify-center items-center font-bold text-center">
            Access Denied
            <span className="mt-5 text-6xl">🚫</span>
            <p className="text-base mt-3 px-4">
              This page is only available to jobseekers.
            </p>
          </CardTitle>
        </CardHeader>
        <CardFooter>
          <Button className="w-full" onClick={() => navigate("/my-jobs")}>
            Your Job Listings
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
        Saved Jobs
      </h1>

      {savedJobs.length > 0 ? (
        <>
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedSavedJobs.map((saved) => (
              <JobCard
                key={saved.id}
                job={saved?.job}
                onJobAction={fnSavedJobs}
                savedInit={true}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination className="mt-12 justify-center">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={() => handlePageChange(currentPage - 1)}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === i + 1}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={() => handlePageChange(currentPage + 1)}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      ) : (
        <Card className="flex flex-col h-[300px] w-[350px] mt-3 mx-auto lg:mx-[22rem] lg:w-[500px]">
          <CardHeader className="flex mt-3 ">
            <CardTitle className="flex flex-col justify-center items-center font-bold ">
              Yet to Save Jobs!
              <span className="mt-5 text-7xl">&#128543;</span>
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex gap-2">
            <Button
              className="w-full text-xl"
              onClick={() => navigate("/jobs")}
            >
              Browse Jobs
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default SavedJobs;
