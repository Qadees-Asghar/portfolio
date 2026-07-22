import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X, Minimize2, Maximize2, Play, Sparkles } from 'lucide-react';
import { terminalCommands } from '../data/portfolioData';
import confetti from 'canvas-confetti';

export default function TerminalDrawer({ isOpen, onClose }) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', text: 'Qadees Asghar Interactive CLI Terminal v1.0.0' },
    { type: 'system', text: 'Type "help" to list all available commands.' }
  ]);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  if (!isOpen) return null;

  const handleCommand = (e) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    const newHistory = [...history, { type: 'user', text: `$ ${input}` }];

    if (cmd === 'clear') {
      setHistory([
        { type: 'system', text: 'Terminal cleared. Type "help" for commands.' }
      ]);
      setInput('');
      return;
    }

    if (cmd === 'sudo hire') {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
      newHistory.push({
        type: 'output',
        text: '🎉 OFFER ACCEPTED! Thank you for considering Qadees Asghar. Let\'s build intelligent software together! Contact: theqadees@gmail.com'
      });
    } else if (terminalCommands[cmd]) {
      newHistory.push({ type: 'output', text: terminalCommands[cmd] });
    } else {
      newHistory.push({
        type: 'error',
        text: `Command not recognized: "${cmd}". Type "help" for a list of available commands.`
      });
    }

    setHistory(newHistory);
    setInput('');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-lg shadow-2xl animate-fadeIn">
      <div className="bg-[#0a0d14] border border-cyan-500/40 rounded-2xl overflow-hidden font-mono text-xs shadow-2xl">
        
        {/* Terminal Header */}
        <div className="bg-[#121723] px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-cyan-400 font-bold flex items-center gap-1.5 ml-2">
              <TerminalIcon className="w-3.5 h-3.5" />
              <span>qadees@uet-lahore:~</span>
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Terminal Body Output */}
        <div className="p-4 h-64 overflow-y-auto space-y-2 bg-[#0a0d14]/95">
          {history.map((item, index) => (
            <div key={index} className="leading-relaxed">
              {item.type === 'user' && (
                <span className="text-cyan-400 font-semibold">{item.text}</span>
              )}
              {item.type === 'system' && (
                <span className="text-purple-400 font-medium">{item.text}</span>
              )}
              {item.type === 'output' && (
                <pre className="text-slate-200 whitespace-pre-wrap font-mono mt-1 bg-slate-900/50 p-2 rounded border border-slate-800">
                  {item.text}
                </pre>
              )}
              {item.type === 'error' && (
                <span className="text-red-400">{item.text}</span>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Terminal Input Bar */}
        <form onSubmit={handleCommand} className="bg-[#121723] px-4 py-2 border-t border-slate-800 flex items-center gap-2">
          <span className="text-cyan-400 font-bold">$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type command (e.g. help, projects, sudo hire)..."
            className="w-full bg-transparent text-white placeholder-slate-600 focus:outline-none font-mono"
            autoFocus
          />
          <button type="submit" className="p-1 text-cyan-400 hover:text-white">
            <Play className="w-3.5 h-3.5" />
          </button>
        </form>

      </div>
    </div>
  );
}
