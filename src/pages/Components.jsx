import React, { useState } from "react";
import {
  Button,
  Input,
  Loader,
  Modal,
  showSuccess,
  showError,
} from "../components/ui";
import {
  Search,
  Sparkles,
  Play,
  Trash2,
  CheckCircle,
  AlertOctagon,
  Info,
  AlertTriangle,
} from "lucide-react";
import Navbar from "../components/Navbar";

export default function Components() {
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSize, setModalSize] = useState("md");

  // Button loading toggles
  const [btnLoading, setBtnLoading] = useState(false);

  const triggerModal = (size) => {
    setModalSize(size);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-8 flex flex-col gap-10">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">
            Component Showcase
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
            Explore the premium UI system built for AI Guest Review Analyzer.
          </p>
        </div>

        {/* --- BUTTONS SECTION --- */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 p-6 shadow-lg flex flex-col gap-6">
          <div>
            <h2 className="text-xl font-bold text-slate-950 dark:text-white border-b border-slate-100 dark:border-slate-800/80 pb-3">
              1. Buttons
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Variants, sizes, loading states, and icon placements.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <div>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5">
                Variants
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary Gradient</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="success">Success</Button>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5">
                Disabled State
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary" disabled>Primary Disabled</Button>
                <Button variant="secondary" disabled>Secondary Disabled</Button>
                <Button variant="outline" disabled>Outline Disabled</Button>
              </div>
            </div>


            <div>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5">
                Sizes
              </p>
              <div className="flex items-center flex-wrap gap-3">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5">
                Icons & Loading
              </p>
              <div className="flex flex-wrap gap-3 items-center">
                <Button leftIcon={<Sparkles className="w-4 h-4" />}>
                  Left Icon
                </Button>
                <Button rightIcon={<Play className="w-4 h-4" />}>
                  Right Icon
                </Button>
                <Button isLoading={btnLoading}>Loading State</Button>
                <Button
                  variant="outline"
                  onClick={() => setBtnLoading(!btnLoading)}
                >
                  Toggle Loading
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* --- INPUTS SECTION --- */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 p-6 shadow-lg flex flex-col gap-6">
          <div>
            <h2 className="text-xl font-bold text-slate-950 dark:text-white border-b border-slate-100 dark:border-slate-800/80 pb-3">
              2. Inputs
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Flexible form entries with built-in validation states.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Input label="Default Input" placeholder="Type something..." />
            <Input
              label="Search Input"
              placeholder="Search databases..."
              leftIcon={<Search className="w-4 h-4" />}
            />
            <Input
              label="Input with Error"
              placeholder="Invalid input"
              error="This field contains invalid formatting."
            />
            <Input
              label="Input with Helper Text"
              placeholder="Provide detail"
              helperText="This helps identify your project configurations."
            />
          </div>
        </section>

        {/* --- LOADERS SECTION --- */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 p-6 shadow-lg flex flex-col gap-6">
          <div>
            <h2 className="text-xl font-bold text-slate-950 dark:text-white border-b border-slate-100 dark:border-slate-800/80 pb-3">
              3. Loaders
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Rotating spinners, bouncing dots, and pulsing highlights.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6 text-center items-center justify-center">
            <div className="flex flex-col gap-2 items-center justify-center border border-slate-100 dark:border-slate-800 p-4 rounded-2xl">
              <span className="text-xs font-semibold text-slate-400">Spinner</span>
              <Loader variant="spinner" size="lg" text="Processing..." />
            </div>

            <div className="flex flex-col gap-2 items-center justify-center border border-slate-100 dark:border-slate-800 p-4 rounded-2xl">
              <span className="text-xs font-semibold text-slate-400">Bouncing Dots</span>
              <Loader variant="dots" size="lg" />
            </div>

            <div className="flex flex-col gap-2 items-center justify-center border border-slate-100 dark:border-slate-800 p-4 rounded-2xl">
              <span className="text-xs font-semibold text-slate-400">Pulse Ping</span>
              <Loader variant="pulse" size="md" />
            </div>
          </div>
        </section>

        {/* --- MODAL SECTION --- */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 p-6 shadow-lg flex flex-col gap-6">
          <div>
            <h2 className="text-xl font-bold text-slate-950 dark:text-white border-b border-slate-100 dark:border-slate-800/80 pb-3">
              4. Modal Dialogs
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Overlay screens with full keyboard capture and backdrop options.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => triggerModal("sm")}>
              Open Small Modal
            </Button>
            <Button variant="outline" onClick={() => triggerModal("md")}>
              Open Medium Modal
            </Button>
            <Button variant="outline" onClick={() => triggerModal("lg")}>
              Open Large Modal
            </Button>
            <Button variant="outline" onClick={() => triggerModal("full")}>
              Open Full-Screen Modal
            </Button>
          </div>
        </section>

        {/* --- TOASTS SECTION --- */}
        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 p-6 shadow-lg flex flex-col gap-6">
          <div>
            <h2 className="text-xl font-bold text-slate-950 dark:text-white border-b border-slate-100 dark:border-slate-800/80 pb-3">
              5. Interactive react-hot-toast Notifications
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Click below to spawn notification banners on the screen using react-hot-toast.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="success"
              leftIcon={<CheckCircle className="w-4 h-4" />}
              onClick={() =>
                showSuccess(
                  "Review Parsed!",
                  "AI successfully identified positivity trends."
                )
              }
            >
              Trigger Success Toast
            </Button>
            <Button
              variant="danger"
              leftIcon={<AlertOctagon className="w-4 h-4" />}
              onClick={() =>
                showError(
                  "Connection Failed",
                  "Could not connect to external model APIs."
                )
              }
            >
              Trigger Error Toast
            </Button>
          </div>
        </section>
      </main>


      {/* --- MODAL INSTANCE --- */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${modalSize.toUpperCase()} Dialog Modal`}
        size={modalSize}
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setIsModalOpen(false)}>
              Understood
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm leading-relaxed">
            This dialog showcases the custom Modal UI component. It is built to overlay any page cleanly and capture user responses without leaving the view context.
          </p>
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-900 dark:text-indigo-300 border border-indigo-500/10">
            <Sparkles className="w-5 h-5 flex-shrink-0" />
            <p className="text-xs font-semibold">
              Supports dark mode, keyboard triggers (press Esc to close), and responsive layouts.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
