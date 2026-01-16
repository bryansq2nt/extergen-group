'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  // Handle scroll for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    // Add hero and services to visible sections on mount
    setVisibleSections((prev) => {
      const newSet = new Set(prev);
      newSet.add('hero');
      newSet.add('services-pillars');
      return newSet;
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id || entry.target.getAttribute('data-section-id');
            if (sectionId) {
              setVisibleSections((prev) => new Set(prev).add(sectionId));
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    // Observe all sections with refs
    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    // Also observe sections by ID as fallback
    const sectionIds = ['hero', 'services', 'services-pillars', 'dealership', 'comparison', 'how-it-works', 'testimonials', 'faq', 'contact'];
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => {
      Object.values(sectionRefs.current).forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
      sectionIds.forEach((id) => {
        const element = document.getElementById(id);
        if (element) observer.unobserve(element);
      });
    };
  }, []);

  const smoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      setMobileMenuOpen(false);
    }
  };

  const faqs = [
    {
      question: "What areas do you serve?",
      answer: "We provide professional commercial cleaning services throughout Washington DC, Maryland, and Virginia, with a focus on car dealerships and commercial facilities."
    },
    {
      question: "How do you ensure consistent quality?",
      answer: "We assign dedicated teams to each client, maintain flexible scheduling to meet your needs, and provide clear communication throughout the process to ensure consistent, high-quality results."
    },
    {
      question: "What makes your service different?",
      answer: "Unlike typical cleaning services, we provide consistent teams, flexible scheduling, and clear communication. Our service includes detailed attention to your specific needs with a premium approach to commercial cleaning."
    },
    {
      question: "How do I get started?",
      answer: "Getting started is simple! Contact us through our form or call us directly. We'll schedule a consultation to understand your needs and create a customized cleaning plan for your facility."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen">
      {/* Sticky Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-azul/95 backdrop-blur-md shadow-lg'
            : 'bg-azul'
        }`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-2xl font-bold text-blanco hover:text-naranja transition-colors duration-200"
            >
              ExterGen Group
            </a>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#services"
                onClick={(e) => smoothScroll(e, 'services')}
                className="text-blanco/90 hover:text-naranja transition-colors duration-200 font-medium"
              >
                Services
              </a>
              <a
                href="#how-it-works"
                onClick={(e) => smoothScroll(e, 'how-it-works')}
                className="text-blanco/90 hover:text-naranja transition-colors duration-200 font-medium"
              >
                How It Works
              </a>
              <a
                href="#testimonials"
                onClick={(e) => smoothScroll(e, 'testimonials')}
                className="text-blanco/90 hover:text-naranja transition-colors duration-200 font-medium"
              >
                Testimonials
              </a>
              <a
                href="#faq"
                onClick={(e) => smoothScroll(e, 'faq')}
                className="text-blanco/90 hover:text-naranja transition-colors duration-200 font-medium"
              >
                FAQ
              </a>
              <Link
                href="/quote"
                className="bg-naranja text-blanco px-6 py-2.5 rounded-lg font-semibold hover:bg-[#d45a15] transition-all duration-200 hover:shadow-lg hover:scale-105"
              >
                Get Quote
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-blanco p-2"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="py-4 space-y-4 border-t border-blanco/20">
              <a
                href="#services"
                onClick={(e) => smoothScroll(e, 'services')}
                className="block text-blanco/90 hover:text-naranja transition-colors duration-200 py-2"
              >
                Services
              </a>
              <a
                href="#how-it-works"
                onClick={(e) => smoothScroll(e, 'how-it-works')}
                className="block text-blanco/90 hover:text-naranja transition-colors duration-200 py-2"
              >
                How It Works
              </a>
              <a
                href="#testimonials"
                onClick={(e) => smoothScroll(e, 'testimonials')}
                className="block text-blanco/90 hover:text-naranja transition-colors duration-200 py-2"
              >
                Testimonials
              </a>
              <a
                href="#faq"
                onClick={(e) => smoothScroll(e, 'faq')}
                className="block text-blanco/90 hover:text-naranja transition-colors duration-200 py-2"
              >
                FAQ
              </a>
              <Link
                href="/quote"
                className="block bg-naranja text-blanco px-6 py-2.5 rounded-lg font-semibold text-center hover:bg-[#d45a15] transition-colors duration-200"
              >
                Get Quote
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="hero"
        ref={(el) => {
          sectionRefs.current['hero'] = el;
        }}
        className="bg-azul text-blanco pt-32 pb-20 md:pt-40 md:pb-32 relative overflow-hidden"
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-azul via-azul to-azul/90"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(229,106,26,0.1),transparent_50%)]"></div>

        <div className="container-custom relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div
              className="transition-all duration-700 opacity-100 translate-y-0"
            >
              <p className="text-naranja font-semibold mb-4 text-sm uppercase tracking-wider">
                We are here to serve you
              </p>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                PROFESIONAL COMMERCIAL CLEANING
              </h1>
              <p className="text-xl md:text-2xl text-blanco/90 mb-6 leading-relaxed">
                Serving Washington DC, Maryland, and Virginia with premium commercial cleaning services. Reliability and professionalism you can trust.
              </p>
              
              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-blanco/10 backdrop-blur-sm rounded-lg p-4 border border-blanco/20">
                  <div className="text-3xl font-bold text-naranja mb-1">10+</div>
                  <div className="text-sm text-blanco/80">Years Experience</div>
                </div>
                <div className="bg-blanco/10 backdrop-blur-sm rounded-lg p-4 border border-blanco/20">
                  <div className="text-3xl font-bold text-naranja mb-1">500+</div>
                  <div className="text-sm text-blanco/80">Clients Served</div>
                </div>
                <div className="bg-blanco/10 backdrop-blur-sm rounded-lg p-4 border border-blanco/20">
                  <div className="text-3xl font-bold text-naranja mb-1">98%</div>
                  <div className="text-sm text-blanco/80">Satisfaction</div>
                </div>
              </div>

              {/* Dual CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/quote"
                  className="inline-block bg-naranja text-blanco px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#d45a15] transition-all duration-300 hover:shadow-xl hover:scale-105 text-center"
                >
                  Schedule Consultation
                </Link>
                <a
                  href="#services"
                  onClick={(e) => smoothScroll(e, 'services')}
                  className="inline-block border-2 border-blanco/30 text-blanco px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blanco/10 hover:border-blanco/50 transition-all duration-300 text-center"
                >
                  Learn More
                </a>
              </div>
            </div>
            <div
              className="relative transition-all duration-700 delay-300 opacity-100 translate-y-0"
            >
              <div className="relative animate-float">
                <Image
                  src="/images/offices.png"
                  alt="Professional commercial cleaning offices"
                  width={800}
                  height={600}
                  className="rounded-lg shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dealership Section */}
      <section
        id="services"
        ref={(el) => {
          sectionRefs.current['dealership'] = el;
        }}
        className="py-20 md:py-32 bg-blanco"
      >
        <div className="container-custom">
          <div
            className="grid md:grid-cols-2 gap-12 items-center transition-all duration-700 opacity-100 translate-y-0"
          >
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-azul mb-6 leading-tight">
                Professional Cleaning for Car Dealerships
              </h2>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                We understand that your showroom is the first impression customers have of your business. Our specialized cleaning services ensure your dealership maintains a pristine, professional appearance that reflects the quality of your brand.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                From showroom floors to service areas, we provide comprehensive cleaning solutions tailored to the unique needs of automotive dealerships.
              </p>
            </div>
            <div className="relative group">
              <div className="border-4 border-naranja rounded-lg overflow-hidden shadow-xl transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/images/dealership.png"
                  alt="Professional cleaning for car dealerships"
                  width={800}
                  height={600}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Pillars Section */}
      <section
        id="services-pillars"
        ref={(el) => {
          sectionRefs.current['services'] = el;
          if (el) el.id = 'services-pillars';
        }}
        className="py-20 md:py-32 bg-gray-50"
      >
        <div className="container-custom">
          <div
            className="text-center mb-16 transition-all duration-700 opacity-100 translate-y-0"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-azul mb-4">
              Commercial Cleaning Made Simple
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three pillars that set us apart from the competition
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-10 h-10 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                title: 'Consistent Teams',
                description: 'Your dedicated cleaning team gets to know your facility, ensuring consistent quality and attention to detail every time.'
              },
              {
                icon: (
                  <svg className="w-10 h-10 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Flexible Scheduling',
                description: 'We work around your business hours. Schedule cleaning services that fit your operations, not the other way around.'
              },
              {
                icon: (
                  <svg className="w-10 h-10 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                ),
                title: 'Clear Communication',
                description: 'Stay informed with regular updates and easy access to your account manager. We\'re always here when you need us.'
              }
            ].map((service, index) => (
              <div
                key={index}
                className={`bg-blanco p-8 rounded-xl shadow-md text-center transition-all duration-500 hover:shadow-xl hover:-translate-y-2 ${
                  visibleSections.has('services') || visibleSections.has('services-pillars')
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-20 h-20 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-teal/20 transition-colors duration-300">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-azul mb-4">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section
        ref={(el) => {
          sectionRefs.current['comparison'] = el;
        }}
        className="py-20 md:py-32 bg-blanco"
      >
        <div className="container-custom">
          <div className="text-center mb-16 transition-all duration-700 opacity-100 translate-y-0">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-azul mb-4">
              Why Choose ExterGen Group?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See the difference between our premium service and typical cleaning companies
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="border-4 border-teal rounded-xl p-8 bg-gradient-to-br from-teal/10 to-teal/5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-teal text-blanco px-4 py-1 rounded-bl-lg text-sm font-semibold">
                PREMIUM
              </div>
              <h3 className="text-2xl font-bold text-azul mb-6 text-center">Our Service</h3>
              <ul className="space-y-4">
                {[
                  'Dedicated cleaning teams',
                  'Flexible scheduling options',
                  'Clear communication channels',
                  'Premium quality standards',
                  'Account manager support'
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-800 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-2 border-gray-300 rounded-xl p-8 bg-gray-50 shadow-md">
              <h3 className="text-2xl font-bold text-azul mb-6 text-center opacity-60">Typical Experience</h3>
              <ul className="space-y-4">
                {[
                  'Rotating cleaning staff',
                  'Rigid scheduling',
                  'Poor communication',
                  'Inconsistent results',
                  'No dedicated support'
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-6 h-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        ref={(el) => {
          sectionRefs.current['how-it-works'] = el;
        }}
        className="py-20 md:py-32 bg-gray-50 relative"
      >
        <div className="container-custom">
          <div
            className={`text-center mb-16 transition-all duration-700 ${
              visibleSections.has('how-it-works')
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-azul mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple, streamlined process to get you started
            </p>
          </div>

          {[
            {
              step: 1,
              title: 'Initial Consultation',
              description: 'We start with a comprehensive consultation to understand your facility\'s unique needs, schedule requirements, and cleaning priorities. Our team will assess your space and create a customized cleaning plan.',
              image: '/images/step-1png.png',
              alt: 'Step 1: Initial Consultation',
              reverse: false
            },
            {
              step: 2,
              title: 'Team Assignment',
              description: 'We assign a dedicated cleaning team to your facility. Your team becomes familiar with your space, preferences, and specific requirements, ensuring consistent, high-quality results every visit.',
              image: '/images/step-2.png',
              alt: 'Step 2: Team Assignment',
              reverse: true
            },
            {
              step: 3,
              title: 'Ongoing Service',
              description: 'Enjoy reliable, professional cleaning service with flexible scheduling that works around your business operations. Your account manager stays in regular contact to ensure your satisfaction.',
              image: '/images/step-3.png',
              alt: 'Step 3: Ongoing Service',
              reverse: false
            }
          ].map((stepData, index) => (
            <div
              key={stepData.step}
              className={`grid md:grid-cols-2 gap-12 items-center mb-16 last:mb-0 transition-all duration-700 ${
                visibleSections.has('how-it-works')
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className={stepData.reverse ? 'md:order-2' : ''}>
                <div className="relative rounded-xl overflow-hidden shadow-xl group hover:shadow-2xl transition-shadow duration-300">
            <Image
                    src={stepData.image}
                    alt={stepData.alt}
                    width={800}
                    height={600}
                    className="w-full h-auto"
                  />
                </div>
              </div>
              <div className={stepData.reverse ? 'md:order-1' : ''}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-naranja text-blanco rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                    {stepData.step}
                  </div>
                  <div className="h-1 flex-1 bg-naranja/20 rounded"></div>
                </div>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-azul mb-4">
                  {stepData.title}
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {stepData.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        ref={(el) => {
          sectionRefs.current['testimonials'] = el;
        }}
        className="py-20 md:py-32 bg-blanco"
      >
        <div className="container-custom">
          <div
            className={`text-center mb-16 transition-all duration-700 ${
              visibleSections.has('testimonials')
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-azul mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Trusted by businesses across DC, Maryland, and Virginia
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Jerald Bowman',
                title: 'Dealership Manager',
                company: 'Premier Auto Group',
                quote: 'ExterGen Group has transformed our dealership\'s appearance. Their consistent team knows our facility inside and out, and the communication is excellent. Highly recommend!',
                avatar: 'JB'
              },
              {
                name: 'Sofia Mocha',
                title: 'Facility Director',
                company: 'Metro Commercial Properties',
                quote: 'The flexibility in scheduling is a game-changer for our business. ExterGen Group works around our operations seamlessly, and the quality is consistently outstanding.',
                avatar: 'SM'
              }
            ].map((testimonial, index) => (
              <div
                key={index}
                className={`bg-blanco p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                  visibleSections.has('testimonials')
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed text-lg">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-naranja/20 rounded-full flex items-center justify-center text-naranja font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-azul">{testimonial.name}</p>
                    <p className="text-gray-600 text-sm">{testimonial.title}</p>
                    <p className="text-gray-500 text-sm">{testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        id="faq"
        ref={(el) => {
          sectionRefs.current['faq'] = el;
        }}
        className="py-20 md:py-32 bg-gray-50"
      >
        <div className="container-custom">
          <div
            className={`text-center mb-16 transition-all duration-700 ${
              visibleSections.has('faq')
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-azul mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about our services
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`bg-blanco rounded-xl shadow-md overflow-hidden transition-all duration-500 hover:shadow-lg ${
                  visibleSections.has('faq')
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                  aria-expanded={openFaq === index}
                >
                  <span className="font-semibold text-azul text-lg pr-4">{faq.question}</span>
                  <svg
                    className={`w-6 h-6 text-naranja flex-shrink-0 transition-transform duration-300 ${
                      openFaq === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 py-4 text-gray-700 border-t border-gray-100 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-azul to-azul/90 text-blanco relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(229,106,26,0.15),transparent_50%)]"></div>
        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Transform Your Space?
            </h2>
            <p className="text-xl text-blanco/90 mb-8 leading-relaxed">
              Get a free consultation and discover how ExterGen Group can elevate your commercial cleaning experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/quote"
                className="inline-block bg-naranja text-blanco px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#d45a15] transition-all duration-300 hover:shadow-xl hover:scale-105"
              >
                Get Free Quote
              </Link>
              <a
                href="tel:+1234567890"
                className="inline-block border-2 border-blanco/30 text-blanco px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blanco/10 hover:border-blanco/50 transition-all duration-300"
              >
                Call Us Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="contact"
        ref={(el) => {
          sectionRefs.current['contact'] = el;
        }}
        className="bg-azul text-blanco py-16"
      >
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">ExterGen Group</h3>
              <p className="text-blanco/80 mb-6 leading-relaxed max-w-md">
                Professional commercial cleaning services dedicated to maintaining the highest standards for businesses throughout DC, Maryland, and Virginia.
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-blanco/10 rounded-full flex items-center justify-center hover:bg-naranja transition-all duration-300 hover:scale-110"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-blanco/10 rounded-full flex items-center justify-center hover:bg-naranja transition-all duration-300 hover:scale-110"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
          </a>
          <a
                  href="#"
                  className="w-10 h-10 bg-blanco/10 rounded-full flex items-center justify-center hover:bg-naranja transition-all duration-300 hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#services"
                    onClick={(e) => smoothScroll(e, 'services')}
                    className="text-blanco/80 hover:text-naranja transition-colors duration-200"
                  >
                    Services
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    onClick={(e) => smoothScroll(e, 'how-it-works')}
                    className="text-blanco/80 hover:text-naranja transition-colors duration-200"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#testimonials"
                    onClick={(e) => smoothScroll(e, 'testimonials')}
                    className="text-blanco/80 hover:text-naranja transition-colors duration-200"
                  >
                    Testimonials
                  </a>
                </li>
                <li>
                  <a
                    href="#faq"
                    onClick={(e) => smoothScroll(e, 'faq')}
                    className="text-blanco/80 hover:text-naranja transition-colors duration-200"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-blanco/80">
                <li>Sterling, Virginia</li>
                <li>
                  <a href="mailto:info@extergengroup.com" className="hover:text-naranja transition-colors duration-200">
                    info@extergengroup.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blanco/20 pt-8 text-center text-blanco/60">
            <p>&copy; {new Date().getFullYear()} ExterGen Group. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Floating Contact Button */}
      <Link
        href="/quote"
        className="fixed bottom-8 right-8 bg-naranja text-blanco w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:bg-[#d45a15] transition-all duration-300 hover:scale-110 z-40 group"
        aria-label="Get Quote"
      >
        <svg
          className="w-6 h-6 group-hover:scale-110 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </Link>
    </div>
  );
}
