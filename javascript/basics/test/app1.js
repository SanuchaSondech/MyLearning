export default {
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
