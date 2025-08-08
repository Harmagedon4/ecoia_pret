import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, CreditCard, Smartphone, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

const MethodePaiement: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [amount, setAmount] = useState('');
  const [receipt, setReceipt] = useState<File | null>(null);
  const [isLate, setIsLate] = useState(false);

  const activeLoans = [
    {
      id: 1,
      type: 'Panneau solaire',
      monthlyAmount: 425,
      dueDate: '2024-08-15',
      isOverdue: false
    },
    {
      id: 2,
      type: 'Véhicule électrique',
      monthlyAmount: 425,
      dueDate: '2024-08-10',
      isOverdue: true,
      daysLate: 5
    }
  ];

  const paymentMethods = [
    { id: 'momo', name: 'Mobile Money (MTN)', icon: Smartphone, color: 'bg-yellow-500' },
    { id: 'orange', name: 'Moov Money (MOOV)', icon: Smartphone, color: 'bg-orange-500' },
    { id: 'wave', name: 'Celtis Cash (CELTIS)', icon: Smartphone, color: 'bg-blue-500' }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setReceipt(file);
      toast({
        title: "Reçu téléchargé",
        description: `${file.name} a été ajouté avec succès`
      });
    }
  };

  const submitPayment = () => {
    if (!selectedMethod || !amount || !receipt) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Paiement enregistré",
      description: "Votre paiement sera vérifié sous 24h"
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Méthodes de paiement</h1>
        <p className="text-muted-foreground">Gérez vos remboursements de prêt</p>
      </div>

      {/* Late Payment Alert */}
      {activeLoans.some(loan => loan.isOverdue) && (
        <Alert className="border-destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Vous avez des paiements en retard. Veuillez effectuer vos remboursements rapidement pour éviter des frais supplémentaires.
          </AlertDescription>
        </Alert>
      )}

      {/* Active Loans */}
      <Card>
        <CardHeader>
          <CardTitle>Échéances en cours</CardTitle>
          <CardDescription>Vos prêts nécessitant un remboursement</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeLoans.map((loan) => (
            <div key={loan.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{loan.type}</p>
                  {loan.isOverdue ? (
                    <Badge variant="destructive" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      Retard {loan.daysLate} jours
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      À jour
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Échéance: {new Date(loan.dueDate).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">{loan.monthlyAmount} XOF</p>
                <p className="text-xs text-muted-foreground">Mensualité</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Payment Form */}
      <Card>
        <CardHeader>
          <CardTitle>Effectuer un paiement</CardTitle>
          <CardDescription>Choisissez votre méthode de paiement et téléchargez votre reçu</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Payment Methods */}
          <div className="space-y-3">
            <Label>Méthode de paiement</Label>
            <div className="grid gap-3 md:grid-cols-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedMethod(method.id)}
                  className={`p-4 border rounded-lg text-left transition-all hover:border-primary ${
                    selectedMethod === method.id ? 'border-primary bg-primary/5' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded ${method.color} text-white`}>
                      <method.icon className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{method.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Montant du paiement</Label>
            <Input
              id="amount"
              type="number"
              placeholder="425.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Montant total dû: {activeLoans.reduce((sum, loan) => sum + loan.monthlyAmount, 0)} XOF
            </p>
          </div>

          {/* Receipt Upload */}
          <div className="space-y-3">
            <Label>Reçu de paiement</Label>
            <div className="file-upload-area">
              <input
                type="file"
                id="receiptUpload"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="receiptUpload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
              >
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground text-center">
                  Téléchargez votre reçu de paiement<br />
                  PDF, JPG, PNG acceptés
                </p>
              </label>
            </div>
            
            {receipt && (
              <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{receipt.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(receipt.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            )}
          </div>

          <Button onClick={submitPayment} className="w-full" size="lg">
            Soumettre le paiement
          </Button>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Historique des paiements</CardTitle>
          <CardDescription>Vos derniers remboursements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Panneau solaire</p>
                <p className="text-sm text-muted-foreground">15 juillet 2024</p>
              </div>
              <div className="text-right">
                <p className="font-medium">425 XOF</p>
                <Badge variant="default" className="text-xs">Validé</Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">Véhicule électrique</p>
                <p className="text-sm text-muted-foreground">15 juin 2024</p>
              </div>
              <div className="text-right">
                <p className="font-medium">425 XOF</p>
                <Badge variant="secondary" className="text-xs">En vérification</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MethodePaiement;