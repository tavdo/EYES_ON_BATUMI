export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <div className="admin-shell relative z-20 min-h-dvh bg-cream">{children}</div>;
}
