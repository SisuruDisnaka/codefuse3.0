"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { WhatsAppJoinCard } from "@/components/whatsapp-join-card";

interface WhatsAppJoinModalProps {
  open: boolean;
  onClose: () => void;
}

// Shown right after a successful registration, prompting the person to
// join the participants' WhatsApp group.
export function WhatsAppJoinModal({ open, onClose }: WhatsAppJoinModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-void-950/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="whatsapp-join-title"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 12 }}
            transition={{ type: "spring", damping: 22, stiffness: 260 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 rounded-full bg-black/5 p-1.5 text-void-800 transition hover:bg-black/10"
            >
              <X size={18} />
            </button>

            <WhatsAppJoinCard headingId="whatsapp-join-title" />

            <button
              type="button"
              onClick={onClose}
              className="mx-auto mt-4 block text-xs text-ink-300 underline-offset-2 hover:underline"
            >
              I&apos;ll join later
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
