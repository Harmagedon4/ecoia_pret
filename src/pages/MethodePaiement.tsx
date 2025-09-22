import React, { useState, useEffect } from "react";
import api from '@/api';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Smartphone, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Paiement {
  id: number;
  method: string;
  amount: number;
  receipt: string;
  status: "Validé" | "En vérification" | "En retard";
  date: string;
}

interface Methode {
  id: number;
  nom: string;
  details: string;
}

const methodStyles: Record<string, { color: string; Icon: React.ComponentType<any> }> = {
  "Mobile Money (MTN)": { color: "bg-yellow-500", Icon: Smartphone },
  "Moov Money (MOOV)": { color: "bg-orange-500", Icon: Smartphone },
  "Celtis Cash (CELTIS)": { color: "bg-blue-500", Icon: Smartphone }
};

const MethodePaiement: React.FC = () => {
  const [methodes, setMethodes] = useState<Methode[]>([]);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [amount, setAmount] = useState("");
  const [receipt, setReceipt] = useState<File | null>(null);
  const [paiements, setPaiements] = useState<Paiement[]>([]);
  const [loading, setLoading] = useState(false);

  // Historique des paiements
  const fetchPaiements = async () => {
    try {
      const res = await api.get('/paiements');
      setPaiements(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPaiements();
    // Méthodes de paiement fixes (ou récupérer depuis API si existant)
    setMethodes([
      { id: 1, nom: "Mobile Money (MTN)", details: "MTN Mobile Money" },
      { id: 2, nom: "Moov Money (MOOV)", details: "Moov Mobile Money" },
      { id: 3, nom: "Celtis Cash (CELTIS)", details: "Celtis Cash" }
    ]);
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceipt(file);
      toast({ title: "Reçu téléchargé", description: `${file.name} ajouté` });
    }
  };

  const submitPayment = async () => {
    if (!selectedMethod || !amount || !receipt) {
      toast({ title: "Infos manquantes", description: "Remplissez tous les champs", variant: "destructive" });
      return;
    }

    const formData = new FormData();
    formData.append("method", selectedMethod);
    formData.append("amount", amount);
    formData.append("receipt", receipt);

    setLoading(true);
    try {
      await api.post('/paiements', formData, { headers: { "Content-Type": "multipart/form-data" } });
      toast({ title: "Paiement enregistré", description: "Vérification sous 24h" });
      setAmount(""); setReceipt(null); setSelectedMethod("");
      fetchPaiements();
    } catch (err) {
      toast({ title: "Erreur", description: "Impossible d'enregistrer le paiement", variant: "destructive" });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Méthodes de paiement</h1>

      {paiements.some(p => p.status === "En retard") && (
        <Alert className="border-destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>Vous avez des paiements en retard.</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Effectuer un paiement</CardTitle>
          <CardDescription>Choisissez une méthode et téléchargez votre reçu</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            {methodes.map(m => {
              const style = methodStyles[m.nom] || { color: "bg-gray-500", Icon: Smartphone };
              return (
                <button key={m.id} onClick={() => setSelectedMethod(m.nom)}
                  className={`p-4 border rounded-lg text-left hover:border-primary ${selectedMethod===m.nom ? 'border-primary bg-primary/5':''}`}>
                  <div className="flex items-center gap-2">
                    <style.Icon className={`h-4 w-4 text-white p-1 rounded ${style.color}`} />
                    {m.nom}
                  </div>
                  <p className="text-xs text-muted-foreground">{m.details}</p>
                </button>
              );
            })}
          </div>

          <Label>Montant</Label>
          <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} />

          <Label>Reçu</Label>
          <input type="file" accept=".pdf,.jpg,.png" onChange={handleFileUpload} />
          {receipt && <p>{receipt.name}</p>}

          <Button onClick={submitPayment} disabled={loading} className="w-full">
            {loading ? "Envoi..." : "Soumettre le paiement"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Historique des paiements</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {paiements.length === 0 ? <p>Aucun paiement enregistré</p> :
            paiements.map(p => {
              let BadgeIcon = CheckCircle;
              let badgeColor: "default"|"secondary"|"destructive" = "default";
              if(p.status==="En vérification"){ BadgeIcon=Clock; badgeColor="secondary"; }
              if(p.status==="En retard"){ BadgeIcon=AlertTriangle; badgeColor="destructive"; }

              return (
                <div key={p.id} className="flex justify-between border rounded-lg p-3 items-center">
                  <div>
                    <p className="font-medium">{p.method}</p>
                    <p className="text-sm text-muted-foreground">{new Date(p.date).toLocaleDateString("fr-FR")}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{p.amount} XOF</p>
                    <Badge variant={badgeColor} className="text-xs flex items-center gap-1">
                      <BadgeIcon className="h-3 w-3" />{p.status}
                    </Badge>
                  </div>
                </div>
              );
            })
          }
        </CardContent>
      </Card>
    </div>
  );
};

export default MethodePaiement;
