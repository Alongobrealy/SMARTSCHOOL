import React, { useState, useEffect, useCallback } from 'react';
import { 
  Quote, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Building2, 
  MapPin, 
  CheckCircle2, 
  Sparkles,
  Users
} from 'lucide-react';

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  school: string;
  city: string;
  department: string;
  avatarText: string;
  avatarColor: string;
  rating: number;
  quote: string;
  impactMetric: string;
  date: string;
  cycle: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'M. Jean-Claude Mavoungou',
    role: 'Fondateur & Directeur Général',
    school: 'Complexe Scolaire Les Élites de Brazzaville',
    city: 'Brazzaville',
    department: 'Brazzaville (Bacongo)',
    avatarText: 'JM',
    avatarColor: 'from-purple-600 to-indigo-600',
    rating: 5,
    quote: "EDU-CONGO a totalement transformé notre gestion scolaire. Auparavant, nous passions des nuits entières sur les reçus manuels et les cahiers de caisse. Maintenant, les parents paient par MTN MoMo et reçoivent instantanément un reçu officiel certifié avec QR Code. Le recouvrement des écolages est passé à 94% dès le premier trimestre !",
    impactMetric: '+94% de recouvrement des frais',
    date: 'Année 2025-2026',
    cycle: 'Maternelle • Primaire • Collège'
  },
  {
    id: 'test-2',
    name: 'Mme Sylvie Nkouka',
    role: 'Directrice des Études & Proviseur Adjoint',
    school: 'Lycée Privé Savorgnan de Pointe-Noire',
    city: 'Pointe-Noire',
    department: 'Pointe-Noire (Mpita)',
    avatarText: 'SN',
    avatarColor: 'from-blue-600 to-cyan-600',
    rating: 5,
    quote: "Le module de calcul automatique des moyennes selon le barème officiel congolais (MEPPSA) avec coefficients nous a fait économiser plus de deux semaines de travail intensif lors des délibérations trimestrielles. Les bulletins scolaires sont impeccables, clairs et sans la moindre contestation.",
    impactMetric: '15 jours économisés par trimestre',
    date: 'Promotion 2026',
    cycle: 'Collège & Lycée Général'
  },
  {
    id: 'test-3',
    name: 'M. Rodrigue Batantou',
    role: 'Économe & Chef Comptable',
    school: 'Institut Polyvalent & Technique du Niari',
    city: 'Dolisie',
    department: 'Niari',
    avatarText: 'RB',
    avatarColor: 'from-amber-600 to-orange-600',
    rating: 5,
    quote: "La clôture de caisse quotidienne et le suivi des dépenses en FCFA sont d'une rigueur absolue. Nous avons une traçabilité totale sur chaque franc encaissé. L'équipe d'EDU-CONGO est disponible sur WhatsApp 7j/7 et nous a formés sur place avec un professionnalisme exemplaire.",
    impactMetric: '0 écart de caisse constaté',
    date: 'Session 2026',
    cycle: 'Lycée Technique & Formation Pro'
  },
  {
    id: 'test-4',
    name: 'Dr. Michel Ombessa',
    role: 'Président de l’Association des Parents d’Élèves (APE)',
    school: 'Groupe Scolaire La Fraternité',
    city: 'Brazzaville',
    department: 'Brazzaville (Ouenzé)',
    avatarText: 'MO',
    avatarColor: 'from-emerald-600 to-teal-600',
    rating: 5,
    quote: "En tant que parent de 3 enfants, recevoir une alerte WhatsApp dès qu'un retard ou une absence est constaté et pouvoir consulter les notes de devoirs en direct sur mon téléphone est une révolution. Cela responsabilise les élèves et renforce le dialogue avec les enseignants.",
    impactMetric: 'Alerte instantanée sur smartphone',
    date: 'Année 2025-2026',
    cycle: 'Primaire & Secondaire'
  },
  {
    id: 'test-5',
    name: 'Mme Chantal Moukassa',
    role: 'Professeure Principale de Mathématiques',
    school: 'Collège d’Excellence de la Cuvette',
    city: 'Oyo',
    department: 'Cuvette',
    avatarText: 'CM',
    avatarColor: 'from-rose-600 to-pink-600',
    rating: 5,
    quote: "La saisie des notes et le cahier de texte numérique se font en 5 minutes depuis mon téléphone ou tablette. Le système calcule immédiatement les classements et appréciations. C'est fluide, intuitif et parfaitement adapté aux réalités du Congo.",
    impactMetric: 'Saisie ultra-rapide sur mobile',
    date: 'Année 2026',
    cycle: 'Collège'
  }
];

export const TestimonialsCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const current = TESTIMONIALS[currentIndex];

  return (
    <section className="w-full flex flex-col gap-6" aria-label="Témoignages clients">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          Preuve Sociale & Retours d'Expérience
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight text-balance">
          ILS FONT CONFIANCE À EDU-CONGO
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-balance">
          Découvrez les témoignages des directeurs d'établissements, proviseurs, comptables et parents d'élèves à Brazzaville, Pointe-Noire, Dolisie et Oyo.
        </p>
      </div>

      {/* Main Carousel Card */}
      <div 
        className="relative rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-10 shadow-lg overflow-hidden transition-all"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        {/* Background Decorative Pattern */}
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none text-slate-900 dark:text-white">
          <Quote className="w-48 h-48 -rotate-12" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start gap-8">
          
          {/* Avatar & School Profile Info */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left shrink-0 max-w-xs w-full gap-3 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800 pb-6 lg:pb-0 lg:pr-8">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${current.avatarColor} text-white flex items-center justify-center font-black text-xl sm:text-2xl shadow-lg shadow-indigo-600/20`}>
              {current.avatarText}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center lg:justify-start gap-1">
                {[...Array(current.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white leading-snug">
                {current.name}
              </h3>
              <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                {current.role}
              </p>
            </div>

            <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 w-full pt-1">
              <div className="flex items-center justify-center lg:justify-start gap-1.5 font-medium text-slate-800 dark:text-slate-200">
                <Building2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span className="truncate">{current.school}</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{current.department}</span>
              </div>
              <span className="inline-block bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2.5 py-0.5 rounded-full text-[10px] font-medium border border-slate-200 dark:border-slate-700">
                {current.cycle}
              </span>
            </div>

            <div className="mt-2 w-full p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-center font-bold text-xs flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{current.impactMetric}</span>
            </div>
          </div>

          {/* Testimonial Content */}
          <div className="flex-1 flex flex-col justify-between gap-6 w-full text-center lg:text-left">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Témoignage Vérifié • {current.date}
              </div>

              <p className="text-sm sm:text-base lg:text-lg text-slate-700 dark:text-slate-200 leading-relaxed italic text-justify sm:text-left">
                « {current.quote} »
              </p>
            </div>

            {/* Carousel Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              {/* Pagination Dots */}
              <div className="flex items-center gap-2">
                {TESTIMONIALS.map((t, idx) => (
                  <button
                    key={t.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      currentIndex === idx
                        ? 'w-8 bg-indigo-600 dark:bg-indigo-400'
                        : 'w-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'
                    }`}
                    aria-label={`Aller au témoignage ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Prev / Next Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={prevSlide}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
                  aria-label="Témoignage précédent"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-mono px-1">
                  {currentIndex + 1} / {TESTIMONIALS.length}
                </span>
                <button
                  onClick={nextSlide}
                  className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
                  aria-label="Témoignage suivant"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
