import React from "react";
import {
  ArrowRight,
  Box,
  Check,
  ChevronRight,
  CircleHelp,
  Heart,
  LayoutDashboard,
  LogOut,
  MapPin,
  ShieldCheck,
  Truck,
  UserRound,
  Wheat,
} from "lucide-react";
import { useCustomer } from "./CustomerContext";
import { SavedOrder, STATUS, date, money } from "./api";
import { AppLink } from "../components/ui/AppLink";
import { Button, buttonClass } from "../components/ui/Button";
import { Container } from "../components/ui/Section";
import { navigate } from "../router";
import { PRODUCTS } from "../data/products";
export const NAV = [
  { route: "account", label: "Overview", icon: LayoutDashboard },
  { route: "orders", label: "My orders", icon: Box },
  { route: "addresses", label: "Addresses", icon: MapPin },
  { route: "profile", label: "Profile", icon: UserRound },
  { route: "security", label: "Security", icon: ShieldCheck },
  { route: "support", label: "Help", icon: CircleHelp },
];
export const ErrorNotice = ({ error }: { error: string }) =>
  error ? (
    <p
      role="alert"
      className="rounded-2xl bg-danger-50 px-5 py-4 text-sm font-medium text-danger ring-1 ring-danger/20"
    >
      {error}
    </p>
  ) : null;
