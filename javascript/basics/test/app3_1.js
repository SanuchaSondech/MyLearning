export default {
    status: '',
    evaluationData: [],
    logout() {
        clearStore()
        navigateTo(
            'https://msync.mfec.co.th/signout?app=supplier_eva', 'SAME_WINDOW'
        )
    },

    async storeValue() {
        try {
            if (appsmith.URL.queryParams.supplierCode || appsmith.URL.queryParams.supplierId || appsmith.URL.queryParams.supplierName) {
                storeValue("supCode", appsmith.URL.queryParams.supplierCode)
                storeValue("supId", appsmith.URL.queryParams.supplierId)
                storeValue("supName", appsmith.URL.queryParams.supplierName)
            }

            return null
        } catch (error) {
            return error
        }
    },

    async log() {
        try {
            const response = await Evaluate_Question.run();
            const answers = https_appsmith_mlab_mfec_co_th.model.answers || {}; // ป้องกัน undefined
            // if(!appsmith.URL.queryParams.supplierId){
            // showAlert('Something went wrong', 'error');
            // return []
            // }

            const data = response.map((item) => {
                // แปลงค่า answer จาก text เป็น score
                const answerText = answers[item.id];
                let scoreValue = null;
                // console.log(answerText)

                if (answerText === 'best') {
                    scoreValue = 10;
                } else if (answerText === 'medium') {
                    scoreValue = 5;
                } else if (answerText === 'bad') {
                    scoreValue = 0;
                }


                return {
                    supplierId: parseInt(appsmith.store.supId) || null,
                    id: item.id || null,
                    value: scoreValue, // ใช้ score แทน text
                    remark: https_appsmith_mlab_mfec_co_th.model.userRemark || '',
                    weight: item.weight || null,
                    created_by: appsmith.store.email?.split('@')[0] || 'unknown',
                    category: item.category || null
                };
            });

            this.evaluationData = data;

            const score = await insertEvalDetails.run();
            // console.log('score', score)

            if (score) {
                const res = await insertEvalSupplier.run()
                if (res) {
                    showAlert('Succesful', 'success')
                    storeValue("supCode", '')
                    storeValue("supName", '')
                    storeValue("supId", '')
                    navigateTo('Supplier');
                }
                return []
            }

            return data;
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในฟังก์ชัน log:", error);
            showAlert("เกิดข้อผิดพลาดในการบันทึกข้อมูล", "error");
        }
    },
    test(value) {
        if (value == 'logout') {
            this.logout()
        } else if (value == 'email') {
            if (this.status == 'Y') {
                showAlert('Change To No Receipt Email', 'info')
                this.status = 'N'
            } else if (this.status == 'N') {
                showAlert('Change To Yes Receipt Email', 'info')
                this.status = 'Y'
            }
        }
    }
}