
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const LoginPage = () => {
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    try {
      await login(formData.email, formData.password);
      toast.success('Connexion réussie !');
    } catch (error) {
      toast.error('Erreur de connexion. Vérifiez vos identifiants.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background Image - Taille réduite et centrée */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[80%] bg-center bg-contain bg-no-repeat opacity-20 z-0"
        style={{
          backgroundImage: 'url(/lovable-uploads/1f2aad9e-6320-432d-ac48-3b04163488b7.png)',
        }}
      />
      
      {/* Overlay gradient pour améliorer la lisibilité */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-800/80 to-blue-700/80 z-10" />
      
      {/* Contenu de la page */}
      <div className="relative z-20 w-full max-w-md">
        {/* Logo et titre */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-blue-900" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">eCert RDC</h1>
          <p className="text-yellow-400 font-medium">Certification numérique sécurisée</p>
        </div>

        {/* Section de connexion transparente */}
        <div className="bg-transparent border border-white/20 backdrop-blur-sm rounded-lg shadow-2xl">
          <div className="space-y-1 pb-6 pt-6 px-6">
            <h2 className="text-2xl font-bold text-center text-white">
              Connexion
            </h2>
            <p className="text-center text-white/80">
              Accédez à votre espace personnel
            </p>
          </div>
          
          <div className="px-6 pb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-white">
                  Adresse email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-yellow-400 focus:ring-yellow-400"
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-white">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-white/60" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-yellow-400 focus:ring-yellow-400"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-white/60 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-blue-900 font-medium shadow-lg border-0"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-900 mr-2"></div>
                    Connexion...
                  </div>
                ) : (
                  'Se connecter'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-white/80">
                Pas encore de compte ?{' '}
                <Link
                  to="/register"
                  className="font-medium text-yellow-400 hover:text-yellow-300 transition-colors"
                >
                  Créer un compte
                </Link>
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-xs text-white/70 text-center">
                Accès public à la vérification :{' '}
                <Link
                  to="/verification"
                  className="text-yellow-400 hover:text-yellow-300 font-medium"
                >
                  Vérifier un document
                </Link>
              </p>
            </div>

            {/* Comptes de test */}
            <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
              <p className="text-xs font-medium text-yellow-400 mb-2">Comptes de test :</p>
              <div className="text-xs text-white/70 space-y-1">
                <p>• <span className="text-yellow-400">Admin:</span> admin@ecert.cd / password</p>
                <p>• <span className="text-yellow-400">Utilisateur:</span> user@test.cd / password</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
