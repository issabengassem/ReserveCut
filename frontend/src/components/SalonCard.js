const SalonCard = ({ salon }) => {
  // دالة لتحديد المصدر الصحيح للصورة
  const getImageUrl = () => {
    // 1. إذا كان هناك رابط خارجي (من Apify/Google)
    if (salon.image_url) {
      return salon.image_url;
    }
    
    // 2. إذا كانت الصورة مخزنة كـ Binary (Blob) في قاعدة البيانات
    if (salon.image && salon.image.data) {
      // تحويل الـ Buffer لـ Base64 لكي يفهمه المتصفح
      const base64String = btoa(
        String.fromCharCode(...new Uint8Array(salon.image.data))
      );
      return `data:image/jpeg;base64,${base64String}`;
    }

    // 3. صورة افتراضية في حال عدم وجود أي صورة
    return '/assets/default-salon.jpg'; 
  };

  return (
    <div className="salon-card">
      <div className="salon-image">
        <img 
          src={getImageUrl()} 
          alt={salon.name} 
          // ضروري لتجاوز حماية جوجل للصور
          referrerPolicy="no-referrer" 
          onError={(e) => { e.target.src = '/assets/default-salon.jpg'; }}
        />
      </div>
      <div className="salon-info">
        <h3>{salon.name}</h3>
        <p>{salon.city}</p>
      </div>
    </div>
  );
};