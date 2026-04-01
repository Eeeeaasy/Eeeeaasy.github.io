// App.jsx
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./home/Navbar";
import HomeSection from "./home/HomeSection";
import SkillsSection from "./skills/SkillsSection";

export default function App() {
  const [currentPage, setCurrentPage] = useState("/");

  return (
    <>
      <Navbar onNavClick={setCurrentPage} currentPage={currentPage} />

      <AnimatePresence exitBeforeEnter>
        {currentPage === "/" && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <HomeSection />
          </motion.div>
        )}

        {currentPage === "/skills" && (
          <motion.div key="skills" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <SkillsSection />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}