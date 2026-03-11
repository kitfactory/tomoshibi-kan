const { registerBoardFlowTests } = require('./workspace-layout.board-flow');
const { registerBoardRuntimeTests } = require('./workspace-layout.board-runtime');

function registerBoardTests(test, expect) {
  registerBoardFlowTests(test, expect);
  registerBoardRuntimeTests(test, expect);
}

module.exports = { registerBoardTests };
