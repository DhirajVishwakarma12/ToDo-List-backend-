import test from 'node:test';
import assert from 'node:assert/strict';

import * as taskController from '../src/controller/task.controller.js';
import TaskModel from '../src/models/task.model.js';

test('exports completeTask handler for task routes', () => {
  assert.equal(typeof taskController.completeTask, 'function');
});

test('creatTasks supplies taskDate when creating tasks', async () => {
  const originalInsertMany = TaskModel.insertMany;
  let capturedPayload;

  TaskModel.insertMany = async (payload) => {
    capturedPayload = payload;
    return payload;
  };

  try {
    const req = {
      user: { id: 'user-1' },
      body: { taskName: 'Test task' },
    };

    const res = {
      statusCode: null,
      body: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(payload) {
        this.body = payload;
        return this;
      },
    };

    await taskController.creatTasks(req, res);

    assert.ok(capturedPayload, 'expected insertMany to be called');
    assert.ok(capturedPayload[0].taskDate, 'expected taskDate to be set');
    assert.equal(res.statusCode, 201);
  } finally {
    TaskModel.insertMany = originalInsertMany;
  }
});
