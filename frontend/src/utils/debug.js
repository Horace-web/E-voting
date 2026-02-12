// Utilitaires de debug pour monitoring post-déploiement

export const getErrorLogs = () => {
  try {
    return JSON.parse(localStorage.getItem("api_error_logs") || "[]");
  } catch {
    return [];
  }
};

const pushRuntimeLog = (entry) => {
  try {
    const logs = JSON.parse(localStorage.getItem("runtime_error_logs") || "[]");
    logs.push(entry);
    if (logs.length > 50) {
      logs.shift();
    }
    localStorage.setItem("runtime_error_logs", JSON.stringify(logs));
  } catch {
    // ignore
  }
};

export const clearErrorLogs = () => {
  localStorage.removeItem("api_error_logs");
};

export const downloadErrorLogs = () => {
  const logs = getErrorLogs();
  const blob = new Blob([JSON.stringify(logs, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `error-logs-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  if (a.parentNode) {
    a.parentNode.removeChild(a);
  }
  URL.revokeObjectURL(url);
};

// Fonction pour afficher les logs dans la console (debug)
export const debugErrorLogs = () => {
  const logs = getErrorLogs();
  console.group("📋 Error Logs Summary");
  console.log(`Total errors: ${logs.length}`);
  
  // Grouper par URL
  const errorsByUrl = logs.reduce((acc, log) => {
    const key = log.url || "unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  
  console.table(errorsByUrl);
  
  // Afficher les 5 dernières erreurs
  console.log("Last 5 errors:");
  logs.slice(-5).forEach((log, i) => {
    console.log(`${i + 1}. [${log.timestamp}] ${log.method} ${log.url} - ${log.status}`);
  });
  
  console.groupEnd();
};

// Ajouter un raccourci clavier pour afficher les logs (Ctrl+Shift+D)
if (typeof window !== "undefined") {
  if (import.meta.env.DEV && !window.__removeChildPatched) {
    window.__removeChildPatched = true;
    const originalRemoveChild = Node.prototype.removeChild;
    Node.prototype.removeChild = function patchedRemoveChild(child) {
      try {
        return originalRemoveChild.call(this, child);
      } catch (err) {
        try {
          // eslint-disable-next-line no-console
          console.error("[DOM removeChild failed]", {
            parent: this,
            child,
            parentChildren: this?.childNodes,
          });
          // eslint-disable-next-line no-console
          console.error("[DOM removeChild stack]", new Error().stack);
        } catch {
          // ignore
        }
        return child;
      }
    };
  }

  window.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === "D") {
      e.preventDefault();
      debugErrorLogs();
    }
  });

  window.addEventListener("error", (event) => {
    const entry = {
      timestamp: new Date().toISOString(),
      type: "window.error",
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack,
    };

    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error("[RuntimeError]", entry);
    }
    pushRuntimeLog(entry);
  });

  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason;
    const entry = {
      timestamp: new Date().toISOString(),
      type: "unhandledrejection",
      message: reason?.message || String(reason),
      stack: reason?.stack,
    };

    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error("[UnhandledRejection]", entry);
    }
    pushRuntimeLog(entry);
  });
}
