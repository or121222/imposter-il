import { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Pencil, Eraser, Check, RotateCcw } from 'lucide-react';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { useHaptics } from '@/hooks/useHaptics';

interface Player {
  id: string;
  name: string;
  color: string;
}

interface DrawingCanvasProps {
  currentPlayer: Player;
  round: number;
  maxRounds: number;
  playerIndex: number;
  totalPlayers: number;
  canvasData: string | null;
  onComplete: (canvasData: string) => void;
}

type Tool = 'draw' | 'erase';

export const DrawingCanvas = ({
  currentPlayer,
  round,
  maxRounds,
  playerIndex,
  totalPlayers,
  canvasData,
  onComplete,
}: DrawingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<Tool>('draw');
  const [hasDrawn, setHasDrawn] = useState(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const sounds = useSoundEffects();
  const { vibrate } = useHaptics();

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const container = canvas.parentElement;
    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    }

    // Fill with black background
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Load previous canvas data if exists
    if (canvasData) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = canvasData;
    }
  }, [canvasData]);

  // Get position from event
  const getPosition = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }
  }, []);

  // Draw line with neon glow effect
  const drawLine = useCallback((from: { x: number; y: number }, to: { x: number; y: number }) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (tool === 'erase') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = 30;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      
      // Neon glow effect
      ctx.shadowColor = currentPlayer.color;
      ctx.shadowBlur = 15;
      ctx.strokeStyle = currentPlayer.color;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();

    // Reset shadow
    ctx.shadowBlur = 0;
  }, [tool, currentPlayer.color]);

  // Handle start drawing
  const handleStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    const pos = getPosition(e);
    if (!pos) return;

    setIsDrawing(true);
    setHasDrawn(true);
    lastPointRef.current = pos;
  }, [getPosition]);

  // Handle drawing move
  const handleMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    if (!isDrawing || !lastPointRef.current) return;

    const pos = getPosition(e);
    if (!pos) return;

    drawLine(lastPointRef.current, pos);
    lastPointRef.current = pos;
  }, [isDrawing, getPosition, drawLine]);

  // Handle end drawing
  const handleEnd = useCallback(() => {
    setIsDrawing(false);
    lastPointRef.current = null;
  }, []);

  // Clear canvas (undo)
  const handleClear = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill with black background
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Reload previous data if exists
    if (canvasData) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = canvasData;
    }

    setHasDrawn(false);
    sounds.playSound('click');
    vibrate('light');
  }, [canvasData, sounds, vibrate]);

  // Handle tool change
  const handleToolChange = useCallback((newTool: Tool) => {
    setTool(newTool);
    sounds.playSound('click');
    vibrate('light');
  }, [sounds, vibrate]);

  // Handle done
  const handleDone = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const newCanvasData = canvas.toDataURL('image/png');
    sounds.playSound('success');
    vibrate('success');
    onComplete(newCanvasData);
  }, [onComplete, sounds, vibrate]);

  return (
    <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="glass-card p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full"
              style={{
                backgroundColor: currentPlayer.color,
                boxShadow: `0 0 15px ${currentPlayer.color}`,
              }}
            />
            <div>
              <p className="font-bold">{currentPlayer.name}</p>
              <p className="text-xs text-muted-foreground">
                תור {playerIndex + 1} מתוך {totalPlayers}
              </p>
            </div>
          </div>
          <div className="text-left">
            <p className="text-xs text-muted-foreground">סבב</p>
            <p className="font-bold text-secondary">{round}/{maxRounds}</p>
          </div>
        </div>
      </div>

      {/* Canvas Container */}
      <div 
        className="flex-1 glass-card overflow-hidden relative"
        style={{ touchAction: 'none' }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair"
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />
      </div>

      {/* Toolbar */}
      <div className="glass-card p-4 mt-4">
        <div className="flex items-center justify-between">
          {/* Tools */}
          <div className="flex gap-2">
            <button
              onClick={() => handleToolChange('draw')}
              className={`p-3 rounded-xl transition-all ${
                tool === 'draw'
                  ? 'bg-secondary text-white shadow-lg'
                  : 'glass-card hover:bg-secondary/20'
              }`}
              style={{
                boxShadow: tool === 'draw' ? `0 0 20px ${currentPlayer.color}` : undefined,
              }}
            >
              <Pencil className="w-6 h-6" />
            </button>
            <button
              onClick={() => handleToolChange('erase')}
              className={`p-3 rounded-xl transition-all ${
                tool === 'erase'
                  ? 'bg-destructive text-white shadow-lg'
                  : 'glass-card hover:bg-destructive/20'
              }`}
            >
              <Eraser className="w-6 h-6" />
            </button>
            <button
              onClick={handleClear}
              className="p-3 rounded-xl glass-card hover:bg-muted/50 transition-all"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
          </div>

          {/* Done Button */}
          <motion.button
            onClick={handleDone}
            disabled={!hasDrawn}
            className={`btn-neon-magenta px-6 py-3 flex items-center gap-2 ${
              !hasDrawn ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            whileHover={hasDrawn ? { scale: 1.05 } : {}}
            whileTap={hasDrawn ? { scale: 0.95 } : {}}
          >
            <Check className="w-5 h-5" />
            <span>סיימתי!</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};