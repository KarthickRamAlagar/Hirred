import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Link, useSearchParams } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignIn,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { BriefcaseBusiness, Heart, PenBox } from "lucide-react";
const Header = () => {
  const [show, setShow] = useState(false);
  const [search, setSearch] = useSearchParams();
  const { user } = useUser();
  useEffect(() => {
    if (search.get("sign-in")) {
      setShow(true);
    }
  }, [search]);
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShow(false);
      setSearch({});
    }
  };

  useEffect(() => {
    if (show) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    // Cleanup on unmount
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [show]);

  return (
    <>
      <nav
        className={`py-4 px-4 flex ${
          user?.unsafeMetadata?.role === "employeer"
            ? "flex-col gap-6 md:flex-row md:items-center md:justify-between"
            : "flex-row items-center justify-between"
        }`}
      >
        {/* Logo */}
        <Link
          className={`flex ${
            user?.unsafeMetadata?.role === "employeer"
              ? "justify-center md:justify-start"
              : ""
          }`}
        >
          <img src="/logo.png" alt="logo" className="h-16" />
        </Link>

        {/* Actions */}
        <div
          className={`flex ${
            user?.unsafeMetadata?.role === "employeer"
              ? "w-full justify-between items-center gap-4 md:w-auto md:justify-end"
              : "items-center gap-4"
          }`}
        >
          {/* Login Button */}
          <SignedOut>
            <Button onClick={() => setShow(true)} className="w-32 sm:w-36">
              Login
            </Button>
          </SignedOut>

          {/* Post Job Button */}
          <SignedIn>
            {user?.unsafeMetadata?.role === "employeer" && (
              <Link to="/post-job">
                <Button
                  variant="destructive"
                  className="rounded-full flex items-center gap-2 w-36 justify-center"
                >
                  <PenBox size={20} />
                  Post a Job
                </Button>
              </Link>
            )}

            {/* User Avatar */}
            <div className="sm:mt-0 mt-2">
              <UserButton appearance={{ elements: { avatarBox: "w-12 h-12" } }}>
                <UserButton.MenuItems>
                  <UserButton.Link
                    label="My Jobs"
                    labelIcon={<BriefcaseBusiness size={15} />}
                    href="/my-jobs"
                  />
                  <UserButton.Link
                    label="Saved Jobs"
                    labelIcon={<Heart size={15} />}
                    href="/saved-jobs"
                  />
                </UserButton.MenuItems>
              </UserButton>
            </div>
          </SignedIn>
        </div>
      </nav>

      {show && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={handleOverlayClick}
        >
          <SignIn
            signUpForceRedirectUrl="/onboarding"
            fallbackRedirectUrl="/onboarding"
          />
        </div>
      )}
    </>
  );
};

export default Header;
