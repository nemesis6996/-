import { useState, /*useEffect*/ } from "react"; // useEffect rimosso se non utilizzato
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
  // CardFooter // Rimosso se non utilizzato
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
} from "@shared/schema"; // Assicurati che il percorso sia corretto e le interfacce esportate
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Legend 
} from "recharts";
import { Loader, Camera, Repeat, Save, Upload, Edit3 } from "lucide-react";

export default function Avatar3D() {
  const user = useSelector((state: RootState) => state.user.user);
  const { toast } = useToast();
  const [activeScan, setActiveScan] = useState(false);
  // const [_scanningInProgress, setScanningInProgress] = useState(false); // Commentato perché startScan è commentato e _scanningInProgress non è letto
  const [scanResult, setScanResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("avatar");
  
  const { 
    data: scanHistory,
    isLoading: scanHistoryLoading,
    refetch: refetchScanHistory
  } = useQuery<BodyScanHistory[]>({
    queryKey: ["/api/scans/history"],
    queryFn: async () => apiRequest("GET", "/api/scans/history"),
  });
  
  const {
    data: avatarCustomizations,
    isLoading: avatarCustomizationsLoading,
    refetch: refetchAvatarCustomizations
  } = useQuery<AvatarCustomization[]>({
    queryKey: ["/api/avatar/customizations"],
    queryFn: async () => apiRequest("GET", "/api/avatar/customizations"),
  });
  
  // Simula avvio della scansione 3D - Questa funzione non è attualmente utilizzata con il flusso di upload foto.
  // const startScan = () => {
  //   setActiveScan(true);
  //   setScanningInProgress(true);
  //   
  //   toast({
  //     title: "Scansione avviata",
  //     description: "Posizionati davanti alla camera per la scansione 3D",
  //   });
  //   
  //   setTimeout(() => {
  //     setScanningInProgress(false);
  //     setScanResult({
  //       date: new Date(),
  //       weight: 75000, 
  //       bodyFatPercentage: 1850, 
  //       musclePercentage: 3200, 
  //       measurements: {
  //         chest: 102, 
  //         waist: 82,
  //         hips: 97,
  //         biceps: 33,
  //         thighs: 56
  //       }
  //     });
  //     
  //     toast({
  //       title: "Scansione completata",
  //       description: "La tua scansione 3D è stata completata con successo!",
  //     });
  //   }, 3000);
  // };
  
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
  
  const getProgressChartData = () => {
    if (!scanHistory || scanHistory.length === 0) return [];
    
    return scanHistory.map(scan => ({
      date: scan.scanDate ? new Date(scan.scanDate).toLocaleDateString("it-IT", { day: "2-digit", month: "short" }) : "N/D",
      Peso: scan.weight ? scan.weight / 1000 : null,
      "Grasso (%)": scan.bodyFatPercentage ? scan.bodyFatPercentage / 100 : null,
      "Muscolo (%)": scan.musclePercentage ? scan.musclePercentage / 100 : null
    })).reverse();
  };
  
  const AvatarViewer = () => {
    return (
      <div className="relative min-h-[400px] md:min-h-[500px] bg-gray-100 rounded-md flex items-center justify-center overflow-hidden p-4">
        <div className="text-center">
          {user?.avatarData ? (
            <div className="p-4">
              <div className="w-48 h-48 md:w-64 md:h-64 mx-auto relative mb-4">
                <div className="absolute inset-0 flex items-center justify-center text-primary text-lg font-bold bg-primary/10 rounded-full">
                  <BodyScan className="w-24 h-24 text-primary opacity-50" />
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Ultimo aggiornamento: {user.avatarLastUpdated ? new Date(user.avatarLastUpdated).toLocaleDateString("it-IT") : "Mai"}
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
              <BodyScan className="w-24 h-24 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">Nessun avatar disponibile.</p>
              <p className="text-sm text-gray-400 mb-6">Effettua una scansione 3D o carica le foto per creare il tuo avatar personalizzato.</p>
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
  
  const [photoFront, setPhotoFront] = useState<File | null>(null);
  const [photoBack, setPhotoBack] = useState<File | null>(null);
  const [photoSide, setPhotoSide] = useState<File | null>(null);
  const [frontImagePreview, setFrontImagePreview] = useState<string | null>(null);
  const [backImagePreview, setBackImagePreview] = useState<string | null>(null);
  const [sideImagePreview, setSideImagePreview] = useState<string | null>(null);
  const [processingPhotos, setProcessingPhotos] = useState(false);
  const [uploadStep, setUploadStep] = useState<
    | "instruction"
    | "upload"
    | "processing"
    | "result"
  >("instruction");

  const handlePhotoUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    photoType: "front" | "back" | "side"
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        const imagePreview = event.target?.result as string;
        if (photoType === "front") {
          setPhotoFront(file);
          setFrontImagePreview(imagePreview);
        } else if (photoType === "back") {
          setPhotoBack(file);
          setBackImagePreview(imagePreview);
        } else {
          setPhotoSide(file);
          setSideImagePreview(imagePreview);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const allPhotosUploaded = photoFront && photoBack && photoSide;

  const processPhotos = async () => {
    if (!allPhotosUploaded) {
      toast({
        title: "Foto mancanti",
        description: "Carica tutte e tre le foto richieste per procedere",
        variant: "destructive",
      });
      return;
    }
    setUploadStep("processing");
    setProcessingPhotos(true);
    toast({
      title: "Elaborazione foto",
      description: "Stiamo analizzando le tue foto...",
    });

    try {
      const formData = new FormData();
      if (photoFront) formData.append("photoFront", photoFront);
      if (photoBack) formData.append("photoBack", photoBack);
      if (photoSide) formData.append("photoSide", photoSide);

      await new Promise(resolve => setTimeout(resolve, 3000)); 
      const mockApiResponse = {
          avatarData: { bodyFatPercentage: 0.162, muscleDefinition: "medium" },
          bodyMeasurements: { weight: 74500, chest: 98, waist: 81, hips: 96, biceps: 35, thighs: 57 }
      };

      const response = mockApiResponse; 

      if (response.avatarData && response.bodyMeasurements) {
        setProcessingPhotos(false);
        setUploadStep("result");
        setScanResult({
          date: new Date(),
          weight: response.bodyMeasurements.weight || 74500,
          bodyFatPercentage: (response.avatarData.bodyFatPercentage || 0.162) * 10000, 
          musclePercentage: 
            response.avatarData.muscleDefinition === "high" ? 3600 :
            response.avatarData.muscleDefinition === "medium" ? 3200 : 2800,
          measurements: {
            chest: response.bodyMeasurements.chest || 98,
            waist: response.bodyMeasurements.waist || 81,
            hips: response.bodyMeasurements.hips || 96,
            biceps: response.bodyMeasurements.biceps || 35,
            thighs: response.bodyMeasurements.thighs || 57,
          },
        });
        toast({
          title: "Analisi completata!",
          description: "L\"avatar 3D è stato generato.",
        });
        refetchScanHistory();
        refetchAvatarCustomizations();
      } else {
        throw new Error("Dati API non validi");
      }
    } catch (error) {
      console.error("Errore processamento foto:", error);
      setProcessingPhotos(false);
      setUploadStep("upload");
      toast({
        title: "Errore Elaborazione",
        description: "Impossibile elaborare le foto. Riprova.",
        variant: "destructive",
      });
    }
  };

  const resetPhotoUpload = () => {
    setPhotoFront(null);
    setPhotoBack(null);
    setPhotoSide(null);
    setFrontImagePreview(null);
    setBackImagePreview(null);
    setSideImagePreview(null);
    setProcessingPhotos(false);
    setUploadStep("instruction");
    setScanResult(null);
    setActiveScan(false);
  };

  const Scanner3D = () => {
    if (activeScan) {
      if (uploadStep === "instruction") {
        return (
          <div className="p-6 md:p-8 text-center bg-gray-50 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Scansione Fotografica 3D</h3>
            <p className="text-gray-700 mb-4">
              Carica 3 foto del tuo corpo per generare un avatar 3D preciso:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-6">
              {[ "Frontale", "Posteriore", "Laterale" ].map(view => (
                <div key={view} className="bg-white p-3 rounded-lg shadow-sm text-center">
                  <div className="w-full h-24 bg-gray-200 rounded-md flex items-center justify-center mb-2">
                    <Camera className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="font-semibold text-sm">{view}</p>
                </div>
              ))}
            </div>
            <Button onClick={() => setUploadStep("upload")} size="lg">
              Inizia Caricamento
            </Button>
            <Button variant="outline" onClick={resetPhotoUpload} className="ml-2">Annulla</Button>
            <p className="mt-4 text-xs text-gray-500">
              Le foto sono usate solo per generare l_avatar e non saranno condivise.
            </p>
          </div>
        );
      }
      if (uploadStep === "upload") {
        return (
          <div className="p-6 md:p-8 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-bold mb-6 text-center">Carica le Tue Foto</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
              {[ "front", "back", "side" ].map((type) => {
                const preview = type === "front" ? frontImagePreview : type === "back" ? backImagePreview : sideImagePreview;
                return (
                  <div key={type} className="flex flex-col items-center">
                    <p className="font-medium mb-2 capitalize">Foto {type}</p>
                    <div className="relative w-full aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden mb-2 shadow-inner">
                      {preview ? (
                        <img src={preview} alt={`Anteprima ${type}`} className="w-full h-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                          <Camera className="h-10 w-10 text-gray-400 mb-1" />
                          <p className="text-xs text-gray-500 text-center">Vista {type}</p>
                        </div>
                      )}
                    </div>
                    <input type="file" id={`${type}Photo`} className="hidden" accept="image/*" onChange={(e) => handlePhotoUpload(e, type as "front" | "back" | "side")} />
                    <label htmlFor={`${type}Photo`} className="w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 cursor-pointer">
                      {preview ? "Cambia" : "Carica"}
                    </label>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center space-x-3">
                <Button onClick={processPhotos} disabled={!allPhotosUploaded || processingPhotos} size="lg">
                  {processingPhotos ? <Loader className="animate-spin h-5 w-5 mr-2" /> : <Upload className="h-5 w-5 mr-2" />} Genera Avatar
                </Button>
                <Button variant="outline" onClick={resetPhotoUpload} disabled={processingPhotos}>Annulla</Button>
            </div>
          </div>
        );
      }
      if (uploadStep === "processing") {
        return (
          <div className="p-8 text-center bg-gray-50 rounded-lg min-h-[300px] flex flex-col justify-center items-center">
            <Loader className="animate-spin h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold">Elaborazione in corso...</h3>
            <p className="text-gray-600">Stiamo creando il tuo avatar 3D. Potrebbe volerci qualche istante.</p>
          </div>
        );
      }
      if (uploadStep === "result" && scanResult) {
        return (
          <div className="p-6 md:p-8 bg-gray-50 rounded-lg">
            <h3 className="text-2xl font-bold mb-4 text-center text-green-600">Avatar Creato!</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card>
                    <CardHeader><CardTitle className="text-base">Misure Stimate</CardTitle></CardHeader>
                    <CardContent className="text-sm space-y-1">
                        {Object.entries(scanResult.measurements).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                                <span className="capitalize text-gray-600">{key.replace(/([A-Z])/g, " $1")}:</span> 
                                <span className="font-medium">{value as number} cm</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle className="text-base">Composizione Corporea</CardTitle></CardHeader>
                    <CardContent className="text-sm space-y-1">
                        <div className="flex justify-between"><span className="text-gray-600">Peso:</span> <span className="font-medium">{(scanResult.weight / 1000).toFixed(1)} kg</span></div>
                        <div className="flex justify-between"><span className="text-gray-600">Grasso:</span> <span className="font-medium">{(scanResult.bodyFatPercentage / 100).toFixed(1)}%</span></div>
                        <div className="flex justify-between"><span className="text-gray-600">Muscolo:</span> <span className="font-medium">{(scanResult.musclePercentage / 100).toFixed(1)}%</span></div>
                    </CardContent>
                </Card>
            </div>
            <div className="flex justify-center space-x-3">
              <Button onClick={saveScanResults} size="lg">
                <Save className="mr-2 h-4 w-4" /> Salva Risultati
              </Button>
              <Button variant="outline" onClick={resetPhotoUpload}>Nuova Scansione</Button>
            </div>
          </div>
        );
      }
    }
    return (
      <div className="p-8 text-center bg-gray-100 rounded-lg min-h-[300px] flex flex-col justify-center items-center">
        <Camera className="h-16 w-16 text-primary mb-4" />
        <h3 className="text-xl font-bold mb-2">Crea il tuo Avatar 3D</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">Utilizza la fotocamera del tuo dispositivo o carica delle foto per generare un modello 3D del tuo corpo e monitorare i tuoi progressi.</p>
        <Button onClick={() => { setActiveScan(true); setUploadStep("instruction"); }} size="lg">
          Avvia Scansione Fotografica
        </Button>
      </div>
    );
  };

  const ProgressTracker = () => {
    const chartData = getProgressChartData();
    if (scanHistoryLoading) return <div className="flex justify-center items-center h-64"><Loader className="animate-spin h-8 w-8 text-primary" /></div>;
    if (!scanHistory || scanHistory.length === 0) {
      return <p className="text-center text-gray-500 py-8">Nessuna scansione precedente trovata. Effettua una scansione per iniziare a tracciare i progressi.</p>;
    }
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Andamento Peso (kg)</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis domain={["dataMin - 2", "dataMax + 2"]} fontSize={12} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Peso" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Grasso Corporeo (%)</CardTitle></CardHeader>
              <CardContent className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" fontSize={12} />
                    <YAxis domain={["dataMin - 2", "dataMax + 2"]} fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Grasso (%)" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Massa Muscolare (%)</CardTitle></CardHeader>
              <CardContent className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" fontSize={12} />
                    <YAxis domain={["dataMin - 2", "dataMax + 2"]} fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="Muscolo (%)" stroke="#22c55e" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
        </div>
      </div>
    );
  };
  
  const AvatarCustomizer = () => {
    if (avatarCustomizationsLoading) return <div className="flex justify-center items-center h-64"><Loader className="animate-spin h-8 w-8 text-primary" /></div>;
    return (
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-4">Personalizza il tuo Avatar</h3>
        {avatarCustomizations && avatarCustomizations.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {avatarCustomizations.map(item => (
              <Card key={item.id} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-gray-200 flex items-center justify-center">
                  {item.thumbnailUrl ? <img src={item.thumbnailUrl} alt={item.name} className="w-full h-full object-cover"/> : <Camera className="h-10 w-10 text-gray-400"/>}
                </div>
                <CardContent className="p-2 text-center">
                  <p className="text-xs font-medium truncate">{item.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{item.category}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">Nessuna opzione di personalizzazione disponibile al momento.</p>
        )}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-lightBg">
      <Sidebar />
      <main className="flex-1 overflow-hidden flex flex-col">
        <TopBar title="Avatar 3D e Progresso Corporeo" />
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <Tabs defaultValue="avatar" onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-4">
              <TabsTrigger value="avatar">Il Mio Avatar</TabsTrigger>
              <TabsTrigger value="scanner">Scanner 3D</TabsTrigger>
              <TabsTrigger value="progress">Progresso Corporeo</TabsTrigger>
              <TabsTrigger value="customize">Personalizza</TabsTrigger>
            </TabsList>
            <TabsContent value="avatar">
              <Card>
                <CardHeader>
                  <CardTitle>Il Tuo Avatar 3D</CardTitle>
                  <CardDescription>Visualizza il tuo modello 3D e le ultime misurazioni.</CardDescription>
                </CardHeader>
                <CardContent>
                  <AvatarViewer />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="scanner">
              <Card>
                <CardHeader>
                  <CardTitle>Scanner 3D Corporeo</CardTitle>
                  <CardDescription>Crea o aggiorna il tuo avatar 3D e traccia le tue misurazioni.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Scanner3D />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="progress">
              <Card>
                <CardHeader>
                  <CardTitle>Tracciamento Progresso Corporeo</CardTitle>
                  <CardDescription>Visualizza l_andamento delle tue misurazioni nel tempo.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProgressTracker />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="customize">
              <Card>
                <CardHeader>
                  <CardTitle>Personalizzazione Avatar</CardTitle>
                  <CardDescription>Modifica l_aspetto del tuo avatar 3D.</CardDescription>
                </CardHeader>
                <CardContent>
                  <AvatarCustomizer />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <MobileNavigation />
    </div>
  );
}

const BodyScan = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm-3.5-9a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm7 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm-3.5 4a3.5 3.5 0 110-7 3.5 3.5 0 010 7z" />
  </svg>
);

