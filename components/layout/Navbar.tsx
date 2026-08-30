'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Receipt as ReceiptIcon, 
  PlusCircle, 
  Files, 
  Users, 
  LayoutTemplate, 
  Settings, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/create', label: 'Create Receipt', icon: PlusCircle, highlight: true },
    { href: '/receipts', label: 'Receipts', icon: Files },
    { href: '/customers', label: 'Customers', icon: Users },
    { href: '/templates', label: 'Templates', icon: LayoutTemplate },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#29203f] bg-[#0d0a17]/90 backdrop-blur-md transition-colors no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-purple-600 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-purple-600/30 group-hover:scale-105 transition-transform">
              <ReceiptIcon className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                BillMate
              </span>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                PRO
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1.5">
            <Link
              href="/"
              className={`px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                pathname === '/'
                  ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-[#1a1429]'
              }`}
            >
              Dashboard
            </Link>

            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              if (link.highlight) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="ml-2 mr-1 inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-violet-600 via-purple-600 to-orange-600 text-white hover:opacity-90 shadow-md shadow-purple-600/30 active:scale-95 transition-all"
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                    active
                      ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-[#1a1429]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button (No theme toggle) */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border border-[#29203f] text-slate-300 hover:bg-[#1a1429] transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#29203f] bg-[#0d0a17] px-4 pt-3 pb-5 space-y-1.5 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold ${
              pathname === '/'
                ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                : 'text-slate-300 hover:bg-[#1a1429]'
            }`}
          >
            Dashboard
          </Link>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold ${
                  link.highlight
                    ? 'bg-gradient-to-r from-violet-600 to-orange-600 text-white font-bold'
                    : active
                    ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                    : 'text-slate-300 hover:bg-[#1a1429]'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
