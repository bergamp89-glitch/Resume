import React, { useState } from 'react';
import CVForm from './components/CVForm';
import CVPreview from './components/CVPreview';
import LandingPage from './components/LandingPage';

function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [cvData, setCvData] = useState({
    firstName: '',
    lastName: '',
    patronymic: '',
    phoneNumber: '',
    desiredSalary: '',
    birthDate: '',
    languages: [],
    specialty: '',
    address: '',
    userImage: null,
    certificates: [],
    experience: []
  });

  const [showPreview, setShowPreview] = useState(false);

  const updateCvData = (field, value) => {
    setCvData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addExperience = (newExp) => {
    setCvData(prev => ({
      ...prev,
      experience: [...prev.experience, newExp]
    }));
  };

  const removeExperience = (index) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const addCertificate = (newCert) => {
    setCvData(prev => ({
      ...prev,
      certificates: [...prev.certificates, newCert]
    }));
  };

  const removeCertificate = (index) => {
    setCvData(prev => ({
      ...prev,
      certificates: prev.certificates.filter((_, i) => i !== index)
    }));
  };

  const addLanguage = (newLang) => {
    setCvData(prev => ({
      ...prev,
      languages: [...prev.languages, newLang]
    }));
  };

  const removeLanguage = (index) => {
    setCvData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  return (
    <>
      {!isStarted ? (
        <LandingPage onStart={() => setIsStarted(true)} />
      ) : (
        <div className="min-h-screen p-4 md:p-8 flex justify-center bg-slate-50">
          {!showPreview ? (
            <div className="w-full max-w-4xl">
              <CVForm 
                cvData={cvData} 
                updateCvData={updateCvData} 
                addExperience={addExperience} 
                removeExperience={removeExperience}
                addCertificate={addCertificate}
                removeCertificate={removeCertificate}
                addLanguage={addLanguage}
                removeLanguage={removeLanguage}
                onGenerate={() => setShowPreview(true)}
              />
            </div>
          ) : (
            <div className="w-full max-w-4xl">
              <CVPreview 
                cvData={cvData} 
                onBack={() => setShowPreview(false)}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default App;
