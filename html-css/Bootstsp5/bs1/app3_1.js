export default {
	displayTopic: [],
	dbTopic: [],
	selectedYear: null,
	selectedLabel: null,
	allTopic: [],
	availableYears: [],
	newlyAddedTopics: [],
	editedTopics: [],
	choice: [
		{ label: "abc", value: "abc" },
		{ label: "def", value: "def" },
		{ label: "chi", value: "chi" }
	],
	allChange: [],
	isCategoryChanged() {
		return appsmith.store.categoryChanged === true;
	},


	async fetchAllTopics() {
		try {
			await GetTopic.run();
			await loadCategories.run();
			await GetYearAllTopic.run();
			await GetLabelAllTopic.run();

			if (!GetTopic.data) {
				// console.error("Failed to fetch topics data");
				return;
			}

			this.allTopic = GetTopic.data;
			this.dbTopic = this.allTopic;
			this.displayTopic = JSON.parse(JSON.stringify(this.dbTopic));
			this.newlyAddedTopics = [];
			this.editedTopics = [];

			if (Table1Copy) {
				Table1Copy.setData(this.displayTopic);
			}

			if (SelectYear && GetYearAllTopic.data) {
				const yearOptions = [
					{ label: "-- ทั้งหมด --", value: null },
					...GetYearAllTopic.data.map(item => ({
						label: item.year.toString(),
						value: item.year.toString()
					}))
				];
				SelectYear.setOptions(yearOptions);
			}

			if (SelectLabel && GetLabelAllTopic.data) {
				const labelOptions = [
					{ label: "-- ทั้งหมด --", value: null },
					...GetLabelAllTopic.data.map(item => ({
						label: item.label,
						value: item.label
					}))
				];
				SelectLabel.setOptions(labelOptions);
			}
		} catch (error) {
			// console.error("Error in fetchAllTopics:", error);
			showAlert("เกิดข้อผิดพลาดในการดึงข้อมูล", "error");
		}
	},


	filterTopics() {
		if (!this.selectedYear && !this.selectedLabel) {
			this.dbTopic = this.allTopic;
			this.displayTopic = JSON.parse(JSON.stringify(this.dbTopic));
			return;
		}

		let filteredData = this.allTopic.filter(topic => {
			const topicYear = new Date(topic.created_at).getFullYear();

			if (this.selectedYear && topicYear !== parseInt(this.selectedYear)) {
				return false;
			}

			if (this.selectedLabel && topic.label !== this.selectedLabel) {
				return false;
			}

			return true;
		});

		this.dbTopic = filteredData;
		this.displayTopic = JSON.parse(JSON.stringify(this.dbTopic));

		if (Table1Copy) {
			Table1Copy.setData(this.displayTopic);
		}
	},
	handleYearChange(selectedYear) {
		this.selectedYear = selectedYear;
	},
	handleLabelChange(selectedLabel) {
		this.selectedLabel = selectedLabel;
	},
	applyFilter() {
		this.filterTopics();
	},
	async onPageLoad() {
		await this.fetchAllTopics();
	},

	async getNextLabel() {
		try {
			await GetTopic.run();

			const currentYear = new Date().getFullYear();
			// console.log(`Getting next label for year: ${currentYear}`);

			if (!GetTopic.data || GetTopic.data.length === 0) {
				// console.log("No data found, returning label 1");
				return 1;
			}

			// กรองข้อมูลเฉพาะปีปัจจุบัน
			const topicsInCurrentYear = GetTopic.data.filter(topic => {
				const topicYear = new Date(topic.created_at).getFullYear();
				return topicYear === currentYear;
			});

			// console.log(`Topics in ${currentYear}:`, topicsInCurrentYear.length);

			if (topicsInCurrentYear.length === 0) {
				// console.log(`No topics in ${currentYear}, returning label 1`);
				return 1;
			}

			// หา label สูงสุดในปีปัจจุบัน
			const labelsInCurrentYear = topicsInCurrentYear
			.map(topic => parseInt(topic.label) || 0)
			.filter(label => label > 0); // กรองเฉพาะ label ที่เป็นตัวเลขมากกว่า 0

			const maxLabel = labelsInCurrentYear.length > 0 ? Math.max(...labelsInCurrentYear) : 0;
			const nextLabel = maxLabel + 1;

			// console.log(`Max label in ${currentYear}: ${maxLabel}, Next label: ${nextLabel}`);
			return nextLabel;

		} catch (error) {
			// console.error("Error getting next label:", error);
			// กรณี error ให้ใช้ข้อมูลใน memory
			const currentYear = new Date().getFullYear();
			const labelsInCurrentYear = this.allTopic
			.filter(topic => new Date(topic.created_at).getFullYear() === currentYear)
			.map(topic => parseInt(topic.label) || 0);

			const maxLabel = labelsInCurrentYear.length > 0 ? Math.max(...labelsInCurrentYear) : 0;
			return maxLabel + 1;
		}
	},

	checkTotalWeight() {
		const totalWeight = this.displayTopic.reduce((sum, topic) => {
			const weight = parseFloat(topic.weight) || 0;
			return sum + weight;
		}, 0);

		const invalidWeights = this.displayTopic.filter(topic => {
			const weight = parseFloat(topic.weight) || 0;
			return weight > 100;
		});

		if (invalidWeights.length > 0) {
			showAlert`พบน้ำหนักที่มากกว่า 100% ในหัวข้อ "${invalidWeights[0].name}" (${invalidWeights[0].weight}%) กรุณาแก้ไขให้น้ำหนักไม่เกิน 100%`, 'error';
			return false;
		}

		if (totalWeight > 100) {
			showAlert`รวม Weight = ${totalWeight}% เกินกว่า 100% กรุณาปรับให้ผลรวมเท่ากับ 100%`, 'error';
			return false;
		}

		if (totalWeight < 100) {
			showAlert`รวม Weight = ${totalWeight}% น้อยกว่า 100% กรุณาปรับให้ผลรวมเท่ากับ 100%`, 'error';
			return false;
		}

		showModal(CategoryModal.name);
		return true;
	},

	openNewTopicModal() {
		showModal("NewTopicModal");
	},

	getCurrentDateTime() {
		const now = new Date();
		return now.toISOString().split('.')[0].replace('T', ' ');
	},

	addNewTopic() {
		if (!inputTopicName.text || !inputWeight.text || !inputBest.text || !inputMedium.text || !inputBad.text) {
			showAlert("กรุณากรอกข้อมูลให้ครบทุกช่อง", "error");
			return;
		}

		const weight = parseInt(inputWeight.text);
		if (isNaN(weight)) {
			showAlert("น้ำหนักต้องเป็นตัวเลข", "error");
			return;
		}

		if (weight > 100) {
			showAlert("น้ำหนักต้องไม่เกิน 100%", "error");
			return;
		}

		const currentTotalWeight = this.displayTopic.reduce((sum, topic) => {
			const topicWeight = parseFloat(topic.weight) || 0;
			return sum + topicWeight;
		}, 0);

		const newTotalWeight = currentTotalWeight + weight;
		if (newTotalWeight > 100) {
			showAlert`น้ำหนักรวมจะเป็น ${newTotalWeight}% ซึ่งเกิน 100% กรุณาปรับลดน้ำหนักให้รวมไม่เกิน 100%`, "error";
			return;
		}

		let categoryName = null;
		const categoryId = SelectCategory.selectedOptionValue ? parseInt(SelectCategory.selectedOptionValue) : null;

		if (categoryId && loadCategories.data) {
			const category = loadCategories.data.find(cat => parseInt(cat.id) === categoryId);
			categoryName = category ? category.name : null;
		}

		// หาค่า label ล่าสุดของปีปัจจุบัน
		const currentYear = new Date().getFullYear();
		let newLabel = 1; // ค่าเริ่มต้นถ้าไม่พบ label ในปีปัจจุบัน

		// กรองข้อมูลเฉพาะปีปัจจุบัน
		const topicsInCurrentYear = this.allTopic.filter(topic => {
			const topicYear = new Date(topic.created_at).getFullYear();
			return topicYear === currentYear;
		});

		// หาค่า label สูงสุดในปีปัจจุบัน
		if (topicsInCurrentYear.length > 0) {
			const labels = topicsInCurrentYear.map(topic => {
				const labelValue = parseInt(topic.label);
				return isNaN(labelValue) ? 0 : labelValue;
			});

			if (labels.length > 0) {
				newLabel = Math.max(...labels) + 1;
			}
		}

		// เพิ่มค่า newLabel ลงในข้อมูลใหม่
		const newTopic = {
			name: inputTopicName.text,
			weight: weight,
			best: inputBest.text,
			medium: inputMedium.text,
			bad: inputBad.text,
			label: newLabel.toString(), // ใช้ค่า label ใหม่ที่คำนวณได้
			active_flag: parseInt(inputActiveFlag.text || "1"),
			category: categoryId,
			category_name: categoryName,
			created_at: this.getCurrentDateTime(),
			created_by: appsmith.user.username || "sysadmin"
		};

		const updatedTopics = [...this.displayTopic];
		updatedTopics.push(newTopic);
		this.displayTopic = updatedTopics;
		this.newlyAddedTopics.push(newTopic);

		this.clearModalForm();
		closeModal("NewTopicModal");
		showAlert`เพิ่มหัวข้อสำเร็จแล้ว (น้ำหนักรวมปัจจุบัน = ${newTotalWeight}%, Label = ${newLabel})`, "success";
	},

	clearModalForm() {
		resetWidget("inputTopicName");
		resetWidget("inputWeight");
		resetWidget("inputBest");
		resetWidget("inputMedium");
		resetWidget("inputBad");
		resetWidget("dropdownCategory");
		resetWidget("inputTopicnums");
	},

	async processTableUpdates() {
		const updatedTopics = [];

		if (!Table1Copy.updatedRows || Table1Copy.updatedRows.length === 0) {
			return updatedTopics;
		}

		Table1Copy.updatedRows.forEach(({ index, allFields: updated }) => {
			const original = this.dbTopic[index];
			if (!original) return;

			// ตรวจสอบน้ำหนักของแต่ละหัวข้อ
			if (updated.weight && parseFloat(updated.weight) > 100) {
				throw new Error(`น้ำหนักของหัวข้อ "${updated.name}" (${updated.weight}%) เกิน 100%`);
			}

			// ตรวจสอบว่ามีการเปลี่ยนแปลงจริงหรือไม่
			let hasChanges = false;
			Object.keys(updated).forEach(key => {
				if (updated[key] !== original[key]) {
					hasChanges = true;
				}
			});

			if (hasChanges) {
				// อัปเดตข้อมูลใน displayTopic
				this.displayTopic[index] = updated;

				// เพิ่มเข้าลิสต์ที่จะอัปเดต
				updatedTopics.push({
					...updated,
					id: original.id,
					created_at: original.created_at,
					label: original.label
				});
			}
		});

		return updatedTopics;
	},
	cleanString(str) {
		if (!str) return "";
		return str.toString()
			.replace(/'/g, "''")
			.replace(/\\/g, "\\\\")
			.replace(/\n/g, " ")
			.replace(/\r/g, " ")
			.trim();
	},

	getCategoryId(categoryName) {
		if (!categoryName || !loadCategories.data) return null;
		const category = loadCategories.data.find(cat => cat.name === categoryName);
		return category ? parseInt(category.id) : null;
	},

	detectChanges() {
		const changes = [];
		let hasAnyChanges = false;

		// console.log("Detecting changes...");
		// console.log("Table1Copy.updatedRows:", Table1Copy.updatedRows);

		// ตรวจสอบการแก้ไขใน Table
		if (Table1Copy.updatedRows && Table1Copy.updatedRows.length > 0) {
			Table1Copy.updatedRows.forEach(({ index, allFields: updated }) => {
				const original = this.dbTopic[index];
				// console.log(`Row ${index} - Original:`, original);
				// console.log(`Row ${index} - Updated:`, updated);

				if (!original) return;

				let hasChanges = false;
				const changedFields = Object.keys(updated).reduce((acc, key) => {
					// แปลงค่าให้เป็น string เพื่อเปรียบเทียบ
					const originalValue = String(original[key] || '');
					const updatedValue = String(updated[key] || '');

					if (originalValue !== updatedValue) {
						hasChanges = true;
						hasAnyChanges = true;
						acc.push({
							index,
							field: key,
							oldValue: original[key],
							newValue: updated[key]
						});
						// console.log(`Changed field ${key}: "${originalValue}" -> "${updatedValue}"`);
					}
					return acc;
				}, []);

				if (hasChanges) {
					changes.push(...changedFields);
				}
			});
		}

		// ตรวจสอบการเปลี่ยนแปลง Category
		if (appsmith.store.categoryChanged === true) {
			const rowIndex = appsmith.store.categoryChangedRowIndex;
			if (rowIndex !== undefined && this.dbTopic[rowIndex]) {
				const original = this.dbTopic[rowIndex];
				const updated = this.displayTopic[rowIndex];

				if (original.category !== updated.category) {
					changes.push({
						index: rowIndex,
						field: 'category',
						oldValue: original.category,
						newValue: updated.category
					});
					hasAnyChanges = true;
				}
			}
		}

		// ตรวจสอบข้อมูลใหม่ที่เพิ่มเข้ามา
		const hasNewData = this.newlyAddedTopics.length > 0;

		console.log("Detection result:", {
			hasChanges: hasAnyChanges || hasNewData,
			hasTableUpdates: Table1Copy.updatedRows && Table1Copy.updatedRows.length > 0,
			hasNewData,
			hasCategoryChanges: appsmith.store.categoryChanged === true,
			changes
		});

		return {
			hasChanges: hasAnyChanges || hasNewData,
			hasTableUpdates: Table1Copy.updatedRows && Table1Copy.updatedRows.length > 0,
			hasNewData,
			hasCategoryChanges: appsmith.store.categoryChanged === true,
			changes,
			summary: this.getChangesSummary(changes, hasNewData)
		};
	},

	async submitToDatabase() {
		try {
			// ตรวจสอบการแก้ไขในตาราง
			const hasTableUpdates = Table1Copy.updatedRows && Table1Copy.updatedRows.length > 0;
			const hasNewData = this.newlyAddedTopics.length > 0;
			const hasCategoryChanges = appsmith.store.categoryChanged === true;

			// console.log("Detection:", {
			// hasTableUpdates,
			// hasNewData,
			// hasCategoryChanges,
			// updatedRows: Table1Copy.updatedRows
			// });

			if (!hasTableUpdates && !hasNewData && !hasCategoryChanges) {
				showAlert("ไม่มีข้อมูลใหม่หรือข้อมูลที่แก้ไขที่จะบันทึก", "warning");
				return;
			}

			// ประมวลผลการแก้ไขในตารางก่อน
			if (hasTableUpdates) {
				// console.log("Processing table updates...");
				Table1Copy.updatedRows.forEach(({ index, allFields: updated }) => {
					// console.log(`Updating row ${index}:`, updated);

					// ตรวจสอบน้ำหนักของแต่ละหัวข้อ
					if (updated.weight && parseFloat(updated.weight) > 100) {
						throw new Error(`น้ำหนักของหัวข้อ "${updated.name}" (${updated.weight}%) เกิน 100%`);
					}

					// อัปเดตข้อมูลใน displayTopic โดยตรง
					if (this.displayTopic[index]) {
						this.displayTopic[index] = {
							...this.displayTopic[index],
							...updated
						};
						// console.log(`Updated displayTopic[${index}]:`, this.displayTopic[index]);
					}
				});
			}

			// ประมวลผลการเปลี่ยนแปลง Category
			if (hasCategoryChanges) {
				// console.log("Processing category changes...");
				storeValue('categoryChanged', false);
				storeValue('categoryChangedRowIndex', undefined);
			}

			// หา label ใหม่
			const nextLabel = await this.getNextLabel();
			// console.log("Next label:", nextLabel);

			// ตรวจสอบน้ำหนักรวม
			const totalWeight = this.displayTopic.reduce((sum, topic) => {
				const weight = parseFloat(topic.weight) || 0;
				return sum + weight;
			}, 0);

			// console.log("Total weight:", totalWeight);

			const invalidWeights = this.displayTopic.filter(topic => {
				const weight = parseFloat(topic.weight) || 0;
				return weight > 100;
			});

			if (invalidWeights.length > 0) {
				showAlert(`ไม่สามารถบันทึกข้อมูลได้: พบน้ำหนักที่มากกว่า 100% ในหัวข้อ "${invalidWeights[0].name}" (${invalidWeights[0].weight}%)`, 'error');
				return;
			}

			if (totalWeight !== 100) {
				showAlert(`ไม่สามารถบันทึกข้อมูลได้: รวม Weight = ${totalWeight}% ${totalWeight > 100 ? 'เกิน' : 'ไม่ครบ'} 100%`, 'error');
				return;
			}

			// สร้างข้อมูลชุดใหม่ทั้งหมด
			const topicsToSaveAsNew = this.displayTopic.map(topic => {
				let categoryId = topic.category;
				let categoryName = topic.category_name;

				// จัดการ category
				if (!categoryId && categoryName && loadCategories.data) {
					const category = loadCategories.data.find(cat => cat.name === categoryName);
					categoryId = category ? parseInt(category.id) : null;
				}

				if (!categoryName && categoryId && loadCategories.data) {
					const category = loadCategories.data.find(cat => parseInt(cat.id) === parseInt(categoryId));
					categoryName = category ? category.name : null;
				}

				return {
					name: topic.name,
					weight: parseInt(topic.weight) || 0,
					best: topic.best,
					medium: topic.medium,
					bad: topic.bad,
					label: nextLabel.toString(),
					active_flag: parseInt(topic.active_flag) || 1,
					category: categoryId,
					category_name: categoryName,
					created_at: this.getCurrentDateTime(),
					created_by: appsmith.user.username || "sysadmin"
				};
			});

			// console.log("Topics to save:", topicsToSaveAsNew);

			showAlert(`กำลังบันทึกข้อมูล ปี ${new Date().getFullYear()} Label ${nextLabel}...`, "info");

			// บันทึกข้อมูลชุดใหม่ทั้งหมด
			const results = [];
			for (const topic of topicsToSaveAsNew) {
				const payload = {
					name: this.cleanString(topic.name),
					weight: topic.weight,
					best: this.cleanString(topic.best),
					medium: this.cleanString(topic.medium),
					bad: this.cleanString(topic.bad),
					label: parseInt(topic.label) || 1,
					active_flag: topic.active_flag,
					category: topic.category,
					created_at: topic.created_at,
					created_by: this.cleanString(topic.created_by)
				};

				// console.log("Saving payload:", payload);

				// ตรวจสอบข้อมูลที่จำเป็น
				if (!payload.name || !payload.best || !payload.medium || !payload.bad) {
					showAlert("ข้อมูลไม่ครบถ้วน กรุณาตรวจสอบอีกครั้ง", "error");
					// console.error("Missing required fields:", payload);
					return;
				}

				const result = await InsertTopic.run(payload);
				results.push(result);
			}

			// ล้างข้อมูลชั่วคราว
			this.newlyAddedTopics = [];
			this.editedTopics = [];

			// รีเฟรชข้อมูล
			await this.fetchAllTopics();

			const currentYear = new Date().getFullYear();
			showAlert(`✅ บันทึกสำเร็จ!\nปี ${currentYear} - Label ${nextLabel}\nจำนวน ${results.length} รายการ\nรวม Weight = 100%`, "success");

		} catch (error) {
			// console.error("Error saving to database:", error);
			showAlert("เกิดข้อผิดพลาดในการบันทึกข้อมูล: " + (error.message || error), "error");
		}
	},

	async showPreSaveInfo() {
		const currentYear = new Date().getFullYear();
		const nextLabel = await this.getNextLabel();
		const detection = this.detectChanges();

		const totalWeight = this.displayTopic.reduce((sum, topic) => {
			const weight = parseFloat(topic.weight) || 0;
			return sum + weight;
		}, 0);

		let message = `ปี ${currentYear} - Label ${nextLabel}\n`;
		message += `รวม Weight: ${totalWeight}%\n`;
		message += `การเปลี่ยนแปลง: ${detection.summary}`;

		if (totalWeight !== 100) {
			message += `\n⚠️ Weight ไม่เท่ากับ 100%`;
		}

		return {
			year: currentYear,
			label: nextLabel,
			totalWeight,
			message,
			isValid: totalWeight === 100
		};
	},

	getChangesSummary(changes, hasNewData) {
		let summary = [];

		if (changes.length > 0) {
			const fieldCounts = {};
			changes.forEach(change => {
				if (!fieldCounts[change.field]) {
					fieldCounts[change.field] = 0;
				}
				fieldCounts[change.field]++;
			});

			Object.keys(fieldCounts).forEach(field => {
				summary.push(`${field}: ${fieldCounts[field]} รายการ`);
			});
		}

		if (hasNewData) {
			summary.push(`เพิ่มใหม่: ${this.newlyAddedTopics.length} รายการ`);
		}

		return summary.length > 0 ? summary.join(', ') : 'ไม่มีการเปลี่ยนแปลง';
	},

	formatDate(date) {
		if (!date) return null;
		if (date instanceof Date) {
			return date.toISOString().split('.')[0].replace('T', ' ');
		}
		if (typeof date === 'string') {
			return date;
		}
		return null;
	},

	clearNewlyAddedTopics() {
		this.newlyAddedTopics = [];
		showAlert("ล้างรายการข้อมูลที่เพิ่งเพิ่มเรียบร้อยแล้ว", "success");
	},

	clearTableSimple() {
		this.displayTopic = [];
		this.newlyAddedTopics = [];
		this.editedTopics = [];
		showAlert("ล้างตารางเรียบร้อยแล้ว", "success");
		return true;
	},

	async saveToDatabase() {
		if (!this.checkTotalWeight()) return;
		this.dbTopic = JSON.parse(JSON.stringify(this.displayTopic));
	},

	openCategoryModal(rowIndex) {
		try {
			storeValue('currentEditRowIndex', rowIndex);
			const currentRow = this.displayTopic[rowIndex];
			if (!currentRow) {
				// console.error("No row data found at index:", rowIndex);
				showAlert("ไม่พบข้อมูลแถวที่เลือก", "error");
				return;
			}
			storeValue('currentEditRowId', currentRow.id);
			showModal('Category');
		} catch (error) {
			// console.error("Error in openCategoryModal:", error);
			showAlert("เกิดข้อผิดพลาดในการเปิด Modal", "error");
		}
	},

	saveCategorySelection() {
		try {
			const rowIndex = appsmith.store.currentEditRowIndex;
			const selectedCategoryId = Select3.selectedOptionValue;
			const selectedCategoryName = Select3.selectedOptionLabel;

			if (rowIndex === undefined) {
				showAlert("ไม่พบข้อมูลแถวที่เลือก", "warning");
				return;
			}

			if (!selectedCategoryId) {
				showAlert("กรุณาเลือก Category", "warning");
				return;
			}

			// อัปเดตข้อมูลโดยตรง
			let updatedRow = {...this.displayTopic[rowIndex]};
			updatedRow.category = selectedCategoryId;
			updatedRow.category_name = selectedCategoryName;

			this.displayTopic[rowIndex] = updatedRow;

			// ตั้งค่าสถานะการเปลี่ยนแปลง
			storeValue('categoryChanged', true);
			storeValue('categoryChangedRowIndex', rowIndex);

			// อัปเดตตาราง
			Table1Copy.setData(this.displayTopic);

			closeModal('Category');
			showAlert("เปลี่ยน Category เรียบร้อย กรุณากดปุ่ม Submit เพื่อบันทึกเป็น version ใหม่", "info");

		} catch (error) {
			console.error("Error in saveCategorySelection:", error);
			showAlert("เกิดข้อผิดพลาดในการบันทึก Category", "error");
		}
	},
	getChangeStatus() {
		const detection = this.detectChanges();

		if (!detection.hasChanges) {
			return "ไม่มีการเปลี่ยนแปลง";
		}

		let status = "มีการเปลี่ยนแปลง: " + detection.summary;

		if (detection.hasChanges) {
			const nextLabel = this.getNextLabel();
			status += ` (จะบันทึกเป็น Label ${nextLabel})`;
		}

		return status;
	},

	// ฟังก์ชันตรวจสอบว่ามีการเปลี่ยนแปลงหรือไม่
	hasUnsavedChanges() {
		const detection = this.detectChanges();
		return detection.hasChanges;
	},

	async onCategoryModalOpen() {
		try {
			resetWidget("Select3");
			await loadCategories.run();

			const rowIndex = appsmith.store.currentEditRowIndex;
			if (rowIndex === undefined) {
				return;
			}

			const currentRow = this.displayTopic[rowIndex];
			if (!currentRow) {
				return;
			}

			if (currentRow.category && loadCategories.data && loadCategories.data.length > 0) {
				let categoryData = null;
				for (let i = 0; i < loadCategories.data.length; i++) {
					if (Number(loadCategories.data[i].id) === Number(currentRow.category)) {
						categoryData = loadCategories.data[i];
						break;
					}
				}

				if (categoryData) {
					setTimeout(() => {
						Select3.setSelectedOption(categoryData);
					}, 100);
				}
			}
		} catch (error) {
			// console.error("Error in onCategoryModalOpen:", error);
		}
	},

	async deleteRow(rowIndex) {
		try {
			if (rowIndex === undefined || rowIndex < 0 || rowIndex >= this.displayTopic.length) {
				showAlert("ไม่พบข้อมูลแถวที่จะลบ", "error");
				return;
			}

			const rowToDelete = this.displayTopic[rowIndex];

			// ถ้าเป็นข้อมูลใหม่ที่ยังไม่ได้บันทึก
			if (!rowToDelete.id) {
				// ลบจาก displayTopic และ newlyAddedTopics
				this.displayTopic = this.displayTopic.filter((item, index) => index !== rowIndex);
				this.newlyAddedTopics = this.newlyAddedTopics.filter(topic => 
																														 topic.name !== rowToDelete.name || topic.created_at !== rowToDelete.created_at
																														);

				if (Table1Copy) {
					Table1Copy.setData(this.displayTopic);
				}

				showAlert(`ลบหัวข้อ "${rowToDelete.name}" สำเร็จแล้ว`, "success");
				return;
			}

			// ถ้าเป็นข้อมูลที่มีอยู่ในฐานข้อมูล
			const topicId = parseInt(rowToDelete.id);
			const topicCreatedAt = rowToDelete.created_at;

			const deleteResult = await DeleteTopic.run({
				id: topicId,
				created_at: topicCreatedAt,
				label: rowToDelete.label
			});

			if (!deleteResult || deleteResult.affectedRows === 0) {
				throw new Error("ไม่สามารถลบข้อมูลได้");
			}

			// ลบจาก displayTopic และ dbTopic
			this.displayTopic = this.displayTopic.filter((item, index) => index !== rowIndex);
			this.dbTopic = this.dbTopic.filter(topic => 
																				 !(parseInt(topic.id) === topicId && topic.created_at === topicCreatedAt)
																				);

			if (Table1Copy) {
				Table1Copy.setData(this.displayTopic);
			}

			showAlert(`ลบหัวข้อ "${rowToDelete.name}" สำเร็จแล้ว`, "success");

		} catch (error) {
			// console.error("Error in deleteRow:", error);
			showAlert("เกิดข้อผิดพลาดในการลบข้อมูล: " + (error.message || error), "error");
		}
	},
	getLatestYearAndLabel() {
		if (!this.allTopic || this.allTopic.length === 0) return { year: "-", label: "-" };

		// 1. หา year ที่มากที่สุด
		const years = this.allTopic.map(t => new Date(t.created_at).getFullYear());
		const maxYear = Math.max(...years);

		// 2. filter เฉพาะหัวข้อปีนั้น
		const inMaxYear = this.allTopic.filter(t => new Date(t.created_at).getFullYear() === maxYear);

		// 3. หา label ที่มากที่สุดในปีนั้น
		const labels = inMaxYear.map(t => parseInt(t.label, 10) || 0);
		const maxLabel = Math.max(...labels);

		return {
			year: maxYear,
			label: maxLabel
		};
	},

	async logout() {
		await clearStore();
		navigateTo('https://msync.mfec.co.th/signout?app=supplier_eva', 'SAME_WINDOW');
	}
}