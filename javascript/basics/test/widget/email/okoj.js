// --- 1. ข้อมูลจำลองที่ถูก Group มาแล้ว (เหมือน Output จากโหนด Group by Email) ---


//const headerText = modal.headerText;
const items = [
    {
        json: {
            "Email": "sanucha.son@gmail.com",
            "Email_Intro": "เรียน คุณ[Project Manager], <br>ขอแจ้งสรุปรายการโครงการที่ตงการการตรวจสอบและดําเนินการแก้ไข ตามข้อมูล Performance Management ดังนี้:",
            "Sections": {
               "Project Delayed (โครงการที่มีสถานะล่าช้า)" : [
                    { "Project Code": "TEST-01", "Project Name": "Group Test: Delayed", "Customer": "Cust Group A", "Delay": "8.50%", "Remark": "Condition 1" }
                ],
                "Project with No Plan / Contract Milestone (โครงการขาดแผนงาน)": [
                    { "Project Code": "TEST-02", "Project Name": "Group Test: No Plan", "Plan Status": "-", "Remark": "Condition 2" }
                ],
                "Project with MA Task but no Warranty or MA Date": [
                    { "Project Code": "TEST-03", "Project Name": "Group Test: MA Issue", "Domain": "MA Task", "Warranty End": "Missing" }
                ],
                "Project Overdue & Incomplete (เลยกําหนดและยังไม่เสร็จสิ้น)": [
                    { "Project Code": "TEST-04", "Project Name": "Group Test: Overdue 100%", "Days Overdue": 22, "Progress": "75%" }
                ],
                "Project Overdue but not Closed (โครงการเลยกำหนดแต่ยังไม่ปิดงาน)": [
                    { "Project Code": "TEST-05", "Project Name": "Group Test: Not Closed", "Current Status": "In Progress", "Days Overdue": 3 }
                ]
            }
        }
    }
];

// --- 2. ฟังก์ชันโหนด Generate HTML (ก๊อปปี้ส่วนนี้ไปวางใน n8n ได้เลย) ---
function generateHTMLNode(items) {
    return items.map(item => {
        const data = item.json;

        // เพิ่ม Import Google Font และปรับ Container ---
        let html = `
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;700&display=swap" rel="stylesheet">
        
        <div style="font-family: 'Sarabun', Arial, sans-serif; color: #333; max-width: 800px; margin-left: 20px; line-height: 1.6;">`;

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
        

        html += `<p style="font-size: 16px; font-weight: bold;">${appsmith.model.emailParam}</p>`;
			console.log("odvop");
			console.log("model =", appsmith.model);
console.log("header =", appsmith.model.emailParam);

        for (const [title, rows] of Object.entries(data.Sections)) {
            html += `<h3 style="background-color: #e9ecef; padding: 10px; border-left: 5px solid #0099FF; color: #000066; margin-top: 25px;">${title}</h3>`;
            html += `<table border="1" style="border-collapse: collapse; width: 100%; border: 1px solid #dee2e6;">`;

            // สร้าง Header จาก Keys แถวแรก
            const headers = Object.keys(rows[0]);
            html += `<tr style="background-color: #f8f9fa;">`;
            headers.forEach(h => {
                html += `<th style="padding: 10px; text-align: left; border: 1px solid #dee2e6; font-size: 13px;">${h}</th>`;
            });
            html += `</tr>`;

            // สร้าง Data Rows
            rows.forEach(row => {
                html += `<tr>`;
                headers.forEach(h => {
                    let val = (row[h] === null || row[h] === undefined) ? '-' : row[h];
                    html += `<td style="padding: 10px; border: 1px solid #dee2e6; font-size: 13px;">${val}</td>`;
                });
                html += `</tr>`;
            });
            html += `</table>`;
        }

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

        return {
            json: {
                ...data,
                html_body: html // นี่คือตัวแปรที่จะส่งไปให้ Send Email Node
            }
        };
    });
}

// --- 3. ส่วนการสั่งงาน (Execution) ---
const output = generateHTMLNode(items);

// นำผลลัพธ์ที่ได้จาก html_body ไปแสดงในหน้า index.html
document.body.innerHTML = output[0].json.html_body;