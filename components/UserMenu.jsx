"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { User, LogOut, Settings, ChevronDown } from "lucide-react";

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U"
    );
  };

  const formatName = (name) => {
    if (!name) return "User";
    return name.length > 20 ? name.slice(0, 20) + "..." : name;
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 bg-light-100/5 hover:bg-light-100/10 px-4 py-2 rounded-lg transition-colors group"
      >
        <div className="w-8 h-8 bg-linear-to-br from-[#FCD34D] to-[#F59E0B] rounded-full flex items-center justify-center">
          <span className="text-black font-bold text-sm">
            {getInitials(user.name)}
          </span>
        </div>

        <div className="hidden sm:block text-left">
          <p className="text-white font-medium text-sm">
            {formatName(user.name)}
          </p>
          <p className="text-gray-100 text-xs">
            {user.email.length > 25
              ? user.email.slice(0, 25) + "..."
              : user.email}
          </p>
        </div>

        <ChevronDown
          size={16}
          className={`text-gray-100 group-hover:text-white transition-all duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-dark-100 border border-light-100/10 rounded-xl shadow-2xl overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-light-100/10 bg-light-100/5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-linear-to-br from-[#D6C7FF] to-[#AB8BFF] rounded-full flex items-center justify-center">
                <span className="text-black font-bold">
                  {getInitials(user.name)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate">
                  {user.name}
                </p>
                <p className="text-gray-100 text-xs truncate">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="py-1">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full px-4 py-3 text-left flex items-center space-x-3 hover:bg-light-100/5 transition-colors text-gray-100 hover:text-white"
            >
              <User size={18} />
              <span className="text-sm">Profile Settings</span>
            </button>

            <button
              onClick={() => setIsOpen(false)}
              className="w-full px-4 py-3 text-left flex items-center space-x-3 hover:bg-light-100/5 transition-colors text-gray-100 hover:text-white"
            >
              <Settings size={18} />
              <span className="text-sm">Preferences</span>
            </button>

            <div className="border-t border-light-100/10 my-1"></div>

            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 text-left flex items-center space-x-3 hover:bg-red-500/10 transition-colors text-red-400 hover:text-red-300"
            >
              <LogOut size={18} />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
