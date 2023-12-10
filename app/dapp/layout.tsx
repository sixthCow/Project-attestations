export default function SchemaLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="max-w-xl flex w-full">
        {children}
      </div>
    )
  }