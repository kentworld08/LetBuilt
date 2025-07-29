"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Clock, Send, User, MessageSquare } from "lucide-react";
import Link from "next/link";

// Define the category options as a const array
const CATEGORY_OPTIONS = [
  "Trading Question",
  "Finance Question",
  "Technical Question",
] as const;

// Zod validation schema
const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  email: z
    .email({ message: "Please enter a valid email address" })
    .refine((val) => val.length > 0, { message: "Email is required" }),
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(100, "Subject must be less than 100 characters"),
  category: z.union([
    z.literal("Trading Question"),
    z.literal("Finance Question"),
    z.literal("Technical Question"),
  ]),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export function ContactContent() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      category: "Trading Question",
      message: "",
    },
  });

  const messageLength = watch("message")?.length || 0;

  const onSubmit = async (data: ContactFormData) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Form submitted:", data);
      reset();
    } catch (error) {
      console.error("Form submission error:", error);
      throw error;
    }
  };

  return (
    <div className="bg-gray-900 text-white">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-gray-800 to-gray-900 py-16 md:py-24 lg:py-32">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-6 md:mb-8">
            <span className="text-orange-500">Contact</span> Us
          </h1>
          <div className="flex items-center justify-center space-x-2 text-gray-300 text-sm md:text-base">
            <Link href="/" className="hover:text-orange-500 transition-colors">
              HOME
            </Link>
            <span>/</span>
            <span>CONTACT US</span>
          </div>
        </div>

        {/* Animated blockchain particles background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="particles-container">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="particle"
                style={{
                  left: `${(i * 7) % 100}%`,
                  animationDelay: `${i * 0.8}s`,
                  animationDuration: `${12 + (i % 8)}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 text-orange-500">
                Feel free to drop us a message.
              </h2>
              <p className="text-gray-300 text-sm md:text-base lg:text-lg max-w-2xl mx-auto">
                We`re here to help with any questions or concerns you may have.
                Our team typically responds within 24 hours.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
              {/* Contact Information Cards */}
              <div className="lg:col-span-1 space-y-6">
                {/* Email Card */}
                <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-xl p-6 hover:border-orange-500/40 transition-all duration-300">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">
                        Email Us
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Get in touch via email
                      </p>
                    </div>
                  </div>
                  <a
                    href="mailto:support@letbuilt.com"
                    className="text-orange-500 hover:text-orange-400 transition-colors font-medium"
                  >
                    support@letbuilt.com
                  </a>
                </div>

                {/* Business Hours Card */}
                <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-6 hover:border-blue-500/40 transition-all duration-300">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">
                        Business Hours
                      </h3>
                      <p className="text-gray-400 text-sm">
                        When we`re available
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-white font-medium">
                      MON-SAT 08AM - 05PM
                    </p>
                    <p className="text-gray-400 text-sm">
                      Response within 24 hours
                    </p>
                  </div>
                </div>

                {/* Location Card */}
                <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-6 hover:border-green-500/40 transition-all duration-300">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg">
                        Our Locations
                      </h3>
                      <p className="text-gray-400 text-sm">Where we operate</p>
                    </div>
                  </div>
                  <p className="text-white">Wales, Australia, England</p>
                </div>

                {/* Response Times */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <h4 className="text-white font-semibold mb-4 flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2 text-orange-500" />
                    Expected Response Times
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">
                        Trading Questions
                      </span>
                      <span className="text-orange-500 font-medium text-sm">
                        2-4 hours
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">
                        Finance Questions
                      </span>
                      <span className="text-orange-500 font-medium text-sm">
                        4-8 hours
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">
                        Technical Questions
                      </span>
                      <span className="text-orange-500 font-medium text-sm">
                        1-2 hours
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-gray-800 rounded-xl p-8 border border-gray-700 shadow-2xl">
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      What can we help you with?
                    </h3>
                    <p className="text-gray-400">
                      Fill out the form below and we`ll get back to you as soon
                      as possible.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Name and Email Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Name Field */}
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-300 mb-2"
                        >
                          <User className="w-4 h-4 inline mr-2" />
                          Full Name *
                        </label>
                        <input
                          {...register("name")}
                          type="text"
                          id="name"
                          className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                            errors.name
                              ? "border-red-500 ring-2 ring-red-500/20"
                              : "border-gray-600 hover:border-gray-500"
                          }`}
                          placeholder="Enter your full name"
                        />
                        {errors.name && (
                          <p className="mt-2 text-sm text-red-400 flex items-center">
                            <span className="w-4 h-4 mr-1">⚠️</span>
                            {errors.name.message}
                          </p>
                        )}
                      </div>

                      {/* Email Field */}
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-300 mb-2"
                        >
                          <Mail className="w-4 h-4 inline mr-2" />
                          Email Address *
                        </label>
                        <input
                          {...register("email")}
                          type="email"
                          id="email"
                          className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                            errors.email
                              ? "border-red-500 ring-2 ring-red-500/20"
                              : "border-gray-600 hover:border-gray-500"
                          }`}
                          placeholder="your.email@example.com"
                        />
                        {errors.email && (
                          <p className="mt-2 text-sm text-red-400 flex items-center">
                            <span className="w-4 h-4 mr-1">⚠️</span>
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="category"
                          className="block text-sm font-medium text-gray-300 mb-2"
                        >
                          Question Category *
                        </label>
                        <select
                          {...register("category")}
                          id="category"
                          className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 ${
                            errors.category
                              ? "border-red-500 ring-2 ring-red-500/20"
                              : "border-gray-600 hover:border-gray-500"
                          }`}
                        >
                          {CATEGORY_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                        {errors.category && (
                          <p className="mt-2 text-sm text-red-400 flex items-center">
                            <span className="w-4 h-4 mr-1">⚠️</span>
                            {errors.category.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Message Field */}
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-300 mb-2"
                      >
                        <MessageSquare className="w-4 h-4 inline mr-2" />
                        Message *
                      </label>
                      <textarea
                        {...register("message")}
                        id="message"
                        rows={6}
                        maxLength={1000}
                        className={`w-full px-4 py-3 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none overflow-y-auto transition-all duration-200 min-h-[150px] max-h-[200px] ${
                          errors.message
                            ? "border-red-500 ring-2 ring-red-500/20"
                            : "border-gray-600 hover:border-gray-500"
                        }`}
                        placeholder="Please provide detailed information about your inquiry..."
                        style={{
                          scrollbarWidth: "thin",
                          scrollbarColor: "#f97316 #374151",
                        }}
                      />
                      <div className="flex justify-between items-center mt-2">
                        {errors.message ? (
                          <p className="text-sm text-red-400 flex items-center">
                            <span className="w-4 h-4 mr-1">⚠️</span>
                            {errors.message.message}
                          </p>
                        ) : (
                          <div></div>
                        )}
                        <p
                          className={`text-sm font-medium ${
                            messageLength > 950
                              ? "text-red-400"
                              : messageLength > 800
                              ? "text-yellow-400"
                              : "text-gray-400"
                          }`}
                        >
                          {messageLength}/1000
                          {messageLength >= 1000 && (
                            <span className="ml-2 text-red-400">
                              Character limit reached!
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Sending Message...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center space-x-2">
                            <Send className="w-5 h-5" />
                            <span>Send Message</span>
                          </div>
                        )}
                      </Button>
                    </div>

                    {/* Success Message */}
                    {isSubmitSuccessful && (
                      <div className="bg-gradient-to-r from-green-500/20 to-green-600/10 border border-green-500/30 text-green-400 px-6 py-4 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm">✓</span>
                          </div>
                          <div>
                            <p className="font-medium">
                              Message sent successfully!
                            </p>
                            <p className="text-sm text-green-300">
                              We`ll get back to you within 24 hours.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </form>
                </div>

                {/* Quick Help Section */}
                <div className="mt-8 bg-gradient-to-r from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">
                    Need Immediate Help?
                  </h3>
                  <p className="text-gray-300 mb-4 text-sm">
                    For urgent trading issues or account problems, check out our
                    resources below.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                    >
                      <a href="/faqs" className="flex items-center space-x-2">
                        <span>📚</span>
                        <span>View FAQs</span>
                      </a>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                    >
                      <span className="flex items-center space-x-2">
                        <span>📖</span>
                        <span>Help Center</span>
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-transparent border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                    >
                      <span className="flex items-center space-x-2">
                        <span>💬</span>
                        <span>Live Chat</span>
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
