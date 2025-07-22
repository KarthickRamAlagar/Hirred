import React from "react";
import { UserRound, FilePlus, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Autoplay from "embla-carousel-autoplay";
import { Crown } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Company from "../data/Company.json";
import faqs from "../data/faq.json";

const LandingPage = () => {
  return (
    <main className="flex flex-col gap-10 sm:gapp:20 py-10 sm:py-20">
      <section className="text-center">
        <h1
          className="flex flex-col items-center justify-center gradient-title 
        text-4xl font-extrabold sm:text-6xl lg:text-8xl tracking-tighter py-4 "
        >
          Find Your Dream Job!
          <span className="flex items-center gap-2 sm:gap-6">
            and get
            <img
              src="/logo.png"
              alt="HirrdLogo"
              className="h-14 sm:h-24 lg:h-24"
            />
          </span>
        </h1>
        <p className="text-gray-300 sm:mt-4 text-xs sm:text-xl ">
          Explore thousands of job listings or find the perfect candidate
        </p>
      </section>
      <div className="flex gap-6 justify-center">
        {/* buttons */}
        <Link to="/jobs">
          <Button variant="blue" size="xl">
            Find Jobs
            <span>
              <Briefcase />
            </span>
          </Button>
        </Link>
        <Link to="/post-job">
          <Button size="xl" variant="destructive">
            Post Jobs
            <span>
              <FilePlus />
            </span>
          </Button>
        </Link>
      </div>

      {/* carousel */}
      <Carousel
        className="w-full  py-10"
        opts={{ loop: true }}
        plugins={[
          Autoplay({
            delay: 1000,
          }),
        ]}
      >
        <CarouselContent className="flex gap-5 sm:gap-20 items-center">
          {Company.map(({ name, id, path }) => {
            return (
              <CarouselItem key={id} className="basis-1/3 lg:basis-1/6">
                <img
                  src={path}
                  alt={name}
                  className="h-9 sm:h-14 object-contain"
                />
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>

      {/* banner img */}
      <img src="/banner.jpeg" alt="banner" className="w-full" />

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex gap-2 ">
              For Employeers
              <span>
                <Crown className="text-gray-500" />
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Post jobs, manage applications and find the best candidates</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex gap-2 md:gap-1">
              For Job Seekers
              <span>
                <UserRound className="text-gray-500" />
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>Search and Apply for jobs,track applications aand more</p>
          </CardContent>
        </Card>
      </section>
      {/* Accordion */}
      <Accordion type="single" collapsible>
        {faqs.map((faq, index) => {
          return (
            <AccordionItem key={index} value={`item-${index + 1}`}>
              <AccordionTrigger className="text-xl">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-lg">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </main>
  );
};

export default LandingPage;
