import { getMyJobs } from "@/api/apiJobs";
import useFetch from "@/hooks/useFetch";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import JobCard from "./JobCard";
import { useEffect, useState } from "react";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/Pagination";

const PER_PAGE = 6;

const CreatedJobs = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const {
    loading: loadingCreatedJobs,
    data: createdJobs = [],
    fn: fnCreatedJobs,
  } = useFetch(getMyJobs, {
    employeer_id: user.id,
  });

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fnCreatedJobs();
  }, []);

  const totalPages = Math.ceil(createdJobs.length / PER_PAGE);
  const currentJobs = createdJobs.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      {loadingCreatedJobs ? (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      ) : (
        <>
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentJobs.length > 0 ? (
              currentJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onJobAction={fnCreatedJobs}
                  isMyJob
                />
              ))
            ) : (
              <Card className="flex flex-col h-[300px] w-[500px] mt-3 mx-auto">
                <CardHeader className="flex mt-3">
                  <CardTitle className="flex flex-col justify-center items-center font-bold">
                    Yet to Save Jobs!
                    <span className="mt-5 text-7xl">&#128543;</span>
                  </CardTitle>
                </CardHeader>
                <CardFooter className="flex gap-2">
                  <Button
                    className="w-full text-xl"
                    onClick={() => navigate("/post-job")}
                  >
                    Post Jobs
                  </Button>
                </CardFooter>
              </Card>
            )}
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
      )}
    </div>
  );
};

export default CreatedJobs;
