import React, { useState } from 'react';
import { Save, Printer, Store, Percent, CreditCard, Settings as SettingsIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Settings: React.FC = () => {
  const { state } = useApp();
  const [shopName, setShopName] = useState('Shop Market');
  const [taxPercent, setTaxPercent] = useState('8');
  const [receiptFooter, setReceiptFooter] = useState('Thank you for shopping with us!');
  const [enableQuickKeys, setEnableQuickKeys] = useState(true);
  const [enableSound, setEnableSound] = useState(true);

  const save = () => {
    localStorage.setItem('settings', JSON.stringify({ shopName, taxPercent, receiptFooter, enableQuickKeys, enableSound }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <SettingsIcon className="h-6 w-6 text-primary-600" />
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Store className="h-5 w-5 text-gray-600" />
            <h2 className="font-semibold text-gray-900">Shop</h2>
          </div>
          <label className="text-sm text-gray-700">Shop name</label>
          <input value={shopName} onChange={(e) => setShopName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Percent className="h-5 w-5 text-gray-600" />
            <h2 className="font-semibold text-gray-900">Tax</h2>
          </div>
          <label className="text-sm text-gray-700">Default tax %</label>
          <input type="number" value={taxPercent} onChange={(e) => setTaxPercent(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Printer className="h-5 w-5 text-gray-600" />
            <h2 className="font-semibold text-gray-900">Receipt</h2>
          </div>
          <label className="text-sm text-gray-700">Footer text</label>
          <textarea value={receiptFooter} onChange={(e) => setReceiptFooter(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="h-5 w-5 text-gray-600" />
            <h2 className="font-semibold text-gray-900">POS</h2>
          </div>
          <label className="flex items-center gap-3 text-sm text-gray-700">
            <input type="checkbox" checked={enableQuickKeys} onChange={(e) => setEnableQuickKeys(e.target.checked)} />
            Enable quick keys
          </label>
          <label className="flex items-center gap-3 text-sm text-gray-700">
            <input type="checkbox" checked={enableSound} onChange={(e) => setEnableSound(e.target.checked)} />
            Enable sounds
          </label>
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={save} className="btn btn-primary flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save settings
        </button>
      </div>
    </div>
  );
};

export default Settings;


