"use client";

import type React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, Check } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Link from "next/link";
import { Github, Linkedin, Instagram } from "lucide-react";

const schema = z.object({
  name: z
    .string()
    .nonempty({ message: "Full Name is required" })
    .regex(/^[a-zA-Z\s]+$/, { message: "Invalid name" })
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name must be less than 50 characters" }),
  email: z
    .string()
    .nonempty({ message: "Email is required" })
    .email({ message: "Invalid email address" }),
  subject: z
    .string()
    .nonempty({ message: "Subject is required" })
    .min(2, { message: "Subject must be at least 2 characters long" })
    .max(100, { message: "Subject must be less than 100 characters" }),
  message: z
    .string()
    .nonempty({ message: "Message is required" })
    .min(10, { message: "Message must be at least 10 characters long" })
    .max(500, { message: "Message must be less than 500 characters" })
    .regex(/^[a-zA-Z\s]+$/, { message: "Invalid name" })
});

export default function Contact() {
  const socialLinks = [
    { name: "GitHub", icon: Github, href: "https://github.com/ghanatherohit" },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: "https://www.linkedin.com/in/ghanatherohit",
    },
    {
      name: "Instagram",
      icon: Instagram,
      href: "https://www.instagram.com/therohitghanathe",
    },
  ];
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const ref = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
    reValidateMode: "onSubmit",
    shouldFocusError: true,
    shouldUnregister: true,
    criteriaMode: "all",
  });

  const y = useTransform(scrollYProgress, [0, 0.8], [50, 0]);

  return (
    <section
      id="contact"
      ref={ref}
      className="py-16 md:py-20 bg-muted/50 dark:bg-muted/30"
    >
      <motion.div style={{ y }} className="container px-6 mx-auto">
        <SectionHeading
          title="Get In Touch"
          subtitle="Let's discuss your project"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h3 className="text-2xl font-bold">
              Let&apos;s build something amazing together
            </h3>
            <p className="text-muted-foreground">
              I&apos;m currently available for freelance work or full-time positions.
              If you have a project that needs some creative touch, I&apos;d love to
              hear about it.
            </p>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Email
                  </h4>
                  {/* Open mail with the email */}
                  <a
                    href="mailto:2004ghanatherohit@gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Email"
                    className="text-base"
                  >
                    <span className="text-base hover:text-primary transition-colors">
                      2004ghanatherohit@gmail.com
                    </span>
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">
                    Phone
                  </h4>
                  <p className="text-base">+91 7xxxxxxxxx7</p>
                </div>
              </div>

              <a
                href="https://www.google.com/maps/place/Hyderabad,+Telangana/@17.385044,78.486671,10z/data=!3m1!4b1!4m6!3m5!1s0x3bcb935f8c8c8c8c:0x3bcb935f8c8c8c8c!8m2!3d17.385044!4d78.486671!16zL20vMDNnY2Zl"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Location"
                className="flex items-center gap-4 hover:text-primary transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">
                      Location
                    </h4>
                    <p className="text-base">Hyderabad, India</p>
                  </div>
                </div>
              </a>
            </div>
            <div
              className="flex items-center justify-between pt-8 border-t border-border dark:border-border/50"
              aria-label="Social Links"
            >
              <div className="flex space-x-4">
                {socialLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors rounded-full p-2 hover:bg-primary/20"
                    aria-label={link.name}
                  >
                    <link.icon className="h-5 w-5" />
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Form submission section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex items-center justify-center"
          >
            <div className="relative p-6 bg-background rounded-2xl shadow-lg border border-border dark:bg-background/50">
              <div className="absolute -inset-1.5 -z-10 rounded-2xl bg-gradient-to-r from-primary/20 to-primary/30 blur-xl opacity-50 dark:opacity-70" />
              {/* Form submission section */}
              <form
                ref={formRef}
                className="space-y-6"
                onSubmit={handleSubmit(async (data) => {
                  setIsSubmitting(true);
                  try {
                    // Simulate form submission
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                    console.log("Form Data:", data);
                    setIsSubmitted(true);
                  } catch (error) {
                    console.error("Form submission error:", error);
                  } finally {
                    setIsSubmitting(false);
                    setTimeout(() => {
                      setIsSubmitted(false);
                      formRef.current?.reset();
                    }, 3000);
                  }
                })}
              >
                {/* Name and Email inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name
                    </label>
                    <input
                      {...register("name")}
                      ref={(e) => {
                        register("name").ref(e);
                      }}
                      type="text"
                      id="name"
                      name="name"
                      required
                      placeholder="Your name"
                      className="bg-muted/50 dark:bg-muted/30 w-full rounded-md border border-input px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    {errors && (
                      <p className="text-red-500 text-sm">
                        {errors.name?.message}
                      </p>
                    )}
                  </div>

                  {/* Email input */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <input
                      {...register("email")}
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="Your email"
                      className="bg-muted/50 dark:bg-muted/30 w-full rounded-md border border-input px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    {errors && (
                      <p className="text-red-500 text-sm">
                        {errors.email?.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Subject input */}
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <input
                    {...register("subject")}
                    ref={(e) => {
                      register("subject").ref(e);
                    }}
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    placeholder="Project inquiry"
                    className="bg-muted/50 dark:bg-muted/30 w-full rounded-md border border-input px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  {errors && (
                    <p className="text-red-500 text-sm">
                      {errors.subject?.message}
                    </p>
                  )}
                </div>

                {/* Message input */}
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <Textarea
                    {...register("message")}
                    ref={(e) => {
                      register("message").ref(e);
                    }}
                    id="message"
                    name="message"
                    placeholder="Tell me about your project..."
                    rows={5}
                    required
                    className="bg-muted/50 dark:bg-muted/30 w-full rounded-md border border-input px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  {errors && (
                    <p className="text-red-500 text-sm ">
                      {errors.message?.message}
                    </p>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || isSubmitted}
                >
                  <div className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/60 transition-colors rounded-full py-3 px-6 relative">
                    <span>
                      {isSubmitting ? (
                        <span className="loader text-white">Sending...</span>
                      ) : isSubmitted ? (
                        <span className="text-white">
                          <Check className="h-5 w-6 text-green-500 inline-block mx-2" />
                          Message Sent!
                        </span>
                      ) : (
                        <span className="text-white">
                          <Send className="h-5 w-5 text-whit inline-block mx-2" />
                          Send Message
                        </span>
                      )}
                    </span>
                    <div
                      className={`absolute inset-0 rounded-full bg-gradient-to-r from-primary/10 to-primary/20 blur-xl opacity-50 dark:opacity-70 transition-all duration-300 ${
                        isSubmitting || isSubmitted ? "scale-100" : "scale-0"
                      }`}
                    />
                  </div>
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
