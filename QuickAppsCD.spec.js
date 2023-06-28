/* const { test, expect, chromium } = require('@playwright/test');
const fs = require('fs');
const CDQuickAppsPage = require('../../Pages/CDQuickAppsPage');
const Environment = require('../../Data/Environment.json');

let cdPage;
let cdContext;
let browser;
let CDState;
let quickAppsPage;
const envURL = Environment.CDURL.substr(0, Environment.CDURL.length - 1);

test.describe.parallel('Quick Apps component CD Tests', () => {
  test.beforeAll(async () => {
    // getting CD state to pass to the new browsers
    CDState = JSON.parse(fs.readFileSync('CDstate.json'));
  });

  test.beforeEach(async () => {
    // start browsers with the correct states for CM and CD
    browser = await chromium.launch({ args: ['--start-maximized'] });
    cdContext = await browser.newContext({ viewport: null, storageState: CDState });

    cdPage = await cdContext.newPage();
    quickAppsPage = new CDQuickAppsPage(cdPage, cdContext);
    await cdPage.goto(`${envURL}/AutoData/AutomationQuickAppsPage`, { waitUntil: 'networkidle' });
  });

  test('Validate open and close [Personalize Quick Apps] popup', async () => {
    await quickAppsPage.clickOnPersonalizeButtonForChildrenList();
    const personalizePopup = await cdPage.locator(quickAppsPage.personalizePopup);
    expect(await personalizePopup.screenshot()).toMatchSnapshot('personalizePopup.png');
    expect(await cdPage.locator(quickAppsPage.noFavAppsMsg)).toContainText(' No favourite apps are found ');
    await quickAppsPage.closePersonalizePopupForChildrenList();
    const result = await quickAppsPage.isPersonalizePopupClosed();
    expect(result).toBeTruthy();
  });

  test('Validate Quick Apps list with Children default list', async () => {
    const quickAppsList = await cdPage.locator(quickAppsPage.quickAppsChildrenList);
    expect(await quickAppsList.screenshot()).toMatchSnapshot('QuickAppsChildrenList.png');
  });

  test('Validate Quick Apps list with Specific default list', async () => {
    const quicAppsList = await cdPage.locator(quickAppsPage.quickAppsSpecificList);
    expect(await quicAppsList.screenshot()).toMatchSnapshot('QuickAppsSpecificList.png');
  });

  test('Validate Quick Apps list with Search Scope default list', async () => {
    const quicAppsList = await cdPage.locator(quickAppsPage.quickAppsSearchScopeList);
    expect(await quicAppsList.screenshot()).toMatchSnapshot('QuickAppsSearchScopeList.png');
  });

  test('Validate Quick Apps list with Query list', async () => {
    const quicAppsList = await cdPage.locator(quickAppsPage.quickAppsQueryList);
    expect(await quicAppsList.screenshot()).toMatchSnapshot('QuickAppsQueryList.png');
  });

  test('Validate Search For Quick App', async () => {
    const searchValue = 'Calculator1';
    await quickAppsPage.clickOnPersonalizeButtonForChildrenList();
    const result = await quickAppsPage.searchForApp(searchValue);
    expect(result).toBeTruthy();
    // make sure en el text tmm
  });

  test('Validate Favorite Quick App then unfavorite it', async () => {
    test.setTimeout(60000);
    const searchValue = 'Calculator1';
    await quickAppsPage.clickOnPersonalizeButtonForChildrenList();
    const isAdded = await quickAppsPage.addQuickAppToFavorites(searchValue);
    await expect(isAdded).toBeTruthy();
    // reload the page
    await quickAppsPage.closePersonalizePopupForChildrenList();
    await cdPage.goto(`${envURL}/AutoData/AutomationQuickAppsPage`);
    await expect(await cdPage.locator(quickAppsPage.calculatorApssInChildrenList)).toBeVisible();

    await quickAppsPage.clickOnPersonalizeButtonForChildrenList();
    const isDeleted = await quickAppsPage.deleteQuickAppFromFavorites(searchValue);
    await expect(isDeleted).toBeTruthy();
    await quickAppsPage.closePersonalizePopupForChildrenList();
    await cdPage.goto(`${envURL}/Automation/AutomationQuickAppsPage`);
    const quickAppsList = await cdPage.locator(quickAppsPage.quickAppsChildrenList);
    expect(await quickAppsList.screenshot()).toMatchSnapshot('QuickAppsChildrenList.png');
  });

  test('Validate Search For Quick App in Categories List', async () => {
    const searchValue = 'Calculator';
    const result = await quickAppsPage.searchForAppInCategoriesList(searchValue);
    expect(result).toBeTruthy();
  });

  test('Validate Search by Category Name in categories list', async () => {
    const searchValue = 'Automation Category1';
    const result = await quickAppsPage.searchForCaregoryInCategoriesList(searchValue);
    expect(result).toBeTruthy();
  });

  test('Validate Expand and Collapse categories in Categories list', async () => {
    test.setTimeout(120000);
    const searchValue = 'Automation Category';
    await quickAppsPage.searchForCaregoryInCategoriesList(searchValue);
    const isIconcollapsed = await quickAppsPage.clickOnCategories(false);
    // validate is icons expanded correctly
    expect(isIconcollapsed).toBeTruthy();
    // validate visual testing
    const collapsedContainer = await cdPage.locator(quickAppsPage.automationCategoriesSearchContainer);
    expect(await collapsedContainer.screenshot()).toMatchSnapshot('CollapsedCategories.png');

    const isIconExpanded = await quickAppsPage.clickOnCategories(true);
    // validate is icons expanded correctly
    expect(isIconExpanded).toBeTruthy();
    // validate visual testing
    const container = await cdPage.locator(quickAppsPage.automationCategoriesSearchContainer);
    expect(await container.screenshot()).toMatchSnapshot('ExpandedCategories.png');
  });

  // add expand first category style in new category list

  test.afterEach(async () => {
    await browser.close();
  });
});
*/
