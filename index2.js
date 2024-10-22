const puppeteer = require('puppeteer'); // Use CommonJS syntax

// User credentials
const users = [
  { username: "Junaied007@#", password: "Junaied007@#flyte" },
  { username: "Shofiq", password: "12345" },
  { username: "Shofiq2", password: "12345sdfsdf" }
];

// Static attendance data
const staticAttendanceData = {
  attendanceDate: "22/10/2024", // Static Date
  inTime: "22/10/2024 12:07:35", // Static In Time
  remark: "IN" // Remark text
};

// Sleep function using promises
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Function to login, submit attendance, and logout for each user
async function performAttendance(browser, user) {
    const page = await browser.newPage();

    try {
        // Navigate to login page
        await page.goto('https://login.infiniumsuite.com/Account/Login?ReturnUrl=%2Fconnect%2Fauthorize%2Fcallback%3Fclient_id%3Dflso%26redirect_uri%3Dhttps%253A%252F%252Fflso.infiniumsuite.com%252Fauthentication%252Flogin-callback%26response_type%3Did_token%2520token%26scope%3Dopenid%2520profile%2520offline_access%2520eos_api%2520admin_api%2520ams_api%26state%3D52536ac8c85f45bf8a9e78cbd02c3c0f%26nonce%3Dfa8ac2f9713649a49bc3d2aa670993f6');

        // Fill in the login form
        await page.type('#Username', user.username);
        await page.type('#Password', user.password);
        await Promise.all([
            page.click('button[name="button"][value="login"]'),
            page.waitForNavigation({ waitUntil: 'networkidle0' })
        ]);

        // Navigate to the attendance page
        await page.goto('https://flso.infiniumsuite.com/eos/hrm/myattendances/attendance', { waitUntil: 'networkidle0' });

        // Set Attendance Date
        await page.waitForSelector('eos-input-date-picker:nth-of-type(1) .ant-picker-input input[placeholder="Select date"]', { visible: true });
        const attendanceDateInput = await page.$('eos-input-date-picker:nth-of-type(1) .ant-picker-input input[placeholder="Select date"]');
        await attendanceDateInput.click({ clickCount: 3 });
        await attendanceDateInput.type(staticAttendanceData.attendanceDate);
        await page.click('body'); // Click outside to close the date picker
        await sleep(500);

        // Set Remark
        const remarkInput = await page.waitForSelector('textarea[placeholder="Remarks"]', { visible: true });
        await remarkInput.type(staticAttendanceData.remark);

        // Set In Time
        try {
            await page.waitForSelector('eos-input-date-picker .ant-picker-input input[size="21"]]', { visible: true, timeout: 10000 });
            const inTimeInput = await page.$('eos-input-date-picker .ant-picker-input input[size="21"]]');
            await inTimeInput.click({ clickCount: 3 });
            await inTimeInput.type(staticAttendanceData.inTime);
            await page.click('body'); // Click outside to close the date picker
            await sleep(500);
        } catch (error) {
            console.error(`In Time input not found for ${user.username}:`, error);
            return; // Exit the function for this user
        }

        // Submit the form
        console.log("Submitting the form...");
        await Promise.all([
            page.click('button:contains("Save")'),
            page.waitForNavigation({ waitUntil: 'networkidle0' })
        ]);

        console.log(`Attendance submitted for ${user.username}`);

        // Logout process
        const currentUrl = await page.url();
        if (currentUrl.includes('/attendance')) {
            await page.waitForSelector('a[href="/authentication/logout"]', { visible: true });
            await page.click('a[href="/authentication/logout"]');
            await page.waitForNavigation({ waitUntil: 'networkidle0' });
            console.log(`Logged out ${user.username}`);
        } else {
            console.log(`User ${user.username} is not on the attendance page after submission.`);
        }
    } catch (error) {
        console.error(`Error processing ${user.username}:`, error);
    } finally {
        await page.close();
    }
}

  

// Main function to run the process for all users
(async () => {
  const browser = await puppeteer.launch({ headless: false, slowMo: 50 });
  for (const user of users) {
    await performAttendance(browser, user);
  }
  await browser.close();
})();
