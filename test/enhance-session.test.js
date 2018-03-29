'use strict';

const mock = require('egg-mock');

describe('test/enhance-session.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/enhance-session-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, enhanceSession')
      .expect(200);
  });
});
