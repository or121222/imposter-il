// Date Night - Hebrew question database organized by mood levels

export interface DateNightQuestion {
  id: string;
  text: string;
  category: 'light' | 'medium' | 'deep';
}

export interface DateNightCategory {
  id: 'light' | 'medium' | 'deep';
  name: string;
  description: string;
  emoji: string;
  gradient: string;
  glowColor: string;
}

export const DATE_NIGHT_CATEGORIES: DateNightCategory[] = [
  {
    id: 'light',
    name: 'קליל',
    description: 'לשבור את הקרח, לצחוק ולהנות',
    emoji: '😄',
    gradient: 'linear-gradient(135deg, hsl(340 80% 55%), hsl(320 90% 50%))',
    glowColor: 'hsl(330 90% 55%)',
  },
  {
    id: 'medium',
    name: 'בינוני',
    description: 'כמה אתם שמים לב לפרטים הקטנים?',
    emoji: '🤔',
    gradient: 'linear-gradient(135deg, hsl(280 80% 55%), hsl(300 90% 50%))',
    glowColor: 'hsl(290 90% 55%)',
  },
  {
    id: 'deep',
    name: 'עמוק',
    description: 'שיחות נפש לתוך הלילה',
    emoji: '💭',
    gradient: 'linear-gradient(135deg, hsl(260 80% 50%), hsl(280 90% 45%))',
    glowColor: 'hsl(270 90% 50%)',
  },
];

