import React, { useEffect, Suspense } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ChatbotWidget from "@/components/chatbot/chatbot-widget";
import ScrollToTop from "./components/scroll-to-top";
import AOS from "aos";
import { applyRouteSEO } from "@/lib/seo";

// Lazy-loaded routes for better performance
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
const Portfolio = React.lazy(() => import("@/pages/portfolio"));
const Pricing = React.lazy(() => import("@/pages/pricing"));
const Blog = React.lazy(() => import("@/pages/blog"));
const Contact = React.lazy(() => import("@/pages/contact"));
const PrivacyPolicy = React.lazy(() => import("@/pages/privacy"));
const services = React.lazy(() => import("@/components/home/services"));
const Login = React.lazy(() => import("@/components/login"));
const SignUp = React.lazy(() => import("@/components/signup"));
function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/services/web-development" component={WebDevelopment} />
      <Route path="/services/graphic-design" component={GraphicDesign} />
      <Route
        path="/services/mobile-development"
        component={MobileDevelopment}
      />
      <Route path="/services/digital-marketing" component={DigitalMarketing} />
      <Route
        path="/services/ecommerce-solutions"
        component={EcommerceSolutions}
      />
      {/* <Route path="/portfolio" component={Portfolio} /> */}
      <Route path="/pricing" component={Pricing} />
      <Route path="/blog" component={Blog} />
      <Route path="/contact" component={Contact} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/services" component={services} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={SignUp} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();

  // Init AOS once
  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
      offset: 40,
    });
  }, []);

  // Apply SEO and refresh animations on route change
  useEffect(() => {
    applyRouteSEO(location || "/");

    try {
      document.querySelectorAll("section:not([data-aos])").forEach((el) => {
        el.setAttribute("data-aos", "fade-up");
      });
      document
        .querySelectorAll("[data-animate]:not([data-aos])")
        .forEach((el) => {
          el.setAttribute("data-aos", "fade-up");
        });
      AOS.refreshHard();
    } catch {}
  }, [location]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <ScrollToTop />
        <Suspense fallback={<div className="p-6 text-center">Loading...</div>}>
          <Router />
        </Suspense>
        <ChatbotWidget />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
