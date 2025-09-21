import { useGSAPAnimation } from "@/hooks/use-gsap";
import { fadeLeftAnimation, fadeRightAnimation } from "@/lib/gsap-utils";
import { MapPin, Phone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { baseUrl } from "../../App";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters"),
  email: z.string().trim().email("Please enter a valid email address"),
  service: z.string().min(1, "Please select a service"),
  message: z.string().trim().min(10, "Message must be at least 10 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function ContactSection() {
  const { toast } = useToast();

  const leftRef = useGSAPAnimation(fadeRightAnimation);
  const rightRef = useGSAPAnimation(fadeLeftAnimation);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", service: "", message: "" },
    mode: "onBlur", // validate on blur for better UX
  });

  const onSubmit = async (data: ContactForm) => {
    try {
      const res = await fetch(`${baseUrl}auth/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to send message");

      toast({
        title: "Message Sent ",
        description:
          "Thank you for reaching out! Our team will connect with you within 24 hours.",
        className: "bg-green-500 text-white border-green-600",
      });
      reset();
    } catch (err) {
      toast({
        title: "Submission Failed ❌",
        description: "Please try again or email us directly.",
        variant: "destructive",
      });
    }
  };

  return (
    <section
      className="py-20 bg-gradient-to-b from-gray-50 to-white relative"
      data-testid="contact-section"
    >
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h2
            className="text-3xl lg:text-5xl font-bold text-dark-gray mb-6 leading-snug"
            data-testid="text-contact-title"
            data-aos="fade-up"
          >
            Let’s Build Something <span className="text-orange">Great</span>{" "}
            Together
          </h2>
          <p
            className="text-lg lg:text-xl text-text-gray max-w-2xl mx-auto leading-relaxed"
            data-testid="text-contact-subtitle"
            data-aos="fade-up"
          >
            Have a project in mind? Share your vision with us and our experts
            will craft tailored solutions that drive results.
          </p>
        </div>

        {/* Grid */}
        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div ref={leftRef as any} className="space-y-10">
            <h3
              className="text-2xl font-semibold text-dark-gray"
              data-testid="text-get-in-touch"
            >
              Our Contact Information
            </h3>
            <p className="text-text-gray">
              Reach out directly or fill out the form and we’ll get back to you
              promptly.
            </p>

            <div className="space-y-6">
              <div className="flex items-center">
                <div className="w-14 h-14 bg-orange/10 rounded-lg flex items-center justify-center mr-4">
                  <MapPin className="w-6 h-6 text-orange" />
                </div>
                <div>
                  <h4 className="font-semibold text-dark-gray">Address</h4>
                  <p className="text-text-gray">
                    8197, Peggy CT, Zionsville -46077
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-14 h-14 bg-orange/10 rounded-lg flex items-center justify-center mr-4">
                  <Phone className="w-6 h-6 text-orange" />
                </div>
                <div>
                  <h4 className="font-semibold text-dark-gray">Call Us</h4>
                  <p className="text-text-gray">
                    <a href="tel:+19082051993" className="hover:text-orange">
                      +1 (908) 205-1993
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-14 h-14 bg-orange/10 rounded-lg flex items-center justify-center mr-4">
                  <Mail className="w-6 h-6 text-orange" />
                </div>
                <div>
                  <h4 className="font-semibold text-dark-gray">Email Us</h4>
                  <p className="text-text-gray text-[15px]">
                    <a
                      href="mailto:designdynasty84@gmail.com"
                      className="hover:text-orange"
                    >
                      designdynasty84@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div ref={rightRef as any}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 p-8 px-0 w-[100%]"
              data-testid="form-contact"
              noValidate
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-dark-gray mb-2"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  {...register("name")}
                  className={`w-[100%] px-4 py-3 border rounded-lg transition-all focus:ring-2 focus:border-transparent ${
                    errors.name
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-orange"
                  }`}
                  placeholder="Your Name"
                  aria-invalid={!!errors.name}
                  data-testid="input-name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600" role="alert">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-dark-gray mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email")}
                  className={`w-full px-4 py-3 border rounded-lg transition-all focus:ring-2 focus:border-transparent ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-orange"
                  }`}
                  placeholder="your@email.com"
                  aria-invalid={!!errors.email}
                  data-testid="input-email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600" role="alert">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="service"
                  className="block text-sm font-medium text-dark-gray mb-2"
                >
                  Service Needed
                </label>
                <select
                  id="service"
                  {...register("service")}
                  className={`w-full px-4 py-3 border rounded-lg transition-all focus:ring-2 focus:border-transparent ${
                    errors.service
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-orange"
                  }`}
                  aria-invalid={!!errors.service}
                  data-testid="select-service"
                >
                  <option value="">Select a service</option>
                  <option value="web-development">Web Development</option>
                  <option value="graphic-design">Graphic Design</option>
                  <option value="mobile-development">
                    Mobile App Development
                  </option>
                  <option value="consultation">IT Consultation</option>
                </select>
                {errors.service && (
                  <p className="mt-1 text-sm text-red-600" role="alert">
                    {errors.service.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-dark-gray mb-2"
                >
                  Project Details
                </label>
                <textarea
                  id="message"
                  rows={5}
                  {...register("message")}
                  className={`w-full px-4 py-3 border rounded-lg transition-all focus:ring-2 focus:border-transparent ${
                    errors.message
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-orange"
                  }`}
                  placeholder="Tell us about your project goals, requirements, and timeline..."
                  aria-invalid={!!errors.message}
                  data-testid="textarea-message"
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600" role="alert">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange hover:bg-orange/90 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 disabled:opacity-50"
                data-testid="button-send-message"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
