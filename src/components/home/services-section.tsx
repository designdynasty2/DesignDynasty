// import { useGSAPAnimation } from "@/hooks/use-gsap";
// import { fadeUpAnimation } from "@/lib/gsap-utils";
import { Link } from "react-router-dom";
import { HiComputerDesktop } from "react-icons/hi2";
import { FaMobileAlt } from "react-icons/fa";
import { IoColorPaletteOutline } from "react-icons/io5";


// Example services (you can replace bg with icons)
const services = [
  {
    title: "Web Development",
    description:
      "We build fast, scalable, and secure websites tailored to your business needs. From simple landing pages to complex enterprise solutions, our web development services ensure seamless performance and modern user experiences.",
    icon: <HiComputerDesktop />,
    link: "/services/web-development",
  },
  {
    title: "Mobile Development",
    description:
      "Our team creates high-performing, cross-platform mobile applications with intuitive interfaces. We deliver apps that are reliable, engaging, and optimized for both iOS and Android to keep your users connected on the go.",
    icon: <FaMobileAlt />,
    link: "/services/mobile-development",
  },
  {
    title: "Graphic Design",
    description:
      "We craft visually stunning designs that communicate your brand’s identity. From logos and brand assets to marketing materials, our creative solutions help your business stand out and make a lasting impression.",
    icon: <IoColorPaletteOutline />,
    link: "/services/graphic-design",
  },

];

export default function ServicesSection() {
  // const titleRef = useGSAPAnimation(fadeUpAnimation);

  return (
    <section className="py-16 sm:py-20 bg-white relative" data-testid="services-section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-dark-gray mb-4 sm:mb-6"
            data-testid="text-services-title" data-aos="fade-up"
          >
            What We Do
          </h2>
          <p
            className="text-base sm:text-lg lg:text-xl text-text-gray max-w-3xl mx-auto leading-relaxed"
            data-testid="text-services-subtitle" data-aos="fade-up"
          >
            We deliver end-to-end digital solutions, combining strategy,
            creativity, and technology to help businesses grow and innovate.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="relative bg-white rounded-xl p-8 overflow-hidden group transition-all shadow-2xl"
            >
              {/* Circle background */}
              <span className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 w-36 h-36 bg-orange-600 border-[1px] border-[#504f93] rounded-bl-full opacity-50 transition-all duration-700 group-hover:w-full group-hover:h-full group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 group-hover:rounded-none group-hover:border-0  bg-[var(--orange)]"></span>

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className="w-16 h-16 mb-6 flex items-center justify-center bg-orange-600 text-[var(--orange)] text-3xl rounded-md transition-colors duration-300 group-hover:bg-white group-hover:text-orange-600">
                  {service.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold mb-4 transition-colors duration-300 group-hover:text-white">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-sm mb-6 transition-colors duration-300 group-hover:text-white">
                  {service.description}
                </p>

                {/* Link */}
                <Link href={service.link}>
                  <a className="relative text-sm font-medium text-[#202020] transition-colors duration-300 group-hover:text-white after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[1px] after:bg-orange-600 after:transition-colors after:duration-300 group-hover:after:bg-white">
                    Learn More
                  </a>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
