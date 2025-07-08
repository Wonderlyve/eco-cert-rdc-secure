
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, 
  FileText, 
  MapPin, 
  Landmark, 
  Shield, 
  CheckCircle,
  AlertCircle,
  Hash,
  Clock,
  Link2
} from 'lucide-react';
import { toast } from 'sonner';
import { blockchain, Block } from '@/services/blockchainService';

interface DocumentFormData {
  type: 'diploma' | 'certificate' | 'land_title' | 'land_certificate';
  title: string;
  recipient: string;
  institution: string;
  issueDate: string;
  description: string;
  metadata: {
    grade?: string;
    field?: string;
    location?: string;
    area?: string;
    plotNumber?: string;
  };
}

const CreateDocumentPage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<DocumentFormData>({
    type: 'diploma',
    title: '',
    recipient: '',
    institution: user?.institution || '',
    issueDate: new Date().toISOString().split('T')[0],
    description: '',
    metadata: {}
  });
  const [isCreating, setIsCreating] = useState(false);
  const [createdDocument, setCreatedDocument] = useState<Block | null>(null);

  const documentTypes = [
    { 
      value: 'diploma', 
      label: 'Diplôme', 
      icon: GraduationCap,
      allowedRoles: ['establishment', 'ministry_education']
    },
    { 
      value: 'certificate', 
      label: 'Certificat', 
      icon: FileText,
      allowedRoles: ['establishment', 'ministry_education']
    },
    { 
      value: 'land_title', 
      label: 'Titre Foncier', 
      icon: Landmark,
      allowedRoles: ['ministry_land']
    },
    { 
      value: 'land_certificate', 
      label: 'Certificat de Propriété', 
      icon: MapPin,
      allowedRoles: ['ministry_land']
    }
  ];

  const getAvailableDocTypes = () => {
    return documentTypes.filter(type => 
      type.allowedRoles.includes(user?.role || '')
    );
  };

  const handleInputChange = (field: keyof DocumentFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMetadataChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [field]: value
      }
    }));
  };

  const generateDocumentId = (): string => {
    const prefix = formData.type.toUpperCase().substring(0, 3);
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${year}-${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.recipient) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setIsCreating(true);

    try {
      // Simulation d'un délai pour le minage du bloc
      await new Promise(resolve => setTimeout(resolve, 2000));

      const documentId = generateDocumentId();
      
      const blockchainDoc = {
        id: documentId,
        timestamp: Date.now(),
        data: {
          documentId,
          documentType: formData.type,
          title: formData.title,
          recipient: formData.recipient,
          institution: formData.institution,
          issueDate: formData.issueDate,
          metadata: {
            ...formData.metadata,
            description: formData.description,
            createdBy: user?.name,
            createdAt: new Date().toISOString()
          }
        },
        nonce: 0
      };

      const block = blockchain.addDocument(blockchainDoc);
      setCreatedDocument(block);
      
      toast.success('Document créé et ajouté à la blockchain avec succès !');
      
      // Reset form
      setFormData({
        type: 'diploma',
        title: '',
        recipient: '',
        institution: user?.institution || '',
        issueDate: new Date().toISOString().split('T')[0],
        description: '',
        metadata: {}
      });

    } catch (error) {
      toast.error('Erreur lors de la création du document');
      console.error('Document creation error:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const renderMetadataFields = () => {
    switch (formData.type) {
      case 'diploma':
      case 'certificate':
        return (
          <>
            <div>
              <Label htmlFor="grade">Note/Mention</Label>
              <Input
                id="grade"
                value={formData.metadata.grade || ''}
                onChange={(e) => handleMetadataChange('grade', e.target.value)}
                placeholder="Ex: Très Bien, 15/20, etc."
              />
            </div>
            <div>
              <Label htmlFor="field">Domaine d'étude</Label>
              <Input
                id="field"
                value={formData.metadata.field || ''}
                onChange={(e) => handleMetadataChange('field', e.target.value)}
                placeholder="Ex: Informatique, Médecine, etc."
              />
            </div>
          </>
        );
      case 'land_title':
      case 'land_certificate':
        return (
          <>
            <div>
              <Label htmlFor="location">Localisation</Label>
              <Input
                id="location"
                value={formData.metadata.location || ''}
                onChange={(e) => handleMetadataChange('location', e.target.value)}
                placeholder="Ex: Kinshasa, Commune de Gombe"
              />
            </div>
            <div>
              <Label htmlFor="area">Superficie</Label>
              <Input
                id="area"
                value={formData.metadata.area || ''}
                onChange={(e) => handleMetadataChange('area', e.target.value)}
                placeholder="Ex: 500 m², 2 hectares"
              />
            </div>
            <div>
              <Label htmlFor="plotNumber">Numéro de parcelle</Label>
              <Input
                id="plotNumber"
                value={formData.metadata.plotNumber || ''}
                onChange={(e) => handleMetadataChange('plotNumber', e.target.value)}
                placeholder="Ex: P-123/KIN/2024"
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const availableTypes = getAvailableDocTypes();

  if (availableTypes.length === 0) {
    return (
      <div className="p-4 lg:p-8">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Accès non autorisé
            </h3>
            <p className="text-gray-600">
              Vous n'avez pas les permissions nécessaires pour créer des documents.
              Contactez votre administrateur.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
          Création de document
        </h1>
        <p className="text-gray-600 mt-1">
          Créez un document sécurisé et certifié par la blockchain
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulaire de création */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <span>Nouveau document</span>
              </CardTitle>
              <CardDescription>
                Remplissez les informations du document à certifier
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="type">Type de document *</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(value) => handleInputChange('type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center space-x-2">
                              <Icon className="w-4 h-4" />
                              <span>{type.label}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="title">Titre du document *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Ex: Licence en Informatique"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="recipient">Bénéficiaire *</Label>
                  <Input
                    id="recipient"
                    value={formData.recipient}
                    onChange={(e) => handleInputChange('recipient', e.target.value)}
                    placeholder="Nom complet du bénéficiaire"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="institution">Institution émettrice</Label>
                  <Input
                    id="institution"
                    value={formData.institution}
                    onChange={(e) => handleInputChange('institution', e.target.value)}
                    placeholder="Nom de l'institution"
                  />
                </div>

                <div>
                  <Label htmlFor="issueDate">Date d'émission</Label>
                  <Input
                    id="issueDate"
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => handleInputChange('issueDate', e.target.value)}
                  />
                </div>

                {/* Champs spécifiques selon le type */}
                {renderMetadataFields()}

                <div>
                  <Label htmlFor="description">Description/Notes</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Informations complémentaires..."
                    rows={3}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Minage en cours...
                    </div>
                  ) : (
                    <>
                      <Shield className="w-4 h-4 mr-2" />
                      Créer et certifier
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Informations blockchain */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Hash className="w-5 h-5 text-green-600" />
                <span>Blockchain</span>
              </CardTitle>
              <CardDescription>
                État actuel de la blockchain
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Blocs totaux:</span>
                <Badge variant="secondary">{blockchain.getChain().length}</Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Dernier bloc:</span>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                  #{blockchain.getLatestBlock().index}
                </code>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Intégrité:</span>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Validée
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Document créé */}
          {createdDocument && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-800">
                  <CheckCircle className="w-5 h-5" />
                  <span>Document créé</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-sm text-green-700 font-medium">ID:</span>
                  <code className="block text-xs bg-white px-2 py-1 rounded mt-1">
                    {createdDocument.data.data.documentId}
                  </code>
                </div>
                
                <div>
                  <span className="text-sm text-green-700 font-medium">Hash blockchain:</span>
                  <code className="block text-xs bg-white px-2 py-1 rounded mt-1 break-all">
                    {createdDocument.hash}
                  </code>
                </div>
                
                <div className="flex items-center text-xs text-green-600">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>
                    {new Date(createdDocument.timestamp).toLocaleString('fr-FR')}
                  </span>
                </div>
                
                <div className="flex items-center text-xs text-green-600">
                  <Link2 className="w-3 h-3 mr-1" />
                  <span>Bloc #{createdDocument.index}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateDocumentPage;
