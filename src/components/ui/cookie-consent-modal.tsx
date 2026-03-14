'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cookie, Shield, Settings } from 'lucide-react';
import { CustomButton } from '@/components/ui/custom-button';
import Link from 'next/link';

export default function CookieConsentModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAcceptedCookies = localStorage.getItem('cookies-accepted');
    if (!hasAcceptedCookies) {
      // Show modal after a short delay
      setTimeout(() => {
        setIsVisible(true);
      }, 2000);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookies-accepted', 'true');
    setIsVisible(false);
  };

  const handleAcceptNecessary = () => {
    localStorage.setItem('cookies-accepted', 'necessary-only');
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookies-accepted', 'rejected');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <></>
  );
}
