import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGSAPAnimation } from "@/hooks/use-gsap";
import { fadeUpAnimation } from "@/lib/gsap-utils";
import { Check, X, HelpCircle } from "lucide-react";
import { allPricingPlans } from "./pricingJson";

const pricingPlans = [
  {
    name: "Starter",
    price: "$599",
    period: "/project",
    description: "Perfect for small businesses and startups",
    features: [
      "Basic website design",
      "Mobile responsive",
      "5 pages included",
      "Basic SEO optimization",
      "Contact form",
      "Social media integration",
      "1 month support",
    ],
    notIncluded: [
      "Custom functionality",
      "Database integration",
      "E-commerce features",
      "Advanced analytics",
    ],
    isPopular: false,
    buttonText: "Get Started",
    color: "border-gray-200",
  },
  {
    name: "Business",
    price: "$999",
    period: "/project",
    description: "Most popular choice for growing businesses",
    features: [
      "Advanced web application",
      "Custom functionality",
      "Database integration",
      "E-commerce capabilities",
      "Advanced SEO",
      "Analytics dashboard",
      "Payment integration",
      "6 months support",
    ],
    notIncluded: [
      "Unlimited revisions",
      "Dedicated account manager",
      "24/7 priority support",
    ],
    isPopular: true,
    buttonText: "Get Started",
    color: "border-orange",
  },
  {
    name: "Enterprise",
    price: "$1599",
    period: "/project",
    description: "For large organizations with complex needs",
    features: [
      "Enterprise-grade solution",
      "Custom architecture",
      "Unlimited revisions",
      "Dedicated support team",
      "Priority development",
      "Advanced security",
      "Scalable infrastructure",
      "12 months support",
      "Training included",
    ],
    notIncluded: [],
    isPopular: false,
    buttonText: "Contact Sales",
    color: "border-gray-200",
  },
];


const faqs = [
  {
    question: "What's included in the project price?",
    answer:
      "Each project includes design, development, testing, deployment, and the specified support period. Additional features can be added for an extra cost.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "Starter projects typically take 2-4 weeks, Business projects 4-8 weeks, and Enterprise projects 8-16 weeks, depending on complexity.",
  },
  {
    question: "Do you offer ongoing maintenance?",
    answer:
      "Yes, we offer maintenance packages starting at $199/month for regular updates, security patches, and minor modifications.",
  },
  {
    question: "Can I upgrade my plan later?",
    answer:
      "Absolutely! You can upgrade your project scope at any time. We'll provide a quote for the additional features you need.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, bank transfers, and can set up payment plans for larger projects.",
  },
  {
    question: "Do you provide hosting services?",
    answer:
      "We can recommend hosting providers and help with setup, or we can manage hosting for you starting at $99/month.",
  },
];

