import { motion } from 'framer-motion';
import { Settings, Users, Timer, Eye, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import type { GameSettings } from '@/hooks/useGameState';

interface SettingsPanelProps {
  settings: GameSettings;
  onUpdateSettings: (settings: Partial<GameSettings>) => void;
  maxImposters: number;
}

export const SettingsPanel = ({ settings, onUpdateSettings, maxImposters }: SettingsPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      className="glass-card overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      {/* Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/20 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-secondary/10">
            <Settings className="w-5 h-5 text-secondary" />
          </div>
          <div className="text-right">
            <h3 className="font-bold text-lg">הגדרות</h3>
            <p className="text-sm text-muted-foreground">
              {settings.imposterCount} מתחזים • {settings.timerEnabled ? `${settings.timerDuration} דקות` : 'ללא טיימר'}
            </p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </button>

      {/* Expandable content */}
      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <div className="p-4 pt-0 space-y-6">
          {/* Imposter Count */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <span className="font-medium">מספר מתחזים</span>
              <span className="mr-auto text-primary font-bold">{settings.imposterCount}</span>
            </div>
            <Slider
              value={[settings.imposterCount]}
              onValueChange={([value]) => onUpdateSettings({ imposterCount: value })}
              min={1}
              max={Math.max(1, maxImposters)}
              step={1}
              className="w-full"
            />
          </div>

          {/* Timer */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-primary" />
                <span className="font-medium">טיימר</span>
              </div>
              <Switch
                checked={settings.timerEnabled}
                onCheckedChange={(checked) => onUpdateSettings({ timerEnabled: checked })}
              />
            </div>
            
            {settings.timerEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">משך הסיבוב</span>
                  <span className="text-primary font-bold">{settings.timerDuration} דקות</span>
                </div>
                <Slider
                  value={[settings.timerDuration]}
                  onValueChange={([value]) => onUpdateSettings({ timerDuration: value })}
                  min={1}
                  max={15}
                  step={1}
                />
              </motion.div>
            )}
          </div>

          {/* Imposter Hint */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-primary" />
              <div>
                <span className="font-medium">רמז למתחזה</span>
                <p className="text-xs text-muted-foreground">המתחזה יראה את שם הקטגוריה</p>
              </div>
            </div>
            <Switch
              checked={settings.imposterHint}
              onCheckedChange={(checked) => onUpdateSettings({ imposterHint: checked })}
            />
          </div>

          {/* Troll Mode */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/10 border border-secondary/20">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-secondary" />
              <div>
                <span className="font-medium text-secondary">מצב טרול 🤪</span>
                <p className="text-xs text-muted-foreground">10% סיכוי שכולם יהיו מתחזים!</p>
              </div>
            </div>
            <Switch
              checked={settings.trollMode}
              onCheckedChange={(checked) => onUpdateSettings({ trollMode: checked })}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
