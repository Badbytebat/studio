"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const ResumeSection = () => {
  return (
    <section id="resume" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-4xl mx-auto text-center">
         <h2 className="text-3xl md:text-4xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
          Get My Resume
        </h2>
        <p className="mt-4 text-lg text-muted-foreground mb-8">
          Want a copy of my full professional profile? Download it here.
        </p>
        <Button size="lg" className="jelly-btn glass-effect rounded-full shadow-lg shadow-accent/30 border-accent/50 text-base py-6 px-8 hover:bg-accent hover:text-accent-foreground">
          <Download className="w-5 h-5 mr-3" />
          Download Resume
        </Button>
      </div>
    </section>
  );
};

export default ResumeSection;