export default function Pricing() {
  const [activeService, setActiveService] = useState("mobile-development");

  const services = [
    { key: "mobile-development", label: "Mobile Development" },
    { key: "graphic-design", label: "Graphic Design" },
    { key: "website-development", label: "Website Development" },
    { key: "ecommerce", label: "E-commerce" },
  ];

  useEffect(() => {
    document.title = "Pricing Plans - DesignDynasty";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Transparent pricing for web development, mobile apps, and design services. Choose from Starter, Business, or Enterprise plans that fit your needs."
      );
    }
  }, []);
  useEffect(() => {
    const TIMEOUT_MS = 5 * 60 * 1000;

    const checkExpiry = () => {
      const loginTimeStr = localStorage.getItem("loginTime");
      const token = localStorage.getItem("ddtoken");
      if (!token || !loginTimeStr) {
        // navigate("/");
        // localStorage.clear();
        return;
      }
      const loginTime = Number(loginTimeStr);
      if (Number.isNaN(loginTime) || Date.now() - loginTime > TIMEOUT_MS) {
        localStorage.clear();
        navigate("/");
      }
    };

    const intervalId = setInterval(checkExpiry, 1000 * 15); // check every 15s
    // Run once immediately on mount
    checkExpiry();

    return () => clearInterval(intervalId);
  }, []);
  const titleRef = useGSAPAnimation(fadeUpAnimation);
  const ddtoken = localStorage.getItem("ddtoken");
  const navigate = useNavigate();
  return (
    <>
      {ddtoken ? (
        <div className="min-h-screen bg-white" data-testid="page-pricing">
          <main>
            {/* Hero Section */}
            <section
              className="gradient-bg text-white py-20"
              data-testid="pricing-hero"
            >
              <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto text-center">
                  <h1
                    ref={titleRef as any}
                    className="text-4xl lg:text-6xl font-bold mb-6"
                    data-testid="text-pricing-title"
                  >
                    Simple, Transparent Pricing
                  </h1>
                  <p
                    className="text-xl lg:text-2xl text-gray-300"
                    data-testid="text-pricing-subtitle"
                  >
                    Choose the perfect plan for your business needs and scale as
                    you grow
                  </p>
                </div>
              </div>
            </section>

            {/* Pricing Plans */}
            <div className="min-h-screen bg-white">
              {/* Service Tabs */}
              <div className="flex flex-wrap justify-center gap-4 py-8 pt-20 px-4 sm:px-6">
                {services.map((service) => (
                  <button
                    key={service.key}
                    onClick={() => setActiveService(service.key)}
                    className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold transition-all ${
                      activeService === service.key
                        ? "bg-orange text-white"
                        : "border-2 border-orange text-orange hover:bg-orange hover:text-white"
                    }`}
                  >
                    {service.label}
                  </button>
                ))}
              </div>

              {/* Pricing Cards */}
              <section className="py-12 bg-light-gray px-4 sm:px-6">
                <div className="container mx-auto max-w-7xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {allPricingPlans[activeService].map((plan) => (
                      <div
                        key={plan.name}
                        className={`rounded-xl p-6 sm:p-8 transition-all ${
                          plan.isPopular
                            ? "bg-orange text-white transform scale-100 sm:scale-105 shadow-lg"
                            : "bg-white border-2 " + plan.color
                        }`}
                      >
                        {plan.isPopular && (
                          <div className="bg-white text-orange text-xs sm:text-sm font-bold px-3 py-1 rounded-full text-center mb-4 inline-block">
                            Most Popular
                          </div>
                        )}

                        <div className="text-center mb-6 sm:mb-8">
                          <h3 className="text-xl sm:text-2xl font-bold mb-2">
                            {plan.name}
                          </h3>
                          <p className="text-sm sm:text-base mb-4">
                            {plan.description}
                          </p>
                          <div className="mb-4">
                            <span className="text-2xl sm:text-3xl font-bold">
                              {plan.price}
                            </span>
                            <span className="text-text-gray ml-1">
                              {plan.period}
                            </span>
                          </div>
                        </div>

                        <div className="mb-6 sm:mb-8">
                          <h4 className="font-semibold mb-3 text-sm sm:text-base">
                            What's included:
                          </h4>
                          <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
                            {plan.features.map((feature, i) => (
                              <li key={i} className="flex items-center">
                                <Check className="w-4 h-4 mr-2 text-green-500" />
                                {feature}
                              </li>
                            ))}
                            {plan.notIncluded.map((feature, i) => (
                              <li
                                key={i}
                                className="flex items-center opacity-50"
                              >
                                <X className="w-4 h-4 mr-2 text-gray-400" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Link
                          to="/contact"
                          className={`block text-center w-full px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-all ${
                            plan.isPopular
                              ? "bg-white text-orange hover:bg-gray-100"
                              : "border-2 border-orange text-orange hover:bg-orange hover:text-white"
                          }`}
                        >
                          {plan.buttonText}
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>

            {/* Comparison Table */}
            {/* <section className="py-20 bg-white" data-testid="pricing-comparison">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2
                className="text-3xl lg:text-4xl font-bold text-dark-gray mb-6"
                data-testid="text-comparison-title"
              >
                Detailed Feature Comparison
              </h2>
            </div>

            <div className="max-w-6xl mx-auto overflow-x-auto">
              <table className="w-full bg-white rounded-xl shadow-lg overflow-hidden">
                <thead className="bg-light-gray">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-dark-gray">
                      Features
                    </th>
                    <th className="px-6 py-4 text-center font-semibold text-dark-gray">
                      Starter
                    </th>
                    <th className="px-6 py-4 text-center font-semibold text-orange">
                      Business
                    </th>
                    <th className="px-6 py-4 text-center font-semibold text-dark-gray">
                      Enterprise
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr data-testid="comparison-pages">
                    <td className="px-6 py-4 text-dark-gray">
                      Number of Pages
                    </td>
                    <td className="px-6 py-4 text-center">5</td>
                    <td className="px-6 py-4 text-center">15</td>
                    <td className="px-6 py-4 text-center">Unlimited</td>
                  </tr>
                  <tr data-testid="comparison-revisions">
                    <td className="px-6 py-4 text-dark-gray">
                      Design Revisions
                    </td>
                    <td className="px-6 py-4 text-center">3</td>
                    <td className="px-6 py-4 text-center">5</td>
                    <td className="px-6 py-4 text-center">Unlimited</td>
                  </tr>
                  <tr data-testid="comparison-support">
                    <td className="px-6 py-4 text-dark-gray">Support Period</td>
                    <td className="px-6 py-4 text-center">1 Month</td>
                    <td className="px-6 py-4 text-center">6 Months</td>
                    <td className="px-6 py-4 text-center">12 Months</td>
                  </tr>
                  <tr data-testid="comparison-training">
                    <td className="px-6 py-4 text-dark-gray">
                      Training Included
                    </td>
                    <td className="px-6 py-4 text-center">
                      <X className="w-5 h-5 text-red-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <X className="w-5 h-5 text-red-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section> */}

            {/* FAQ Section */}
            <section className="py-20 bg-light-gray" data-testid="pricing-faq">
              <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                  <h2
                    className="text-3xl lg:text-4xl font-bold text-dark-gray mb-6"
                    data-testid="text-faq-title"
                  >
                    Frequently Asked Questions
                  </h2>
                </div>

                <div className="max-w-4xl mx-auto">
                  <div className="grid md:grid-cols-2 gap-8">
                    {faqs.map((faq, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-xl p-6 shadow-lg"
                        data-testid={`faq-${index}`}
                      >
                        <div className="flex items-start mb-4">
                          <HelpCircle className="w-6 h-6 text-orange mr-3 mt-1 flex-shrink-0" />
                          <h3
                            className="font-semibold text-dark-gray"
                            data-testid={`faq-question-${index}`}
                          >
                            {faq.question}
                          </h3>
                        </div>
                        <p
                          className="text-text-gray pl-9"
                          data-testid={`faq-answer-${index}`}
                        >
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section
              className="py-20 bg-navy text-white"
              data-testid="pricing-cta"
            >
              <div className="container mx-auto px-6 text-center">
                <h2
                  className="text-3xl lg:text-4xl font-bold mb-6"
                  data-testid="text-pricing-cta-title"
                >
                  Still Have Questions?
                </h2>
                <p
                  className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
                  data-testid="text-pricing-cta-subtitle"
                >
                  Our team is here to help you choose the right plan and answer
                  any questions about our services.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/contact"
                    className="bg-orange hover:bg-orange/90 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105"
                    data-testid="button-contact-sales"
                  >
                    Contact Sales
                  </Link>
                  <a
                    href="tel:+15551234567"
                    className="border-2 border-white text-white hover:bg-white hover:text-navy px-8 py-4 rounded-lg font-semibold text-lg transition-all"
                    data-testid="button-call-now"
                  >
                    Call Now: (555) 123-4567
                  </a>
                </div>
              </div>
            </section>
          </main>
        </div>
      ) : (
        <div className="py-10 flex items-center justify-center bg-light-gray px-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-8 text-center">
            <h1 className="text-2xl font-bold text-dark-gray mb-4">
              Please Login to View Pricing Plans
            </h1>
            <p className="text-text-gray mb-6">
              Unlock all features and pricing plans by logging into your
              account.
            </p>
            <button
              className="bg-orange hover:bg-orange/90 text-white px-6 py-3 rounded-lg font-semibold text-lg transition-all transform hover:scale-105"
              onClick={() => {
                navigate("/login");
              }}
            >
              Login
            </button>
          </div>
        </div>
      )}
    </>
  );
}
