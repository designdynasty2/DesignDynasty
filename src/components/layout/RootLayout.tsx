import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ScrollToTop from "@/components/scroll-to-top";
import ChatbotWidget from "@/components/chatbot/chatbot-widget";
import AOS from "aos";
import { applyRouteSEO } from "@/lib/seo";

export default function RootLayout() {
  const location = useLocation();

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
    applyRouteSEO(location.pathname || "/");
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
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white">
      <ScrollToTop />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ChatbotWidget />
    </div>
  );
}
