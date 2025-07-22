// NoFoundCard.jsx
import React from "react";
import { Card, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "@/components/ui/button";

const NoFoundCard = ({ clearFilters }) => {
  return (
    <Card className="flex flex-col h-[300px] w-[500px] mt-3  ">
      <CardHeader className="flex mt-3 ">
        <CardTitle className="flex  flex-col justify-center  items-center font-bold ">
          Oops No Job Found
          <span className="mt-5 text-7xl">&#128543;</span>
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex gap-2">
        <Button className="w-full text-xl" onClick={clearFilters}>
          Reset Filters
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NoFoundCard;
