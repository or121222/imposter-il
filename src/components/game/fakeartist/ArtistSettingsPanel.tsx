import { motion } from 'framer-motion';
import { Settings, Timer, Eye, ChevronDown, UserX } from 'lucide-react';
import { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { VxToggle } from '@/components/ui/vx-toggle';
import { NumberStepper } from '../NumberStepper';

export interface ArtistGameSettings {
  timerEnabled: boolean;
  timerDuration: number; // minutes
  fakeHint: boolean; // Fake sees category name
  fakeNeverStarts: boolean; // Fake never starts first
  drawingRounds: number; // Number of drawing rounds
}

interface ArtistSettingsPanelProps {
  settings: ArtistGameSettings;
  onUpdateSettings: (settings: Partial<ArtistGameSettings>) => void;
}

interface SettingRowProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  highlight?: boolean;
  children: React.ReactNode;
}

const SettingRow = ({ icon, label, description, highlight, children }: SettingRowProps) => (
  <div className={`flex w-full justify-between items-center p-4 rounded-xl ${highlight ? 'bg-secondary/10 border border-secondary/20' : ''}`}>
    <div className="flex items-center gap-3 flex-1 min-w-0">
      <div className={`p-2 rounded-lg flex-shrink-0 ${highlight ? 'bg-secondary/20' : 'bg-secondary/10'}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <span className={`font-medium block truncate ${highlight ? 'text-secondary' : ''}`}>{label}</span>
        {description && (
          <p className="text-xs text-muted-foreground truncate">{description}</p>
        )}
      </div>
    </div>
    <div className="flex-shrink-0">
      {children}
    </div>
  </div>
);

export const ArtistSettingsPanel = ({ settings, onUpdateSettings }: ArtistSettingsPanelProps) => {
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
            <h3 className="font-bold text-lg">הגדרות משחק</h3>
            <p className="text-sm text-muted-foreground">
              {settings.drawingRounds} סבבי ציור • {settings.timerEnabled ? `${settings.timerDuration} דקות` : 'ללא טיימר'}
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
        <div className="p-4 pt-0 space-y-3">
          {/* Drawing Rounds */}
          <div className="p-4 rounded-xl bg-muted/10">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🎨</span>
              <span className="font-medium">מספר סבבי ציור</span>
            </div>
            <div className="flex justify-center">
              <NumberStepper
                value={settings.drawingRounds}
                onChange={(value) => onUpdateSettings({ drawingRounds: value })}
                min={1}
                max={5}
              />
            </div>
          </div>

          {/* Timer Toggle */}
          <SettingRow
            icon={<Timer className="w-4 h-4 text-secondary" />}
            label="טיימר"
            description={settings.timerEnabled ? `${settings.timerDuration} דקות` : 'כבוי'}
          >
            <VxToggle
              aria-label="טיימר"
              value={settings.timerEnabled}
              onValueChange={(value) => onUpdateSettings({ timerEnabled: value })}
            />
          </SettingRow>
          
          {settings.timerEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 pb-2"
            >
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">משך הציור</span>
                <span className="text-secondary font-bold">{settings.timerDuration} דקות</span>
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

          {/* Fake Hint */}
          <SettingRow
            icon={<Eye className="w-4 h-4 text-secondary" />}
            label="רמז למזויף"
            description="הצייר המזויף יראה את שם הקטגוריה"
          >
            <VxToggle
              aria-label="רמז למזויף"
              value={settings.fakeHint}
              onValueChange={(value) => onUpdateSettings({ fakeHint: value })}
            />
          </SettingRow>

          {/* Fake Never Starts */}
          <SettingRow
            icon={<UserX className="w-4 h-4 text-secondary" />}
            label="המזויף בחיים לא מתחיל"
            description="הצייר המזויף לא יתחיל ראשון"
          >
            <VxToggle
              aria-label="המזויף בחיים לא מתחיל"
              value={settings.fakeNeverStarts}
              onValueChange={(value) => onUpdateSettings({ fakeNeverStarts: value })}
            />
          </SettingRow>
        </div>
      </motion.div>
    </motion.div>
  );
};
