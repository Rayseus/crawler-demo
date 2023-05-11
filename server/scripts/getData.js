const puppeteer = require('puppeteer');
const fs = require('fs').promises

const dotenv = require("dotenv")
dotenv.config()

const {
  calculateDistance,
  sleep,
  liveClick,
  analysisClick,
  getLivingData,
  getLiveRoomData
} = require('./login');

const main = async function () {
  // 数据集合
  const dataMap = {
    'getLiveRoomData': undefined,
    'getLivingData': undefined
  }
  try {
    const page = await openBrowser()
    await login(page)
    await sleep(3000)

    // 监听需要的响应
    await listen(page)
    await sleep(1000)

    // 触发点击tab
    await emit(page)
    await sleep(3000)


    async function openBrowser() {
      console.log('启动 Chrome')
      const options = {
        // 由于需要验证, headless为false
        headless: false,
        args: ["--window-position=0,0", `--window-size=1280,800`],
        defaultViewport: {width: 1280, height: 800},
        ignoreDefaultArgs: ["--enable-automation"]
      }
      if (process.env.CHROME_PATH) {
        options.executablePath = process.env.CHROME_PATH
      }
      const browser = await puppeteer.launch(options);
      const [p] = await browser.pages()
      return p
    }

    async function login(p) {
      if (process.env.EMAIL && process.env.PASSWORD) { // 输入账号密码
        const urls = 'https://business.oceanengine.com/login?appKey=51'
        const url = urls
        await p.setBypassCSP(true)
        await p.goto(url);

        await p.waitForSelector('.login-bg')

        await sleep(1000);

        // 使用坐标
        const x = 950
        // 邮箱地址
        await p.mouse.click(x, 345)
        await p.keyboard.type(process.env.EMAIL, {delay: 80})
        // 密码
        await p.mouse.click(x, 393)
        await p.keyboard.type(process.env.PASSWORD, {delay: 80})
        // 协议
        await p.click('.check-box-container', {delay: 200})

        const submit = async () => {
          await p.click('.account-center-submit', {delay: 200})
        }

        // 处理验证码
        await calculateDistance(p, submit)

      } else {
        throw new Error('账号密码错误')
      }
    }

    async function listen(p) {
      // 开启响应监听
      await p.on('response', async res => {
        const fnMap = {
          getLiveRoomData, // 直播数据汇总
          getLivingData, // 正在直播
        };
        Object.keys(dataMap).forEach(name => {
          fnMap[name](res).then(data => {
            if (data) dataMap[name] = data
          })
        })
      })
    }

    async function emit(p) {
      await liveClick(p)
      await analysisClick(p)
    }

    return dataMap

  } catch (e) {
    console.warn(e);
    return dataMap
  }
};

main().then(async data => {
  console.log('正在写入数据');
  await fs.writeFile('./data.json', JSON.stringify(data))
  process.exit();
})
