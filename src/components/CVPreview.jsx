import React, { useRef, useState, useEffect } from 'react';
import { Download, Phone, MapPin, Calendar, DollarSign, User, Globe } from 'lucide-react';

export default function CVPreview({ cvData, onBack }) {
  const printRef = useRef();
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      // 210mm is approx 794px. Scale down if screen is smaller than 830px.
      if (screenWidth < 830) {
        setScale((screenWidth - 40) / 794);
      } else {
        setScale(1);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fileName = `${cvData.firstName || 'Ism'} ${cvData.lastName || 'Familiya'}.pdf`.trim();

  const getPdfOptions = () => ({
    margin:       0,
    filename:     fileName,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, useCORS: true },
    jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak:    { mode: 'css', avoid: 'tr, img' }
  });

  const handlePrint = () => {
    const element = printRef.current;
    window.html2pdf().set(getPdfOptions()).from(element).save();
  };

  const [isUploading, setIsUploading] = useState(false);

  const saveToGoogleDrive = async (isAuto = false) => {
    setIsUploading(true);

    try {
      const element = printRef.current;
      const pdfBlob = await window.html2pdf().set(getPdfOptions()).from(element).output('blob');
      
      const reader = new FileReader();
      reader.readAsDataURL(pdfBlob);
      reader.onloadend = async () => {
        const base64data = reader.result;
        
        try {
          const uploadUrl = import.meta.env.VITE_GOOGLE_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbwD3STgUcxPIEfHw9iZVUiEJCk2QRRnxK7FqFP5jLHEVaYJOwj33lpNTECNefmZMDKnhQ/exec';
          
          await fetch(uploadUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify({
              pdfBase64: base64data,
              fileName: fileName
            })
          });

          if (!isAuto) alert("🎉 Muvaffaqiyatli! Rezume PDF shaklida Google Drive-ga yuborildi.");
        } catch (error) {
          console.error("Server bilan ulanishda xatolik:", error);
          if (!isAuto) alert("Server bilan ulanishda xatolik yuz berdi.");
        } finally {
          setIsUploading(false);
        }
      };
      
      reader.onerror = () => {
        console.error("PDF o'qishda xatolik");
        if (!isAuto) alert("Faylni tayyorlashda xatolik yuz berdi.");
        setIsUploading(false);
      };

    } catch (error) {
      console.error("Yuklash xatosi:", error);
      if (!isAuto) alert("Internet yoki ulanishda xatolik yuz berdi.");
      setIsUploading(false);
    }
  };

  const autoUploadAttempted = useRef(false);
  useEffect(() => {
    if (!autoUploadAttempted.current) {
      autoUploadAttempted.current = true;
      setTimeout(() => {
        saveToGoogleDrive(true);
      }, 1500);
    }
  }, []);

  return (
    <div className="sticky top-4 sm:top-8 mx-auto w-full max-w-full">
      {/* Harakat tugmalari */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 print:hidden">
        <button 
          onClick={onBack}
          className="flex items-center px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-medium transition-colors w-full sm:w-auto justify-center"
        >
          &larr; Tahrirlashga qaytish
        </button>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button 
            onClick={handlePrint}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md font-medium transition-colors"
          >
            <Download className="w-5 h-5 mr-2" />
            Lokal yuklab olish
          </button>
          <button 
            onClick={() => saveToGoogleDrive(false)}
            disabled={isUploading}
            className={`flex items-center px-4 py-2 ${isUploading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white rounded-lg shadow-md font-medium transition-colors`}
          >
            {isUploading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.71,3.5L1.15,15L4.58,21L11.13,9.5M9.73,15L6.3,21H19.42L22.85,15M22.28,14L15.72,2.5H8.85L15.42,14H22.28Z" />
              </svg>
            )}
            {isUploading ? "Yuklanmoqda..." : "Drive-ga saqlash"}
          </button>
        </div>
      </div>

      {/* CV Asosiy Qismi */}
      <div className="w-full overflow-x-auto pb-8 flex justify-center">
        <div 
          ref={printRef}
          className="flex flex-col"
          style={{ 
            transform: `scale(${scale})`, 
            transformOrigin: 'top center',
            marginBottom: scale < 1 ? `-${(297 * 2) * (1 - scale)}mm` : '0',
            width: '210mm'
          }} 
        >
          {/* PAGE 1 */}
          <div 
            className="bg-[#f8f9fa] shadow-2xl print:shadow-none font-sans overflow-hidden flex w-full relative"
            style={{ height: '297mm', minHeight: '297mm' }}
          >
            {/* Sidebar */}
            <div className="w-[38%] bg-[#4b5563] text-white flex flex-col z-10">
              {/* Photo */}
              <div className="w-full h-[320px] bg-slate-700 shrink-0 border-b-8 border-[#0f2a4a]">
                {cvData.userImage ? (
                  <img src={cvData.userImage} alt="User" className="w-full h-full object-cover object-top" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                    <User className="w-16 h-16 mb-2" />
                    <span className="text-sm">Rasm yo'q</span>
                  </div>
                )}
              </div>

              {/* Contact Info */}
              <div className="px-8 py-8">
                <h2 className="text-2xl font-bold tracking-wider mb-2 uppercase">Bog'lanish</h2>
                <div className="w-full h-[2px] bg-white/30 mb-8"></div>

                <div className="space-y-6">
                  {cvData.phoneNumber && (
                    <div className="flex items-center gap-4">
                      <div className="bg-[#b48c66] p-2.5 rounded-md shrink-0">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-[15px]">{cvData.phoneNumber}</span>
                    </div>
                  )}
                  {cvData.address && (
                    <div className="flex items-center gap-4">
                      <div className="bg-[#b48c66] p-2.5 rounded-md shrink-0">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-[15px]">{cvData.address}</span>
                    </div>
                  )}
                  {cvData.birthDate && (
                    <div className="flex items-center gap-4">
                      <div className="bg-[#b48c66] p-2.5 rounded-md shrink-0">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-[15px] flex flex-col">
                        <span className="text-gray-300 text-xs uppercase mb-0.5">Tug'ilgan sanasi:</span>
                        <span>{cvData.birthDate}</span>
                      </div>
                    </div>
                  )}
                  {cvData.desiredSalary && (
                    <div className="flex items-center gap-4">
                      <div className="bg-[#b48c66] p-2.5 rounded-md shrink-0">
                        <DollarSign className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-[15px] flex flex-col">
                        <span className="text-gray-300 text-xs uppercase mb-0.5">Istalgan maosh:</span>
                        <span>{cvData.desiredSalary}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Languages */}
              {cvData.languages && (
                <div className="px-8 pt-2 pb-8 flex-grow bg-[#5a6472]">
                  <h2 className="text-2xl font-bold tracking-wider mb-2 uppercase mt-6">Tillar</h2>
                  <div className="w-full h-[2px] bg-white/30 mb-8"></div>
                  <div className="text-[15px] leading-relaxed whitespace-pre-wrap">
                    {cvData.languages.split(',').map((lang, idx) => (
                       <div key={idx} className="flex items-center gap-4 mb-4">
                         <Globe className="w-6 h-6 text-white shrink-0" />
                         <span>{lang.trim()}</span>
                       </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Main Content */}
            <div className="w-[62%] px-10 py-16 flex flex-col z-0 bg-[#f8f9fa]">
              <h1 className="text-[3.5rem] font-extrabold text-[#0f2a4a] leading-[1.1] uppercase tracking-tight mb-2">
                {cvData.firstName} <br /> {cvData.lastName}
              </h1>
              {cvData.patronymic && <h2 className="text-2xl text-[#0f2a4a] font-semibold mb-2 uppercase">{cvData.patronymic}</h2>}
              <p className="text-2xl text-slate-700 tracking-wide font-medium mb-16 uppercase">{cvData.specialty}</p>

              <div className="flex-grow">
                <h3 className="text-2xl font-bold text-[#0f2a4a] uppercase tracking-wider mb-2">Ish Tajribasi</h3>
                <div className="w-full h-0.5 bg-[#0f2a4a] mb-8"></div>
                
                {cvData.experience && cvData.experience.length > 0 ? (
                  <div className="border-l-2 border-[#4b5563] ml-2 pl-8 pb-2 mt-4 relative">
                    {cvData.experience.map((exp, idx) => (
                      <div key={idx} className="mb-10 relative">
                        {/* Dot */}
                        <div className="absolute w-5 h-5 bg-[#6b7280] rounded-full -left-[43px] top-1.5 border-4 border-[#f8f9fa]"></div>
                        
                        <h4 className="text-lg font-bold text-slate-900 mb-1 uppercase tracking-wide">
                          {exp.position} <span className="text-[#0f2a4a] mx-1">|</span> <span className="font-semibold text-slate-700">{exp.company}</span>
                        </h4>
                        <p className="text-slate-500 text-sm mb-3 font-medium">{exp.period}</p>
                        
                        <div className="text-slate-700 text-[15px] leading-relaxed whitespace-pre-wrap">
                          {/* Rendering tasks with generic bullets if they are separated by newlines, otherwise just text */}
                          {exp.tasks.split('\n').map((line, i) => (
                            <div key={i} className="flex gap-2 mb-1">
                              <span className="text-[#0f2a4a] font-bold">•</span>
                              <span>{line}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 italic">Ish tajribasi kiritilmagan.</p>
                )}
              </div>
            </div>
          </div>

          {/* PAGE 2 - Certificates */}
          <div 
            className="bg-white shadow-2xl print:shadow-none font-sans overflow-hidden flex flex-col w-full px-12 py-16"
            style={{ minHeight: '297mm', pageBreakBefore: 'always', marginTop: scale < 1 ? '20px' : '0' }}
          >
            <h2 className="text-3xl font-extrabold text-[#0f2a4a] uppercase tracking-wider mb-4 text-center">Sertifikat va Diplomlar</h2>
            <div className="w-32 h-1 bg-[#0f2a4a] mx-auto mb-16"></div>
            
            {cvData.certificates && cvData.certificates.length > 0 ? (
              <div className={`grid gap-12 ${cvData.certificates.length > 1 ? 'grid-cols-2' : 'grid-cols-1 max-w-3xl mx-auto'}`}>
                {cvData.certificates.map((cert, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="border-4 border-slate-100 p-3 rounded-xl bg-white shadow-lg w-full transform hover:scale-105 transition-transform">
                      <img src={cert} alt={`Certificate ${idx + 1}`} className="w-full h-auto object-contain rounded-md max-h-[600px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center flex-grow opacity-50 mb-32">
                <div className="w-24 h-24 border-4 border-dashed border-slate-300 rounded-full flex items-center justify-center mb-4">
                  <span className="text-slate-300 text-4xl">!</span>
                </div>
                <p className="text-3xl text-slate-400 font-bold uppercase tracking-widest">Mavjud emas</p>
              </div>
            )}
          </div>

        </div>
      </div>
      
      {/* Print uchun CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background: white !important; }
          #root { display: contents; }
          .shadow-2xl { box-shadow: none !important; }
        }
      `}} />
    </div>
  );
}
