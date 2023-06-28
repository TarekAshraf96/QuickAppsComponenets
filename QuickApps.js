class QuickApps {
  constructor(page, context) {
    // locators
    this.page = page;
    this.context = context;
    this.quickAppsParentDiv = '.dozen-main.container-fluid';
    this.quickAppsListParentDiv = '.dozen-quick-apps-component';
    this.quickAppsListParentDivAncestor = '//ancestor::div[contains(@class, "dozen-quick-apps-component")]';
    this.personalizeButton = '.quick-apps__item--personalize';
    this.quickAppsHeaderTitle = '.dz-component-heading-title';
    this.resetWrapper = '[class = "reset-btn-wrapper"]';
    this.resetTools = '.dozen-btn.reset-btn';

    this.appItem = '.quick-apps__item';
    this.pinnedAppItem = '.quick-apps__item.pinned';
    this.unPinnedAppItem = '[class="quick-apps__item "]';
    this.appText = '.quick-apps__item-text';
    this.appPinIcon = '.quick-apps__item-icon--pinned';

    this.personalizeDialog = '.dozen-modal-alpine_modal-dialog:not([style="display: none;"])';
    this.allAppsDiv = '.all-app-body';
    this.favoriteAppsDiv = '.fav-body';
    this.noFavoriteApps = '.fav-container.quick-apps_no-data div';
    this.findAppInput = '.form-control.input-field';
    this.favoriteIcon = '.quick-apps__icon-container__add';
    this.closeDialog = '.close.close-btn';

    this.allAppsCategoryDiv = '.dozen-side-content .dozen-quick-apps__category-list';
    this.allAppsCategoryDivAncestor = '//ancestor::div[contains(@class, "dozen-quick-apps__category-list")]';
    this.categorySection = '.quick-apps__category-section';
    this.favoriteAppsSection = '.panel-container.quick-apps__toolbar-content';
    this.categorySectionAncestor = '//ancestor::div[contains(@class, "quick-apps__category-section")]';
    this.category = '.quick-apps__category-title';
    this.unPinnedAppItemInCategoryList = '[class = "quick-apps__item quick-apps__item--category "]';

    this.appTextFullSelector = '.dozen-modal-alpine_modal-dialog:not([style="display: none;"]) .all-app-body .quick-apps__item-text';
  }

  async waitForDialogSingleAppToBeLoaded() {
    await this.page.waitForSelector(this.appTextFullSelector);
  }

  async clickPersonalize(QAListTitle) {
    this.page.waitForRequest((url) => url.url().includes('All-Quick-Apps'));
    await this.page.locator(this.quickAppsHeaderTitle, { hasText: QAListTitle })
      .locator(this.quickAppsListParentDivAncestor)
      .locator(this.personalizeButton)
      .click();

    await this.waitForDialogSingleAppToBeLoaded();
  }

  async returnQuickApp(QAListTitle, appTitle) {
    return this.page.locator(this.quickAppsHeaderTitle, { hasText: QAListTitle })
      .locator(this.quickAppsListParentDivAncestor)
      .locator(this.appItem)
      .locator(this.appText, { hasText: appTitle });
  }

  async returnForcedAppsForSpecificList(QAListTitle) {
    const elementsList = await this.page.locator(this.quickAppsHeaderTitle, { hasText: QAListTitle })
      .locator(this.quickAppsListParentDivAncestor)
      .locator(this.pinnedAppItem)
      .locator(this.appText);

    const listOfTitles = await elementsList.evaluateAll(
      (list) => list.map((element) => element.textContent),
    );

    return listOfTitles;
  }

  async returnDefaultAppsForSpecificList(QAListTitle) {
    const elementsList = await this.page.locator(this.quickAppsHeaderTitle, { hasText: QAListTitle })
      .locator(this.quickAppsListParentDivAncestor)
      .locator(this.unPinnedAppItem)
      .locator(this.appText);

    const listOfTitles = await elementsList.evaluateAll(
      (list) => list.map((element) => element.textContent),
    );

    return listOfTitles;
  }

  async hoverOnApp() {
    await this.page.locator(this.personalizeDialog)
      .locator(this.allAppsDiv)
      .locator(this.appItem)
      .nth(0)
      .hover();
  }

  async clickFirstFavoriteApp() {
    await this.hoverOnApp();
    await this.page.locator(this.personalizeDialog)
      .locator(this.allAppsDiv)
      .locator(this.favoriteIcon)
      .nth(0)
      .click();
  }

  async clickCloseDialog() {
    await this.page.locator(this.personalizeDialog)
      .locator(this.closeDialog)
      .nth(0)
      .click();
  }

  async enterAppToFind(app) {
    await this.page.locator(this.personalizeDialog)
      .locator(this.allAppsDiv)
      .locator(this.findAppInput)
      .type(app, { delay: 100 });
  }

  async returnFirstAppTextFromAllApps() {
    return this.page.locator(this.personalizeDialog)
      .locator(this.allAppsDiv)
      .locator(this.appItem)
      .nth(0)
      .locator(this.appText)
      .textContent();
  }

  async returnLastFavoriteAppText() {
    return this.page.locator(this.personalizeDialog)
      .locator(this.favoriteAppsDiv)
      .locator(this.appItem)
      .last()
      .locator(this.appText)
      .textContent();
  }

  async returnAllFavoriteApps() {
    const elementsList = await this.page.locator(this.personalizeDialog)
      .locator(this.favoriteAppsDiv)
      .locator(this.appItem)
      .locator(this.appText);

    const listOfTitles = await elementsList.evaluateAll(
      (list) => list.map((element) => element.textContent),
    );

    return listOfTitles;
  }

  async returnNoFavoriteAppsDisplayed() {
    return this.page.locator(this.noFavoriteApps);
  }

  async favoriteFirstApp(QAListTitle) {
    await this.clickPersonalize(QAListTitle);
    await this.clickFirstFavoriteApp();
    await this.clickCloseDialog();
  }

  async resetQuickAppsList(QAListTitle) {
    await this.page.locator(this.quickAppsHeaderTitle, { hasText: QAListTitle })
      .locator(this.quickAppsListParentDivAncestor)
      .locator(this.resetWrapper)
      .locator(this.resetTools)
      .click();
  }

  async resetAllTools() {
    const elements = await this.page.locator(this.resetWrapper)
      .locator(this.resetTools);
    await elements.evaluateAll((list) => list.map((element) => element.click()));
  }

  async returnDefaultAppsForCategoryList(QAListTitle) {
    const elementsList = await this.page.locator(this.allAppsCategoryDiv)
      .locator(this.quickAppsHeaderTitle, { hasText: QAListTitle })
      .locator(this.allAppsCategoryDivAncestor)
      .locator(this.favoriteAppsSection)
      .locator(this.unPinnedAppItemInCategoryList)
      .locator(this.appText);

    const listOfTitles = await elementsList.evaluateAll(
      (list) => list.map((element) => element.textContent.trim()),
    );

    return listOfTitles;
  }

  async enterAppToFindInCategoriesList(app) {
    await this.page.locator(this.quickAppsParentDiv)
      .locator(this.allAppsCategoryDiv)
      .locator(this.findAppInput)
      .type(app, { delay: 300 });
  }

  async returnFirstAppTextInCategoriesList() {
    return this.page.locator(this.quickAppsParentDiv)
      .locator(this.allAppsCategoryDiv)
      .locator(this.allAppsDiv)
      .locator(this.appItem)
      .nth(0)
      .locator(this.appText)
      .textContent();
  }

  async hoverOnAppInCategoriesList() {
    await this.page.locator(this.quickAppsParentDiv)
      .locator(this.allAppsCategoryDiv)
      .locator(this.allAppsDiv)
      .locator(this.appItem)
      .nth(0)
      .hover();
  }

  async clickFavoriteAppInCategoriesList() {
    await this.hoverOnAppInCategoriesList();
    await this.page.locator(this.quickAppsParentDiv)
      .locator(this.allAppsCategoryDiv)
      .locator(this.favoriteIcon)
      .nth(0)
      .click();
  }

  async returnAppInCategoriesList(appTitle) {
    return this.page.locator(this.quickAppsParentDiv)
      .locator(this.allAppsCategoryDiv)
      .locator(this.appText, { hasText: appTitle });
  }

  async returnCategory(category) {
    return this.page.locator(this.quickAppsParentDiv)
      .locator(this.allAppsCategoryDiv)
      .locator(this.category, { hasText: category });
  }
}
module.exports = QuickApps;
