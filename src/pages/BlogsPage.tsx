import { useEffect, useMemo, useState } from 'react';
import { fetchAllBlogs, sortBlogsNewestFirst, sortBlogsOldestFirst } from '../blogData';
import type { BlogMeta } from '../types/blog';

function BlogListItem({ blog }: { blog: BlogMeta }) {
  return (
  <div id={blog.slug} className="flex flex-col border-4 bg-white text-zinc-900 p-6 gap-3 border-black border-6">
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <h3 className="text-3xl font-bold">{blog.title}</h3>
          <p className="text-sm text-zinc-600">{new Date(blog.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>
  <p className="text-xl leading-relaxed">{blog.description}</p>
      <div className="flex gap-2 flex-wrap">
        {blog.tags.map(t => (
          <span key={t} className="text-sm bg-zinc-300 px-2 py-1">#{t}</span>
        ))}
      </div>
      <div>
  <a href={`/blog/${blog.slug}.html`} className="text-blue-700 underline text-xl font-semibold">Read Post</a>
  <span className="mx-2 opacity-60">·</span>
  <a href={blog.path} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">View Raw</a>
      </div>
    </div>
  );
}

export default function BlogsPage() {
  const [all, setAll] = useState<BlogMeta[] | null>(null);
  const [sort, setSort] = useState<'newest' | 'oldest'>('newest');
  const [animationSpeed, setAnimationSpeed] = useState('40s');

  useEffect(() => {
    let mounted = true;
    fetchAllBlogs().then(list => { if (mounted) setAll(list); });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const updateAnimationSpeed = () => {
      setAnimationSpeed(window.innerWidth / 50 + 's');
    };
    updateAnimationSpeed();
    window.addEventListener('resize', updateAnimationSpeed);
    return () => window.removeEventListener('resize', updateAnimationSpeed);
  }, []);

  const sorted = useMemo(() => {
    const list = all ?? [];
    return sort === 'newest' ? sortBlogsNewestFirst(list) : sortBlogsOldestFirst(list);
  }, [sort, all]);

  return (
    <div className="min-h-screen w-full text-zinc-100 p-0 m-0" style={{
      backgroundSize: '48px 48px',
      backgroundImage: 'linear-gradient(-45deg, rgb(var(--primary-stripe-rgb)) 25%, rgb(var(--secondary-stripe-rgb)) 25%, rgb(var(--secondary-stripe-rgb)) 50%, rgb(var(--primary-stripe-rgb)) 50%, rgb(var(--primary-stripe-rgb)) 75%, rgb(var(--secondary-stripe-rgb)) 75%, rgb(var(--secondary-stripe-rgb)) 100%)',
      boxShadow: 'inset 0rem 0.5rem 2rem 0.25rem rgb(0 0 0 / 40%)',
      animation: `pan ${animationSpeed} linear infinite`
    }}>
  <div className="max-w-5xl mx-auto p-4 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col">
              <h1 className="text-6xl">Blog</h1>
              <p className="text-xl">I occasionally write blogs/devlogs and stuff like that here, you can also subscribe to my RSS! </p>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xl">Sort:</label>
            <select
              aria-label="Sort order"
              value={sort}
              onChange={e => setSort(e.target.value as 'newest' | 'oldest')}
              className="px-3 py-2 border-2 border-zinc-500 bg-zinc-100 text-zinc-900"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </div>
        </div>
        <p className="text-xl mb-4">Subscribe via <a className="underline text-blue-300" href="/rss.xml">RSS</a>.</p>
        <div className="flex flex-col gap-4">
          {!all && (
            <p className="text-xl text-center opacity-70">Loading…</p>
          )}
          {all && sorted.map(b => (
            <BlogListItem key={b.slug} blog={b} />
          ))}
          {all && sorted.length === 0 && (
            <p className="text-xl text-center opacity-70">No blog posts yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
