"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { PenTool, Check, X, AlertCircle } from "lucide-react";

interface EditContextType {
  isEditMode: boolean;
  setEditMode: (val: boolean) => void;
  isAdminUser: boolean;
  saveField: (type: "setting" | "page", key: string, field: string, value: string) => Promise<boolean>;
}

const EditContext = createContext<EditContextType>({
  isEditMode: false,
  setEditMode: () => {},
  isAdminUser: false,
  saveField: async () => false,
});

export function VisualEditorProvider({ 
  children, 
  isAdmin 
}: { 
  children: React.ReactNode; 
  isAdmin: boolean;
}) {
  const [isEditMode, setEditMode] = useState(false);
  const [activePrompt, setActivePrompt] = useState<{
    type: "setting" | "page";
    key: string;
    field: string;
    value: string;
    onConfirm: () => void;
    onCancel: () => void;
  } | null>(null);

  const saveField = async (type: "setting" | "page", key: string, field: string, value: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setActivePrompt({
        type,
        key,
        field,
        value,
        onConfirm: async () => {
          try {
            const res = await fetch("/api/admin/save-inline", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ type, key, field, value }),
            });
            if (res.ok) {
              resolve(true);
            } else {
              resolve(false);
            }
          } catch {
            resolve(false);
          }
          setActivePrompt(null);
        },
        onCancel: () => {
          resolve(false);
          setActivePrompt(null);
        }
      });
    });
  };

  return (
    <EditContext.Provider value={{ isEditMode, setEditMode, isAdminUser: isAdmin, saveField }}>
      {children}
      
      {/* Floating Visual Edit Mode Toggle */}
      {isAdmin && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setEditMode(!isEditMode)}
            className={`flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold shadow-2xl transition-all duration-300 ${
              isEditMode 
                ? "bg-amber-500 text-white animate-pulse" 
                : "bg-purple-600 text-white hover:bg-purple-700 hover:-translate-y-0.5"
            }`}
          >
            <PenTool className="h-4 w-4" />
            {isEditMode ? "Exit Edit Mode" : "Visual Edit Mode"}
          </button>
        </div>
      )}

      {/* Warning confirmation overlay modal (styled exactly as requested) */}
      {activePrompt && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="card">
            <div className="header">
              <div className="image">
                <svg
                  aria-hidden="true"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  ></path>
                </svg>
              </div>
              <div className="content">
                <span className="title">Confirm Visual Edit</span>
                <p className="message">
                  Are you sure you want to save these edits? These changes will be instantly visible to all website users and visitors. This action cannot be undone.
                </p>
              </div>
              <div className="actions">
                <button 
                  className="desactivate" 
                  type="button" 
                  onClick={activePrompt.onConfirm}
                >
                  Confirm & Save
                </button>
                <button 
                  className="cancel" 
                  type="button" 
                  onClick={activePrompt.onCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
          
          <style jsx>{`
            .card {
              overflow: hidden;
              position: relative;
              background-color: #ffffff;
              text-align: left;
              border-radius: 0.5rem;
              width: 100%;
              max-width: 290px;
              box-shadow:
                0 20px 25px -5px rgba(0, 0, 0, 0.1),
                0 10px 10px -5px rgba(0, 0, 0, 0.04);
            }

            .header {
              padding: 1.25rem 1rem 1rem 1rem;
              background-color: #ffffff;
            }

            .image {
              display: flex;
              margin-left: auto;
              margin-right: auto;
              background-color: #fee2e2;
              flex-shrink: 0;
              justify-content: center;
              align-items: center;
              width: 3rem;
              height: 3rem;
              border-radius: 9999px;
            }

            .image svg {
              color: #dc2626;
              width: 1.5rem;
              height: 1.5rem;
            }

            .content {
              margin-top: 0.75rem;
              text-align: center;
            }

            .title {
              color: #111827;
              font-size: 1rem;
              font-weight: 600;
              line-height: 1.5rem;
            }

            .message {
              margin-top: 0.5rem;
              color: #6b7280;
              font-size: 0.875rem;
              line-height: 1.25rem;
            }

            .actions {
              margin: 0.75rem 1rem;
              background-color: #f9fafb;
            }

            .desactivate {
              display: inline-flex;
              padding: 0.5rem 1rem;
              background-color: #dc2626;
              color: #ffffff;
              font-size: 1rem;
              line-height: 1.5rem;
              font-weight: 500;
              justify-content: center;
              width: 100%;
              border-radius: 0.375rem;
              border-width: 1px;
              border-color: transparent;
              box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            }

            .cancel {
              display: inline-flex;
              margin-top: 0.75rem;
              padding: 0.5rem 1rem;
              background-color: #ffffff;
              color: #374151;
              font-size: 1rem;
              line-height: 1.5rem;
              font-weight: 500;
              justify-content: center;
              width: 100%;
              border-radius: 0.375rem;
              border: 1px solid #d1d5db;
              box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            }

            button {
              cursor: pointer;
            }
          `}</style>
        </div>
      )}
    </EditContext.Provider>
  );
}

export function useVisualEdit() {
  return useContext(EditContext);
}

interface EditableTextProps {
  type: "setting" | "page";
  keyName: string;
  field: string;
  className?: string;
  children: React.ReactNode;
}

export function EditableText({ type, keyName, field, className = "", children }: EditableTextProps) {
  const { isEditMode, isAdminUser, saveField } = useVisualEdit();
  const elementRef = useRef<HTMLElement>(null);
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    if (elementRef.current) {
      setContent(elementRef.current.innerText);
    }
  }, [children]);

  const handleBlur = async () => {
    if (!elementRef.current) return;
    const newValue = elementRef.current.innerText.trim();
    if (newValue === content) return;

    const success = await saveField(type, keyName, field, newValue);
    if (success) {
      setContent(newValue);
    } else {
      // Revert content if failed or cancelled
      elementRef.current.innerText = content;
    }
  };

  const editableClass = isEditMode && isAdminUser
    ? "relative border-2 border-dashed border-amber-400 p-1 rounded bg-amber-50/10 cursor-pointer focus:outline-none focus:bg-amber-50/20 group-edit"
    : "";

  return (
    <span
      ref={elementRef as any}
      contentEditable={isEditMode && isAdminUser}
      onBlur={handleBlur}
      suppressContentEditableWarning
      className={`${editableClass} ${className}`}
    >
      {children}
    </span>
  );
}
