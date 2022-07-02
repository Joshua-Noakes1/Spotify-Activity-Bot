const WorkerPool = require('workerpool'),
    path = require('path'),
    lcl = require('cli-color');

// FUNCTIONS
const init = async (options) => {
  const pool = WorkerPool.pool(path.join(__dirname, './thread.js'), options);
  poolProxy = await pool.proxy();
  console.log(lcl.blue("[Pool - Info]"), `Pool initialized with ${pool.maxWorkers} workers.`);
}

const get = () => {
  return poolProxy
}

// EXPORTS
exports.init = init
exports.get = get