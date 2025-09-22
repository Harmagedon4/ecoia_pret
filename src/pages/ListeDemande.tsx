import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, Download, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import api from '@/api';

const ListeDemande: React.FC = () => {
  const [demands, setDemands] = useState<any[]>([]);
  const [selectedDemand, setSelectedDemand] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDemands = async () => {
      const auth = localStorage.getItem('ecoia-auth');
      if (!auth) {
        console.warn('Aucun token trouvé, merci de vous connecter.');
        return;
      }

      try {
        const res = await api.get('/requests/list'); // token géré automatiquement
        setDemands(res.data);
      } catch (err: any) {
        console.error('Erreur récupération demandes:', err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDemands();
  }, [navigate]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approuve':
        return (
          <Badge className="bg-green-500 text-white">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approuvé
          </Badge>
        );
      case 'en_cours':
        return (
          <Badge className="bg-orange-500 text-white">
            <Clock className="h-3 w-3 mr-1" />
            En cours
          </Badge>
        );
      case 'rejete':
        return (
          <Badge className="bg-red-500 text-white">
            <XCircle className="h-3 w-3 mr-1" />
            Rejeté
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-400 text-white">
            <AlertCircle className="h-3 w-3 mr-1" />
            Inconnu
          </Badge>
        );
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

  if (loading) return <div className="text-center mt-10">Chargement des demandes...</div>;
  if (!demands.length) return <div className="text-center mt-10">Aucune demande trouvée.</div>;

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
                  <TableCell>{new Date(demand.date).toLocaleDateString('fr-FR')}</TableCell>
                  <TableCell className="font-medium">{demand.type}</TableCell>
                  <TableCell>{demand.amount.toLocaleString()} XOF</TableCell>
                  <TableCell>{getStatusBadge(demand.status)}</TableCell>
                  <TableCell>
                    {demand.status === 'approuve' && (
                      <div className="space-y-1">
                        <div className="text-sm font-medium">{demand.progress}% remboursé</div>
                        <div className="w-full bg-muted h-2 rounded-full">
                          <div className="bg-primary h-2 rounded-full" style={{ width: `${demand.progress}%` }} />
                        </div>
                      </div>
                    )}
                    {demand.status === 'en_cours' && (
                      <span className="text-sm text-muted-foreground">
                        Réponse estimée: {new Date(demand.estimatedResponse).toLocaleDateString('fr-FR')}
                      </span>
                    )}
                    {demand.status === 'rejete' && <span className="text-sm text-destructive">-</span>}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedDemand(demand)}>
                          <Eye className="h-4 w-4 mr-2" />Détails
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Détails de la demande #{demand.id}</DialogTitle>
                          <DialogDescription>Informations complètes sur votre demande de prêt</DialogDescription>
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
                              <div className="mt-1">{getStatusBadge(demand.status)}</div>
                            </div>
                          </div>

                          <div className="p-4 rounded-lg bg-muted">
                            <h4 className="font-medium mb-2">Statut détaillé</h4>
                            <p className="text-sm text-muted-foreground">{getStatusText(demand.status)}</p>
                            {demand.rejectionReason && <p className="text-sm text-destructive mt-2">Raison du rejet: {demand.rejectionReason}</p>}
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
    </div>
  );
};

export default ListeDemande;
