const Rembrandt = require('rembrandt')
const fs = require('fs').promises
const images = require('images')

function sleep(ms = 0) {
  return new Promise(resolve => {
    const t = setTimeout(() => {
      resolve()
      clearTimeout(t)
    }, ms)
  })
}

function randomNumber(min = 0, max = 0, Int = true)
{
  return Int ? Math.floor(Math.random() * (max - min + 1) + min) :
    Math.random() * (max - min) + min
}

// 将response数据获取data并转换为对象
function parseBody(text) {
  try {
    if (text) {
      const body = JSON.parse(text)
      if (body.code === 0 && body.data) {
        return body.data
      }
    }
  } catch (e) {
    return null
  }
}

// 直播数据汇总
async function getLiveRoomData(response) {
  const url = response.url()
  if (url.includes('room_data_overview_total')) {
    return parseBody(await response.text())
  }
}

// 正在直播
async function getLivingData(response) {
  const url = response.url()
  if (url.includes('operate/live/ies_list')) {
    return parseBody(await response.text())
  }
}

// tab坐标
const y1 = 30
const y2 = 120

// 直播tab点击
async function liveClick(p) {
  await p.mouse.click(316, y1)
  await sleep(1000)
  // 直播数据汇总
  await p.mouse.click(390, y2)
  await sleep(1000)
  // 正在直播
  await p.mouse.click(285, y2)
  await sleep(1000)
}

// 分析tab点击
async function analysisClick(p) {
  await p.mouse.click(372, y1)
  await sleep(2000)
  // 直播分析分析
  await p.mouse.click(85, 390)
  await sleep(2000)
}

// 处理滑动验证
async function calculateDistance(page, emit) {
  try {
    let originalImage = ''
    // 拦截请求
    await page.setRequestInterception(true)
    page.on('request', request => request.continue())
    page.on('response', async response => {
      if (response.headers()['content-type'] === 'image/jpeg') {
        originalImage = await response.buffer().catch(() => {
        })
      }
      if (originalImage) {
        images(originalImage).size(340, 212).save("./img/origin.png");
        originalImage = await fs.readFile('./img/origin.png')
      }

    })
     // 触发造成图片加载的事件
    emit && await emit()
    await sleep(2000)
    if (!originalImage) {
      console.log('没发现验证码')
      return
    }

    async function comparing() {
      await sleep(500)
      await page.waitForSelector('.captcha_verify_container')
      // 滑条
      const sliderElement = await page.$('.captcha_verify_slide--slidebar') 
      const slider = await sliderElement.boundingBox()
      // 滑块
      const sliderHandle = await page.$('.secsdk-captcha-drag-icon')
      const handle = await sliderHandle.boundingBox()

      let currentPosition = 0
      let bestSlider = {
        position: 0,
        difference: 100
      }
      let worstSlider = {
        posistion: 0,
        difference: 0
      }

      await page.mouse.move(handle.x + handle.width / 2, handle.y + handle.height / 2 + Math.random() * 10 - 5)
      await page.mouse.down()

      // 移动滑条并进行比较
      const results = [];
      while (currentPosition < slider.width - handle.width / 2) {

        await page.mouse.move(
          handle.x + currentPosition,
          handle.y + handle.height / 2 + randomNumber(4, 10) - 5
        )
        // 截图验证图片
        let sliderContainer = await page.$('.captcha_verify_img--wrapper')
        let sliderImage = await sliderContainer.screenshot()
        await fs.writeFile('./img/moment.png', sliderImage)

        const rembrandt = new Rembrandt({
          imageA: originalImage,
          imageB: sliderImage,
        })

        let result = await rembrandt.compare()
        
        let difference = result.percentageDifference * 100
        results.push({position: currentPosition, difference: difference})        
        currentPosition += 5
      }
      const min = Math.min(...results.map(x => x.difference));
      const fitPosition = results.find(x => x.difference === min).position;

      await page.mouse.move(handle.x + fitPosition, handle.y + handle.height / 2, {steps: 10})
      await page.mouse.up()
      await sleep(1000)
    }

    await comparing()
    await sleep(1000)

    const con = await page.$('.captcha_verify_container')

    if (con) { // 还有容器表示验证失败
      console.log('验证失败! 请手动验证并继续')
      // 暂停1分钟进行手动验证和接收登录验证码
      await sleep(60000)
    }
  } catch (e) {
    console.log('比较失败')
    throw e
  }
}


module.exports = {
  liveClick,
  analysisClick,
  getLivingData,
  getLiveRoomData,
  sleep,
  calculateDistance
};
