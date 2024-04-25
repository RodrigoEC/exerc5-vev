const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

describe('shipments', () => {
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser('firefox').build();
  });

  after(async () => {
    await driver.quit();
  });

  beforeEach(async () => {
    driver.manage().deleteAllCookies();
    await driver.get('http://localhost:9990/admin');
    // await driver.get('http://150.165.75.99:9990/admin');
    await driver.findElement(By.id('_username')).sendKeys('sylius');
    await driver.findElement(By.id('_password')).sendKeys('sylius');
    await driver.findElement(By.css('.primary')).click();
    // await driver.sleep(1000);
  });

  // Remove .only and implement others test cases!
  it('ship a ready shipment', async () => {
    // Click in shipments in side menu
    await driver.findElement(By.linkText('Shipments')).click();

    // Select the state to search for new shipments
    const dropdown = await driver.findElement(By.id('criteria_state'));
    await dropdown.findElement(By.xpath("//option[. = 'Ready']")).click();

    // Click in filter blue button
    await driver.findElement(By.css('*[class^="ui blue labeled icon button"]')).click();

    // Click in Ship of the first shipment listed
    const buttons = await driver.findElements(By.css('*[class^="ui labeled icon teal button"]'));
    await buttons[0].click();

    // Assert that shipment has been completed
    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Shipment has been successfully shipped.'));
  });

  it('Edit adress info through Shipments tab', async () => {
    await driver.findElement(By.linkText('Shipments')).click();

    await driver.findElement(By.xpath("//tr[@class='item']/td/a")).click();
    await driver.findElement(By.id('edit-addresses')).click();
    await driver.findElement(By.id('sylius_save_changes_button')).click();


    // Implement your test case 2 code here

    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('Order has been successfully updated.'));
  });

  it('Filter cancelled shipments', async () => {
    await driver.findElement(By.linkText('Shipments')).click();
    const dropdown = await driver.findElement(By.id('criteria_state'));
    await dropdown.findElement(By.xpath("//option[. = 'Cancelled']")).click();

    await driver.findElement(By.css('*[class^="ui blue labeled icon button"]')).click();

    const bodyText = await driver.findElement(By.tagName('body')).getText();
    assert(bodyText.includes('There are no results to display'));
  });


  it('Filter by shipping methods shipments - UPS', async () => {
    await driver.findElement(By.linkText('Shipments')).click();
    const dropdown = await driver.findElement(By.id('criteria_method'));
    await dropdown.findElement(By.xpath("//option[. = 'UPS']")).click();

    await driver.findElement(By.css('*[class^="ui blue labeled icon button"]')).click();

    let hasElements = true
    try {
      await driver.findElement(By.xpath("//tr[@class='item']/td/a")).click();
      
      const bodyText = await driver.findElement(By.tagName('body')).getText();
      assert(bodyText.includes('UPS'));
    } catch (error) {
      hasElements = false
      const bodyText = await driver.findElement(By.tagName('body')).getText();
      assert(bodyText.includes('There are no results to display'));
    } 
  });

  it('Filter by shipping methods shipments - FedEx', async () => {
    await driver.findElement(By.linkText('Shipments')).click();
    const dropdown = await driver.findElement(By.id('criteria_method'));
    await dropdown.findElement(By.xpath("//option[. = 'FedEx']")).click();

    await driver.findElement(By.css('*[class^="ui blue labeled icon button"]')).click();

    let hasElements = true
    try {
      await driver.findElement(By.xpath("//tr[@class='item']/td/a")).click();
      
      const bodyText = await driver.findElement(By.tagName('body')).getText();
      assert(bodyText.includes('FedEx'));
    } catch (error) {
      hasElements = false
      const bodyText = await driver.findElement(By.tagName('body')).getText();
      assert(bodyText.includes('There are no results to display'));
    } 
  });

  it('Filter by shipping methods shipments - DHL Express', async () => {
    await driver.findElement(By.linkText('Shipments')).click();
    const dropdown = await driver.findElement(By.id('criteria_method'));
    await dropdown.findElement(By.xpath("//option[. = 'DHL Express']")).click();

    await driver.findElement(By.css('*[class^="ui blue labeled icon button"]')).click();


    let hasElements = true
    try {
      await driver.findElement(By.xpath("//tr[@class='item']/td/a")).click();
      
      const bodyText = await driver.findElement(By.tagName('body')).getText();
      assert(bodyText.includes('DHL Express'));
    } catch (error) {
      hasElements = false
      const bodyText = await driver.findElement(By.tagName('body')).getText();
      assert(bodyText.includes('There are no results to display'));
    } 
  });


  it('Filter by Channel - Fashion Web Store', async () => {
    await driver.findElement(By.linkText('Shipments')).click();
    const dropdown = await driver.findElement(By.id('criteria_channel'));
    await dropdown.findElement(By.xpath("//option[. = 'Fashion Web Store']")).click();

    await driver.findElement(By.css('*[class^="ui blue labeled icon button"]')).click();

    let paginationMenu;
    let lines = true
    try {
      paginationMenu = await driver.findElement(By.xpath("//div[@class='ui pagination menu']"))
    } catch (error) {
      const bodyText = await driver.findElement(By.tagName('body')).getText();

      lines = await driver.findElements(By.xpath("//div[@class='channel']/span[@class='channel__item']"))

      if (lines.length === 0) {
        assert(bodyText.includes('There are no results to display'));
      } else {
        let lineIndex = 0
        while (lineIndex < lines.length) {
          const lineText = await lines[lineIndex].getText()
          assert(lineText === "Ready", `Differed element ${lineText}`)
          lineIndex += 1
        }
      }
      
      return
    }

    const menu = await paginationMenu.findElements(By.className("item"))

    let index = 2;
    while (index < menu.length - 1) {

      const lines = await driver.findElements(By.xpath("//div[@class='channel']/span[@class='channel__item']"))
      let lineIndex = 0
      while (lineIndex < lines.length) {
        const lineText = await lines[lineIndex].getText()

        assert(lineText.includes("Fashion Web Store"), `Differed element ${lineText}`)
        lineIndex += 1
      }
      index += 1
      await menu[index].click()
    }
  });

  it('Filter by state - Shipped', async () => {
    await driver.findElement(By.linkText('Shipments')).click();
    const dropdown = await driver.findElement(By.id('criteria_state'));
    await dropdown.findElement(By.xpath("//option[. = 'Shipped']")).click();

    await driver.findElement(By.css('*[class^="ui blue labeled icon button"]')).click();

    let paginationMenu;
    let lines = true
    try {
      paginationMenu = await driver.findElement(By.xpath("//div[@class='ui pagination menu']"))
    } catch (error) {
      const bodyText = await driver.findElement(By.tagName('body')).getText();

      lines = await driver.findElements(By.className("ui green label"));

      if (lines.length === 0) {
        assert(bodyText.includes('There are no results to display'));
      } else {
        let lineIndex = 0
        while (lineIndex < lines.length) {
          const lineText = await lines[lineIndex].getText()
          assert(lineText === "Ready", `Differed element ${lineText}`)
          lineIndex += 1
        }
      }
      
      return
    }
      
    const menu = await paginationMenu.findElements(By.className("item"))
    let index = 2;
    while (index < menu.length - 1) {

      const lines = await driver.findElements(By.className("ui green label"));
      

      let lineIndex = 0
      while (lineIndex < lines.length) {
        const lineText = await lines[lineIndex].getText()
        assert(lineText === "Shipped", `Differed element ${lineText}`)
        lineIndex += 1
      }
      index += 1
      await menu[index].click()
    }
  });

  it('Filter by state - Cancelled', async () => {
    await driver.findElement(By.linkText('Shipments')).click();
    const dropdown = await driver.findElement(By.id('criteria_state'));
    await dropdown.findElement(By.xpath("//option[. = 'Cancelled']")).click();

    await driver.findElement(By.css('*[class^="ui blue labeled icon button"]')).click();
    
    let paginationMenu;
    let lines = true
    try {
      paginationMenu = await driver.findElement(By.xpath("//div[@class='ui pagination menu']"))
    } catch (error) {
      const bodyText = await driver.findElement(By.tagName('body')).getText();

      lines = await driver.findElements(By.className("ui green label"));

      if (lines.length === 0) {
        assert(bodyText.includes('There are no results to display'));
      } else {
        let lineIndex = 0
        while (lineIndex < lines.length) {
          const lineText = await lines[lineIndex].getText()
          assert(lineText === "Ready", `Differed element ${lineText}`)
          lineIndex += 1
        }
      }
      
      return
    }
    
    const menu = await paginationMenu.findElements(By.className("item"))
    let index = 2;
    while (index < menu.length - 1) {

      const lines = await driver.findElements(By.className("ui green label"));
      

      let lineIndex = 0
      while (lineIndex < lines.length) {
        const lineText = await lines[lineIndex].getText()
        assert(lineText === "Cancelled", `Differed element ${lineText}`)
        lineIndex += 1
      }
      index += 1
      await menu[index].click()
    }
  });
  it('Filter by state - Ready', async () => {
    await driver.findElement(By.linkText('Shipments')).click();
    const dropdown = await driver.findElement(By.id('criteria_state'));
    await dropdown.findElement(By.xpath("//option[. = 'Ready']")).click();

    await driver.findElement(By.css('*[class^="ui blue labeled icon button"]')).click();
    
    let paginationMenu;
    let lines = true
    try {
      paginationMenu = await driver.findElement(By.xpath("//div[@class='ui pagination menu']"))
    } catch (error) {
      const bodyText = await driver.findElement(By.tagName('body')).getText();

      lines = await driver.findElements(By.className("ui blue label"));

      if (lines.length === 0) {
        assert(bodyText.includes('There are no results to display'));
      } else {
        let lineIndex = 0
        while (lineIndex < lines.length) {
          const lineText = await lines[lineIndex].getText()
          assert(lineText === "Ready", `Differed element ${lineText}`)
          lineIndex += 1
        }
      }
      
      return
    }
    
    const menu = await paginationMenu.findElements(By.className("item"))
    let index = 2;
    while (index < menu.length - 1) {

      const lines = await driver.findElements(By.className("ui blue label"));
      

      let lineIndex = 0
      while (lineIndex < lines.length) {
        const lineText = await lines[lineIndex].getText()
        assert(lineText === "Ready", `Differed element ${lineText}`)
        lineIndex += 1
      }
      index += 1
      await menu[index].click()
    }
  });
});
