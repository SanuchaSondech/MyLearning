export default {
	async LoginButton1onClick() {
		const hash_str = appsmith.URL.hash; 
  	const hash_params = {};
		
		// ลบ '#' ตัวแรกออก แล้วแยกด้วยเครื่องหมาย '#'
		let pairs = hash_str.substring(1).split('#');
		
		for (let i = 0; i < pairs.length; i++) {
			let parts = pairs[i].split('=');
			let key = parts[0];
			let val = parts[1];
			hash_params[key] = val;
		}
		
		if(hash_str){
			let access_token = hash_params.access_token;
			await storeValue('access_token', access_token);
			
			// ถ้า access_token ว่าง
			if (!access_token) {
				return;
			}
			// เคลียร์ข้อมูลเก่า
			await storeValue('email', null);
			
			try{
				const { email } = await get_user.run();
    		await storeValue('email', email);
				
				const { user_metadata } = await get_user.run();
				await storeValue('user_metadata', user_metadata);
				
				navigateTo("Page2")
				
			}catch(error){
				showAlert("เกิดข้อผิดพลาด: ", "error");
			}
		}
	}
}