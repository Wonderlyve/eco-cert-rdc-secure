
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Upload, User, CreditCard, Save, Eye, Fingerprint, Shield, Search, History, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface StudentCardData {
  photo: string | null;
  fingerprint: string | null;
  nom: string;
  postnom: string;
  prenom: string;
  niveauScolaire: string;
  ecole: string;
  province: string;
  adresse: string;
}

interface RecentCard {
  id: string;
  nom: string;
  postnom: string;
  prenom: string;
  niveauScolaire: string;
  ecole: string;
  photo: string | null;
  fingerprint: string | null;
  dateCreation: string;
}

const StudentCardPage = () => {
  const [studentData, setStudentData] = useState<StudentCardData>({
    photo: null,
    fingerprint: null,
    nom: '',
    postnom: '',
    prenom: '',
    niveauScolaire: '',
    ecole: '',
    province: '',
    adresse: ''
  });
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const photoInputRef = useRef<HTMLInputElement>(null);
  const fingerprintInputRef = useRef<HTMLInputElement>(null);

  // Données d'exemple pour les cartes récemment créées
  const [recentCards] = useState<RecentCard[]>([
    {
      id: '1',
      nom: 'KABILA',
      postnom: 'JOSEPH',
      prenom: 'MARCEL',
      niveauScolaire: '5ème Secondaire',
      ecole: 'Lycée Français de Kinshasa',
      photo: null,
      fingerprint: null,
      dateCreation: '2024-01-15'
    },
    {
      id: '2',
      nom: 'MUKENDI',
      postnom: 'MARIE',
      prenom: 'CLAIRE',
      niveauScolaire: '3ème Secondaire',
      ecole: 'Collège Boboto',
      photo: null,
      fingerprint: null,
      dateCreation: '2024-01-14'
    },
    {
      id: '3',
      nom: 'TSHISEKEDI',
      postnom: 'FELIX',
      prenom: 'ANTOINE',
      niveauScolaire: '6ème Primaire',
      ecole: 'École Primaire Sainte-Marie',
      photo: null,
      fingerprint: null,
      dateCreation: '2024-01-13'
    }
  ]);

  const provinces = [
    'Kinshasa', 'Kongo Central', 'Kwilu', 'Kwango', 'Mai-Ndombe',
    'Kasaï', 'Kasaï Oriental', 'Kasaï Central', 'Lomami', 'Sankuru',
    'Maniema', 'Sud-Kivu', 'Nord-Kivu', 'Ituri', 'Haut-Uele',
    'Bas-Uele', 'Tshopo', 'Mongala', 'Nord-Ubangi', 'Sud-Ubangi',
    'Équateur', 'Tshuapa', 'Haut-Lomami', 'Lualaba', 'Haut-Katanga',
    'Tanganyika'
  ];

  const niveauxScolaires = [
    '1ère Primaire', '2ème Primaire', '3ème Primaire', '4ème Primaire', '5ème Primaire', '6ème Primaire',
    '1ère Secondaire', '2ème Secondaire', '3ème Secondaire', '4ème Secondaire', '5ème Secondaire', '6ème Secondaire'
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setStudentData(prev => ({ ...prev, photo: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFingerprintUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setStudentData(prev => ({ ...prev, fingerprint: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field: keyof StudentCardData, value: string) => {
    setStudentData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!studentData.nom || !studentData.prenom || !studentData.niveauScolaire || !studentData.ecole) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    toast.success('Carte d\'élève créée avec succès !');
    console.log('Données de la carte d\'élève:', studentData);
  };

  // Filtrer les cartes selon le terme de recherche
  const filteredCards = recentCards.filter(card => 
    card.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.postnom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.ecole.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const loadStudentData = (card: RecentCard) => {
    setStudentData({
      photo: card.photo,
      fingerprint: card.fingerprint,
      nom: card.nom,
      postnom: card.postnom,
      prenom: card.prenom,
      niveauScolaire: card.niveauScolaire,
      ecole: card.ecole,
      province: '',
      adresse: ''
    });
    toast.success('Données de l\'élève chargées');
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Création de Carte d'Élève Biométrique
          </h1>
          <p className="text-gray-600 mt-1">
            Créez une carte d'identité scolaire sécurisée
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            {isPreviewMode ? 'Modifier' : 'Aperçu'}
          </Button>
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Enregistrer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulaire de données */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Informations de l'Élève
            </CardTitle>
            <CardDescription>
              Remplissez toutes les informations nécessaires
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Upload Photo */}
            <div className="space-y-2">
              <Label>Photo de l'élève *</Label>
              <div className="flex items-center gap-4">
                {studentData.photo && (
                  <img 
                    src={studentData.photo} 
                    alt="Photo élève" 
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                )}
                <Button
                  variant="outline"
                  onClick={() => photoInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  {studentData.photo ? 'Changer' : 'Ajouter'} Photo
                </Button>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Upload Empreinte */}
            <div className="space-y-2">
              <Label>Empreinte digitale *</Label>
              <div className="flex items-center gap-4">
                {studentData.fingerprint && (
                  <img 
                    src={studentData.fingerprint} 
                    alt="Empreinte" 
                    className="w-20 h-20 object-cover rounded-lg border bg-gray-50"
                  />
                )}
                <Button
                  variant="outline"
                  onClick={() => fingerprintInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Fingerprint className="w-4 h-4" />
                  {studentData.fingerprint ? 'Changer' : 'Ajouter'} Empreinte
                </Button>
                <input
                  ref={fingerprintInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFingerprintUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Nom, Postnom, Prénom */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nom">Nom *</Label>
                <Input
                  id="nom"
                  value={studentData.nom}
                  onChange={(e) => handleInputChange('nom', e.target.value)}
                  placeholder="Nom de famille"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postnom">Postnom</Label>
                <Input
                  id="postnom"
                  value={studentData.postnom}
                  onChange={(e) => handleInputChange('postnom', e.target.value)}
                  placeholder="Postnom"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom *</Label>
                <Input
                  id="prenom"
                  value={studentData.prenom}
                  onChange={(e) => handleInputChange('prenom', e.target.value)}
                  placeholder="Prénom"
                />
              </div>
            </div>

            {/* Niveau scolaire */}
            <div className="space-y-2">
              <Label>Niveau scolaire *</Label>
              <Select value={studentData.niveauScolaire} onValueChange={(value) => handleInputChange('niveauScolaire', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le niveau" />
                </SelectTrigger>
                <SelectContent>
                  {niveauxScolaires.map((niveau) => (
                    <SelectItem key={niveau} value={niveau}>{niveau}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* École */}
            <div className="space-y-2">
              <Label htmlFor="ecole">École *</Label>
              <Input
                id="ecole"
                value={studentData.ecole}
                onChange={(e) => handleInputChange('ecole', e.target.value)}
                placeholder="Nom de l'école"
              />
            </div>

            {/* Province */}
            <div className="space-y-2">
              <Label>Province *</Label>
              <Select value={studentData.province} onValueChange={(value) => handleInputChange('province', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner la province" />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((province) => (
                    <SelectItem key={province} value={province}>{province}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Adresse */}
            <div className="space-y-2">
              <Label htmlFor="adresse">Adresse</Label>
              <Textarea
                id="adresse"
                value={studentData.adresse}
                onChange={(e) => handleInputChange('adresse', e.target.value)}
                placeholder="Adresse complète"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Aperçu de la carte */}
        <div className="space-y-6">
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Aperçu de la Carte
              </CardTitle>
              <CardDescription>
                Voici à quoi ressemblera la carte d'élève
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white shadow-xl">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-6 h-6 text-yellow-400" />
                    <span className="font-bold text-sm">eCert RDC</span>
                  </div>
                  <span className="text-xs bg-yellow-400 text-blue-900 px-2 py-1 rounded font-semibold">
                    ÉLÈVE
                  </span>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    {studentData.photo ? (
                      <img 
                        src={studentData.photo} 
                        alt="Photo élève" 
                        className="w-20 h-24 object-cover rounded border-2 border-white"
                      />
                    ) : (
                      <div className="w-20 h-24 bg-blue-500 rounded border-2 border-white flex items-center justify-center">
                        <User className="w-8 h-8 text-white opacity-50" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-1 text-sm">
                    <div className="font-bold text-lg">
                      {studentData.nom || 'NOM'} {studentData.postnom && `${studentData.postnom} `}{studentData.prenom || 'Prénom'}
                    </div>
                    <div>Niveau: {studentData.niveauScolaire || 'Non spécifié'}</div>
                    <div>École: {studentData.ecole || 'Non spécifiée'}</div>
                    <div>Province: {studentData.province || 'Non spécifiée'}</div>
                    {studentData.adresse && (
                      <div className="text-xs opacity-90">
                        {studentData.adresse}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-blue-400/30 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {studentData.fingerprint ? (
                      <img 
                        src={studentData.fingerprint} 
                        alt="Empreinte" 
                        className="w-8 h-8 object-cover rounded border border-white/30 bg-white/10"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-blue-500 rounded border border-white/30 flex items-center justify-center">
                        <Fingerprint className="w-4 h-4 text-white opacity-50" />
                      </div>
                    )}
                    <span className="text-xs">Biométrique</span>
                  </div>
                  <div className="text-xs opacity-75">
                    ID: {Date.now().toString().slice(-8)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section des cartes récemment créées */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Cartes Récemment Créées
              </CardTitle>
              <CardDescription>
                Rechercher et charger les données d'un élève existant
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Barre de recherche */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par nom, prénom ou école..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Liste des cartes récentes */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filteredCards.length > 0 ? (
                  filteredCards.map((card) => (
                    <div
                      key={card.id}
                      className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => loadStudentData(card)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {card.nom} {card.postnom} {card.prenom}
                          </div>
                          <div className="text-xs text-gray-500">
                            {card.niveauScolaire} - {card.ecole}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Calendar className="w-3 h-3" />
                          {new Date(card.dateCreation).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Aucune carte trouvée</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StudentCardPage;