export const Loading = () => (
  <div aria-busy="true" aria-label="Loading your account" className="space-y-4">
    <div className="skeleton h-44 rounded-3xl" />
    <div className="skeleton h-28 rounded-3xl" />
  </div>
);
export function RiceOrbit() {
  return (
    <div className="rice-orbit" aria-hidden="true">
      <div className="rice-orbit-ring" />
      <div className="rice-orbit-ring ring-two" />
      <div className="rice-orbit-ring ring-three" />
      <svg viewBox="0 0 240 240" className="rice-orbit-art">
        <path
          d="M120 193V50M120 84C95 85 87 64 91 52c19 0 30 14 29 32M120 107c26 0 37-20 30-35-20 1-31 15-30 35M120 133c-28 0-41-20-34-36 21-1 36 17 34 36M120 157c30 1 44-21 35-39-25 1-35 17-35 39"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      <span className="orbit-grain grain-one" />
      <span className="orbit-grain grain-two" />
      <span className="orbit-grain grain-three" />
    </div>
  );
}
export function AccountShell({
  route,
  title,
  subtitle,
  children,
}: {
  route: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const { user, loading, error, logout, refresh } = useCustomer();
  if (loading)
    return (
      <Container className="py-16">
        <Loading />
      </Container>
    );
  if (!user)
    return (
      <Container narrow className="py-16">
        <div className="account-panel text-center">
          <Wheat className="mx-auto h-12 w-12 text-gold-600" />
          <h1 className="mt-5 font-display text-4xl text-forest-800">
            Your place at the table
          </h1>
          <p className="mx-auto mt-3 max-w-md text-muted">
            Sign in to follow your orders, save delivery addresses and make your
            next rice order easier.
          </p>
          <div className="mt-6">
            <ErrorNotice error={error} />
          </div>
          <AppLink
            to="login"
            param={route === "order-detail" ? "orders" : route}
            className={`mt-6 ${buttonClass("primary", "lg")}`}
          >
            Sign in <ArrowRight className="h-4 w-4" />
          </AppLink>
          {error && (
            <Button variant="ghost" className="ml-2" onClick={refresh}>
              Retry connection
            </Button>
          )}
        </div>
      </Container>
    );
  return (
    <section className="account-section bg-cream pb-24">
      <Container className="py-8 sm:py-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.22em] text-gold-700">
              THE LG GOLD TABLE
            </p>
            <h1 className="mt-3 font-display text-4xl text-forest-800 sm:text-5xl">
              {title}
            </h1>
            {subtitle && <p className="mt-3 max-w-xl text-muted">{subtitle}</p>}
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-forest-800 ring-1 ring-line">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-gold-100 text-xs font-bold">
              {user.name.charAt(0).toUpperCase()}
            </span>
            {user.name}
          </span>
        </div>
        <div className="grid min-w-0 grid-cols-1 gap-7 lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="min-w-0">
            <nav aria-label="Customer account" className="account-nav">
              <div className="hidden px-4 pb-4 pt-2 lg:block">
                <p className="font-display text-xl text-forest-800">
                  A little more personal.
                </p>
                <p className="mt-2 text-sm text-muted">
                  Your rice. Your routine.
                </p>
              </div>
              {NAV.map(({ route: to, label, icon: Icon }) => (
                <AppLink
                  key={to}
                  to={to}
                  aria-current={
                    route === to ||
                    (to === "orders" && route === "order-detail")
                      ? "page"
                      : undefined
                  }
                  className={`account-nav-link ${route === to || (to === "orders" && route === "order-detail") ? "is-active" : ""}`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </AppLink>
              ))}
              {user.role === "admin" && (
                <AppLink to="admin-orders" className="account-nav-link">
                  <ShieldCheck className="h-4 w-4" />
                  Manage orders
                </AppLink>
              )}
              <button
                className="account-nav-link text-muted cursor-pointer"
                onClick={async () => {
                  try {
                    await logout();
                    navigate("login");
                  } catch {
                    refresh();
                  }
                }}
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </nav>
          </aside>
          <div className="min-w-0 space-y-6 account-content">{children}</div>
        </div>
      </Container>
    </section>
  );
}
export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="account-panel py-12 text-center">
      <div className="mx-auto grid h-20 w-20 place-items-center rounded-[28px] bg-gold-50 text-gold-700">
        <Wheat className="h-9 w-9" />
      </div>
      <h2 className="mt-5 font-display text-3xl text-forest-800">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-muted">{body}</p>
      <AppLink to="products" className={`mt-6 ${buttonClass("primary")}`}>
        Explore our rice <ArrowRight className="h-4 w-4" />
      </AppLink>
    </div>
  );
}
export function StatusBadge({ order }: { order: SavedOrder }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${order.status === "cancelled" ? "bg-danger-50 text-danger" : order.status === "delivered" ? "bg-forest-50 text-forest-800" : "bg-gold-50 text-gold-700"}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {STATUS[order.status]}
    </span>
  );
}
export function OrderCard({ order }: { order: SavedOrder }) {
  return (
    <AppLink to="order-detail" param={order.id} className="order-card group">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-muted">
            {date(order.createdAt)}
          </p>
          <p className="mt-1 font-semibold text-forest-800">{order.orderId}</p>
        </div>
        <StatusBadge order={order} />
      </div>
      <div className="mt-5 flex items-center gap-4">
        <ProductThumb item={order.items[0]} />
        <div className="min-w-0 flex-1">
          <p className="font-display text-xl text-forest-800">
            {order.items[0]?.productName}
          </p>
          <p className="mt-1 text-sm text-muted">
            {order.items.reduce((n, i) => n + i.quantity, 0)} packs
            {order.items.length > 1
              ? ` · ${order.items.length} varieties / sizes`
              : ` · ${order.items[0]?.packSize}`}
          </p>
        </div>
        <p className="font-semibold tabular text-forest-800">
          {money(order.totals.total)}
        </p>
        <ChevronRight className="h-5 w-5 text-gold-700 transition-transform group-hover:translate-x-1" />
      </div>
    </AppLink>
  );
}
export function ProductThumb({ item }: { item: SavedOrder["items"][number] }) {
  const image =
    PRODUCTS.find((p) => p.slug === item?.productSlug)?.images.primary ||
    item?.image;
  return (
    <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-cream p-2 ring-1 ring-line">
      {image ? (
        <img src={image} alt="" className="h-full w-full object-contain" />
      ) : (
        <Wheat className="h-7 w-7 text-gold-700" />
      )}
    </div>
  );
}
export function OrderJourney({ order }: { order: SavedOrder }) {
  const stages = [
    "placed",
    "confirmed",
    "packing",
    "shipped",
    "delivered",
  ] as const;
  const current = stages.indexOf(order.status as (typeof stages)[number]);
  if (order.status === "cancelled")
    return (
      <p className="rounded-2xl bg-danger-50 px-5 py-4 text-danger">
        This order was cancelled. You can browse the shop to place a new order.
      </p>
    );
  return (
    <ol className="order-journey" aria-label="Order progress">
      {stages.map((s, i) => (
        <li
          key={s}
          className={`journey-stop ${i <= current ? "is-complete" : ""} ${i === current ? "is-current" : ""}`}
          aria-current={i === current ? "step" : undefined}
        >
          <div className="journey-node">
            {i < current ? (
              <Check className="h-4 w-4" />
            ) : i === 3 ? (
              <Truck className="h-4 w-4" />
            ) : (
              <span>{i + 1}</span>
            )}
          </div>
          <p className="mt-2 text-xs font-semibold">{STATUS[s]}</p>
        </li>
      ))}
    </ol>
  );
}
