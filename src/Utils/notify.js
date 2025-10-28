// Lightweight safe notifier wrapper.
// Avoids importing react-toastify at module-eval time which can crash
// in some environments. By default falls back to alert() and console.

export function success(msg) {
  try {
    // try dynamic import of react-toastify at call time
    // this will succeed only if the library works in the environment
    import("react-toastify")
      .then((mod) => {
        if (mod && mod.toast && typeof mod.toast.success === "function") {
          mod.toast.success(msg);
        } else {
          // fallback
          console.log("SUCCESS:", msg);
          alert(msg);
        }
      })
      .catch(() => {
        console.log("SUCCESS:", msg);
        alert(msg);
      });
  } catch {
    console.log("SUCCESS:", msg);
    alert(msg);
  }
}

export function error(msg) {
  try {
    import("react-toastify")
      .then((mod) => {
        if (mod && mod.toast && typeof mod.toast.error === "function") {
          mod.toast.error(msg);
        } else {
          console.error(msg);
          alert(msg);
        }
      })
      .catch(() => {
        console.error(msg);
        alert(msg);
      });
  } catch {
    console.error(msg);
    alert(msg);
  }
}

export function info(msg) {
  try {
    import("react-toastify")
      .then((mod) => {
        if (mod && mod.toast && typeof mod.toast.info === "function") {
          mod.toast.info(msg);
        } else {
          console.log("INFO:", msg);
        }
      })
      .catch(() => {
        console.log("INFO:", msg);
      });
  } catch {
    console.log("INFO:", msg);
  }
}

// Export a no-op ToastContainer component (could be enhanced to dynamically load)
import React, { useEffect, useState } from "react";

// Dynamically mount react-toastify's ToastContainer when available.
export function AsyncToastContainer() {
  const [ToastComp, setToastComp] = useState(null);

  useEffect(() => {
    let mounted = true;
    // dynamically import both the module and CSS
    Promise.all([
      import("react-toastify"),
      import("react-toastify/dist/ReactToastify.css").catch(() => null),
    ])
      .then(([mod]) => {
        if (!mounted) return;
        const Comp = mod.ToastContainer;
        setToastComp(() => Comp);
      })
      .catch(() => {
        // ignore - we'll fallback to alerts
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (!ToastComp) return null;
  return React.createElement(ToastComp, {
    position: "top-right",
    pauseOnHover: true,
  });
}
