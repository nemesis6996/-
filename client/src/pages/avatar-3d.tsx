import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { addCustomization } from "@/store/avatar-slice"; // Rimossi setCustomizations e selectAvatarById perché non utilizzati o non esportati correttamente
import { BodyMeasurements, AvatarData, AvatarCustomization as AvatarCustomizationSchemaItem } from "@shared/schema";

// Placeholder per un visualizzatore 3D
const Placeholder3DViewer = ({ customizations }: { customizations: AvatarCustomizationSchemaItem[] }) => {
  const bodyFatCustomization = customizations.find((c: AvatarCustomizationSchemaItem) => c.category === "corpo" && c.id === "percentualeGrasso");
  const muscleCustomization = customizations.find((c: AvatarCustomizationSchemaItem) => c.category === "corpo" && c.id === "definizioneMuscolare");

  const bodyFat = typeof bodyFatCustomization?.value === 'number' ? bodyFatCustomization.value : 20;
  const muscle = typeof muscleCustomization?.value === 'number' ? muscleCustomization.value : 50;

  return (
    <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center shadow-inner">
      <div className="text-center text-gray-500 dark:text-gray-400">
        <i className="ri-user-smile-line text-6xl mb-2"></i>
        <p>Visualizzatore Avatar 3D (Placeholder)</p>
        <p className="text-xs mt-1">Grasso: {bodyFat}%, Muscoli: {muscle}%</p>
      </div>
    </div>
  );
};

interface ScanResponse {
  success: boolean;
  bodyMeasurements?: BodyMeasurements;
  avatarData?: AvatarData;
  error?: string;
}

