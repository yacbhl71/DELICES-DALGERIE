import React from 'react';
import { Building, MapPin, CreditCard } from 'lucide-react';

export default function PaymentInfo({ paymentMethod }) {
  if (paymentMethod === 'bank_transfer') {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-4">
        <h3 className="font-bold text-blue-900 mb-4 flex items-center">
          <Building className="mr-2" size={20} />
          Informations de Virement Bancaire
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-blue-700">Nom du compte :</span>
            <span className="font-semibold">Délices et Trésors d'Algérie</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">IBAN :</span>
            <span className="font-mono font-semibold">DZ00 1234 5678 9012 3456 7890</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">BIC/SWIFT :</span>
            <span className="font-mono font-semibold">BCIDDZAL</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Banque :</span>
            <span className="font-semibold">BNP Paribas El Djazaïr</span>
          </div>
        </div>
        <p className="text-blue-700 text-xs mt-4">
          ⚠️ Veuillez mentionner votre numéro de commande lors du virement
        </p>
      </div>
    );
  }

  if (paymentMethod === 'cash') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-4">
        <h3 className="font-bold text-green-900 mb-4 flex items-center">
          <MapPin className="mr-2" size={20} />
          Paiement en Espèces à la Livraison
        </h3>
        <div className="space-y-2 text-sm text-green-700">
          <p>✅ Payez directement au livreur lors de la réception de votre commande</p>
          <p>✅ Assurez-vous d'avoir le montant exact si possible</p>
          <p>✅ Vous pouvez inspecter les produits avant de payer</p>
        </div>
        <div className="mt-4 bg-white rounded-lg p-3 border border-green-300">
          <p className="text-xs font-semibold text-green-900 mb-2">📍 Adresse du magasin (retrait possible) :</p>
          <p className="text-sm text-gray-700">
            <strong>Délices et Trésors d'Algérie</strong><br />
            123 Rue Didouche Mourad<br />
            Alger Centre, 16000<br />
            Algérie<br />
            <span className="text-green-700">📞 +213 23 45 67 89</span>
          </p>
        </div>
      </div>
    );
  }

  if (paymentMethod === 'paypal') {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-4">
        <h3 className="font-bold text-blue-900 mb-4 flex items-center">
          <CreditCard className="mr-2" size={20} />
          Paiement sécurisé avec PayPal
        </h3>
        <p className="text-sm text-blue-700 mb-3">
          Vous serez redirigé vers PayPal pour finaliser votre paiement de manière sécurisée.
        </p>
        <div className="bg-white rounded-lg p-3 border border-blue-300">
          <p className="text-xs text-gray-600">
            ✅ Protection des acheteurs PayPal<br />
            ✅ Cartes bancaires acceptées<br />
            ✅ Transaction cryptée et sécurisée
          </p>
        </div>
      </div>
    );
  }

  return null;
}
