export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
      {children}
    </div>
  );
}