export const DEFAULT_QUESTIONS: DateNightQuestion[] = [
  // Light questions (40+)
  { id: 'l1', text: 'מי מבזבז יותר זמן בטיקטוק?', category: 'light' },
  { id: 'l2', text: 'מי נרדם ראשון?', category: 'light' },
  { id: 'l3', text: 'מי יותר מצחיק?', category: 'light' },
  { id: 'l4', text: 'מי יותר עקשן?', category: 'light' },
  { id: 'l5', text: 'מי יותר טוב בבישול?', category: 'light' },
  { id: 'l6', text: 'מי שולט בשלט הטלוויזיה?', category: 'light' },
  { id: 'l7', text: 'מי יותר מבולגן?', category: 'light' },
  { id: 'l8', text: 'מי קם ראשון בבוקר?', category: 'light' },
  { id: 'l9', text: 'מי יותר רומנטי?', category: 'light' },
  { id: 'l10', text: 'מי יותר חסכן?', category: 'light' },
  { id: 'l11', text: 'מי נוהג יותר טוב?', category: 'light' },
  { id: 'l12', text: 'מי יותר אוהב לישון?', category: 'light' },
  { id: 'l13', text: 'מי יותר ביישן?', category: 'light' },
  { id: 'l14', text: 'מי יותר חברותי?', category: 'light' },
  { id: 'l15', text: 'מי יותר טוב בריקודים?', category: 'light' },
  { id: 'l16', text: 'מי שר יותר טוב?', category: 'light' },
  { id: 'l17', text: 'מי יותר פדנט?', category: 'light' },
  { id: 'l18', text: 'מי יותר מפחד מחרקים?', category: 'light' },
  { id: 'l19', text: 'מי יותר אוהב מסיבות?', category: 'light' },
  { id: 'l20', text: 'מי יותר תחרותי?', category: 'light' },
  { id: 'l21', text: 'מי יותר טוב במשחקי קופסה?', category: 'light' },
  { id: 'l22', text: 'מי יותר אוהב לקנות?', category: 'light' },
  { id: 'l23', text: 'מי יותר דרמטי?', category: 'light' },
  { id: 'l24', text: 'מי יותר אופטימי?', category: 'light' },
  { id: 'l25', text: 'מי יותר מתלונן?', category: 'light' },
  { id: 'l26', text: 'מי יותר רעבתן?', category: 'light' },
  { id: 'l27', text: 'מי יותר אוהב חיות?', category: 'light' },
  { id: 'l28', text: 'מי יותר טוב בספורט?', category: 'light' },
  { id: 'l29', text: 'מי יותר צודק תמיד?', category: 'light' },
  { id: 'l30', text: 'מי יותר שוכח דברים?', category: 'light' },
  { id: 'l31', text: 'מי יותר אוהב לצפות בסדרות?', category: 'light' },
  { id: 'l32', text: 'מי יותר מאחר?', category: 'light' },
  { id: 'l33', text: 'מי יותר טוב בניווט?', category: 'light' },
  { id: 'l34', text: 'מי יותר אוהב פיצה?', category: 'light' },
  { id: 'l35', text: 'מי יותר פותח את הלב?', category: 'light' },
  { id: 'l36', text: 'מי יותר מדבר בטלפון?', category: 'light' },
  { id: 'l37', text: 'מי יותר אוהב להתלבש יפה?', category: 'light' },
  { id: 'l38', text: 'מי יותר טוב בצילום?', category: 'light' },
  { id: 'l39', text: 'מי יותר אוהב לטייל?', category: 'light' },
  { id: 'l40', text: 'מי יותר מזמין אוכל הביתה?', category: 'light' },
  { id: 'l41', text: 'מי יותר אוהב לקבל מתנות?', category: 'light' },
  { id: 'l42', text: 'מי יותר טוב בהפתעות?', category: 'light' },

  // Medium questions (40+)
  { id: 'm1', text: 'מה המאכל שבן הזוג הכי שונא?', category: 'medium' },
  { id: 'm2', text: 'מי יוזם יותר יציאות?', category: 'medium' },
  { id: 'm3', text: 'מה היה הדייט הראשון שלכם?', category: 'medium' },
  { id: 'm4', text: 'מה הצבע האהוב על בן הזוג?', category: 'medium' },
  { id: 'm5', text: 'מה השיר שמזכיר לכם אחד את השני?', category: 'medium' },
  { id: 'm6', text: 'מתי הייתה הפעם הראשונה שאמרתם "אני אוהב אותך"?', category: 'medium' },
  { id: 'm7', text: 'מה ההרגל הכי מעצבן של בן הזוג?', category: 'medium' },
  { id: 'm8', text: 'מה הסרט האהוב על בן הזוג?', category: 'medium' },
  { id: 'm9', text: 'איפה הייתם בדייט הכי יפה?', category: 'medium' },
  { id: 'm10', text: 'מה בן הזוג עושה כשהוא עצבני?', category: 'medium' },
  { id: 'm11', text: 'מה בן הזוג עושה כשהוא שמח?', category: 'medium' },
  { id: 'm12', text: 'מה החלום הגדול של בן הזוג?', category: 'medium' },
  { id: 'm13', text: 'מה הפחד הכי גדול של בן הזוג?', category: 'medium' },
  { id: 'm14', text: 'מה בן הזוג הכי אוהב לעשות בזמן הפנוי?', category: 'medium' },
  { id: 'm15', text: 'איזה מתנה בן הזוג הכי היה רוצה לקבל?', category: 'medium' },
  { id: 'm16', text: 'מה הזיכרון הכי יפה שלכם ביחד?', category: 'medium' },
  { id: 'm17', text: 'מה הדבר שבן הזוג הכי גאה בו?', category: 'medium' },
  { id: 'm18', text: 'מי החבר הכי טוב של בן הזוג?', category: 'medium' },
  { id: 'm19', text: 'מה בן הזוג אומר בשינה?', category: 'medium' },
  { id: 'm20', text: 'מה הקטע הכי מצחיק שקרה לכם?', category: 'medium' },
  { id: 'm21', text: 'מה הדבר שבן הזוג אף פעם לא יעשה?', category: 'medium' },
  { id: 'm22', text: 'מה המקום שבן הזוג הכי רוצה לבקר?', category: 'medium' },
  { id: 'm23', text: 'מה הדבר שבן הזוג אוהב לעשות ביחד?', category: 'medium' },
  { id: 'm24', text: 'מה הביטוי שבן הזוג הכי משתמש?', category: 'medium' },
  { id: 'm25', text: 'מה בן הזוג מזמין כל פעם במסעדה?', category: 'medium' },
  { id: 'm26', text: 'מה הספר האהוב על בן הזוג?', category: 'medium' },
  { id: 'm27', text: 'מי הזמר האהוב על בן הזוג?', category: 'medium' },
  { id: 'm28', text: 'מה בן הזוג עושה לפני השינה?', category: 'medium' },
  { id: 'm29', text: 'מה בן הזוג עושה מיד כשהוא קם?', category: 'medium' },
  { id: 'm30', text: 'מה הדבר שבן הזוג אף פעם לא מפספס?', category: 'medium' },
  { id: 'm31', text: 'מה המילה שבן הזוג משתמש הכי הרבה?', category: 'medium' },
  { id: 'm32', text: 'מה המאכל שבן הזוג מכין הכי טוב?', category: 'medium' },
  { id: 'm33', text: 'מה בן הזוג עושה כשמשעמם לו?', category: 'medium' },
  { id: 'm34', text: 'מה הדבר שבן הזוג הכי לא אוהב לעשות?', category: 'medium' },
  { id: 'm35', text: 'מי מהמשפחה בן הזוג הכי קרוב אליו?', category: 'medium' },
  { id: 'm36', text: 'מה עושה את בן הזוג הכי מאושר?', category: 'medium' },
  { id: 'm37', text: 'מה הדבר שבן הזוג אומר כל יום?', category: 'medium' },
  { id: 'm38', text: 'מה הסדרה שבן הזוג הכי אהב?', category: 'medium' },
  { id: 'm39', text: 'מה היה הרגע המביך ביותר שלכם?', category: 'medium' },
  { id: 'm40', text: 'מה הדבר שבן הזוג לא יכול בלעדיו?', category: 'medium' },
  { id: 'm41', text: 'מתי בן הזוג הכי רגוע?', category: 'medium' },
  { id: 'm42', text: 'מה בן הזוג עושה כשהוא לחוץ?', category: 'medium' },

  // Deep questions (40+)
  { id: 'd1', text: 'מה הפחד הכי גדול שלכם?', category: 'deep' },
  { id: 'd2', text: 'איפה אתם רואים את עצמכם בעוד 5 שנים?', category: 'deep' },
  { id: 'd3', text: 'מה הדבר שאתם הכי מעריכים בצד השני?', category: 'deep' },
  { id: 'd4', text: 'מה הדבר שהייתם רוצים לשנות בעצמכם?', category: 'deep' },
  { id: 'd5', text: 'מה הדבר הכי חשוב לכם בזוגיות?', category: 'deep' },
  { id: 'd6', text: 'מה הרגע הכי קשה שעברתם ביחד?', category: 'deep' },
  { id: 'd7', text: 'מה הדבר שאתם הכי גאים בו?', category: 'deep' },
  { id: 'd8', text: 'מה הדבר שאתם הכי מתחרטים עליו?', category: 'deep' },
  { id: 'd9', text: 'מה הייתם משנים אם יכולתם לחזור בזמן?', category: 'deep' },
  { id: 'd10', text: 'מה הדבר שאתם הכי מודים עליו?', category: 'deep' },
  { id: 'd11', text: 'מה הלקח הכי גדול שלמדתם מהזוגיות?', category: 'deep' },
  { id: 'd12', text: 'מה הדבר שאתם הכי מפחדים לאבד?', category: 'deep' },
  { id: 'd13', text: 'מה הייתם עושים עם מיליון שקל?', category: 'deep' },
  { id: 'd14', text: 'מה החלום הכי גדול שלכם ביחד?', category: 'deep' },
  { id: 'd15', text: 'מה הדבר שאתם רוצים ללמוד ביחד?', category: 'deep' },
  { id: 'd16', text: 'איפה הייתם רוצים לגור בעתיד?', category: 'deep' },
  { id: 'd17', text: 'מה הדבר שאתם רוצים להשיג השנה?', category: 'deep' },
  { id: 'd18', text: 'מה הייתם עושים אם נשאר לכם יום אחד לחיות?', category: 'deep' },
  { id: 'd19', text: 'מה הדבר שאתם רוצים לספר לצד השני?', category: 'deep' },
  { id: 'd20', text: 'מה הערך הכי חשוב לכם בחיים?', category: 'deep' },
  { id: 'd21', text: 'מה הדבר שאתם רוצים להוריש לילדים?', category: 'deep' },
  { id: 'd22', text: 'מה עושה אתכם באמת מאושרים?', category: 'deep' },
  { id: 'd23', text: 'מה הדבר שאתם הכי מפחדים לגלות?', category: 'deep' },
  { id: 'd24', text: 'מה הדבר שאתם רוצים לשפר בזוגיות?', category: 'deep' },
  { id: 'd25', text: 'מה הדבר שאתם אף פעם לא מדברים עליו?', category: 'deep' },
  { id: 'd26', text: 'מה הדבר שאתם הכי צריכים מהצד השני?', category: 'deep' },
  { id: 'd27', text: 'מה הדבר שאתם הכי אוהבים בזוגיות שלכם?', category: 'deep' },
  { id: 'd28', text: 'מה הייתם רוצים שהצד השני ידע?', category: 'deep' },
  { id: 'd29', text: 'מה הרגע שהבנתם שזה אהבה?', category: 'deep' },
  { id: 'd30', text: 'מה הדבר שאתם הכי מתגעגעים אליו?', category: 'deep' },
  { id: 'd31', text: 'מה הדבר שאתם לא מוכנים לוותר עליו?', category: 'deep' },
  { id: 'd32', text: 'מה הדבר שאתם רוצים לחוות ביחד?', category: 'deep' },
  { id: 'd33', text: 'מה הפרק הכי יפה בסיפור שלכם?', category: 'deep' },
  { id: 'd34', text: 'מה הדבר שאתם רוצים לשמוע מהצד השני?', category: 'deep' },
  { id: 'd35', text: 'מה הזיכרון שאתם רוצים לשמור לנצח?', category: 'deep' },
  { id: 'd36', text: 'מה הדבר שאתם לומדים מהצד השני?', category: 'deep' },
  { id: 'd37', text: 'מה הדבר שאתם רוצים להגיד ולא אומרים?', category: 'deep' },
  { id: 'd38', text: 'מה הדבר שעשה אתכם מי שאתם היום?', category: 'deep' },
  { id: 'd39', text: 'מה הדבר שאתם רוצים לעשות יחד לפני שתמותו?', category: 'deep' },
  { id: 'd40', text: 'מה המסר שאתם רוצים להעביר לעולם?', category: 'deep' },
  { id: 'd41', text: 'מה הסוד שאתם שומרים לעצמכם?', category: 'deep' },
  { id: 'd42', text: 'מה הדבר שמגדיר את הזוגיות שלכם?', category: 'deep' },
];

// Score messages based on sync percentage
export const getScoreMessage = (percentage: number): { emoji: string; title: string; subtitle: string } => {
  if (percentage >= 90) {
    return { emoji: '💕', title: 'נשמות תאומות!', subtitle: 'אתם ממש מכירים אחד את השני' };
  } else if (percentage >= 75) {
    return { emoji: '❤️', title: 'חיבור מושלם!', subtitle: 'הקשר ביניכם חזק' };
  } else if (percentage >= 60) {
    return { emoji: '💖', title: 'רומנטיקה באוויר!', subtitle: 'יש לכם עוד הרבה לגלות' };
  } else if (percentage >= 45) {
    return { emoji: '💘', title: 'בדרך הנכונה!', subtitle: 'המשיכו לדבר ולהכיר' };
  } else if (percentage >= 30) {
    return { emoji: '💜', title: 'ניגודים נמשכים!', subtitle: 'ההבדלים ביניכם מעשירים' };
  } else {
    return { emoji: '🔥', title: 'אש ומים!', subtitle: 'אתם מאתגרים אחד את השני' };
  }
};
