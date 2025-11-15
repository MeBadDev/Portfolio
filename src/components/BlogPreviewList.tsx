import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchLatest } from '../blogData';
import type { BlogMeta } from '../types/blog';

function BlogPreview({ blog }: { blog: BlogMeta }) {
  return (
    <div className="flex flex-col border-4 bg-zinc-200 text-zinc-800 p-4 gap-2 w-full md:w-1/3">
      <h3 className="text-3xl font-bold">{blog.title}</h3>
      <p className="text-lg line-clamp-4">{blog.description}</p>
      <a href={`/blog/${blog.slug}.html`} className="text-blue-700 underline text-xl">Read More →</a>
    </div>
  );
}

export default function BlogPreviewList() {
  const [latest, setLatest] = useState<BlogMeta[] | null>(null);

  useEffect(() => {
    let mounted = true;
    fetchLatest(3).then(list => {
      if (mounted) setLatest(list);
    });
    return () => { mounted = false; };
  }, []);
  return (
    <div className="flex flex-col w-full items-center mt-8 gap-6">
      <h2 className="text-6xl text-shadow">LATEST BLOGS</h2>
      <div className="flex flex-col md:flex-row w-full justify-center gap-6 p-4">
        {!latest && (
          <div className="text-xl opacity-70">Loading…</div>
        )}
        {latest && latest.map(b => <BlogPreview key={b.slug} blog={b} />)}
      </div>
      <Link to="/blogs" className="border-4 px-6 py-3 bg-emerald-400 hover:bg-emerald-300 text-3xl">Show More</Link>
    </div>
  );
}