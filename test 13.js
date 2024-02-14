const {Builder, By, Key, until} = require('selenium-webdriver')
const fs = require('fs')
const chrome = require('selenium-webdriver/chrome')


const options = new chrome.Options()
const resX = 1366
const resY = 768

options.addArguments(["--no-sandbox",
                      "--disable-gpu",
                      "user-agent=AUTOTEST"])



const driver = new Builder()
    .setChromeOptions(options)
    .forBrowser('chrome')
    .build()

const actions = driver.actions({async: true})

const SITE_URL = "https://luding-group.ru/"
const USER_PHONE = '1111111111';
const CONFIRM_CODE = '1111';
// const SUCCESS_URL = '/personal/cart/success/';

let events = [];

// Entry point
(async function () {
  try {
    // Настройки браузера
    await additionalConfiguration(resX, resY, 20000, 20000, 20000)
    // Открытие сайта
    await openUrl(SITE_URL)
    // Ожидание исчезновения прелоадера
    await disappearPreloader()
    // Подтверждение возраста
    await confirmAge()


    // // Добавление первого товара на главной в корзину
    // await addItemFromMain(1)
    // // Открытие второго товара в хитах
    // await goToItemFromMain(2)
    // // Добавление товара из детальной карточки
    // await addItemFromDetail()
    // // Переход в категорию вино
    // await goToLinkWithName("Вино")
    // // Добавление товара из каталога
    // await addItemFromCatalog(1)
    // // Переход к корзине
    // await goToCart()
    // // Оформление заказа
    // await makeOrder()
    // // Успешное завершение теста

    
    logEvent("Luding-group", "Все тесты завершены успешно")
    successProcess(events, driver)
  } catch (error) {
    // errorProcess(error, events, driver)
  } finally {
    await driver.quit()
  }
})()

async function additionalConfiguration(screenWidth = 1920, screenHeight = 1080, script = 30000, implicit = 30000, pageLoad = 100000) {
  logEvent("Браузер", "Настройка браузера на разрешение " + screenWidth + "x" + resY)
  await driver.manage().setTimeouts({script: script, implicit: implicit, pageLoad: pageLoad})
  logEvent("Браузер", "Настройка временных лимитов")
  await driver.manage().window().setRect({width: screenWidth, height: screenHeight})
  logEvent("Браузер", "Настройки завершены")
}

async function openUrl(url) {
  logEvent("Браузер", "Открытие адреса: " + url)
  await driver.get(url)
  logEvent("Главная страница", "Открытие завершено")
}

async function disappearPreloader() {
  logEvent("Главная страница", "Появление прелоадера")
  await driver.wait(until.elementIsNotVisible(driver.findElement(By.css('div#preloader.preloader'))), 100000, 'Ожидание загрузки прелоадера', 1000);
  logEvent("Главная страница", "Исчезновение прелоадера")
}

async function confirmAge() {
  logEvent("Главная страница", "Подтверждение возраста")
  await driver.wait(until.elementIsVisible(driver.findElement(By.css('#modal_restrictions > div.popup-restrictions__cont > div.popup-restrictions__link > a'))), 100000, 'Ожидание попапа 18+', 30000);
  await driver.findElement(By.css('#modal_restrictions > div.popup-restrictions__cont > div.popup-restrictions__link > a')).click();
  logEvent("Главная страница", "Возраст подтвержден")
}


// async function addItemFromHits(nth = 1) {
//   logEvent("Главная страница", "Находим товар в хитах")
//   await driver.sleep(1000)
//   await driver.wait(until.elementLocated(By.css('main.main-content.loaded')), 30000, 'Ожидаем подгрузку страницы', 1000)
//   let bestSaleItem = await driver.findElement(By.css(".bestsellers .card-component-wrapper:nth-child("+nth+") .card-component"))
//   await driver.executeScript('arguments[0].scrollIntoView(true)', bestSaleItem)
//   const bestSaleItemName = await bestSaleItem.findElement(By.css('.card-component__name')).getText()
//   logEvent("Главная страница", "Выбран товар - " + bestSaleItemName + ". Добавляем его в корзину")
//   const btnBuy = await bestSaleItem.findElement(By.css('.btn-buy'))
//   // await actions.move({origin:btnBuy}).perform()
//   await btnBuy.click()
//   await driver.wait(until.elementLocated(By.css('.notification.notification-basket.notification--visible')), 30000, 'Ожидание попапа о добавленном товаре', 1000)
//   logEvent("Главная страница", "Товар - " + bestSaleItemName + " добавлен в корзину")
// }

// async function goToItemFromHits(nth = 1) {
//   logEvent("Главная страница", "Переходим в товар из хитов")
//   const secondBestSaleItem = await driver.findElement(By.css(".bestsellers .card-component-wrapper:nth-child(" + nth + ") .card-component"))
//   const secondBestSaleItemName = await secondBestSaleItem.findElement(By.css('.card-component__name')).getText()
//   logEvent("Главная страница", "Выбран товар - " + secondBestSaleItemName + ". Переходим на его страницу")
//   await secondBestSaleItem.click()
//   logEvent("Детальная товара", "Переход завершен")
// }

