export default function Privacy() {
  return (
    <div>
      <div className="bg-gradient-to-r from-stone-900 to-stone-800 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-white">Privacy Policy</h1>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-16 prose prose-stone prose-sm max-w-none">
        <p className="text-stone-600 leading-relaxed">Last updated: {new Date().toLocaleDateString()}</p>
        <h2 className="font-heading text-xl font-bold text-stone-900 mt-8 mb-4">1. Information We Collect</h2>
        <p className="text-stone-600 leading-relaxed mb-4">When you browse our curtain collections, place a custom order, request a quote, or book an installation service, we collect information such as your name, email address, phone number, delivery address, and window measurements to fulfill your order and provide personalized curtain recommendations.</p>
        <h2 className="font-heading text-xl font-bold text-stone-900 mt-8 mb-4">2. How We Use Your Information</h2>
        <p className="text-stone-600 leading-relaxed mb-4">We use your information to process curtain orders, provide custom measurement and installation services, send order updates, and share exclusive curtain collection previews with your consent.</p>
        <h2 className="font-heading text-xl font-bold text-stone-900 mt-8 mb-4">3. Data Protection</h2>
        <p className="text-stone-600 leading-relaxed mb-4">We implement industry-standard security measures to protect your personal information. Your payment details are encrypted and processed through secure payment gateways.</p>
        <h2 className="font-heading text-xl font-bold text-stone-900 mt-8 mb-4">4. Cookies</h2>
        <p className="text-stone-600 leading-relaxed mb-4">Our website uses cookies to enhance your browsing experience, remember your wishlist, and show recently viewed curtain products.</p>
        <h2 className="font-heading text-xl font-bold text-stone-900 mt-8 mb-4">5. Contact Us</h2>
        <p className="text-stone-600 leading-relaxed">For any privacy-related questions, please contact us at info@luxdrape.com or via our contact page.</p>
      </div>
    </div>
  );
}
