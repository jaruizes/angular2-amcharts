import { Angular2AmchartsPage } from './app.po';

describe('angular2-amcharts App', () => {
  let page: Angular2AmchartsPage;

  beforeEach(() => {
    page = new Angular2AmchartsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
