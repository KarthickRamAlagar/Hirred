import { useUser } from "@clerk/clerk-react";
import ApplicationCard from "./applicationCard";
import { useEffect, useState } from "react";
import { getApplications } from "@/api/apiApplications";
import useFetch from "@/hooks/useFetch";
import { BarLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";

import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PER_PAGE = 6;

const CreatedApplications = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const {
    loading: loadingApplications,
    data: applications = [],
    fn: fnApplications,
  } = useFetch(getApplications, {
    user_id: user.id,
  });

  useEffect(() => {
    fnApplications();
  }, []);

  const totalPages = Math.ceil(applications.length / PER_PAGE);
  const paginatedApplications = applications.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loadingApplications) {
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;
  }

  return (
    <div className="pb-10">
      {applications.length === 0 ? (
        <Card className="flex flex-col h-[300px] w-[350px] mt-3 mx-auto lg:mx-[22rem] lg:w-[500px]">
          <CardHeader className="flex mt-3">
            <CardTitle className="flex flex-col justify-center items-center font-bold">
              Yet to Apply !<span className="mt-5 text-7xl">&#128543;</span>
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
      ) : (
        <>
          {/* Applications list */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
            {paginatedApplications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                isJobseeker={true}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-6 justify-center">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={currentPage === i + 1}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
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

export default CreatedApplications;
