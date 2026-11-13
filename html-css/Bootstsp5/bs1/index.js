/*export default {
	scode: '',
	projcode: '',
	selectedSupplierData: null,
	sid: 0,

	// ตรวจสอบว่า supplier อยู่ในระบบหรือไม่
	async checkSupplierExists(code) {
		try {
			this.scode = code;
			this.projcode = appsmith.store.projectCode;
			const response = await compareSupplier.run();
			const existingSupplier = response.find(item => item.supplier_code === code);
			return existingSupplier ? true : false;
		} catch (error) {
			// console.error('Error checking supplier:', error);
			return false;
		}
	},

	// Function รวมสำหรับทั้งเพิ่มและลบ
	async handleSupplierAction(code, id) {
		try {
			this.scode = code;
			this.sid = id;
			this.projcode = appsmith.store.projectCode;
			const response = await compareSupplier.run();
			const existingSupplier = response.find(item => item.supplier_code === code);

			if (existingSupplier) {
				// ถ้ามีอยู่แล้ว -> เรียก function ลบ
				await this.deleteSupplier(code);
			} else {
				// ถ้าไม่มี -> เรียก function เพิ่ม
				await this.addSupplier(code, id);
			}

		} catch (error) {
			// console.error('Error handling supplier action:', error);
			showAlert(`Error: ${error.message}`, 'error');
		}
	},

	// Function เพิ่ม supplier (แยกออกมา)
	async addSupplier(code) {
		try {
			await AddToInternal.run();
			// Refresh ข้อมูลทั้งหมด
			await this.refreshAllData();
			showAlert(`Supplier ${code} added successfully!`, 'success');
		} catch (error) {
			throw error;
		}
	},

	// Function ลบ supplier (เปิด Modal)
	async deleteSupplier(code) {
		try {
			const response = await compareSupplier.run();
			const supplierToDelete = response.find(item => item.supplier_code === code);

			if (!supplierToDelete) {
				showAlert(`Supplier ${code} not found!`, 'warning');
				return;
			}

			// ตรวจสอบคะแนนและข้อมูล
			const supplierInfo = this.checkSupplierInfo(supplierToDelete, code);

			// เก็บข้อมูลสำหรับ Modal
			this.selectedSupplierData = {
				code: code,
				project: this.projcode,
				supplierInfo: supplierInfo,
				supplierData: supplierToDelete,
				confirmMessage: this.getDeleteConfirmMessage(supplierInfo)
			};

			// เปิด Modal
			showModal('Modal1');

		} catch (error) {
			// console.error('Error preparing delete:', error);
			showAlert(`Error: ${error.message}`, 'error');
		}
	},

	// ใช้แทน Table4primaryColumnsSelectonClick
	async Table4primaryColumnsSelectonClick(code) {
		await this.handleSupplierAction(code);
	},

	// Function สำหรับยืนยันการลบ
	async confirmDeleteSupplier() {
		try {
			if (!this.selectedSupplierData) {
				showAlert('No supplier data found', 'error');
				return;
			}

			const { code, supplierInfo } = this.selectedSupplierData;

			await deleteInInternal.run();

			// Refresh ข้อมูลทั้งหมด
			await this.refreshAllData();

			const deleteMessage = supplierInfo.hasEvaluation
			? `Supplier ${code} and evaluation data deleted successfully!`
			: `Supplier ${code} deleted successfully!`;

			showAlert(deleteMessage, 'success');
			this.cancelDelete();

		} catch (error) {
			// console.error('Error deleting supplier:', error);
			showAlert(`Error deleting supplier: ${error.message}`, 'error');
		}
	},

	// Function สำหรับยกเลิกการลบ
	cancelDelete() {
		this.selectedSupplierData = null;
		closeModal('Modal1');
	},

	// Function สำหรับ refresh ข้อมูลทั้งหมด
	async refreshAllData() {
		try {
			// console.log('Refreshing all data...');

			// Refresh queries ทั้งหมดที่เกี่ยวข้อง
			const refreshPromises = [];

			// เพิ่ม query ที่ต้อง refresh
			if (typeof compareSupplier !== 'undefined') {
				refreshPromises.push(compareSupplier.run());
			}

			if (typeof supplier_list !== 'undefined' && typeof supplier_list.getsupplier === 'function') {
				refreshPromises.push(supplier_list.getsupplier());
			}

			// รอให้ refresh เสร็จทั้งหมด
			await Promise.all(refreshPromises);

			// console.log('Data refresh completed');

		} catch (error) {
			// console.error('Error refreshing data:', error);
			// ไม่ throw error เพื่อไม่ให้กระทบกับ operation หลัก
		}
	},

	// ตรวจสอบข้อมูล supplier แบบง่าย
	checkSupplierInfo(supplierData, code) {
		const newScore = supplierData.new_evaluate_value;
		const oldScore = supplierData.old_evaluate_value;
		const rankedBy = supplierData.ranking_updated_by || supplierData.ranked_by || 'Unknown';

		// ตรวจสอบว่ามีคะแนนอย่างใดอย่างหนึ่งหรือไม่
		const hasEvaluation = (newScore !== null && newScore !== undefined && newScore !== '') ||
					(oldScore !== null && oldScore !== undefined && oldScore !== '');

		return {
			hasEvaluation: hasEvaluation,
			rankedBy: rankedBy,
			evaluationType: this.getEvaluationType(newScore, oldScore)
		};
	},

	// ระบุประเภทการประเมิน
	getEvaluationType(newScore, oldScore) {
		const hasNew = newScore !== null && newScore !== undefined && newScore !== '';
		const hasOld = oldScore !== null && oldScore !== undefined && oldScore !== '';

		if (hasNew && hasOld) return 'Complete Evaluation';
		if (hasNew) return 'New Evaluation';
		if (hasOld) return 'Historical Evaluation';
		return 'No Evaluation';
	},

	// สร้างข้อความยืนยันแบบง่าย
	getDeleteConfirmMessage(supplierInfo) {
		const baseMessage = `Are you sure you want to delete supplier ${this.scode} from project ${this.projcode}?`;

		if (!supplierInfo.hasEvaluation) {
			return `${baseMessage}\n\n📋 This supplier has no evaluation data.`;
		}

		return `${baseMessage}\n\n⚠️ WARNING: This supplier has evaluation data!\n\n👤 Evaluated by: ${supplierInfo.rankedBy}\n\nDeleting will permanently remove all evaluation data!`;
	},

	// Helper function สำหรับ UI - แสดงสถานะ supplier
	getSupplierStatus(supplierData) {
		if (!supplierData) return 'Not Added';

		const supplierInfo = this.checkSupplierInfo(supplierData, supplierData.supplier_code);

		if (supplierInfo.hasEvaluation) {
			return `✅ Added (${supplierInfo.evaluationType} by ${supplierInfo.rankedBy})`;
		}

		return '✅ Added (No Evaluation)';
	},

	// Helper function สำหรับ UI - ตรวจสอบว่ามี evaluation หรือไม่
	hasEvaluationData(supplierData) {
		if (!supplierData) return false;

		const newScore = supplierData.new_evaluate_value;
		const oldScore = supplierData.old_evaluate_value;

		return (newScore !== null && newScore !== undefined && newScore !== '') ||
			(oldScore !== null && oldScore !== undefined && oldScore !== '');
	}
}

export default {
	code:    '<div style="border-radius: 5px; padding: 5px; border: 1px solid #cccccc;">',
	name:    '<div style="border-radius: 5px; padding: 5px; border: 1px solid #cccccc;">',
	address: '<div style="border-radius: 5px; padding: 5px; border: 1px solid #cccccc;">',
	contact: '<div style="border-radius: 5px; padding: 5px; border: 1px solid #cccccc;">',
	phone:   '<div style="border-radius: 5px; padding: 5px; border: 1px solid #cccccc;">',
	email:   '<div style="border-radius: 5px; padding: 5px; border: 1px solid #cccccc;">',

	test() {
		sup_list.sortOrder
	},

	// async getUserLocation() {
	// const currentPosition = await appsmith.geolocation.getCurrentPosition();
	// console.log(`${currentPosition.coords.latitude} + '\' + ${currentPosition.coords.longitude}`)
	// },


export default {
	// Type: "",
	// 
	// ButtonRisk: (TypeBtn) => {
	// switch(TypeBtn) {
	// case "VeryHigh":
	// this.Type = TypeBtn
	// case
	// }
	// },
	getRiskFilter: () => {
		switch (appsmith.store.TypeRisk) {
			case "VeryHigh": // มี 1 Poor
				return `
          (op_level = 'Poor' OR fi_level = 'Poor' OR se_level = 'Poor')
        `;
			case "High": // มี 1 Fair และไม่มี Poor
				return `
          (op_level = 'Fair' OR fi_level = 'Fair' OR se_level = 'Fair')
          AND op_level <> 'Poor' AND fi_level <> 'Poor' AND se_level <> 'Poor'
        `;
			case "Medium": // Fair ไม่เกิน 1 และไม่มี Poor
				return `
					(
						((op_level = 'Fair')::int + (fi_level = 'Fair')::int + (se_level = 'Fair')::int) = 2
						AND op_level <> 'Poor' AND fi_level <> 'Poor' AND se_level <> 'Poor'
					)
				`;
			case "Low": // ทั้ง 3 เป็น Fair
				return `
          (op_level = 'Fair' AND fi_level = 'Fair' AND se_level = 'Fair')
        `;
			case "NoRisk": // ไม่มี Fair, Poor และมี Excellent 1
				return `
          (op_level NOT IN ('Fair','Poor') AND fi_level NOT IN ('Fair','Poor') AND se_level NOT IN ('Fair','Poor')
          AND ((op_level = 'Excellent')::int + (fi_level = 'Excellent')::int + (se_level = 'Excellent')::int) = 1)
        `;
			case "Good": // ไม่มี Fair, Poor และ Excellent >= 2
				return `
          (op_level NOT IN ('Fair','Poor') AND fi_level NOT IN ('Fair','Poor') AND se_level NOT IN ('Fair','Poor')
          AND ((op_level = 'Excellent')::int + (fi_level = 'Excellent')::int + (se_level = 'Excellent')::int) = 2)
        `;
			case "Excellent": // ทั้ง 3 Excellent
				return `
          (op_level = 'Excellent' AND fi_level = 'Excellent' AND se_level = 'Excellent')
        `;
			default:
				return `1=1`; // ถ้าไม่เลือก riskType ใดๆ
		}
	}
}

export default {
	async getDataInfoContainer() {
		try {
			// เปิด modal loading
			this.showLoadingModal(true)

			// รัน async functions
			await getHistoryEvaluate.run?.()
			await vendorone.run?.()
			await graph_eval_vendor.getGraph?.()
		} catch (error) {
			// console.error("Error loading data:", error)
		} finally {
			// ปิด modal loading ไม่ว่าจะ success หรือ error
			this.showLoadingModal(false)
		}
	},

	async getProjectTable() {
		try {
			this.showLoadingModal(true)

			await supplier_list.getProject?.()
		} catch (error) {
			// console.error("Error loading data:", error)
		} finally {
			this.showLoadingModal(false)
		}
	},

	// ฟังก์ชันเปิด/ปิด modal
	showLoadingModal(isShow) {
		if (isShow) {
			// โค้ดเปิด modal
			showModal(Modal3.name)
		} else {
			// โค้ดปิด modal
			closeModal(Modal3.name)
		}
	}
}

export default {
	code: "",
	projectCode: "",
	vendorCode: "",
	status: "Y",
	datas: [],

	hasAuth() {
		this.session().then(session => {
			if (session.expired === true) {
				MenuHandler.performSession()
			}
		});
	},

	async session() {
		try {
			if (!appsmith.store.email) {
				this.logout();
			}

			const response = await checkRole.run();
			const lastLoginRaw = response[0]?.last_login;

			if (!lastLoginRaw) {
				showAlert("ไม่พบข้อมูลการล็อกอินล่าสุด", "warning");
				return { expired: true };
			}

			// แปลงเป็น Date object
			const lastSignDate = new Date(lastLoginRaw);
			const now = new Date();

			// console.log("lastLogin", lastSignDate.toISOString(), "Now", now.toISOString());

			// หาความต่างเป็น ชั่วโมง
			const diffMs = now.getTime() - lastSignDate.getTime();
			const diffHours = diffMs / (1000 * 60 * 60);

			if (diffHours > 24) {
				showAlert("Session Time Out", "warning");
				return { expired: true };
			} else {
				return { expired: false };
			}
		} catch (error) {
			// console.error("session error:", error);
			return { expired: true };
		}
	},

	logout() {
		try {
			clearStore?.();
			navigateTo?.("https://msync.mfec.co.th/signout?app=supplier_eva", "SAME_WINDOW");
		} catch (error) {
			// console.error("Logout Error:", error);
		}
	},

	async getSupplierInternal() {
		try {
			const response = await internal_supplier.run();
			await compareSupplier.run();
			const data = Array.isArray(response)
			? response.map((item) => ({
				id: item.id,
				Select: "add",
				ProjectCount: item?.evaluation_status || "",
				AverageScore: item?.avg_score || "",
				SupplierCode: item?.code || "",
				SupplierName: item?.name || "",
				Phone: item?.phone || "",
				Email: item?.email || "",
				Address: item?.address || "",
			}))
			: [];
			this.datas = data;
			return data;
		} catch (error) {
			// console.error("Error in getSupplierInternal:", error);
			showAlert?.("ไม่สามารถโหลดข้อมูล supplier ได้", "error");
			return [];
		}
	},

	async runToggle() {
		try {
			await storeValue?.("isToggledP", false, false);
		} catch (error) {
			// console.error("runToggle Error:", error);
		}
	},

	test(value) {
		if (value === "logout") {
			this.logout();
		} else if (value === "email") {
			if (this.status === "Y") {
				showAlert?.("Change To No Receipt Email", "info");
				this.status = "N";
			} else {
				showAlert?.("Change To Yes Receipt Email", "info");
				this.status = "Y";
			}
		}
	},

	async Clear() {
		try {
			await storeValue?.("sTab", TabSupplier?.selectedTab || "");
			if (appsmith.store?.projectCode?.length > 0) {
				await storeValue?.("isVs", true);
			} else {
				await storeValue?.("isVs", false);
			}
			if (appsmith.store?.vendorCode?.length > 0) {
				await storeValue?.("isVv", true);
			} else {
				await storeValue?.("isVv", false);
			}
		} catch (error) {
			console.error("Clear Error:", error);
		}
	},

	async TabSupplier(code, name, progressValue, minRequired, projectType) {
		try {
			if (!code) return;

			// ตรวจสอบก่อนว่า progress ผ่านเกณฑ์หรือไม่
			if (!await this.canEvaluateProject(code, progressValue, minRequired, projectType)) {
				return;
			}

			this.code = code;
			this.projectCode = code;
			await storeValue?.("projectCode", code);
			await storeValue?.("projectName", name || "");
			await storeValue?.("isVs", true);
			await storeValue?.("sTab", "Vendor/Supplier in Project");
			await supplier_list.getsupplier();
			await getProjInfo.run();
		} catch (error) {
			// console.error("TabSupplier Error:", error);
		}
	},

	async TabVendor(code) {
		try {
			if (!code) return;
			await storeValue?.("vendorCode", code);
			await storeValue?.('Type', '3 years');
			await supplier_list.getVendorOne?.();
			await graph_eval_vendor.getGraph?.();
			await getHistoryEvaluate.run?.();
			try {
				await showAlert("กำลังดึงทุนจดทะเบียน..", 'info')
				await Registered_Capital.run?.();
			} catch (apiError) {
				await showAlert("ไม่สามารถดึงทุนจดทะเบียนได้ ข้อมูลจาก API ต้นทางไม่พร้อม", 'warning');
			}
			await storeValue?.("isVv", true);
			await storeValue?.("sTab", "Vendor/Supplier Information");
		} catch (error) {
			// console.error("TabVendor Error:", error);
		}
	},

	async canEvaluateProject(projectCode, progressValue, minRequired, projectType) {
		const user = await checkRole.run();
		if (user.role === 'admin' || user.role === 'pmo' || user.role === 'audit' || user.role === 'purchase') {
			return true;
		}

		if (projectType === 'Internal') {
			return true;
		} else if (progressValue === null || progressValue === undefined) {
			showAlert(`ไม่สามารถประเมินได้: ไม่มีข้อมูล Progress ของโปรเจค`, 'warning');
			return false;
		}

		if (progressValue < minRequired) {
			showAlert(`ไม่สามารถประเมินได้: Progress ของโปรเจค (${progressValue}%) ต่ำกว่าเกณฑ์ที่กำหนด (${minRequired}%)`, 'warning');
			return false;
		}

		return true;
	},

	async setVisible() {
		try {
			await storeValue?.("isVs", false);
			await storeValue?.("isVv", false);
		} catch (error) {
			console.error("setVisible Error:", error);
		}
	},
};

export default {
	async toggleAndFetch() {
		// ซ่อน table ไว้ก่อน
		await storeValue('supplierLoading', true);

		// toggle
		await storeValue('isToggledP', !appsmith.store.isToggledP);

		// fetch ข้อมูล
		await JSObject1.getSupplierInternal();

		// แสดง table ได้แล้ว
		await storeValue('supplierLoading', false);
	}
}

export default {
	export_excel: async(exportForm) => { 
		try {
			showModal('ExportLoadingModal'); 

			let now = moment().tz('Asia/Bangkok').format('YYYY-MM-DD HH.mm.ss')
			let filename = (exportForm === 'Vendors' 
											? `Vendors${appsmith.store.TypeRisk ? '_' + appsmith.store.TypeRisk + '_' + RadioGroup1.selectedOptionValue : '_' + RadioGroup1.selectedOptionValue}` 
											: `ProjectEval${Switch1.isSwitchedOn ? `_${appsmith.store.Type}` : ""}${Select6.selectedOptionValue ? `_${Select6.selectedOptionValue}` : ""}`
										 ) + `_${now}`;
			let wsname = 'Data at ' +  moment().tz('Asia/Bangkok').format('YYYY-MM-DD HH.mm.ss')

			let jsonData;
			switch (exportForm) {
				case 'Vendors':
					jsonData = await DownloadVendor.run();

					// const ResRhresholds = await GetScoreThresholds.run()
					// 
					// // เติม smallTable ให้มี row เท่ากับ bigTable
					// const filledJson = Array(ResVendor.length).fill(null).map((_, i) => ResRhresholds[i] || { label: null, min: null, max: null });
					// 
					// // ต่อแนวนอน
					// jsonData = ResVendor.map((row, index) => ({
					// ...row,
					// ...filledJson[index]
					// }));

					break;
				case 'ProjectEval':
					jsonData = await DownloadVendorone.run();
					break;
				default:
					showAlert('Invalid exportForm value. Please specify "Vendors" or "ProjectEval".', 'error');
					// console.error('Invalid exportForm:', exportForm);
					return;
			}

			const workbook =  new ExcelJS.Workbook()
			const worksheet = workbook.addWorksheet(wsname);

			if (exportForm === 'Vendors') {
				worksheet.columns = [
					{ header: 'Id', key: 'id', width: 10 },
					{ header: 'Project Count (Evaluated Project/Total Project)', key: 'project_count', width: 30 },
					{ header: 'Vendor Code', key: 'vendor_code', width: 20 },
					{ header: 'Vendor Name', key: 'vendor_name', width: 30 },
					{ header: 'Average Score', key: 'avg_score', width: 15 },
					{ header: 'Operations Score', key: 'operations_score', width: 20 },
					{ header: 'Financial Score', key: 'financial_score', width: 20 },
					{ header: 'Service Score', key: 'service_score', width: 20 },
					{ header: 'Address', key: 'address', width: 40 },
					{ header: 'Phone', key: 'phone', width: 20 },
					{ header: 'Email', key: 'email', width: 30 },
					// { header: 'Label', key: 'label', width: 15 },
					// { header: 'Min Value', key: 'min_value', width: 10 },
					// { header: 'Max Value', key: 'max_value', width: 10 }
				];
				jsonData.forEach((row, index) => {
					worksheet.addRow({
						id: row['Id'],
						project_count: row['Project Count (Evaluated Project/Total Project)'],
						vendor_code: row['Vendor Code'],
						vendor_name: row['Vendor Name'],
						avg_score: row['Average Score'],
						operations_score: row['Operations Score'],
						financial_score: row['Financial Score'],
						service_score: row['Service Score'],
						address: row['Address'],
						phone: row['Phone'],
						email: row['Email'],
						// label: row['label'],
						// min_value: row['min'],
						// max_value: row['max'],
					});
				});
			} else if (exportForm === 'ProjectEval') {
				worksheet.columns = [
					{ header: 'Id', key: 'id', width: 10 },
					{ header: 'Status', key: 'status', width: 15 },
					{ header: 'Avg. Score By Project', key: 'average_score', width: 20 },
					{ header: 'Vendor/Supplier Code', key: 'vendor_supplier_code', width: 20 },
					{ header: 'Project Code', key: 'project_code', width: 20 },
					{ header: 'Project Name', key: 'project_name', width: 30 },
					{ header: 'Project Progress', key: 'project_progress', width: 20 },
					{ header: 'Customer', key: 'customer', width: 25 },
					{ header: 'Remark', key: 'remark', width: 30 },
					{ header: 'Ranked By (Score)', key: 'ranked_by', width: 20 },
					{ header: 'Earliest Ranked Date', key: 'earliest_ranked_date', width: 25 },
					{ header: 'Lastest Ranked Date', key: 'lastest_ranked_date', width: 25 },
					{ header: 'Start Date', key: 'start_date', width: 20 },
					{ header: 'End Date', key: 'end_date', width: 20 },
					{ header: 'Project Age', key: 'project_age', width: 15 }
				];
				jsonData.forEach((row, index) => {
					worksheet.addRow({
						id: row['Id'],
						status: row['Status'],
						average_score: row['Average Score'],
						vendor_supplier_code: row['Vendor/Supplier Code'],
						project_code: row['Project Code'],
						project_name: row['Project Name'],
						project_progress: row['Project Progress'],
						customer: row['Customer'],
						remark: row['Remark'],
						ranked_by: row['Ranked By (Score)'],
						earliest_ranked_date: row['Earliest Ranked Date'],
						lastest_ranked_date: row['Lastest Ranked Date'],
						start_date: row['Start Date'],
						end_date: row['End Date'],
						project_age: row['Project Age']
					});
				});
			}


			worksheet.eachRow(row => {
				row.eachCell(cell => {
					// แยก comma เป็นบรรทัดใหม่
					// if (typeof cell.value === 'string' && cell.value.includes(',')) {
					// cell.value = cell.value.split(',').join('\n');
					// }
					// จัด center ทั้งแนวนอนและแนวตั้ง
					cell.alignment = {
						wrapText: true,
					};
				});

				// // ปรับความสูง row ตามจำนวนบรรทัดสูงสุดใน row
				// const maxLines = Math.max(...row.values.slice(1).map(v => (v ? v.toString().split('\n').length : 1)));
				// row.height = maxLines * 15;
			});

			// wrapText
			// worksheet.getColumn(9).alignment = { wrapText: true };


			//-----style header
			worksheet.getRow(1).eachCell((cell, colNumber) => {
				cell.fill = {
					type: 'pattern',
					pattern: 'solid',
					fgColor: { argb: 'FFFF00' }
				};
				cell.font = { bold: true };
			});

			//----add filter
			worksheet.autoFilter = {
				from: { row: 1, column: 1 },
				to: { row: worksheet.rowCount, column: worksheet.columns.length }
			};

			//----add border
			worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {
				row.eachCell({ includeEmpty: true }, function(cell, colNumber) {
					cell.border =  {
						top: { style: "thin" },
						left: { style: "thin" },
						bottom: { style: "thin" },
						right: { style: "thin" }
					};
				});
			});

			const buffer = await workbook.xlsx.writeBuffer();
			const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
			const url = URL.createObjectURL(blob);
			download(url,`${filename}.xlsx`,'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

			closeModal('ExportLoadingModal');

			showModal('ExportSuccessModal');

			setTimeout(() => {
				closeModal('ExportSuccessModal');
			}, 3000);

		} catch (error) {
			closeModal('ExportLoadingModal');
			showAlert(`Export error: ${error.message}`, 'error');
		}
	},
}

export default {
	listUPM : [],

	async add_email () {
		storeValue('email', 'potchara@mfec.co.th')
	},
	async myFun2 () {
		// storeValue("email","patthanan@mfec.co.th")

		const underPM = await Query1.run()
		//console.log(underPM[0].pem_subordinates_sup.pem_email)

		const PM  = underPM[0].pem_subordinates_sup.pem_username
		// console.log(PM)
		// PM.push(appsmith.store.email)
		this.listUPM = PM

		// console.log(this.listUPM)
		},

}

export default {
	handleMenuAction: (selectedValue) => {
		// console.log('Menu clicked:', selectedValue);
		switch(selectedValue) {
			case 'config_progress_project':
				showModal('Modal2');
				break;
			case 'config_score_thresholds':
				showModal('ScoreCategory');
				break;
			case 'addnewtopic':
				navigateTo('NewTopic');
				break;
			case 'logout':
				this.performLogout();
				break;
			default:
				// console.log('Unknown menu action:', selectedValue);
				break;
		}
	},

	performLogout: () => {
		try {
			// console.log('Logging out...');
			clearStore?.();
			showAlert('Logged out successfully', 'success');
			navigateTo?.("https://msync.mfec.co.th/", {}, "SAME_WINDOW");
		} catch (error) {
			// console.error("Logout Error:", error);
			showAlert('Logout failed', 'error');
		}
	},
	performSession: () => {
		try {
			clearStore?.();
			navigateTo?.("Session", {}, "SAME_WINDOW");
		} catch (error) {
			// console.error("Logout Error:", error);
			showAlert('Session failed', 'error');
		}
	}
}

export default {
	username: "Test",
	Suppliers: "ABC10001",
	name: "ProJect name",
	table1: [],

	formatDateToDDMMYYYY(dateString) {
		if (!dateString || dateString === "") return "";
		try {
			const date = new Date(dateString);
			const day = date.getDate().toString().padStart(2, '0');
			const month = (date.getMonth() + 1).toString().padStart(2, '0');
			const year = date.getFullYear();
			return `${day}/${month}/${year}`;
		} catch (error) {
			// console.error('Date format error:', error);
			return dateString; // return original if error
		}
	},

	async getSupplier() {
		try {
			// const queryProjectCode = appsmith.URL.queryParams.projectCode
			await storeValue("proj_code", JSObject1.projectCode)

			const response = await SupplierTable.run()
			await storeValue("projectCode", response[0].project_code)
			await storeValue("projectName", response[0].project_name)

			const mappedData = response.map((item, index) => ({
				"supplierCode":item.supplier_code || "",
				"supplierName":item.supplier_name || "",
				"evaluate": "Evaluate",
				"remark": item.remark || "",
				"rankedBy": item.ranking_updated_by || "",
				"rankedDate": this.formatDateToDDMMYYYY(item.ranking_updated_at),
				"averageScore": item.total_ranking || "",
				"lastRankedBy": item.last_ranked_by || item.last_evaluator || ""
			}));

			this.table1 = mappedData;
			// console.log('Mapped data:', mappedData);
			return mappedData;
		} catch (error) {
			// console.error('Error loading suppliers:', error);
			// navigateTo('project_list', 'SAME_WINDOW')
			return [];
		}
	},
}

export default {
    // ฟังก์ชันหลักสำหรับดึง project code
    getProjectCode: () => {
        const projCode = appsmith.store.proj_code;
        const projectCode = appsmith.store.projectCode;
        
        if (projCode && typeof projCode === 'string') {
            const parts = projCode.split(' ');
            return parts[0]?.trim() || '';
        }
        
        if (projectCode && typeof projectCode === 'string') {
            const parts = projectCode.split(' ');
            return parts[0]?.trim() || '';
        }
        
        return '';
    },
    
    // ตรวจสอบว่ามี project code หรือไม่
    hasProjectCode: () => {
        return this.getProjectCode() !== '';
    }
}

export default {
	vendor: [],
	scoreConfig: {
		thresholds: [],
		naConfig: { label: 'N/A', color: '#6c757d' }
	},
	tempThresholds: [],
	selectedCategoryInfo: null,
	nextId: 1,

	async init() {
		await this.loadConfigFromDB();
		return await this.getVendor();
	},

	setDefaultNAConfig() {
		this.scoreConfig.naConfig = {
			label: 'N/A',
			color: '#6c757d'
		};
	},

	async loadConfigFromDB() {
		try {
			storeValue('tableLoading', true);
			const thresholdsResult = await GetScoreThresholds.run();
			if (!thresholdsResult || thresholdsResult.error) {
				throw new Error(thresholdsResult?.error || "ไม่สามารถดึงข้อมูลจากฐานข้อมูลได้");
			}
			this.scoreConfig.thresholds = thresholdsResult || [];
			this.tempThresholds = [...this.scoreConfig.thresholds];
			this.setDefaultNAConfig();
			this.calculateNextId();
			return this.scoreConfig;
		} catch (error) {
			showAlert('ไม่สามารถโหลดข้อมูลเกณฑ์คะแนนได้: ' + error.message, 'error');
			this.scoreConfig.thresholds = [];
			this.tempThresholds = [];
			this.setDefaultNAConfig();
			this.calculateNextId();
			return this.scoreConfig;
		} finally {
			storeValue('tableLoading', false);
		}
	},

	calculateNextId() {
		if (this.tempThresholds.length > 0) {
			const customIds = this.tempThresholds
			.filter(t => t.id.startsWith('custom_'))
			.map(t => parseInt(t.id.replace('custom_', '')));
			this.nextId = customIds.length > 0 ? Math.max(...customIds) + 1 : 1;
		} else {
			this.nextId = 1;
		}
	},

	async getVendor(TypeBtn) {
		try {
			showModal(Modal3.name);
			await storeValue(
				'TypeRisk',
				TypeBtn !== undefined ? TypeBtn : appsmith.store.TypeRisk,
				false
			);
			await DownloadVendor.run()
			const response = await Vendor.run();
			this.vendor = response.map(item => ({
				Project_Count: item.evaluation_status == '0/0' ? 'N/A' : item.evaluation_status || "",
				Vendor_Code: item.code || "",
				Vendor_Name: item.name || "",
				Average_Score: item.avg_score || "",
				Operations_Score: item.avg_category_1_score || "",
				Financial_Score: item.avg_category_2_score || "",
				Service_Score: item.avg_category_3_score || "",
				Address: item.address || "",
				Phone_Number: item.phone || "",
				Email: item.email || ""
			}));
			await this.loadConfigFromDB();
			return this.vendor;
		} catch (error) {
			showAlert('ไม่สามารถโหลดข้อมูล Supplier ได้', 'error');
			return [];
		} finally {
			closeModal(Modal3.name);
		}
	},

	getScoreConfig(score) {
		if (score === 'N/A') return this.scoreConfig.naConfig;
		const numericScore = parseFloat(score.replace('%', ''));
		return this.scoreConfig.thresholds.find(t => numericScore >= parseFloat(t.min) && numericScore <= parseFloat(t.max)) || this.scoreConfig.naConfig;
	},

	getButtonColor(score) {
		return this.getScoreConfig(score).color;
	},

	getScoreLabel(score) {
		const config = this.getScoreConfig(score);
		return score === 'N/A' ? config.label : `${config.label} (${score})`;
	},

	getScoreTreeOptions() {
		const categories = [
			{ key: 'OPERATIONS', label: 'Operations', scoreField: 'Operations_Score' },
			{ key: 'FINANCIAL', label: 'Financial', scoreField: 'Financial_Score' },
			{ key: 'SERVICE', label: 'Service', scoreField: 'Service_Score' },
			{ key: 'AVERAGE', label: 'Average', scoreField: 'Average_Score' }
		];
		return categories.map(category => ({
			label: category.label,
			value: category.key,
			children: this.generateScoreChildren(category.key, category.label)
		}));
	},

	generateScoreChildren(categoryKey, categoryLabel) {
		const children = [];
		const sortedThresholds = [...this.scoreConfig.thresholds].sort((a, b) => b.min - a.min);
		sortedThresholds.forEach(threshold => {
			const displayName = this.getDisplayNameForThreshold(threshold.label);
			children.push({
				label: `${displayName} (${threshold.min}-${threshold.max}%)`,
				value: `${categoryKey}_${threshold.label.toUpperCase()}`
			});
		});
		children.push({
			label: `${this.scoreConfig.naConfig.label} (ไม่มีข้อมูล)`,
			value: `${categoryKey}_NA`
		});
		return children;
	},

	getDisplayNameForThreshold(label) {
		const mapping = {
			'Excellent': 'Excellent',
			'Good': 'Good',
			'Fair': 'Fair',
			'Poor': 'Poor'
		};
		return mapping[label] || label;
	},

	getFilteredVendorByTree(selectedValues = []) {
		if (!selectedValues || selectedValues.length === 0) {
			return this.vendor;
		}
		return this.vendor.filter(vendor => {
			return selectedValues.some(selectedValue => {
				const [category, scoreLevel] = selectedValue.split('_');
				const scoreField = this.getScoreFieldByCategory(category);
				if (!scoreField || !vendor[scoreField]) {
					return false;
				}
				return this.isScoreMatchingLevel(vendor[scoreField], scoreLevel);
			});
		});
	},

	getScoreFieldByCategory(category) {
		const mapping = {
			'OPERATIONS': 'Operations_Score',
			'FINANCIAL': 'Financial_Score',
			'SERVICE': 'Service_Score',
			'AVERAGE': 'Average_Score'
		};
		return mapping[category];
	},

	isScoreMatchingLevel(score, level) {
		if (score === 'N/A' || score === '' || score === null || score === undefined) {
			return level === 'NA';
		}
		const numericScore = parseFloat(score.toString().replace('%', ''));
		if (isNaN(numericScore)) {
			return level === 'NA';
		}
		const threshold = this.scoreConfig.thresholds.find(t =>
																											 t.label.toUpperCase() === level
																											);
		if (!threshold) {
			return false;
		}
		return numericScore >= threshold.min && numericScore <= threshold.max;
	},

	getScoreFilterOptions() {
		const options = this.scoreConfig.thresholds.map(threshold => {
			const displayName = this.getDisplayNameForThreshold(threshold.label);
			return {
				label: `${displayName} (${threshold.min}-${threshold.max}%)`,
				value: threshold.label
			};
		});
		options.push({
			label: `${this.scoreConfig.naConfig.label} (ไม่มีข้อมูล)`,
			value: 'N/A'
		});
		return options.sort((a, b) => {
			const order = { 'Excellent': 1, 'Good': 2, 'Fair': 3, 'Poor': 4, 'N/A': 5 };
			return (order[a.value] || 999) - (order[b.value] || 999);
		});
	},

	getFilteredVendor(filters = {}) {
		if (!filters.scoreFilters || filters.scoreFilters.length === 0) {
			return this.vendor;
		}
		return this.vendor.filter(vendor => {
			const scores = {
				average: vendor.Average_Score,
				operations: vendor.Operations_Score,
				financial: vendor.Financial_Score,
				service: vendor.Service_Score
			};
			return Object.values(scores).some(score => {
				if (score === 'N/A' || score === '' || score === null || score === undefined) {
					return filters.scoreFilters.includes('N/A');
				}
				const numericScore = parseFloat(score.toString().replace('%', ''));
				if (isNaN(numericScore)) {
					return filters.scoreFilters.includes('N/A');
				}
				const scoreCategory = this.getScoreCategoryByValue(numericScore);
				return filters.scoreFilters.includes(scoreCategory);
			});
		});
	},

	getScoreCategoryByValue(score) {
		if (isNaN(score)) return 'N/A';
		const threshold = this.scoreConfig.thresholds.find(t =>
																											 score >= t.min && score <= t.max
																											);
		return threshold ? threshold.label : 'N/A';
	},

	getTreeSelectionSummary(selectedValues = []) {
		if (!selectedValues || selectedValues.length === 0) {
			return `แสดงทั้งหมด ${this.vendor.length} รายการ`;
		}
		const filteredCount = this.getFilteredVendorByTree(selectedValues).length;
		const selectionDetails = selectedValues.map(value => {
			const [category, level] = value.split('_');
			const categoryName = this.getCategoryDisplayName(category);
			const levelName = this.getLevelDisplayName(level);
			return `${categoryName}: ${levelName}`;
		});
		return `แสดง ${filteredCount} จาก ${this.vendor.length} รายการ | กรองโดย: ${selectionDetails.join(', ')}`;
	},

	getCategoryDisplayName(category) {
		const mapping = {
			'OPERATIONS': 'Operations',
			'FINANCIAL': 'Financial',
			'SERVICE': 'Service',
			'AVERAGE': 'Average'
		};
		return mapping[category] || category;
	},

	getLevelDisplayName(level) {
		if (level === 'NA') return 'N/A';
		const threshold = this.scoreConfig.thresholds.find(t =>
																											 t.label.toUpperCase() === level
																											);
		if (threshold) {
			const displayName = this.getDisplayNameForThreshold(threshold.label);
			return `${displayName} (${threshold.min}-${threshold.max}%)`;
		}
		return level;
	},

	isScoreConfigReady() {
		return this.scoreConfig.thresholds && this.scoreConfig.thresholds.length > 0;
	},

	async openScoreCategoryModal() {
		await this.loadConfigFromDB();
		this.clearCategoryForm();
		showModal('ScoreCategory');
	},

	selectCategoryColorLabel(label, color) {
		this.selectedCategoryInfo = { label, color };
		showAlert('เลือกหมวดหมู่: ' + label, 'info');
	},

	getSelectedCategoryInfo() {
		return this.selectedCategoryInfo || { label: 'เลือกหมวดหมู่', color: '#e9ecef' };
	},

	hasSelectedCategory() {
		return this.selectedCategoryInfo !== null;
	},

	validateScoreRange(min, max, label, color) {
		if (!label) {
			showAlert('กรุณาเลือกหมวดหมู่', 'error');
			return false;
		}
		if (!color) {
			showAlert('กรุณาเลือกสี', 'error');
			return false;
		}
		if (isNaN(min) || isNaN(max)) {
			showAlert('กรุณากรอกช่วงคะแนนให้ถูกต้อง', 'error');
			return false;
		}
		if (min >= max) {
			showAlert('คะแนนต่ำสุดต้องน้อยกว่าคะแนนสูงสุด', 'error');
			return false;
		}
		if (min < 0 || max > 100) {
			showAlert('คะแนนต้องอยู่ระหว่าง 0-100', 'error');
			return false;
		}
		const labelExists = this.tempThresholds.some(t =>
																								 t.label === label && t.id !== 'custom_temp' && !t.markedForDeletion);
		if (labelExists) {
			showAlert('หมวดหมู่ ' + label + ' มีอยู่แล้ว', 'error');
			return false;
		}
		const hasOverlap = this.tempThresholds.some(t =>
																								!t.markedForDeletion && t.id !== 'custom_temp' &&
																								((min >= t.min && min <= t.max) || (max >= t.min && max <= t.max) || (min <= t.min && max >= t.max)));
		if (hasOverlap) {
			showAlert('ช่วงคะแนนซ้ำกับเกณฑ์ที่มีอยู่', 'error');
			return false;
		}
		return true;
	},

	handleRowEdit(row) {
		if (!row || !row.id) return;

		const thresholdIndex = this.tempThresholds.findIndex(t => t.id === row.id);
		if (thresholdIndex === -1) return;

		if (this.tempThresholds[thresholdIndex].markedForDeletion) return;

		const min = parseFloat(row.min);
		const max = parseFloat(row.max);
		const label = row.label || 'Unknown';
		const color = row.color || this.tempThresholds[thresholdIndex].color;

		try {
			if (isNaN(min) || isNaN(max)) {
				throw new Error("กรุณากรอกช่วงคะแนนเป็นตัวเลขสำหรับ " + label);
			}
			if (min >= max) {
				throw new Error("คะแนนต่ำสุดต้องน้อยกว่าคะแนนสูงสุดสำหรับ " + label);
			}
			if (min < 0 || max > 100) {
				throw new Error("คะแนนต้องอยู่ระหว่าง 0-100 สำหรับ " + label);
			}

			const labelExists = this.tempThresholds.some(t =>
																									 t.id !== row.id && t.label === label && !t.markedForDeletion
																									);
			if (labelExists) {
				throw new Error("หมวดหมู่ " + label + " มีอยู่แล้ว");
			}

			const hasOverlap = this.tempThresholds.some(t =>
																									t.id !== row.id && !t.markedForDeletion &&
																									((min >= t.min && min <= t.max) ||
																									 (max >= t.min && max <= t.max) ||
																									 (min <= t.min && max >= t.max))
																								 );
			if (hasOverlap) {
				throw new Error("ช่วงคะแนน " + min + "-" + max + " ซ้ำกับเกณฑ์ที่มีอยู่");
			}

			this.tempThresholds[thresholdIndex] = {
				...this.tempThresholds[thresholdIndex],
				label: label,
				min: min,
				max: max,
				color: color
			};

			const activeThresholds = this.tempThresholds.filter(t => !t.markedForDeletion);
			activeThresholds.sort((a, b) => b.min - a.min);
			const deletedThresholds = this.tempThresholds.filter(t => t.markedForDeletion);
			this.tempThresholds = [...activeThresholds, ...deletedThresholds];

			ScoreTable.setData(this.getScoreTableData());
			showAlert("อัปเดตช่วงคะแนนเรียบร้อย (ยังไม่บันทึก)", "info");
		} catch (error) {
			showAlert(error.message, 'error');
			ScoreTable.setData(this.getScoreTableData());
		}
	},

	addThresholdToTable() {
		storeValue('tableLoading', true);
		const minScore = parseFloat(MinInput.text);
		const maxScore = parseFloat(MaxInput.text);
		const { label, color } = this.selectedCategoryInfo || {};
		storeValue('minScoreInput', MinInput.text);
		storeValue('maxScoreInput', MaxInput.text);
		if (!this.validateScoreRange(minScore, maxScore, label, color)) {
			storeValue('tableLoading', false);
			return;
		}
		const newThreshold = {
			id: `temp_${this.nextId++}`,
			label,
			min: minScore,
			max: maxScore,
			color
		};
		this.tempThresholds.push(newThreshold);
		this.tempThresholds.sort((a, b) => b.min - a.min);
		ScoreTable.setData(this.getScoreTableData());
		this.clearCategoryForm();
		showAlert('เพิ่มช่วงคะแนนเรียบร้อย (ยังไม่บันทึก)', 'info');
		storeValue('tableLoading', false);
	},

	updateThresholdsFromTable() {
		let updatedData = [];
		if (ScoreTable.updatedRow) {
			updatedData = [ScoreTable.updatedRow];
		} else if (ScoreTable.updatedRows && ScoreTable.updatedRows.length > 0) {
			updatedData = ScoreTable.updatedRows;
		} else {
			return;
		}

		updatedData.forEach((updatedRow) => {
			if (!updatedRow) return;

			const min = parseFloat(updatedRow.min);
			const max = parseFloat(updatedRow.max);
			const label = updatedRow.label || 'Unknown';
			const id = updatedRow.id;
			const color = updatedRow.color;

			if (isNaN(min) || isNaN(max)) {
				throw new Error(`กรุณากรอกช่วงคะแนนเป็นตัวเลขสำหรับ ${label}`);
			}
			if (min >= max) {
				throw new Error(`คะแนนต่ำสุดต้องน้อยกว่าคะแนนสูงสุดสำหรับ ${label}`);
			}
			if (min < 0 || max > 100) {
				throw new Error(`คะแนนต้องอยู่ระหว่าง 0-100 สำหรับ ${label}`);
			}

			if (id) {
				const labelExists = this.tempThresholds.some(t =>
																										 t.id !== id && t.label === label
																										);
				if (labelExists) {
					throw new Error(`หมวดหมู่ ${label} มีอยู่แล้ว`);
				}

				const hasOverlap = this.tempThresholds.some(t =>
																										t.id !== id &&
																										((min >= t.min && min <= t.max) ||
																										 (max >= t.min && max <= t.max) ||
																										 (min <= t.min && max >= t.max))
																									 );
				if (hasOverlap) {
					throw new Error(`ช่วงคะแนน ${min}-${max} ซ้ำกับเกณฑ์ที่มีอยู่`);
				}

				const index = this.tempThresholds.findIndex(t => t.id === id);
				if (index !== -1) {
					this.tempThresholds[index] = {
						...this.tempThresholds[index],
						label: label,
						min: min,
						max: max,
						color: color || this.tempThresholds[index].color
					};
				}
			}
		});

		this.tempThresholds.sort((a, b) => b.min - a.min);
	},

	async saveAllThresholds() {
		try {
			storeValue('tableLoading', true);

			if (ScoreTable.updatedRow) {
				this.handleRowEdit(ScoreTable.updatedRow);
			}

			const activeThresholds = this.tempThresholds.filter(t => !t.markedForDeletion);
			const deletedThresholds = this.tempThresholds.filter(t => t.markedForDeletion);

			if (activeThresholds.length === 0 && deletedThresholds.length === 0) {
				showAlert('ไม่มีข้อมูลให้บันทึก', 'warning');
				storeValue('tableLoading', false);
				return;
			}

			// 1. ลบรายการที่ถูกมาร์กเพื่อลบ
			for (const threshold of deletedThresholds) {
				if (!threshold.id.startsWith('temp_')) {
					await DeleteScoreThreshold.run({ id: threshold.id });
				}
			}

			// 2. อัปเดตเกณฑ์คะแนนที่มีอยู่แล้ว
			for (const threshold of activeThresholds) {
				if (!threshold.id.startsWith('temp_')) {
					await UpdateAllScoreThresholds.run({
						id: threshold.id,
						label: threshold.label,
						min: threshold.min,
						max: threshold.max,
						color: threshold.color
					});
				}
			}

			// 3. เพิ่มเกณฑ์คะแนนใหม่
			for (const threshold of activeThresholds) {
				if (threshold.id.startsWith('temp_')) {
					const saveId = "custom_" + threshold.id.replace('temp_', '');
					await InsertScoreThreshold.run({
						id: saveId,
						label: threshold.label,
						min: threshold.min,
						max: threshold.max,
						color: threshold.color
					});
				}
			}

			// โหลดข้อมูลใหม่และอัปเดตตาราง
			await this.loadConfigFromDB();
			ScoreTable.setData(this.getScoreTableData());

			closeModal(Modal3.name);
			showAlert('บันทึกข้อมูลทั้งหมดเรียบร้อย', 'success');

			if (!ScoreCategory.isVisible) {
				showModal('ScoreCategory');
			}
		} catch (error) {
			closeModal(Modal3.name);
			showAlert("ไม่สามารถบันทึกข้อมูลได้: " + error.message, 'error');
		} finally {
			storeValue('tableLoading', false);
		}
	},

	validateAllThresholds() {
		try {
			if (ScoreTable.updatedRows && ScoreTable.updatedRows.length > 0) {
				ScoreTable.updatedRows.forEach(row => {
					const min = parseFloat(row.min);
					const max = parseFloat(row.max);
					if (isNaN(min) || isNaN(max)) {
						throw new Error(`ข้อมูลในแถว ${row.label} ไม่ถูกต้อง`);
					}
					if (min >= max) {
						throw new Error(`ช่วงคะแนนในแถว ${row.label} ไม่ถูกต้อง`);
					}
				});
			}
			return true;
		} catch (error) {
			showAlert(error.message, 'error');
			return false;
		}
	},

	clearCategorySelection() {
		this.selectedCategoryInfo = null;
	},

	clearCategoryForm() {
		this.clearCategorySelection();
		resetWidget('MinInput');
		resetWidget('MaxInput');
		resetWidget('NewRangeLabelInput');
		resetWidget('NewRangeColorPicker');
	},

	getScoreTableData() {
		return this.tempThresholds
			.filter(t => !t.markedForDeletion)
			.map(t => ({
			id: t.id,
			label: t.label,
			min: t.min,
			max: t.max,
			color: t.color,
			colorButton: t.color,
			isTemp: t.id.startsWith('temp_'),
			status: t.id.startsWith('temp_') ? 'ใหม่' : 'มีอยู่แล้ว'
		}));
	},

	closeCategoryModal() {
		const hasNewData = this.tempThresholds.some(t => t.id.startsWith('temp_'));
		const hasUpdatedData = ScoreTable.updatedRows && ScoreTable.updatedRows.length > 0;
		const hasUnsavedChanges = hasNewData || hasUpdatedData;

		if (hasUnsavedChanges) {
			showAlert(
				'มีข้อมูลที่ยังไม่ได้บันทึก การปิดหน้าต่างจะทำให้ข้อมูลหายไป',
				'warning',
				{
					onConfirm: () => {
						this.clearCategoryForm();
						this.tempThresholds = [...this.scoreConfig.thresholds];
						closeModal('ScoreCategory');
					},
					onCancel: () => {}
				}
			);
		} else {
			this.clearCategoryForm();
			closeModal('ScoreCategory');
		}
	},

	async clearAllCriteria() {
		try {
			this.tempThresholds = [];
			this.nextId = 1;
			this.clearCategoryForm();
			ScoreTable.setData(this.getScoreTableData());
			storeValue('minScoreInput', '');
			storeValue('maxScoreInput', '');
			showAlert('ล้างเกณฑ์ทั้งหมดเรียบร้อย (ยังไม่บันทึก)', 'info');
		} catch (error) {
			showAlert('ไม่สามารถล้างเกณฑ์ทั้งหมดได้', 'error');
		}
	},

	deleteScoreThreshold(id) {
		if (!id) {
			showAlert('ไม่สามารถลบเกณฑ์คะแนนได้: ไม่พบ ID', 'error');
			return;
		}

		const index = this.tempThresholds.findIndex(t => t.id === id);
		if (index !== -1) {
			this.tempThresholds[index].markedForDeletion = true;
			ScoreTable.setData(this.getScoreTableData());
			showAlert('เกณฑ์คะแนนถูกมาร์คเพื่อลบแล้ว กรุณากดบันทึกเพื่อยืนยัน', 'info');
		} else {
			showAlert('ไม่พบช่วงคะแนนที่ต้องการลบ', 'error');
		}
	},

	hasPendingDeletions() {
		return this.tempThresholds.some(t => t.markedForDeletion === true);
	},

	hasUnsavedChanges() {
		const hasNewData = this.tempThresholds.some(t => t.id.startsWith('temp_'));
		const hasUpdatedData = ScoreTable.updatedRows && ScoreTable.updatedRows.length > 0;
		const hasDeletions = this.hasPendingDeletions();
		return hasNewData || hasUpdatedData || hasDeletions;
	},

	getChangesSummary() {
		const newCount = this.tempThresholds.filter(t => t.id.startsWith('temp_') && !t.markedForDeletion).length;
		const updatedCount = ScoreTable.updatedRows ? ScoreTable.updatedRows.length : 0;
		const deletedCount = this.tempThresholds.filter(t => t.markedForDeletion).length;
		let summary = [];
		if (newCount > 0) summary.push("เพิ่มใหม่ " + newCount + " รายการ");
		if (updatedCount > 0) summary.push("แก้ไข " + updatedCount + " รายการ");
		if (deletedCount > 0) summary.push("ลบ " + deletedCount + " รายการ");
		return summary.length > 0 ? summary.join(', ') : 'ไม่มีการเปลี่ยนแปลง';
	},

	async saveNAConfig() {
		try {
			await SaveNAConfig.run({
				naConfig: JSON.stringify(this.scoreConfig.naConfig)
			});
			showAlert('บันทึกค่า N/A Config เรียบร้อย', 'success');
		} catch (error) {
			showAlert('ไม่สามารถบันทึกค่า N/A Config ได้', 'error');
		}
	}
};

export default {
	vendorPlot: [],
	formatDisplayDate(inputDate) {
		if (!inputDate) return 'ไม่ระบุ';

		const date = new Date(inputDate);
		if (isNaN(date)) return 'วันที่ไม่ถูกต้อง';

		const today = new Date();

		const day = date.getDate().toString().padStart(2, '0');
		const month = (date.getMonth() + 1).toString().padStart(2, '0');
		const year = date.getFullYear();

		return `${day}/${month}/${year}`;
	},

	async getGraph() {
		try {
			await vendorone.run()
			await getHistoryEvaluate_New.run()
			// const response = await evaluate_rate.run()
			// const response = await Vendorone_new.run()
			const response = await evaluate_rate_Old.run()

			const mappedData = response
			.filter(item => item.avg_score !== null && item.avg_score !== undefined)
			.map((item) => ({
				x: this.formatDisplayDate(item.ranking_updated_at) + ' (' + item.ranking_updated_by + ')',
				y: parseInt(item.avg_score.split("%")[0])
				// y: item.project_avg_score
			}))

			this.vendorPlot = mappedData;
			return mappedData
		}	catch (error) {
			// console.log(error)
			return [];
		}
	}
}

export default {
	suplist: [],
	copm: [],
	progressRules: [],
	selectedCategory: null,
	suppliers: [],
	vendor: [],
	table: true,
	container: true,
	async init() {
		// console.log("init function running on page load");
		try {
			await this.getProject();
			await this.getsupplier();
			await this.getVendorOne()
			this.loadProgressRulesFromDB().then(() => {
				this.updateProgressColors();
			});
			return true;
		} catch (error) {
			// console.error("Error in init function:", error);
			return false;
		}
	},
	updateProgressColors() {
		if (this.suplist.length > 0 && this.progressRules.length > 0) {
			const minRequired = this.getMinimumRequiredProgress();
			const updatedData = this.suplist.map(item => {
				const progressValue = item.ProgressValue;
				const matchingRule = this.progressRules.find(rule =>
																										 rule.category !== 'completed' &&
																										 progressValue >= rule.min &&
																										 progressValue <= rule.max
																										);
				const allowEvaluation = (
					item.ProjectType === 'Internal' ||
					progressValue >= minRequired ||
					progressValue === 100
				);
				return {
					...item,
					ProgressColor: this.getProgressColor(progressValue),
					AllowEvaluation: allowEvaluation,
					MinRequiredProgress: minRequired
				};
			});
			this.suplist = updatedData;
			// console.log("Progress colors updated:", this.suplist);
		}
	},
	calculateTimeDifference(startDate, endDate = new Date()) {
		if (!startDate) return 'ไม่ระบุ';
		const start = new Date(startDate);
		const end = new Date(endDate);
		if (isNaN(start.getTime()) || isNaN(end.getTime())) return 'วันที่ไม่ถูกต้อง';
		let years = end.getFullYear() - start.getFullYear();
		let months = end.getMonth() - start.getMonth();
		let days = end.getDate() - start.getDate();
		if (days < 0) {
			months--;
			const lastMonth = new Date(end.getFullYear(), end.getMonth(), 0);
			days += lastMonth.getDate();
		}
		if (months < 0) {
			years--;
			months += 12;
		}
		let result = [];
		if (years > 0) {
			result.push(years + ' y');
		}
		if (months > 0) {
			result.push(months + ' m');
		}
		if (days > 0 || result.length === 0) {
			result.push(days + ' d');
		}
		return result.join(' ');
	},
	async getProject() {
		// console.log("getProject เริ่มทำงาน");
		await this.loadProgressRulesFromDB();
		try {
			// console.log("กำลังเรียกใช้ Project_list.run()");
			const response = await Project_list.run();
			// console.log("ผลลัพธ์จาก Project_list:", response);
			const minRequired = this.getMinimumRequiredProgress();
			const mappedData = response.map((item) => {
				const progressValue = item.project_progress;
				const matchingRule = this.progressRules.find(rule =>
																										 rule.category !== 'completed' &&
																										 progressValue >= rule.min &&
																										 progressValue <= rule.max
																										);


				const allowEvaluation = (
					item.job_type === 'Internal' ||
					progressValue >= minRequired ||
					progressValue === 100 || checkRole.data[0]?.role === 'admin' || checkRole.data[0].role === 'pmo' || checkRole.data[0].role === 'purchase'
				);
				return {
					EvaluateCount: item.evaluation_status == '0/0' ? "N/A" : item.evaluation_status || "",
					ProjectCode: (item.code || "") + (item.status != null ? " (" + item.status + ")" : ""),
					RawProjectCode: item.code || "",
					ProjectType: item.job_type || "",
					ProjectName: item.name || "",
					ProjectStatus: item.project_status || "",
					Progress: item.project_progress != null ? item.project_progress + " %" : "N/A %",
					ProgressValue: item.project_progress,
					ProgressColor: this.getProgressColor(item.project_progress),
					AllowEvaluation:  allowEvaluation ,
					MinRequiredProgress: minRequired,
					ProjectManager: item.pm_name || "",
					CoProjectManager: item.copm || "",
					StartDate: item.start_date ? new Date(item.start_date).toLocaleDateString('en-GB') : "N/A",
					EndDate: item.end_date ? new Date(item.end_date).toLocaleDateString('en-GB') : "N/A",
					ProjectAge: (item.start_date && item.end_date) ? this.calculateTimeDifference(item.start_date, item.end_date) : "N/A",
				};
			});
			this.suplist = mappedData;
			// console.log("suplist ถูกอัปเดตแล้ว:", this.suplist);
			return mappedData;
		} catch (error) {
			// console.log('error',error)
				this.suplist = []
			// console.error('Error loading suppliers:', error);
			//showAlert('ไม่สามารถโหลดข้อมูล Supplier ได้', 'error');
			return [];
		}
	},
	async openProgressModal() {
		try {
			showAlert("กำลังโหลดข้อมูล...", "info");
			await this.loadProgressRulesFromDB();
			progress_table.setData(this.progressRules.filter(rule => rule.category !== 'completed'));
			Min_Progress.setValue("");
			Max_Progress.setValue("");
			this.selectedCategory = null;
			showModal('Modal2');
		} catch (error) {
			// console.error("Error opening modal:", error);
			showAlert("ไม่สามารถโหลดข้อมูลได้: " + error.message, "error");
		}
	},
	saveTemporaryRules() {
		try {
			const newRules = this.progressRules.filter(rule => rule.isNew);
			if (newRules.length > 0) {
				storeValue("tempProgressRules", newRules);
				// console.log("Saved temporary rules:", newRules);
			}
		} catch (error) {
			// console.error("Error saving temporary rules:", error);
		}
	},
	loadTemporaryRules() {
		try {
			const tempRules = appsmith.store.tempProgressRules;
			if (tempRules && tempRules.length > 0) {
				// console.log("Loading temporary rules:", tempRules);
				tempRules.forEach(tempRule => {
					const exists = this.progressRules.some(
						rule => rule.min === tempRule.min &&
						rule.max === tempRule.max &&
						rule.category === tempRule.category
					);
					if (!exists) {
						this.progressRules.push(tempRule);
					}
				});
				progress_table.setData(this.progressRules.filter(rule => rule.category !== 'completed'));
				storeValue("tempProgressRules", null);
			}
		} catch (error) {
			// console.error("Error loading temporary rules:", error);
		}
	},
	isEvaluationAllowed(progressValue, matchingRule) {
		if (progressValue === null || progressValue === undefined) {
			return false;
		}
		if (progressValue === 100) {
			return true;
		}
		if (matchingRule && (matchingRule.category === 'valid' || matchingRule.category === 'warning')) {
			return true;
		}
		return false;
	},
	getMinimumRequiredProgress() {
		const validRules = this.progressRules.filter(rule =>
																								 rule.category === 'valid' || rule.category === 'warning'
																								);
		if (validRules.length > 0) {
			validRules.sort((a, b) => a.min - b.min);
			return validRules[0].min;
		}
		return 50;
	},
	async loadProgressRulesFromDB() {
		try {
			// console.log("Loading progress rules from database...");
			const result = await getProgressRules.run();
			// console.log("Progress rules loaded:", result);
			if (result && result.length > 0) {
				this.progressRules = result.map(rule => ({
					id: rule.id,
					label: rule.label,
					min: rule.min_value,
					max: rule.max_value,
					category: rule.category || "valid",
					color: rule.color || "#17a2b8",
					createdBy: rule.created_by,
					createdAt: rule.created_at,
					isSystem: rule.category === 'completed'
				}));
				// console.log("Progress rules processed:", this.progressRules);
				return this.progressRules;
			} else {
				// console.log("No progress rules found in database");
				this.progressRules = [];
				return [];
			}
		} catch (error) {
			// console.error("Error loading progress rules from DB:", error);
			showAlert("ไม่สามารถโหลดเกณฑ์ Progress จากฐานข้อมูลได้", "error");
			this.progressRules = [];
			return [];
		}
	},
	getProgressColor(progressValue) {
		if (progressValue === null || progressValue === undefined) {
			return '#808080';
		}
		if (progressValue === 100) {
			const completedRule = this.progressRules.find(rule => rule.category === 'completed');
			return completedRule ? completedRule.color : '#28a745';
		}
		const matchingRule = this.progressRules.find(rule =>
																								 rule.category !== 'completed' &&
																								 progressValue >= rule.min &&
																								 progressValue <= rule.max
																								);
		if (matchingRule) {
			return matchingRule.color;
		}
		return '#808080';
	},
	selectCategoryWithColor(category, color, label) {
		const existingCategory = this.progressRules.find(rule =>
																										 rule.category === category && rule.category !== 'completed'
																										);
		if (existingCategory) {
			showAlert(`หมวดหมู่ ${label} มีการกำหนดเกณฑ์อยู่แล้ว`, 'warning');
			return;
		}
		this.selectedCategory = {
			category: category,
			color: color,
			label: label
		};
		showAlert(`เลือกหมวดหมู่: ${label}`, 'info');
	},
	updateButtonStates(selectedCategory) {
		// console.log(`Selected: ${selectedCategory}`);
	},
	async addProgressLimit() {
		if (!this.selectedCategory) {
			showAlert("กรุณาเลือกหมวดหมู่ก่อน", "warning");
			return;
		}

		const minValue = parseInt(Min_Progress.text) || 0;
		const maxValue = parseInt(Max_Progress.text) || 100;

		// ตรวจว่าค่าอยู่ในช่วง 0-100 และ min <= max
		if (minValue < 0 || maxValue > 100 || minValue > maxValue) {
			showAlert("กรุณากรอกค่าให้ถูกต้อง: Min (0-100) และต้องน้อยกว่าหรือเท่ากับ Max", "error");
			return;
		}

		const label = `${this.selectedCategory.label}: ${minValue}% - ${maxValue}%`;
		// console.log("Creating label:", label);
		// console.log("Selected category:", this.selectedCategory);

		const newRule = {
			label: label,
			min: minValue,
			max: maxValue,
			category: this.selectedCategory.category,
			color: this.selectedCategory.color,
			isNew: true
		};

		this.progressRules.push(newRule);

		try {
			// ไม่ดึง category 'completed' ออก ถ้าคุณยังต้องการกรอง ให้คงบรรทัดนี้ไว้
			progress_table.setData(
				this.progressRules.filter(rule => rule.category !== 'completed')
			);

			Min_Progress.setValue("");
			Max_Progress.setValue("");
			this.selectedCategory = null;
			showAlert("เพิ่มเกณฑ์ Progress เรียบร้อยแล้ว (รอการบันทึก)", "success");
		} catch (error) {
			// console.error("Error updating table:", error);
			showAlert("เกิดข้อผิดพลาดในการอัปเดตตาราง", "error");
			await this.refreshProgressTable();
		}
	},
	async removeProgressRule(index) {
		// console.log("Remove index:", index);
		if (index < 0 || index >= this.progressRules.length) {
			showAlert("ไม่พบข้อมูลที่ต้องการลบ", "warning");
			return;
		}
		const ruleToRemove = this.progressRules[index];
		// console.log("Rule to remove:", ruleToRemove);
		if (ruleToRemove && ruleToRemove.category === 'completed') {
			showAlert("ไม่สามารถลบเกณฑ์ระบบได้", "warning");
			return;
		}
		try {
			showAlert("กำลังลบข้อมูล...", "info");
			if (ruleToRemove.id) {
				await deleteProgressRule.run({
					id: ruleToRemove.id
				});
				const newRules = await getProgressRules.run();
				// console.log("New rules after deletion:", newRules);
				if (newRules && newRules.length > 0) {
					this.progressRules = newRules.map(rule => ({
						id: rule.id,
						label: rule.label,
						min: rule.min_value,
						max: rule.max_value,
						category: rule.category || "valid",
						color: rule.color || "#17a2b8",
						createdBy: rule.created_by,
						createdAt: rule.created_at,
						isSystem: rule.category === 'completed'
					}));
				} else {
					this.progressRules = [];
				}
				progress_table.setData(this.progressRules.filter(rule => rule.category !== 'completed'));
				showAlert("ลบเกณฑ์จากฐานข้อมูลเรียบร้อยแล้ว", "success");
				getProgressRules.run();
			} else {
				this.progressRules.splice(index, 1);
				progress_table.setData(this.progressRules.filter(rule => rule.category !== 'completed'));
				showAlert("ลบเกณฑ์เรียบร้อยแล้ว", "success");
			}
		} catch (error) {
			// console.error("Error in removeProgressRule:", error);
			showAlert("เกิดข้อผิดพลาดในการลบข้อมูล: " + error.message, "error");
			await this.refreshProgressTable();
		}
	},
	async saveProgressRules() {
		const newRules = this.progressRules.filter(rule => rule.isNew);
		if (newRules.length === 0) {
			showAlert("ไม่มีเกณฑ์ใหม่ที่ต้องบันทึก", "info");
			return;
		}
		try {
			showAlert("กำลังบันทึกข้อมูล...", "info");
			for (const rule of newRules) {
				// console.log("Saving rule:", rule);
				if (!rule.label || !rule.category || !rule.color) {
					showAlert("ข้อมูลไม่ครบถ้วน กรุณาตรวจสอบอีกครั้ง", "error");
					return;
				}
				await addProgressRule.run({
					label: rule.label,
					min: rule.min,
					max: rule.max,
					category: rule.category,
					color: rule.color,
					created_by: appsmith.user.email || "system"
				});
			}
			await this.loadProgressRulesFromDB();
			progress_table.setData(this.progressRules.filter(rule => rule.category !== 'completed'));
			showAlert(`บันทึกเกณฑ์ Progress จำนวน ${newRules.length} รายการเรียบร้อยแล้ว`, 'success');
			await this.getProject();
		} catch (error) {
			// console.error("Error saving progress rules:", error);
			showAlert("ไม่สามารถบันทึกเกณฑ์ Progress ได้: " + error.message, "error");
			getProgressRules.run();
		}
	},
	async loadProgressRules() {
		await this.loadProgressRulesFromDB();
		progress_table.setData(this.progressRules.filter(rule => rule.category !== 'completed'));
		this.selectedCategory = null;
		this.updateButtonStates(null);
	},
	async getsupplier() {
		try {
			// เปิด modal loading
			showModal(Modal3.name);

			// ดึงข้อมูลจาก SupplierTable
			const response = await SupplierTable.run();
			const dataArray = Array.isArray(response) ? response : [];

			// Map ข้อมูล
			const mappedData = dataArray.map(item => ({
				SupplierId: item.id || "",
				SupplierCode: item.code || "",
				SupplierName: item.name || "",
				Evaluate: !item.record_count ? "Evaluate" : `Evaluate (${item.record_count})`,
				Remark: item.remark || "",
				RankedAt: item.ranking_updated_at ? new Date(item.ranking_updated_at).toLocaleDateString("en-GB") : "",
				RankedBy: item.ranking_updated_by || "",
				AverageScore: item.avg_score || "",
				LastRankedBy: item.last_ranking_by || "",
			}));

			// เก็บใน state
			this.suppliers = mappedData;
			// console.log("Mapped supplier data:", mappedData);

			// Toggle แสดงผล
			if (mappedData.length > 0) {
				this.table = true;
				this.container = false;
			} else {
				this.table = false;
				this.container = true;
			}

			return mappedData.length > 0;

		} catch (error) {
			// console.error("Error loading suppliers:", error);
			showAlert("ไม่สามารถโหลดข้อมูล Supplier ได้", "error");
			this.table = false;
			this.container = true;
			return false;
		} finally {
			// ปิด modal loading
			closeModal(Modal3.name);
		}
	},
	async refreshProgressTable() {
		try {
			showAlert("กำลังโหลดข้อมูล...", "info");
			const result = await getProgressRules.run();
			// console.log("Refreshed progress rules:", result);
			if (result && result.length > 0) {
				this.progressRules = result.map(rule => ({
					id: rule.id,
					label: rule.label,
					min: rule.min_value,
					max: rule.max_value,
					category: rule.category || "valid",
					color: rule.color || "#17a2b8",
					createdBy: rule.created_by,
					createdAt: rule.created_at,
					isSystem: rule.category === 'completed'
				}));
			} else {
				this.progressRules = [];
			}
			progress_table.setData(this.progressRules.filter(rule => rule.category !== 'completed'));
			// console.log("Table data updated:", this.progressRules.filter(rule => rule.category !== 'completed'));
			showAlert("โหลดข้อมูลเรียบร้อยแล้ว", "success");
			return this.progressRules;
		} catch (error) {
			// console.error("Error refreshing progress table:", error);
			showAlert("ไม่สามารถโหลดข้อมูลได้: " + error.message, "error");
			return [];
		}
	},
	async getVendorOne() {
		try {
			const response = await Vendorone_new.run();
			const items = response?.data || response || [];
			if (!Array.isArray(items)) {
				// console.error('Invalid response from vendorone:', response);
				showAlert('ข้อมูล Vendor ไม่ถูกต้อง', 'error');
				return { data: [] };
			}
			const sortedAndNumbered = items.map((item) => {
				return {
					projectCode: item.project_code || "",
					projectName: item.project_name || "",
					projectProgress: item.project_progress ? item.project_progress + ' % ' : 'N/A',
					Customer: item.customer || "",
					remark: item.remark || "",
					// rankedBy: item.ranking_updated_by || "",
					rankedBy: item.evaluator_scores || "",
					rankedAt: item.all_ranking_dates
					? item.all_ranking_dates
					.split(', ')
					.map(dateStr => {
						const date = new Date(dateStr);
						return isNaN(date.getTime()) ? dateStr : date.toLocaleDateString('en-GB');
					})
					.join(', ')
					: '',
					AverageScoreOnRanked: /*item.avg_score */ item.project_avg_score|| '',
					status: item.status_label || 'N/A',
					StartDate: item.start_date ? new Date(item.start_date).toLocaleDateString('en-GB') : "N/A",
					EndDate: item.end_date ? new Date(item.end_date).toLocaleDateString('en-GB') : "N/A",
					ProjectAge: (item.start_date && item.end_date) ? this.calculateTimeDifference(item.start_date, item.end_date) : "N/A", 
				};
			});
			this.vendor = sortedAndNumbered;
			// console.log('Vendor data processed:', sortedAndNumbered);
			return {
				data: sortedAndNumbered,
			};
		} catch (err) {
			// console.error('Error in getVendorOne:', err);
			return {
				data: [],
				firstRankedDate: "",
				lastRankedDate: ""
			};
		}
	},
}

*/