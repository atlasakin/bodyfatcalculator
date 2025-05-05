import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
  Label,
  TooltipProps
} from "recharts";
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';
import { ArrowLeft, ArrowRight, Loader2, Mail, Info, Instagram } from 'lucide-react';

/****************************
 * Dil (Language) Ayarları - Turkish
 ***************************/
const TR = {
    // Genel UI
    welcomeTitle: "Hoş Geldiniz!",
    welcomeText: "Vücut yağ oranınızı tahmin edelim.",
    startButton: "BAŞLA",
    nextButton: "İleri",
    backButton: "Geri",
    calculateAgainButton: "Tekrar Hesapla",
    estimatorTitle: "Vücut Yağ Oranı Hesaplayıcı",
    infoTitle: "Yöntemler Hakkında",
    infoDisclaimer: "Çeşitli formüller farklı girdiler kullanarak vücut yağını tahmin eder. Sonuçlar değişiklik gösterebilir. Detaylar için sonuç kartlarının üzerine gelin. Bu araç yalnızca tahminler sunar.",
    infoAbbreviationsTitle: "Kısaltmalar:",
    resultsTitle: "Sonuçlar",
    resultsComparisonTitle: "VY% Sonuç Karşılaştırması",
    categoryResultTitle: "Kategoriniz:",
    ctaTitle: "BU VERİYİ SONUCA DÖNÜŞTÜRÜN",
    ctaTextP1: "Vücut yağ oranı önemli bir veridir, ancak tek başına yeterli değildir. Asıl farkı yaratan, bu veriyi bilimsel bir strateji ve disiplinli bir sistemle eyleme dönüştürmektir.",
    ctaTextP2: "Şu anda, sizin gibi hedeflerine ulaşmak isteyenler için, sonuç odaklı online koçluk programları ve sistemleri geliştiriyorum. İlk başlayanlardan olmak, lansmana özel avantajlardan yararlanmak ve sistem hazır olduğunda haberdar olmak için bekleme listesine katılın.",
    ctaButton: "BEKLEME LİSTESİNE KATIL",
    disclaimer: "Uyarı: Bunlar formüllere dayalı tahminlerdir ve klinik ölçümlerden (örn. DXA, BodPod) farklılık gösterebilir. Bunları kesin bir teşhis olarak değil, bir rehber olarak kullanın.",
    noChartData: "Grafiği görüntülemek için veri yok.",
    calculationError: "Hesaplama Hatası. Lütfen baştan başlayın.",
    enterHint: "Devam etmek için Enter'a da basabilirsiniz.",

    // Adımlar
    step1Title: "Cinsiyetinizi Seçin",
    step2Title: "Yaşınız Kaç?",
    step3Title: "Kilonuzu Girin",
    step4Title: "Boyunuzu Girin",
    step5Title: "Boyun Çevrenizi Girin",
    step6Title: "Bel Çevrenizi Girin",
    step7Title: "Kalça Çevrenizi Girin",

    // Etiketler ve Birimler
    genderMale: "Erkek",
    genderFemale: "Kadın",
    ageLabel: "Yaş (yıl)",
    weightLabel: "Kilo",
    heightLabel: "Boy",
    neckLabel: "Boyun Çevresi",
    waistLabel: "Bel Çevresi",
    hipLabel: "Kalça Çevresi",
    unitKg: "kg",
    unitLbs: "lbs",
    unitCm: "cm",
    unitFt: "ft",
    unitIn: "in",
    unitFtIn: "ft / in",
    heightFtLabel: "Fit (ft)",
    heightInLabel: "İnç (in)",

    // Yardımcı Metinler
    waistHelper: "Yatay olarak, göbek deliği hizasından ölçün.",
    hipHelper: "Yatay olarak kalçanın en geniş kısmından ölçün.",
    neckHelper: "Adem elmasının altındaki en dar noktadan ölçün.",

    // Hatalar
    errorSelectGender: "Lütfen bir cinsiyet seçin.",
    errorAgeRequired: "Yaş gerekli.",
    errorWeightRequired: "Kilo gerekli.",
    errorHeightRequired: "Boy gerekli.",
    errorHeightCmRequired: "Boy (cm) gerekli.",
    errorHeightFtRequired: "Fit gerekli.",
    errorHeightInRequired: "İnç gerekli.",
    errorNeckRequired: "Boyun çevresi gerekli.",
    errorWaistRequired: "Bel çevresi gerekli.",
    errorHipRequired: "Kalça çevresi gerekli.",
    errorInvalidNumber: "Geçersiz sayı.",
    errorRange: (min: string, max: string) => `Aralık: ${min}-${max}`,

    // Yükleme Mesajları
    loadingMessages: [
        "Girdiler analiz ediliyor...", "Formüller uygulanıyor...", "BMI hesaplanıyor...", "Navy VY% tahmin ediliyor...",
        "RFM hesaplanıyor...", "CUN-BAE çalıştırılıyor...", "ECORE-BF işleniyor...", "Veriler çapraz kontrol ediliyor...",
        "Tahminler kalibre ediliyor...", "Sonuçlar derleniyor...", "Grafik oluşturuluyor...", "Raporunuz hazırlanıyor...",
        "Neredeyse bitti...", "Sonuçlandırılıyor..."
    ],

    // Yöntem Bilgileri
    methodNotes: {
        BMI_BF: "BMI, Yaş, Cinsiyet kullanır. Sporcularda daha az doğrudur.",
        NAVY: "Boy, Boyun, Bel (ve kadınlar için Kalça) kullanır. Genellikle hatalıdır.",
        RFM: "Boy ve Bel kullanır. Daha basit bant yöntemi.",
        CUN_BAE: "BMI, Yaş, Cinsiyet (E=0, K=1) kullanır. Karmaşık formül.",
        ECORE: "Yaş, Cinsiyet (E=0, K=1), BMI'nin Doğal Logaritması (Ln) kullanır.",
    },
    methodNames: {
        BMI_BF: "BMI Tabanlı VY% (Deurenberg)",
        NAVY: "US Navy VY% (Mezura)",
        RFM: "RFM VY% (Mezura)",
        CUN_BAE: "CUN-BAE VY%",
        ECORE: "ECORE-BF VY%",
    },

    // Kısaltmalar
    abbreviations: {
        "VY%": "Vücut Yağ Yüzdesi", "VKİ": "Vücut Kitle İndeksi",
        "RFM": "Relatif Yağ Kütlesi", "CUN-BAE": "Navarra Tahmincisi",
        "ECORE": "ECORE Tahmincisi", "kg/cm": "Metrik Birimler",
        "lbs/ft/in": "İmperyal Birimler",
    },

    // Kategori Sonuçları
    categoryNames: {
        "Contest Prep": "Yarışma Hazırlığı", "Athletic": "Atletik", "Average": "Ortalama",
        "Overweight": "Fazla Kilolu", "Obese": "Obez", "Unknown": "Bilinmiyor",
    },
    categoryMessages: {
        "Contest Prep": "Aşırı derecede yağsızsınız, tipik olarak yarışma hazırlığı seviyesi. Yeterli toparlanma ve beslenmeye dikkat edin.",
        "Athletic": "Atletik aralıktasınız. Mükemmel iş! Performans hedeflerine odaklanın ve bu sağlıklı kompozisyonu koruyun.",
        "Average": "Ortalama vücut yağ aralığındasınız. Beslenme ve antrenmanı optimize etmek sağlığı, performansı ve estetiği artırabilir.",
        "Overweight": "Kategoriniz Fazla Kilolu. Sürdürülebilir bir kalori açığı ve tutarlı antrenman yoluyla yağ kaybına odaklanmak, önemli sağlık faydaları için önerilir.",
        "Obese": "Kategoriniz Obez. Uzun vadeli sağlığı iyileştirmek ve riskleri azaltmak için profesyonel rehberlikle yağ kaybını önceliklendirmek çok önemlidir.",
        "Unknown": "Kategori belirlenemedi.",
    },

    // Diğer
    bmiValueTitle: "VKİ Değeri", averageBfTitle: "Ort. VY%",
    bmiValueTooltip: "Vücut Kitle İndeksi (Kilo/Boy²)", averageBfTooltip: "Hesaplanan VY% yöntemlerinin ortalaması",
};


