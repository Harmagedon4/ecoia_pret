import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, Download, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const ListeDemande: React.FC = () => {
  const [selectedDemand, setSelectedDemand] = useState(null);

  const demands = [
    {
      id: 1,
      date: '2024-01-15',
      type: 'Panneau solaire',
      amount: 8000,
      status: 'approuve',
      progress: 45,
      monthlyPayment: 425,
      remainingPayments: 18
    },
    {
      id: 2,
      date: '2024-02-20',
      type: 'Véhicule électrique',
      amount: 15000,
      status: 'en_cours',
      progress: 0,
      estimatedResponse: '2024-02-25'
    },
    {
      id: 3,
      date: '2024-01-05',
      type: 'Pompe à chaleur',
      amount: 6000,
      status: 'rejete',
      rejectionReason: 'Revenus insuffisants'
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approuve':
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" />Approuvé</Badge>;
      case 'en_cours':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />En cours</Badge>;
      case 'rejete':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejeté</Badge>;
      default:
        return <Badge variant="outline"><AlertCircle className="h-3 w-3 mr-1" />Inconnu</Badge>;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approuve': return 'Prêt approuvé et actif';
      case 'en_cours': return 'Demande en cours d\'analyse';
      case 'rejete': return 'Demande rejetée';
      default: return 'Statut inconnu';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mes demandes de prêt</h1>
        <p className="text-muted-foreground">Suivez l'état de toutes vos demandes</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique des demandes</CardTitle>
          <CardDescription>Toutes vos demandes de prêt écologique</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type de prêt</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Progression</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {demands.map((demand) => (
                <TableRow key={demand.id}>
                  <TableCell>
                    {new Date(demand.date).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell className="font-medium">{demand.type}</TableCell>
                  <TableCell>{demand.amount.toLocaleString()} XOF</TableCell>
                  <TableCell>
                    {getStatusBadge(demand.status)}
                  </TableCell>
                  <TableCell>
                    {demand.status === 'approuve' && (
                      <div className="space-y-1">
                        <div className="text-sm font-medium">{demand.progress}% remboursé</div>
                        <div className="w-full bg-muted h-2 rounded-full">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${demand.progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                    {demand.status === 'en_cours' && (
                      <span className="text-sm text-muted-foreground">
                        Réponse estimée: {new Date(demand.estimatedResponse).toLocaleDateString('fr-FR')}
                      </span>
                    )}
                    {demand.status === 'rejete' && (
                      <span className="text-sm text-destructive">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedDemand(demand)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Détails
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Détails de la demande #{demand.id}</DialogTitle>
                          <DialogDescription>
                            Informations complètes sur votre demande de prêt
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6">
                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Type de prêt</label>
                              <p className="font-medium">{demand.type}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Montant</label>
                              <p className="font-medium">{demand.amount.toLocaleString()} XOF</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Date de demande</label>
                              <p className="font-medium">{new Date(demand.date).toLocaleDateString('fr-FR')}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium text-muted-foreground">Statut</label>
                              <div className="mt-1">
                                {getStatusBadge(demand.status)}
                              </div>
                            </div>
                          </div>

                          <div className="p-4 rounded-lg bg-muted">
                            <h4 className="font-medium mb-2">Statut détaillé</h4>
                            <p className="text-sm text-muted-foreground">
                              {getStatusText(demand.status)}
                            </p>
                            {demand.rejectionReason && (
                              <p className="text-sm text-destructive mt-2">
                                Raison du rejet: {demand.rejectionReason}
                              </p>
                            )}
                          </div>

                          {demand.status === 'approuve' && (
                            <div className="space-y-4">
                              <h4 className="font-medium">Informations de remboursement</h4>
                              <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Mensualité</label>
                                  <p className="font-medium">{demand.monthlyPayment} XOF</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-muted-foreground">Échéances restantes</label>
                                  <p className="font-medium">{demand.remainingPayments}</p>
                                </div>
                              </div>
                              
                              <div>
                                <label className="text-sm font-medium text-muted-foreground">Progression du remboursement</label>
                                <div className="mt-2 space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span>Remboursé</span>
                                    <span>{demand.progress}%</span>
                                  </div>
                                  <div className="w-full bg-muted h-3 rounded-full">
                                    <div 
                                      className="bg-primary h-3 rounded-full transition-all duration-300" 
                                      style={{ width: `${demand.progress}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="flex gap-2">
                            <Button variant="outline" className="flex-1">
                              <Download className="h-4 w-4 mr-2" />
                              Télécharger le contrat
                            </Button>
                            {demand.status === 'approuve' && (
                              <Button variant="outline" className="flex-1">
                                <Download className="h-4 w-4 mr-2" />
                                Échéancier
                              </Button>
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Demandes totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demands.length}</div>
            <p className="text-sm text-muted-foreground">Toutes demandes confondues</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Prêts actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {demands.filter(d => d.status === 'approuve').length}
            </div>
            <p className="text-sm text-muted-foreground">En cours de remboursement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">En attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {demands.filter(d => d.status === 'en_cours').length}
            </div>
            <p className="text-sm text-muted-foreground">Analyse en cours</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ListeDemande;