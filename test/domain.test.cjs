const { test } = require('node:test');
const assert = require('node:assert/strict');

test('vehicle updates and deletes are scoped to the authenticated provider', async t => {
  const Vehicle = require('../src/models/Vehicle');
  const controller = require('../src/controllers/vehicleController');
  let filter;
  t.mock.method(Vehicle, 'findOneAndUpdate', async (query, update) => { filter = query; assert.equal(update.userId, undefined); return null; });
  t.mock.method(Vehicle, 'findOneAndDelete', async query => { filter = query; return null; });
  const req = { params: { id: '507f1f77bcf86cd799439011' }, user: { username: 'owner' }, body: { userId: 'intruder', brand: 'Toyota' } };
  let status;
  const res = { status(c) { status = c; return this; }, json() {} };
  for (const handler of [controller.updateVehicle, controller.deleteVehicle]) {
    await handler(req, res);
    assert.deepEqual(filter, { _id: req.params.id, userId: 'owner' });
    assert.equal(status, 404);
  }
});
