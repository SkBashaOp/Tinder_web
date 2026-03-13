import React from "react";
import { Flame, Heart, Twitter, Github, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white/50 backdrop-blur-sm dark:bg-black/50 border-t border-border py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-romantic-gradient text-white shadow-md">
              <Flame size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-romantic">
              devTinder
            </span>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm text-center md:text-left">
            Connect with developers who share your passion for clean code and great products.
          </p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground pt-1">
            <Link to="/privacy-policy" className="hover:text-pink-500 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-pink-500 transition-colors">Terms of Service</Link>
            <Link to="/refund-policy" className="hover:text-pink-500 transition-colors">Refund Policy</Link>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end space-y-6">
          <div className="flex space-x-6 text-muted-foreground">
            <a href="#" aria-label="Twitter Profile" className="hover:text-pink-500 transition-colors"><Twitter size={20} /></a>
            <a href="#" aria-label="GitHub Profile" className="hover:text-pink-500 transition-colors"><Github size={20} /></a>
            <a href="#" aria-label="LinkedIn Profile" className="hover:text-pink-500 transition-colors"><Linkedin size={20} /></a>
          </div>
          <div className="flex text-sm text-muted-foreground gap-1 items-center">
            <span>Made with</span>
            <Heart size={14} className="text-pink-500 fill-pink-500 mx-1" />
            <span>in {new Date().getFullYear()}</span>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-border/50 text-center text-xs text-muted-foreground/70">
        DevTinder is an independent developer project and is not affiliated with Tinder or Match Group.
      </div>
    </footer>
  );
};

export default Footer;
