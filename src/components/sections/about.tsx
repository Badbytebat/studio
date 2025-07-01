"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VenetianMask } from "lucide-react";
import Image from "next/image";

const AboutSection = () => {
    return (
        <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                    About Me
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                    A glimpse into the mind behind the cowl.
                </p>
            </div>
            <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-8 items-center">
                <div className="md:col-span-2">
                    <Card className="overflow-hidden border-2 border-accent/20 shadow-lg shadow-accent/10">
                        <Image
                            src="https://placehold.co/400x500.png"
                            data-ai-hint="professional portrait"
                            alt="Ritesh"
                            width={400}
                            height={500}
                            className="object-cover w-full h-full"
                        />
                    </Card>
                </div>
                <div className="md:col-span-3">
                    <Card className="bg-card/50 border-primary/20 p-6 rounded-lg">
                        <CardHeader>
                             <CardTitle className="flex items-center gap-2 font-headline text-2xl">
                                <VenetianMask className="text-primary"/>
                                Strategist by Day, Coder by Night
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-foreground/80">
                            <p>
                                I am an aspiring Data Scientist with a passion for uncovering insights from complex datasets and building intelligent solutions. My journey in technology began with a curiosity for how things work, which has since evolved into a dedicated pursuit of knowledge in machine learning, data analysis, and software development.
                            </p>
                            <p>
                                Like the caped crusader, I am analytical, persistent, and resourceful. I thrive on challenges and am constantly honing my skills to tackle the next big problem. My goal is to leverage data to drive innovation and create a tangible impact.
                            </p>
                            <p>
                                When I'm not crunching numbers or writing code, I explore new technologies, contribute to open-source projects, and enjoy a good cup of coffee.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}

export default AboutSection;
