const { test, expect, chromium } = require('@playwright/test');
const fs = require('fs');
const { url } = require('inspector');
const QuickAppsPage = require('../../Pages/Components/QuickApps');
const Environment = require('../../Data/Environment.json');
const QuickApps = require('../../Data/QuickAppsData.json');
const QuickAppsCategories = require('../../Data/QuickAppsCategories.json');

let cdPage;
let cdContext;
let browser;
let CDState;
let quickAppsPage;
const envURL = Environment.CDURL;

test.describe('Quick Apps Tests', () => {
  test.beforeAll(async () => {
    // getting CD state to pass to the new browsers
    CDState = JSON.parse(fs.readFileSync('CDstate.json'));
  });

  test.beforeEach(async () => {
    // start browsers with the correct states for CM and CD
    browser = await chromium.launch({ args: ['--start-maximized'] });
    cdContext = await browser.newContext({ viewport: null, storageState: CDState });

    cdPage = await cdContext.newPage();
    quickAppsPage = new QuickAppsPage(cdPage, cdContext);
    await cdPage.goto(`${envURL}AutoData/NewQuickAppsAutomation`, { waitUntil: 'networkidle' });
    await cdPage.waitForLoadState('domcontentloaded');

    await quickAppsPage.resetAllTools();
  });

  QuickApps.forEach((QAData) => {
    test(`Check Foced Apps Of ${QAData.QAListTitle}`, async () => {
      const forcedAppsTitleList = await quickAppsPage.returnForcedAppsForSpecificList(QAData.QAListTitle);
      expect.soft(forcedAppsTitleList.length).toEqual(QAData.ForcedApps.length);
      expect.soft(forcedAppsTitleList.every((val) => QAData.ForcedApps.includes(val))).toBeTruthy();
    });
  });

  QuickApps.forEach((QAData) => {
    test(`Check Default Apps Of ${QAData.QAListTitle}`, async () => {
      const defaultAppsTitleList = await quickAppsPage.returnDefaultAppsForSpecificList(QAData.QAListTitle);
      expect.soft(defaultAppsTitleList.length).toEqual(QAData.DefaultApps.length);
      expect.soft(defaultAppsTitleList.every((val) => QAData.DefaultApps.includes(val))).toBeTruthy();
    });
  });

  QuickApps.forEach((QAData) => {
    test(`Check Favorite Apps If ${QAData.QAListTitle} has Set As Default Favourite ${QAData.SetAsDefaultFavourite}`, async () => {
      await quickAppsPage.clickPersonalize(QAData.QAListTitle);
      const favoriteAppsTitleList = await quickAppsPage.returnAllFavoriteApps();

      if (QAData.SetAsDefaultFavourite) {
        expect.soft(QAData.DefaultApps.every((val) => favoriteAppsTitleList.includes(val))).toBeTruthy();
      } else {
        await expect.soft(await quickAppsPage.returnNoFavoriteAppsDisplayed()).toBeVisible();
      }
    });
  });

  QuickApps.forEach((QAData) => {
    test(`Favourite App For ${QAData.QAListTitle}`, async () => {
      await quickAppsPage.clickPersonalize(QAData.QAListTitle);
      const appToFavorite = await quickAppsPage.returnFirstAppTextFromAllApps();
      await quickAppsPage.clickFirstFavoriteApp();

      expect.soft(await quickAppsPage.returnLastFavoriteAppText()).toEqual(appToFavorite);
      expect.soft(await quickAppsPage.returnFirstAppTextFromAllApps()).not.toEqual(appToFavorite);

      await quickAppsPage.clickCloseDialog();

      const defaultAppsTitleList = await quickAppsPage.returnDefaultAppsForSpecificList(QAData.QAListTitle);
      const forcedAppsTitleList = await quickAppsPage.returnForcedAppsForSpecificList(QAData.QAListTitle);

      expect.soft(forcedAppsTitleList.every((val) => QAData.ForcedApps.includes(val))).toBeTruthy();

      // Assert Default Apps is displayed as expected according to set as default favorite value
      if (QAData.SetAsDefaultFavourite) {
        expect.soft(defaultAppsTitleList.length).toEqual(QAData.DefaultApps.length + 1);
        expect.soft(QAData.DefaultApps.every((val) => defaultAppsTitleList.includes(val))).toBeTruthy();
        expect.soft(defaultAppsTitleList).toContain(appToFavorite);
      } else {
        expect.soft(defaultAppsTitleList.length).toEqual(1);
        expect.soft(defaultAppsTitleList[0]).toEqual(appToFavorite);
      }
    });
  });

  test('Search App', async () => {
    await quickAppsPage.clickPersonalize(QuickApps[0].QAListTitle);
    await quickAppsPage.enterAppToFind(QuickApps[1].Apps[0]);

    expect.soft(await quickAppsPage.returnFirstAppTextFromAllApps()).toEqual(QuickApps[1].Apps[0]);
    expect.soft(await quickAppsPage.returnFirstAppTextFromAllApps()).not.toEqual(QuickApps[2].Apps[0]);
  });

  test('Reset App List', async () => {
    await quickAppsPage.favoriteFirstApp(QuickApps[0].QAListTitle);
    await quickAppsPage.resetQuickAppsList(QuickApps[0].QAListTitle);

    const defaultAppsTitleList = await quickAppsPage.returnDefaultAppsForSpecificList(QuickApps[0].QAListTitle);
    expect.soft(defaultAppsTitleList.every((val) => QuickApps[0].DefaultApps.includes(val))).toBeTruthy();

    const forcedAppsTitleList = await quickAppsPage.returnForcedAppsForSpecificList(QuickApps[0].QAListTitle);
    expect.soft(forcedAppsTitleList.every((val) => QuickApps[0].ForcedApps.includes(val))).toBeTruthy();
  });

  test('Search App In Categorized List', async () => {
    await quickAppsPage.enterAppToFindInCategoriesList(QuickAppsCategories.Apps[0]);
    await expect.soft(await quickAppsPage.returnAppInCategoriesList(QuickAppsCategories.Apps[0])).toBeVisible();
    await expect.soft(await quickAppsPage.returnAppInCategoriesList(QuickAppsCategories.Apps[1])).toHaveCount(0);
  });

  test('Search Category In Categorized List', async () => {
    await quickAppsPage.enterAppToFindInCategoriesList(Object.keys(QuickAppsCategories.CategoriesApps[0])[0]);
    await expect.soft(await quickAppsPage.returnCategory(Object.keys(QuickAppsCategories.CategoriesApps[0])[0])).toBeVisible();
    await expect.soft(await quickAppsPage.returnAppInCategoriesList(Object.values(QuickAppsCategories.CategoriesApps[0])[0])).toBeVisible();
    await expect.soft(await quickAppsPage.returnCategory(Object.keys(QuickAppsCategories.CategoriesApps[1])[0])).toHaveCount(0);
    await expect.soft(await quickAppsPage.returnAppInCategoriesList(Object.values(QuickAppsCategories.CategoriesApps[1])[0])).toHaveCount(0);
  });

  test('Favorite App In Categorized List', async () => {
    cdPage.waitForResponse((uRL) => uRL.url().includes('All-Quick-Apps'));
    await cdPage.keyboard.down('End');

    const appToFavorite = await quickAppsPage.returnFirstAppTextInCategoriesList();
    await quickAppsPage.clickFavoriteAppInCategoriesList();

    expect.soft(await quickAppsPage.returnFirstAppTextInCategoriesList()).not.toEqual(appToFavorite);

    const defaultAppsTitleList = await quickAppsPage.returnDefaultAppsForCategoryList(QuickAppsCategories.QAListTitle);
    expect.soft(defaultAppsTitleList.length).toEqual(QuickAppsCategories.DefaultApps.length + 1);
    expect.soft(QuickAppsCategories.DefaultApps.every((val) => defaultAppsTitleList.includes(val))).toBeTruthy();
    expect.soft(defaultAppsTitleList).toContain(appToFavorite.trim());
  });

  test.afterEach(async () => {
    await browser.close();
  });
});
