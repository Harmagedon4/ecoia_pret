import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Upload, X, File, CheckCircle, Info, Calculator } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

// Définir les types pour formData et errors
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate: string;
  maritalStatus: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  profession: string;
  employer: string;
  monthlyIncome: string;
  employmentType: string;
  expenses: string;
  yearsInProfession: string;
  additionalIncome: string;
  existingMonthlyPayments: string;
  loanPurpose: string;
  loanAmount: string;
  loanDuration: string;
  preferredRate: string;
  purpose: string;
  hasIncomeProof: boolean;
  hasIdDocument: boolean;
  hasAddressProof: boolean;
  hasEmploymentProof: boolean;
}

interface Errors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  maritalStatus?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  profession?: string;
  employer?: string;
  monthlyIncome?: string;
  employmentType?: string;
  expenses?: string;
  yearsInProfession?: string;
  additionalIncome?: string;
  existingMonthlyPayments?: string;
  loanPurpose?: string;
  loanAmount?: string;
  loanDuration?: string;
  preferredRate?: string;
  purpose?: string;
  hasIncomeProof?: string;
  hasIdDocument?: string;
  hasAddressProof?: string;
  hasEmploymentProof?: string;
  tempDocument?: string;
}

interface Document {
  id: number;
  name: string;
  size: number;
  type: string;
  file: File;
  category: string;
}

