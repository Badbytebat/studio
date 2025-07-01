
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import type { PortfolioData } from '@/lib/types';
import { defaultData } from '@/lib/data';
import { getPortfolioData, savePortfolioData } from '@/lib/firestore';
import { useAuth } from '@/context/auth-provider';
import { useToast } from '@/hooks/use-toast';
import { useDebouncedCallback } from '@/hooks/use-debounced-callback';

import LoginScreen from '@/components/login-screen';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import CustomCursor from '@/components/custom-cursor';
import HeroSection from '@/components/sections/hero';
import AboutSection from '@/components/sections/about';
import ExperienceSection from '@/components/sections/experience';
import SkillsSection from '@/components/sections/skills';
import ProjectsSection from '@/components/sections/projects';
import QualificationsSection from '@/components/sections/qualifications';
import ResumeSection from '@/components/sections/resume';
import ContactSection from '@/components/sections/contact';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const { user, loading: authLoading, sendSignInLink, signOut } = useAuth();
  const { toast } = useToast();
  
  const [data, setData] = useState<PortfolioData>(defaultData);
  const [initialDataLoading, setInitialDataLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const [email, setEmail] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  
  const [shatterActive, setShatterActive] = useState(false);
  const [batAnimation, setBatAnimation] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setInitialDataLoading(true);
      try {
        const portfolioData = await getPortfolioData();
        setData(portfolioData);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error fetching data',
          description: 'Could not load portfolio data. Displaying default content.'
        });
      } finally {
        setInitialDataLoading(false);
      }
    };
    fetchData();
  }, [toast]);
  
  // Handle auth state changes
  useEffect(() => {
    if (!authLoading) {
      if (user) {
        setEditMode(true);
        setShowLogin(false);
        toast({ title: "Welcome, Bat!", description: "Edit mode activated." });
        document.documentElement.classList.remove('viewer-mode-active');
      } else {
        setEditMode(false);
      }
    }
  }, [user, authLoading, toast]);

  const debouncedSave = useDebouncedCallback(async (newData: PortfolioData) => {
    if (!editMode) return;
    try {
      await savePortfolioData(newData);
      toast({ description: "Changes saved automatically." });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Save failed', description: 'Could not save changes.' });
    }
  }, 1500);

  const handleUpdate = useCallback(<K extends keyof PortfolioData>(
    section: K,
    id: number,
    field: string,
    value: any
  ) => {
    setData(prevData => {
      const sectionData = prevData[section] as any[];
      const updatedSectionData = sectionData.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      );
      const newData = { ...prevData, [section]: updatedSectionData };
      debouncedSave(newData);
      return newData;
    });
  }, [debouncedSave]);
  
  const handleAdd = useCallback(<K extends keyof PortfolioData>(section: K) => {
    setData(prevData => {
        const sectionData = prevData[section] as any[];
        const newId = sectionData.length > 0 ? Math.max(...sectionData.map(item => item.id)) + 1 : 1;
        
        let newItem: any;
        switch (section) {
            case 'experience':
                newItem = { id: newId, role: 'New Role', company: 'New Company', duration: 'Present', description: '...' };
                break;
            case 'skills':
                newItem = { id: newId, name: 'New Skill', level: 50 };
                break;
            case 'projects':
                newItem = { id: newId, title: 'New Project', description: '...', tags: [], link: '#' };
                break;
            case 'qualifications':
                newItem = { id: newId, title: 'New Qualification', institution: '...', duration: 'Year', description: '...' };
                break;
        }

        const newData = { ...prevData, [section]: [...sectionData, newItem] };
        debouncedSave(newData);
        return newData;
    });
  }, [debouncedSave]);

  const handleDelete = useCallback(<K extends keyof PortfolioData>(section: K, id: number) => {
    setData(prevData => {
        const sectionData = prevData[section] as any[];
        const updatedSectionData = sectionData.filter(item => item.id !== id);
        const newData = { ...prevData, [section]: updatedSectionData };
        debouncedSave(newData);
        return newData;
    });
  }, [debouncedSave]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendSignInLink(email);
  };

  const handleViewerMode = () => {
    setShatterActive(true);
    setBatAnimation(true);
    document.documentElement.classList.add('viewer-mode-active');
    setTimeout(() => setShowLogin(false), 1000); 
  };
  
  const handleLogout = async () => {
    await signOut();
    setEditMode(false);
    setShowLogin(true);
    document.documentElement.classList.remove('viewer-mode-active');
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  if (authLoading || initialDataLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="ml-4 text-xl">Loading Batcave...</p>
      </div>
    );
  }

  if (showLogin && !user) {
    return (
      <LoginScreen
        email={email}
        setEmail={setEmail}
        handleEmailSubmit={handleEmailSubmit}
        handleViewerMode={handleViewerMode}
        shatterActive={shatterActive}
        batAnimation={batAnimation}
      />
    );
  }
  
  return (
    <>
      {!editMode && <CustomCursor />}
      <Header 
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        scrollToSection={scrollToSection}
      />
      
      {editMode && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button onClick={handleLogout}>Logout & Exit Edit Mode</Button>
        </div>
      )}

      <main className="flex min-h-screen flex-col bg-background">
        <HeroSection scrollToSection={scrollToSection} />
        <AboutSection />
        <ExperienceSection 
            data={data.experience} 
            editMode={editMode} 
            updateEntry={handleUpdate as any}
            addEntry={handleAdd as any}
            deleteEntry={handleDelete as any}
        />
        <SkillsSection 
            data={data.skills} 
            editMode={editMode}
            updateEntry={handleUpdate as any}
            addEntry={handleAdd as any}
            deleteEntry={handleDelete as any}
        />
        <ProjectsSection 
            data={data.projects} 
            editMode={editMode} 
            updateEntry={handleUpdate as any}
            addEntry={handleAdd as any}
            deleteEntry={handleDelete as any}
        />
        <QualificationsSection 
            data={data.qualifications} 
            editMode={editMode} 
            updateEntry={handleUpdate as any}
            addEntry={handleAdd as any}
            deleteEntry={handleDelete as any}
        />
        <ResumeSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
