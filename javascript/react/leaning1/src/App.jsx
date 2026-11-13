import { useState } from "react";

function App() {

  const nickname = "Soda";
  const [age, setAge] = useState(20);

  return (
    <>
      <h1>Sanucha</h1>
      <h2>nickname : {nickname}</h2>
      <h2>age : {age}</h2>
      <button onClick={()=>setAge(age+1)}>เพิ่ม</button>
      <button onClick={()=>setAge(age-1)}>ลด</button>
      <button onClick={()=>setAge(20)}>เคลียร์</button>
      
      <hr/>

    </>
  );
}

export default App;
