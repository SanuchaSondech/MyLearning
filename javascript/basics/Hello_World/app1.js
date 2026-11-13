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