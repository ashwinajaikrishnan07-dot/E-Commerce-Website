export default function Orders() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-4">📦</div>
      <h1 className="font-display text-4xl text-maroon-700 mb-3">Orders</h1>
      <p className="text-gray-500 max-w-md mx-auto">
        Ordering is coming in <span className="font-semibold text-maroon-700">Phase 2</span>.
        For now, explore the catalogue, visualise your craft in the AI Studio, and
        save your favourite configurations to your wishlist.
      </p>
      <a href="/studio" className="kw-btn-primary mt-8">Try the AI Studio</a>
    </div>
  );
}
