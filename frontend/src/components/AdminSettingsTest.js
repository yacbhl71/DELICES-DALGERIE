import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

const AdminSettingsTest = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold flex items-center">
        <SettingsIcon className="mr-3" size={32} />
        Paramètres Test
      </h1>
      <p className="mt-4">Si vous voyez ce message, la route fonctionne !</p>
    </div>
  );
};

export default AdminSettingsTest;