const Avatar3DPage = () => {
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  
  const allCustomizations = useSelector((state: RootState) => state.avatar.customizations);
  const activeAvatarId = allCustomizations.length > 0 && allCustomizations[0].id ? allCustomizations[0].id : "default-avatar";
  
  const customizations = useSelector((state: RootState) => 
    state.avatar.customizations.filter((c: AvatarCustomizationSchemaItem) => c.id === activeAvatarId) // Tipizzato 'c'
  );

  const getCustomizationValue = (id: string, defaultValue: string | number) => {
    const cust = customizations.find((c: AvatarCustomizationSchemaItem) => c.id === id); // Tipizzato 'c'
    return cust ? cust.value : defaultValue;
  };

  const [bodyFat, setBodyFat] = useState(() => getCustomizationValue("percentualeGrasso", 20) as number);
  const [muscleDefinition, setMuscleDefinition] = useState(() => getCustomizationValue("definizioneMuscolare", 50) as number);
  const [skinTone, setSkinTone] = useState(() => getCustomizationValue("tonoPelle", "#C68642") as string);
  const [hairStyle, setHairStyle] = useState(() => getCustomizationValue("stileCapelli", "corti") as string);

  const isLoadingAvatar = useSelector((state: RootState) => state.avatar.loading);
  const isSavingAvatar = false; 

  const [isScanning, setIsScanning] = useState(false);
  const handleBodyScan = async () => {
    setIsScanning(true);
    toast({ title: "Scansione corporea avviata...", description: "Mantieni la posizione per qualche secondo." });
    
    await new Promise(resolve => setTimeout(resolve, 3000));

    const scanSucceeded = Math.random() > 0.2;
    let scanResult: ScanResponse;

    if (scanSucceeded) {
      const newBodyFat = Math.floor(Math.random() * 25) + 10;
      const newMuscleDef = Math.floor(Math.random() * 60) + 20;
      scanResult = {
        success: true,
        bodyMeasurements: {
          weight: Math.floor(Math.random() * 30000) + 50000,
          height: Math.floor(Math.random() * 50) + 150,
        },
        avatarData: {
          url: "/placeholder-avatar-updated.glb",
          bodyFatPercentage: newBodyFat,
          muscleDefinition: newMuscleDef > 60 ? "high" : newMuscleDef > 40 ? "medium" : "low",
        }
      };
      setBodyFat(newBodyFat);
      setMuscleDefinition(newMuscleDef);
      
      dispatch(addCustomization({ avatarId: activeAvatarId, id: "percentualeGrasso", value: newBodyFat, category: "corpo" } as AvatarCustomizationSchemaItem));
      dispatch(addCustomization({ avatarId: activeAvatarId, id: "definizioneMuscolare", value: newMuscleDef, category: "corpo" } as AvatarCustomizationSchemaItem));

      toast({ title: "Scansione completata!", description: "Il tuo avatar è stato aggiornato con le nuove misurazioni." });
    } else {
      scanResult = {
        success: false,
        error: "Impossibile completare la scansione. Assicurati di avere una buona illuminazione e di essere fermo."
      };
      toast({ title: "Scansione fallita", description: scanResult.error, variant: "destructive" });
    }
    setIsScanning(false);
    console.log("Risultato scansione:", scanResult);
  };

  const handleCustomizationChange = (id: string, value: string | number, category: string) => {
    dispatch(addCustomization({ avatarId: activeAvatarId, id, value, category } as AvatarCustomizationSchemaItem));
    
    if (id === "percentualeGrasso") setBodyFat(value as number);
    if (id === "definizioneMuscolare") setMuscleDefinition(value as number);
    if (id === "tonoPelle") setSkinTone(value as string);
    if (id === "stileCapelli") setHairStyle(value as string);
  };

  if (isLoadingAvatar) return <div className="p-6 text-center">Caricamento avatar...</div>;

  return (
    <div className="container mx-auto p-4 md:p-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-3xl font-bold font-heading">Il Tuo Avatar 3D</h1>
        <p className="text-muted-foreground">
          Personalizza il tuo avatar o effettua una scansione corporea per aggiornarlo automaticamente.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Anteprima Avatar</CardTitle>
            </CardHeader>
            <CardContent>
              <Placeholder3DViewer customizations={customizations} />
              <div className="mt-4 text-center">
                <Button onClick={handleBodyScan} disabled={isScanning} size="lg" className="bg-green-600 hover:bg-green-700">
                  {isScanning ? (
                    <><i className="ri-camera-lens-line animate-ping mr-2"></i> Scansione in corso...</>
                  ) : (
                    <><i className="ri-camera-lens-line mr-2"></i> Esegui Scansione Corporea</>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Simula una scansione per aggiornare automaticamente le misurazioni e l_aspetto dell_avatar.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle>Personalizza Manualmente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label htmlFor="bodyFat" className="block text-sm font-medium mb-1">Percentuale Grasso Corporeo: {bodyFat}%</label>
                <Slider
                  id="percentualeGrasso"
                  min={5} max={40} step={1}
                  value={[bodyFat]}
                  onValueChange={(value) => handleCustomizationChange("percentualeGrasso", value[0], "corpo")}
                  disabled={isSavingAvatar}
                />
              </div>
              <div>
                <label htmlFor="muscleDefinition" className="block text-sm font-medium mb-1">Definizione Muscolare: {muscleDefinition}%</label>
                <Slider
                  id="definizioneMuscolare"
                  min={10} max={90} step={1}
                  value={[muscleDefinition]}
                  onValueChange={(value) => handleCustomizationChange("definizioneMuscolare", value[0], "corpo")}
                  disabled={isSavingAvatar}
                />
              </div>
              <div>
                <label htmlFor="skinTone" className="block text-sm font-medium mb-1">Tono Pelle</label>
                <Input 
                  type="color" 
                  id="tonoPelle" 
                  value={skinTone} 
                  onChange={(e) => handleCustomizationChange("tonoPelle", e.target.value, "aspetto")}
                  className="w-full h-10"
                  disabled={isSavingAvatar}
                />
              </div>
              <div>
                <label htmlFor="hairStyle" className="block text-sm font-medium mb-1">Stile Capelli</label>
                <Select 
                  value={hairStyle} 
                  onValueChange={(value) => handleCustomizationChange("stileCapelli", value, "aspetto")}
                  disabled={isSavingAvatar}
                >
                  <SelectTrigger id="stileCapelli">
                    <SelectValue placeholder="Seleziona stile" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corti">Corti</SelectItem>
                    <SelectItem value="medi">Medi</SelectItem>
                    <SelectItem value="lunghi">Lunghi</SelectItem>
                    <SelectItem value="rasati">Rasati</SelectItem>
                    <SelectItem value="coda">Coda di cavallo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                disabled={isSavingAvatar || isLoadingAvatar}
                className="w-full"
              >
                {isSavingAvatar ? "Salvataggio..." : "Salva Personalizzazioni"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Avatar3DPage;

