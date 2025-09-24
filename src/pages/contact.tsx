import React, { useEffect } from "react";
import { useGSAPAnimation } from "@/hooks/use-gsap";
import {
  fadeUpAnimation,
  fadeLeftAnimation,
  fadeRightAnimation,
} from "@/lib/gsap-utils";
import { MapPin, Phone, Mail, Clock, FileUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { baseUrl } from "../App";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const contactInfo = [
  {
    icon: MapPin,
    title: "Address",
    content: "8197, Peggy CT, Zionsville -46077",
    link: "https://maps.google.com",
  },
  {
    icon: Phone,
    title: "Phone",
    content: "+1 (908) 205-1993",
    link: "tel:+15551234567",
  },
  {
    icon: Mail,
    title: "Email",
    content: "info@thedesigndynasty.com",
    link: "mailto:info@thedesigndynasty.com",
  },
  {
    icon: Clock,
    title: "Business Hours",
    content: "Mon - Fri: 9:00 AM - 6:00 PM EST",
    link: null,
  },
];

// Select options shown in the UI
const serviceOptions = [
  "Web Development",
  "Mobile App Development",
  "Graphic Design",
  "E-commerce Solutions",
  "Consultation",
  "Other",
];

// Values submitted to the backend for service
const serviceValueOptions = [
  "web-development",
  "mobile-app-development",
  "graphic-design",
  "e-commerce-solutions",
  "consultation",
  "other",
] as const;

type ServiceValue = (typeof serviceValueOptions)[number];

// Schema using Zod
const contactSchema = z.object({
  name: z.string().trim().min(2, "Full Name must be at least 2 characters"),
  email: z.string().trim().email("Please enter a valid email address"),
  phone: z
    .string()
    .trim()
    .regex(/^\d{10,15}$/, "Phone number must be 10 to 15 digits"),
  company: z
    .string()
    .trim()
    .min(2, "Company name must be at least 2 characters"),
  service: z.enum(serviceValueOptions, {
    errorMap: () => ({ message: "Service selection is required" }),
  }),
  message: z
    .string()
    .trim()
    .min(10, "Project details must be at least 10 characters"),
  // Optional attachments: max 5 files, <= 2MB each, pdf/doc/docx
  attachments: z
    .array(z.instanceof(File))
    .max(5, "You can upload up to 5 files")
    .refine((files) => files.every((f) => f.size <= 2 * 1024 * 1024), {
      message: "Each file must be 2MB or less",
    })
    .refine(
      (files) => files.every((f) => /(\.pdf|\.doc|\.docx)$/i.test(f.name)),
      {
        message: "Only PDF, DOC, DOCX files are allowed",
      }
    )
    .optional()
    .default([]),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function Contact() {
  const { toast } = useToast();

  const titleRef = useGSAPAnimation(fadeUpAnimation);
  const leftRef = useGSAPAnimation(fadeRightAnimation);
  const rightRef = useGSAPAnimation(fadeLeftAnimation);

  useEffect(() => {
    document.title = "Contact Us - DesignDynasty";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Get in touch with DesignDynasty for your web development, mobile app, and design needs. Free consultation and project quotes available."
      );
    }
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      service: undefined as unknown as ServiceValue, // force selection
      message: "",
      attachments: [],
    },
  });

  const attachments = watch("attachments") || [];

  const onSubmit = async (data: ContactForm) => {
    try {
      const payload = new FormData();
      payload.append("name", data.name);
      payload.append("email", data.email);
      payload.append("mobile", data.phone);
      payload.append("company", data.company);
      payload.append("service", data.service);
      payload.append("projectDetails", data.message);

      (data.attachments || []).forEach((file) =>
        payload.append("attachment", file)
      );

      const response = await fetch(`${baseUrl}api/brief-contact`, {
        method: "POST",
        body: payload,
      });

      const resData = await response.json();
      if (!response.ok)
        throw new Error(resData.error || "Failed to send message");

      toast({
        title: "Success!",
        description: resData.message || "Message sent successfully",
        className: "bg-green-500 text-white border-green-600",
      });

      reset();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    // Pre-filter to provide UI feedback and avoid setting invalid files
    const validFiles = files.filter((file) => {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds 2MB limit.`,
          variant: "destructive",
        });
        return false;
      }
      if (!/(\.pdf|\.doc|\.docx)$/i.test(file.name)) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not PDF/DOC/DOCX.`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    setValue("attachments", validFiles as any, { shouldValidate: true });
  };

  return (
    <>
      <div className="min-h-screen bg-white" data-testid="page-contact">
        <main>
          {/* Hero Section */}
          <section
            className="gradient-bg text-white py-20"
            data-testid="contact-hero"
          >
            <div className="container mx-auto px-6">
              <div className="max-w-4xl mx-auto text-center">
                <h1
                  ref={titleRef as any}
                  className="text-4xl lg:text-6xl font-bold mb-6"
                  data-testid="text-contact-title"
                >
                  Get In Touch
                </h1>
                <p
                  className="text-xl lg:text-2xl text-gray-300"
                  data-testid="text-contact-subtitle"
                >
                  Ready to start your project? Let's discuss your requirements
                  and create something amazing together.
                </p>
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="py-20 bg-light-gray" data-testid="contact-info">
            <div className="container mx-auto px-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {contactInfo.map((info, index) => {
                  const InfoIcon = info.icon;
                  return (
                    <div
                      key={info.title}
                      className="text-center bg-white rounded-xl p-8 shadow-lg"
                      data-testid={`contact-info-${index}`}
                    >
                      <InfoIcon className="w-12 h-12 text-orange mx-auto mb-4" />
                      <h3
                        className="text-lg font-bold text-dark-gray mb-3"
                        data-testid={`contact-info-title-${index}`}
                      >
                        {info.title}
                      </h3>
                      {info.link ? (
                        <a
                          href={info.link}
                          className="text-text-gray hover:text-orange transition-colors"
                          data-testid={`contact-info-link-${index}`}
                        >
                          {info.content}
                        </a>
                      ) : (
                        <p
                          className="text-text-gray"
                          data-testid={`contact-info-content-${index}`}
                        >
                          {info.content}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Contact Form */}
          <section
            className="py-20 bg-white"
            data-testid="contact-form-section"
          >
            <div className="container mx-auto px-6">
              <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                <div ref={leftRef as any}>
                  <h2
                    className="text-3xl font-bold text-dark-gray mb-6"
                    data-testid="text-contact-form-title"
                  >
                    Tell Us About Your Project
                  </h2>
                  <p
                    className="text-text-gray text-lg mb-8"
                    data-testid="text-contact-form-description"
                  >
                    Fill out the form below with details about your project, and
                    we'll get back to you with a personalized proposal and
                    timeline.
                  </p>

                  <div className="space-y-6">
                    <div className="bg-light-gray rounded-lg p-6">
                      <h3 className="font-semibold text-dark-gray mb-3">
                        What happens next?
                      </h3>
                      <ul className="space-y-2 text-text-gray">
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-orange rounded-full mr-3"></div>
                          We'll review your requirements within 24 hours
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-orange rounded-full mr-3"></div>
                          Schedule a free consultation call
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-orange rounded-full mr-3"></div>
                          Receive a detailed proposal and timeline
                        </li>
                        <li className="flex items-center">
                          <div className="w-2 h-2 bg-orange rounded-full mr-3"></div>
                          Start building your solution
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div ref={rightRef as any}>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6"
                    data-testid="form-contact-extended"
                    noValidate
                  >
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-dark-gray mb-2"
                        >
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          {...register("name")}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                            errors.name
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-orange"
                          }`}
                          placeholder="Your full name"
                          aria-invalid={!!errors.name}
                          data-testid="input-contact-name"
                        />
                        {errors.name && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.name.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-dark-gray mb-2"
                        >
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          {...register("email")}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                            errors.email
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-orange"
                          }`}
                          placeholder="your@email.com"
                          aria-invalid={!!errors.email}
                          data-testid="input-contact-email"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-dark-gray mb-2"
                        >
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          inputMode="numeric"
                          placeholder="Enter Phone Number"
                          {...register("phone")}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                            errors.phone
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-orange"
                          }`}
                          aria-invalid={!!errors.phone}
                          data-testid="input-contact-phone"
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.phone.message}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="company"
                          className="block text-sm font-medium text-dark-gray mb-2"
                        >
                          Company *
                        </label>
                        <input
                          type="text"
                          id="company"
                          placeholder="Your company name"
                          {...register("company")}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                            errors.company
                              ? "border-red-500 focus:ring-red-500"
                              : "border-gray-300 focus:ring-orange"
                          }`}
                          aria-invalid={!!errors.company}
                          data-testid="input-contact-company"
                        />
                        {errors.company && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors.company.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="service"
                        className="block text-sm font-medium text-dark-gray mb-2"
                      >
                        Service Needed *
                      </label>
                      <select
                        id="service"
                        {...register("service")}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                          errors.service
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-orange"
                        }`}
                        aria-invalid={!!errors.service}
                        data-testid="select-contact-service"
                      >
                        <option value="">Select a service</option>
                        {serviceOptions.map((option) => (
                          <option
                            key={option}
                            value={option.toLowerCase().replace(/\s+/g, "-")}
                          >
                            {option}
                          </option>
                        ))}
                      </select>
                      {errors.service && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.service.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-dark-gray mb-2"
                      >
                        Project Details *
                      </label>
                      <textarea
                        id="message"
                        rows={6}
                        placeholder="Please describe your project requirements, goals, and any specific features you need..."
                        {...register("message")}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-colors ${
                          errors.message
                            ? "border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:ring-orange"
                        }`}
                        aria-invalid={!!errors.message}
                        data-testid="textarea-contact-message"
                      />
                      {errors.message && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-dark-gray mb-2">
                        Attachments (Optional)
                      </label>
                      <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange transition-colors cursor-pointer"
                        onClick={() =>
                          document.getElementById("attachments")?.click()
                        }
                      >
                        <FileUp className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-text-gray text-sm">
                          Drop files here or click to upload
                        </p>
                        <p className="text-text-gray text-xs mt-1">
                          Supported formats: PDF, DOC (Max 2MB)
                        </p>

                        <input
                          id="attachments"
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx"
                          multiple
                          onChange={handleFileChange}
                          data-testid="input-contact-attachments"
                        />

                        {/* Show selected files */}
                        {attachments.length > 0 && (
                          <div className="mt-4 text-left">
                            <p className="text-sm font-medium text-dark-gray mb-2">
                              Selected files:
                            </p>
                            <ul className="list-disc list-inside text-sm text-text-gray">
                              {attachments.map((file, index) => (
                                <li key={index}>{file.name}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {errors.attachments && (
                          <p className="text-red-500 text-sm mt-2">
                            {errors.attachments.message as any}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-orange text-white py-3 rounded-lg disabled:opacity-60"
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section>

          {/* Map Section */}
          <section className="py-20 bg-light-gray" data-testid="contact-map">
            <div className="container mx-auto px-6">
              <div className="text-center mb-12">
                <h2
                  className="text-3xl font-bold text-dark-gray mb-4"
                  data-testid="text-map-title"
                >
                  Our Location
                </h2>
              </div>
              <div
                className="bg-gray-300 rounded-xl h-96 flex items-center justify-center"
                data-testid="map-placeholder"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3057.1741630093647!2d-86.31634472529237!3d39.98221308197296!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88135440e6c375bb%3A0x64c8c024606d6f1d!2s8197%20Peggy%20Ct%2C%20Zionsville%2C%20IN%2046077%2C%20USA!5e0!3m2!1sen!2sin!4v1756655175444!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
