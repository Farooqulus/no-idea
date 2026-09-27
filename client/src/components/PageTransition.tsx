import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";
import { useLocation } from "wouter";

export default function PageTransition({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <AnimatePresence mode="wait" initial={false}><motion.div key={location} className="page-transition" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .34, ease: [0.23, 1, 0.32, 1] }}>{children}</motion.div></AnimatePresence>;
}
