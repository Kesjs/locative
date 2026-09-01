"use client";

import React, { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  MapPinIcon,
  ShieldCheckIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  SparklesIcon,
  CheckBadgeIcon,
  BuildingOfficeIcon,
  XMarkIcon,
  CheckIcon,
  CurrencyDollarIcon,
  BoltIcon,
  EyeIcon,
  ShareIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

// Mock public property catalogue (dynamically adapted)
const PUBLIC_PROPERTIES = [
  {
    id: "prop-1",
    title: "Villa Standing Fidjrossè Plage",
    type: "Villa 5 Pièces",
    city: "Cotonou",
    district: "Fidjrossè Calvaire",
    address: "Rue 440, à 300m de la Route des Pêches",
    rentFcfa: 350000,
    chargesFcfa: 25000,
    surfaceM2: 180,
    bedrooms: 4,
    bathrooms: 3,
    photos: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
    ],
    features: [
      "Compteur personnel SBEE à carte",
      "Forage avec surpresseur automatique",
      "Groupe électrogène de secours",
      "Climatisation intégrale",
      "Cour clôturée & Parking 2 véhicules",
      "Gardiennage 24/7",
    ],
    visitFee: 3000,
    depositMonths: 3,
    isAvailable: true,
  },
  {
    id: "prop-2",
    title: "Studio Meublé Moderne Haie Vive",
    type: "Studio Meublé",
    city: "Cotonou",
    district: "Haie Vive Cocotiers",
    address: "Avenue Jean-Paul II, quartier diplomatique",
    rentFcfa: 120000,
    chargesFcfa: 10000,
    surfaceM2: 32,
    bedrooms: 1,
    bathrooms: 1,
    photos: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
    ],
    features: [
      "Entièrement meublé & équipé",
      "Internet Fibre optique inclus",
      "Compteur SBEE à carte personnel",
      "Eau SONEB individuelle",
      "Climatisation Inverter",
    ],
    visitFee: 2000,
    depositMonths: 3,
    isAvailable: true,
  },
  {
    id: "prop-3",
    title: "Appartement F3 Standing Ganhi",
    type: "Appartement 3P",
    city: "Cotonou",
    district: "Ganhi / Marina",
    address: "Boulevard de la Marina, proximité banques",
    rentFcfa: 220000,
    chargesFcfa: 15000,
    surfaceM2: 88,
    bedrooms: 2,
    bathrooms: 2,
    photos: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
    ],
    features: [
      "Compteur SBEE personnel",
      "Vidéosurveillance hall d'entrée",
      "Climatisation dans toutes les pièces",
      "Parking réservé",
    ],
    visitFee: 3000,
    depositMonths: 3,
    isAvailable: true,
  },
];