/****************************
 * Helper utilities
 ***************************/
const formatValue = (v: number | null | undefined, d = 1): string => { if (typeof v !== 'number' || isNaN(v)) return '-'; return v.toLocaleString("tr-TR", { maximumFractionDigits: d, minimumFractionDigits: d }); };
const validateRange = (min: number, max: number, vStr: string): string => { if (vStr === "" || vStr === "-") return ""; const v = parseFloat(vStr.replace(/,/g, ".")); if (isNaN(v)) return TR.errorInvalidNumber; if (v < min || v > max) return TR.errorRange(formatForInput(min, min % 1 !== 0 ? 1: 0), formatForInput(max, max % 1 !== 0 ? 1: 0)); return ""; };
const parseState = (strValue: string): number | null => { if (strValue === "") return null; const parsed = parseFloat(strValue.replace(/,/g, ".")); return typeof parsed === 'number' && !isNaN(parsed) ? parsed : null; };
const calculateBMI = (weightKg: number | null, heightCm: number | null): number | null => { if (weightKg === null || heightCm === null || heightCm <= 0) return null; const heightM = heightCm / 100; return weightKg / (heightM * heightM); };
const kgToLbs = (kg: number): number => kg * 2.20462; const lbsToKg = (lbs: number): number => lbs / 2.20462; const cmToIn = (cm: number): number => cm / 2.54; const inToCm = (inches: number): number => inches * 2.54;
const cmToFtIn = (cm: number): { ft: number, inches: number } => { const totalInches = cmToIn(cm); const ft = Math.floor(totalInches / 12); const inches = parseFloat((totalInches % 12).toFixed(1)); return { ft, inches }; };
const ftInToCm = (ft: number | null, inches: number | null): number | null => { if (ft === null || inches === null) return null; const totalInches = (ft * 12) + inches; return inToCm(totalInches); };
const formatForInput = (num: number | null, decimals = 1): string => { if (num === null || isNaN(num)) return ''; const value = parseFloat(num.toFixed(decimals)); return value === 0 ? '0' : value.toString(); };

/****************************
 * Renk Paleti
 ***************************/
const PALETTE = { BACKGROUND: "#000033", CARD_BACKGROUND: "#1A1A1A", TEXT_PRIMARY: "#F8F8F8", TEXT_SECONDARY: "#A9A9A9", ACCENT: "#c2a57a", ACCENT_HOVER: "#d1b891", GRID_COLOR: "#333366", BORDER_COLOR: "#333366", ERROR_COLOR: "#f85149", INFO_ICON_COLOR: "#A9A9A9", SUCCESS_COLOR: "#3fb950", WARNING_COLOR: "#eac54f", CHART_COLORS: ["#c2a57a", "#d1b891", "#A9A9A9", "#F8F8F8", "#f85149", "#eac54f", "#3fb950"] };

/****************************
 * Constants & Types
 ***************************/
type UnitSystem = 'metric' | 'imperial'; type Sex = 'male' | 'female';
type FormData = { sex: Sex | null; age: number | null; weightKg: number | null; heightCm: number | null; neckCm: number | null; waistCm: number | null; hipCm: number | null; };
type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9; type BfCategory = "Contest Prep" | "Athletic" | "Average" | "Overweight" | "Obese" | "Unknown";
const METHOD_KEYS = { BMI_BF: "BMI_BF", NAVY: "NAVY", RFM: "RFM", CUN_BAE: "CUN_BAE", ECORE: "ECORE" };

const getBfCategory = (bfPercentage: number | null, sex: Sex | null): BfCategory => { if (bfPercentage === null || sex === null) return "Unknown"; if (sex === 'male') { if (bfPercentage < 8) return "Contest Prep"; if (bfPercentage <= 15) return "Athletic"; if (bfPercentage <= 21) return "Average"; if (bfPercentage <= 26) return "Overweight"; return "Obese"; } else { if (bfPercentage < 14) return "Contest Prep"; if (bfPercentage <= 24) return "Athletic"; if (bfPercentage <= 33) return "Average"; if (bfPercentage <= 39) return "Overweight"; return "Obese"; } };

