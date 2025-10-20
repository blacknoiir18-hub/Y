import { Search, Moon, Sun, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { getCurrentUser } from '@/lib/mockData';

interface HeaderProps {
  onSearch: (query: string) => void;
  onToggleSidebar?: () => void;
}

export const Header = ({ onSearch }: HeaderProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(getCurrentUser());
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(getCurrentUser());
    };
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 500);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  // Debounce search propagation to parent for better performance
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      onSearch(searchQuery);
    }, 300);
    return () => window.clearTimeout(timeoutId);
  }, [searchQuery, onSearch]);

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-xl border-b shadow-sm">
      <div className="px-3 sm:px-4 py-2 sm:py-2.5">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link to="/" className="flex-shrink-0 group transition-all hover:scale-105">
            <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-heading font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              <span className="hidden xs:inline sm:hidden md:inline">Priya's Collection</span>
              <span className="xs:hidden sm:inline md:hidden">Priya's</span>
            </h1>
          </Link>

          <div className="flex-1 max-w-xl md:max-w-2xl">
            <div className="relative">
              <Search className="absolute left-2 sm:left-2.5 md:left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
              <Input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-7 sm:pl-8 md:pl-9 h-8 sm:h-9 md:h-10 rounded-full border focus-visible:border-primary transition-all text-xs sm:text-sm w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
            {user && (
              <Link to="/wishlist">
                <Button variant="ghost" size="icon" className="relative hover:bg-primary/10 transition-all rounded-full h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10">
                  <Heart className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-primary" />
                </Button>
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle theme"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 hover:bg-primary/10"
            >
              {theme === 'dark' ? <Sun className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" /> : <Moon className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};