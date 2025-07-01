"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Github, Linkedin, Mail } from "lucide-react";

const contactMethods = [
    {
        icon: Mail,
        label: "Email",
        value: "riteshmdhr@gmail.com",
        href: "mailto:riteshmdhr@gmail.com"
    },
    {
        icon: Linkedin,
        label: "LinkedIn",
        value: "linkedin.com/in/batman",
        href: "#"
    },
    {
        icon: Github,
        label: "GitHub",
        value: "github.com/batman",
        href: "#"
    }
]

const ContactSection = () => {
  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
          Contact Me
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Have a question or want to work together? Send a signal.
        </p>
      </div>
      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {contactMethods.map(method => (
            <a href={method.href} key={method.label} target="_blank" rel="noopener noreferrer">
                <Card className="text-center p-6 bg-card/50 border-primary/20 hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:shadow-accent/10 hover:-translate-y-2">
                    <CardContent className="flex flex-col items-center justify-center gap-4">
                        <method.icon className="w-10 h-10 text-accent"/>
                        <p className="font-bold text-lg">{method.label}</p>
                        <p className="text-sm text-muted-foreground">{method.value}</p>
                    </CardContent>
                </Card>
            </a>
        ))}
      </div>
    </section>
  );
};

export default ContactSection;
