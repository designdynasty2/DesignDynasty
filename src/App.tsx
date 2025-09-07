import React, { Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import RootLayout from "@/components/layout/RootLayout";

// Lazy-loaded routes
const NotFound = React.lazy(() => import("@/pages/not-found"));
const Home = React.lazy(() => import("@/pages/home"));
const About = React.lazy(() => import("@/pages/about"));
const WebDevelopment = React.lazy(
  () => import("@/pages/services/web-development")
);
const GraphicDesign = React.lazy(
  () => import("@/pages/services/graphic-design")
);
const MobileDevelopment = React.lazy(
  () => import("@/pages/services/mobile-development")
);
const DigitalMarketing = React.lazy(
  () => import("@/pages/services/digital-marketing")
);
const EcommerceSolutions = React.lazy(
  () => import("@/pages/services/ecommerce-solutions")
);
const ProtectedRoute = React.lazy(
  () => import("@/pages/ProtectedRoute")
);
const Portfolio = React.lazy(() => import("@/pages/portfolio"));
const Pricing = React.lazy(() => import("@/pages/pricing"));
const Blog = React.lazy(() => import("@/pages/blog"));
const Contact = React.lazy(() => import("@/pages/contact"));
const Services = React.lazy(() => import("@/components/home/services"));
const Login = React.lazy(() => import("@/components/login"));
const SignUp = React.lazy(() => import("@/components/signup"));
const ForgetPassword = React.lazy(() => import("@/components/forgetPassword"));
const OtpPage = React.lazy(() => import("@/components/OtpPage"));
const ResetPassword = React.lazy(() => import("@/components/ResetPassword"));
const PrivacyPolicy = React.lazy(() => import("@/pages/privacy"));
const Dashboard = React.lazy(() => import("@/pages/Dashboard"));
const UserManagement = React.lazy(() => import("@/pages/userManagement"));
const AuthLayout = React.lazy(() => import("@/components/layout/AuthLayout"));

export const baseUrl = `https://designdynasty-backend.onrender.com`

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: (
      <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
        <NotFound />
      </Suspense>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },

      // Services
      { path: "services", element: <Services /> },
      { path: "services/web-development", element: <WebDevelopment /> },
      { path: "services/graphic-design", element: <GraphicDesign /> },
      { path: "services/mobile-development", element: <MobileDevelopment /> },
      { path: "services/digital-marketing", element: <DigitalMarketing /> },
      { path: "services/ecommerce-solutions", element: <EcommerceSolutions /> },

      // Other pages
      { path: "pricing", element: <Pricing /> },
      { path: "blog", element: <Blog /> },
      { path: "contact", element: <Contact /> },
      { path: "privacy-policy", element: <PrivacyPolicy /> },

      // 404 fallback
      { path: "*", element: <NotFound /> },
    ],
  },

  // Auth routes in a separate layout

  { path: "login", element: <Login /> },
  { path: "signup", element: <SignUp /> },
  { path: "forget-password", element: <ForgetPassword /> },
  { path: "otp-page", element: <OtpPage /> },
  { path: "reset-password", element: <ResetPassword /> },
  {
    path: "/auth",
    element: (
      <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
        <ProtectedRoute />
      </Suspense>
    ),
    children: [
      {
        element: (
          <Suspense
            fallback={<div className="p-6 text-center">Loading...</div>}
          >
            <AuthLayout />
          </Suspense>
        ),
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "user-management", element: <UserManagement /> },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
          <RouterProvider router={router} />
        </Suspense>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
