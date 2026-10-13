import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { api, AuthConfig, Customer } from "./api";
interface State {
  user: Customer | null;
  loading: boolean;
  error: string;
  config: AuthConfig;
  refresh: () => Promise<void>;
  setUser: (u: Customer | null) => void;
  logout: (all?: boolean) => Promise<void>;
}
const Context = createContext<State | null>(null);
export function CustomerProvider({ children }: { children: React.ReactNode }) {
  const [user, updateUser] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true),
    [error, setError] = useState("");
  const [config, setConfig] = useState<AuthConfig>({
    sms: false,
    email: false,
    gateway: false,
    razorpayKey: "",
  });
  const channel = useRef<BroadcastChannel | null>(null);
  const refresh = useCallback(async () => {
    setError("");
    try {
      const [data, settings] = await Promise.all([
        api<{ user: Customer | null }>("/auth/me"),
        api<AuthConfig>("/auth/config"),
      ]);
      updateUser(data.user);
      setConfig(settings);
    } catch (e) {
      updateUser(null);
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    refresh();
    if ("BroadcastChannel" in window) {
      channel.current = new BroadcastChannel("lg-gold-account");
      channel.current.onmessage = () => refresh();
    }
    return () => channel.current?.close();
  }, [refresh]);
  const setUser = (u: Customer | null) => {
    updateUser(u);
    channel.current?.postMessage("changed");
  };
  const logout = async (all = false) => {
    await api(all ? "/account/logout-all" : "/auth/logout", "POST");
    setUser(null);
  };
  return (
    <Context.Provider
      value={{ user, loading, error, config, refresh, setUser, logout }}
    >
      {children}
    </Context.Provider>
  );
}
export function useCustomer() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error("CustomerProvider is required.");
  return ctx;
}
