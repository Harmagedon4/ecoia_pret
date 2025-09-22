import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HelpCircle, Send, Phone, Mail, MessageSquare } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

const Support: React.FC = () => {
  const [formData, setFormData] = useState({
    subject: '',
    category: '',
    message: '',
    email: '',
    priority: 'normal'
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const submitTicket = async () => {
    if (!formData.subject || !formData.message || !formData.email) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    try {
      const res = await fetch("https://ecoia-pret-backend.vercel.app/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        toast({
          title: "Demande envoyée ✅",
          description: "Nous vous avons envoyé un accusé de réception par email."
        });

        // Reset form
        setFormData({
          subject: '',
          category: '',
          message: '',
          email: '',
          priority: 'normal'
        });
      } else {
        toast({
          title: "Erreur",
          description: data.message || "Impossible d'envoyer la demande",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Erreur serveur",
        description: "Veuillez réessayer plus tard",
        variant: "destructive"
      });
    }
  };


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Support client</h1>
        <p className="text-muted-foreground">Nous sommes là pour vous aider</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Contactez-nous</CardTitle>
              <CardDescription>Décrivez votre problème et nous vous aiderons rapidement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie</Label>
                  <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="loan">Question sur un prêt</SelectItem>
                      <SelectItem value="payment">Problème de paiement</SelectItem>
                      <SelectItem value="account">Compte utilisateur</SelectItem>
                      <SelectItem value="technical">Problème technique</SelectItem>
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Sujet *</Label>
                <Input
                  id="subject"
                  placeholder="Résumez votre demande"
                  value={formData.subject}
                  onChange={(e) => handleChange('subject', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  placeholder="Décrivez votre problème en détail..."
                  rows={6}
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                />
              </div>

              <Button onClick={submitTicket} className="w-full" size="lg">
                <Send className="h-4 w-4 mr-2" />
                Envoyer la demande
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" />
                Contact direct
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium">+229 0198017676</p>
                  <p className="text-sm text-muted-foreground">Lun-Ven 9h-17h</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium">support@ecoia.io</p>
                  <p className="text-sm text-muted-foreground">Réponse sous 24h-48h</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>FAQ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="font-medium text-sm">Comment faire une demande de prêt ?</p>
                <p className="text-xs text-muted-foreground">Utilisez notre formulaire en ligne...</p>
              </div>
              <div>
                <p className="font-medium text-sm">Quels sont les taux d'intérêt ?</p>
                <p className="text-xs text-muted-foreground">Nos taux commencent à 3%...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Support;