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
	}