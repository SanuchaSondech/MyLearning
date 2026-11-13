/*export default {
	parseHashParams(hash) {
		const params = {};
		if (hash) {
			hash.substring(1).split("&").forEach((pair) => {
				const [key, value] = pair.split("=");
				params[key] = value;
			});
		}
		return params;
	},

	async getHashTag() {
		const hash = appsmith.URL.hash;
		const params = this.parseHashParams(hash);

		if (hash) {
			const token = params.access_token || null;
			await storeValue("access_token", token);

			if (!token) {
				showAlert("Invalid Access Token", "error");
				await storeValue("email", null);
				return;
			}

			try {
				const { email } = await SignMicrosoft.run();
				await storeValue("email", email);

				if (!email) {
					navigateTo("Gateway");
					return;
				}

				this.Auth();
			} catch {
				navigateTo("Gateway");
			}
		} else if (appsmith.store.access_token) {
			try {
				const { email } = await SignMicrosoft.run();
				await storeValue("email", email);

				if (!email) {
					navigateTo("Gateway");
					return;
				}

				this.Auth();
			} catch {
				navigateTo("Gateway");
			}
		} else {
			navigateTo("Gateway");
		}
	},

	async Auth() {
		const authData = await SignMicrosoft.run();
		const { id, email, last_sign_in_at } = authData || {};

		if (!id || !email) {
			showAlert("Login failed", "error");
			return;
		}

		const userExists = await AuthDB.run({ id });

		const role = await AutoAdmin.admin()

		if (userExists.length === 0) {
			await NewUser.run({
				role: role,
				user_id: id,
				email,
				last_sign_in_at,
			});
		} else {
			await SetLastLogin.run({
				role,
				last_sign_in_at,
				userId: id,
			});
		}

		await storeValue("userId", id);
		navigateTo("Supplier");
	},
};

export default {
	admin: async () => {
		// let admin = ['someone@example.com', 'nutta_w@mfec.co.th']
		// let test = await Role.run({ role: 'admin' })
		// let admin = await Role.run({ role: 'admin' })
		// admin = await Role.run({ role: 'admin_it'})
		let admin = await Role.run({ role: `'admin','admin_it'`  })
		admin.push({ "email" : "karin.wis@mfec.co.th" })
		const email = ['phongphon.sir@mfec.co.th' === 'napak_n@mfec.co.th'];

		let pmo = await Role.run({ role: `'pmo'` })
		

		let purchase = await Purchase.run()
		let audit = await Audit.run()
		const { email } = await SignMicrosoft.run();
		// console.log('admin', admin)
		// console.log('pmo', pmo)
		// console.log('purchase', purchase)
		// console.log('audit', audit)

		// admin.push({ "email" : "kitsada_k@mfec.co.th" })
		// const email = 'chawamon@mfec.co.th'

		if (admin.some(item => item.email === email)) {
			// ทำได้ทุกอย่างเข้าประเมินได้เลยทุกโปรเจคดูได้ทุกโปรเจคและ config ได้
			return 'admin'
		} else if (pmo.some(item => item.email === email)) {
			// config ได้และดูได้ทุกโปรเจค
			return 'pmo'
		} else if (purchase.some(item => item.company_email === email)) {
			// ดูได้ทุกโปรเจคประเมินได้เลย
			return 'purchase'
		} else if (audit.some(item => item.email === email)) {
			// ดูได้อย่างเดียวประเมินไม่ได้ของทุกโปรเจค
			return 'audit'
		} else {
			// ประเิมนได้เมื่อ progress ถึงและเห็นแค่ของตัวเอง
			return 'user'
		}
	}
}


*/