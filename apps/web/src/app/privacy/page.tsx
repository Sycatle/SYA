import { Shield, Lock, Eye, Database, Server, Users, ArrowRight, Brain } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Image 
              src="/sya_logo.jpg" 
              alt="SYA Logo" 
              width={32} 
              height={32} 
              className="w-8 h-8 rounded-lg object-cover"
            />
            <span className="text-2xl font-bold text-white">SYA</span>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              Accueil
            </Link>
            <Link href="/chat" className="text-gray-300 hover:text-white transition-colors">
              Essayer SYA
            </Link>
            <Link 
              href="/"
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              Retour
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Shield className="w-12 h-12 text-blue-400" />
            <h1 className="text-5xl font-bold text-white">
              Politique de Confidentialité
            </h1>
          </div>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            SYA respecte votre vie privée. Découvrez comment nous protégeons vos données.
          </p>
        </div>
      </section>

      {/* Privacy Principles */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Nos Principes de Confidentialité
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Votre vie privée est notre priorité absolue
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <Lock className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">100% Local</h3>
            <p className="text-gray-300">
              Toutes vos données restent sur votre machine. Aucune information ne quitte votre ordinateur.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <Eye className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Transparence Totale</h3>
            <p className="text-gray-300">
              Code source ouvert. Vous pouvez vérifier exactement ce que fait SYA.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <Database className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Contrôle Total</h3>
            <p className="text-gray-300">
              Vous contrôlez entièrement vos données. Supprimez-les quand vous voulez.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <Server className="w-12 h-12 text-yellow-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Aucun Serveur</h3>
            <p className="text-gray-300">
              Pas de serveur externe. SYA fonctionne entièrement sur votre machine.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <Users className="w-12 h-12 text-pink-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Multi-utilisateurs</h3>
            <p className="text-gray-300">
              Chaque utilisateur a son espace privé. Aucun partage de données.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <Brain className="w-12 h-12 text-orange-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">IA Locale</h3>
            <p className="text-gray-300">
              L'IA fonctionne localement via Ollama. Aucune requête externe.
            </p>
          </div>
        </div>
      </section>

      {/* Data Collection */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-8 text-center">
            Collecte de Données
          </h2>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-8">
            <h3 className="text-2xl font-semibold text-white mb-6">Ce que nous collectons :</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-1">Conversations</h4>
                  <p className="text-gray-300">Vos conversations avec l'IA sont stockées localement sur votre machine.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-1">Comptes utilisateurs</h4>
                  <p className="text-gray-300">Email, nom d'affichage et hash du mot de passe (base de données locale).</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-1">Préférences</h4>
                  <p className="text-gray-300">Vos paramètres et préférences d'interface (stockage local).</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-semibold text-white mb-6">Ce que nous NE collectons PAS :</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-1">Données personnelles</h4>
                  <p className="text-gray-300">Aucune information personnelle n'est envoyée à des tiers.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-1">Données de navigation</h4>
                  <p className="text-gray-300">Aucun tracking, analytics ou cookies de suivi.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="text-lg font-semibold text-white mb-1">Données de géolocalisation</h4>
                  <p className="text-gray-300">Aucune information sur votre localisation.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Storage */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-8 text-center">
            Stockage des Données
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-semibold text-white mb-6">Base de données locale</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  PostgreSQL installé localement
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  Chiffrement des mots de passe
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  Sauvegarde locale possible
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  Contrôle total des données
                </li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-semibold text-white mb-6">Sécurité</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Aucune connexion internet requise
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Pas de serveur externe
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Chiffrement local des données
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Suppression facile des données
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Your Rights */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-8 text-center">
            Vos Droits
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-semibold text-white mb-6">Contrôle total</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  Accès à toutes vos données
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  Modification de vos informations
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  Suppression de votre compte
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  Export de vos données
                </li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-semibold text-white mb-6">Transparence</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  Code source ouvert
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  Documentation complète
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  Communauté active
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  Contributions bienvenues
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-8">
            Questions sur la Confidentialité ?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Si vous avez des questions sur notre politique de confidentialité, 
            n'hésitez pas à nous contacter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://github.com/Sycatle/SYA/issues"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
            >
              <ArrowRight className="w-5 h-5 mr-2" />
              Poser une Question
            </a>
            <Link 
              href="/"
              className="inline-flex items-center px-8 py-4 border border-gray-600 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all"
            >
              Retour à l'Accueil
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-white/20">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Image 
              src="/sya_logo.jpg" 
              alt="SYA Logo" 
              width={32} 
              height={32} 
              className="w-8 h-8 rounded-lg object-cover"
            />
            <span className="text-xl font-bold text-white">SYA</span>
          </div>
          <p className="text-gray-400 mb-4">
            Votre assistant IA personnel, privé et open-source
          </p>
          <div className="flex justify-center space-x-6">
            <a href="https://github.com/Sycatle/SYA" className="text-gray-400 hover:text-white transition-colors">
              GitHub
            </a>
            <Link href="/chat" className="text-gray-400 hover:text-white transition-colors">
              Essayer SYA
            </Link>
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">
              Accueil
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
} 