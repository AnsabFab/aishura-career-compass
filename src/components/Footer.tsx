
export const Footer = () => {
  return (
    <footer className="glass-effect border-t border-cosmic-500/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-cosmic-500/20 rounded-lg flex items-center justify-center">
                <span className="text-cosmic-400 font-bold text-sm">AI</span>
              </div>
              <h3 className="font-orbitron text-lg font-bold text-gradient">AIShura</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Your emotionally intelligent AI career guide, empowering the next generation of professionals.
            </p>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>© 2025 AIShura. All Rights Reserved.</p>
              <p>Registered in the USA.</p>
            </div>
          </div>

          {/* Founders */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Leadership</h4>
            <div className="space-y-2 text-sm">
              <div>
                <p className="font-medium text-cosmic-400">Keon Lee</p>
                <p className="text-muted-foreground">Founder & CEO</p>
              </div>
              <div>
                <p className="font-medium text-aurora-400">Ansab</p>
                <p className="text-muted-foreground">Co-founder & CTO</p>
              </div>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Legal</h4>
            <div className="space-y-2 text-sm">
              <a href="#" className="text-muted-foreground hover:text-cosmic-400 transition-colors block">
                Privacy Policy
              </a>
              <a href="#" className="text-muted-foreground hover:text-cosmic-400 transition-colors block">
                Terms of Service
              </a>
              <a href="#" className="text-muted-foreground hover:text-cosmic-400 transition-colors block">
                Cookie Policy
              </a>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Contact</h4>
            <div className="space-y-2 text-sm">
              <a href="#" className="text-muted-foreground hover:text-cosmic-400 transition-colors block">
                Contact Us
              </a>
              <a href="#" className="text-muted-foreground hover:text-cosmic-400 transition-colors block">
                Support Center
              </a>
              <a href="#" className="text-muted-foreground hover:text-cosmic-400 transition-colors block">
                Community
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-cosmic-500/20 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-xs text-muted-foreground">
            Cutting-edge AI technology for the future of career development.
          </div>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span>Version 1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
