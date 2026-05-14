import React, { useState, useEffect } from 'react';
import { Terminal, Send, Loader2, Database, Moon, Sun, Code2, Sparkles, Copy, Check } from 'lucide-react';
import { askQuestion } from './api';
import DataTable from './components/DataTable';
import DataChart from './components/DataChart';

function App() {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [copiedInsight, setCopiedInsight] = useState(false);

  // Theme state: default to dark mode for that cool hacker vibe
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Apply theme class to HTML root
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await askQuestion(question);
      setResult(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (result?.generated_sql) {
      await navigator.clipboard.writeText(result.generated_sql);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyInsight = async () => {
    if (result?.insight) {
      await navigator.clipboard.writeText(result.insight);
      setCopiedInsight(true);
      setTimeout(() => setCopiedInsight(false), 2000);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-start w-full">

      {/* Navbar / Header */}
      <header className="w-full flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-everforest-light-green dark:bg-everforest-dark-green rounded-xl shadow-lg rotate-3">
            <Sparkles className="w-6 h-6 text-white dark:text-everforest-dark-bg" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            AI BI Analyst
          </h1>
        </div>
        <button
          onClick={toggleTheme}
          className="p-3 rounded-full bg-everforest-light-bg_dim dark:bg-everforest-dark-bg_dim hover:bg-everforest-light-bg_dim/70 dark:hover:bg-everforest-dark-bg_dim/70 transition-colors"
          aria-label="Toggle Theme"
        >
          {isDarkMode ? <Sun className="w-5 h-5 text-everforest-dark-yellow" /> : <Moon className="w-5 h-5 text-everforest-light-purple" />}
        </button>
      </header>

      {/* Main Content Area */}
      <main className="w-full flex flex-col gap-8">

        {/* Search / Input Section */}
        <section className="w-full max-w-3xl relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-everforest-light-blue to-everforest-light-purple dark:from-everforest-dark-blue dark:to-everforest-dark-purple rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="glass-panel relative w-full p-2 flex items-center">
            <div className="pl-4 pr-2 text-everforest-light-fg/50 dark:text-everforest-dark-fg/50">
              <Terminal className="w-6 h-6" />
            </div>
            <form onSubmit={handleSubmit} className="flex-1 flex items-center gap-2">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  // Allow submitting with Enter key, but Shift+Enter for new line
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Ask your data anything... e.g. 'What is the total revenue?'"
                rows={2}
                className="w-full bg-transparent border-none outline-none text-lg py-3 placeholder:text-everforest-light-fg/40 dark:placeholder:text-everforest-dark-fg/40 resize-none overflow-y-auto"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !question.trim()}
                className="btn-groovy mr-2 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Ask AI</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </section>

        {/* Error State */}
        {error && (
          <div className="p-4 bg-everforest-light-red/10 dark:bg-everforest-dark-red/10 border border-everforest-light-red/30 dark:border-everforest-dark-red/30 text-everforest-light-red dark:text-everforest-dark-red rounded-xl flex items-center gap-3">
            <Database className="w-5 h-5 shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Results Section */}
        {result && !error && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* SQL Query Display */}
            <div className="glass-panel p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-everforest-light-blue dark:text-everforest-dark-blue">
                  <Code2 className="w-5 h-5" />
                  <h3 className="font-bold uppercase tracking-wider text-sm">Generated SQL</h3>
                </div>
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-lg bg-everforest-light-bg_dim/50 dark:bg-everforest-dark-bg_dim/50 hover:bg-everforest-light-bg_dim dark:hover:bg-everforest-dark-bg_dim text-everforest-light-fg/70 dark:text-everforest-dark-fg/70 transition-colors"
                  aria-label="Copy SQL"
                  title="Copy SQL to clipboard"
                >
                  {copied ? <Check className="w-4 h-4 text-everforest-light-green dark:text-everforest-dark-green" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <div className="bg-black/5 dark:bg-black/20 p-4 rounded-xl overflow-x-auto">
                <code className="text-everforest-light-fg dark:text-everforest-dark-fg text-sm whitespace-pre-wrap">
                  {result.generated_sql}
                </code>
              </div>
            </div>

            {/* AI Insight Display */}
            {result.insight && (
              <div className="glass-panel p-6 bg-gradient-to-br from-everforest-light-blue/10 to-transparent dark:from-everforest-dark-blue/10 border-everforest-light-blue/30 dark:border-everforest-dark-blue/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-everforest-light-blue dark:text-everforest-dark-blue">
                    <Sparkles className="w-5 h-5" />
                    <h3 className="font-bold uppercase tracking-wider text-sm">AI Insight</h3>
                  </div>
                  <button
                    onClick={handleCopyInsight}
                    className="p-2 rounded-lg bg-everforest-light-blue/10 dark:bg-everforest-dark-blue/10 hover:bg-everforest-light-blue/20 dark:hover:bg-everforest-dark-blue/20 text-everforest-light-blue/80 dark:text-everforest-dark-blue/80 transition-colors"
                    aria-label="Copy Insight"
                    title="Copy AI Insight to clipboard"
                  >
                    {copiedInsight ? <Check className="w-4 h-4 text-everforest-light-green dark:text-everforest-dark-green" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-lg md:text-xl text-everforest-light-fg dark:text-everforest-dark-fg leading-relaxed font-medium">
                  {result.insight}
                </p>
              </div>
            )}

            {/* Data & Chart Display */}
            <div className="glass-panel p-6 flex flex-col gap-6">
              <div className="flex items-center gap-2 text-everforest-light-green dark:text-everforest-dark-green mb-2">
                <Database className="w-5 h-5" />
                <h3 className="font-bold uppercase tracking-wider text-sm">Data Insights</h3>
              </div>

              <DataTable data={result.data} />

              <DataChart data={result.data} isDarkMode={isDarkMode} />
            </div>

          </div>
        )}

        {/* Empty State (when nothing searched yet) */}
        {!result && !isLoading && !error && (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
            <Database className="w-16 h-16 mb-4 text-everforest-light-fg/30 dark:text-everforest-dark-fg/30" />
            <p className="text-lg">No data requested yet.</p>
            <p className="text-sm">Type a question above to generate SQL and view charts.</p>
          </div>
        )}
      </main>

    </div>
  );
}

export default App;
