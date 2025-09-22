// src/pages/ProfileEdit.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Camera, Save, User, Loader2, Send } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import api from '@/api';

interface Document {
  name: string;
  path: string;
  type: string;
  size: number;
  uploadDate: string;
}

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  profession: string;
  employer: string;
  monthlyIncome: number | '';
  birthDate: string;
  birthPlace: string;
}

const ProfileEdit: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    profession: '',
    employer: '',
    monthlyIncome: '',
    birthDate: '',
    birthPlace: ''
  });

  const [profilePicture, setProfilePicture] = useState<string>('/placeholder-avatar.jpg');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ---------------- FETCH PROFILE ----------------
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile'); // <-- GET via api
        const data = res.data;

        setProfileData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          city: data.city || "",
          postalCode: data.postalCode || "",
          profession: data.profession || "",
          employer: data.employer || "",
          monthlyIncome: data.monthlyIncome ?? "",
          birthDate: data.birthDate || "",
          birthPlace: data.birthPlace || ""
        });

        setProfilePicture(data.profilePicture || '/placeholder-avatar.jpg');
        setDocuments(data.documents || []);
      } catch (err) {
        console.error(err);
        toast({
          title: "Erreur",
          description: "Impossible de charger le profil",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <p>Chargement du profil...</p>;

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    if (field === 'monthlyIncome') {
      if (!/^\d*$/.test(value)) return;
      setProfileData(prev => ({ ...prev, [field]: value === '' ? '' : parseInt(value) }));
    } else {
      setProfileData(prev => ({ ...prev, [field]: value }));
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  // ---------------- UPLOAD AVATAR ----------------
  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      toast({ title: "Erreur", description: "Fichier JPG/PNG max 5MB.", variant: "destructive" });
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    setUploading('avatar');
    try {
      const res = await api.post('/profile/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

      // Ajout d'un timestamp pour forcer le rafraîchissement de l'image
      setProfilePicture(res.data.avatarUrl + '?t=' + new Date().getTime());

      toast({ title: "Photo téléversée", description: "Votre photo de profil a été mise à jour." });
    } catch (err) {
      toast({ title: "Erreur", description: "Impossible de téléverser la photo.", variant: "destructive" });
    } finally {
      setUploading(null);
    }
  };


  // ---------------- UPLOAD DOCUMENTS ----------------
  const handleFileUpload = async (files: File[]) => {
    setUploading('documents');
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    const filtered = files.filter(f => validTypes.includes(f.type) && f.size <= 5 * 1024 * 1024);
    if (!filtered.length) {
      setUploading(null);
      toast({ title: "Erreur", description: "Fichiers non valides ou trop lourds.", variant: "destructive" });
      return;
    }

    const formData = new FormData();
    filtered.forEach(f => formData.append('documents', f));

    try {
      const res = await api.post('/profile/documents', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setDocuments(prev => [...prev, ...res.data.files]);
      toast({ title: "Documents ajoutés", description: `${res.data.files.length} document(s) téléversé(s)` });
    } catch {
      toast({ title: "Erreur", description: "Impossible de téléverser les documents", variant: "destructive" });
    } finally {
      setUploading(null);
    }
  };

  const removeDocument = async (index: number) => {
    try {
      await api.delete(`/profile/documents/${index}`);
      setDocuments(prev => prev.filter((_, i) => i !== index));
      toast({ title: "Document supprimé", description: "Le document a été retiré de votre profil" });
    } catch {
      toast({ title: "Erreur", description: "Impossible de supprimer le document", variant: "destructive" });
    }
  };

  // ---------------- SAVE PROFILE ----------------
  const saveProfile = async () => {
    setSubmitting(true);
    try {
      await api.put('/profile', profileData);
      toast({ title: "Profil sauvegardé", description: "Vos modifications ont été enregistrées" });
    } catch {
      toast({ title: "Erreur", description: "Impossible de sauvegarder le profil", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitDocuments = async () => {
    if (documents.length < 3) {
      toast({ title: "Erreur", description: "Téléversez au moins 3 documents", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      await api.post('/profile/submit');
      toast({ title: "Documents soumis", description: "Vos documents ont été envoyés pour vérification" });
    } catch {
      toast({ title: "Erreur", description: "Impossible de soumettre les documents", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Modifier mon profil</h1>
        <p className="text-muted-foreground">Gérez vos informations personnelles et documents</p>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="personal">Informations personnelles & professionnelles</TabsTrigger>
          <TabsTrigger value="documents">Documents KYC</TabsTrigger>
        </TabsList>

        {/* PERSONAL & PROFESSIONNEL */}
        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" /> Photo de profil
              </CardTitle>
              <CardDescription>Changez votre photo de profil</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profilePicture} />
                <AvatarFallback>{profileData.name ? profileData.name[0].toUpperCase() : "?"}</AvatarFallback>
              </Avatar>
              <div>
                <input type="file" ref={fileInputRef} accept="image/jpeg,image/png" onChange={handleProfilePictureChange} className="hidden" />
                <Button variant="outline" onClick={triggerFileInput} disabled={uploading === 'avatar'}>
                  {uploading === 'avatar' ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Camera className="h-4 w-4 mr-2" />}
                  Changer la photo
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Infos personnelles */}
          <Card>
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
              <CardDescription>Vos coordonnées et identité</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              {["name","email","phone","address","city","postalCode","birthDate","birthPlace"].map((field) => (
                <div key={field}>
                  <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                  <Input
                    id={field}
                    type={field==="email"?"email":field==="birthDate"?"date":"text"}
                    value={profileData[field as keyof ProfileData] ?? ""}
                    onChange={e => handleInputChange(field as keyof ProfileData, e.target.value)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Infos professionnelles */}
          <Card>
            <CardHeader>
              <CardTitle>Informations professionnelles</CardTitle>
              <CardDescription>Détails sur votre emploi</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="profession">Profession</Label>
                <Input id="profession" value={profileData.profession ?? ""} type="text" onChange={e => handleInputChange("profession", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="employer">Employeur</Label>
                <Input id="employer" value={profileData.employer ?? ""} type="text" onChange={e => handleInputChange("employer", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="monthlyIncome">Revenu mensuel</Label>
                <Input id="monthlyIncome" value={profileData.monthlyIncome ?? ""} type="number" onChange={e => handleInputChange("monthlyIncome", e.target.value)} />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={saveProfile} size="lg" disabled={submitting || uploading !== null}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Sauvegarder les modifications
            </Button>
          </div>
        </TabsContent>

        {/* DOCUMENTS */}
        <TabsContent value="documents" className="space-y-6">
          <div className="space-y-4">
            {documents.map((doc, index) => (
              <Card key={index}>
                <CardContent className="flex justify-between items-center">
                  {/* Nom du document cliquable */}
                  <a
                    href={doc.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {doc.name}
                  </a>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeDocument(index)}
                  >
                    Supprimer
                  </Button>
                </CardContent>
              </Card>
            ))}
            <input type="file" multiple onChange={e => e.target.files && handleFileUpload(Array.from(e.target.files))} disabled={uploading === 'documents'} />
          </div>

          <div className="flex justify-end">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <Button onClick={handleSubmitDocuments} size="lg" disabled={documents.length < 3 || submitting} className="flex items-center gap-2">
                      {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      Soumettre mes pièces
                    </Button>
                  </span>
                </TooltipTrigger>
                {documents.length < 3 && <TooltipContent><p>Vous devez téléverser au moins 3 documents</p></TooltipContent>}
              </Tooltip>
            </TooltipProvider>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileEdit;
