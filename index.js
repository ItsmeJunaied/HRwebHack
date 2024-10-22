const puppeteer = require("puppeteer"); // Use CommonJS syntax

// User credentials
const users = [
  { username: "Junaied007@#", password: "Junaied007@#flyte" },
  { username: "Shofiq", password: "12345" },
  { username: "Shofiq2", password: "12345sdfsdf" },
];

// Static attendance data
const staticAttendanceData = {
  attendanceDate: "22/10/2024", // Static Date
  inTime: "22/10/2024 12:07:35", // Static In Time
  remark: "IN", // Remark text
};

// Sleep function using promises
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Function to login, submit attendance, and logout for each user
async function performAttendance(browser, user) {
  const page = await browser.newPage();

  try {
    // Navigate to login page
    await page.goto(
      "https://login.infiniumsuite.com/Account/Login?ReturnUrl=%2Fconnect%2Fauthorize%2Fcallback%3Fclient_id%3Dflso%26redirect_uri%3Dhttps%253A%252F%252Fflso.infiniumsuite.com%252Fauthentication%252Flogin-callback%26response_type%3Did_token%2520token%26scope%3Dopenid%2520profile%2520offline_access%2520eos_api%2520admin_api%2520ams_api%26state%3D52536ac8c85f45bf8a9e78cbd02c3c0f%26nonce%3Dfa8ac2f9713649a49bc3d2aa670993f6"
    );

    // Fill in the login form
    await page.type("#Username", user.username);
    await page.type("#Password", user.password);
    await Promise.all([
      page.click('button[name="button"][value="login"]'),
      page.waitForNavigation({ waitUntil: "networkidle0" }),
    ]);

    // Navigate to the attendance page
    await page.goto(
      "https://flso.infiniumsuite.com/eos/hrm/myattendances/attendance",
      { waitUntil: "networkidle0" }
    );

    await page.setExtraHTTPHeaders({
        'accept': 'application/json',
        'accept-encoding': 'gzip, deflate, br, zstd',
        'accept-language': 'en-US,en;q=0.9,bn;q=0.8',
        'authorization': 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImEzTXpvSTBObW8zX0Vaa21xVDg0T3ciLCJ0eXAiOiJhdCtqd3QifQ.eyJuYmYiOjE3Mjk1NzUxOTgsImV4cCI6MTcyOTY2MTU5OCwiaXNzIjoiaHR0cHM6Ly9sb2dpbi5pbmZpbml1bXN1aXRlLmNvbSIsImF1ZCI6ImVvc19kZXYiLCJjbGllbnRfaWQiOiJmbHNvIiwic3ViIjoiYmJhYjAzNjQtOGExMC00NjU0LTlmODktNmE1NTM1NzRlN2QxIiwiYXV0aF90aW1lIjoxNzI5NTczOTc5LCJpZHAiOiJsb2NhbCIsInJvbGUiOiJBZG1pbiIsIm5hbWUiOiJKdW5haWVkMDA3QCMiLCJzY29wZSI6WyJvcGVuaWQiLCJwcm9maWxlIiwiZW9zX2FwaSIsImFkbWluX2FwaSIsImFtc19hcGkiLCJvZmZsaW5lX2FjY2VzcyJdLCJhbXIiOlsicHdkIl19.bOwcY7jF2U8_AU9iG0SfODr5B0lyijN1Atr4cRAfOaMveuM0gVg50dowdkLrsJFvDzCoz8JaJyP1_t1nOKKmQd4lNNGuvo83zj7rHyK7lZtxJanA0PyrhY6twfE2hRwSW5GRIdqohk4QmqYmEwrmzmQoNykZ7fsQXynQxmnCmeZiWFTuoS2Dkm3CyQDMgL347gfaMniY90lIZPI_yEWLm6M1-wRT_8bCp8jkShbFPZAEK-5LlOhw6AsvyngqrWrR14Ne1S8WQI0USM5iw8i9tWYxbLetZzCNFFkX5cYwwYj3TPObzSEZ4DYbduvYpl-y5cUn5519PwXbv0fyfk_p9g',
        'content-length': '517', // Note: This might not be necessary; Puppeteer sets this automatically
        'content-type': 'application/json',
        'origin': 'https://flso.infiniumsuite.com',
        'referer': 'https://flso.infiniumsuite.com/',
        'sec-ch-ua': '"Google Chrome";v="129", "Not=A?Brand";v="8", "Chromium";v="129"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-site',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
      });
    const attendanceData = {
      id: "00000000-0000-0000-0000-000000000000",
      employeeId: "8b921d63-32ab-4a0c-8263-49fc59c1e4aa",
      employeeName: null,
      employeeCode: null,
      inTime: "2024-10-22T04:05:24.291Z",
      lateBy: null,
      earlyOutBy: null,
      attendanceDate: "2024-10-22T07:41:37.620Z",
      earlyIn: null,
      workingHour: null,
      overtime: null,
      machineIdin: null,
      machineIdout: null,
      remarks: "fdfdfdf",
      attendanceStatusId: "a440313b-758f-ef11-8142-005056b2a5cd",
      originalAttendanceStatusId: null,
      isHalfdayLeave: null,
      orginalInTime: null,
      orginalOutTime: null,
    };
//   form.action = "https://gw.infiniumsuite.com/hrm/api/Attendance/Upsert";
    // Create a form element
    // Make a POST request with the headers and data
  const response = await page.evaluate(async (data) => {
    const res = await fetch('https://gw.infiniumsuite.com/hrm/api/Attendance/Upsert', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'authorization': 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImEzTXpvSTBObW8zX0Vaa21xVDg0T3ciLCJ0eXAiOiJhdCtqd3QifQ.eyJuYmYiOjE3Mjk1NzUxOTgsImV4cCI6MTcyOTY2MTU5OCwiaXNzIjoiaHR0cHM6Ly9sb2dpbi5pbmZpbml1bXN1aXRlLmNvbSIsImF1ZCI6ImVvc19kZXYiLCJjbGllbnRfaWQiOiJmbHNvIiwic3ViIjoiYmJhYjAzNjQtOGExMC00NjU0LTlmODktNmE1NTM1NzRlN2QxIiwiYXV0aF90aW1lIjoxNzI5NTczOTc5LCJpZHAiOiJsb2NhbCIsInJvbGUiOiJBZG1pbiIsIm5hbWUiOiJKdW5haWVkMDA3QCMiLCJzY29wZSI6WyJvcGVuaWQiLCJwcm9maWxlIiwiZW9zX2FwaSIsImFkbWluX2FwaSIsImFtc19hcGkiLCJvZmZsaW5lX2FjY2VzcyJdLCJhbXIiOlsicHdkIl19.bOwcY7jF2U8_AU9iG0SfODr5B0lyijN1Atr4cRAfOaMveuM0gVg50dowdkLrsJFvDzCoz8JaJyP1_t1nOKKmQd4lNNGuvo83zj7rHyK7lZtxJanA0PyrhY6twfE2hRwSW5GRIdqohk4QmqYmEwrmzmQoNykZ7fsQXynQxmnCmeZiWFTuoS2Dkm3CyQDMgL347gfaMniY90lIZPI_yEWLm6M1-wRT_8bCp8jkShbFPZAEK-5LlOhw6AsvyngqrWrR14Ne1S8WQI0USM5iw8i9tWYxbLetZzCNFFkX5cYwwYj3TPObzSEZ4DYbduvYpl-y5cUn5519PwXbv0fyfk_p9g',
      },
      body: JSON.stringify(data),
    });
    return await res.json(); // Return the response as JSON
  }, attendanceData);
      console.log('Response:', response);

    // Wait for navigation after form submission
    await page.waitForNavigation();

    console.log("Form submitted!");
    // Close the browser
  } catch (error) {
    console.error(`Error processing ${user.username}:`, error);
  } finally {
    await page.close();
  }
}

// Main function to run the process for all users
(async () => {
  const browser = await puppeteer.launch({ headless: false, slowMo: 50 });
  await performAttendance(browser, { username: "Junaied007@#", password: "Junaied007@#flyte" });
//   await browser.close();
})();
