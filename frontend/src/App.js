import { useState, useEffect, useRef } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Terminal as TerminalIcon, Brain, Grid3x3, Plus, Trash2, Play, Square } from "lucide-react";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalOutput, setTerminalOutput] = useState([]);
  const [aiInput, setAiInput] = useState("");
  const [aiMessages, setAiMessages] = useState([]);
  const [modules, setModules] = useState([]);
  const [newModule, setNewModule] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(false);
  const terminalScrollRef = useRef(null);
  const aiScrollRef = useRef(null);

  useEffect(() => {
    loadModules();
    loadAIHistory();
    loadTerminalHistory();
  }, []);

  useEffect(() => {
    if (terminalScrollRef.current) {
      terminalScrollRef.current.scrollTop = terminalScrollRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  useEffect(() => {
    if (aiScrollRef.current) {
      aiScrollRef.current.scrollTop = aiScrollRef.current.scrollHeight;
    }
  }, [aiMessages]);

  const loadModules = async () => {
    try {
      const response = await axios.get(`${API}/modules`);
      setModules(response.data);
    } catch (e) {
      console.error("Error loading modules:", e);
    }
  };

  const loadAIHistory = async () => {
    try {
      const response = await axios.get(`${API}/ai/history?limit=20`);
      const formatted = response.data.flatMap(item => [
        { role: "user", content: item.user_message, timestamp: item.timestamp },
        { role: "assistant", content: item.ai_response, timestamp: item.timestamp }
      ]);
      setAiMessages(formatted);
    } catch (e) {
      console.error("Error loading AI history:", e);
    }
  };

  const loadTerminalHistory = async () => {
    try {
      const response = await axios.get(`${API}/terminal/history?limit=20`);
      const formatted = response.data.map(item => ({
        command: item.command,
        output: item.output,
        error: item.error,
        timestamp: item.timestamp
      }));
      setTerminalOutput(formatted);
    } catch (e) {
      console.error("Error loading terminal history:", e);
    }
  };

  const executeTerminalCommand = async (e) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API}/terminal/execute`, {
        command: terminalInput
      });
      setTerminalOutput([...terminalOutput, {
        command: terminalInput,
        output: response.data.output,
        error: response.data.error,
        timestamp: response.data.timestamp
      }]);
      setTerminalInput("");
    } catch (e) {
      toast.error("Error ejecutando comando");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const sendAIMessage = async (e) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const userMessage = { role: "user", content: aiInput, timestamp: new Date().toISOString() };
    setAiMessages([...aiMessages, userMessage]);
    setAiInput("");
    setLoading(true);

    try {
      const response = await axios.post(`${API}/ai/chat`, {
        message: aiInput,
        role: "user"
      });
      const aiMessage = { role: "assistant", content: response.data.response, timestamp: response.data.timestamp };
      setAiMessages(prev => [...prev, aiMessage]);
    } catch (e) {
      toast.error("Error comunicándose con IA");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const createModule = async () => {
    if (!newModule.name.trim() || !newModule.description.trim()) {
      toast.error("Completa todos los campos");
      return;
    }

    try {
      await axios.post(`${API}/modules`, newModule);
      toast.success("Módulo creado");
      setNewModule({ name: "", description: "" });
      loadModules();
    } catch (e) {
      toast.error("Error creando módulo");
      console.error(e);
    }
  };

  const toggleModule = async (moduleId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      await axios.patch(`${API}/modules/${moduleId}`, null, {
        params: { status: newStatus }
      });
      toast.success(`Módulo ${newStatus === "active" ? "activado" : "desactivado"}`);
      loadModules();
    } catch (e) {
      toast.error("Error actualizando módulo");
      console.error(e);
    }
  };

  const deleteModule = async (moduleId) => {
    try {
      await axios.delete(`${API}/modules/${moduleId}`);
      toast.success("Módulo eliminado");
      loadModules();
    } catch (e) {
      toast.error("Error eliminando módulo");
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Finanzas Brillantes
          </h1>
          <p className="text-lg text-slate-600">Sistema Soberano de Libertad Financiera</p>
        </div>

        {/* Main Dashboard */}
        <Tabs defaultValue="terminal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[600px] mx-auto">
            <TabsTrigger value="terminal" className="flex items-center gap-2" data-testid="terminal-tab">
              <TerminalIcon className="w-4 h-4" />
              Terminal
            </TabsTrigger>
            <TabsTrigger value="ai" className="flex items-center gap-2" data-testid="ai-tab">
              <Brain className="w-4 h-4" />
              IA Soberana
            </TabsTrigger>
            <TabsTrigger value="modules" className="flex items-center gap-2" data-testid="modules-tab">
              <Grid3x3 className="w-4 h-4" />
              Módulos
            </TabsTrigger>
          </TabsList>

          {/* Terminal Tab */}
          <TabsContent value="terminal">
            <Card className="shadow-lg border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TerminalIcon className="w-5 h-5" />
                  Terminal Linux Integrado
                </CardTitle>
                <CardDescription>Ejecuta comandos bash directamente en tu sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScrollArea className="h-[400px] w-full rounded-md border bg-slate-950 p-4" ref={terminalScrollRef}>
                  <div className="font-mono text-sm space-y-3">
                    {terminalOutput.map((item, idx) => (
                      <div key={idx} data-testid={`terminal-output-${idx}`}>
                        <div className="text-cyan-400">$ {item.command}</div>
                        {item.output && <div className="text-green-300 whitespace-pre-wrap">{item.output}</div>}
                        {item.error && <div className="text-red-400 whitespace-pre-wrap">{item.error}</div>}
                      </div>
                    ))}
                    {terminalOutput.length === 0 && (
                      <div className="text-slate-500">Historial de comandos vacío. Ejecuta tu primer comando.</div>
                    )}
                  </div>
                </ScrollArea>
                <form onSubmit={executeTerminalCommand} className="flex gap-2">
                  <Input
                    data-testid="terminal-input"
                    placeholder="Ingresa comando bash..."
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    className="font-mono"
                    disabled={loading}
                  />
                  <Button type="submit" disabled={loading} data-testid="terminal-execute-btn">
                    Ejecutar
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Tab */}
          <TabsContent value="ai">
            <Card className="shadow-lg border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  IA Soberana (Ollama)
                </CardTitle>
                <CardDescription>Conversación con tu IA local - Modelo: llama3.2:1b</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScrollArea className="h-[400px] w-full rounded-md border bg-white p-4" ref={aiScrollRef}>
                  <div className="space-y-4">
                    {aiMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        data-testid={`ai-message-${idx}`}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-3 ${
                            msg.role === "user"
                              ? "bg-blue-600 text-white"
                              : "bg-slate-100 text-slate-900"
                          }`}
                        >
                          <div className="text-xs opacity-70 mb-1">
                            {msg.role === "user" ? "Tú" : "IA"}
                          </div>
                          <div className="whitespace-pre-wrap">{msg.content}</div>
                        </div>
                      </div>
                    ))}
                    {aiMessages.length === 0 && (
                      <div className="text-center text-slate-500">Inicia una conversación con tu IA soberana</div>
                    )}
                  </div>
                </ScrollArea>
                <form onSubmit={sendAIMessage} className="flex gap-2">
                  <Textarea
                    data-testid="ai-input"
                    placeholder="Pregunta a tu IA..."
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    className="min-h-[60px]"
                    disabled={loading}
                  />
                  <Button type="submit" disabled={loading} data-testid="ai-send-btn">
                    Enviar
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Modules Tab */}
          <TabsContent value="modules">
            <div className="grid gap-6">
              {/* Create Module */}
              <Card className="shadow-lg border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Crear Nuevo Módulo
                  </CardTitle>
                  <CardDescription>Agrega módulos extensibles a tu sistema</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    data-testid="module-name-input"
                    placeholder="Nombre del módulo"
                    value={newModule.name}
                    onChange={(e) => setNewModule({ ...newModule, name: e.target.value })}
                  />
                  <Textarea
                    data-testid="module-description-input"
                    placeholder="Descripción del módulo"
                    value={newModule.description}
                    onChange={(e) => setNewModule({ ...newModule, description: e.target.value })}
                  />
                  <Button onClick={createModule} className="w-full" data-testid="create-module-btn">
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Módulo
                  </Button>
                </CardContent>
              </Card>

              {/* Module List */}
              <Card className="shadow-lg border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Grid3x3 className="w-5 h-5" />
                    Módulos del Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {modules.map((module) => (
                      <Card key={module.id} className="border-2" data-testid={`module-${module.id}`}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg mb-1">{module.name}</h3>
                              <p className="text-sm text-slate-600 mb-3">{module.description}</p>
                              <Badge
                                variant={module.status === "active" ? "default" : "secondary"}
                                data-testid={`module-status-${module.id}`}
                              >
                                {module.status}
                              </Badge>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant={module.status === "active" ? "destructive" : "default"}
                                onClick={() => toggleModule(module.id, module.status)}
                                data-testid={`toggle-module-${module.id}`}
                              >
                                {module.status === "active" ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deleteModule(module.id)}
                                data-testid={`delete-module-${module.id}`}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {modules.length === 0 && (
                      <div className="text-center text-slate-500 py-8">
                        No hay módulos. Crea tu primer módulo arriba.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;