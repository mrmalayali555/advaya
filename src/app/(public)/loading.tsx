export default function Loading() {
  return (
    <div className="fixed inset-x-0 top-0 z-[9999] h-1 overflow-hidden bg-purple-100">
      <div className="h-full w-full bg-purple-600 animate-pulse origin-left animate-in" />
    </div>
  );
}
