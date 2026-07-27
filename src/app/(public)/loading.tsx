export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/20 backdrop-blur-[2px]">
      <div className="loader" />
    </div>
  );
}
