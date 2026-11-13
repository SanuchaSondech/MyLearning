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
                    AllowEvaluation: allowEvaluation,
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
                    AverageScoreOnRanked: /*item.avg_score */ item.project_avg_score || '',
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