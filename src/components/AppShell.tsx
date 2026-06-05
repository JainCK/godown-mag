"use client";
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { RightSidebar } from './RightSidebar';
import { getTransactions, type Transaction } from '@/lib/storage';

// Safe mathematical expression evaluator
function evaluateMathExpression(expr: string): string {
  const sanitized = expr.replace(/[^0-9+\-*/().\s]/g, "");
  if (!sanitized.trim()) return "";
  try {
    const result = new Function(`return (${sanitized})`)();
    if (result === undefined || isNaN(result)) return "Error";
    return Number(result).toLocaleString("en-IN", { maximumFractionDigits: 4 });
  } catch (e) {
    return "Error";
  }
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    const auth = sessionStorage.getItem("smart_ledger_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
    setMounted(true);
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (usernameInput === "admin" && passwordInput === "admin123") ||
      (usernameInput.startsWith("staff") && passwordInput === "cargo48")
    ) {
      sessionStorage.setItem("smart_ledger_auth", "true");
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Invalid credentials. Try 'admin'/'admin123' or 'staff'/'cargo48'.");
    }
  };
  
  // Visual Calculator State
  const [calcOpen, setCalcOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState("");
  const [isEvaluated, setIsEvaluated] = useState(false);

  const pathname = usePathname();

  // Fetch transactions to compute latest values
  useEffect(() => {
    setTransactions(getTransactions());
  }, [pathname]);

  const handleButtonClick = (val: string) => {
    if (val === 'C') {
      handleClear();
    } else if (val === '=') {
      handleEvaluate();
    } else {
      setDisplayValue(prev => {
        if (isEvaluated) {
          setIsEvaluated(false);
          return val;
        }
        return prev + val;
      });
    }
  };

  const handleClear = () => {
    setDisplayValue("");
    setIsEvaluated(false);
  };

  const handleEvaluate = () => {
    if (!displayValue.trim()) return;
    const result = evaluateMathExpression(displayValue);
    setDisplayValue(result);
    setIsEvaluated(true);
  };

  useEffect(() => {
    if (!calcOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable
      ) {
        return;
      }

      const key = e.key;

      if (/[0-9.]/.test(key)) {
        e.preventDefault();
        handleButtonClick(key);
      } else if (["+", "-", "*", "/", "(", ")"].includes(key)) {
        e.preventDefault();
        handleButtonClick(key);
      } else if (key === "Enter" || key === "=") {
        e.preventDefault();
        handleEvaluate();
      } else if (key === "Backspace") {
        e.preventDefault();
        setDisplayValue(prev => prev.slice(0, -1));
      } else if (key === "Escape" || key === "c" || key === "C") {
        e.preventDefault();
        handleClear();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [calcOpen, displayValue, isEvaluated]);

  if (!mounted) return null;

  // Sign-in option disabled for now but code kept in place
  if (false && !isAuthenticated) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#E0E1DD] font-mono select-none p-4">
        <div className="w-full max-w-sm border border-[#1B263B] bg-[#f3f4f2] shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-[#0D1B2A] text-white text-center py-1.5 font-bold text-xs uppercase tracking-wider">
            Smart Ledger - Security Gateway
          </div>
          
          <form onSubmit={handleLoginSubmit} className="p-5 space-y-4 text-xs">
            <div className="text-center text-[#cc0000] font-bold border-b border-[#E0E1DD] pb-2 mb-2 uppercase tracking-wide">
              User Login Required
            </div>

            {loginError && (
              <div className="bg-[#cc0000]/10 border border-[#cc0000] text-[#cc0000] p-2 font-bold text-[11px] mb-2">
                {loginError}
              </div>
            )}

            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#0D1B2A]">Username / User ID</label>
                <input 
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="e.g. admin"
                  required
                  className="bg-white border border-[#1B263B] px-2 py-1.5 font-mono text-[#0D1B2A] focus:bg-black focus:text-white focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-[#0D1B2A]">Password</label>
                <input 
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter secure password"
                  required
                  className="bg-white border border-[#1B263B] px-2 py-1.5 font-mono text-[#0D1B2A] focus:bg-black focus:text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">
                Hint: admin / admin123
              </span>
              <button 
                type="submit"
                className="bg-[#415A77] hover:bg-[#1B263B] text-white font-bold px-4 py-1.5 border border-[#1B263B] cursor-pointer text-xs transition-colors active:translate-y-0.5"
              >
                Log In
              </button>
            </div>
            
            <div className="border-t border-[#E0E1DD] pt-2 mt-2 text-center text-[9px] text-[#778DA9]">
              Office Staff Security Terminal • 48 Authorized Profiles
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#E0E1DD]">
      {/* 1. Header & Utility bar */}
      <Header />

      {/* 2. Main Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Keyboard Shortcut Panel */}
        <RightSidebar />

        {/* Center Dashboard Workspace (Left status card and left sidebar removed completely) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">

          {/* Dynamic Content Container */}
          <div className="flex-1 flex flex-col overflow-hidden bg-[#E0E1DD] relative">
            <main className="flex-1 overflow-y-auto p-4 md:p-6">
              {children}
            </main>

            {/* Slide-Up Visual Grid Calculator Widget (Positioned bottom right) */}
            {calcOpen && (
              <div className="calculator-widget absolute bottom-4 right-4 w-60 border border-[#1B263B] bg-[#E0E1DD] shadow-lg flex flex-col shrink-0 font-mono text-xs z-50 select-none">
                {/* Calculator Title Bar */}
                <div className="bg-[#0D1B2A] text-white px-3 py-1 flex items-center justify-between font-bold text-[10px] uppercase">
                  <span>Visual Calculator</span>
                  <button 
                    onClick={() => setCalcOpen(false)}
                    className="hover:bg-red-700 px-1.5 cursor-pointer font-bold"
                  >
                    ✕
                  </button>
                </div>
                
                {/* Calculator Screen Display */}
                <div className="bg-[#ffffff] text-[#0D1B2A] p-2.5 text-right font-bold text-lg border-b border-[#1B263B] overflow-x-auto whitespace-nowrap min-h-[44px]">
                  {displayValue || "0"}
                </div>

                {/* Calculator Button Grid */}
                <div className="grid grid-cols-4 gap-1 p-2 bg-[#E0E1DD]/30">
                  {/* Row 1 */}
                  <button onClick={() => handleButtonClick('C')} className="bg-[#cc0000] text-white p-2 font-bold hover:bg-red-700 cursor-pointer active:translate-y-0.5">C</button>
                  <button onClick={() => handleButtonClick('(')} className="bg-[#415A77] text-white p-2 font-bold hover:bg-[#778DA9] cursor-pointer active:translate-y-0.5">(</button>
                  <button onClick={() => handleButtonClick(')')} className="bg-[#415A77] text-white p-2 font-bold hover:bg-[#778DA9] cursor-pointer active:translate-y-0.5">)</button>
                  <button onClick={() => handleButtonClick('/')} className="bg-[#0D1B2A] text-white p-2 font-bold hover:bg-[#1B263B] cursor-pointer active:translate-y-0.5">/</button>

                  {/* Row 2 */}
                  <button onClick={() => handleButtonClick('7')} className="bg-white text-[#0D1B2A] border border-[#E0E1DD] p-2 font-bold hover:bg-gray-100 cursor-pointer active:translate-y-0.5">7</button>
                  <button onClick={() => handleButtonClick('8')} className="bg-white text-[#0D1B2A] border border-[#E0E1DD] p-2 font-bold hover:bg-gray-100 cursor-pointer active:translate-y-0.5">8</button>
                  <button onClick={() => handleButtonClick('9')} className="bg-white text-[#0D1B2A] border border-[#E0E1DD] p-2 font-bold hover:bg-gray-100 cursor-pointer active:translate-y-0.5">9</button>
                  <button onClick={() => handleButtonClick('*')} className="bg-[#415A77] text-white p-2 font-bold hover:bg-[#1B263B] cursor-pointer active:translate-y-0.5">*</button>

                  {/* Row 3 */}
                  <button onClick={() => handleButtonClick('4')} className="bg-white text-[#0D1B2A] border border-[#E0E1DD] p-2 font-bold hover:bg-gray-100 cursor-pointer active:translate-y-0.5">4</button>
                  <button onClick={() => handleButtonClick('5')} className="bg-white text-[#0D1B2A] border border-[#E0E1DD] p-2 font-bold hover:bg-gray-100 cursor-pointer active:translate-y-0.5">5</button>
                  <button onClick={() => handleButtonClick('6')} className="bg-white text-[#0D1B2A] border border-[#E0E1DD] p-2 font-bold hover:bg-gray-100 cursor-pointer active:translate-y-0.5">6</button>
                  <button onClick={() => handleButtonClick('-')} className="bg-[#415A77] text-white p-2 font-bold hover:bg-[#1B263B] cursor-pointer active:translate-y-0.5">-</button>

                  {/* Row 4 */}
                  <button onClick={() => handleButtonClick('1')} className="bg-white text-[#0D1B2A] border border-[#E0E1DD] p-2 font-bold hover:bg-gray-100 cursor-pointer active:translate-y-0.5">1</button>
                  <button onClick={() => handleButtonClick('2')} className="bg-white text-[#0D1B2A] border border-[#E0E1DD] p-2 font-bold hover:bg-gray-100 cursor-pointer active:translate-y-0.5">2</button>
                  <button onClick={() => handleButtonClick('3')} className="bg-white text-[#0D1B2A] border border-[#E0E1DD] p-2 font-bold hover:bg-gray-100 cursor-pointer active:translate-y-0.5">3</button>
                  <button onClick={() => handleButtonClick('+')} className="bg-[#415A77] text-white p-2 font-bold hover:bg-[#1B263B] cursor-pointer active:translate-y-0.5">+</button>

                  {/* Row 5 */}
                  <button onClick={() => handleButtonClick('0')} className="col-span-2 bg-white text-[#0D1B2A] border border-[#E0E1DD] p-2 font-bold hover:bg-gray-100 cursor-pointer active:translate-y-0.5">0</button>
                  <button onClick={() => handleButtonClick('.')} className="bg-white text-[#0D1B2A] border border-[#E0E1DD] p-2 font-bold hover:bg-gray-100 cursor-pointer active:translate-y-0.5">.</button>
                  <button onClick={() => handleButtonClick('=')} className="bg-[#0D1B2A] text-[#E0E1DD] p-2 font-bold hover:bg-[#1B263B] cursor-pointer active:translate-y-0.5">=</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Footer */}
      <footer className="h-10 bg-[#E0E1DD] border-t border-[#1B263B] text-[10px] flex items-stretch select-none shrink-0 font-sans justify-between">
        <div className="flex border-r border-[#1B263B]">
          <div className="bg-[#0D1B2A] text-white px-3 flex flex-col justify-center items-center font-bold tracking-tight">
            <span className="text-[12px] leading-none uppercase">Smart Ledger</span>
            <span className="text-[7px] uppercase tracking-widest text-[#778DA9] font-normal leading-none mt-0.5">Operations Tracker</span>
          </div>
        </div>
        
        {/* Middle Footer area left completely blank and clean */}
        <div className="flex-1"></div>

        {/* Calculator Trigger Button */}
        <button 
          onClick={() => setCalcOpen(!calcOpen)}
          className={`flex w-44 border-l border-[#1B263B] flex-col justify-center items-center text-[10px] font-mono font-bold cursor-pointer transition-colors ${
            calcOpen 
              ? "bg-[#0D1B2A] text-white" 
              : "bg-[#E0E1DD] text-[#0D1B2A] hover:bg-[#778DA9] hover:text-white"
          }`}
        >
          <span>Calculator</span>
          <span className={`text-[8px] font-normal ${calcOpen ? 'text-[#E0E1DD]' : 'text-muted-foreground'}`}>
            {calcOpen ? "Click to Close" : "Click to Open"}
          </span>
        </button>
      </footer>
    </div>
  );
}