const FaireDemande = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [tempDocument, setTempDocument] = useState<Document[]>([]);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    maritalStatus: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    profession: '',
    employer: '',
    monthlyIncome: '',
    employmentType: '',
    expenses: '',
    yearsInProfession: '',
    additionalIncome: '',
    existingMonthlyPayments: '',
    loanPurpose: '',
    loanAmount: '',
    loanDuration: '',
    preferredRate: '',
    purpose: '',
    hasIncomeProof: false,
    hasIdDocument: false,
    hasAddressProof: false,
    hasEmploymentProof: false
  });
  const [errors, setErrors] = useState<Errors>({});

  const steps = [
    { number: 1, title: 'Informations personnelles', description: 'Vos coordonnées' },
    { number: 2, title: 'Informations professionnelles', description: 'Votre situation professionnelle' },
    { number: 3, title: 'Informations financières', description: 'Vos revenus et charges' },
    { number: 4, title: 'Détails du prêt', description: 'Votre projet de financement' },
    { number: 5, title: 'Documents', description: 'Pièces justificatives' }
  ];

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'].includes(file.type));
    
    if (tempDocument.length + validFiles.length > 4) {
      toast({
        title: "Limite atteinte",
        description: "Maximum 4 fichiers autorisés",
        variant: "destructive"
      });
      return;
    }

    const newFiles = validFiles.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file,
      category: ''
    }));

    setTempDocument(prev => [...prev, ...newFiles]);
  };

  const handleCategoryChange = (index: number, category: string) => {
    setTempDocument(prev => prev.map((file, i) => 
      i === index ? { ...file, category } : file
    ));
  };

  const removeFile = (index: number) => {
    setTempDocument(prev => prev.filter((_, i) => i !== index));
  };

  const calculateMonthlyPayment = () => {
    const principal = parseFloat(formData.loanAmount);
    const months = parseFloat(formData.loanDuration);
    const annualRate = 0.03;
    if (!principal || !months || principal < 10000 || principal > 50000000 || months < 3 || months > 300) {
      return "N/A";
    }
    const monthlyRate = annualRate / 12;
    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(payment).toLocaleString() + " XOF";
  };

  const validateStep = (step: number) => {
    switch(step) {
      case 1:
        const newErrors1: Errors = {};
        let isValid1 = true;
        if (!formData.firstName) {
          newErrors1.firstName = "Le prénom est requis";
          isValid1 = false;
        }
        if (!formData.lastName) {
          newErrors1.lastName = "Le nom est requis";
          isValid1 = false;
        }
        if (!formData.email) {
          newErrors1.email = "L'email est requis";
          isValid1 = false;
        }
        if (!formData.phone) {
          newErrors1.phone = "Le téléphone est requis";
          isValid1 = false;
        }
        if (!formData.birthDate) {
          newErrors1.birthDate = "La date de naissance est requise";
          isValid1 = false;
        }
        if (!formData.maritalStatus) {
          newErrors1.maritalStatus = "La situation familiale est requise";
          isValid1 = false;
        }
        if (!formData.country) {
          newErrors1.country = "Le pays est requis";
          isValid1 = false;
        }
        setErrors(newErrors1);
        return isValid1;
      case 2:
        return !!(formData.profession && formData.employer && formData.monthlyIncome);
      case 3:
        return !!(formData.expenses && formData.yearsInProfession);
      case 4:
        const newErrors4: Errors = {};
        let isValid4 = true;
        if (!formData.loanAmount) {
          newErrors4.loanAmount = "Le montant demandé est requis";
          isValid4 = false;
        } else if (parseFloat(formData.loanAmount) < 10000 || parseFloat(formData.loanAmount) > 50000000) {
          newErrors4.loanAmount = "Le montant doit être entre 10,000 et 50,000,000 XOF";
          isValid4 = false;
        }
        if (!formData.loanDuration) {
          newErrors4.loanDuration = "La durée du prêt est requise";
          isValid4 = false;
        } else if (parseFloat(formData.loanDuration) < 3 || parseFloat(formData.loanDuration) > 300) {
          newErrors4.loanDuration = "La durée doit être entre 3 et 300 mois";
          isValid4 = false;
        }
        if (!formData.loanPurpose) {
          newErrors4.loanPurpose = "L'objet du prêt est requis";
          isValid4 = false;
        }
        if (!formData.preferredRate) {
          newErrors4.preferredRate = "Le type de taux préféré est requis";
          isValid4 = false;
        }
        if (!formData.purpose) {
          newErrors4.purpose = "La description du projet est requise";
          isValid4 = false;
        }
        setErrors(newErrors4);
        return isValid4;
      case 5:
        const newErrors5: Errors = {};
        let isValid5 = true;
        const requiredCategories = ['incomeProof', 'idDocument', 'addressProof', 'employmentProof'];
        
        if (!formData.hasIncomeProof) {
          newErrors5.hasIncomeProof = "Le justificatif de revenus est requis";
          isValid5 = false;
        }
        if (!formData.hasIdDocument) {
          newErrors5.hasIdDocument = "La pièce d'identité est requise";
          isValid5 = false;
        }
        if (!formData.hasAddressProof) {
          newErrors5.hasAddressProof = "Le justificatif de domicile est requis";
          isValid5 = false;
        }
        if (!formData.hasEmploymentProof) {
          newErrors5.hasEmploymentProof = "Le justificatif d'emploi est requis";
          isValid5 = false;
        }
        if (tempDocument.length < 4) {
          newErrors5.tempDocument = "Les quatre documents requis doivent être téléversés";
          isValid5 = false;
        } else {
          const uploadedCategories = tempDocument.map(doc => doc.category).filter(Boolean);
          const missingCategories = requiredCategories.filter(cat => !uploadedCategories.includes(cat));
          if (missingCategories.length > 0) {
            newErrors5.tempDocument = `Documents manquants pour : ${missingCategories.map(cat => {
              switch(cat) {
                case 'incomeProof': return 'Justificatif de revenus';
                case 'idDocument': return 'Pièce d\'identité';
                case 'addressProof': return 'Justificatif de domicile';
                case 'employmentProof': return 'Justificatif d\'emploi';
                default: return cat;
              }
            }).join(', ')}`;
            isValid5 = false;
          }
        }
        setErrors(newErrors5);
        return isValid5;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (!validateStep(currentStep)) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const submitApplication = () => {
    if (!validateStep(currentStep)) {
      toast({
        title: "Informations manquantes",
        description: "Veuillez cocher toutes les cases et téléverser les quatre documents requis",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Demande soumise",
      description: "Votre demande de prêt a été envoyée avec succès",
    });
  };

  const progress = (currentStep / 5) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Faire une demande de prêt</h1>
        <p className="text-muted-foreground">Remplissez le formulaire étape par étape</p>
      </div>

      {/* Progression */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Étape {currentStep} sur 5</span>
              <span>{Math.round(progress)}% complété</span>
            </div>
            <Progress value={progress} className="w-full" />
            <div className="grid grid-cols-5 gap-2 text-xs">
              {steps.map((step) => (
                <div 
                  key={step.number} 
                  className={`text-center p-2 rounded ${
                    currentStep >= step.number ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}
                >
                  <div className="font-medium">{step.title}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Étapes du formulaire */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].title}</CardTitle>
          <CardDescription>{steps[currentStep - 1].description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentStep === 1 && (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénoms *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Votre prénom"
                    className={errors.firstName ? 'border-red-500' : ''}
                  />
                  {errors.firstName && <div className="text-red-600 text-sm">{errors.firstName}</div>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Votre nom"
                    className={errors.lastName ? 'border-red-500' : ''}
                  />
                  {errors.lastName && <div className="text-red-600 text-sm">{errors.lastName}</div>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="votre@email.com"
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && <div className="text-red-600 text-sm">{errors.email}</div>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+229 01 9740 4045"
                    className={errors.phone ? 'border-red-500' : ''}
                  />
                  {errors.phone && <div className="text-red-600 text-sm">{errors.phone}</div>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Date de naissance *</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => handleInputChange('birthDate', e.target.value)}
                    className={errors.birthDate ? 'border-red-500' : ''}
                  />
                  {errors.birthDate && <div className="text-red-600 text-sm">{errors.birthDate}</div>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maritalStatus">Situation familiale *</Label>
                  <Select value={formData.maritalStatus} onValueChange={(value) => handleInputChange('maritalStatus', value)}>
                    <SelectTrigger className={errors.maritalStatus ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Sélectionnez" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Célibataire</SelectItem>
                      <SelectItem value="married">Marié(e)</SelectItem>
                      <SelectItem value="divorced">Divorcé(e)</SelectItem>
                      <SelectItem value="widowed">Veuf/Veuve</SelectItem>
                      <SelectItem value="cohabiting">Union libre</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.maritalStatus && <div className="text-red-600 text-sm">{errors.maritalStatus}</div>}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Votre adresse complète"
                    className={errors.address ? 'border-red-500' : ''}
                  />
                  {errors.address && <div className="text-red-600 text-sm">{errors.address}</div>}
                </div>
                <div className="md:col-span-2">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Ville</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="Votre ville"
                        className={errors.city ? 'border-red-500' : ''}
                      />
                      {errors.city && <div className="text-red-600 text-sm">{errors.city}</div>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Code postal</Label>
                      <Input
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                        placeholder="12345"
                        className={errors.postalCode ? 'border-red-500' : ''}
                      />
                      {errors.postalCode && <div className="text-red-600 text-sm">{errors.postalCode}</div>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Pays *</Label>
                      <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                        <SelectTrigger className={errors.country ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Sélectionnez" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="BJ">Bénin</SelectItem>
                          <SelectItem value="FR">France</SelectItem>
                          <SelectItem value="CI">Côte d'Ivoire</SelectItem>
                          <SelectItem value="SN">Sénégal</SelectItem>
                          <SelectItem value="TG">Togo</SelectItem>
                          <SelectItem value="BF">Burkina Faso</SelectItem>
                          <SelectItem value="NE">Niger</SelectItem>
                          <SelectItem value="ML">Mali</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.country && <div className="text-red-600 text-sm">{errors.country}</div>}
                    </div>
                  </div>
                </div>
              </div>
              <div className="alert bg-blue-100 border border-blue-500 text-blue-700 p-4 rounded-lg mt-4">
                <h5 className="font-medium flex items-center">
                  <Info className="h-5 w-5 inline-block mr-2" />
                  Numéro pour recevoir le prêt
                </h5>
                <p className="mb-0">Le numéro que vous fournissez sera utilisé pour recevoir le prêt, une fois approuvé. Assurez-vous de saisir un numéro correct et enregistré à votre nom, sinon votre demande sera invalide et aucun prêt ne sera accordé.</p>
              </div>
            </>
          )}

          {currentStep === 2 && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="profession">Profession *</Label>
                <Input
                  id="profession"
                  value={formData.profession}
                  onChange={(e) => handleInputChange('profession', e.target.value)}
                  placeholder="Votre profession"
                  className={errors.profession ? 'border-red-500' : ''}
                />
                {errors.profession && <div className="text-red-600 text-sm">{errors.profession}</div>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="employer">Employeur *</Label>
                <Input
                  id="employer"
                  value={formData.employer}
                  onChange={(e) => handleInputChange('employer', e.target.value)}
                  placeholder="Nom de votre employeur"
                  className={errors.employer ? 'border-red-500' : ''}
                />
                {errors.employer && <div className="text-red-600 text-sm">{errors.employer}</div>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthlyIncome">Revenus mensuels *</Label>
                <div className="flex">
                  <Input
                    id="monthlyIncome"
                    type="number"
                    value={formData.monthlyIncome}
                    onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
                    placeholder="3000"
                    min="0"
                    className={errors.monthlyIncome ? 'border-red-500' : ''}
                  />
                  <span className="inline-flex items-center px-3 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-gray-600">
                    XOF
                  </span>
                </div>
                {errors.monthlyIncome && <div className="text-red-600 text-sm mt-1">{errors.monthlyIncome}</div>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="employmentType">Type d'emploi</Label>
                <Select value={formData.employmentType} onValueChange={(value) => handleInputChange('employmentType', value)}>
                  <SelectTrigger className={errors.employmentType ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cdi">CDI</SelectItem>
                    <SelectItem value="cdd">CDD</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                    <SelectItem value="fonctionnaire">Fonctionnaire</SelectItem>
                  </SelectContent>
                </Select>
                {errors.employmentType && <div className="text-red-600 text-sm">{errors.employmentType}</div>}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="expenses">Charges mensuelles *</Label>
                  <div className="flex">
                    <Input
                      id="expenses"
                      type="number"
                      value={formData.expenses}
                      onChange={(e) => handleInputChange('expenses', e.target.value)}
                      placeholder="1500"
                      min="0"
                      className={errors.expenses ? 'border-red-500' : ''}
                    />
                    <span className="inline-flex items-center px-3 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-gray-600">
                      XOF
                    </span>
                  </div>
                  {errors.expenses && <div className="text-red-600 text-sm mt-1">{errors.expenses}</div>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearsInProfession">Ancienneté dans la profession (mois) *</Label>
                  <Input
                    id="yearsInProfession"
                    type="number"
                    value={formData.yearsInProfession}
                    onChange={(e) => handleInputChange('yearsInProfession', e.target.value)}
                    placeholder="60"
                    min="0"
                    className={errors.yearsInProfession ? 'border-red-500' : ''}
                  />
                  {errors.yearsInProfession && <div className="text-red-600 text-sm mt-1">{errors.yearsInProfession}</div>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="additionalIncome">Revenus complémentaires</Label>
                  <div className="flex">
                    <Input
                      id="additionalIncome"
                      type="number"
                      value={formData.additionalIncome}
                      onChange={(e) => handleInputChange('additionalIncome', e.target.value)}
                      placeholder="0"
                      min="0"
                      className={errors.additionalIncome ? 'border-red-500' : ''}
                    />
                    <span className="inline-flex items-center px-3 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-gray-600">
                      XOF
                    </span>
                  </div>
                  {errors.additionalIncome && <div className="text-red-600 text-sm mt-1">{errors.additionalIncome}</div>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="existingMonthlyPayments">Mensualités en cours</Label>
                  <div className="flex">
                    <Input
                      id="existingMonthlyPayments"
                      type="number"
                      value={formData.existingMonthlyPayments}
                      onChange={(e) => handleInputChange('existingMonthlyPayments', e.target.value)}
                      placeholder="0"
                      min="0"
                      className={errors.existingMonthlyPayments ? 'border-red-500' : ''}
                    />
                    <span className="inline-flex items-center px-3 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-gray-600">
                      XOF
                    </span>
                  </div>
                  {errors.existingMonthlyPayments && <div className="text-red-600 text-sm mt-1">{errors.existingMonthlyPayments}</div>}
                </div>
              </div>
              <div className="alert bg-blue-100 border border-blue-500 text-blue-700 p-4 rounded-lg mt-4">
                <h5 className="font-medium flex items-center">
                  <Info className="h-5 w-5 inline-block mr-2" />
                  Capacité d'endettement
                </h5>
                <p className="mb-0">
                  Votre capacité d'endettement ne doit pas dépasser 35% de vos revenus nets. Assurez-vous que vos charges actuelles plus la nouvelle mensualité ne dépassent pas ce seuil.
                </p>
              </div>
            </>
          )}

          {currentStep === 4 && (
            <>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="loanAmount">Montant demandé *</Label>
                  <div className="flex">
                    <Input
                      id="loanAmount"
                      type="number"
                      value={formData.loanAmount}
                      onChange={(e) => handleInputChange('loanAmount', e.target.value)}
                      placeholder="10000"
                      min="10000"
                      max="50000000"
                      step="10000"
                      className={errors.loanAmount ? 'border-red-500' : ''}
                    />
                    <span className="inline-flex items-center px-3 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-gray-600">
                      XOF
                    </span>
                  </div>
                  {errors.loanAmount && <div className="text-red-600 text-sm mt-1">{errors.loanAmount}</div>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loanDuration">Durée du prêt *</Label>
                  <div className="flex">
                    <Input
                      id="loanDuration"
                      type="number"
                      value={formData.loanDuration}
                      onChange={(e) => handleInputChange('loanDuration', e.target.value)}
                      placeholder="3"
                      min="3"
                      max="300"
                      className={errors.loanDuration ? 'border-red-500' : ''}
                    />
                    <span className="inline-flex items-center px-3 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-gray-600">
                      mois
                    </span>
                  </div>
                  {errors.loanDuration && <div className="text-red-600 text-sm mt-1">{errors.loanDuration}</div>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loanPurpose">Objet du prêt *</Label>
                  <Select value={formData.loanPurpose} onValueChange={(value) => handleInputChange('loanPurpose', value)}>
                    <SelectTrigger className={errors.loanPurpose ? 'border-red-500' : ''}>
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
                  {errors.loanPurpose && <div className="text-red-600 text-sm mt-1">{errors.loanPurpose}</div>}
                </div>
                <div className="space-y-2">
                  <Label>Type de taux préféré *</Label>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Input
                        type="radio"
                        id="fixedRate"
                        name="preferredRate"
                        value="fixed"
                        checked={formData.preferredRate === 'fixed'}
                        onChange={(e) => handleInputChange('preferredRate', e.target.value)}
                        className={errors.preferredRate ? 'border-red-500 h-3 w-3' : formData.preferredRate === 'fixed' ? 'border-green-500 border-2 h-3 w-3' : 'h-3 w-3'}
                      />
                      <Label htmlFor="fixedRate">Taux fixe</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="radio"
                        id="variableRate"
                        name="preferredRate"
                        value="variable"
                        checked={formData.preferredRate === 'variable'}
                        onChange={(e) => handleInputChange('preferredRate', e.target.value)}
                        className={errors.preferredRate ? 'border-red-500 h-3 w-3' : formData.preferredRate === 'variable' ? 'border-green-500 border-2 h-3 w-3' : 'h-3 w-3'}
                      />
                      <Label htmlFor="variableRate">Taux variable</Label>
                    </div>
                    {errors.preferredRate && <div className="text-red-600 text-sm mt-1">{errors.preferredRate}</div>}
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="purpose">Description du projet *</Label>
                  <Textarea
                    id="purpose"
                    value={formData.purpose}
                    onChange={(e) => handleInputChange('purpose', e.target.value)}
                    placeholder="Décrivez votre projet écologique..."
                    rows={3}
                    className={errors.purpose ? 'border-red-500' : ''}
                  />
                  {errors.purpose && <div className="text-red-600 text-sm mt-1">{errors.purpose}</div>}
                </div>
              </div>
              <div className="alert bg-green-100 border border-green-500 text-green-700 p-4 rounded-lg mt-4">
                <h5 className="font-medium flex items-center">
                  <Calculator className="h-5 w-5 inline-block mr-2" />
                  Estimation de votre mensualité
                </h5>
                <p className="text-xl text-green-700 mb-2">{calculateMonthlyPayment()}/mois</p>
                <small className="text-gray-600">*Estimation basée sur un taux indicatif de 3% - Le taux réel sera déterminé après étude de votre dossier</small>
              </div>
            </>
          )}

          {currentStep === 5 && (
            <div className="space-y-4">
              <h5 className="font-medium">Documents Requis</h5>
              <div className="alert bg-blue-100 border border-blue-500 text-blue-700 p-4 rounded-lg">
                <h5 className="font-medium flex items-center">
                  <Info className="h-5 w-5 inline-block mr-2" />
                  Informations importantes
                </h5>
                <ul className="mb-0 list-disc pl-5">
                  <li>Tous les documents marqués comme requis doivent être fournis</li>
                  <li>Les documents doivent être récents (moins de 3 mois)</li>
                  <li>Vous pourrez télécharger les documents après validation du formulaire</li>
                </ul>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Input
                        type="checkbox"
                        id="hasIncomeProof"
                        checked={formData.hasIncomeProof}
                        onChange={(e) => handleInputChange('hasIncomeProof', e.target.checked)}
                        className={formData.hasIncomeProof ? 'border-green-500 border-2 h-3 w-3' : errors.hasIncomeProof ? 'border-red-500 h-3 w-3' : 'h-3 w-3'}
                      />
                      <Label htmlFor="hasIncomeProof">Justificatif de revenus * (Bulletin de paye, avis d'imposition, etc.)</Label>
                    </div>
                    {errors.hasIncomeProof && <div className="text-red-600 text-sm">{errors.hasIncomeProof}</div>}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Input
                        type="checkbox"
                        id="hasIdDocument"
                        checked={formData.hasIdDocument}
                        onChange={(e) => handleInputChange('hasIdDocument', e.target.checked)}
                        className={formData.hasIdDocument ? 'border-green-500 border-2 h-3 w-3' : errors.hasIdDocument ? 'border-red-500 h-3 w-3' : 'h-3 w-3'}
                      />
                      <Label htmlFor="hasIdDocument">Pièce d'identité * (Carte d'identité, passeport, permis)</Label>
                    </div>
                    {errors.hasIdDocument && <div className="text-red-600 text-sm">{errors.hasIdDocument}</div>}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Input
                        type="checkbox"
                        id="hasAddressProof"
                        checked={formData.hasAddressProof}
                        onChange={(e) => handleInputChange('hasAddressProof', e.target.checked)}
                        className={formData.hasAddressProof ? 'border-green-500 border-2 h-3 w-3' : errors.hasAddressProof ? 'border-red-500 h-3 w-3' : 'h-3 w-3'}
                      />
                      <Label htmlFor="hasAddressProof">Justificatif de domicile * (Facture récente)</Label>
                    </div>
                    {errors.hasAddressProof && <div className="text-red-600 text-sm">{errors.hasAddressProof}</div>}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Input
                        type="checkbox"
                        id="hasEmploymentProof"
                        checked={formData.hasEmploymentProof}
                        onChange={(e) => handleInputChange('hasEmploymentProof', e.target.checked)}
                        className={formData.hasEmploymentProof ? 'border-green-500 border-2 h-3 w-3' : errors.hasEmploymentProof ? 'border-red-500 h-3 w-3' : 'h-3 w-3'}
                      />
                      <Label htmlFor="hasEmploymentProof">Justificatif d'emploi * (Contrat de travail, attestation)</Label>
                    </div>
                    {errors.hasEmploymentProof && <div className="text-red-600 text-sm">{errors.hasEmploymentProof}</div>}
                  </div>
                </div>
              </div>
              <div className="file-upload-area">
                <input
                  type="file"
                  id="fileUpload"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="fileUpload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground text-center">
                    Déposez vos fichiers ici ou cliquez pour télécharger<br />
                    (Formats acceptés : .pdf, .jpg, .jpeg, .png)
                  </p>
                </label>
                {errors.tempDocument && <div className="text-red-600 text-sm mt-1">{errors.tempDocument}</div>}
              </div>
              {tempDocument.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Fichiers téléchargés :</h4>
                  {tempDocument.map((file, index) => (
                    <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {file.type.startsWith('image/') ? (
                          <img
                            src={URL.createObjectURL(file.file)}
                            alt={`upload-${index}`}
                            className="w-[60px] h-[60px] object-cover rounded-md"
                          />
                        ) : (
                          <File className="h-8 w-8 text-primary" />
                        )}
                        <div>
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(file.size / 1024 < 1024) 
                              ? `${(file.size / 1024).toFixed(2)} Ko` 
                              : `${(file.size / 1024 / 1024).toFixed(2)} Mo`}
                          </p>
                          <Select
                            value={file.category}
                            onValueChange={(value) => handleCategoryChange(index, value)}
                          >
                            <SelectTrigger className="w-[200px] mt-1">
                              <SelectValue placeholder="-- Sélectionnez une catégorie --" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="incomeProof">Justificatif de revenus</SelectItem>
                              <SelectItem value="idDocument">Pièce d'identité</SelectItem>
                              <SelectItem value="addressProof">Justificatif de domicile</SelectItem>
                              <SelectItem value="employmentProof">Justificatif d'emploi</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={prevStep} 
          disabled={currentStep === 1}
        >
          Précédent
        </Button>
        
        {currentStep < 5 ? (
          <Button onClick={nextStep}>
            Suivant
          </Button>
        ) : (
          <Button onClick={submitApplication} className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Soumettre la demande
          </Button>
        )}
      </div>
    </div>
  );
};

export default FaireDemande;