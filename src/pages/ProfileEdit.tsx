import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Upload, X, Save, User, FileText, Camera, Info, CheckCircle, XCircle, Loader2, Send } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

interface Document {
  id: string;
  name: string;
  type: string;
  requiredType: string;
  size: number;
  uploadDate: string;
  file: File;
}

interface RequiredDocument {
  type: string;
  label: string;
}

const ProfileEdit: React.FC = () => {
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '+33 6 12 34 56 78',
    address: '123 Rue de la Paix',
    city: 'Paris',
    postalCode: '75001',
    profession: 'Ingénieur',
    employer: 'Tech Corp',
    monthlyIncome: '4500',
    birthDate: '',
    birthPlace: ''
  });

  const [profilePicture, setProfilePicture] = useState<string>('/placeholder-avatar.jpg');
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'carte_identite.pdf',
      type: 'Carte d\'identité',
      requiredType: 'Carte d\'identité recto',
      size: 1024000,
      uploadDate: '2024-01-15',
      file: new File([], 'carte_identite.pdf')
    },
    {
      id: '2',
      name: 'justificatif_revenus.pdf',
      type: 'Justificatif de revenus',
      requiredType: 'Justificatif de revenus',
      size: 2048000,
      uploadDate: '2024-01-20',
      file: new File([], 'justificatif_revenus.pdf')
    }
  ]);

  const [dragOver, setDragOver] = useState(false);
  const [dragOverDocument, setDragOverDocument] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const documentInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const requiredDocuments: RequiredDocument[] = [
    { type: 'Carte d\'identité recto', label: 'Carte d\'identité (recto)' },
    { type: 'Carte d\'identité verso', label: 'Carte d\'identité (verso)' },
    { type: 'Attestation IFU', label: 'Attestation IFU de commerce' },
    { type: 'Registre de commerce', label: 'Registre de commerce' },
    { type: 'Justificatif de revenus', label: 'Justificatif de revenus' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        toast({
          title: "Erreur",
          description: "Veuillez sélectionner un fichier JPG ou PNG.",
          variant: "destructive"
        });
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      setProfilePicture(imageUrl);
      toast({
        title: "Photo téléversée",
        description: "Votre photo de profil a été mise à jour."
      });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const triggerDocumentInput = (type: string) => {
    documentInputRefs.current[type]?.click();
  };

  const handleDrop = (e: React.DragEvent, requiredType?: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    setDragOverDocument(null);
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files, requiredType || 'Document KYC');
  };

  const handleFileUpload = (files: File[], requiredType: string) => {
    setUploading(requiredType);
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    const newDocuments = files
      .filter(file => validTypes.includes(file.type))
      .map(file => ({
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: 'Document KYC',
        requiredType: requiredType !== 'Document KYC' ? requiredType : determineRequiredType(file.name),
        size: file.size,
        uploadDate: new Date().toISOString().split('T')[0],
        file
      }));

    if (newDocuments.length === 0) {
      setUploading(null);
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner des fichiers PDF, JPG ou PNG.",
        variant: "destructive"
      });
      return;
    }

    setTimeout(() => {
      setDocuments(prev => [...prev, ...newDocuments]);
      setUploading(null);
      toast({
        title: "Documents ajoutés",
        description: `${newDocuments.length} document(s) téléversé(s) avec succès : ${newDocuments.map(doc => doc.requiredType).join(', ')}`
      });
    }, 1000);
  };

  const handleDocumentInputChange = (e: React.ChangeEvent<HTMLInputElement>, requiredType: string) => {
    if (e.target.files) {
      handleFileUpload(Array.from(e.target.files), requiredType);
    }
  };

  const determineRequiredType = (fileName: string): string => {
    const lowerName = fileName.toLowerCase();
    if (lowerName.includes('recto')) return 'Carte d\'identité recto';
    if (lowerName.includes('verso')) return 'Carte d\'identité verso';
    if (lowerName.includes('ifu')) return 'Attestation IFU';
    if (lowerName.includes('registre') || lowerName.includes('commerce')) return 'Registre de commerce';
    if (lowerName.includes('revenus') || lowerName.includes('salaire')) return 'Justificatif de revenus';
    return 'Document KYC';
  };

  const removeDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    toast({
      title: "Document supprimé",
      description: "Le document a été retiré de votre profil"
    });
  };

  const saveProfile = () => {
    toast({
      title: "Profil sauvegardé",
      description: "Vos modifications, y compris la photo de profil, ont été enregistrées avec succès"
    });
  };

  const isDocumentUploaded = (requiredType: string) => {
    return documents.some(doc => doc.requiredType === requiredType);
  };

  const handlePreview = (file: File) => {
    setPreviewLoading(true);
    setTimeout(() => {
      setPreviewLoading(false);
    }, 500);
  };

  const handleSubmitDocuments = () => {
    if (documents.length < 3) {
      toast({
        title: "Erreur",
        description: "Vous devez téléverser au moins 3 documents pour soumettre.",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setDocuments([]); // Clear documents after submission
      toast({
        title: "Documents soumis",
        description: "Vos documents ont été envoyés pour vérification. Vous serez notifié du résultat."
      });
    }, 1000); // Simulate API call
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Modifier mon profil</h1>
        <p className="text-muted-foreground">Gérez vos informations personnelles et documents</p>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="personal">Informations personnelles</TabsTrigger>
          <TabsTrigger value="documents">Documents KYC</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Photo de profil
              </CardTitle>
              <CardDescription>Changez votre photo de profil</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profilePicture} />
                <AvatarFallback className="text-lg">
                  {profileData.firstName[0]}{profileData.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/jpeg,image/png"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                  aria-label="Téléverser une photo de profil"
                />
                <Button variant="outline" onClick={triggerFileInput}>
                  <Camera className="h-4 w-4 mr-2" />
                  Changer la photo
                </Button>
              </div>
            </CardContent>
          </Card>

          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800 font-semibold">Important</AlertTitle>
            <AlertDescription className="text-blue-700">
              La photo de profil doit être une photo prise de face, en lumière, montrant clairement votre visage. Elle sera prise en compte pour l'examination et la validation de votre profil.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>Modifiez vos informations de base</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Adresse</Label>
                <Input
                  id="address"
                  value={profileData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city">Ville</Label>
                  <Input
                    id="city"
                    value={profileData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Code postal</Label>
                  <Input
                    id="postalCode"
                    value={profileData.postalCode}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Date de naissance</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={profileData.birthDate}
                    onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthPlace">Pays et lieu de naissance</Label>
                  <Input
                    id="birthPlace"
                    value={profileData.birthPlace}
                    onChange={(e) => handleInputChange('birthPlace', e.target.value)}
                    placeholder="Ex: France, Paris"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informations professionnelles</CardTitle>
              <CardDescription>Votre situation professionnelle</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="profession">Profession</Label>
                  <Input
                    id="profession"
                    value={profileData.profession}
                    onChange={(e) => handleInputChange('profession', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employer">Employeur</Label>
                  <Input
                    id="employer"
                    value={profileData.employer}
                    onChange={(e) => handleInputChange('employer', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlyIncome">Revenus mensuels (XOF)</Label>
                <Input
                  id="monthlyIncome"
                  type="number"
                  value={profileData.monthlyIncome}
                  onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={saveProfile} size="lg">
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder les modifications
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertTitle className="text-blue-800 font-semibold">Important</AlertTitle>
            <AlertDescription className="text-blue-700">
              Veuillez téléverser votre carte d'identité en recto-verso ainsi que votre attestation IFU de commerce ou registre de commerce ou votre justificatif de revenus.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Télécharger des documents
              </CardTitle>
              <CardDescription>
                Glissez-déposez vos fichiers sur un document spécifique ou dans la zone générale
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`file-upload-area p-6 border-2 border-dashed border-border rounded-lg transition-all duration-300 ${dragOver ? 'bg-blue-100 border-primary-500 animate-pulse' : 'bg-gray-50'}`}
                onDrop={(e) => handleDrop(e)}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                aria-label="Zone de téléversement générale des documents"
              >
                <div className="text-center mb-4">
                  <Upload
                    className={`h-10 w-10 text-primary mx-auto mb-2 transition-transform duration-300 ${dragOver ? 'scale-110' : ''}`}
                  />
                  <p className="text-sm text-muted-foreground">
                    Glissez vos documents ici ou sur un document ci-dessous, ou{' '}
                    <span
                      className="text-primary cursor-pointer hover:underline"
                      onClick={() => triggerDocumentInput('Document KYC')}
                    >
                      cliquez pour parcourir
                    </span>
                    <br />
                    PDF, JPG, PNG acceptés
                  </p>
                </div>
                <div className="space-y-3">
                  {requiredDocuments.map((doc) => (
                    <div
                      key={doc.type}
                      className={`flex items-center justify-between p-3 bg-white border rounded-md cursor-pointer transition-colors duration-200 ${dragOverDocument === doc.type ? 'bg-blue-100 border-primary-500' : 'hover:bg-gray-100'}`}
                      onDrop={(e) => handleDrop(e, doc.type)}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setDragOverDocument(doc.type);
                      }}
                      onDragLeave={(e) => {
                        e.stopPropagation();
                        setDragOverDocument(null);
                      }}
                      onClick={() => triggerDocumentInput(doc.type)}
                      aria-label={`Téléverser ${doc.label}`}
                      aria-dropeffect="move"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium text-gray-700">{doc.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {uploading === doc.type ? (
                          <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                        ) : isDocumentUploaded(doc.type) ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <input
                          type="file"
                          ref={(el) => (documentInputRefs.current[doc.type] = el)}
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleDocumentInputChange(e, doc.type)}
                          className="hidden"
                          aria-label={`Téléverser ${doc.label}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <input
                  type="file"
                  ref={(el) => (documentInputRefs.current['Document KYC'] = el)}
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleDocumentInputChange(e, 'Document KYC')}
                  className="hidden"
                  aria-label="Téléverser un document général"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documents téléchargés</CardTitle>
              <CardDescription>Gérez vos documents KYC</CardDescription>
            </CardHeader>
            <CardContent>
              {documents.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Aucun document téléchargé
                </p>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{doc.requiredType}</span>
                            <span>•</span>
                            <span>{(doc.size / 1024 / 1024).toFixed(2)} MB</span>
                            <span>•</span>
                            <span>{new Date(doc.uploadDate).toLocaleDateString('fr-FR')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePreview(doc.file)}
                              aria-label={`Voir l'aperçu de ${doc.name}`}
                            >
                              Aperçu
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px] bg-blue-50 border-primary-500">
                            <DialogHeader>
                              <DialogTitle className="text-primary-700">{doc.name}</DialogTitle>
                            </DialogHeader>
                            <div className="mt-4 flex justify-center items-center h-[400px]">
                              {previewLoading ? (
                                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                              ) : ['image/jpeg', 'image/png'].includes(doc.file.type) ? (
                                <img
                                  src={URL.createObjectURL(doc.file)}
                                  alt={`Aperçu de ${doc.name}`}
                                  className="max-w-full max-h-full object-contain rounded-md"
                                />
                              ) : doc.file.type === 'application/pdf' ? (
                                <iframe
                                  src={URL.createObjectURL(doc.file)}
                                  title={`Aperçu de ${doc.name}`}
                                  className="w-full h-full border-0"
                                />
                              ) : (
                                <p className="text-muted-foreground">Aperçu non disponible</p>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeDocument(doc.id)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          aria-label={`Supprimer ${doc.name}`}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button
                      onClick={handleSubmitDocuments}
                      size="lg"
                      disabled={documents.length < 3 || submitting}
                      aria-label="Soumettre les documents pour vérification"
                      aria-disabled={documents.length < 3 || submitting}
                      className="flex items-center gap-2"
                    >
                      {submitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                      Soumettre mes pièces
                    </Button>
                  </span>
                </TooltipTrigger>
                {documents.length < 3 && (
                  <TooltipContent>
                    <p>Vous devez téléverser au moins 3 documents pour soumettre.</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileEdit;