import { useEffect, useState } from "react";

const PageTransition = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Marquer comme monté immédiatement
    setMounted(true);
  }, []);

  // Toujours afficher le contenu, mais avec une animation
  return <div className={`fade-in ${mounted ? "opacity-100" : "opacity-0"}`}>{children}</div>;
};

export default PageTransition;
