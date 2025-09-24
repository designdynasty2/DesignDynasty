import { useGSAPAnimation } from "@/hooks/use-gsap";
import { fadeUpAnimation } from "@/lib/gsap-utils";
import { Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const testimonials = [
  {
    content:
      "Design Dynasty completely transformed our outdated website into a modern, user-friendly platform. The team understood our vision and delivered beyond expectations. Our traffic and customer inquiries have doubled since launch",
    name: "Sandra Burton",
    role: "Business Owner.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
  },
  {
    content:
      "Professional, responsive, and detail-oriented – Design Dynasty handled everything from design to deployment flawlessly. They are our go-to partner for all things web",
    name: "Emily Rodriguez",
    role: "Founder, Marketing Manager",
    image:
      "https://images.unsplash.com/photo-1494790108755-2616b612b3bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
  },
  {
    content:
      "Our nonprofit organization needed a website with donation management and event features. Design Dynasty delivered a clean and functional site that made it easy for donors and members to engage with us",
    name: "Sarah L",
    role: "Nonprofit Director",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
  },
  {
    content:
      "I loved how the team patiently walked me through every step of the process. They made sure the website reflected my brand identity perfectly. Highly recommend Design Dynasty for anyone starting fresh online.",
    name: "Emily Rodriguez",
    role: "Startup Founder",
    image:
      "https://images.unsplash.com/photo-1494790108755-2616b612b3bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
  },
  {
    content:
      "Design Dynasty built a school management mobile app for us, and it has been a game-changer. Teachers, parents, and students now communicate effortlessly, and managing schedules has never been easier.",
    name: "Priya",
    role: "M., School Principal",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
  },
];

export default function TestimonialsSection() {
  const titleRef = useGSAPAnimation(fadeUpAnimation);

  return (
    <section
      className="py-20 bg-light-gray relative"
      data-testid="testimonials-section"
    >
      <div className="container mx-auto px-6">
        {/* Section Title */}
        <div className="text-center mb-12 md:mb-16">
          <h2
            ref={titleRef as any}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-dark-gray mb-4 md:mb-6"
            data-testid="text-testimonials-title"
            data-aos="fade-up"
          >
            What Our Clients Say
          </h2>
          <p
            className="text-base sm:text-lg lg:text-xl text-text-gray max-w-3xl mx-auto leading-relaxed"
            data-testid="text-testimonials-subtitle"
            data-aos="fade-up"
          >
            We pride ourselves on building lasting relationships. Here’s what
            our clients say about working with us.
          </p>
        </div>

        {/* Swiper Carousel */}
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-12 carousel-testi"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div
                className="bg-white p-6 sm:p-8 rounded-xl shadow-md hover:shadow-xl transition-all h-full flex flex-col justify-between"
                data-testid={`card-testimonial-${index}`}
              >
                {/* Stars */}
                <div className="flex mb-4 text-orange">
                  {[...Array(5)].map((_, starIndex) => (
                    <Star
                      key={starIndex}
                      className="w-4 h-4 sm:w-5 sm:h-5 fill-current"
                    />
                  ))}
                </div>

                {/* Content */}
                <p
                  className="text-sm sm:text-base text-text-gray mb-6 italic leading-relaxed"
                  data-testid={`text-testimonial-content-${index}`}
                >
                  "{testimonial.content}"
                </p>

                {/* Author */}
                {/* Author */}
                <div className="flex items-center mt-auto">
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-[--orange] text-white font-bold mr-4"
                    data-testid={`avatar-testimonial-${index}`}
                  >
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div
                      className="font-semibold text-dark-gray text-sm sm:text-base"
                      data-testid={`text-testimonial-name-${index}`}
                    >
                      {testimonial.name}
                    </div>
                    {/* <div
      className="text-xs sm:text-sm text-text-gray"
      data-testid={`text-testimonial-role-${index}`}
    >
      {testimonial.role}
    </div> */}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
