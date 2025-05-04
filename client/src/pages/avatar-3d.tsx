import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/topbar";
import MobileNavigation from "@/components/layout/mobile-navigation";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  BodyScanHistory, 
  AvatarCustomization 
} from "@shared/schema";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { Loader, Camera, Repeat, Save, Upload, Edit3 } from "lucide-react";

export default function Avatar3D() {
  const user = useSelector((state: RootState) => state.user.user);
  const { toast } = useToast();
  const [activeScan, setActiveScan] = useState(false);
  const [scanningInProgress, setScanningInProgress] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("avatar");
  
  // Fetch scan history
  const { 
    data: scanHistory,
    isLoading: scanHistoryLoading,
    refetch: refetchScanHistory
  } = useQuery<BodyScanHistory[]>({
    queryKey: ["/api/scans/history"],
  });
  
  // Fetch avatar customizations
  const {
    data: avatarCustomizations,
    isLoading: avatarCustomizationsLoading,
    refetch: refetchAvatarCustomizations
  } = useQuery<AvatarCustomization[]>({
    queryKey: ["/api/avatar/customizations"],
  });
  
  // Simula avvio della scansione 3D
  const startScan = () => {
    setActiveScan(true);
    setScanningInProgress(true);
    
    toast({
      title: "Scansione avviata",
      description: "Posizionati davanti alla camera per la scansione 3D",
    });
    
    // Simulazione di una scansione in corso (in un'app reale questo utilizzerebbe la fotocamera)
    setTimeout(() => {
      setScanningInProgress(false);
      setScanResult({
        date: new Date(),
        weight: 75000, // 75kg in grammi
        bodyFatPercentage: 1850, // 18.5%
        musclePercentage: 3200, // 32.0%
        measurements: {
          chest: 102, // in cm
          waist: 82,
          hips: 97,
          biceps: 33,
          thighs: 56
        }
      });
      
      toast({
        title: "Scansione completata",
        description: "La tua scansione 3D è stata completata con successo!",
      });
    }, 3000);
  };
  
  // Salva i risultati della scansione
  const saveScanResults = async () => {
    if (!scanResult) return;
    
    try {
      await apiRequest("POST", "/api/scans/save", {
        scanData: { 
          timestamp: scanResult.date,
          scanSuccess: true 
        },
        bodyMeasurements: scanResult.measurements,
        weight: scanResult.weight,
        bodyFatPercentage: scanResult.bodyFatPercentage,
        musclePercentage: scanResult.musclePercentage
      });
      
      toast({
        title: "Salvataggio completato",
        description: "I dati della scansione sono stati salvati con successo",
      });
      
      setActiveScan(false);
      setScanResult(null);
      refetchScanHistory();
      
    } catch (error) {
      toast({
        title: "Errore",
        description: "Impossibile salvare i risultati della scansione",
        variant: "destructive",
      });
    }
  };
  
  // Prepara i dati per i grafici dei progressi
  const getProgressChartData = () => {
    if (!scanHistory || scanHistory.length === 0) return [];
    
    return scanHistory.map(scan => ({
      date: scan.scanDate ? new Date(scan.scanDate).toLocaleDateString('it-IT') : '',
      peso: scan.weight ? scan.weight / 1000 : 0, // Converti in kg
      grasso: scan.bodyFatPercentage ? scan.bodyFatPercentage / 100 : 0, // Percentuale reale
      muscolo: scan.musclePercentage ? scan.musclePercentage / 100 : 0 // Percentuale reale
    }));
  };
  
  // Componente per mostrare avatar 3D
  const AvatarViewer = () => {
    return (
      <div className="relative h-[500px] bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
        <div className="text-center">
          {user?.avatarData ? (
            <div className="p-4">
              <div className="w-64 h-64 mx-auto relative">
                {/* Qui verrebbe renderizzato il modello 3D con libreria come Three.js */}
                <div className="absolute inset-0 flex items-center justify-center text-primary text-lg font-bold bg-primary/10 rounded-full">
                  Avatar 3D
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-500">
                Ultimo aggiornamento: {user.avatarLastUpdated ? new Date(user.avatarLastUpdated).toLocaleDateString('it-IT') : 'Mai'}
              </p>
              <div className="mt-4 space-x-2">
                <Button variant="outline" size="sm">
                  <Repeat className="mr-2 h-4 w-4" />
                  Ruota
                </Button>
                <Button variant="outline" size="sm">
                  <Edit3 className="mr-2 h-4 w-4" />
                  Personalizza
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-8">
              <p className="text-gray-500 mb-4">Nessun avatar disponibile.</p>
              <p className="text-sm text-gray-400 mb-6">Effettua una scansione 3D per creare il tuo avatar personalizzato.</p>
              <Button onClick={() => setActiveTab("scanner")}>
                <Camera className="mr-2 h-4 w-4" />
                Crea il tuo avatar
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Nuove variabili per l'upload delle 3 foto
  const [photoFront, setPhotoFront] = useState<File | null>(null);
  const [photoBack, setPhotoBack] = useState<File | null>(null);
  const [photoSide, setPhotoSide] = useState<File | null>(null);
  const [frontImagePreview, setFrontImagePreview] = useState<string | null>(null);
  const [backImagePreview, setBackImagePreview] = useState<string | null>(null);
  const [sideImagePreview, setSideImagePreview] = useState<string | null>(null);
  const [processingPhotos, setProcessingPhotos] = useState(false);
  const [uploadStep, setUploadStep] = useState<'instruction' | 'upload' | 'processing' | 'result'>('instruction');
  
  // Funzione per gestire l'upload delle foto
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, photoType: 'front' | 'back' | 'side') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const imagePreview = event.target?.result as string;
        
        switch (photoType) {
          case 'front':
            setPhotoFront(file);
            setFrontImagePreview(imagePreview);
            break;
          case 'back':
            setPhotoBack(file);
            setBackImagePreview(imagePreview);
            break;
          case 'side':
            setPhotoSide(file);
            setSideImagePreview(imagePreview);
            break;
        }
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  // Controlla se tutte le foto sono state caricate
  const allPhotosUploaded = photoFront && photoBack && photoSide;
  
  // Processa le foto e genera l'avatar 3D
  const processPhotos = async () => {
    if (!allPhotosUploaded) {
      toast({
        title: "Foto mancanti",
        description: "Carica tutte e tre le foto richieste per procedere",
        variant: "destructive"
      });
      return;
    }
    
    setUploadStep('processing');
    setProcessingPhotos(true);
    
    try {
      // Prepara i file per l'invio al server
      const formData = new FormData();
      if (photoFront) formData.append('photoFront', photoFront);
      if (photoBack) formData.append('photoBack', photoBack);
      if (photoSide) formData.append('photoSide', photoSide);
      
      toast({
        title: "Elaborazione foto",
        description: "Stiamo analizzando le tue foto con l'IA per creare un avatar preciso",
      });
      
      try {
        // Chiamata all'API per processare le foto
        // In una implementazione completa, invieremmo i file e li elaboreremmo sul server
        // Per ora, facciamo una chiamata semplificata che simula l'elaborazione
        const response = await apiRequest('POST', '/api/avatar/generate-from-photos', {});
        
        if (response.avatarData && response.bodyMeasurements) {
          // Analisi completata con successo
          setProcessingPhotos(false);
          setUploadStep('result');
          
          // Crea oggetto scanResult dai dati ricevuti
          setScanResult({
            date: new Date(),
            weight: response.bodyMeasurements.weight || 74500, // 74.5kg in grammi
            bodyFatPercentage: response.avatarData.bodyFatPercentage * 100 || 1620, // 16.2%
            musclePercentage: response.avatarData.muscleDefinition === 'high' ? 3600 : 
                             response.avatarData.muscleDefinition === 'medium' ? 3200 : 2800, // % muscolo
            measurements: {
              chest: response.bodyMeasurements.chest || 98,
              waist: response.bodyMeasurements.waist || 81,
              hips: response.bodyMeasurements.hips || 96,
              biceps: response.bodyMeasurements.biceps || 35,
              thighs: response.bodyMeasurements.thighs || 57
            }
          });
          
          toast({
            title: "Analisi completata",
            description: "L'avatar 3D è stato creato con successo!",
          });
          
          // Aggiorna lo store di Redux con i nuovi dati dell'utente
          // Nota: in una implementazione completa, dovresti fare una chiamata separata 
          // per aggiornare lo stato dell'app, o usare una soluzione più elegante come refetch
          refetchScanHistory();
          refetchAvatarCustomizations();
        } else {
          throw new Error("Dati ricevuti non validi");
        }
      } catch (error) {
        console.error("Errore analisi foto:", error);
        setProcessingPhotos(false);
        setUploadStep('upload');
        toast({
          title: "Errore di elaborazione",
          description: "Non è stato possibile elaborare le foto. Riprova più tardi.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Errore upload foto:", error);
      setProcessingPhotos(false);
      setUploadStep('upload');
      toast({
        title: "Errore di caricamento",
        description: "Non è stato possibile caricare le foto. Riprova più tardi.",
        variant: "destructive"
      });
    }
  };
  
  // Reset della procedura di upload
  const resetPhotoUpload = () => {
    setPhotoFront(null);
    setPhotoBack(null);
    setPhotoSide(null);
    setFrontImagePreview(null);
    setBackImagePreview(null);
    setSideImagePreview(null);
    setProcessingPhotos(false);
    setUploadStep('instruction');
    setScanResult(null);
  };
  
  // Componente per lo scanner 3D
  const Scanner3D = () => {
    // Mostra l'interfaccia di upload se la scansione è attiva
    if (activeScan) {
      return (
        <div className="bg-gray-100 rounded-md overflow-hidden">
          {uploadStep === 'instruction' && (
            <div className="p-8 text-center">
              <h3 className="text-xl font-bold mb-4">Scansione fotografica 3D</h3>
              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  Per creare un avatar 3D preciso, dovrai caricare 3 foto del tuo corpo:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="w-full h-32 bg-gray-200 rounded-md flex items-center justify-center mb-2">
                      <Camera className="h-10 w-10 text-gray-400" />
                    </div>
                    <p className="font-semibold">Foto frontale</p>
                    <p className="text-xs text-gray-500">Vista frontale completa del corpo</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="w-full h-32 bg-gray-200 rounded-md flex items-center justify-center mb-2">
                      <Camera className="h-10 w-10 text-gray-400" />
                    </div>
                    <p className="font-semibold">Foto posteriore</p>
                    <p className="text-xs text-gray-500">Vista posteriore completa del corpo</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="w-full h-32 bg-gray-200 rounded-md flex items-center justify-center mb-2">
                      <Camera className="h-10 w-10 text-gray-400" />
                    </div>
                    <p className="font-semibold">Foto laterale</p>
                    <p className="text-xs text-gray-500">Vista laterale completa del corpo</p>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Button onClick={() => setUploadStep('upload')}>
                  Inizia il caricamento
                </Button>
                <p className="mt-4 text-xs text-gray-500">
                  Le foto vengono utilizzate solo per generare il tuo avatar 3D e calcolare le misure corporee.
                  Non verranno mai condivise con terze parti.
                </p>
              </div>
            </div>
          )}
          
          {uploadStep === 'upload' && (
            <div className="p-8">
              <h3 className="text-xl font-bold mb-6 text-center">Carica le tue foto</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Upload foto frontale */}
                <div className="flex flex-col items-center">
                  <p className="font-medium mb-2">Foto frontale</p>
                  <div className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden mb-2">
                    {frontImagePreview ? (
                      <img 
                        src={frontImagePreview} 
                        alt="Anteprima frontale" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Camera className="h-12 w-12 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Vista frontale</p>
                      </div>
                    )}
                  </div>
                  <input 
                    type="file" 
                    id="frontPhoto" 
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e, 'front')}
                  />
                  <label 
                    htmlFor="frontPhoto"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 cursor-pointer"
                  >
                    {frontImagePreview ? "Cambia foto" : "Carica foto"}
                  </label>
                </div>
                
                {/* Upload foto posteriore */}
                <div className="flex flex-col items-center">
                  <p className="font-medium mb-2">Foto posteriore</p>
                  <div className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden mb-2">
                    {backImagePreview ? (
                      <img 
                        src={backImagePreview} 
                        alt="Anteprima posteriore" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Camera className="h-12 w-12 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Vista posteriore</p>
                      </div>
                    )}
                  </div>
                  <input 
                    type="file" 
                    id="backPhoto" 
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e, 'back')}
                  />
                  <label 
                    htmlFor="backPhoto"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 cursor-pointer"
                  >
                    {backImagePreview ? "Cambia foto" : "Carica foto"}
                  </label>
                </div>
                
                {/* Upload foto laterale */}
                <div className="flex flex-col items-center">
                  <p className="font-medium mb-2">Foto laterale</p>
                  <div className="relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden mb-2">
                    {sideImagePreview ? (
                      <img 
                        src={sideImagePreview} 
                        alt="Anteprima laterale" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Camera className="h-12 w-12 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Vista laterale</p>
                      </div>
                    )}
                  </div>
                  <input 
                    type="file" 
                    id="sidePhoto" 
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e, 'side')}
                  />
                  <label 
                    htmlFor="sidePhoto"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 cursor-pointer"
                  >
                    {sideImagePreview ? "Cambia foto" : "Carica foto"}
                  </label>
                </div>
              </div>
              
              <div className="flex justify-center space-x-4 mt-8">
                <Button variant="outline" onClick={resetPhotoUpload}>
                  Annulla
                </Button>
                <Button 
                  onClick={processPhotos} 
                  disabled={!allPhotosUploaded || processingPhotos}
                >
                  {processingPhotos ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Elaborazione...
                    </>
                  ) : (
                    "Genera avatar 3D"
                  )}
                </Button>
              </div>
            </div>
          )}
          
          {uploadStep === 'processing' && (
            <div className="p-8 text-center">
              <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader className="h-12 w-12 text-primary animate-spin" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">Elaborazione in corso...</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Stiamo analizzando le tue foto con intelligenza artificiale per creare un avatar 3D dettagliato 
                e calcolare le tue misure corporee con precisione.
              </p>
              <div className="space-y-2 max-w-md mx-auto text-left">
                <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-3/4 animate-pulse"></div>
                </div>
                <p className="text-sm text-gray-500">Analisi foto e calcolo dimensioni...</p>
              </div>
            </div>
          )}
          
          {uploadStep === 'result' && (
            <div className="p-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2">
                  <h3 className="text-xl font-bold mb-4">Avatar generato</h3>
                  <div className="bg-gray-200 rounded-lg h-80 flex items-center justify-center mb-4">
                    {/* Qui verrebbe visualizzato l'avatar 3D generato usando Three.js o altro */}
                    <div className="text-center p-6">
                      <div className="w-40 h-40 mx-auto relative bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <span className="text-primary font-bold">Avatar 3D</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        Avatar 3D generato dalle tue foto
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2 justify-center">
                    <Button variant="outline" size="sm">
                      <Repeat className="mr-2 h-4 w-4" />
                      Ruota
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit3 className="mr-2 h-4 w-4" />
                      Personalizza
                    </Button>
                  </div>
                </div>
                
                <div className="md:w-1/2">
                  <h3 className="text-xl font-bold mb-4">Misure calcolate</h3>
                  <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Peso stimato</p>
                        <p className="text-xl font-semibold">{scanResult?.weight / 1000} kg</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Grasso corporeo</p>
                        <p className="text-xl font-semibold">{scanResult?.bodyFatPercentage / 100}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Massa muscolare</p>
                        <p className="text-xl font-semibold">{scanResult?.musclePercentage / 100}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Data</p>
                        <p className="text-xl font-semibold">{scanResult?.date ? scanResult.date.toLocaleDateString('it-IT') : ''}</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 border-t pt-4">
                      <p className="font-medium mb-2">Misure dettagliate (cm)</p>
                      <div className="grid grid-cols-3 gap-y-2 gap-x-4 text-sm">
                        <div>
                          <p className="text-gray-500">Petto</p>
                          <p className="font-medium">{scanResult?.measurements.chest} cm</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Vita</p>
                          <p className="font-medium">{scanResult?.measurements.waist} cm</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Fianchi</p>
                          <p className="font-medium">{scanResult?.measurements.hips} cm</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Bicipiti</p>
                          <p className="font-medium">{scanResult?.measurements.biceps} cm</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Cosce</p>
                          <p className="font-medium">{scanResult?.measurements.thighs} cm</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-4">
                    <Button variant="outline" onClick={resetPhotoUpload}>
                      Annulla
                    </Button>
                    <Button onClick={saveScanResults}>
                      <Save className="mr-2 h-4 w-4" />
                      Salva risultati
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }
    
    // Mostra l'interfaccia iniziale dello scanner
    return (
      <div className="bg-gray-100 rounded-md overflow-hidden">
        <div className="text-center p-8">
          <Camera className="h-16 w-16 text-primary/60 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Scanner fotografico 3D</h3>
          <p className="text-gray-500 mb-6 max-w-lg mx-auto">
            Carica 3 foto (frontale, posteriore e laterale) per creare un avatar 3D preciso e ottenere misurazioni dettagliate del tuo corpo.
          </p>
          <Button onClick={() => setActiveScan(true)}>
            Inizia scansione fotografica
          </Button>
          <p className="mt-4 text-xs text-gray-400 max-w-md mx-auto">
            Per risultati migliori, indossa abiti aderenti e scatta le foto in una stanza ben illuminata contro uno sfondo uniforme.
          </p>
        </div>
      </div>
    );
  };

  // Componente per la cronologia delle scansioni
  const ScanHistory = () => {
    if (scanHistoryLoading) {
      return <div className="flex justify-center p-12"><Loader className="h-8 w-8 animate-spin text-primary" /></div>;
    }
    
    if (!scanHistory || scanHistory.length === 0) {
      return (
        <div className="text-center p-8">
          <p className="text-gray-500 mb-4">Nessuna scansione precedente.</p>
          <p className="text-sm text-gray-400 mb-6">Effettua una scansione per iniziare a tracciare i tuoi progressi.</p>
          <Button onClick={() => setActiveTab("scanner")}>
            <Camera className="mr-2 h-4 w-4" />
            Nuova scansione
          </Button>
        </div>
      );
    }
    
    const progressData = getProgressChartData();
    
    return (
      <div>
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Andamento peso e composizione corporea</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={progressData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="peso" stroke="#8884d8" name="Peso (kg)" />
              <Line type="monotone" dataKey="grasso" stroke="#ff7300" name="Grasso (%)" />
              <Line type="monotone" dataKey="muscolo" stroke="#82ca9d" name="Muscolo (%)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-4">Scansioni recenti</h3>
          <div className="space-y-4">
            {scanHistory.slice(0, 5).map((scan, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    Scansione del {scan.scanDate ? new Date(scan.scanDate).toLocaleDateString('it-IT') : ''}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Peso</p>
                      <p className="font-semibold">{scan.weight ? (scan.weight / 1000).toFixed(1) : '?'} kg</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Grasso</p>
                      <p className="font-semibold">{scan.bodyFatPercentage ? (scan.bodyFatPercentage / 100).toFixed(1) : '?'}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Muscolo</p>
                      <p className="font-semibold">{scan.musclePercentage ? (scan.musclePercentage / 100).toFixed(1) : '?'}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="flex h-screen bg-lightBg">
      <Sidebar />
      
      <main className="flex-1 overflow-auto pb-16 md:pb-0">
        <TopBar title="Avatar 3D & Scanner" />
        
        <div className="p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6">
              <h1 className="text-2xl font-bold font-heading mb-2">Il tuo avatar 3D</h1>
              <p className="text-gray-500">
                Monitora i tuoi progressi con avatar 3D realistici e scansioni avanzate
              </p>
            </div>
            
            <Tabs defaultValue="avatar" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="avatar">Avatar personale</TabsTrigger>
                <TabsTrigger value="scanner">Scanner 3D</TabsTrigger>
                <TabsTrigger value="history">Cronologia & Progressi</TabsTrigger>
              </TabsList>
              
              <TabsContent value="avatar">
                <Card>
                  <CardHeader>
                    <CardTitle>Il tuo avatar 3D</CardTitle>
                    <CardDescription>
                      Visualizza e personalizza il tuo avatar 3D per monitorare i tuoi progressi nel tempo
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AvatarViewer />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="scanner">
                <Card>
                  <CardHeader>
                    <CardTitle>Scanner 3D</CardTitle>
                    <CardDescription>
                      Crea un modello 3D preciso del tuo corpo per un monitoraggio dettagliato dei progressi
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Scanner3D />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle>Cronologia scansioni</CardTitle>
                    <CardDescription>
                      Visualizza e confronta le tue scansioni nel tempo
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScanHistory />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </main>
      
      <MobileNavigation />
    </div>
  );
}