export default function PublicShowcasePage() {
  const params = useParams();
  const slug = (params?.slug as string) || "patrimoine-lokka";

  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [activePropertyModal, setActivePropertyModal] = useState<any>(null);
  const [isVisitModalOpen, setIsVisitModalOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  // Visit form state
  const [visitForm, setVisitForm] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    timeSlot: "10:00 - 12:00",
    message: "",
    paymentChannel: "mtn_momo",
  });
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Filter properties
  const filteredProperties = useMemo(() => {
    return PUBLIC_PROPERTIES.filter((p) => {
      if (selectedType !== "all" && !p.type.toLowerCase().includes(selectedType.toLowerCase())) return false;
      if (selectedDistrict !== "all" && !p.district.toLowerCase().includes(selectedDistrict.toLowerCase())) return false;
      return true;
    });
  }, [selectedType, selectedDistrict]);

  const handleOpenProperty = (prop: any) => {
    setActivePropertyModal(prop);
    setSelectedPhotoIndex(0);
  };

  const handleStartBooking = (prop: any) => {
    setActivePropertyModal(null);
    setIsVisitModalOpen(true);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitForm.name || !visitForm.phone || !visitForm.date) {
      toast.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    setIsBooking(true);
    setTimeout(() => {
      setIsBooking(false);
      setBookingSuccess(true);
      toast.success("Demande de visite transmise avec succès !");
    }, 900);
  };

  const handleDirectWhatsApp = () => {
    const msg = encodeURIComponent(
      `Bonjour, je consulte votre vitrine immobilière sur Lokka (${slug}) et je souhaiterais obtenir des informations sur vos logements disponibles.`
    );
    window.open(`https://wa.me/22997001122?text=${msg}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1C1C1C] font-sans antialiased selection:bg-[#087F5B] selection:text-white">
      {/* Top Brand Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#E8E5E0]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#087F5B] text-white flex items-center justify-center font-extrabold text-[15px] shadow-sm">
              LK
            </div>
            <div>
              <span className="font-extrabold text-[15px] tracking-tight block text-[#0F172A]">
                Résidences Alexandre K.
              </span>
              <span className="text-[11px] font-semibold text-[#087F5B] flex items-center gap-1">
                <ShieldCheckIcon className="w-3.5 h-3.5" /> Conforme Loi 2022-30 🇧🇯
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleDirectWhatsApp}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white text-[12.5px] font-bold shadow-xs transition cursor-pointer"
            >
              <ChatBubbleLeftRightIcon className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp Direct</span>
            </button>
            <a
              href="tel:+22997001122"
              className="p-2 bg-[#FAF9F6] hover:bg-[#E8E5E0] border border-[#E8E5E0] rounded-lg text-[#0F172A] transition"
              title="Appeler le propriétaire"
            >
              <PhoneIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Showcase Banner */}
      <section className="bg-gradient-to-b from-white to-[#FAF9F6] border-b border-[#E8E5E0] py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E6F5EF] text-[#087F5B] border border-[#087F5B]/20 text-[12px] font-bold tracking-wide">
            <SparklesIcon className="w-4 h-4" /> Catalogue Officiel des Logements Disponibles
          </div>

          <h1 className="text-[28px] sm:text-[38px] font-extrabold text-[#0F172A] tracking-tight max-w-3xl mx-auto leading-tight">
            Trouvez votre prochain logement de standing à Cotonou &amp; Calavi
          </h1>

          <p className="text-[14.5px] sm:text-[16px] text-[#64635F] max-w-2xl mx-auto leading-relaxed">
            Biens certifiés sans intermédiaire informel, compteurs SBEE personnels, quittances officielles et respect strict du plafond de caution de 3 mois.
          </p>
        </div>
      </section>

      {/* Filters & Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#E8E5E0] shadow-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[12px] font-bold uppercase text-[#9C9A95] mr-1">Type :</span>
            {[
              { id: "all", label: "Tous les biens" },
              { id: "villa", label: "Villas" },
              { id: "appartement", label: "Appartements" },
              { id: "studio", label: "Studios meublés" },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedType(t.id)}
                className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-bold transition cursor-pointer ${
                  selectedType === t.id
                    ? "bg-[#087F5B] text-white shadow-xs"
                    : "bg-[#FAF9F6] text-[#64635F] hover:bg-[#E8E5E0]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[12px] font-bold uppercase text-[#9C9A95]">Quartier :</span>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="px-3 py-1.5 bg-[#FAF9F6] border border-[#E8E5E0] rounded-lg text-[12.5px] font-semibold text-[#0F172A] outline-none"
            >
              <option value="all">Tous les quartiers</option>
              <option value="Fidjrossè">Fidjrossè</option>
              <option value="Haie Vive">Haie Vive</option>
              <option value="Ganhi">Ganhi / Marina</option>
            </select>
          </div>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((prop) => (
            <motion.div
              key={prop.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-[#E8E5E0] rounded-2xl overflow-hidden shadow-xs hover:border-[#087F5B]/40 hover:shadow-lg transition-all flex flex-col group"
            >
              {/* Photo Banner */}
              <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                <img
                  src={prop.photos[0]}
                  alt={prop.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-[#087F5B] text-white font-bold text-[11px] px-2.5 py-1 rounded-full shadow-sm">
                  {prop.type}
                </span>
                <span className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-xs text-white font-bold text-[11px] px-2.5 py-0.5 rounded-md flex items-center gap-1">
                  <EyeIcon className="w-3.5 h-3.5" /> {prop.photos.length} photos
                </span>
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-extrabold text-[16px] text-[#0F172A] line-clamp-1 group-hover:text-[#087F5B] transition-colors">
                    {prop.title}
                  </h3>
                  <p className="text-[12.5px] text-[#64635F] flex items-center gap-1 mt-1 line-clamp-1">
                    <MapPinIcon className="w-3.5 h-3.5 shrink-0 text-[#087F5B]" /> {prop.address}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {prop.features.slice(0, 3).map((f, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-semibold bg-[#FAF9F6] border border-[#E8E5E0] text-[#64635F] px-2 py-0.5 rounded"
                      >
                        ✓ {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="pt-4 border-t border-[#F0EDE8] flex items-end justify-between">
                  <div>
                    <span className="text-[11px] text-[#9C9A95] font-semibold block uppercase">Loyer mensuel</span>
                    <span className="text-[18px] font-extrabold text-[#087F5B]">
                      {prop.rentFcfa.toLocaleString("fr-FR")}
                    </span>
                    <span className="text-[12px] text-[#64635F] font-bold ml-1">FCFA</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenProperty(prop)}
                    className="px-4 py-2 bg-[#0F172A] hover:bg-[#087F5B] text-white text-[12.5px] font-bold rounded-lg transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                  >
                    <span>Détails &amp; Visite</span>
                    <ArrowRightIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Property Details Modal */}
      <AnimatePresence>
        {activePropertyModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-[#E8E5E0] p-6 sm:p-8 shadow-2xl text-[#0F172A] my-8 relative"
            >
              <button
                type="button"
                onClick={() => setActivePropertyModal(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-[#FAF9F6] border border-[#E8E5E0] hover:bg-[#E8E5E0] text-[#64635F] cursor-pointer"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>

              {/* Photo Carousel Preview */}
              <div className="space-y-3 mb-6">
                <div className="h-64 sm:h-80 w-full rounded-xl overflow-hidden bg-muted">
                  <img
                    src={activePropertyModal.photos[selectedPhotoIndex]}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {activePropertyModal.photos.map((p: string, idx: number) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedPhotoIndex(idx)}
                      className={`h-16 w-24 rounded-lg overflow-hidden shrink-0 border-2 transition ${
                        selectedPhotoIndex === idx ? "border-[#087F5B]" : "border-transparent opacity-60"
                      }`}
                    >
                      <img src={p} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Info Header */}
              <div className="space-y-2 border-b border-[#E8E5E0] pb-4">
                <span className="text-[12px] font-bold uppercase tracking-wider text-[#087F5B] bg-[#E6F5EF] px-2.5 py-0.5 rounded">
                  {activePropertyModal.type}
                </span>
                <h2 className="text-[22px] font-extrabold text-[#0F172A]">{activePropertyModal.title}</h2>
                <p className="text-[13.5px] text-[#64635F] flex items-center gap-1.5">
                  <MapPinIcon className="w-4 h-4 text-[#087F5B]" /> {activePropertyModal.address}
                </p>
              </div>

              {/* Key Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-b border-[#E8E5E0]">
                <div className="p-3 bg-[#FAF9F6] rounded-lg text-center">
                  <span className="text-[11px] text-[#9C9A95] uppercase font-bold block">Surface</span>
                  <span className="font-extrabold text-[15px]">{activePropertyModal.surfaceM2} m²</span>
                </div>
                <div className="p-3 bg-[#FAF9F6] rounded-lg text-center">
                  <span className="text-[11px] text-[#9C9A95] uppercase font-bold block">Chambres</span>
                  <span className="font-extrabold text-[15px]">{activePropertyModal.bedrooms} pièces</span>
                </div>
                <div className="p-3 bg-[#FAF9F6] rounded-lg text-center">
                  <span className="text-[11px] text-[#9C9A95] uppercase font-bold block">Loyer Mensuel</span>
                  <span className="font-extrabold text-[15px] text-[#087F5B]">
                    {activePropertyModal.rentFcfa.toLocaleString("fr-FR")} F
                  </span>
                </div>
                <div className="p-3 bg-[#FAF9F6] rounded-lg text-center">
                  <span className="text-[11px] text-[#9C9A95] uppercase font-bold block">Caution (Loi 2022-30)</span>
                  <span className="font-extrabold text-[15px]">3 mois max</span>
                </div>
              </div>

              {/* Features List */}
              <div className="py-4 space-y-2">
                <h4 className="font-bold text-[14px] text-[#0F172A]">Équipements &amp; Spécificités Bénin</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[13px] text-[#64635F]">
                  {activePropertyModal.features.map((feat: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckBadgeIcon className="w-4 h-4 text-[#087F5B] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-[#E8E5E0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11.5px] text-[#64635F]">Frais de visite (créneau privé) :</span>
                  <div className="text-[14px] font-bold text-[#0F172A]">
                    {activePropertyModal.visitFee ? `${activePropertyModal.visitFee.toLocaleString("fr-FR")} FCFA (MTN MoMo / Moov)` : "Gratuit"}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const msg = encodeURIComponent(
                        `Bonjour, je suis intéressé par la visite de "${activePropertyModal.title}" (${activePropertyModal.rentFcfa.toLocaleString("fr-FR")} FCFA) vu sur votre vitrine Lokka.`
                      );
                      window.open(`https://wa.me/22997001122?text=${msg}`, "_blank");
                    }}
                    className="px-4 py-2.5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white text-[13px] font-bold flex items-center gap-1.5 shadow-xs transition"
                  >
                    <ChatBubbleLeftRightIcon className="w-4 h-4" /> WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStartBooking(activePropertyModal)}
                    className="px-5 py-2.5 rounded-lg bg-[#087F5B] hover:bg-[#076c4d] text-white text-[13px] font-bold flex items-center gap-1.5 shadow-sm transition"
                  >
                    <CalendarDaysIcon className="w-4 h-4" /> Réserver une Visite
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Booking Form Modal */}
      <AnimatePresence>
        {isVisitModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl max-w-lg w-full border border-[#E8E5E0] p-6 sm:p-8 shadow-2xl text-[#0F172A]"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#E8E5E0] mb-4">
                <h3 className="text-[17px] font-extrabold text-[#0F172A] flex items-center gap-2">
                  <CalendarDaysIcon className="w-5 h-5 text-[#087F5B]" />
                  Réserver un créneau de visite
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setIsVisitModalOpen(false);
                    setBookingSuccess(false);
                  }}
                  className="p-1 rounded-full text-[#64635F] hover:bg-[#FAF9F6]"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {bookingSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-[#E6F5EF] text-[#087F5B] flex items-center justify-center mx-auto">
                    <CheckIcon className="w-6 h-6 stroke-[3]" />
                  </div>
                  <h4 className="font-extrabold text-[16px] text-[#0F172A]">Demande de visite enregistrée !</h4>
                  <p className="text-[13px] text-[#64635F]">
                    Le propriétaire a reçu votre demande sur son tableau de bord et vous confirmera le rendez-vous par WhatsApp / SMS.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsVisitModalOpen(false);
                      setBookingSuccess(false);
                    }}
                    className="mt-4 px-5 py-2 bg-[#0F172A] text-white font-bold text-[13px] rounded-lg"
                  >
                    Fermer
                  </button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4 text-[13px]">
                  <div>
                    <label className="block font-bold text-[#64635F] uppercase text-[11px] mb-1">Votre Nom &amp; Prénoms</label>
                    <input
                      type="text"
                      required
                      value={visitForm.name}
                      onChange={(e) => setVisitForm({ ...visitForm, name: e.target.value })}
                      placeholder="ex: Jean Agossou"
                      className="w-full px-3.5 py-2 border border-[#E8E5E0] rounded-lg outline-none focus:border-[#087F5B]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#64635F] uppercase text-[11px] mb-1">Numéro WhatsApp (+229)</label>
                    <input
                      type="tel"
                      required
                      value={visitForm.phone}
                      onChange={(e) => setVisitForm({ ...visitForm, phone: e.target.value })}
                      placeholder="+229 97 00 00 00"
                      className="w-full px-3.5 py-2 border border-[#E8E5E0] rounded-lg outline-none focus:border-[#087F5B]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-[#64635F] uppercase text-[11px] mb-1">Date souhaitée</label>
                      <input
                        type="date"
                        required
                        value={visitForm.date}
                        onChange={(e) => setVisitForm({ ...visitForm, date: e.target.value })}
                        className="w-full px-3 py-2 border border-[#E8E5E0] rounded-lg outline-none focus:border-[#087F5B]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[#64635F] uppercase text-[11px] mb-1">Créneau horaire</label>
                      <select
                        value={visitForm.timeSlot}
                        onChange={(e) => setVisitForm({ ...visitForm, timeSlot: e.target.value })}
                        className="w-full px-3 py-2 border border-[#E8E5E0] rounded-lg outline-none focus:border-[#087F5B]"
                      >
                        <option value="09:00 - 11:00">09:00 - 11:00</option>
                        <option value="11:00 - 13:00">11:00 - 13:00</option>
                        <option value="15:00 - 17:00">15:00 - 17:00</option>
                        <option value="17:00 - 19:00">17:00 - 19:00</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isBooking}
                      className="w-full py-3 bg-[#087F5B] hover:bg-[#076c4d] text-white font-bold text-[13px] rounded-xl shadow-xs transition disabled:opacity-50 cursor-pointer"
                    >
                      {isBooking ? "Enregistrement..." : "Confirmer ma demande de visite"}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Public Footer */}
      <footer className="mt-16 border-t border-[#E8E5E0] bg-white py-8 px-4 text-center text-[12.5px] text-[#64635F] space-y-2">
        <div className="font-extrabold text-[15px] text-[#0F172A]">LOKKA BÉNIN</div>
        <p>Plateforme certifiée de gestion locative et vitrine immobilière conforme à la Loi 2022-30 en République du Bénin.</p>
        <p className="text-[11px] text-[#9C9A95]">© 2026 Lokka. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
