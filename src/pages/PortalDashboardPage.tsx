import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, MessageSquare, Send, Loader2, CheckCircle2, Clock, Wrench, Eye, RotateCcw, FolderOpen, Plus, Minus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

const STATUS_CONFIG: Record<string, { icon: any; label: { sv: string; en: string }; color: string; progressRange: [number, number] }> = {
  received: { icon: Clock, label: { sv: 'Mottagen', en: 'Received' }, color: 'text-blue-400', progressRange: [0, 15] },
  in_progress: { icon: Wrench, label: { sv: 'Pågår', en: 'In Progress' }, color: 'text-amber-400', progressRange: [16, 50] },
  review: { icon: Eye, label: { sv: 'Granskning', en: 'Review' }, color: 'text-purple-400', progressRange: [51, 75] },
  revisions: { icon: RotateCcw, label: { sv: 'Revisioner', en: 'Revisions' }, color: 'text-orange-400', progressRange: [76, 90] },
  completed: { icon: CheckCircle2, label: { sv: 'Klar', en: 'Completed' }, color: 'text-green-400', progressRange: [91, 100] },
};

const STATUS_ORDER = ['received', 'in_progress', 'review', 'revisions', 'completed'];

const DEMO_PROJECTS = [
  {
    id: 'demo-1',
    project_name: 'Min Hemsida',
    status: 'in_progress',
    progress_percent: 35,
    estimated_delivery: new Date(Date.now() + 14 * 86400000).toISOString(),
    notes: 'Designfasen är klar. Vi jobbar nu med att bygga sidorna.',
    created_at: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    id: 'demo-2',
    project_name: 'Webshop Projekt',
    status: 'received',
    progress_percent: 5,
    estimated_delivery: new Date(Date.now() + 28 * 86400000).toISOString(),
    notes: 'Vi har mottagit din beställning och planerar projektet.',
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

const DEMO_MESSAGES = [
  { id: 'm1', is_from_admin: true, message: 'Hej! Välkommen till Nomia. Vi har börjat jobba på ditt projekt.', created_at: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: 'm2', is_from_admin: false, message: 'Tack! Ser fram emot att se resultatet.', created_at: new Date(Date.now() - 5 * 86400000 + 3600000).toISOString() },
  { id: 'm3', is_from_admin: true, message: 'Designen är klar, vi skickar en preview snart!', created_at: new Date(Date.now() - 2 * 86400000).toISOString() },
];

function getStatusFromProgress(percent: number): string {
  for (const [status, config] of Object.entries(STATUS_CONFIG)) {
    if (percent >= config.progressRange[0] && percent <= config.progressRange[1]) return status;
  }
  return 'completed';
}

export default function PortalDashboardPage() {
  const { t, lang } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const textLang = (lang === 'en' ? 'en' : 'sv') as 'sv' | 'en';

  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // No user — show demo mode
        setIsDemo(true);
        setProjects(DEMO_PROJECTS);
        setSelectedProject(DEMO_PROJECTS[0].id);
        setMessages(DEMO_MESSAGES);
        setIsLoading(false);
        return;
      }
      setUser(user);

      const { data: projectsData } = await supabase.from('customer_projects').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      
      if (!projectsData || projectsData.length === 0) {
        // Logged in but no projects — show demo
        setIsDemo(true);
        setProjects(DEMO_PROJECTS);
        setSelectedProject(DEMO_PROJECTS[0].id);
        setMessages(DEMO_MESSAGES);
      } else {
        setProjects(projectsData);
        setSelectedProject(projectsData[0].id);
      }
      setIsLoading(false);
    };
    checkAuth();
  }, [navigate]);

  // Load messages for selected project (real mode only)
  useEffect(() => {
    if (!selectedProject || isDemo) return;
    const loadMessages = async () => {
      const { data } = await supabase.from('customer_messages').select('*').eq('project_id', selectedProject).order('created_at', { ascending: true });
      setMessages(data || []);
    };
    loadMessages();

    const channel = supabase.channel(`messages-${selectedProject}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'customer_messages', filter: `project_id=eq.${selectedProject}` },
        (payload) => { setMessages(prev => [...prev, payload.new]); }
      ).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [selectedProject, isDemo]);

  const handleUpdateProgress = useCallback((delta: number) => {
    if (!selectedProject) return;
    setProjects(prev => prev.map(p => {
      if (p.id !== selectedProject) return p;
      const newPercent = Math.max(0, Math.min(100, p.progress_percent + delta));
      const newStatus = getStatusFromProgress(newPercent);
      return { ...p, progress_percent: newPercent, status: newStatus };
    }));
  }, [selectedProject]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedProject) return;
    if (isDemo) {
      setMessages(prev => [...prev, { id: `demo-${Date.now()}`, is_from_admin: false, message: newMessage.trim(), created_at: new Date().toISOString() }]);
      setNewMessage('');
      // Simulate admin reply
      setTimeout(() => {
        setMessages(prev => [...prev, { id: `demo-reply-${Date.now()}`, is_from_admin: true, message: t('Tack för ditt meddelande! Vi återkommer snart.', 'Thanks for your message! We\'ll get back to you soon.'), created_at: new Date().toISOString() }]);
      }, 1500);
      return;
    }
    setIsSending(true);
    try {
      const { error } = await supabase.from('customer_messages').insert({ project_id: selectedProject, user_id: user.id, message: newMessage.trim(), is_from_admin: false });
      if (error) throw error;
      setNewMessage('');
    } catch (err: any) {
      toast({ title: t('Fel', 'Error'), description: err.message, variant: 'destructive' });
    } finally {
      setIsSending(false);
    }
  };

  const handleLogout = async () => {
    if (isDemo) { navigate('/'); return; }
    await supabase.auth.signOut();
    navigate('/portal/login');
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>;
  }

  const activeProject = projects.find(p => p.id === selectedProject);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold tracking-tight">NOMIA<span className="text-accent">.</span></h1>
            <span className="text-muted-foreground text-sm hidden sm:inline">{t('Kundportal', 'Customer Portal')}</span>
          </div>
          <div className="flex items-center gap-3">
            {isDemo && (
              <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded-full font-medium flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Demo
              </span>
            )}
            <span className="text-sm text-muted-foreground hidden sm:inline">{user?.email || 'demo@nomia.se'}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" />
              {isDemo ? t('Tillbaka', 'Back') : t('Logga ut', 'Log out')}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Projects sidebar */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">{t('Dina projekt', 'Your projects')}</h2>
            {projects.map(project => {
              const statusConf = STATUS_CONFIG[project.status] || STATUS_CONFIG.received;
              const StatusIcon = statusConf.icon;
              return (
                <button
                  key={project.id}
                  onClick={() => {
                    setSelectedProject(project.id);
                    if (isDemo) {
                      setMessages(project.id === 'demo-1' ? DEMO_MESSAGES : [
                        { id: 'dm1', is_from_admin: true, message: 'Hej! Vi har mottagit din beställning.', created_at: new Date(Date.now() - 86400000).toISOString() },
                      ]);
                    }
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedProject === project.id ? 'border-accent bg-accent/5 shadow-md' : 'border-border bg-card hover:border-accent/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-sm">{project.project_name}</h3>
                    <StatusIcon className={`h-4 w-4 ${statusConf.color}`} />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className={statusConf.color}>{statusConf.label[textLang]}</span>
                    <span>·</span>
                    <span>{project.progress_percent}%</span>
                  </div>
                  <Progress value={project.progress_percent} className="mt-2 h-1" />
                </button>
              );
            })}
            
            {isDemo && (
              <div className="mt-4 p-3 rounded-lg border border-dashed border-accent/30 bg-accent/5">
                <p className="text-xs text-muted-foreground text-center">
                  {t('Detta är en demo. Logga in för att se dina riktiga projekt.', 'This is a demo. Log in to see your real projects.')}
                </p>
                <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => navigate('/portal/login')}>
                  {t('Logga in', 'Log in')} →
                </Button>
              </div>
            )}
          </div>

          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {activeProject && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} key={activeProject.id}>
                {/* Project status card */}
                <div className="bg-card border border-border rounded-2xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">{activeProject.project_name}</h2>
                    <span className={`text-sm font-medium ${STATUS_CONFIG[activeProject.status]?.color}`}>
                      {STATUS_CONFIG[activeProject.status]?.label[textLang]}
                    </span>
                  </div>
                  
                  {/* Progress bar with status milestones */}
                  <div className="mb-4">
                    <Progress value={activeProject.progress_percent} className="h-2 mb-3" />
                    <div className="flex justify-between">
                      {STATUS_ORDER.map((status) => {
                        const conf = STATUS_CONFIG[status];
                        const Icon = conf.icon;
                        const isActive = activeProject.status === status;
                        const isPast = STATUS_ORDER.indexOf(activeProject.status) > STATUS_ORDER.indexOf(status);
                        return (
                          <div key={status} className="flex flex-col items-center gap-1">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center border transition-all ${
                              isActive ? 'border-accent bg-accent/20 scale-110' : isPast ? 'border-accent/50 bg-accent/10' : 'border-border bg-card'
                            }`}>
                              <Icon className={`h-3.5 w-3.5 ${isActive ? conf.color : isPast ? 'text-accent/60' : 'text-muted-foreground/40'}`} />
                            </div>
                            <span className={`text-[10px] hidden sm:block ${isActive ? conf.color + ' font-semibold' : 'text-muted-foreground/60'}`}>
                              {conf.label[textLang]}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{t('Framsteg', 'Progress')}: {activeProject.progress_percent}%</span>
                    {activeProject.estimated_delivery && (
                      <span>{t('Beräknad leverans', 'Est. delivery')}: {new Date(activeProject.estimated_delivery).toLocaleDateString(textLang === 'sv' ? 'sv-SE' : 'en-US')}</span>
                    )}
                  </div>
                  
                  {activeProject.notes && (
                    <p className="mt-4 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">{activeProject.notes}</p>
                  )}

                  {/* Demo progress controls */}
                  {isDemo && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-accent" />
                        {t('Demo: Justera framsteg', 'Demo: Adjust progress')}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleUpdateProgress(-10)} className="h-8 w-8 p-0">
                          <Minus className="h-3 w-3" />
                        </Button>
                        <div className="flex-1">
                          <input
                            type="range"
                            min={0}
                            max={100}
                            value={activeProject.progress_percent}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setProjects(prev => prev.map(p => p.id !== selectedProject ? p : { ...p, progress_percent: val, status: getStatusFromProgress(val) }));
                            }}
                            className="w-full accent-[hsl(var(--accent))] h-1.5 cursor-pointer"
                          />
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleUpdateProgress(10)} className="h-8 w-8 p-0">
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Messages */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                  <div className="p-4 border-b border-border flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-accent" />
                    <h3 className="font-semibold text-sm">{t('Meddelanden', 'Messages')}</h3>
                  </div>
                  <div className="h-80 overflow-y-auto p-4 space-y-3">
                    {messages.length === 0 ? (
                      <p className="text-center text-sm text-muted-foreground py-8">{t('Inga meddelanden ännu. Skriv till oss!', 'No messages yet. Write to us!')}</p>
                    ) : (
                      messages.map((msg: any) => (
                        <div key={msg.id} className={`flex ${msg.is_from_admin ? 'justify-start' : 'justify-end'}`}>
                          <div className={`max-w-[80%] p-3 rounded-xl text-sm ${
                            msg.is_from_admin ? 'bg-muted text-foreground' : 'bg-accent text-accent-foreground'
                          }`}>
                            {msg.is_from_admin && <span className="text-xs font-semibold block mb-1">Nomia</span>}
                            <p>{msg.message}</p>
                            <span className="text-[10px] opacity-60 mt-1 block">
                              {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-3 border-t border-border flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      placeholder={t('Skriv ett meddelande...', 'Write a message...')}
                      onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button size="icon" onClick={handleSendMessage} disabled={isSending || !newMessage.trim()}>
                      {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
