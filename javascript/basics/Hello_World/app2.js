export default {
 get_hashtag: async () => {
  // get hash tag from url if possible 
  const hash_str = appsmith.URL.hash; 
  const hash_params = {} 
  hash_str.substring(1).split('#').forEach(pair => {
   const [key,val] = pair.split('=');
   hash_params[key] = val;
  });
  if (hash_str) {
   let access_token = hash_params.access_token; 
   await storeValue('access_token', access_token);

   if (!access_token) return; 
   await storeValue('email', null);
   console.log('token')
   try { 
    const { email } = await get_user.run();
    await storeValue('email', email);
    console.log(appsmith.store.email)

    const check = await jsobj.check_pem(email)
    jsobj.get_version()
    this.get_user_info_emp(email)

    if(check == false){
     // if(!(appsmith.store.user_role.owner.join(',').includes('admin'))){
     navigateTo('Access Denied');
     // navigateTo('Token Expired Page');
     console.log('Access Denied')
    }else{
     // navigateTo('Draft Projects');
     navigateTo('Projects')
     console.log('Projects')
    }
   } catch (error) {
    jscom.handle_error(get_user.data);
   }
  }
 },
 check_pem : async(email_) =>{
  let data = {
   email_ : email_ || appsmith.store.email
   // email_ : 'jumrearn@mfec.co.th'
   // email_: 'aim-on@mfec.co.th'
   // email_: 'nichawee@mfec.co.th'
  }
  await storeValue('email', data.email_);
  try{
   // await storeValue('email',email_)
   await check_pem.run(data)
   const check = await check_pem.data
   // console.log(check)    

   if(check?.owner?.some((item)=>item?.includes('thanos')) || check?.owner?.some((item)=>item?.includes('admin'))){
    check?.owner?.push('admin')
   }

   // if(check.have_pem != true){
   // return false;
   // }
   // console.log(check_pem.data)
   await storeValue('user_role',check)
   // await storeValue('owner',check.owner.join(' '))
   // console.log(check)
  }catch(error){
   jscom.handle_error(check_pem.data);
   return false;
  }
 },
 async get_user_info_emp (email_){
  try{
   await user_info.run({ email_ })
   storeValue('user_info',user_info.data[0])

  }catch(error){
   console.log(error)
   jscom.handle_error(user_info.data);
  }
 },
 get_version: async () => {
  try{
   await get_version.run()
   storeValue('app_version',get_version.data[0].version)
  }catch(error){
   jscom.handle_error(get_version.data)
  }
 },
 // mockauth() {
 // // storeValue('email','chawamon@mfec.co.th');
 // storeValue('email','jumrearn@mfec.co.th');
 // },
 get_check_admin: async (email_) => {
  try {
   // await check_pem.run({ email_: email_ || appsmith.store.email });
   // let check = await check_pem.data;
   // await pem.run({ email_ });

   await check_admin.run({ email_ });
   let is_admin = check_admin?.data?.[0]?.is_admin || false;
   storeValue('is_admin', is_admin);

   return is_admin;

  } catch (error) {
   console.log('error func get pem', error || pem.data);
   jscom.handle_error(pem.data || error);
  }
 },
 get_check_can_view_project: async (email_) => {
  try {
   // await check_pem.run({ email_: email_ || appsmith.store.email });
   // let check = await check_pem.data;
   // await pem.run({ email_ });

   await check_role_not_admin.run({ email_ });
   let is_canview = check_role_not_admin?.data?.[0]?.is_canview || false;
   storeValue('is_canview', is_canview);

   return is_canview;

  } catch (error) {
   console.log('error func get pem', error || pem.data);
   jscom.handle_error(pem.data || error);
  }
 },
 proj_code_can_view: async (email_) => {
  try {
   let admin = appsmith.store.is_admin;
   if(!admin){
    await pem_user_can_view.run( {email_} );
    storeValue("getProjectCode",pem_user_can_view.data);
   }else if(admin){
    await get_proj_code_admin.run();
    storeValue("getProjectCode",get_proj_code_admin.data);
   }
   console.log("getProjectCode",appsmith.store.getProjectCode)
   return appsmith.store.getProjectCode;

  }catch (error) {
   jscom.handle_error(pem_user_can_view.data);
   return false;
  }
 },
 async preload(){
  try {
   await this.get_hashtag()
   console.log("get_hash")
   let email_ = appsmith.store.email
   if (!email_) return
   // email_ = 'nantawan@mfec.co.th'
   //email_ ='noppamas@mfec.co.th'
   //email_ ='rassawadee@mfec.co.th'
   // email_ ='jumrearn@mfec.co.th'
   // email_ = 'tinbodee@mfec.co.th'
   //email_ = 'montri@mfec.co.th'
   //email_ = 'chawamon@mfec.co.th'
   // email_ = 'boonyanit@mfec.co.th'
   //email_ = 'naphapan@mfec.co.th'
   //email_ = 'krongkaew@mfec.co.th'

   if(email_ === 'karin.wis@mfec.co.th' || email_ === 'phongphon.sir@mfec.co.th' || email_ === 'chalisa.run@mfec.co.th' || email_ === 'pongsapak.yos@mfec.co.th' || email_ === 'yossanan.mhu@mfec.co.th' || email_ === 'kidsanaphon.ka@mfec.co.th') {
    // email_ = 'chalermchai@mfec.co.th'
    // email_ = 'nutta_w@mfec.co.th'
    email_ ='tinbodee@mfec.co.th'
    console.log("Same: ", email_)
   }
   await storeValue('email',email_);
   console.log("email")
   // email_ = 'chanatcha@mfec.co.th'
   // email_ = 'tinbodee@mfec.co.th'
   //email_ = 'chawamon@mfec.co.th'

   // await this.mockauth()
   await this.get_user_info_emp()
   console.log("user_info")
   await this.get_check_admin()
   console.log("check admin")
   await this.get_check_can_view_project()
   console.log("check proj")
   await this.proj_code_can_view()
  }catch (error) {
   console.log("Have a problem:", error);

   showAlert(
    error?.message 
    || error?.data?.message 
    || JSON.stringify(error),
    "error"
   );
  }
 }
}
 