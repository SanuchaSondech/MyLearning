const fs = require('fs');

fs.readFile('head.txt', 'utf8', function (err, head) {
  if (err) throw err;

  fs.readFile('body.txt', 'utf8', function (err, body) {
    if (err) throw err;

    fs.readFile('leg.txt', 'utf8', function (err, leg) {
      if (err) throw err;

      fs.readFile('feet.txt', 'utf8', function (err, feet) {
        if (err) throw err;

        const result =
          head + '\n' +
          body + '\n' +
          leg + '\n' +
          feet;

        fs.writeFile('robot.txt', result, function (err) {
          if (err) throw err;
          console.log('สร้างไฟล์ robot.txt เรียบร้อย');
        });
      });
    });
  });
});
