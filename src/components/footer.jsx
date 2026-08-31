import React from "react";
import { Truck, CreditCard, Lock, Headphones, ShieldCheck } from "lucide-react";
import logoNM from "../assets/logo-novamarket.png";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-100 rounded-2xl overflow-hidden shadow-md">
      {/* Presentación + Links + Contacto, en 3 columnas */}
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 items-start">
          {/* Columna 1: presentación + beneficios en columna */}
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-20 w-19 shrink-0 items-center justify-center rounded-lg bg-[#457B9D] p-1 shadow-sm">
                <img
                  src={logoNM}
                  alt="NovaMarket - E-commerce"
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <h2 className="text-base font-bold text-black">Nova-Market</h2>
                <p className="text-xs text-gray-500">Tu ecommerce de confianza</p>
              </div>
            </div>

            <p className="mt-2 text-xs text-gray-600">
              Encontrá los mejores productos de tecnología, hogar y más. Envíos
              rápidos, cuotas sin interés y compra 100% segura.
            </p>

            <div className="mt-4 flex flex-col gap-2.5">
              <div className="flex items-center gap-2">
              </div>
            </div>
          </div>

          {/* Columna 2: Links */}
          <div className="flex flex-col gap-1">
            <span className="text-sm font-bold text-black mb-1">Links</span>
            <a href="/" className="text-xs text-black/90 hover:text-black transition">
              1 - Inicio
            </a>
            <a href="/catalogo" className="text-xs text-black/90 hover:text-black transition">
              2 - Contacto
            </a>
           
      
            
          </div>

          {/* Columna 3: Contacto + redes */}
          <div className="flex flex-col gap-1">
            <span className="text-xs text-black">
              <span className="font-bold">DIRECCION:</span> AV. PATRIA 2000
            </span>
            <span className="text-xs text-black">
              <span className="font-bold">CONTACTO:</span> 351-503444
            </span>
            <span className="text-xs text-black">info@tecnostore.com</span>

            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs font-semibold text-black mr-1">Redes sociales:</span>

              {/* WhatsApp */}
              <a href="#" aria-label="WhatsApp">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="#25D366">
                  <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39c1.44.79 3.06 1.2 4.71 1.2h.01c5.46 0 9.91-4.45 9.91-9.91C21.94 6.45 17.5 2 12.04 2zm5.79 14.14c-.24.68-1.19 1.24-1.94 1.4-.52.11-1.19.19-3.46-.74-2.9-1.2-4.77-4.15-4.92-4.35-.14-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.02-2.41.27-.29.58-.36.78-.36.2 0 .39 0 .56.01.18.01.42-.07.65.5.24.58.82 2 .89 2.15.07.15.12.32.02.51-.09.19-.14.31-.28.48-.14.16-.29.36-.42.48-.14.13-.28.27-.12.53.16.27.72 1.19 1.55 1.92 1.06.95 1.96 1.24 2.23 1.38.27.14.43.12.59-.07.16-.19.68-.79.86-1.06.18-.27.36-.22.6-.13.24.09 1.53.72 1.79.85.26.13.43.19.5.3.07.11.07.63-.17 1.31z"/>
                </svg>
              </a>

              {/* Instagram */}
              <a href="#" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24">
                  <defs>
                    <linearGradient id="igGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FFDD55" />
                      <stop offset="50%" stopColor="#E1306C" />
                      <stop offset="100%" stopColor="#833AB4" />
                    </linearGradient>
                  </defs>
                  <path fill="url(#igGradient)" d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.05.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.05.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.05-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.05-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.31-1.46.72-2.13 1.38C1.35 2.68.94 3.35.63 4.14c-.3.76-.5 1.64-.56 2.91C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.38 2.13.67.66 1.34 1.07 2.13 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.79-.31 1.46-.72 2.13-1.38.66-.67 1.07-1.34 1.38-2.13.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.31-.79-.72-1.46-1.38-2.13C21.32 1.35 20.65.94 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 12 18.16 6.16 6.16 0 0 0 12 5.84zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-10.85a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"/>
                </svg>
              </a>

              {/* Email */}
              <a href="#" aria-label="Email">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="#F2B705" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>

              {/* Facebook */}
              <a href="#" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22c4.78-.76 8.44-4.92 8.44-9.94z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Sitio seguro + medios de pago */}
      <div className="px-6 py-3">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center gap-3 sm:gap-6 sm:divide-x sm:divide-gray-300">
          <div className="flex items-center gap-2 sm:pr-6">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#457B9D]/10 text-[#457B9D]">
              <ShieldCheck size={14} />
            </div>
            <div>
              <p className="text-xs font-semibold text-black">Sitio seguro</p>
              <p className="text-[11px] text-gray-500">
                Tus datos están protegidos con encriptación SSL.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:pl-6">
            <span className="text-xs font-semibold text-black">Medios de pago</span>

            {/* Placas de texto en vez de logos reales: las marcas de las tarjetas
                están registradas y no reproducimos sus isotipos exactos */}
            <span className="rounded-md border border-gray-200 bg-white px-2 py-1 text-[10px] font-bold italic text-[#1A1F71]">
              VISA
            </span>
            <span className="rounded-md border border-gray-200 bg-white px-2 py-1 text-[10px] font-bold text-[#EB001B]">
              Mastercard
            </span>
            <span className="rounded-md border border-gray-200 bg-white px-2 py-1 text-[10px] font-bold text-[#2E77BC]">
              Amex
            </span>
            <span className="rounded-md border border-gray-200 bg-white px-2 py-1 text-[10px] font-bold text-[#FF7A00]">
              NaranjaX
            </span>
            <span className="rounded-md border border-gray-200 bg-white px-2 py-1 text-[10px] font-bold text-[#00AAEF]">
              Mercado Pago
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}