const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeChannels() {
  try {
    console.log('กำลังดึงข้อมูลจากเว็บไซต์...');
    // แทนที่ URL นี้ด้วยเว็บไซต์จริงที่คุณใช้งานอยู่
    const targetUrl = 'https://www.สุดยอดวัวชน.com'; 
    const { data } = await axios.get(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    const $ = cheerio.load(data);
    const channels = [];

    // --- ส่วนนี้ต้องปรับ Selector ให้ตรงกับโครงสร้างปุ่ม/ช่องของเว็บจริง ---
    // ตัวอย่าง: สมมติว่าปุ่มเลือกช่องอยู่ใน tag คลาส .channel-btn หรือ .video-item
    // และลิงก์ .m3u8 อาจจะซ่อนอยู่ใน attribute หรือเรียกผ่าน script
    $('.channel-btn').each((index, element) => {
      const name = $(element).text().trim();
      const streamUrl = $(element).attr('data-url'); // หรือ attribute ที่เก็บลิงก์ m3u8

      if (streamUrl) {
        channels.push({
          id: index + 1,
          name: name || `ช่องที่ ${index + 1}`,
          url: streamUrl
        });
      }
    });

    // หากโครงสร้างเว็บเป็นแบบฝังโค้ด JS หรือ iframe ต้องปรับวิธีดึงตรงนี้
    // ถ้ายังดึงไม่ได้ เดี๋ยวเรามาช่วยกันแกะโค้ดส่วนนี้เพิ่มครับ

    // บันทึกเป็นไฟล์ channels.json
    fs.writeFileSync('channels.json', JSON.stringify(channels, null, 2));
    console.log('บันทึกไฟล์ channels.json สำเร็จ:', channels.length, 'ช่อง');

  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error.message);
    process.exit(1);
  }
}

scrapeChannels();
