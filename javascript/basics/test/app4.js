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