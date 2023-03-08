const { google } = require("googleapis");

// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
module.exports.handler = async (event, context) => {
  try {

    // берем POST (HTTP) запрос типа event (promise), превращаем его в JS Object, кладем в переменную
    const body = await JSON.parse(event.body);
    // с помощью функции get_order_kids() достаем строчку с названиями курсов и именами учеников из JS Object
    order_kids = get_order_kids(body.meta_data);


    arr = [];
    const auth = new google.auth.GoogleAuth({
      keyFile: "credentials.json",
      scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: "v4", auth: client });
    const spreadsheetId = "1_0nFWk_dAEjt6kjpo-f8VioLyY0hoJR3W1MMOC74ZoU";
 

    message = courseParser(order_kids);
console.log("gets throu parser");

  fullName = body.billing.first_name.concat(
    " ",
    body.billing.last_name
  );
  phone = body.billing.phone;

  email = body.billing.email;

  date = body.date_created.replace("T", "  ");


console.log("gets to for loop");

  for (i in arr) {
    arr[i].push(fullName, phone, email, date);
  }

console.log("gets to pakege");
  if (order_kids.includes("Пакет")) {
    range = "Пакеты!A:F";
  } else {
    range = "Курсы!A:F";
  }

console.log("gets to sheets");
    await googleSheets.spreadsheets.values.append({
      auth,
      spreadsheetId,
      range: range,
      valueInputOption: "RAW",
      resource: {
        values: arr,
      },
    });

console.log("gets through sheets");

    console.log("Submitted!");
    return {
      statusCode: 204,
    };
  } catch (err) {
    return { statusCode: 500, body: err.toString() };
  }
};

async function courseParser(message) {
  message = message.split("Курс:");
  for (i in message) {
    if (message[i].length !== 0) {
      
      x = message[i].split("Ученики:");
      const doubles = x.map((num) => num.trim());
      arr.push(doubles);
    }
  }
}

// смотрим по очереди все обьекты в массиве body.meta_data, и если там есть обьект с полем order_kids, отправляем его значение value
function get_order_kids(data) {
for (i of data){
  console.log(i);
    if (i.key=="order_kids"){
      return i.value;
      }
    }
}