// --- Gender SVG Icons (Using User Provided Code) ---
const MaleIcon = ({ size = 64, color = PALETTE.TEXT_SECONDARY, strokeWidth = 1.5 }) => ( <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"> <circle cx="10" cy="14" r="5" /> <path d="M19 5l-5.5 5.5" /> <path d="M15 3h6v6" /> </svg> );
const FemaleIcon = ({ size = 64, color = PALETTE.TEXT_SECONDARY, strokeWidth = 1.5 }) => ( <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"> <circle cx="12" cy="8" r="5" /> <line x1="12" y1="13" x2="12" y2="21" /> <line x1="9" y1="18" x2="15" y2="18" /> </svg> );

/****************************
 * Component
 ***************************/
export default function BodyFatEstimatorWizard() {
  /* -------- State -------- */
  const [currentStep, setCurrentStep] = useState<Step>(0); const [unitSystem, setUnitSystem] = useState<UnitSystem>('metric'); const [formData, setFormData] = useState<FormData>({ sex: null, age: null, weightKg: null, heightCm: null, neckCm: null, waistCm: null, hipCm: null }); const [tempInputs, setTempInputs] = useState({ weight: '', heightCm: '', heightFt: '', heightIn: '', neck: '', waist: '', hip: '' }); const [ageStr, setAgeStr] = useState<string>(''); const [errors, setErrors] = useState<Record<string, string>>({}); const [isLoading, setIsLoading] = useState<boolean>(false); const [loadingMessage, setLoadingMessage] = useState<string>(TR.loadingMessages[0]); const [loadingProgress, setLoadingProgress] = useState<number>(0); const [showStep, setShowStep] = useState<boolean>(true); const [hoveredNoteKey, setHoveredNoteKey] = useState<string | null>(null);
  /* -------- Refs for Auto-focus -------- */
  const ageInputRef = useRef<HTMLInputElement>(null); const weightInputRef = useRef<HTMLInputElement>(null); const heightCmInputRef = useRef<HTMLInputElement>(null); const heightFtInputRef = useRef<HTMLInputElement>(null); const neckInputRef = useRef<HTMLInputElement>(null); const waistInputRef = useRef<HTMLInputElement>(null); const hipInputRef = useRef<HTMLInputElement>(null);
  /* -------- Calculations (Memoized) -------- */
  const results = useMemo(() => { if (formData.sex === null || formData.age === null || formData.weightKg === null || formData.heightCm === null || formData.neckCm === null || formData.waistCm === null || (formData.sex === 'female' && formData.hipCm === null)) return null; const { sex, age, weightKg, heightCm, neckCm, waistCm, hipCm } = formData; const calculatedResults: { [key: string]: number | null } = { BMI_VAL: null, BMI_BF: null, NAVY: null, RFM: null, CUN_BAE: null, ECORE: null }; const isMale = sex === 'male'; const sexFactorDeurenberg = isMale ? 1 : 0; const sexFactorCunEcore = isMale ? 0 : 1; const bmi = calculateBMI(weightKg, heightCm); if (bmi !== null) calculatedResults.BMI_VAL = bmi; if (bmi !== null && age !== null) { const bf_bmi = 1.20 * bmi + 0.23 * age - 10.8 * sexFactorDeurenberg - 5.4; calculatedResults.BMI_BF = Math.max(0, bf_bmi); } if (neckCm !== null && waistCm !== null && heightCm !== null) { if (isMale) { const wmn = waistCm - neckCm; if (wmn > 0 && heightCm > 0) { const bf_n = 495 / (1.0324 - 0.19077 * Math.log10(wmn) + 0.15456 * Math.log10(heightCm)) - 450; calculatedResults.NAVY = Math.max(0, bf_n); } } else if (hipCm !== null) { const wphmn = waistCm + hipCm - neckCm; if (wphmn > 0 && heightCm > 0) { const bf_n = 495 / (1.29579 - 0.35004 * Math.log10(wphmn) + 0.22100 * Math.log10(heightCm)) - 450; calculatedResults.NAVY = Math.max(0, bf_n); } } } if (heightCm !== null && waistCm !== null && heightCm > 0 && waistCm > 0) { const hwr = heightCm / waistCm; let bf_r: number | null = null; if (isMale) bf_r = 64 - (20 * hwr); else bf_r = 76 - (20 * hwr); calculatedResults.RFM = Math.max(0, bf_r); } if (bmi !== null && age !== null) { const bmiSq = bmi * bmi; const bf_c = -44.988 + (0.503 * age) + (10.689 * sexFactorCunEcore) + (3.172 * bmi) - (0.026 * bmiSq) + (0.181 * bmi * sexFactorCunEcore) - (0.02 * bmi * age) - (0.005 * bmiSq * sexFactorCunEcore) + (0.00021 * bmiSq * age); calculatedResults.CUN_BAE = Math.max(0, bf_c); } if (bmi !== null && age !== null && bmi > 0) { const lnB = Math.log(bmi); const bf_e = -97.102 + (0.123 * age) + (11.900 * sexFactorCunEcore) + (35.959 * lnB); calculatedResults.ECORE = Math.max(0, bf_e); } const validBfResults = Object.entries(calculatedResults).filter(([k, v]) => k !== 'BMI_VAL' && v !== null && !isNaN(v)).map(([k, v]) => v as number); const averageBf = validBfResults.length > 0 ? validBfResults.reduce((s, v) => s + v, 0) / validBfResults.length : null; return { ...calculatedResults, AVERAGE_BF: averageBf }; }, [formData]);
  /* -------- Chart data & dynamic axis (Memoized) -------- */
  const { chartData, yAxisMax } = useMemo(() => { if (!results) return { chartData: [], yAxisMax: 25 }; const bfValues = Object.entries(results).filter(([k, v]) => k !== 'AVERAGE_BF' && k !== 'BMI_VAL' && v !== null && !isNaN(v)).map(([k, v]) => v as number); const data = Object.entries(results).filter(([k, v]) => k !== 'AVERAGE_BF' && k !== 'BMI_VAL' && v !== null && !isNaN(v)).map(([k, v]) => ({ name: TR.methodNames[k as keyof typeof TR.methodNames] || k, 'BF%': v, key: k })); let maxY = 25; if (bfValues.length > 0) { const maxBf = Math.max(...bfValues, results.AVERAGE_BF ?? 0); maxY = Math.max(maxY, Math.ceil(maxBf / 5) * 5 + 5); } return { chartData: data, yAxisMax: maxY }; }, [results]);
  /* -------- Handlers -------- */
  const validateInputOnChange = (name: string, value: string) => { let error = ''; let min = 0, max = 0; switch (name) { case 'age': min = 15; max = 100; error = validateRange(min, max, value); break; case 'weight': const wMinKg = 30, wMaxKg = 300; min = unitSystem === 'metric' ? wMinKg : kgToLbs(wMinKg); max = unitSystem === 'metric' ? wMaxKg : kgToLbs(wMaxKg); error = validateRange(min, max, value); break; case 'heightCm': min = 100; max = 250; error = validateRange(min, max, value); break; case 'heightFt': min = 3; max = 8; error = validateRange(min, max, value); break; case 'heightIn': min = 0; max = 11.9; error = validateRange(min, max, value); break; case 'neck': min = unitSystem === 'metric' ? 20 : cmToIn(20); max = unitSystem === 'metric' ? 70 : cmToIn(70); error = validateRange(min, max, value); break; case 'waist': min = unitSystem === 'metric' ? 40 : cmToIn(40); max = unitSystem === 'metric' ? 200 : cmToIn(200); error = validateRange(min, max, value); break; case 'hip': min = unitSystem === 'metric' ? 50 : cmToIn(50); max = unitSystem === 'metric' ? 200 : cmToIn(200); error = validateRange(min, max, value); break; } setErrors(prev => ({ ...prev, [name]: error })); };
  const handleNext = useCallback(() => { let isValid = true; let currentErrors: Record<string, string> = {}; Object.keys(errors).forEach(key => { if (errors[key]) isValid = false; }); switch (currentStep) { case 1: if (!formData.sex) { isValid = false; currentErrors['sex'] = TR.errorSelectGender; } break; case 2: if (!ageStr || errors.age) { isValid = false; currentErrors['age'] = errors.age || TR.errorAgeRequired; } else { setFormData(prev => ({ ...prev, age: parseState(ageStr) })); } break; case 3: if (!tempInputs.weight || errors.weight) { isValid = false; currentErrors['weight'] = errors.weight || TR.errorWeightRequired; } else { const weightInKg = unitSystem === 'metric' ? parseState(tempInputs.weight) : lbsToKg(parseState(tempInputs.weight)!); setFormData(prev => ({ ...prev, weightKg: weightInKg })); } break; case 4: let heightCmVal: number | null = null; if (unitSystem === 'metric') { if (!tempInputs.heightCm || errors.heightCm) { isValid = false; currentErrors['heightCm'] = errors.heightCm || TR.errorHeightCmRequired; } else heightCmVal = parseState(tempInputs.heightCm); } else { if (!tempInputs.heightFt || errors.heightFt || !tempInputs.heightIn || errors.heightIn) { isValid = false; if (!tempInputs.heightFt || errors.heightFt) currentErrors['heightFt'] = errors.heightFt || TR.errorHeightFtRequired; if (!tempInputs.heightIn || errors.heightIn) currentErrors['heightIn'] = errors.heightIn || TR.errorHeightInRequired; } else heightCmVal = ftInToCm(parseState(tempInputs.heightFt), parseState(tempInputs.heightIn)); } if (isValid && heightCmVal !== null) { setFormData(prev => ({ ...prev, heightCm: heightCmVal })); } break; case 5: case 6: case 7: const key = currentStep === 5 ? 'neck' : (currentStep === 6 ? 'waist' : 'hip'); const errorMsg = currentStep === 5 ? TR.errorNeckRequired : currentStep === 6 ? TR.errorWaistRequired : TR.errorHipRequired; if (!tempInputs[key as keyof typeof tempInputs] || errors[key]) { isValid = false; currentErrors[key] = errors[key] || errorMsg; } else { const valueInCm = unitSystem === 'metric' ? parseState(tempInputs[key as keyof typeof tempInputs]) : inToCm(parseState(tempInputs[key as keyof typeof tempInputs])!); setFormData(prev => ({ ...prev, [`${key}Cm`]: valueInCm })); } break; } setErrors(currentErrors); if (isValid && Object.values(currentErrors).every(e => !e)) { let nextStep = (currentStep + 1) as Step; if (nextStep === 7 && formData.sex === 'male') nextStep = 8; if (nextStep === 8) { setIsLoading(true); setLoadingProgress(0); } setShowStep(false); setTimeout(() => { setCurrentStep(nextStep); setShowStep(true); }, 300); } }, [currentStep, errors, formData.sex, ageStr, tempInputs, unitSystem]);
  const handleBack = () => { let prevStep = (currentStep - 1) as Step; if (prevStep === 7 && formData.sex === 'male') prevStep = 6; setShowStep(false); setTimeout(() => { setCurrentStep(prevStep); setErrors({}); setShowStep(true); }, 300); };
  const handleStart = () => { setShowStep(false); setTimeout(() => { setCurrentStep(1); setShowStep(true); }, 300); };
   const handleReset = () => { setShowStep(false); setTimeout(() => { setCurrentStep(0); setFormData({ sex: null, age: null, weightKg: null, heightCm: null, neckCm: null, waistCm: null, hipCm: null }); setTempInputs({ weight: '', heightCm: '', heightFt: '', heightIn: '', neck: '', waist: '', hip: '' }); setAgeStr(''); setErrors({}); setIsLoading(false); setUnitSystem('metric'); setLoadingProgress(0); setHoveredNoteKey(null); setShowStep(true); }, 300); };
  const handleUnitToggle = (newSystem: UnitSystem) => { if (newSystem === unitSystem) return; const currentWeight = parseState(tempInputs.weight); const currentHeightCm = parseState(tempInputs.heightCm); const currentHeightFt = parseState(tempInputs.heightFt); const currentHeightIn = parseState(tempInputs.heightIn); const currentNeck = parseState(tempInputs.neck); const currentWaist = parseState(tempInputs.waist); const currentHip = parseState(tempInputs.hip); let newWeight = '', newHeightCm = '', newHeightFt = '', newHeightIn = '', newNeck = '', newWaist = '', newHip = ''; if (newSystem === 'imperial') { if (currentWeight !== null) newWeight = formatForInput(kgToLbs(currentWeight)); if (currentHeightCm !== null) { const { ft, inches } = cmToFtIn(currentHeightCm); newHeightFt = formatForInput(ft, 0); newHeightIn = formatForInput(inches); } if (currentNeck !== null) newNeck = formatForInput(cmToIn(currentNeck)); if (currentWaist !== null) newWaist = formatForInput(cmToIn(currentWaist)); if (currentHip !== null) newHip = formatForInput(cmToIn(currentHip)); } else { if (currentWeight !== null) newWeight = formatForInput(lbsToKg(currentWeight)); const heightCmConverted = ftInToCm(currentHeightFt, currentHeightIn); if (heightCmConverted !== null) newHeightCm = formatForInput(heightCmConverted); if (currentNeck !== null) newNeck = formatForInput(inToCm(currentNeck)); if (currentWaist !== null) newWaist = formatForInput(inToCm(currentWaist)); if (currentHip !== null) newHip = formatForInput(inToCm(currentHip)); } setUnitSystem(newSystem); setTempInputs({ weight: newWeight, heightCm: newHeightCm, heightFt: newHeightFt, heightIn: newHeightIn, neck: newNeck, waist: newWaist, hip: newHip }); setErrors({}); };
  const handleTempInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { const { name, value } = e.target; setTempInputs(prev => ({ ...prev, [name]: value })); validateInputOnChange(name, value); };
   const handleAgeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { const { value } = e.target; setAgeStr(value); validateInputOnChange('age', value); };
    const handleAgeSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => { const { value } = e.target; setAgeStr(value); validateInputOnChange('age', value); };
   const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => { if (event.key === 'Enter' && currentStep >= 2 && currentStep <= 7) { event.preventDefault(); handleNext(); } }, [currentStep, handleNext]);
  useEffect(() => { let messageInterval: NodeJS.Timeout | null = null; let progressInterval: NodeJS.Timeout | null = null; let navigationTimeout: NodeJS.Timeout | null = null; const loadingDuration = 5000; const progressUpdateInterval = 50; if (isLoading && currentStep === 8) { let messageIndex = 0; messageInterval = setInterval(() => { messageIndex = (messageIndex + 1) % TR.loadingMessages.length; setLoadingMessage(TR.loadingMessages[messageIndex]); }, 600); /* Slower message change */ const startTime = Date.now(); progressInterval = setInterval(() => { const elapsedTime = Date.now() - startTime; const progress = Math.min(100, (elapsedTime / loadingDuration) * 100); setLoadingProgress(progress); if (progress >= 100) { if (progressInterval) clearInterval(progressInterval); } }, progressUpdateInterval); navigationTimeout = setTimeout(() => { setIsLoading(false); if (messageInterval) clearInterval(messageInterval); setLoadingProgress(100); setShowStep(false); setTimeout(() => { setCurrentStep(9); setShowStep(true); }, 300); }, loadingDuration); } return () => { if (messageInterval) clearInterval(messageInterval); if (progressInterval) clearInterval(progressInterval); if (navigationTimeout) clearTimeout(navigationTimeout); }; }, [isLoading, currentStep]);
  useEffect(() => { const focusTimeout = setTimeout(() => { if (showStep) { switch (currentStep) { case 2: ageInputRef.current?.focus(); break; case 3: weightInputRef.current?.focus(); break; case 4: if (unitSystem === 'metric') heightCmInputRef.current?.focus(); else heightFtInputRef.current?.focus(); break; case 5: neckInputRef.current?.focus(); break; case 6: waistInputRef.current?.focus(); break; case 7: hipInputRef.current?.focus(); break; } } }, 350); return () => clearTimeout(focusTimeout); }, [currentStep, showStep, unitSystem]);

  /* -------- Render Step -------- */
  const renderStep = () => {
    switch (currentStep) {
      case 0: return ( <div className="text-center py-16"> <h2 className="text-3xl font-bold mb-8" style={{ color: PALETTE.ACCENT }}>{TR.welcomeTitle}</h2> <p className="mb-10 text-lg" style={{ color: PALETTE.TEXT_SECONDARY }}>{TR.welcomeText}</p> <button onClick={handleStart} className="px-10 py-4 text-lg bg-[#c2a57a] hover:bg-[#d1b891] text-[#000033] font-bold rounded-lg transition duration-200 ease-in-out shadow-md flex items-center justify-center mx-auto"> {TR.startButton} <ArrowRight className="ml-3 h-6 w-6" /> </button> </div> );
      case 1: return ( <div className="py-8"> <h2 className="text-2xl font-bold mb-10 text-center" style={{ color: PALETTE.ACCENT }}>{TR.step1Title}</h2> <div className="flex justify-center gap-12 mb-10"> <div onClick={() => setFormData(prev => ({ ...prev, sex: 'male' }))} className={`p-8 rounded-lg border-2 cursor-pointer transition duration-200 ease-in-out ${formData.sex === 'male' ? `border-[${PALETTE.ACCENT}] ring-2 ring-[${PALETTE.ACCENT}] bg-[${PALETTE.CARD_BACKGROUND}]` : `border-[${PALETTE.BORDER_COLOR}] bg-[${PALETTE.CARD_BACKGROUND}] hover:border-[${PALETTE.ACCENT_HOVER}]`}`}> <MaleIcon size={64} color={formData.sex === 'male' ? PALETTE.ACCENT : PALETTE.TEXT_SECONDARY} /> <p className={`mt-3 text-center text-base font-semibold ${formData.sex === 'male' ? `text-[${PALETTE.ACCENT}]` : `text-[${PALETTE.TEXT_SECONDARY}]`}`}>{TR.genderMale}</p> </div> <div onClick={() => setFormData(prev => ({ ...prev, sex: 'female' }))} className={`p-8 rounded-lg border-2 cursor-pointer transition duration-200 ease-in-out ${formData.sex === 'female' ? `border-[${PALETTE.ACCENT}] ring-2 ring-[${PALETTE.ACCENT}] bg-[${PALETTE.CARD_BACKGROUND}]` : `border-[${PALETTE.BORDER_COLOR}] bg-[${PALETTE.CARD_BACKGROUND}] hover:border-[${PALETTE.ACCENT_HOVER}]`}`}> <FemaleIcon size={64} color={formData.sex === 'female' ? PALETTE.ACCENT : PALETTE.TEXT_SECONDARY} /> <p className={`mt-3 text-center text-base font-semibold ${formData.sex === 'female' ? `text-[${PALETTE.ACCENT}]` : `text-[${PALETTE.TEXT_SECONDARY}]`}`}>{TR.genderFemale}</p> </div> </div> {errors.sex && <p className="text-center text-base mb-4" style={{ color: PALETTE.ERROR_COLOR }}>{errors.sex}</p>} </div> );
      case 2: return ( <div className="py-16"> <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: PALETTE.ACCENT }}>{TR.step2Title}</h2> <div className="max-w-lg mx-auto mb-8"> <label htmlFor="ageInput" className="text-base font-semibold mb-2 block text-center" style={{color: PALETTE.TEXT_SECONDARY}}>{TR.ageLabel}</label> <input ref={ageInputRef} id="ageInput" name="age" type="number" inputMode="numeric" min="15" max="100" step="1" onKeyDown={handleKeyDown} className={`px-4 py-3 text-lg rounded-lg outline-none text-white transition duration-200 ease-in-out border w-full mb-4 ${errors.age ? `border-[${PALETTE.ERROR_COLOR}] ring-1 ring-[${PALETTE.ERROR_COLOR}]` : `border-[${PALETTE.BORDER_COLOR}] focus:border-[${PALETTE.ACCENT}] focus:ring-1 focus:ring-[${PALETTE.ACCENT}]`}`} style={{ background: PALETTE.CARD_BACKGROUND }} value={ageStr} onChange={handleAgeInputChange} placeholder="örn. 30" /> <input type="range" min="15" max="100" step="1" value={ageStr || '15'} onChange={handleAgeSliderChange} className="w-full h-3 bg-[#1A1A1A] rounded-lg appearance-none cursor-pointer range-lg accent-[#c2a57a]" /> {errors.age && <p className="text-center text-base mt-3" style={{ color: PALETTE.ERROR_COLOR }}>{errors.age}</p>} <p className="text-xs text-center mt-4" style={{color: PALETTE.TEXT_SECONDARY}}>{TR.enterHint}</p> </div> </div> );
       case 3: const weightUnitLabel = unitSystem === 'metric' ? TR.unitKg : TR.unitLbs; const wMinKg = 30, wMaxKg = 300; const weightMin = unitSystem === 'metric' ? wMinKg : Math.round(kgToLbs(wMinKg)); const weightMax = unitSystem === 'metric' ? wMaxKg : Math.round(kgToLbs(wMaxKg)); return ( <div className="py-8"> <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: PALETTE.ACCENT }}>{TR.step3Title}</h2> <div className="max-w-lg mx-auto mb-8"> <div className="flex justify-center gap-3 mb-6"> <button onClick={() => handleUnitToggle('metric')} className={`px-5 py-2 rounded-md text-base transition ${unitSystem === 'metric' ? `bg-[${PALETTE.ACCENT}] text-[#000033] font-semibold` : `bg-[${PALETTE.CARD_BACKGROUND}] border border-[${PALETTE.BORDER_COLOR}] text-[${PALETTE.TEXT_SECONDARY}] hover:border-[${PALETTE.ACCENT_HOVER}]`}`}>kg</button> <button onClick={() => handleUnitToggle('imperial')} className={`px-5 py-2 rounded-md text-base transition ${unitSystem === 'imperial' ? `bg-[${PALETTE.ACCENT}] text-[#000033] font-semibold` : `bg-[${PALETTE.CARD_BACKGROUND}] border border-[${PALETTE.BORDER_COLOR}] text-[${PALETTE.TEXT_SECONDARY}] hover:border-[${PALETTE.ACCENT_HOVER}]`}`}>lbs</button> </div> <label htmlFor="weightInput" className="text-base font-semibold mb-2 block text-center" style={{color: PALETTE.TEXT_SECONDARY}}>{TR.weightLabel} ({weightUnitLabel})</label> <input ref={weightInputRef} id="weightInput" name="weight" type="number" inputMode="decimal" min={weightMin} max={weightMax} step="0.1" onKeyDown={handleKeyDown} className={`px-4 py-3 text-lg rounded-lg outline-none text-white transition duration-200 ease-in-out border w-full ${errors.weight ? `border-[${PALETTE.ERROR_COLOR}] ring-1 ring-[${PALETTE.ERROR_COLOR}]` : `border-[${PALETTE.BORDER_COLOR}] focus:border-[${PALETTE.ACCENT}] focus:ring-1 focus:ring-[${PALETTE.ACCENT}]`}`} style={{ background: PALETTE.CARD_BACKGROUND }} value={tempInputs.weight} onChange={handleTempInputChange} placeholder={`örn. ${unitSystem === 'metric' ? '80' : '175'}`} /> {errors.weight && <p className="text-center text-base mt-3" style={{ color: PALETTE.ERROR_COLOR }}>{errors.weight}</p>} <p className="text-xs text-center mt-4" style={{color: PALETTE.TEXT_SECONDARY}}>{TR.enterHint}</p> </div> </div> );
      case 4: return ( <div className="py-8"> <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: PALETTE.ACCENT }}>{TR.step4Title}</h2> <div className="max-w-lg mx-auto mb-8"> <div className="flex justify-center gap-3 mb-6"> <button onClick={() => handleUnitToggle('metric')} className={`px-5 py-2 rounded-md text-base transition ${unitSystem === 'metric' ? `bg-[${PALETTE.ACCENT}] text-[#000033] font-semibold` : `bg-[${PALETTE.CARD_BACKGROUND}] border border-[${PALETTE.BORDER_COLOR}] text-[${PALETTE.TEXT_SECONDARY}] hover:border-[${PALETTE.ACCENT_HOVER}]`}`}>{TR.unitCm}</button> <button onClick={() => handleUnitToggle('imperial')} className={`px-5 py-2 rounded-md text-base transition ${unitSystem === 'imperial' ? `bg-[${PALETTE.ACCENT}] text-[#000033] font-semibold` : `bg-[${PALETTE.CARD_BACKGROUND}] border border-[${PALETTE.BORDER_COLOR}] text-[${PALETTE.TEXT_SECONDARY}] hover:border-[${PALETTE.ACCENT_HOVER}]`}`}>{TR.unitFtIn}</button> </div> {unitSystem === 'metric' ? ( <div> <label htmlFor="heightCmInput" className="text-base font-semibold mb-2 block text-center" style={{color: PALETTE.TEXT_SECONDARY}}>{TR.heightLabel} ({TR.unitCm})</label> <input ref={heightCmInputRef} id="heightCmInput" name="heightCm" type="number" inputMode="decimal" min="100" max="250" step="0.1" onKeyDown={handleKeyDown} className={`px-4 py-3 text-lg rounded-lg outline-none text-white transition duration-200 ease-in-out border w-full ${errors.heightCm ? `border-[${PALETTE.ERROR_COLOR}] ring-1 ring-[${PALETTE.ERROR_COLOR}]` : `border-[${PALETTE.BORDER_COLOR}] focus:border-[${PALETTE.ACCENT}] focus:ring-1 focus:ring-[${PALETTE.ACCENT}]`}`} style={{ background: PALETTE.CARD_BACKGROUND }} value={tempInputs.heightCm} onChange={handleTempInputChange} placeholder="örn. 180" /> {errors.heightCm && <p className="text-center text-base mt-3" style={{ color: PALETTE.ERROR_COLOR }}>{errors.heightCm}</p>} </div> ) : ( <div className="flex gap-6"> <div className="flex-1"> <label htmlFor="heightFtInput" className="text-base font-semibold mb-2 block text-center" style={{color: PALETTE.TEXT_SECONDARY}}>{TR.heightFtLabel}</label> <input ref={heightFtInputRef} id="heightFtInput" name="heightFt" type="number" inputMode="numeric" min="3" max="8" step="1" onKeyDown={handleKeyDown} className={`px-4 py-3 text-lg rounded-lg outline-none text-white transition duration-200 ease-in-out border w-full ${errors.heightFt ? `border-[${PALETTE.ERROR_COLOR}] ring-1 ring-[${PALETTE.ERROR_COLOR}]` : `border-[${PALETTE.BORDER_COLOR}] focus:border-[${PALETTE.ACCENT}] focus:ring-1 focus:ring-[${PALETTE.ACCENT}]`}`} style={{ background: PALETTE.CARD_BACKGROUND }} value={tempInputs.heightFt} onChange={handleTempInputChange} placeholder="örn. 5" /> {errors.heightFt && <p className="text-center text-base mt-3" style={{ color: PALETTE.ERROR_COLOR }}>{errors.heightFt}</p>} </div> <div className="flex-1"> <label htmlFor="heightInInput" className="text-base font-semibold mb-2 block text-center" style={{color: PALETTE.TEXT_SECONDARY}}>{TR.heightInLabel}</label> <input id="heightInInput" name="heightIn" type="number" inputMode="decimal" min="0" max="11.9" step="0.1" onKeyDown={handleKeyDown} className={`px-4 py-3 text-lg rounded-lg outline-none text-white transition duration-200 ease-in-out border w-full ${errors.heightIn ? `border-[${PALETTE.ERROR_COLOR}] ring-1 ring-[${PALETTE.ERROR_COLOR}]` : `border-[${PALETTE.BORDER_COLOR}] focus:border-[${PALETTE.ACCENT}] focus:ring-1 focus:ring-[${PALETTE.ACCENT}]`}`} style={{ background: PALETTE.CARD_BACKGROUND }} value={tempInputs.heightIn} onChange={handleTempInputChange} placeholder="örn. 11" /> {errors.heightIn && <p className="text-center text-base mt-3" style={{ color: PALETTE.ERROR_COLOR }}>{errors.heightIn}</p>} </div> </div> )} <p className="text-xs text-center mt-4" style={{color: PALETTE.TEXT_SECONDARY}}>{TR.enterHint}</p> </div> </div> );
       case 5: case 6: case 7: const stepKey = currentStep === 5 ? 'neck' : (currentStep === 6 ? 'waist' : 'hip'); const title = currentStep === 5 ? TR.step5Title : currentStep === 6 ? TR.step6Title : TR.step7Title; const label = currentStep === 5 ? TR.neckLabel : currentStep === 6 ? TR.waistLabel : TR.hipLabel; const inputRef = currentStep === 5 ? neckInputRef : (currentStep === 6 ? waistInputRef : hipInputRef); const circUnitLabel = unitSystem === 'metric' ? TR.unitCm : TR.unitIn; const minCm = stepKey === 'neck' ? 20 : (stepKey === 'waist' ? 40 : 50); const maxCm = stepKey === 'neck' ? 70 : 200; const circMin = unitSystem === 'metric' ? minCm : Math.round(cmToIn(minCm)); const circMax = unitSystem === 'metric' ? maxCm : Math.round(cmToIn(maxCm)); const placeholder = unitSystem === 'metric' ? (stepKey === 'neck' ? '40' : (stepKey === 'waist' ? '85' : '95')) : (stepKey === 'neck' ? '16' : (stepKey === 'waist' ? '34' : '38')); const helperText = stepKey === 'neck' ? TR.neckHelper : stepKey === 'waist' ? TR.waistHelper : TR.hipHelper;
        return ( <div className="py-8"> <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: PALETTE.ACCENT }}>{title}</h2> <div className="max-w-lg mx-auto mb-8"> <label htmlFor={`${stepKey}Input`} className="text-base font-semibold mb-2 block text-center" style={{color: PALETTE.TEXT_SECONDARY}}>{label} ({circUnitLabel})</label> <input ref={inputRef} id={`${stepKey}Input`} name={stepKey} type="number" inputMode="decimal" min={circMin} max={circMax} step="0.1" onKeyDown={handleKeyDown} className={`px-4 py-3 text-lg rounded-lg outline-none text-white transition duration-200 ease-in-out border w-full ${errors[stepKey] ? `border-[${PALETTE.ERROR_COLOR}] ring-1 ring-[${PALETTE.ERROR_COLOR}]` : `border-[${PALETTE.BORDER_COLOR}] focus:border-[${PALETTE.ACCENT}] focus:ring-1 focus:ring-[${PALETTE.ACCENT}]`}`} style={{ background: PALETTE.CARD_BACKGROUND }} value={tempInputs[stepKey as keyof typeof tempInputs]} onChange={handleTempInputChange} placeholder={`örn. ${placeholder}`} /> <p className="text-xs text-center mt-2" style={{color: PALETTE.TEXT_SECONDARY}}>{helperText}</p> {errors[stepKey] && <p className="text-center text-base mt-3" style={{ color: PALETTE.ERROR_COLOR }}>{errors[stepKey]}</p>} <p className="text-xs text-center mt-4" style={{color: PALETTE.TEXT_SECONDARY}}>{TR.enterHint}</p> </div> </div> );
       case 8: return ( <div className="text-center py-24"> <div className="relative inline-block mb-8"> <Loader2 className="h-20 w-20 mx-auto animate-spin" style={{ color: PALETTE.ACCENT }} /> <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center"> <span className="text-lg font-semibold" style={{ color: PALETTE.TEXT_PRIMARY }}> {loadingProgress.toFixed(0)}% {/* Removed decimal */} </span> </div> </div> <p className="text-xl font-semibold" style={{ color: PALETTE.TEXT_SECONDARY }}>{loadingMessage}</p> </div> );
       case 9: if (!results) { return <div className="text-center py-10" style={{ color: PALETTE.ERROR_COLOR }}>{TR.calculationError}</div>; } const avgBf = results.AVERAGE_BF; const userCategory = getBfCategory(avgBf, formData.sex); const showCTA = avgBf !== null && ["Average", "Overweight", "Obese"].includes(userCategory); let categoryMessage = TR.categoryMessages[userCategory]; let categoryColor = PALETTE.TEXT_SECONDARY;
        if (userCategory !== "Unknown") { switch (userCategory) { case "Contest Prep": categoryColor = PALETTE.ACCENT; break; case "Athletic": categoryColor = PALETTE.SUCCESS_COLOR; break; case "Average": categoryColor = PALETTE.WARNING_COLOR; break; case "Overweight": case "Obese": categoryColor = PALETTE.ERROR_COLOR; break; } }
        return ( <div className="py-8"> <section className="mb-10 sm:mb-12"> <h2 className="text-3xl font-bold mb-6 sm:mb-8 text-center" style={{ color: PALETTE.ACCENT }}>{TR.resultsTitle}</h2> <p className="text-center text-sm mb-6 max-w-2xl mx-auto" style={{color: PALETTE.TEXT_SECONDARY}}> {TR.disclaimer} </p> {/* Results Grid: 6 items then centered average */} <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-5 mb-4"> <div key="BMI_VAL" className={`p-4 rounded-lg shadow text-center border border-[${PALETTE.BORDER_COLOR}]`} style={{ background: PALETTE.CARD_BACKGROUND }} title={TR.bmiValueTooltip}> <h3 className="text-xs sm:text-sm font-semibold mb-2 leading-tight flex flex-col justify-center h-12" style={{color: PALETTE.TEXT_SECONDARY}}>{TR.bmiValueTitle}</h3> <p className="text-lg sm:text-xl font-bold" style={{ color: PALETTE.ACCENT }}>{formatValue(results.BMI_VAL)}</p> </div> {Object.entries(results).map(([key, value]) => { if (key === 'BMI_VAL' || key === 'AVERAGE_BF') return null; const methodKey = key as keyof typeof METHOD_KEYS; const displayName = TR.methodNames[methodKey] || key; const note = TR.methodNotes[methodKey] || ''; return ( <div key={key} className={`p-4 rounded-lg shadow text-center border border-[${PALETTE.BORDER_COLOR}] relative group/note`} style={{ background: PALETTE.CARD_BACKGROUND }} onMouseEnter={() => setHoveredNoteKey(key)} onMouseLeave={() => setHoveredNoteKey(null)} > <h3 className="text-xs sm:text-sm font-semibold mb-2 leading-tight flex flex-col justify-center h-12 items-center" style={{color: PALETTE.TEXT_SECONDARY}}> <span>{displayName}</span> </h3> <p className="text-lg sm:text-xl font-bold" style={{ color: PALETTE.ACCENT }}>{formatValue(value)}%</p> {hoveredNoteKey === key && ( <p className="text-xs mt-2 px-2 py-1 absolute left-1/2 -translate-x-1/2 bottom-full mb-1 z-10 w-max max-w-xs rounded bg-black border border-gray-700 shadow-lg" style={{ color: PALETTE.TEXT_SECONDARY }}> {note} </p> )} </div> ); })} </div> <div className="flex justify-center"> <div key="AVERAGE_BF" className={`p-4 rounded-lg shadow text-center border border-[${PALETTE.BORDER_COLOR}] w-full sm:w-1/3 md:w-1/4 lg:w-1/7`} style={{ background: PALETTE.CARD_BACKGROUND }} title={TR.averageBfTooltip}> <h3 className="text-xs sm:text-sm font-semibold mb-2 leading-tight flex flex-col justify-center h-12" style={{color: PALETTE.TEXT_SECONDARY}}>{TR.averageBfTitle}</h3> <p className="text-lg sm:text-xl font-bold" style={{ color: PALETTE.ERROR_COLOR }}>{formatValue(results.AVERAGE_BF)}%</p> </div> </div> </section> {userCategory !== "Unknown" && ( <section className="mb-10 sm:mb-12 text-center p-6 rounded-lg border" style={{ borderColor: categoryColor, background: PALETTE.CARD_BACKGROUND }}> <h3 className="text-xl font-semibold mb-2" style={{ color: categoryColor }}> {TR.categoryResultTitle} {TR.categoryNames[userCategory]} </h3> <p style={{ color: PALETTE.TEXT_SECONDARY }}>{categoryMessage}</p> </section> )} <section className="mb-12"> <h2 className="text-2xl font-bold mb-6 sm:mb-8 text-center" style={{ color: PALETTE.ACCENT }}>{TR.resultsComparisonTitle}</h2> {chartData.length > 0 ? ( <div style={{ width: '100%', height: 400 }}> <ResponsiveContainer> <BarChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 70 }}> <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.GRID_COLOR} /> <XAxis dataKey="name" stroke={PALETTE.TEXT_SECONDARY} tick={{ fontSize: 11, fill: PALETTE.TEXT_SECONDARY }} angle={-45} textAnchor="end" height={80} interval={0} /> <YAxis stroke={PALETTE.TEXT_SECONDARY} tick={{ fontSize: 11, fill: PALETTE.TEXT_SECONDARY }} unit="%" domain={[0, yAxisMax]} allowDataOverflow={true} /> <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(201, 209, 217, 0.1)' /* TEXT_PRIMARY with low alpha */ }}/> <Bar dataKey="BF%" fill={PALETTE.ACCENT} name="VY%" /> {results.AVERAGE_BF !== null && ( <ReferenceLine y={results.AVERAGE_BF} stroke={PALETTE.ERROR_COLOR} strokeDasharray="5 5" strokeWidth={2}> <Label value={`Ort: ${formatValue(results.AVERAGE_BF)}%`} position="insideTopRight" fill={PALETTE.ERROR_COLOR} fontSize={12} fontWeight="bold" /> </ReferenceLine> )} </BarChart> </ResponsiveContainer> </div> ) : ( <p style={{ color: PALETTE.TEXT_SECONDARY }} className="text-center py-10">{TR.noChartData}</p> )} </section> {showCTA && ( <section className="mb-12 text-center p-8 rounded-lg border" style={{ borderColor: PALETTE.ACCENT, background: PALETTE.CARD_BACKGROUND }}> <h3 className="text-2xl font-semibold mb-4" style={{ color: PALETTE.ACCENT }}>{TR.ctaTitle}</h3> {/* Split CTA text into two paragraphs */} <p className="mb-3 text-lg" style={{ color: PALETTE.TEXT_SECONDARY }}> {TR.ctaTextP1} </p> <p className="mb-6 text-lg" style={{ color: PALETTE.TEXT_SECONDARY }}> {TR.ctaTextP2} </p> <a href="https://forms.gle/GvbBvRDibfLz5DT36" /* Updated Link */ target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-8 py-3 text-lg bg-[#c2a57a] hover:bg-[#d1b891] text-[#000033] font-bold rounded-lg transition duration-200 ease-in-out shadow-md" > <Mail className="mr-2 h-5 w-5" /> {TR.ctaButton} </a> </section> )} <div className="text-center"> <button onClick={handleReset} className="px-8 py-3 text-lg bg-[#1A1A1A] hover:bg-[#333333] text-[#F8F8F8] font-semibold rounded-lg transition duration-200 ease-in-out shadow-md border border-[#333366]"> {TR.calculateAgainButton} </button> </div> </div> );
      default: return <div>Bilinmeyen Adım</div>;
    }
  };

  // Tooltip for Results Chart
  const CustomBarTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => { if (active && payload && payload.length) { const data = payload[0].payload; return ( <div className="p-3 rounded border text-base" style={{ background: PALETTE.CARD_BACKGROUND, borderColor: PALETTE.BORDER_COLOR, color: PALETTE.TEXT_PRIMARY }}> <p className="font-bold mb-1" style={{ color: PALETTE.ACCENT }}>{`${data.name}`}</p> <p style={{ color: PALETTE.TEXT_PRIMARY }}>{`VY%: ${formatValue(data['BF%'])}%`}</p> </div> ); } return null; };

  return (
    // Adjusted main container: removed justify-center, added pb-24 for spacing below buttons
    <div className="mx-auto max-w-5xl p-6 sm:p-10 lg:p-14 rounded-2xl shadow-xl font-sans min-h-screen flex flex-col relative pb-24" /* Changed min-h, removed justify-center, added pb */ style={{ background: PALETTE.BACKGROUND, color: PALETTE.TEXT_PRIMARY }}>
         {/* Logo added top-left */}
         <img src="/Logo.png" alt="Logo" className="absolute top-6 left-6 sm:top-10 sm:left-10 h-10 sm:h-12 w-auto" /> {/* Adjust height (h-10/h-12) as needed */}

         <div className="relative text-center mb-10 sm:mb-14 flex-shrink-0"> {/* Header part */}
             <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight inline-block" style={{ color: PALETTE.ACCENT }}> {TR.estimatorTitle} </h1>
             <div className="absolute top-0 right-0 -mt-2 h-full flex items-start group">
                 <span className="cursor-help rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-sm sm:text-base font-bold" style={{ background: PALETTE.CARD_BACKGROUND, color: PALETTE.INFO_ICON_COLOR, border: `1px solid ${PALETTE.BORDER_COLOR}`}}><Info size={16}/></span>
                 <div className="absolute top-full right-0 mt-2 w-72 p-4 rounded shadow-lg text-left text-sm z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto" style={{ background: PALETTE.CARD_BACKGROUND, border: `1px solid ${PALETTE.BORDER_COLOR}` }}>
                     <p className="font-semibold mb-2 text-base" style={{color: PALETTE.ACCENT}}>{TR.infoTitle}</p>
                     <p className="text-xs mb-3" style={{color: PALETTE.TEXT_SECONDARY}}>{TR.infoDisclaimer}</p>
                     <p className="font-semibold mb-2 text-base" style={{color: PALETTE.ACCENT}}>{TR.infoAbbreviationsTitle}</p>
                     <ul className="list-none space-y-1.5">{Object.entries(TR.abbreviations).map(([key, value]) => (<li key={key}><strong style={{ color: PALETTE.TEXT_PRIMARY }}>{key}:</strong> {value}</li>))}</ul>
                 </div>
             </div>
         </div>
         <div className={`flex-grow transition-opacity duration-300 ease-in-out ${showStep ? 'opacity-100' : 'opacity-0'}`}> {/* Step content takes remaining space */}
             {renderStep()}
         </div>
         {currentStep > 0 && currentStep < 8 && (
            // Added margin-bottom to prevent overlap with absolute positioned Instagram icon
             <div className="flex justify-between mt-12 mb-16 flex-shrink-0"> {/* Added mb-16 */}
                 <button onClick={handleBack} className="px-8 py-3 text-lg bg-[#1A1A1A] hover:bg-[#333333] text-[#F8F8F8] font-semibold rounded-lg transition duration-200 ease-in-out shadow-md border border-[#333366] flex items-center" disabled={isLoading}>
                     <ArrowLeft className="mr-2 h-6 w-6" /> {TR.backButton}
                 </button>
                 <button onClick={handleNext} className={`px-8 py-3 text-lg font-bold rounded-lg transition duration-200 ease-in-out shadow-md flex items-center ${!formData.sex && currentStep === 1 ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : `bg-[${PALETTE.ACCENT}] hover:bg-[${PALETTE.ACCENT_HOVER}] text-[#000033]`}`} disabled={isLoading || (currentStep === 1 && !formData.sex) || Object.values(errors).some(e => !!e)}>
                     {TR.nextButton} <ArrowRight className="ml-2 h-6 w-6" />
                 </button>
             </div>
         )}
         {/* Instagram Link - Positioned bottom right */}
         <a href="https://www.instagram.com/atlasakin/" target="_blank" rel="noopener noreferrer" title="Instagram @atlasakin" className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 text-[#A9A9A9] hover:text-[#c2a57a] transition duration-200 ease-in-out z-10">
             <Instagram size={28} />
         </a>
     </div>
  );
}
