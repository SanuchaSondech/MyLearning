// เพิ่มส่วน Header
        html += `
        <div style="display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 20px; font-family: 'Sarabun', sans-serif;">
            <div style="flex: 1;">
                <h2 style="margin: 0; color: #2c5282; font-size: 24px; font-weight: bold; letter-spacing: 1px;">
                    MFEC | PMO REPORT
                </h2>
            </div>
    
            <div style="text-align: flex; right; color: #666; font-size: 11px; line-height: 1.4;">
                วันที่ออกเอกสาร: ${new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}<br>
                อ้างอิง: PMO-AUTO-${new Date().getFullYear()}
            </div>
        </div>
        `;

// ส่วนแถบแจ้งกำหนดการ (Note Box)
        html += `
            <div style="border-left: 5px; padding: 15px; margin-top: 30px; font-family: 'Sarabun', sans-serif;">
                <p style="margin: 0; font-size: 11px; color: #333;">
                    <strong>ข้อกำหนดการดำเนินการ:</strong> โปรดตรวจสอบและปรับปรุงสถานะโครงการในระบบให้แล้วเสร็จ 
                    <span style="color: #d9534f; text-decoration: underline italic;">ภายในวันที่ [ระบุวันที่ครบกำหนด]</span> เพื่อนำข้อมูลเข้าสู่ที่ประชุมประจำเดือนต่อไป
                </p>
            </div>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
            `;

        html += `<p style="font-size: 12px; color: #777; margin-top: 20px;"><i></i></p>`;
        html += `</div>`;


// ส่วนคำลงท้าย (Sign-off)
        html += `
            <div style="font-family: 'Sarabun', sans-serif; font-size: 14px; margin-left: 20px; color: #333; line-height: 1.8;">
                <p>จึงเรียนมาเพื่อโปรดพิจารณาดำเนินการ</p>
                <p style="margin-top: 20px;">
                    ขอแสดงความนับถือ,<br>
                    <strong>หน่วยงาน Project Management Office (PMO)</strong><br>
                    บริษัท เอ็ม เอฟ อี ซี จำกัด (มหาชน)
                </p>
            </div>
            `;