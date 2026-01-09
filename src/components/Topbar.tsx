import { Link } from 'react-router-dom';
// @ts-ignore
import React from 'react'; //without this line the dev server won't start

export default function Topbar() {
  return (
    <nav className="sticky top-0 left-0 right-0 z-50 bg-zinc-900 text-zinc-100 border-b border-zinc-700">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold">mebaddev.net</Link>
        <div className="flex gap-6 text-xl">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/blogs" className="hover:underline">Blog</Link>
          <Link to="/projects" className="hover:underline">Projects</Link>
        </div>
      </div>
    </nav>
  );
}
