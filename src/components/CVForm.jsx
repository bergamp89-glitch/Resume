import React, { useState } from 'react';
import { Plus, Trash2, Upload } from 'lucide-react';

const InputField = ({ label, type = "text", value, onChange, placeholder, required = false }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-slate-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
    />
  </div>
);

export default function CVForm({ cvData, updateCvData, addExperience, removeExperience, addCertificate, removeCertificate, addLanguage, removeLanguage, onGenerate }) {
  const [expInput, setExpInput] = useState({
    company: '',
    position: '',
    period: '',
    tasks: ''
  });

  const [langInput, setLangInput] = useState({
    name: '',
    level: 'Ona tili'
  });

  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateCvData(field, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddExp = () => {
    if (expInput.company && expInput.position && expInput.period && expInput.tasks) {
      addExperience(expInput);
      setExpInput({ company: '', position: '', period: '', tasks: '' });
    } else {
      alert("Tajriba qo'shish uchun barcha maydonlarni (Tashkilot nomi, Lavozim, Davr, Vazifalar) to'ldiring.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cvData.userImage) {
      alert("Iltimos, o'zingizning rasmingizni yuklang!");
      return;
    }

    if (cvData.languages.length === 0 && !langInput.name) {
      alert("Iltimos, kamida bitta tilni kiriting!");
      return;
    }

    if (cvData.experience.length === 0 && (!expInput.company || !expInput.position || !expInput.period || !expInput.tasks)) {
      alert("Iltimos, kamida bitta ish tajribasini to'liq kiriting!");
      return;
    }

    if (expInput.company || expInput.position || expInput.period || expInput.tasks) {
      if (!(expInput.company && expInput.position && expInput.period && expInput.tasks)) {
        alert("Siz kiritgan tajriba chala. Uni rezyumega qo'shish uchun barcha maydonlarni to'ldiring yoxud tozalab tashlang.");
        return;
      }
      addExperience(expInput);
    }
    
    if (langInput.name && langInput.level) {
      addLanguage(langInput);
    }
    
    onGenerate();
  };

  const handlePhoneChange = (e) => {
    let input = e.target.value;
    let val = input.replace(/[^\d+]/g, '');
    
    if (val.length > 0 && !val.startsWith('+')) {
      if (val.startsWith('998')) {
        val = '+' + val;
      } else {
        val = '+998' + val;
      }
    }

    let numbers = val.replace(/\D/g, '');
    
    if (numbers.length === 0) {
      updateCvData('phoneNumber', '');
      return;
    }

    if (numbers.startsWith('998')) {
      numbers = numbers.substring(0, 12);
      let formatted = '+998';
      if (numbers.length > 3) formatted += ' ' + numbers.substring(3, 5);
      if (numbers.length > 5) formatted += ' ' + numbers.substring(5, 8);
      if (numbers.length > 8) formatted += ' ' + numbers.substring(8, 10);
      if (numbers.length > 10) formatted += ' ' + numbers.substring(10, 12);
      updateCvData('phoneNumber', formatted);
    } else {
      updateCvData('phoneNumber', '+' + numbers.substring(0, 12));
    }
  };

  const handleDateChange = (e) => {
    let input = e.target.value;
    // Faqat raqamlarni qoldiramiz
    let val = input.replace(/\D/g, '');
    
    // Nuqtalarni qo'shamiz (DD.MM.YYYY format uchun)
    if (val.length > 2) {
      val = val.substring(0, 2) + '.' + val.substring(2);
    }
    if (val.length > 5) {
      val = val.substring(0, 5) + '.' + val.substring(5, 9);
    }
    
    updateCvData('birthDate', val);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 w-full">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Ma'lumotlarni kiritish</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="Ism" value={cvData.firstName} onChange={e => updateCvData('firstName', e.target.value)} placeholder="Ali" required={true} />
        <InputField label="Familiya" value={cvData.lastName} onChange={e => updateCvData('lastName', e.target.value)} placeholder="Valiyev" required={true} />
        <InputField label="Otasining ismi" value={cvData.patronymic} onChange={e => updateCvData('patronymic', e.target.value)} placeholder="Vali o'g'li" required={true} />
        <InputField label="Tug'ilgan sanasi" type="text" value={cvData.birthDate || ''} onChange={handleDateChange} placeholder="kun oy yil" required={true} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <InputField label="Mutaxassisligi" value={cvData.specialty} onChange={e => updateCvData('specialty', e.target.value)} placeholder="Baklavr yoki Magistratura kabi" required={true} />
        <InputField label="Yashash manzili" value={cvData.address} onChange={e => updateCvData('address', e.target.value)} placeholder="Toshkent sh., Chilonzor tumani" required={true} />
        <InputField label="Telefon raqami" type="tel" value={cvData.phoneNumber} onChange={handlePhoneChange} placeholder="+998 90 123 45 67" required={true} />
        <InputField label="Qancha maosh hohlaysiz" value={cvData.desiredSalary} onChange={e => updateCvData('desiredSalary', e.target.value)} placeholder="Masalan: 5 000 000 so'm yoki $500" required={true} />
      </div>

      {/* Tillar */}
      <div className="border-t border-slate-200 pt-6 mt-6">
        <h3 className="text-xl font-semibold text-slate-800 mb-4">Tillar</h3>
        
        {cvData.languages && cvData.languages.length > 0 && (
          <div className="mb-4 space-y-2">
            {cvData.languages.map((lang, index) => (
              <div key={index} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                  <span className="font-semibold text-slate-800">{lang.name}</span>
                  <span className="text-sm px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full font-medium">{lang.level}</span>
                </div>
                <button 
                  type="button"
                  onClick={() => removeLanguage(index)}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="O'chirish"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <InputField 
              label="Til nomi" 
              value={langInput.name} 
              onChange={e => setLangInput({...langInput, name: e.target.value})} 
              placeholder="Ingliz tili" 
            />
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Darajasi</label>
              <select 
                value={langInput.level}
                onChange={e => setLangInput({...langInput, level: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
              >
                <option value="Ona tili">Darajangizni belgilang</option>
                <option value="A1 (Boshlang'ich)">A1 (Boshlang'ich)</option>
                <option value="A2 (Elementar)">A2 (Elementar)</option>
                <option value="B1 (O'rta)">B1 (O'rta)</option>
                <option value="B2 (O'rtadan yuqori)">B2 (O'rtadan yuqori)</option>
                <option value="C1 (Ilg'or)">C1 (Ilg'or)</option>
                <option value="C2 (Professional)">C2 (Professional)</option>
              </select>
            </div>
          </div>
          
          <button 
            type="button"
            onClick={() => {
              if (langInput.name && langInput.level) {
                addLanguage(langInput);
                setLangInput({ name: '', level: 'Ona tili' });
              } else {
                alert("Iltimos, til nomini kiriting.");
              }
            }}
            className="flex items-center justify-center w-full py-2 px-4 bg-indigo-50 text-indigo-700 font-medium rounded-md hover:bg-indigo-100 transition-colors"
          >
            <Plus className="w-5 h-5 mr-1" />
            Til qo'shish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Foydalanuvchi rasmi</label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
              {cvData.userImage ? (
                <div className="w-full h-full relative group">
                  <img src={cvData.userImage} alt="User" className="w-full h-full object-cover rounded-lg" />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                    <p className="text-white text-sm font-semibold">O'zgartirish</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-3 text-slate-500" />
                  <p className="text-sm text-slate-500"><span className="font-semibold">Rasm yuklash</span></p>
                </div>
              )}
              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'userImage')} />
            </label>
          </div>
        </div>
        
        <div className="w-full">
          <label className="block text-sm font-medium text-slate-700 mb-2">Sertifikatlar va Diplomlar <span className="text-slate-400 font-normal">(Ixtiyoriy)</span></label>
          <div className="flex items-center justify-center w-full mb-4">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-3 text-slate-500" />
                <p className="text-sm text-slate-500"><span className="font-semibold">Sertifikat qo'shish</span></p>
              </div>
              <input type="file" className="hidden" accept="image/*" multiple onChange={(e) => {
                Array.from(e.target.files).forEach(file => {
                  const reader = new FileReader();
                  reader.onloadend = () => addCertificate(reader.result);
                  reader.readAsDataURL(file);
                });
                // Tozalash, aynan bitta rasmni qayta tanlash imkoni uchun
                e.target.value = null;
              }} />
            </label>
          </div>
          
          {cvData.certificates && cvData.certificates.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cvData.certificates.map((cert, idx) => (
                <div key={idx} className="relative group">
                  <img src={cert} alt={`Certificate ${idx + 1}`} className="w-full h-24 object-cover rounded-lg border border-slate-200" />
                  <button 
                    type="button"
                    onClick={() => removeCertificate(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                    title="Sertifikatni o'chirish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Ish tajribasi */}
      <div className="border-t border-slate-200 pt-6">
        <h3 className="text-xl font-semibold text-slate-800 mb-4">Ish tajribasi</h3>
        
        {cvData.experience.length > 0 && (
          <div className="mb-6 space-y-3">
            {cvData.experience.map((exp, index) => (
              <div key={index} className="flex items-start justify-between bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div>
                  <h4 className="font-semibold text-slate-800">{exp.position} - {exp.company}</h4>
                  <p className="text-sm text-slate-500">{exp.period}</p>
                  <p className="text-sm mt-1 text-slate-700">{exp.tasks}</p>
                </div>
                <button 
                  type="button"
                  onClick={() => removeExperience(index)}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="O'chirish"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <InputField label="Tashkilot nomi" value={expInput.company} onChange={e => setExpInput({...expInput, company: e.target.value})} placeholder="Kompaniya nomi" />
            <InputField label="Lavozim" value={expInput.position} onChange={e => setExpInput({...expInput, position: e.target.value})} placeholder="Menejer" />
          </div>
          <InputField label="Ishlagan davr" value={expInput.period} onChange={e => setExpInput({...expInput, period: e.target.value})} placeholder="2020 - 2023 yillar" />
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">Asosiy vazifalar va yutuqlari</label>
            <textarea
              value={expInput.tasks}
              onChange={e => setExpInput({...expInput, tasks: e.target.value})}
              placeholder="Qilingan ishlar, yutuqlar..."
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[80px]"
            />
          </div>
          
          <button 
            type="button"
            onClick={handleAddExp}
            className="flex items-center justify-center w-full py-2 px-4 bg-indigo-50 text-indigo-700 font-medium rounded-md hover:bg-indigo-100 transition-colors"
          >
            <Plus className="w-5 h-5 mr-1" />
            Tajriba qo'shish
          </button>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row justify-end border-t border-slate-200 pt-6">
        <button 
          type="submit"
          className="w-full sm:w-auto px-8 py-3 bg-indigo-600 text-white text-lg font-bold rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
        >
          CVV ni Yaratish
        </button>
      </div>

    </form>
  );
}
