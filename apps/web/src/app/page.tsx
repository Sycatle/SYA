import { Download, Shield, Zap, Brain, Globe, Users, Star, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
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
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">
              Fonctionnalités
            </a>
            <a href="#download" className="text-gray-300 hover:text-white transition-colors">
              Télécharger
            </a>
            <a href="#about" className="text-gray-300 hover:text-white transition-colors">
              À propos
            </a>
            <Link 
              href="/chat"
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
            >
              Essayer SYA
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold text-white mb-6">
            Votre Assistant IA
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              Personnel & Privé
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            SYA est votre Jarvis open-source. Un assistant IA qui fonctionne 100% en local, 
            respecte votre vie privée et vous aide dans vos tâches quotidiennes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/chat"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
            >
              <Zap className="w-5 h-5 mr-2" />
              Essayer SYA Maintenant
            </Link>
            <Link 
              href="#download"
              className="inline-flex items-center px-8 py-4 border border-gray-600 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all"
            >
              <Download className="w-5 h-5 mr-2" />
              Télécharger SYA
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Pourquoi choisir SYA ?
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Un assistant IA moderne, éthique et respectueux de votre vie privée
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <Shield className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">100% Privé</h3>
            <p className="text-gray-300">
              Fonctionne entièrement sur votre machine. Aucune donnée ne quitte votre ordinateur.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <Zap className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Rapide & Efficace</h3>
            <p className="text-gray-300">
              Optimisé en Rust pour des performances maximales. Réponse instantanée.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <Brain className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">IA Moderne</h3>
            <p className="text-gray-300">
              Utilise les derniers modèles d'IA locale via Ollama. Conversation naturelle.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <Globe className="w-12 h-12 text-yellow-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Sans Internet</h3>
            <p className="text-gray-300">
              Fonctionne hors ligne. Aucune connexion internet requise après l'installation.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <Users className="w-12 h-12 text-pink-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Multi-utilisateurs</h3>
            <p className="text-gray-300">
              Support multi-utilisateurs avec base de données PostgreSQL. Chacun son espace.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <Star className="w-12 h-12 text-orange-400 mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Open Source</h3>
            <p className="text-gray-300">
              Code source ouvert et transparent. Contribuez et personnalisez selon vos besoins.
            </p>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section id="download" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Téléchargez SYA
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Choisissez votre plateforme et commencez à utiliser votre assistant IA personnel
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* Windows */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Image 
                src="/windows-logo.png" 
                alt="Windows Logo" 
                width={48} 
                height={48} 
                className="w-12 h-12"
              />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">Windows</h3>
            <p className="text-gray-300 mb-6">
              Application Windows avec installateur automatique
            </p>
            <div className="space-y-3">
              <Link 
                href="https://github.com/RISK-alt/SYA/blob/main/README.md"
                className="block w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Application Windows
              </Link>
              <Link 
                href="https://github.com/RISK-alt/SYA/blob/main/README.md"
                className="block w-full px-6 py-3 border border-gray-600 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
              >
                Package Windows
              </Link>
            </div>
          </div>

          {/* macOS */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 text-center">
            <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Image 
                src="/macos-logo.png" 
                alt="macOS Logo" 
                width={48} 
                height={48} 
                className="w-12 h-12"
              />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">macOS</h3>
            <p className="text-gray-300 mb-6">
              Application native macOS avec intégration système
            </p>
            <div className="space-y-3">
              <Link 
                href="https://github.com/RISK-alt/SYA/blob/main/README.md"
                className="block w-full px-6 py-3 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
              >
                Application macOS
              </Link>
              <Link 
                href="https://github.com/RISK-alt/SYA/blob/main/README.md"
                className="block w-full px-6 py-3 border border-gray-600 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
              >
                Package macOS
              </Link>
            </div>
          </div>

          {/* Linux */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 text-center">
            <div className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Image 
                src="/linux-logo.png" 
                alt="Linux Logo" 
                width={48} 
                height={48} 
                className="w-12 h-12"
              />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">Linux</h3>
            <p className="text-gray-300 mb-6">
              Package d'installation pour toutes les distributions Linux
            </p>
            <div className="space-y-3">
              <Link 
                href="https://github.com/RISK-alt/SYA/blob/main/README.md"
                className="block w-full px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
              >
                Applicartion Linux
              </Link>
              <Link 
                href="https://github.com/RISK-alt/SYA/blob/main/README.md"
                className="block w-full px-6 py-3 border border-gray-600 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
              >
                Package Linux
              </Link>
            </div>
          </div>
        </div>

        {/* System Requirements */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold text-white mb-6">Configuration requise</h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Système</h4>
              <p className="text-gray-300 text-sm">Windows 10+, macOS 10.15+, Linux</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Mémoire</h4>
              <p className="text-gray-300 text-sm">8 Go RAM minimum</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Espace</h4>
              <p className="text-gray-300 text-sm">10 Go disque libre</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-8">
            À propos de SYA
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            SYA (Simple Yet Advanced) est né d'une vision simple : créer un assistant IA 
            personnel qui respecte votre vie privée tout en étant puissant et facile à utiliser.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="text-left">
              <h3 className="text-2xl font-semibold text-white mb-4">Technologies</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  Backend Rust (Actix Web)
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  Frontend Next.js (React)
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  Base de données PostgreSQL
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  IA locale via Ollama
                </li>
              </ul>
            </div>
            
            <div className="text-left">
              <h3 className="text-2xl font-semibold text-white mb-4">Fonctionnalités</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  Assistant conversationnel IA
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  Interface web moderne
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  Multi-utilisateurs
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  Fonctionnement hors ligne
                </li>
              </ul>
            </div>
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
          <div className="flex justify-center space-x-6 mb-6">
            <a href="https://github.com/Sycatle/SYA" className="text-gray-400 hover:text-white transition-colors">
              GitHub
            </a>
            <Link href="/chat" className="text-gray-400 hover:text-white transition-colors">
              Essayer SYA
            </Link>
            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
              Confidentialité
            </Link>
          </div>
          
          {/* Crédits */}
          <div className="border-t border-white/10 pt-6">
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="text-gray-400">
                <h4 className="font-semibold text-white mb-2">Création</h4>
                <p>Développé par <a href="https://github.com/Sycatle" className="text-blue-400 hover:text-blue-300">@sycatle</a> et <a href="https://github.com/risk-alt" className="text-blue-400 hover:text-blue-300">@risk</a></p>
                <p>Assistant IA local</p>
              </div>
              <div className="text-gray-400">
                <h4 className="font-semibold text-white mb-2">Technologies</h4>
                <p>Rust • Next.js • PostgreSQL</p>
                <p>Ollama • Docker • TypeScript</p>
              </div>
              <div className="text-gray-400">
                <h4 className="font-semibold text-white mb-2">Contributeurs</h4>
                <p>Merci à tous les contributeurs !</p>
                <a href="https://github.com/Sycatle/SYA/graphs/contributors" className="text-blue-400 hover:text-blue-300">
                  Voir la liste
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
