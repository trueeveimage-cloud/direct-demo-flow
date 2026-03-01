import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, MessageSquare, Send, Loader2, CheckCircle2, Clock, Wrench, Eye, RotateCcw, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

const STATUS_CONFIG: Record<string, { icon: any; label: { sv: string; en: string }; color: string }> = {
  received: { icon: Clock, label: { sv: 'Mottagen', en: 'Received' }, color: 'text-blue-400' },
  in_progress: { icon: Wrench, label: { sv: 'Pågår', en: 'In Progress' }, color: 'text-amber-400' },
  review: { icon: Eye, label: { sv: 'Granskning', en: 'Review' }, color: 'text-purple-400' },
  revisions: { icon: RotateCcw, label: { sv: 'Revisioner', en: 'Revisions' }, color: 'text-orange-400' },
  completed: { icon: CheckCircle2, label: { sv: 'Klar', en: 'Completed' }, color: 'text-green-400' },
};

export default function PortalDashboardPage() {
  const { t, lang } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const textLang = (lang === 'en' ? 'en' : 'sv') as 'sv' | 'en';

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/portal/login'); return; }
      setUser(user);

      const { data: profileData } = await supabase.from('profiles').select('*').eq('user_id', user.id).single();
      setProfile(profileData);

      const { data: projectsData } = await supabase.from('customer_projects').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      setProjects(projectsData || []);
      if (projectsData && projectsData.length > 0) setSelectedProject(projectsData[0].id);

      setIsLoading(false);
    };
    checkAuth();
  }, [navigate]);

  // Load messages for selected project
  useEffect(() => {
    if (!selectedProject) return;
    const loadMessages = async () => {
      const { data } = await supabase.from('customer_messages').select('*').eq('project_id', selectedProject).order('created_at', { ascending: true });
      setMessages(data || []);
    };
    loadMessages();

    // Realtime subscription
    const channel = supabase.channel(`messages-${selectedProject}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'customer_messages', filter: `project_id=eq.${selectedProject}` },
        (payload) => { setMessages(prev => [...prev, payload.new]); }
      ).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [selectedProject]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedProject || !user) return;
    setIsSending(true);
    try {
      const { error } = await supabase.from('customer_messages').insert({
        project_id: selectedProject,
        user_id: user.id,
        message: newMessage.trim(),
        is_from_admin: false,
      });
      if (error) throw error;
      setNewMessage('');
    } catch (err: any) {
      toast({ title: t('Fel', 'Error'), description: err.message, variant: 'destructive' });
    } finally {
      setIsSending(false);
    }
  };

  const handleLogout = async () => {
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
          <div>
            <h1 className="text-xl font-bold">NOMIA<span className="text-accent">.</span> <span className="text-muted-foreground font-normal text-sm ml-2">{t('Kundportal', 'Customer Portal')}</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}><LogOut className="h-4 w-4 mr-1" />{t('Logga ut', 'Log out')}</Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {projects.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <FolderOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">{t('Inga projekt ännu', 'No projects yet')}</h2>
            <p className="text-muted-foreground mb-6">{t('När du beställer en hemsida dyker den upp här.', 'When you order a website, it will appear here.')}</p>
            <Button onClick={() => navigate('/bestall')}>{t('Beställ hemsida', 'Order website')} →</Button>
          </motion.div>
        ) : (
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
                    onClick={() => setSelectedProject(project.id)}
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
            </div>

            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {activeProject && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={activeProject.id}>
                  {/* Project status card */}
                  <div className="bg-card border border-border rounded-2xl p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold">{activeProject.project_name}</h2>
                      <span className={`text-sm font-medium ${STATUS_CONFIG[activeProject.status]?.color}`}>
                        {STATUS_CONFIG[activeProject.status]?.label[textLang]}
                      </span>
                    </div>
                    <Progress value={activeProject.progress_percent} className="h-2 mb-3" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{t('Framsteg', 'Progress')}: {activeProject.progress_percent}%</span>
                      {activeProject.estimated_delivery && (
                        <span>{t('Beräknad leverans', 'Est. delivery')}: {new Date(activeProject.estimated_delivery).toLocaleDateString(textLang === 'sv' ? 'sv-SE' : 'en-US')}</span>
                      )}
                    </div>
                    {activeProject.notes && (
                      <p className="mt-4 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">{activeProject.notes}</p>
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
        )}
      </div>
    </div>
  );
}
