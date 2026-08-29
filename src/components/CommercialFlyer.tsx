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
      color: 'bg-emerald-600',
      highlight: 'Conforme République du Congo (FCFA)',
      actionTab: 'frais'
    },
    {
      id: 'notes',
      title: '2. Notes & Bulletins Automatisés',
      desc: 'Calcul automatique des moyennes pondérées par coefficients selon le barème officiel congolais (MEPPSA), classements, mentions et export imprimable.',
      icon: FileText,
      color: 'bg-blue-600',
      highlight: 'Barème Officiel 0 à 20',
      actionTab: 'notes'
    },
    {
      id: 'presence',
      title: '3. Présence & Appel en Direct',
      desc: 'Pointage rapide en classe (Présent, Absent justifié/non-justifié, Retard) avec notification immédiate des tuteurs par WhatsApp ou SMS.',
      icon: UserCheck,
      color: 'bg-indigo-600',
      highlight: 'Alerte Parents Instantanée',
      actionTab: 'presence'
    },
    {
      id: 'comptabilite',
      title: '4. Comptabilité & Trésorerie',
      desc: 'Livre journal des recettes et dépenses, gestion de la caisse centrale, bilans financiers mensuels/annuels et conformité administrative.',
      icon: Calculator,
      color: 'bg-amber-600',
      highlight: 'Clôture & Bilan Annuel',
      actionTab: 'comptabilite'
    },
    {
      id: 'rh',
      title: '5. Personnel & Ressources Humaines',
      desc: 'Fiches détaillées des enseignants et agents administratifs, suivi des vacations, badges d’accès plastifiés avec QR Code et bulletins de rémunération.',
      icon: Briefcase,
      color: 'bg-purple-600',
      highlight: 'Badges & Paie CNSS',
      actionTab: 'rh'
    },
    {
      id: 'classes',
      title: '6. Cycles, Niveaux & Classes',
      desc: 'Configuration sur mesure : Maternelle, Primaire, Collège, Lycée et Formation Professionnelle. Gestion des divisions, salles et plannings.',
      icon: Calendar,
      color: 'bg-rose-600',
      highlight: 'Maternelle, Primaire, Collège, Lycée, Pro',
      actionTab: 'classes'
    },
    {
      id: 'public',
      title: '7. Portail Web & Proclamations',
      desc: 'Site officiel sécurisé pour l’établissement avec tableau d’affichage public, communiqués de la direction et publication des résultats.',
      icon: Globe,
      color: 'bg-cyan-600',
      highlight: 'Vitrine Web Intégrée',
      actionTab: 'public'
    },
    {
      id: 'dashboard',
      title: '8. Tableau de Bord Décisionnel',
      desc: 'Graphiques analytiques en temps réel : taux de réussite par classe, état d’encaissement global, effectifs et indicateurs de performance clés.',
      icon: PieChart,
      color: 'bg-teal-600',
      highlight: 'Supervision Globale',
      actionTab: 'dashboard'
    },
  ];

  const subscriptionPlans = [
    {
      id: 'mensuel',
      title: 'Mensuel (Sans engagement)',
      duration: '1 Mois',
      price: '25 000',
      unit: 'FCFA/mois',
      subtext: 'Facturation mensuelle sans engagement',
      billing: '25 000 FCFA / mois',
      discountBadge: null,
      popular: false,
      desc: 'Idéal pour tester toutes les fonctionnalités sur une période courte sans engagement à long terme.',
      features: [
        'Tous les modules débloqués sans restriction',
        'Multi-utilisateurs (Direction, Secrétariat, Caisse)',
        'Cartes scolaires & Badges d\'accès illimités',
        'Mises à jour gratuites incluses',
        'Support technique WhatsApp & Appel',
      ]
    },
    {
      id: 'trimestriel',
      title: 'Trimestriel (1er Trimestre)',
      duration: '3 Mois',
      price: '22 500',
      unit: 'FCFA/mois',
      subtext: '67 500 FCFA / trimestre (-10%)',
      billing: 'Facturé 67 500 FCFA tous les 3 mois (au lieu de 75 000 FCFA)',
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
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-[#0B1120] text-slate-800 dark:text-slate-100 flex flex-col selection:bg-indigo-600 selection:text-white transition-colors duration-200">
      
      {/* Top Bar Announcement & Official Navigation Header - RESPONSIVE & BIEN ALIGNÉ */}
      <header className="sticky top-0 z-50 bg-indigo-950/95 dark:bg-[#070D19]/95 backdrop-blur-md text-white px-4 sm:px-6 lg:px-8 py-3 text-xs font-medium border-b border-indigo-900/80 dark:border-slate-800 shadow-md transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-3 lg:gap-6 text-center lg:text-left">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-md shrink-0 border border-indigo-400/30">
              EC
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="font-extrabold tracking-tight text-base sm:text-lg text-white">EDU-CONGO</span>
              <span className="text-indigo-200 dark:text-slate-300 text-xs hidden sm:inline">
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
              className="flex items-center justify-center gap-1.5 text-emerald-300 hover:text-white font-bold bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-700/60 px-3 py-1.5 rounded-full text-xs transition-all"
              title="Assistance WhatsApp 24/7"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp : +242 06 895 83 77</span>
            </a>

            <a 
              href="tel:+242061693598" 
              className="flex items-center justify-center gap-1.5 text-indigo-200 hover:text-white bg-indigo-900/50 hover:bg-indigo-800/60 border border-indigo-700/50 px-3 py-1.5 rounded-full text-xs transition-all"
              title="Appel Téléphonique Direct"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>Appel : +242 06 169 35 98</span>
            </a>

            <ThemeToggle variant="pill" showLabel={false} />

            {/* Bouton Inscription dans la barre supérieure */}
            <button
              id="btn-topbar-open-signup"
              onClick={onOpenQuote}
              className="flex items-center justify-center gap-1.5 text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 px-4 py-1.5 rounded-xl border border-emerald-400/50 transition-all cursor-pointer shadow-md font-bold text-xs hover:scale-105 active:scale-95"
              title="Inscrire mon établissement (Essai 14 jours gratuit ou Formule officielle)"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Inscription</span>
            </button>

            {/* Bouton Connexion Sécurisée */}
            <button
              id="btn-topbar-open-login"
              onClick={onOpenLogin}
              className="flex items-center justify-center gap-1.5 text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-1.5 rounded-xl border border-indigo-400/40 transition-all cursor-pointer shadow-md font-bold text-xs hover:scale-105 active:scale-95"
              title="Accéder à l'espace de connexion authentifié"
            >
              <Lock className="w-3.5 h-3.5 text-amber-300" />
              <span>Espace Connexion</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Visual Poster Container */}
      <div className="max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex-1 flex flex-col gap-10">
        
        {/* HERO SECTION - PARFAITEMENT CENTRÉ ET RESPONSIVE */}
        <div className="relative rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-10 lg:p-12 shadow-sm overflow-hidden transition-colors duration-200 text-center">
          
          {/* Ambient Glows */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-100/60 dark:bg-indigo-950/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 -right-24 w-96 h-96 bg-blue-100/60 dark:bg-blue-950/30 rounded-full blur-3xl pointer-events-none" />

          {/* Header & Main Catchphrase */}
          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center gap-5">
            
            {/* Badges Centrés */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-bold text-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Conforme Normes MEPPSA (République du Congo)
              </span>

              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Maternelle • Primaire • Collège • Lycée • Formation Professionnelle
              </span>
            </div>

            {/* Titre & Slogan */}
            <div className="w-full space-y-2">
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight text-balance">
                LOGICIEL DE GESTION SCOLAIRE INTÉGRÉ
              </h1>
              <p className="text-base sm:text-xl font-extrabold text-indigo-600 dark:text-indigo-400 text-balance">
                EDU-CONGO : Le standard d’excellence numérique pour les établissements scolaires
              </p>
            </div>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto text-balance">
              Une plateforme moderne et sécurisée, livrée prête à être configurée par les administrateurs de chaque établissement scolaire. 
              Gérez en toute sérénité les <strong className="text-slate-900 dark:text-white">Inscriptions & Cartes scolaires plastifiées</strong>, 
              les <strong className="text-slate-900 dark:text-white">Frais de scolarité en FCFA (MTN MoMo & Airtel Money)</strong>, 
              les <strong className="text-slate-900 dark:text-white">Bulletins officiels & Certificats</strong>, 
              et les <strong className="text-slate-900 dark:text-white">Badges d'accès du personnel</strong>.
            </p>

            {/* CTA Buttons in Hero */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={onOpenQuote}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm rounded-xl shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Inscrire mon Établissement (14 Jours d'Essai Gratuit)</span>
              </button>

              <button
                onClick={onOpenLogin}
                className="px-6 py-3 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-sm rounded-xl shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border border-slate-700 cursor-pointer"
              >
                <Lock className="w-4 h-4 text-indigo-400" />
                <span>Se Connecter à mon Espace</span>
              </button>
            </div>
          </div>
        </div>

        {/* 8 MODULES SHOWCASE */}
        <div className="flex flex-col gap-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">Architecture Complète</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              LES 8 MODULES INTÉGRÉS DANS EDU-CONGO
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Conçus spécialement pour répondre aux exigences pédagogiques et financières en République du Congo
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.id}
                  onClick={onOpenLogin}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-4 group text-left"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl ${feat.color} flex items-center justify-center text-white shadow-sm`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-100 dark:border-indigo-800/60">
                        {feat.highlight}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {feat.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3 h-3 text-slate-400" />
                      Connexion requise
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* TESTIMONIALS SOCIAL PROOF CAROUSEL */}
        <TestimonialsCarousel />

        {/* SUBSCRIPTION PLANS SECTION */}
        <div className="flex flex-col gap-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Tarification Transparente en FCFA</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              FORMULES D'ABONNEMENT EDU-CONGO
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Choisissez votre formule. Le lien officiel de confirmation arrive directement sur le WhatsApp d'EDU-CONGO (+242 06 895 83 77) pour une mise en service rapide.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {subscriptionPlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-5 flex flex-col justify-between gap-5 transition-all text-center sm:text-left ${
                  plan.popular
                    ? 'bg-gradient-to-b from-indigo-900 via-indigo-950 to-slate-900 text-white shadow-xl ring-2 ring-indigo-500 scale-[1.01]'
                    : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-sm'
                }`}
              >
                {plan.discountBadge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-md whitespace-nowrap">
                    {plan.discountBadge}
                  </span>
                )}

                <div className="flex flex-col gap-3">
                  <div>
                    <h3 className={`font-bold text-base ${plan.popular ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                      {plan.title}
                    </h3>
                    <p className={`text-xs mt-1 leading-relaxed ${plan.popular ? 'text-indigo-200' : 'text-slate-500 dark:text-slate-400'}`}>
                      {plan.desc}
                    </p>
                  </div>

                  <div className="border-y py-3 my-1 border-slate-100/20 dark:border-slate-800">
                    <div className="flex items-baseline justify-center sm:justify-start gap-1">
                      <span className={`text-2xl font-black ${plan.popular ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                        {plan.price}
                      </span>
                      <span className={`text-xs font-bold ${plan.popular ? 'text-indigo-200' : 'text-slate-600 dark:text-slate-400'}`}>
                        {plan.unit}
                      </span>
                    </div>
                    <span className={`text-[11px] block mt-0.5 ${plan.popular ? 'text-indigo-300' : 'text-slate-500 dark:text-slate-400'}`}>
                      {plan.billing}
                    </span>
                  </div>

                  <div className="space-y-2 text-left">
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider block ${
                      plan.popular ? 'text-indigo-300' : 'text-slate-400'
                    }`}>
                      Inclus :
                    </span>
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs">
                        <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${plan.popular ? 'text-emerald-400' : 'text-emerald-600 dark:text-emerald-400'}`} />
                        <span className={plan.popular ? 'text-slate-200' : 'text-slate-700 dark:text-slate-300'}>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={onOpenQuote}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer ${
                    plan.popular
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-900/40'
                      : 'bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                  }`}
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                  <span>Choisir cette Formule</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* OFFICIAL CONTACT & GUARANTEES - CENTRÉ SUR MOBILE */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 sm:p-8 flex flex-col md:flex-row items-center text-center md:text-left justify-center md:justify-between gap-6 shadow-sm transition-colors duration-200">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-2xl shrink-0 shadow-md">
              EC
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg">
                ÉQUIPE COMMERCIALE & SUPPORT TECHNIQUE EDU-CONGO
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Service client réactif basé en République du Congo (Brazzaville & Pointe-Noire).
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 w-full md:w-auto">
            <a
              href="https://wa.me/242068958377"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-4 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              WhatsApp : +242 06 895 83 77
            </a>

            <a
              href="tel:+242061693598"
              className="w-full sm:w-auto px-4 py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all border border-transparent dark:border-slate-700"
            >
              <Phone className="w-4 h-4" />
              Appel : +242 06 169 35 98
            </a>

            <a
              href="mailto:steph.alongo@gmail.com"
              className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl flex items-center justify-center gap-2 border border-slate-300 dark:border-slate-700 transition-all"
            >
              <Mail className="w-4 h-4" />
              steph.alongo@gmail.com
            </a>
          </div>
        </div>

      </div>

      {/* STICKY BOTTOM BAR */}
      <div className="sticky bottom-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-4 py-3 shadow-lg transition-colors duration-200">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center shrink-0 hidden sm:flex">
              <MessageCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Prêt à digitaliser votre établissement avec EDU-CONGO ?
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Demandez votre plan d'abonnement et recevez votre lien de confirmation WhatsApp direct.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => (onOpenLogin ? onOpenLogin() : onLaunchDemo('direction'))}
              className="w-full sm:w-auto bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-transparent dark:border-slate-700"
            >
              <Building2 className="w-4 h-4 text-indigo-400" />
              Espace Connexion & Paramétrage
            </button>

            <button
              onClick={onOpenQuote}
              className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold px-5 py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer"
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
