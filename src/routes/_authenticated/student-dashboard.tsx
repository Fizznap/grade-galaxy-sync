import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation, useQuery } from "@tanstack/react-query";
import { askInsights } from "@/lib/ai.functions";
import { supabase } from "@/integrations/supabase/client";
import { score, type StudentRow } from "@/lib/scoring";
import { Send, Loader2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/student-dashboard")({
  component: StudentDashboard,
});

type ChatMsg = { role: "user" | "assistant"; content: string };

function StudentDashboard() {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");

  const { data: student, isLoading } = useQuery({
    queryKey: ['student-profile'],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Not logged in");
      const { data, error } = await supabase.from('students').select('*').eq('user_id', userData.user.id).single();
      if (error) throw error;
      return score(data as unknown as StudentRow);
    }
  });

  const chatMutation = useMutation({
    mutationFn: async (msgs: ChatMsg[]) => {
      return askInsights({ data: { messages: msgs } });
    },
    onSuccess: (data) => {
      if (data.error) {
        setMessages(prev => [...prev, { role: "assistant", content: `Error: ${data.error}` }]);
      } else if (data.reply) {
        setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
      }
    }
  });

  const handleSend = () => {
    if (!input.trim() || chatMutation.isPending) return;
    const newMsgs: ChatMsg[] = [...messages, { role: "user", content: input }];
    setMessages(newMsgs);
    setInput("");
    chatMutation.mutate(newMsgs);
  };

  const renderMessageContent = (content: string) => {
    try {
      const json = JSON.parse(content);
      return (
        <div className="space-y-4">
          <div>
            <strong className="text-primary block">Summary</strong>
            <p className="text-sm">{json.summary}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <strong className="text-green-600 block">Strengths</strong>
                <ul className="list-disc pl-4 text-sm">
                   {json.strengths?.map((s: string, i: number) => <li key={i}>{s}</li>)}
                </ul>
             </div>
             <div>
                <strong className="text-orange-600 block">Areas for Improvement</strong>
                <ul className="list-disc pl-4 text-sm">
                   {json.improvement_areas?.map((s: string, i: number) => <li key={i}>{s}</li>)}
                </ul>
             </div>
          </div>
          <div>
            <strong className="text-blue-600 block">Recommended Actions</strong>
            <ul className="list-disc pl-4 text-sm">
               {json.recommended_actions?.map((s: string, i: number) => <li key={i}>{s}</li>)}
            </ul>
          </div>
          <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
             <p>Timeline: {json.suggested_timeline}</p>
             <p>Caveats: {json.caveats}</p>
          </div>
        </div>
      );
    } catch (e) {
      return <p className="text-sm whitespace-pre-wrap">{content}</p>;
    }
  };

  if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;
  if (!student) return <div className="p-8 text-center text-red-500">Failed to load student profile</div>;

  return (
    <div className="container mx-auto p-4 md:p-8 grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {student.name}</h1>
        
        <Card>
          <CardHeader>
             <CardTitle>Your Success Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div>
               <div className="flex justify-between mb-1">
                 <span className="text-sm font-medium">Success Score</span>
                 <span className="text-sm font-bold text-primary">{student.successScore}/100</span>
               </div>
               <div className="w-full bg-secondary rounded-full h-2">
                 <div className="bg-primary rounded-full h-2" style={{ width: `${student.successScore}%` }} />
               </div>
             </div>

             <div className="grid grid-cols-2 gap-4 pt-4 border-t">
               <div>
                 <p className="text-xs text-muted-foreground uppercase">Academic Risk</p>
                 <p className={`font-bold ${student.academicRisk === 'High' ? 'text-red-500' : student.academicRisk === 'Medium' ? 'text-orange-500' : 'text-green-500'}`}>
                   {student.academicRisk}
                 </p>
               </div>
               <div>
                 <p className="text-xs text-muted-foreground uppercase">Placement Risk</p>
                 <p className={`font-bold ${student.placementRisk === 'High' ? 'text-red-500' : student.placementRisk === 'Medium' ? 'text-orange-500' : 'text-green-500'}`}>
                   {student.placementRisk}
                 </p>
               </div>
             </div>
             
             {student.riskFactors.length > 0 && (
               <div className="pt-4 border-t">
                 <p className="text-xs text-muted-foreground uppercase mb-2">Risk Factors Identified</p>
                 <ul className="text-sm space-y-1">
                   {student.riskFactors.map((r, i) => <li key={i} className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-red-500" /> {r}</li>)}
                 </ul>
               </div>
             )}
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2 flex flex-col max-h-[80vh]">
        <Card className="flex flex-col flex-1 shadow-md border-border overflow-hidden">
           <CardHeader className="bg-muted/30 border-b">
              <CardTitle>AI Academic Advisor</CardTitle>
           </CardHeader>
           <CardContent className="flex-1 p-0 flex flex-col">
              <ScrollArea className="flex-1 p-4" style={{ height: "400px" }}>
                 {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
                       <p>Ask about your performance, next steps, or placement readiness.</p>
                    </div>
                 ) : (
                    <div className="space-y-4">
                       {messages.map((m, i) => (
                          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                             <div className={`max-w-[85%] rounded-lg p-4 ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted border'}`}>
                                {m.role === 'user' ? <p className="text-sm">{m.content}</p> : renderMessageContent(m.content)}
                             </div>
                          </div>
                       ))}
                       {chatMutation.isPending && (
                          <div className="flex justify-start">
                             <div className="max-w-[85%] rounded-lg p-4 bg-muted border flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" /> <span className="text-sm">Thinking...</span>
                             </div>
                          </div>
                       )}
                    </div>
                 )}
              </ScrollArea>
              <div className="p-4 border-t bg-background">
                 <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex gap-2">
                    <Input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask your advisor..." disabled={chatMutation.isPending} className="flex-1" />
                    <Button type="submit" disabled={!input.trim() || chatMutation.isPending}>
                       <Send className="w-4 h-4" />
                    </Button>
                 </form>
              </div>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}
