import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-secondary text-accent mt-auto border-t border-border">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-playfair text-xl text-primary mb-4">Prem Nishani Gift Shop</h3>
            <p className="text-sm opacity-90">Luxury gifts that tell your story.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products?category=Romantic Gifts" className="hover:text-primary transition">Romantic Gifts</Link></li>
              <li><Link href="/products?category=Anniversary Gifts" className="hover:text-primary transition">Anniversary</Link></li>
              <li><Link href="/products?category=Wedding Gifts" className="hover:text-primary transition">Wedding</Link></li>
              <li><Link href="/products?category=Birthday Gifts" className="hover:text-primary transition">Birthday</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="hover:text-primary transition">Contact</Link></li>
              <li><Link href="/faq" className="hover:text-primary transition">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Newsletter</h4>
            <p className="text-sm opacity-90 mb-2">Subscribe for exclusive offers.</p>
            <form className="flex gap-2">
              <input type="email" placeholder="Email" className="flex-1 bg-white/10 dark:bg-black/30 border border-primary/50 rounded px-3 py-2 text-sm text-foreground placeholder:text-muted" />
              <button type="submit" className="bg-primary text-white px-4 py-2 rounded text-sm font-medium hover:opacity-90 transition">Join</button>
            </form>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center text-sm opacity-75">
          © {new Date().getFullYear()} Prem Nishani Gift Shop. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
