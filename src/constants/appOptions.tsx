import React from "react";
import { Home, Shield, BookOpen, Boxes, Flag, User } from "lucide-react";
import type { PageKey } from "../types/app";

export const navItems: Array<{ key: PageKey; label: string; icon: React.ReactNode }> = [
  { key: "landing", label: "Home", icon: <Home size={17} /> },
  { key: "about", label: "About", icon: <Shield size={17} /> },
  { key: "guide", label: "Guide", icon: <BookOpen size={17} /> },
  { key: "units", label: "Units", icon: <Boxes size={17} /> },
  { key: "myForces", label: "My Forces", icon: <Flag size={17} /> },
  { key: "myCampaigns", label: "Campaigns", icon: <Flag size={17} /> },
  { key: "myAccount", label: "Account", icon: <User size={17} /> },
];

export const aboutChildren: Array<{ key: PageKey; label: string }> = [
  { key: "faq", label: "FAQ" },
  { key: "campaignTypes", label: "Campaign Types" },
];

export const ERA_OPTIONS = [
  "All",
  "Star League",
  "Succession Wars",
  "Clan Invasion",
  "Civil War",
  "Jihad",
  "Republic",
  "Dark Age",
  "IlClan",
];

export const RULE_OPTIONS = ["All", "Introductory", "Standard", "Advanced", "Experimental", "Unofficial"];
