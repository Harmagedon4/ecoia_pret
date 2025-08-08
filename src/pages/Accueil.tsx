import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, FileText, Calculator, HelpCircle, Calendar, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const Accueil = () => {
  // Loan Simulator State
  const [amount, setAmount] = useState(1000000); // Realistic default: 5,000,000 XOF
  const [duration, setDuration] = useState(84);
  const [rateType, setRateType] = useState('fixe');
  const [purpose, setPurpose] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState('N/A');
  const [error, setError] = useState('');
  const indicativeRate = 0.03; // Aligné avec FaireDemande (3%)

  // Upcoming Payments Modal State
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Stats and Payments Data (Updated for 2025, XOF)
  const stats = {
    totalDue: 9500000, // Realistic total due for 2 loans
    activeLoans: 2,
    monthlyPayments: 140000, // Sum of monthly payments for loans
    nextPayment: '2025-09-15',
  };

  const recentLoans = [
    { id: 1, type: 'Panneau solaire', amount: 4500000, status: 'actif', progress: 45 },
    { id: 2, type: 'Véhicule électrique', amount: 5000000, status: 'en cours', progress: 0 },
  ];

  const upcomingPayments = [
    { date: '2025-09-15', amount: 70000, type: 'Panneau solaire' },
    { date: '2025-09-15', amount: 70000, type: 'Véhicule électrique' },
    { date: '2025-10-15', amount: 70000, type: 'Panneau solaire' },
  ];

  // Loan Calculator Logic (aligned with FaireDemande)
  useEffect(() => {
    if (!amount || !duration || amount < 10000 || amount > 50000000 || duration < 3 || duration > 300) {
      setError(
        !amount || !duration
          ? 'Le montant et la durée doivent être supérieurs à 0.'
          : amount < 10000 || amount > 50000000
            ? 'Le montant doit être entre 10,000 et 50,000,000 XOF.'
            : 'La durée doit être entre 3 et 300 mois.'
      );
      setMonthlyPayment('N/A');
      return;
    }
    setError('');
    const monthlyRate = indicativeRate / 12;
    const payment = amount * (monthlyRate * Math.pow(1 + monthlyRate, duration)) / (Math.pow(1 + monthlyRate, duration) - 1);
    setMonthlyPayment(Math.round(payment).toLocaleString() + ' XOF');
  }, [amount, duration]);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-muted-foreground">Bienvenue sur votre espace ECOIA</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Montant total dû</CardTitle>
            <span className="text-sm text-muted-foreground">XOF</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalDue.toLocaleString()} XOF</div>
            <p className="text-xs text-muted-foreground">Sur tous vos prêts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prêts actifs</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeLoans}</div>
            <p className="text-xs text-muted-foreground">En cours de remboursement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mensualité totale</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.monthlyPayments.toLocaleString()} XOF</div>
            <p className="text-xs text-muted-foreground">Prochain paiement le {stats.nextPayment}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progression</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">23%</div>
            <p className="text-xs text-muted-foreground">Remboursement moyen</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>Accédez rapidement à vos fonctionnalités principales</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Button
            asChild
            variant="outline"
            className="h-auto flex flex-col items-center p-4 space-y-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            <Link to="/faire-demande">
              <FileText className="h-6 w-6 text-gray-600" />
              <span className="text-sm font-medium text-gray-800">Nouveau prêt</span>
            </Link>
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="h-auto flex flex-col items-center p-4 space-y-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <Calculator className="h-6 w-6 text-gray-600" />
                <span className="text-sm font-medium text-gray-800">Simulateur</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md p-6 bg-white rounded-lg shadow-lg">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  Simulateur de prêt
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-500">
                  Calculez vos mensualités pour un futur prêt écologique
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                    Montant demandé *
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="10000"
                      max="50000000"
                      step="10000"
                    />
                    <span className="px-3 py-2 bg-gray-100 text-gray-600 rounded-md text-sm">
                      XOF
                    </span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                    Durée du prêt *
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="duration"
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="3"
                      max="300"
                    />
                    <span className="px-3 py-2 bg-gray-100 text-gray-600 rounded-md text-sm">
                      mois
                    </span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
                    Objet du prêt *
                  </Label>
                  <Select value={purpose} onValueChange={setPurpose}>
                    <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home">Achat immobilier</SelectItem>
                      <SelectItem value="car">Achat véhicule</SelectItem>
                      <SelectItem value="renovation">Travaux/Rénovation</SelectItem>
                      <SelectItem value="personal">Personnel</SelectItem>
                      <SelectItem value="business">Professionnel</SelectItem>
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-1">
                    Type de taux préféré *
                  </Label>
                  <RadioGroup
                    value={rateType}
                    onValueChange={setRateType}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fixe" id="fixe" />
                      <Label htmlFor="fixe" className="text-sm text-gray-700">
                        Taux fixe
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="variable" id="variable" />
                      <Label htmlFor="variable" className="text-sm text-gray-700">
                        Taux variable
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {error ? (
                  <div className="p-4 bg-red-50 rounded-md">
                    <p className="text-sm font-semibold text-red-800">{error}</p>
                  </div>
                ) : (
                  <div className="p-4 bg-green-50 rounded-md">
                    <p className="text-sm font-semibold text-green-800">
                      Mensualité estimée :
                    </p>
                    <p className="text-lg font-bold text-green-600">
                      {monthlyPayment}/mois
                    </p>
                    <p className="text-xs text-gray-500 mt-1">*Taux indicatif 3%</p>
                  </div>
                )}
              </div>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                  aria-label="Fermer la fenêtre du simulateur"
                >
                  Fermer
                </Button>
              </DialogClose>
            </DialogContent>
          </Dialog>

          <Button
            asChild
            variant="outline"
            className="h-auto flex flex-col items-center p-4 space-y-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            <Link to="/methode-paiement">
              <CreditCard className="h-6 w-6 text-gray-600" />
              <span className="text-sm font-medium text-gray-800">Paiement</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="h-auto flex flex-col items-center p-4 space-y-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
          >
            <Link to="/support">
              <HelpCircle className="h-6 w-6 text-gray-600" />
              <span className="text-sm font-medium text-gray-800">Support</span>
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Recent Loans */}
      <Card>
        <CardHeader>
          <CardTitle>Mes prêts récents</CardTitle>
          <CardDescription>État de vos demandes et prêts en cours</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentLoans.map((loan) => (
              <div key={loan.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <p className="font-medium text-gray-900">{loan.type}</p>
                  <p className="text-sm text-muted-foreground">{loan.amount.toLocaleString()} XOF</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={loan.status === 'actif' ? 'default' : 'secondary'}>
                    {loan.status}
                  </Badge>
                  {loan.status === 'actif' && (
                    <span className="text-sm text-muted-foreground">{loan.progress}%</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Button asChild variant="outline" className="w-full rounded-lg">
              <Link to="/liste-demande">Voir tous mes prêts</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Payments Modal */}
      <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
        <DialogTrigger asChild>
          <Card className="cursor-pointer hover:bg-gray-50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-gray-600" />
                Échéances à venir
              </CardTitle>
              <CardDescription>Vos prochains paiements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {upcomingPayments.slice(0, 2).map((payment, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-gray-900">{payment.type}</span>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{payment.amount.toLocaleString()} XOF</p>
                      <p className="text-xs text-muted-foreground">{payment.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md p-6 bg-white rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">
              Calendrier des échéances
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              Consultez toutes vos échéances de paiement
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {upcomingPayments.map((payment, index) => (
              <div key={index} className="flex justify-between items-center p-3 border rounded-md">
                <div>
                  <p className="font-medium text-gray-900">{payment.type}</p>
                  <p className="text-sm text-muted-foreground">{payment.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">{payment.amount.toLocaleString()} XOF</p>
                </div>
              </div>
            ))}
          </div>
          <DialogClose asChild>
            <Button
              variant="outline"
              className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              aria-label="Fermer la fenêtre des échéances"
            >
              Fermer
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Accueil;