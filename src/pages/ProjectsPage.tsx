import { useEffect, useState } from 'react';
import { fetchAllProjects } from '../projectData';
import { Project } from '../types/project';
import Topbar from '../components/Topbar';
import Footer from '../components/Footer';

function ProjectCard({ project }: { project: Project }) {
  const [imageError, setImageError] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-800';
      case 'in progress': return 'bg-blue-100 text-blue-800 border-blue-800';
      case 'on hold': return 'bg-yellow-100 text-yellow-800 border-yellow-800';
      default: return 'bg-zinc-100 text-zinc-800 border-black';
    }
  };

  return (
    <div className="flex flex-col border-4 bg-white text-zinc-900 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] h-full">
      {!imageError && (
        <div className="h-48 overflow-hidden border-b-4 border-black bg-zinc-200 relative group">
          <img 
              src={project.thumbnail} 
              alt={project.title} 
              className="w-full h-full object-cover" 
              onError={() => setImageError(true)} 
          />
        </div>
      )}
      <div className="p-6 flex flex-col flex-grow gap-3">
         <div className="flex justify-between items-start gap-4">
             <h3 className="text-2xl font-bold leading-tight">{project.title}</h3>
             <span className={`px-2 py-1 text-xs font-bold border-2 ${getStatusColor(project.status)} uppercase whitespace-nowrap`}>
                 {project.status || 'Unknown'}
             </span>
         </div>
         
         <p className="flex-grow text-lg text-zinc-700">{project.summary || project.description}</p>
         
         {project.totalTimeSpent !== undefined && project.totalTimeSpent > 0 && (
             <p className="text-sm font-bold text-zinc-600">Total Hours: {Number(project.totalTimeSpent).toFixed(1).replace(/\.0$/, '')}h</p>
         )}

         <div className="flex gap-2 flex-wrap mt-2">
            {project.tags.map(t => (
              <span key={t} className="text-xs bg-zinc-200 px-2 py-1 border border-zinc-300 text-zinc-600 font-bold">#{t}</span>
            ))}
         </div>

         <div className="mt-4 flex flex-wrap gap-3 pt-4 border-t-2 border-zinc-200">
            <a href={project.path} className={`px-4 py-2 bg-black text-white font-bold hover:bg-zinc-800 border-2 border-transparent transition-colors ${project.devlogCount === 0 ? "hidden" : ""}`}>
               Devlogs ({project.devlogCount})
            </a>
            {project.repoLink && (
                 <a href={project.repoLink} target="_blank" rel="noopener noreferrer" className="px-4 py-2 border-2 border-black font-bold hover:bg-zinc-100 transition-colors">
                     GitHub
                 </a>
            )}
            {project.demoLink && (
                 <a href={project.demoLink} target="_blank" rel="noopener noreferrer" className="px-4 py-2 border-2 border-black font-bold hover:bg-zinc-100 transition-colors">
                     Demo
                 </a>
            )}
         </div>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState('40s');

  useEffect(() => {
    const updateAnimationSpeed = () => {
      setAnimationSpeed(window.innerWidth / 50 + 's');
    };
    updateAnimationSpeed();
    window.addEventListener('resize', updateAnimationSpeed);
    return () => window.removeEventListener('resize', updateAnimationSpeed);
  }, []);

  useEffect(() => {
    fetchAllProjects().then(data => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen text-white relative flex flex-col" style={{
      backgroundSize: '48px 48px',
      backgroundImage: 'linear-gradient(-45deg, rgb(var(--primary-stripe-rgb)) 25%, rgb(var(--secondary-stripe-rgb)) 25%, rgb(var(--secondary-stripe-rgb)) 50%, rgb(var(--primary-stripe-rgb)) 50%, rgb(var(--primary-stripe-rgb)) 75%, rgb(var(--secondary-stripe-rgb)) 75%, rgb(var(--secondary-stripe-rgb)) 100%)',
      boxShadow: 'inset 0rem 0.5rem 2rem 0.25rem rgb(0 0 0 / 40%)',
      animation: `pan ${animationSpeed} linear infinite`
    }}>
        <Topbar />
        
        <main className="flex-grow pt-8 px-4 pb-12">
           <div className="max-w-6xl mx-auto">
               <div className="mb-12 text-center bg-white  p-8 border-8 border-black">
                  <h1 className="text-5xl text-black  font-black uppercase mb-4 tracking-tighter">My Projects</h1>
                  <p className="text-xl text-black max-w-2xl mx-auto">
                      Here's some of the projects I've worked on over the years. 
                  </p>
               </div>

               {loading ? (
                   <div className="text-center text-2xl bg-black inline-block p-4 border-2 border-white">Loading projects...</div>
               ) : (
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                       {projects.map(p => (
                           <ProjectCard key={p.slug} project={p} />
                       ))}
                   </div>
               )}
               
               {!loading && projects.length === 0 && (
                 <div className="text-center text-xl bg-black p-8 border-2 border-white">
                   No projects found. Check back later!
                 </div>
               )}
           </div>
        </main>

        <Footer />
    </div>
  );
}
