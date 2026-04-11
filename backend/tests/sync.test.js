import request from 'supertest';
import app from '../src/index.js';

const VALID_ASHA_ID = 'a1000000-0000-0000-0000-000000000001';

const makeCase = (overrides = {}) => ({
  id:               crypto.randomUUID(),
  ashaId:           VALID_ASHA_ID,
  patientAgeGroup:  'child',
  patientSex:       'F',
  isPregnant:       false,
  symptoms:         ['fever', 'stiff_neck'],
  triageResult:     'RED',
  confidenceScore:  0.91,
  contributingFactors: [{ symptom: 'stiff_neck', weight: 0.45 }],
  inputMethod:      'tap',
  villageTag:       'Bihta Ward 4',
  clientTimestamp:  Date.now(),
  clientVersion:    '1.0.0',
  ...overrides,
});

describe('POST /api/sync/cases', () => {
  it('rejects missing body', async () => {
    const res = await request(app).post('/api/sync/cases').send({});
    expect(res.status).toBe(400);
  });

  it('rejects invalid ashaId', async () => {
    const res = await request(app).post('/api/sync/cases').send({
      ashaId: 'not-a-uuid',
      cases: [makeCase({ ashaId: 'not-a-uuid' })],
    });
    expect(res.status).toBe(400);
  });

  it('rejects empty cases array', async () => {
    const res = await request(app).post('/api/sync/cases').send({
      ashaId: VALID_ASHA_ID,
      cases: [],
    });
    expect(res.status).toBe(400);
  });

  it('rejects case with no symptoms', async () => {
    const res = await request(app).post('/api/sync/cases').send({
      ashaId: VALID_ASHA_ID,
      cases: [makeCase({ symptoms: [] })],
    });
    expect(res.status).toBe(400);
  });

  it('rejects unknown ASHA id', async () => {
    const unknownId = '00000000-0000-0000-0000-000000000099';
    const res = await request(app).post('/api/sync/cases').send({
      ashaId: unknownId,
      cases: [makeCase({ ashaId: unknownId })],
    });
    expect(res.status).toBe(404);
  });
});

describe('GET /api/ping', () => {
  it('returns 200 with ok:true', async () => {
    const res = await request(app).get('/api/ping');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(typeof res.body.ts).toBe('number');
  });
});

describe('GET /api/facilities', () => {
  it('returns array', async () => {
    const res = await request(app).get('/api/facilities?block=Bihta');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});