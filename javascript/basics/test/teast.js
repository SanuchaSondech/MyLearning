export default {
	gates: () => {
		const role = appsmith.store.role;

		let auditeeCard = `
      <a class="card" onClick="window.parent.postMessage(
        {some_key: 'auditee'},
        '*');">
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="card-content">
          <h2>Auditee</h2>
        </div>
      </a>`;

		let auditorCard = `
      <a class="card" onClick=" (
        {some_key: 'auditor'},
        '*');">
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="card-content">
          <h2>Auditor</h2>
        </div>
      </a>`;

		let adminCard = `
      <a class="card" onClick="window.parent.postMessage(
        {some_key: 'admin'},
        '*');">
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="card-content">
          <h2>Admin</h2>
        </div>
      </a>`;

		let cardsHTML = '';
		if (role === 'admin') {
			cardsHTML = auditeeCard + auditorCard + adminCard;
		} else if (role === 'auditee') {
			cardsHTML = auditeeCard;
		} else if (role === 'auditor') {
			cardsHTML = auditorCard;
		}

		let html = `<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">
  <style>
    :root {
      --primary: #00ACDC;
      --secondary: #026BCA;
      --accent: #6966B0;
      --background: #373D56;
      --transparent-primary: #01ACDC3D;
      --transparent-secondary: #395CFF2E;
      --white: #FFFFFF;
      --transparent-accent: #5A55DF99;
    }

    * {
      font-family: "Inter", sans-serif;
      box-sizing: border-box;
    }

    body {
      background: url('https://anakdagwwdtgrjzigdun.supabase.co/storage/v1/object/public/profile/temp/welcome_bg.gif') no-repeat center center fixed;
      background-size: cover;
      min-height: 100vh;
      margin: 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 30px;
    }

    .logo {
      margin-top: 40px;
    }

    .logo img {
      width: 150px;
      height: 150px;
      border-radius: 12px;
    }

    .noc-box {
      background: rgba(0, 0, 0, 0.4);
      padding: 16px 24px;
      border-radius: 12px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      max-width: 360px;
      color: #fff;
      font-size: 14px;
      line-height: 1.6;
      text-align: center;
    }

    .noc-box i {
      font-size: 20px;
      margin-bottom: 8px;
      color: #FFD700;
      display: block;
    }

    .noc-box a {
      color: #00ACDC;
      text-decoration: underline;
      font-weight: 500;
    }

    .card-container {
      gap: 26px;
      flex-wrap: wrap;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: row;
    }

    .card {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 200px;
      height: 200px;
      text-align: center;
      text-decoration: none;
      color: var(--white);
      border-radius: 16px;
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
      overflow: hidden;
      transition: transform 0.3s, box-shadow 0.3s;
      background: linear-gradient(135deg, rgb(2, 3, 129) 0%, rgb(40, 116, 252) 100%);
    }

    .card .wave {
      width: 250px;
      height: 200px;
      top: -50px;
      left: -40px;
      opacity: 0.7;
      border-radius: 50%;
      transition: transform 0.8s ease;
      pointer-events: none;
      z-index: 0;
      transform: scale(1);
      background: var(--transparent-primary);
    }

    .card:hover {
      transform: translateY(-10px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
      background: linear-gradient(135deg, var(--secondary) 0%, var(--primary) 100%);
    }

    .card:hover .wave {
      animation: waveAnimation 8s infinite linear;
      background: var(--transparent-secondary);
    }

    .wave {
      position: absolute;
      width: 300px;
      height: 300px;
      bottom: -70px;
      left: -70px;
      opacity: 0.7;
      background: #5A55DF99;
      border-radius: 50%;
      transition: transform 0.1s ease;
      pointer-events: none;
      z-index: 0;
      transform: scale(0);
    }

    .card:hover .wave:nth-child(2) {
      animation: waveAnimation 12s infinite linear;
      background: var(--transparent-primary);
    }

    @keyframes waveAnimation {
      0% {
        transform: translateX(-50%) translateY(-50%) scale(0.5);
      }
      50% {
        transform: translateX(50%) translateY(50%) scale(1.2);
      }
      100% {
        transform: translateX(-50%) translateY(-50%) scale(0.5);
      }
    }
		.back {
    position: absolute;
		top: 40px;
		left: 30px;
		border-radius: 10px;
		// display: inline-flex;
		padding: 10px 20px;
    font-size: 16px;
    color: #ffffff;
    font-family: "Inter", serif;
    opacity: 1;
		font-weight: 600;
		cursor: pointer;
   	transition: background-color 0.3s, color 0.3s;
}
.back a {


    font-size: 16px;
    color: #ffffff;
    font-family: "Inter", serif;
    opacity: 1;
		font-weight: 600;
		text-decoration: none;
		cursor: pointer;
   	transition: background-color 0.3s, color 0.3s;
}
.back:hover {
    // background-color: var(--secondary);
    // transform: translateY(-2px);
		background-color: #fff;
		color: #009AEA;
}
.back:hover a {

		color: #009AEA;
}

.back i {
    transition: transform 0.3s;
}

.back:hover i {
      transform: translateX(-5px);
}
		.top-right-button {
     position: fixed; 
     top: 20px; 
     right: 20px; 
     padding: 10px 20px; 
     background-color: #1cb5e0; 
     color: white; 
     border: none; 
     border-radius: 5px; 
     font-size: 16px; 
     cursor: pointer; 
     transition: background-color 0.3s; 
     }

     .top-right-button:hover {
        background-color: #0056b3; /* Darker blue on hover */
       }

  </style>
</head>
<body>


  <div class="wrapper">
    <div class="logo">
      <img src="https://vcnewprod.mfec.co.th/storage/v1/object/public/assets/ia_evaluate/IA_evaluate.png" alt="IA Evaluate Logo">
    </div>

    <div class="noc-box">
      <i class="fas fa-exclamation-circle"></i>
      <p>หากพบปัญหาการใช้งาน<br>
        กรุณาติดต่อ: <a href="mailto:MFEC_NOC@MFEC.CO.TH">MFEC_NOC@MFEC.CO.TH</a></p>
    </div>

    <div class="card-container">
      ${cardsHTML}
    </div>
		
		<div class="back">
		<a href="https://msync.mfec.co.th/"
   	target="_top" style="text-decoration: none;">
 	 	<i class="fas fa-arrow-left"></i> Back to Msync
		</a>
  </div>
	
	
</body>
</html>`;

		return html;
	}
};
