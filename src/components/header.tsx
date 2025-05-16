'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ShoppingBag, Menu, X, User, LogOut, ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSession, signOut } from "next-auth/react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const { data: session } = useSession();
  const { items } = useCart();

  const handleSignOut = async () => {
    try {
      // Clear any local storage and cookies first
      localStorage.clear();
      sessionStorage.clear();
      
      // Delete all cookies with specific domains
      const domains = ['.vercel.app', 'minhaiolyfs-wedding.vercel.app', window.location.hostname];
      const paths = ['/', '/api'];
      
      domains.forEach(domain => {
        paths.forEach(path => {
          document.cookie = `next-auth.session-token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; domain=${domain}`;
          document.cookie = `next-auth.callback-url=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; domain=${domain}`;
          document.cookie = `next-auth.csrf-token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}; domain=${domain}`;
        });
      });
      
      // Sign out with NextAuth
      await signOut({ 
        redirect: false,
        callbackUrl: '/'
      });
      
      // Force a complete page reload to ensure all session data is cleared
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
      // Even if there's an error, we should still try to clear the session
      window.location.href = '/';
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSubmenu = (submenu: string) => {
    setActiveSubmenu(activeSubmenu === submenu ? null : submenu);
  };

  return (
    <header className="w-full bg-white">
      {/* Top info bar */}
      <div className="flex items-center justify-between bg-zinc-600 text-white px-4 py-1 text-xs">
        <div>
          <Link href="tel:0938330448" className="hover:underline">
            Hotline: 0878773737
          </Link>
        </div>
        <div className="flex items-center space-x-2">
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white hover:text-gray-200">
                  <User className="h-4 w-4 mr-2" />
                  {session.user.fullName || session.user.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link href="/account/profile" className="flex items-center w-full">
                    <User className="h-4 w-4 mr-2" />
                    Account Information
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/account/orders" className="flex items-center w-full">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    My Orders
                  </Link>
                </DropdownMenuItem>
                {session.user.role === 'admin' && (
                  <>
                    <DropdownMenuItem>
                      <Link href="/admin/products" className="flex items-center w-full">
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Product Management
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href="/admin/order" className="flex items-center w-full">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Order Management
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem>
                  <Link href="/cart" className="flex items-center w-full">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Shopping Cart
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/register" className="hover:underline">
                Register
              </Link>
              <span>|</span>
              <Link href="/login" className="hover:underline">
                Login
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Mobile menu button */}
        <button
          className="md:hidden text-gray-700"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/logo.png"
            alt="NHUNGTRANG Wedding"
            width={500}
            height={100}
            className="h-auto w-auto max-h-16"
          />
        </Link>

        {/* Search bar */}
        <div className="hidden md:flex items-center border border-gray-300 rounded-sm max-w-xs relative">
          <Input
            type="text"
            placeholder="Search..."
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-8"
          />
          <Button size="icon" variant="ghost" className="absolute right-0 h-8 w-8">
            <Search className="h-4 w-4" />
          </Button>
        </div>

        {/* Cart */}
        <Link href="/cart" className="relative">
          <ShoppingBag className="h-5 w-5 text-gray-700" />
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-amber-800 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {items.length}
            </span>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="border-t border-gray-200 hidden md:block">
        <div className="container mx-auto px-4">
          <ul className="flex items-center justify-center space-x-8 py-4">
            <li>
              <Link href="/collections/" className="text-gray-700 hover:text-gray-900">
                COLLECTIONS
              </Link>
            </li>
            <li>
              <Link href="/collections/ao-cuoi" className="text-gray-700 hover:text-gray-900">
                WEDDING DRESSES
              </Link>
            </li>
            <li>
              <Link href="/collections/ao-dai-co-dau" className="text-gray-700 hover:text-gray-900">
                TRADITIONAL DRESSES
              </Link>
            </li>
            <li>
              <Link href="/testimonials" className="text-gray-700 hover:text-gray-900">
                TESTIMONIALS
              </Link>
            </li>
            <li>
              <Link href="https://www.facebook.com/nhung.trang.5855594" className="text-gray-700 hover:text-gray-900">
                FANPAGE
              </Link>
            </li>
            <li>
              <Link href="https://www.instagram.com/nhungtrangweddingvn/" className="text-gray-700 hover:text-gray-900">
                INSTAGRAM
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white fixed inset-0 z-50 pt-16 overflow-auto">
          <div className="absolute top-4 right-4">
            <button onClick={toggleMenu} className="text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="px-4 py-2">
            <ul className="space-y-4">
              <li>
                <button
                  onClick={() => toggleSubmenu('collections')}
                  className="flex items-center justify-between w-full text-left py-2 border-b border-gray-200"
                >
                  <span>COLLECTIONS</span>
                  <span>{activeSubmenu === 'collections' ? '-' : '+'}</span>
                </button>
                {activeSubmenu === 'collections' && (
                  <ul className="pl-4 mt-2 space-y-2">
                    <li>
                      <Link href="/pages/do-you-still-you" className="block py-1 text-sm">
                        Do you see you? - Fall Collection 2025
                      </Link>
                    </li>
                    <li>
                      <Link href="/collections/when-the-clasic-meets-contemporary" className="block py-1 text-sm">
                        When The Classic Meets Contemporary 2025
                      </Link>
                    </li>
                    <li>
                      <Link href="/collections/cham-fall-collection" className="block py-1 text-sm">
                        Touch Fall Collection
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <button
                  onClick={() => toggleSubmenu('ao-cuoi')}
                  className="flex items-center justify-between w-full text-left py-2 border-b border-gray-200"
                >
                  <span>WEDDING DRESSES</span>
                  <span>{activeSubmenu === 'ao-cuoi' ? '-' : '+'}</span>
                </button>
                {activeSubmenu === 'ao-cuoi' && (
                  <ul className="pl-4 mt-2 space-y-2">
                    <li>
                      <Link href="/pages/bo-suu-tap" className="block py-1 text-sm">
                        Categories
                      </Link>
                    </li>
                    <li>
                      <Link href="/pages/cac-dong-vay-tai-nhungtrang" className="block py-1 text-sm">
                        Dress Collections
                      </Link>
                    </li>
                    <li>
                      <Link href="/pages/ao-cuoi" className="block py-1 text-sm">
                        Wedding Dress Styles
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <button
                  onClick={() => toggleSubmenu('ao-dai')}
                  className="flex items-center justify-between w-full text-left py-2 border-b border-gray-200"
                >
                  <span>ÁO DÀI</span>
                  <span>{activeSubmenu === 'ao-dai' ? '-' : '+'}</span>
                </button>
                {activeSubmenu === 'ao-dai' && (
                  <ul className="pl-4 mt-2 space-y-2">
                    <li>
                      <Link href="/pages/bo-suu-tao-ao-dai-khue-cac-2025" className="block py-1 text-sm">
                        Traditional Dress Collection
                      </Link>
                    </li>
                    <li>
                      <Link href="/collections/ao-dai-co-dau" className="block py-1 text-sm">
                        Traditional Dress Styles
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <Link href="/testimonials" className="block py-2 border-b border-gray-200">
                  TESTIMONIALS
                </Link>
              </li>
              <li>
                <Link href="https://www.facebook.com/nhung.trang.5855594" className="block py-2 border-b border-gray-200">
                  FANPAGE
                </Link>
              </li>
              <li>
                <Link href="https://www.instagram.com/nhungtrangweddingvn/" className="block py-2 border-b border-gray-200">
                  INSTAGRAM
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
