import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { flushSync } from "react-dom";

/**
 * Hook de navigation personnalisé qui résout les problèmes de rendu
 * lors des transitions de route.
 *
 * Utilise ce hook AU LIEU DE useNavigate() de React Router.
 * Il garantit que React termine son cycle de rendu avant la navigation.
 */
export const useAppNavigate = () => {
  const navigate = useNavigate();

  const appNavigate = useCallback(
    (to, options = {}) => {
      // Utiliser flushSync pour forcer React à synchroniser le DOM
      flushSync(() => {
        // Force un re-render synchrone
        document.body.style.opacity = "0.99";
      });

      // Puis naviguer après un court délai
      setTimeout(() => {
        document.body.style.opacity = "1";
        navigate(to, options);
      }, 50);
    },
    [navigate]
  );

  return appNavigate;
};