// async function addItemFromDetail() {
//   logEvent("Детальная товара", "Добавляем товар в корзину")
//   await driver.wait(until.elementLocated(By.css('main.main-content.loaded')), 30000, 'Ожидаем подгрузку страницы', 1000)
//   await driver.findElement(By.css('.detail-tools .btn-buy')).click()
//   await driver.wait(until.elementLocated(By.css('.notification.notification-basket.notification--visible')), 30000, 'Ожидание попапа о добавленном товаре', 1000)
//   logEvent("Детальная товара", "Товар добавлен в корзину")
// }

// async function goToLinkWithName(name = "Вино") {
//   logEvent("Детальная товара", "Переходим в раздел вино")
//   let menuCatalogLink = await driver.findElement(By.linkText(name))
//   logEvent("Детальная товара", "Жмем на ссылку в меню")
//   await menuCatalogLink.click()
//   logEvent("Каталог", "Переход завершен")
// }

// async function addItemFromCatalog(nth = 1) {
//   logEvent("Каталог", "Добавляем первый товар из каталога в корзину")
//   await driver.wait(until.elementLocated(By.css('main.main-content.loaded')), 30000, 'Ожидаем подгрузку страницы', 1000)
//   let catalogItem = await driver.findElement(By.css(".catalog-content__cards .card-component-wrapper:nth-child(" + nth + ") .card-component"))
//   await driver.executeScript('arguments[0].scrollIntoView(true)', catalogItem)
//   const catalogItemName = await catalogItem.findElement(By.css('.card-component__name')).getText()
//   logEvent("Каталог", "Выбран товар - " + catalogItemName + ". Добавляем его в корзину")
//   await actions.move({origin: catalogItem}).perform()
//   await catalogItem.findElement(By.css(".btn-buy")).click()
//   await driver.wait(until.elementIsVisible(driver.findElement(By.css(".notification.notification-basket"))), 30000, 'Ожидание попапа о добавленном товаре')
//   logEvent("Каталог", "Товар добавлен в корзину")
// }

// async function goToCart() {
//   logEvent("Каталог", "Переходим в корзину")
//   await driver.wait(until.elementIsNotVisible(driver.findElement(By.css(".notification.notification-basket"))), 30000, 'Ожидание скрытия попапа о добавленном товаре')
//   await driver.findElement(By.css('.cart-button')).click()
//   await driver.wait(until.elementLocated(By.css('.header-expander--expanded')), 30000, 'Ожидание малой корзины', 1000)
//   await driver.findElement(By.css('.header-expander--expanded a[onclick="window.location.href=\'/personal/cart/\'"]')).click()
//   logEvent("Корзина", "Переход завершен")
// }

// async function makeOrder() {
//   logEvent("Корзина", "Начало оформления заказа")
//   await driver.wait(until.elementLocated(By.css('main.main-content.loaded')), 30000, 'Ожидаем подгрузку страницы', 1000)
//   let basketCount = await driver.findElement(By.css('.basket__counter')).getText()
//   let basketSum = await driver.findElement(By.css('.basket-info__total_sum .basket-info__fields-text')).getText()
//   logEvent("Корзина", "В корзине " + basketCount + " на сумму " + basketSum)
//   await driver.wait(until.elementLocated(By.css('.basket-info .js--make-order.active')), 30000, 'Нажимаем на кнопку оформления заказа', 1000).click()
//   await driver.wait(until.elementIsVisible(driver.findElement(By.css('.popup.popup-auth'))), 30000, 'Ожидаем попап авторизации', 1000)

//   logEvent("Корзина", "Ввод телефона: " + USER_PHONE)
//   await driver.findElement(By.css('.popup--visible.popup-auth input[data-mask="+7 (F99) 999-9999"]')).sendKeys(USER_PHONE, Key.ENTER)

//   logEvent("Корзина", "Ввод кода: " + CONFIRM_CODE)
//   await driver.wait(until.elementIsVisible(driver.findElement(By.css('.popup--visible.popup-auth input[autocomplete="one-time-code"]'))), 30000, 'Ожидаем инпут кода авторизации', 1000)
//   await driver.findElement(By.css('.popup--visible.popup-auth input[autocomplete="one-time-code"]')).sendKeys(CONFIRM_CODE, Key.ENTER)

//   await driver.wait(until.urlContains(SUCCESS_URL), 30000, 'Получение адреса после редиректа', 1000).then(function () {
//     logEvent("Корзина", "Заказ оформлен!");
//   }, function () {
//     logEvent("Корзина", "Заказ не оформлен!");
//   })
// }

function logEvent(screen, action) {
  const date = new Date()
    let h = (date.getHours() < 10) ? "0" + date.getHours() : date.getHours()
    let m = (date.getMinutes() < 10) ? "0" + date.getMinutes() : date.getMinutes()
    let s = (date.getSeconds() < 10) ? "0" + date.getSeconds() : date.getSeconds()
    const event = "[" + h + ":" + m + ":" + s +"] Место: " + screen + " | Действие: " + action + "\n";

  console.log(event)
  events.push(event)
}

function makeScreenshot(name = "screenshot") {
  const encodedString = driver.takeScreenshot().then(function (data) {
    const base64Data = data.replace(/^data:image\/pngbase64,/, "")
    fs.writeFile("./" + name + ".png", base64Data, 'base64', function (err) {
      if (err) console.error(err)
    })
  })
}

