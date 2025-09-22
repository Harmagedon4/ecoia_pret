import React, { useEffect, useState } from 'react';
import api from '@/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Phone, MapPin, Briefcase, Edit, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";

interface Document {
  name?: string;
  public_id?: string;
  type?: string;
  size?: number;
  uploadDate?: string;
}

interface UserProfile {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  birthDate?: string;
  birthPlace?: string;
  profession?: string;
  employer?: string;
  monthlyIncome?: number;
  memberSince?: string;
  profilePicture?: string;
  documents?: Document[];
}

const ProfileView: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---------------- Password Modal State ----------------
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState(1); // Step 1 = demander code, Step 2 = vérifier code + changer mdp
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile');
        setUser(res.data);
        setEmail(res.data.email || '');
      } catch (err) {
        console.error(err);
        setError('Impossible de charger le profil');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <p>Chargement du profil...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!user) return <p>Aucune donnée disponible</p>;

  const [firstName, lastName] = user.name ? user.name.split(' ') : ["", ""];

  // ---------------- Document Functions ----------------
  const openDocument = async (index: number) => {
    try {
      const res = await api.get(`/profile/documents/${index}/url`);
      const signedUrl = res.data.url;

      const fileRes = await fetch(signedUrl);
      const blob = await fileRes.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      window.open(blobUrl, "_blank");
    } catch (err) {
      console.error(err);
      alert("Impossible d'ouvrir le document");
    }
  };

  const downloadDocument = async (index: number) => {
    try {
      const res = await api.get(`/profile/documents/${index}/url`);
      const signedUrl = res.data.url;

      const fileRes = await fetch(signedUrl);
      const blob = await fileRes.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = user.documents![index].name;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error(err);
      alert("Impossible de télécharger le document");
    }
  };

  // ---------------- Account Actions ----------------
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/connexion';
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("Voulez-vous vraiment supprimer votre compte ?");
    if (!confirmed) return;

    try {
      const res = await api.delete('/profile/delete-account');
      if (res.data.success) {
        alert("Compte supprimé avec succès !");
        handleLogout();
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression du compte");
    }
  };

  // ---------------- Password Modal Functions ----------------
  const requestCode = async () => {
    if (!email) return setModalMessage('Email requis');
    setModalLoading(true);
    try {
      await api.post('/profile/request-password-change', { email });
      setModalMessage('Code envoyé par email');
      setStep(2);
    } catch (err: any) {
      setModalMessage(err.response?.data?.message || 'Erreur lors de la demande de code');
    } finally {
      setModalLoading(false);
    }
  };

  const verifyAndChangePassword = async () => {
    if (!code || !newPassword || !confirmPassword) return setModalMessage('Tous les champs sont requis');
    if (newPassword !== confirmPassword) return setModalMessage('Les mots de passe ne correspondent pas');

    setModalLoading(true);
    try {
      await api.post('/profile/verify-change-password', { email, code, newPassword, confirmPassword });
      setModalMessage('Mot de passe changé avec succès !');
      setStep(1);
      setCode('');
      setNewPassword('');
      setConfirmPassword('');
      setModalOpen(false);
    } catch (err: any) {
      setModalMessage(err.response?.data?.message || 'Erreur lors du changement de mot de passe');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Mon profil</h1>
          <p className="text-muted-foreground">Consultez vos informations personnelles</p>
        </div>
        <Button asChild>
          <Link to="/profile-edit">
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Link>
        </Button>
      </div>

      {/* AVATAR + NOM */}
      <Card>
        <CardContent className="flex items-center gap-4 mb-6">
          <Avatar className="h-20 w-20">
            {user.profilePicture ? (
              <AvatarImage src={user.profilePicture} />
            ) : (
              <AvatarFallback>{firstName[0]}{lastName[0]}</AvatarFallback>
            )}
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{firstName} {lastName}</h2>
            <p className="text-muted-foreground">
              Membre depuis {user.memberSince ? new Date(user.memberSince).toLocaleDateString('fr-FR') : "-"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* INFOS PERSONNELLES */}
      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
          <CardDescription>Coordonnées et identité</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {user.email && <InfoRow icon={<Mail className="h-4 w-4 text-muted-foreground" />} label="Email" value={user.email} />}
          {user.phone && <InfoRow icon={<Phone className="h-4 w-4 text-muted-foreground" />} label="Téléphone" value={user.phone} />}
          {user.address && <InfoRow icon={<MapPin className="h-4 w-4 text-muted-foreground" />} label="Adresse" value={user.address} />}
          {user.city && <InfoRow icon={<MapPin className="h-4 w-4 text-muted-foreground" />} label="Ville" value={user.city} />}
          {user.postalCode && <InfoRow icon={<MapPin className="h-4 w-4 text-muted-foreground" />} label="Code postal" value={user.postalCode} />}
          {user.birthDate && <InfoRow icon={<User className="h-4 w-4 text-muted-foreground" />} label="Date de naissance" value={new Date(user.birthDate).toLocaleDateString('fr-FR')} />}
          {user.birthPlace && <InfoRow icon={<User className="h-4 w-4 text-muted-foreground" />} label="Lieu de naissance" value={user.birthPlace} />}
        </CardContent>
      </Card>

      {/* INFOS PROFESSIONNELLES */}
      <Card>
        <CardHeader>
          <CardTitle>Informations professionnelles</CardTitle>
          <CardDescription>Détails sur votre emploi</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {user.profession && <InfoRow icon={<Briefcase className="h-4 w-4 text-muted-foreground" />} label="Profession" value={user.profession} />}
          {user.employer && <InfoRow icon={<User className="h-4 w-4 text-muted-foreground" />} label="Employeur" value={user.employer} />}
          {user.monthlyIncome !== undefined && <InfoRow icon={<span className="h-4 w-4 text-muted-foreground flex items-center justify-center text-xs">CFA</span>} label="Revenus mensuels" value={`${user.monthlyIncome.toLocaleString()} XOF`} />}
        </CardContent>
      </Card>

      {/* DOCUMENTS */}
      {user.documents && user.documents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Documents KYC</CardTitle>
            <CardDescription>Vos documents téléversés</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {user.documents.map((doc, index) => (
              <div key={index} className="flex items-center gap-2">
                <button
                  className="text-blue-600 underline"
                  onClick={() => openDocument(index)}
                >
                  {doc.name}
                </button>
                <Button size="sm" onClick={() => downloadDocument(index)}>
                  Télécharger
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* GESTION DU COMPTE */}
      <Card>
        <CardHeader>
          <CardTitle>Gestion du compte</CardTitle>
          <CardDescription>Actions importantes pour votre compte</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button variant="destructive" onClick={handleLogout}>Se déconnecter</Button>

          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary">
                <Lock className="h-4 w-4 mr-2" /> Changer le mot de passe
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Changer le mot de passe</DialogTitle>
                {modalMessage && <p className="text-red-500">{modalMessage}</p>}
              </DialogHeader>
              {step === 1 && (
                <div className="flex flex-col gap-2 mt-2">
                  <input type="email" placeholder="Votre email" value={email} onChange={(e) => setEmail(e.target.value)} className="border rounded p-2" />
                  <Button onClick={requestCode} disabled={modalLoading}>{modalLoading ? 'Envoi...' : 'Recevoir le code'}</Button>
                </div>
              )}
              {step === 2 && (
                <div className="flex flex-col gap-2 mt-2">
                  <input type="text" placeholder="Code reçu par email" value={code} onChange={(e) => setCode(e.target.value)} className="border rounded p-2" />
                  <input type="password" placeholder="Nouveau mot de passe" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="border rounded p-2" />
                  <input type="password" placeholder="Confirmer le mot de passe" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="border rounded p-2" />
                  <Button onClick={verifyAndChangePassword} disabled={modalLoading}>{modalLoading ? 'Modification...' : 'Changer le mot de passe'}</Button>
                </div>
              )}
            </DialogContent>
          </Dialog>

          <Button variant="destructive" onClick={handleDeleteAccount}>Supprimer le compte</Button>
        </CardContent>
      </Card>
    </div>
  );
};

// Petit composant helper pour afficher les lignes d'info
const InfoRow = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) => (
  <div className="flex items-center gap-3">
    {icon}
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);

export default ProfileView;
