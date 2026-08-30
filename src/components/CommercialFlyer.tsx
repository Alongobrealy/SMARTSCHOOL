import React from 'react';
import { 
  Building2, 
  UserCheck, 
  Briefcase, 
  Calculator, 
  CreditCard, 
  Calendar, 
  FileText, 
  PieChart, 
  Globe, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Phone, 
  MessageCircle, 
  Mail, 
  CheckCircle2, 
  Key,
  Lock
} from 'lucide-react';
import { UserRole } from '../types';
import { ThemeToggle } from './ThemeToggle';
import { TestimonialsCarousel } from './TestimonialsCarousel';
import { NetworkStatusBanner } from './pwa/NetworkStatusBanner';
import { PwaInstallPrompt } from './pwa/PwaInstallPrompt';

interface CommercialFlyerProps {
  onLaunchDemo: (role: UserRole, targetTab?: string) => void;
  onOpenQuote: () => void;
  onOpenActivationModal?: () => void;
  onOpenLogin?: () => void;
}

export const CommercialFlyer: React.FC<CommercialFlyerProps> = ({ 
  onLaunchDemo, 
  onOpenQuote,
  onOpenActivationModal,
  onOpenLogin
}) => {
  const features = [
    {
      id: 'frais',
      title: '1. Frais Scolaires & Caisse FCFA',
      desc: 'Encaissement en FCFA avec reçus instantanés certifiés, paiements Mobile Money (MTN MoMo & Airtel Money Congo), relevés d’impayés et alertes SMS / WhatsApp directes.',
      icon: CreditCard,
      highlight: 'Conforme République du Congo (FCFA)',
      actionTab: 'frais'
    },
    {
      id: 'notes',
      title: '2. Notes & Bulletins Automatisés',
      desc: 'Calcul automatique des moyennes pondérées par coefficients selon le barème officiel congolais (MEPPSA), classements, mentions et export imprimable.',
      icon: FileText,
      highlight: 'Barème Officiel 0 à 20',
      actionTab: 'notes'
    },
    {
      id: 'presence',
      title: '3. Présence & Appel en Direct',
      desc: 'Pointage rapide en classe (Présent, Absent justifié/non-justifié, Retard) avec notification immédiate des tuteurs par WhatsApp ou SMS.',
      icon: UserCheck,
      highlight: 'Alerte Parents Instantanée',
      actionTab: 'presence'
    },
    {
      id: 'comptabilite',
      title: '4. Comptabilité & Trésorerie',
      desc: 'Livre journal des recettes et dépenses, gestion de la caisse centrale, bilans financiers mensuels/annuels et conformité administrative.',
      icon: Calculator,
      highlight: 'Clôture & Bilan Annuel',
      actionTab: 'comptabilite'
    },
    {
      id: 'rh',
      title: '5. Personnel & Ressources Humaines',
      desc: 'Fiches détaillées des enseignants et agents administratifs, suivi des vacations, badges d’accès plastifiés avec QR Code et bulletins de rémunération.',
      icon: Briefcase,
      highlight: 'Badges & Paie CNSS',
      actionTab: 'rh'
    },
    {
      id: 'classes',
      title: '6. Cycles, Niveaux & Classes',
      desc: 'Configuration sur mesure : Maternelle, Primaire, Collège, Lycée et Formation Professionnelle. Gestion des divisions, salles et plannings.',
      icon: Calendar,
      highlight: 'Maternelle, Primaire, Collège, Lycée, Pro',
      actionTab: 'classes'
    },
    {
      id: 'public',
      title: '7. Portail Web & Proclamations',
      desc: 'Site officiel sécurisé pour l’établissement avec tableau d’affichage public, communiqués de la direction et publication des résultats.',
      icon: Globe,
      highlight: 'Communication 100% Intégrée',
      actionTab: 'public'
    }
  ];

  const plans = [
    {
      id: 'trimestriel',
      title: 'Trimestriel (3 Mois)',
      duration: '3 Mois',
      price: '22 500',
      unit: 'FCFA/mois',
      subtext: '67 500 FCFA / trimestre (-10%)',
      billing: 'Facturé 67 500 FCFA par trimestre (au lieu de 75 000 FCFA)',
      discountBadge: '-10% de Réduction',
      popular: false,
      desc: 'Parfaitement calqué sur le calendrier trimestriel des écoles congolaises.',
      features: [
        'Tous les modules débloqués',
        'Économie immédiate de 7 500 FCFA (-10%)',
        'Accompagnement au paramétrage des classes',
        'Support WhatsApp prioritaire 6j/7',
      ]
    },
    {
      id: 'semestriel',
      title: 'Semestriel (6 Mois)',
      duration: '6 Mois',
      price: '21 250',
      unit: 'FCFA/mois',
      subtext: '127 500 FCFA / semestre (-15%)',
      billing: 'Facturé 127 500 FCFA par semestre (au lieu de 150 000 FCFA)',
      discountBadge: '-15% de Réduction',
      popular: false,
      desc: 'Pour les complexes scolaires et centres de formation professionnelle.',
      features: [
        'Tous les modules débloqués pour 6 mois',
        'Économie immédiate de 22 500 FCFA (-15%)',
        'Formation du personnel administratif incluse',
        'Sauvegardes sécurisées dans le cloud',
      ]
    },
    {
      id: 'annuel',
      title: 'Annuel (Année Scolaire)',
      duration: '12 Mois',
      price: '18 750',
      unit: 'FCFA/mois',
      subtext: '225 000 FCFA / an • 3 mois offerts (-25%)',
      billing: 'Facturé 225 000 FCFA par an (au lieu de 300 000 FCFA)',
      discountBadge: 'Recommandé • 3 Mois Offerts (-25%)',
      popular: true,
      desc: 'La formule complète pour toute l’année académique avec le tarif le plus économique et un accompagnement VIP.',
      features: [
        'Tous les modules débloqués pour 12 mois',
        'Réduction maximale de -25% (3 mois gratuits)',
        'Déploiement sur site à Brazzaville & Pointe-Noire',
        'Attestation officielle d’agrément EDU-CONGO',
        'Sauvegardes automatiques quotidiennes & assistance 7j/7',
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-[#050505] flex flex-col selection:bg-[#1877F2] selection:text-white">
      
      {/* Top Bar Navigation Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#E4E6EB] px-4 sm:px-6 lg:px-8 py-3 text-xs font-medium shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-3 lg:gap-6 text-center lg:text-left">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-8 bg-[#1877F2] rounded-lg flex items-center justify-center font-black text-white text-sm shrink-0">
              EC
            </div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-base sm:text-lg text-[#050505]">EDU-CONGO</span>
              <span className="text-[#65676B] text-xs hidden sm:inline">
                • Système de Gestion Scolaire (Congo-Brazzaville)
              </span>
            </div>
          </div>

          {/* Official Contacts & Direct Actions */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 text-xs">
            <a 
              href="https://wa.me/242068958377" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 text-[#65676B] hover:text-[#1877F2] font-bold bg-[#F0F2F5] hover:bg-[#E7F3FF] px-3 py-1.5 rounded-lg text-xs transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp : +242 06 895 83 77</span>
            </a>
            <a 
              href="tel:+242061693598" 
              className="flex items-center justify-center gap-1.5 text-[#65676B] hover:text-[#1877F2] bg-[#F0F2F5] hover:bg-[#E7F3FF] px-3 py-1.5 rounded-lg text-xs transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Appel : +242 06 169 35 98</span>
            </a>
            
            {/* PWA Install Button */}
            <PwaInstallPrompt compact={true} />
            
            {/* Network Status Pill */}
            <NetworkStatusBanner variant="pill" />
            
            {/* Boutons d'action */}
            <button
              onClick={onOpenQuote}
              className="flex items-center justify-center gap-1.5 text-[#050505] bg-[#F0F2F5] hover:bg-[#E4E6EB] px-4 py-1.5 rounded-lg transition-colors font-bold text-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#1877F2]" />
              <span>Inscription</span>
            </button>
            <button
              onClick={onOpenLogin}
              className="flex items-center justify-center gap-1.5 text-white bg-[#1877F2] hover:bg-[#166FE5] px-4 py-1.5 rounded-lg transition-colors font-bold text-xs shadow-sm"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Espace Connexion</span>
            </button>
          </div>
        </div>
      </header>

      {/* Global Offline Network Status Banner */}
      <NetworkStatusBanner variant="banner" />

      {/* Main Visual Poster Container */}
      <div className="max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex-1 flex flex-col gap-10">
        
        {/* HERO SECTION */}
        <div className="relative rounded-lg bg-white border border-[#E4E6EB] p-6 sm:p-10 lg:p-12 shadow-sm text-center py-16 sm:py-20">
          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center gap-5">
            
            {/* Badges Centrés */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-lg bg-[#E7F3FF] border border-[#1877F2]/20 text-[#1877F2] font-bold text-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
                Conforme Normes MEPPSA (République du Congo)
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-lg bg-[#E7F3FF] border border-[#1877F2]/20 text-[#1877F2] font-bold text-xs">
                <Sparkles className="w-3.5 h-3.5" />
                Maternelle • Primaire • Collège • Lycée • Formation Professionnelle
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#050505] tracking-tight leading-[1.15]">
              Gérez votre établissement scolaire de manière centralisée et sécurisée.
            </h1>
            
            <p className="text-sm sm:text-base text-[#65676B] font-medium max-w-2xl mx-auto leading-relaxed">
              EDU-CONGO est la plateforme logicielle complète conçue pour digitaliser le système éducatif au Congo. Inscriptions, caisse en FCFA, notes, bulletins et communication instantanée avec les parents.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto mt-4">
              <button
                onClick={() => onLaunchDemo('direction')}
                className="w-full sm:w-auto bg-[#1877F2] hover:bg-[#166FE5] text-white font-bold px-6 py-3 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-colors text-sm"
              >
                <Building2 className="w-4 h-4" />
                <span>Tester la plateforme (Démo Directeur)</span>
              </button>
              <button
                onClick={onOpenQuote}
                className="w-full sm:w-auto bg-[#F0F2F5] hover:bg-[#E4E6EB] text-[#050505] font-bold px-6 py-3 rounded-lg flex items-center justify-center gap-2 border border-[#E4E6EB] transition-colors text-sm"
              >
                <MessageCircle className="w-4 h-4 text-[#1877F2]" />
                <span>Demander un devis WhatsApp</span>
              </button>
            </div>
            
            <p className="text-[11px] text-[#65676B] font-bold mt-2">
              ✓ 100% Fonctionnel hors-ligne (sans connexion internet active)
            </p>
          </div>
        </div>

        {/* 7 FEATURES GRID */}
        <div className="py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-[#050505]">
              Les 7 modules essentiels inclus
            </h2>
            <p className="text-sm text-[#65676B] mt-2 max-w-xl mx-auto">
              Tout ce dont vous avez besoin pour moderniser la gestion de votre complexe scolaire, sans frais cachés.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={feat.id}
                  className="bg-white rounded-lg p-5 border border-[#E4E6EB] shadow-sm flex flex-col gap-3 group"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-full bg-[#E7F3FF] flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-[#1877F2]" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#050505] text-sm group-hover:text-[#1877F2] transition-colors">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-[#65676B] mt-1.5 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#1877F2] bg-[#E7F3FF] px-2 py-0.5 rounded-lg">
                      {feat.highlight}
                    </span>
                    <button
                      onClick={() => onLaunchDemo('direction', feat.actionTab)}
                      className="text-[#65676B] hover:text-[#1877F2] transition-colors"
                      title="Ouvrir ce module"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* TESTIMONIALS CAROUSEL */}
        <div className="py-16">
          <TestimonialsCarousel />
        </div>

        {/* ABONNEMENTS */}
        <div className="py-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-[#050505]">
              Des tarifs adaptés à votre rythme scolaire
            </h2>
            <p className="text-sm text-[#65676B] mt-2 max-w-xl mx-auto">
              Optez pour la formule qui correspond au calendrier de votre établissement. Les abonnements annuels offrent le meilleur rapport qualité-prix.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`relative bg-white rounded-lg p-6 flex flex-col gap-5 border transition-all ${
                  plan.popular 
                    ? 'border-[#1877F2] shadow-sm scale-100 lg:scale-105 z-10' 
                    : 'border-[#E4E6EB] shadow-sm'
                }`}
              >
                {plan.discountBadge && (
                  <span className={`absolute -top-3 left-1/2 -translate-x-1/2 text-white text-[10px] font-black px-3 py-1 rounded-lg shadow-sm whitespace-nowrap ${
                    plan.popular ? 'bg-[#1877F2]' : 'bg-[#65676B]'
                  }`}>
                    {plan.discountBadge}
                  </span>
                )}
                
                <div className="flex flex-col gap-3">
                  <div>
                    <h3 className="font-bold text-base text-[#050505]">
                      {plan.title}
                    </h3>
                    <p className="text-xs mt-1 leading-relaxed text-[#65676B]">
                      {plan.desc}
                    </p>
                  </div>
                  
                  <div className="border-y py-3 my-1 border-[#E4E6EB]">
                    <div className="flex items-baseline justify-center sm:justify-start gap-1">
                      <span className="text-2xl font-black text-[#050505]">
                        {plan.price}
                      </span>
                      <span className="text-xs font-bold text-[#65676B]">
                        {plan.unit}
                      </span>
                    </div>
                    <span className="text-[11px] block mt-0.5 text-[#65676B]">
                      {plan.billing}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-left">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider block text-[#65676B]">
                      Inclus :
                    </span>
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#1877F2]" />
                        <span className="text-[#050505]">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={onOpenQuote}
                  className={`w-full py-2.5 px-4 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    plan.popular
                      ? 'bg-[#1877F2] hover:bg-[#166FE5] text-white shadow-sm'
                      : 'bg-[#F0F2F5] hover:bg-[#E4E6EB] text-[#050505] border border-[#E4E6EB]'
                  }`}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Choisir cette Formule</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* OFFICIAL CONTACT & GUARANTEES */}
        <div className="rounded-lg bg-[#1877F2] p-5 sm:p-8 flex flex-col md:flex-row items-center text-center md:text-left justify-center md:justify-between gap-6 shadow-sm mb-10">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-14 h-14 rounded-lg bg-white text-[#1877F2] flex items-center justify-center font-black text-2xl shrink-0 shadow-sm">
              EC
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base sm:text-lg">
                ÉQUIPE COMMERCIALE & SUPPORT TECHNIQUE
              </h3>
              <p className="text-xs text-[#E7F3FF] mt-0.5">
                Service client réactif basé en République du Congo (Brazzaville & Pointe-Noire).
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 w-full md:w-auto">
            <a 
              href="https://wa.me/242068958377" 
              target="_blank" 
              rel="noreferrer"
              className="w-full sm:w-auto px-4 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              WhatsApp : +242 06 895 83 77
            </a>
            <a 
              href="tel:+242061693598" 
              className="w-full sm:w-auto px-4 py-2.5 bg-[#166FE5] hover:bg-[#0c59c2] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors border border-[#E7F3FF]/30"
            >
              <Phone className="w-4 h-4" />
              Appel : +242 06 169 35 98
            </a>
          </div>
        </div>
      </div>

      {/* STICKY BOTTOM BAR */}
      <div className="sticky bottom-0 z-40 bg-white border-t border-[#E4E6EB] px-4 py-3 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[#E7F3FF] flex items-center justify-center shrink-0 hidden sm:flex">
              <MessageCircle className="w-5 h-5 text-[#1877F2]" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-[#050505]">
                Prêt à digitaliser votre établissement avec EDU-CONGO ?
              </p>
              <p className="text-[11px] text-[#65676B] hidden sm:block">
                Demandez votre plan d'abonnement et recevez votre lien de confirmation WhatsApp direct.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => (onOpenLogin ? onOpenLogin() : onLaunchDemo('direction'))}
              className="w-full sm:w-auto bg-[#F0F2F5] hover:bg-[#E4E6EB] text-[#050505] font-bold px-4 py-2.5 rounded-lg text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors border border-[#E4E6EB]"
            >
              <Building2 className="w-4 h-4 text-[#1877F2]" />
              Espace Connexion
            </button>
            <button
              onClick={onOpenQuote}
              className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold px-5 py-2.5 rounded-lg text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Souscrire sur WhatsApp (+242 06 895 83 77)</span>
            </button>
          </div>
          
        </div>
      </div>
      
    </div>
  );
};
