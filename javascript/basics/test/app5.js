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